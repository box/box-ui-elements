// @flow
import { EditorState, Modifier } from 'draft-js';

export const UNEDITABLE_TIMESTAMP_TEXT = 'UNEDITABLE_TIMESTAMP_TEXT';

export type Mention = {
    blockID: string,
    end: number,
    mentionString: string,
    mentionTrigger: string,
    start: number,
};

const defaultMentionTriggers = ['@', '＠', '﹫'];
const defaultMentionTriggersString = defaultMentionTriggers.reduce((prev, current) => `${prev}\\${current}`, '');
const defaultMentionPattern = new RegExp(`([${defaultMentionTriggersString}])([^${defaultMentionTriggersString}]*)$`);

/**
 * Extracts the active mention from the editor state
 */
function getActiveMentionForEditorState(
    editorState: EditorState,
    mentionPattern: RegExp = defaultMentionPattern,
): Mention | null {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();

    const startKey = selectionState.getStartKey();
    const activeBlock = contentState.getBlockForKey(startKey);

    const cursorPosition = selectionState.getStartOffset();

    let result = null;

    // Break the active block into entity ranges.
    activeBlock.findEntityRanges(
        character => character.getEntity() === null,
        (start, end) => {
            // Find the active range (is the cursor inside this range?)
            if (start <= cursorPosition && cursorPosition <= end) {
                // Determine if the active range contains a mention.
                const activeRangeText = activeBlock.getText().substr(start, cursorPosition - start);
                const mentionMatch = activeRangeText.match(mentionPattern);

                if (mentionMatch) {
                    result = {
                        blockID: startKey,
                        mentionString: mentionMatch[2],
                        mentionTrigger: mentionMatch[1],
                        start: start + mentionMatch.index,
                        end: cursorPosition,
                    };
                }
            }

            return null;
        },
    );

    return result;
}

/**
 * Inserts a selected mention into the editor
 */
function addMention(editorState: EditorState, activeMention: Mention | null, mention: Object): EditorState {
    const { start, end } = activeMention || {};

    const { id, name } = mention;

    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();

    const preInsertionSelectionState = selectionState.merge({
        anchorOffset: start,
        focusOffset: end,
    });

    const textToInsert = `@${name}`;

    const contentStateWithEntity = contentState.createEntity('MENTION', 'IMMUTABLE', { id });

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const contentStateWithLink = Modifier.replaceText(
        contentState,
        preInsertionSelectionState,
        textToInsert,
        null,
        entityKey,
    );

    const spaceOffset = preInsertionSelectionState.getStartOffset() + textToInsert.length;
    const selectionStateForAddingSpace = preInsertionSelectionState.merge({
        anchorOffset: spaceOffset,
        focusOffset: spaceOffset,
    });

    const contentStateWithLinkAndExtraSpace = Modifier.insertText(
        contentStateWithLink,
        selectionStateForAddingSpace,
        ' ',
    );

    const editorStateWithLink = EditorState.push(editorState, contentStateWithLinkAndExtraSpace, 'change-block-type');

    return editorStateWithLink;
}

/**
 * Formats the editor's text such that it will be accepted by the server.
 */
function getFormattedCommentText(editorState: EditorState): { hasMention: boolean, text: string } {
    const contentState = editorState.getCurrentContent();
    const blockMap = contentState.getBlockMap();

    const resultStringArr = [];

    // The API needs to explicitly know if a message contains a mention.
    let hasMention = false;

    // For all ContentBlocks in the ContentState:
    blockMap.forEach(block => {
        const text = block.getText();
        const blockMapStringArr = [];

        // Break down the ContentBlock into ranges
        block.findEntityRanges(
            () => true,
            (start, end) => {
                const entityKey = block.getEntityAt(start);
                // If the range is an Entity, check its type:
                // - MENTION entities: format as "@[id:text]" and set hasMention
                // - TIMESTAMP entities: add raw text as-is
                // - Other entities (LINK, etc.): add raw text as-is
                if (entityKey) {
                    const entity = contentState.getEntity(entityKey);
                    const isMention = entity.getType() === 'MENTION';

                    if (isMention) {
                        const stringToAdd = `@[${entity.getData().id}:${text.substring(start + 1, end)}]`;
                        blockMapStringArr.push(stringToAdd);
                        hasMention = true;
                    } else {
                        // For timestamp and other entity types, add the raw text
                        blockMapStringArr.push(text.substring(start, end));
                    }
                } else {
                    blockMapStringArr.push(text.substring(start, end));
                }
            },
        );
        resultStringArr.push(blockMapStringArr.join(''));
    });

    // Concatenate the array of block strings with newlines
    // (Each block represents a paragraph)
    return { text: resultStringArr.join('\n'), hasMention };
}

export {
    addMention,
    defaultMentionTriggers,
    defaultMentionPattern,
    getActiveMentionForEditorState,
    getFormattedCommentText,
};
