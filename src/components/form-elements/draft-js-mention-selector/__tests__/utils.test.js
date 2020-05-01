import { ContentState, EditorState } from 'draft-js';
import { addMention, getActiveMentionForEditorState } from '../utils';

const noMentionEditorState = EditorState.createWithContent(ContentState.createFromText('No mention here'));
const oneMentionEditorState = EditorState.createWithContent(ContentState.createFromText('Hey @foo'));
const twoMentionEditorState = EditorState.createWithContent(ContentState.createFromText('Hi @foo, meet @bar'));
const oneMentionSelectionState = oneMentionEditorState.getSelection().merge({
    anchorOffset: 8,
    focusOffset: 8,
});
const twoMentionSelectionState = twoMentionEditorState.getSelection().merge({
    anchorOffset: 18,
    focusOffset: 18,
});
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

describe('components/form-elements/draft-js-mention-selector/DraftJSMentionSelector', () => {
    describe('getActiveMentionForEditorState()', () => {
        // TESTS
        [
            // empty input
            {
                editorState: EditorState.createEmpty(),
            },
            // input has ne mention
            {
                editorState: noMentionEditorState,
            },
        ].forEach(({ editorState }) => {
            test('should return null', () => {
                expect(getActiveMentionForEditorState(editorState)).toBeNull();
            });
        });

        [
            // one string beginning with "@"
            {
                editorState: oneMentionEditorState,
                selectionState: oneMentionSelectionState,
                expected: oneMentionExpectedMention,
            },
            // two strings beginning with "@"
            {
                editorState: twoMentionEditorState,
                selectionState: twoMentionSelectionState,
                expected: twoMentionExpectedMention,
            },
            // two strings beginning "@", cursor inside one
            {
                editorState: twoMentionEditorState,
                selectionState: twoMentionSelectionStateCursorInside,
                expected: twoMentionCursorInsideExpectedMention,
            },
        ].forEach(({ editorState, selectionState, expected }) => {
            test('should return null when cursor is not over a mention', () => {
                const selectionStateAtBeginning = editorState.getSelection().merge({
                    anchorOffset: 0,
                    focusOffset: 0,
                });

                const editorStateWithForcedSelection = EditorState.acceptSelection(
                    editorState,
                    selectionStateAtBeginning,
                );

                const result = getActiveMentionForEditorState(editorStateWithForcedSelection);

                expect(result).toBeNull();
            });

            test('should return the selected mention when it is selected', () => {
                const editorStateWithForcedSelection = EditorState.acceptSelection(editorState, selectionState);

                const result = getActiveMentionForEditorState(editorStateWithForcedSelection);

                Object.keys(expected).forEach(key => {
                    expect(result[key]).toEqual(expected[key]);
                });
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
});
