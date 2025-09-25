// @flow
import { ContentState, EditorState, Modifier, SelectionState } from 'draft-js';
import DraftMentionDecorator from './DraftMentionDecorator';
import { UNEDITABLE_TIMESTAMP_TEXT } from './utils';
import { convertMillisecondsToHMMSS } from '../../../utils/timestamp';

type timestampData = {
    timestampInMilliseconds: number,
    fileVersionId: string,
    content: string,
};

type mentionData = {
    id: string,
    name: string,
    content: string,
};

type timestampResult = {
    start: number,
    end: number,
    data: timestampData,
} | null;

type mentionResult = {
    start: number,
    end: number,
    data: mentionData,
} | null;

// returns data for first mention in a string
const getMentionFromText = (text: string): mentionResult => {
    // RegEx.exec() is stateful, so we create a new regex instance each time
    const mentionRegex = /([@＠﹫])\[(\d+):([^\]]+)]/gi;
    const matchArray = mentionRegex.exec(text);
    if (!matchArray) {
        return null;
    }
    const [fullMatch, triggerSymbol, id, name] = matchArray;
    const start = matchArray.index;
    const end = start + fullMatch.length;
    const data = { id, name, content: `${triggerSymbol}${name}` };
    return { start, end, data };
};

const getTimestampFromText = (text: string): timestampResult => {
    const timestampRegex = /#\[timestamp:(\d+),versionId:(\d+)\]/;
    const matchArray = text.match(timestampRegex);
    if (!matchArray) {
        return null;
    }
    const [fullMatch, timestamp, versionId] = matchArray;

    const timestampInMilliseconds = parseInt(timestamp, 10);
    const timestampToDisplay = convertMillisecondsToHMMSS(timestampInMilliseconds);
    const start = text.indexOf(fullMatch);
    const end = start + fullMatch.length;
    const data = {
        timestampInMilliseconds,
        fileVersionId: versionId,
        content: timestampToDisplay,
    };
    return { start, end, data };
};

// processes timestamp entity and updates content state
const processTimestampEntity = (
    contentState: ContentState,
    contentBlock: any,
    timestamp: timestampResult,
): ContentState => {
    if (!timestamp) {
        return contentState;
    }
    const { data, start, end } = timestamp;
    const contentStateWithEntity = contentState.createEntity(UNEDITABLE_TIMESTAMP_TEXT, 'IMMUTABLE', data);
    const timestampEntityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const timestampRange = SelectionState.createEmpty(contentBlock.getKey()).merge({
        anchorOffset: start,
        focusOffset: end,
    });
    return Modifier.replaceText(contentStateWithEntity, timestampRange, data.content, null, timestampEntityKey);
};

// creates draftjs state with mentions parsed into entities
const createMentionTimestampSelectorState = (message: string = ''): EditorState => {
    let contentState = ContentState.createFromText(message);
    let contentBlock = contentState.getFirstBlock();

    while (contentBlock != null) {
        const text = contentBlock.getText();
        const mention = text ? getMentionFromText(text) : null;
        const timestamp = text ? getTimestampFromText(text) : null;

        // Process timestamp if present
        if (timestamp) {
            contentState = processTimestampEntity(contentState, contentBlock, timestamp);
            contentBlock = contentState.getBlockForKey(contentBlock.getKey());
        } else if (mention) {
            const { data, start, end } = mention;
            contentState.createEntity('MENTION', 'IMMUTABLE', data);
            const mentionEntityKey = contentState.getLastCreatedEntityKey();
            const mentionRange = SelectionState.createEmpty(contentBlock.getKey()).merge({
                anchorOffset: start,
                focusOffset: end,
            });
            contentState = Modifier.replaceText(contentState, mentionRange, data.content, null, mentionEntityKey);
            contentBlock = contentState.getBlockForKey(contentBlock.getKey());
        } else if (!timestamp && !mention) {
            // No mention found, move to next block
            contentBlock = contentState.getBlockAfter(contentBlock.getKey());
        }
    }
    return EditorState.createWithContent(contentState, DraftMentionDecorator);
};

export default createMentionTimestampSelectorState;
