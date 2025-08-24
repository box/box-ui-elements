import { convertFromRaw, ContentState, EditorState } from 'draft-js';
import { addMention, getActiveMentionForEditorState, getFormattedCommentText } from '../utils';

const noMentionEditorState = EditorState.createWithContent(ContentState.createFromText('No mention here'));
const oneMentionEditorState = EditorState.createWithContent(ContentState.createFromText('Hey @foo'));
const twoMentionEditorState = EditorState.createWithContent(ContentState.createFromText('Hi @foo, meet @bar'));
// one string beginning with "@"
const oneMentionSelectionState = oneMentionEditorState.getSelection().merge({
    anchorOffset: 8,
    focusOffset: 8,
});
// two strings beginning with "@"
const twoMentionSelectionState = twoMentionEditorState.getSelection().merge({
    anchorOffset: 18,
    focusOffset: 18,
});
// two strings beginning "@", cursor inside one
const twoMentionSelectionStateCursorInside = twoMentionEditorState.getSelection().merge({
    anchorOffset: 17,
    focusOffset: 17,
});
const oneMentionExpectedMention = {
    mentionString: 'foo',
    mentionTrigger: '@',
    start: 4,
    end: 8,
};
const twoMentionExpectedMention = {
    mentionString: 'bar',
    mentionTrigger: '@',
    start: 14,
    end: 18,
};
const twoMentionCursorInsideExpectedMention = {
    mentionString: 'ba',
    mentionTrigger: '@',
    start: 14,
    end: 17,
};

describe('components/form-elements/draft-js-mention-selector/utils', () => {
    describe('getActiveMentionForEditorState()', () => {
        test.each`
            input                     | editorState
            ${'input is empty'}       | ${EditorState.createEmpty()}
            ${'input has no mention'} | ${noMentionEditorState}
        `('should return null if $input', ({ editorState }) => {
            expect(getActiveMentionForEditorState(editorState)).toBeNull();
        });

        test('should return null when cursor is not over a mention', () => {
            const editorState = oneMentionEditorState;
            const selectionStateAtBeginning = editorState.getSelection().merge({
                anchorOffset: 0,
                focusOffset: 0,
            });

            const editorStateWithForcedSelection = EditorState.acceptSelection(editorState, selectionStateAtBeginning);

            const result = getActiveMentionForEditorState(editorStateWithForcedSelection);

            expect(result).toBeNull();
        });

        test.each`
            editorState              | selectionState                          | expected
            ${oneMentionEditorState} | ${oneMentionSelectionState}             | ${oneMentionExpectedMention}
            ${twoMentionEditorState} | ${twoMentionSelectionState}             | ${twoMentionExpectedMention}
            ${twoMentionEditorState} | ${twoMentionSelectionStateCursorInside} | ${twoMentionCursorInsideExpectedMention}
        `('should return the selected mention when it is selected', ({ editorState, selectionState, expected }) => {
            const editorStateWithForcedSelection = EditorState.acceptSelection(editorState, selectionState);

            const result = getActiveMentionForEditorState(editorStateWithForcedSelection);

            Object.keys(expected).forEach(key => {
                expect(result[key]).toEqual(expected[key]);
            });
        });
    });

    describe('addMention()', () => {
        test('should return updated string (plus space)', () => {
            const mention = { id: 1, name: 'Fool Name' };

            const editorStateWithLink = addMention(oneMentionEditorState, oneMentionExpectedMention, mention);

            expect(editorStateWithLink.getCurrentContent().getPlainText()).toEqual('Hey @Fool Name ');
        });
    });

    describe('getFormattedCommentText()', () => {
        const rawContentNoEntities = {
            blocks: [
                {
                    text: 'Hey there',
                    type: 'unstyled',
                    entityRanges: [],
                },
            ],
            entityMap: {
                first: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                },
            },
        };

        const rawContentEntityWithTimestamp = {
            blocks: [
                {
                    text: '10:00:00 comment timestamp`',
                    type: 'unstyled',
                    entityRanges: [{ offset: 0, length: 10, key: 'first' }],
                },
            ],
            entityMap: {
                first: {
                    type: 'UNEDITABLE_TIMESTAMP_TEXT',
                    mutability: 'IMMUTABLE',
                },
            },
        };

        const rawContentOneEntity = {
            blocks: [
                {
                    text: 'Hey @Becky',
                    type: 'unstyled',
                    entityRanges: [{ offset: 4, length: 6, key: 'first' }],
                },
            ],
            entityMap: {
                first: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                    data: { id: 1 },
                },
            },
        };

        const rawContentTwoEntities = {
            blocks: [
                {
                    text: 'I hung out with @Becky and @Shania',
                    type: 'unstyled',
                    entityRanges: [
                        { offset: 16, length: 6, key: 'first' },
                        { offset: 27, length: 7, key: 'second' },
                    ],
                },
            ],
            entityMap: {
                first: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                    data: { id: 1 },
                },
                second: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                    data: { id: 2 },
                },
            },
        };

        const rawContentTwoEntitiesOneLineBreak = {
            blocks: [
                {
                    text: 'I hung out with @Becky and',
                    type: 'unstyled',
                    entityRanges: [{ offset: 16, length: 6, key: 'first' }],
                },
                {
                    text: '@Shania yesterday',
                    type: 'unstyled',
                    entityRanges: [{ offset: 0, length: 7, key: 'second' }],
                },
            ],
            entityMap: {
                first: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                    data: { id: 1 },
                },
                second: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                    data: { id: 2 },
                },
            },
        };

        const rawContentEntityWithTimestampAndMention = {
            blocks: [
                {
                    text: '10:00:00 comment timestamp` @Becky',
                    type: 'unstyled',
                    entityRanges: [
                        { offset: 0, length: 10, key: 'first' },
                        { offset: 28, length: 6, key: 'second' },
                    ],
                },
            ],
            entityMap: {
                first: {
                    type: 'UNEDITABLE_TIMESTAMP_TEXT',
                    mutability: 'IMMUTABLE',
                },
                second: {
                    type: 'MENTION',
                    mutability: 'IMMUTABLE',
                    data: { id: 1 },
                },
            },
        };

        // Test cases in order
        // no entities in the editor
        // one entity in the editor
        // two entities in the editor
        // two entities and a linebreak in the editor
        test.each`
            rawContent                                 | expected
            ${rawContentNoEntities}                    | ${{ text: 'Hey there', hasMention: false }}
            ${rawContentOneEntity}                     | ${{ text: 'Hey @[1:Becky]', hasMention: true }}
            ${rawContentTwoEntities}                   | ${{ text: 'I hung out with @[1:Becky] and @[2:Shania]', hasMention: true }}
            ${rawContentTwoEntitiesOneLineBreak}       | ${{ text: 'I hung out with @[1:Becky] and\n@[2:Shania] yesterday', hasMention: true }}
            ${rawContentEntityWithTimestamp}           | ${{ text: '10:00:00 comment timestamp`', hasMention: false }}
            ${rawContentEntityWithTimestampAndMention} | ${{ text: '10:00:00 comment timestamp` @[1:Becky]', hasMention: true }}
        `('should return the correct result', ({ rawContent, expected }) => {
            const blocks = convertFromRaw(rawContent);

            const dummyEditorState = EditorState.createWithContent(blocks);

            expect(getFormattedCommentText(dummyEditorState)).toEqual(expected);
        });
    });
});
