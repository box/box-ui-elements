// @flow
import { ContentState, EditorState, Modifier, SelectionState } from 'draft-js';
import DraftMentionDecorator from './DraftMentionDecorator';

// returns data for first mention in a string
const getMentionFromText = (text: string) => {
    // RegEx.exec() is stateful, so we create a new regex instance each time
    const MENTION_REGEX = /([@＠﹫])\[([0-9]+):([^\]]+)]/gi;
    const matchArray = MENTION_REGEX.exec(text);
    if (!matchArray) return null;
    const [fullMatch, triggerSymbol, id, name] = matchArray;
    const start = matchArray.index;
    const end = start + fullMatch.length;
    const data = { id, name, content: `${triggerSymbol}${name}` };
    return { start, end, data };
};

// creates draftjs state with mentions parsed into entities
const createMentionSelectorState = (message: string = '') => {
    let contentState = ContentState.createFromText(message);
    let contentBlock = contentState.getFirstBlock();

    while (contentBlock != null) {
        const text = contentBlock.getText();
        const mention = text ? getMentionFromText(text) : null;
        if (mention == null) {
            contentBlock = contentState.getBlockAfter(contentBlock.getKey());
        } else {
            const { data, start, end } = mention;
            contentState.createEntity('MENTION', 'IMMUTABLE', data);
            const mentionEntityKey = contentState.getLastCreatedEntityKey();
            let mentionRange = SelectionState.createEmpty(contentBlock.getKey());
            mentionRange = mentionRange.merge({
                anchorOffset: start,
                focusOffset: end,
            });
            contentState = Modifier.replaceText(contentState, mentionRange, data.content, null, mentionEntityKey);
            contentBlock = contentState.getBlockForKey(contentBlock.getKey());
        }
    }
    const editorState = EditorState.createWithContent(contentState, DraftMentionDecorator);
    return editorState;
};

export default createMentionSelectorState;
