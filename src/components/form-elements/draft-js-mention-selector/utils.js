// @flow
import { EditorState, Modifier } from 'draft-js';

export type Mention = {
    blockID: string,
    end: number,
    mentionString: string,
    mentionTrigger: string,
    start: number,
};

const defaultMentionTriggers = ['@', '＠', '﹫'].reduce((prev, current) => `${prev}\\${current}`, '');
const defaultMentionPattern = new RegExp(`([${defaultMentionTriggers}])([^${defaultMentionTriggers}]*)$`);

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

export { addMention, defaultMentionPattern, getActiveMentionForEditorState };
