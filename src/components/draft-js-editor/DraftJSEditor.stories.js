// @flow
import * as React from 'react';
import { ContentState, EditorState } from 'draft-js';
import { State, Store } from '@sambego/storybook-state';
import { boolean } from '@storybook/addon-knobs';

import DraftJSEditor from './DraftJSEditor';
import notes from './DraftJSEditor.stories.md';
import { DraftMentionDecorator } from '../form-elements/draft-js-mention-selector';

export const basic = () => {
    const initialEditorState = EditorState.createWithContent(
        ContentState.createFromText('Example'),
        DraftMentionDecorator,
    );
    const componentStore = new Store({
        exampleExternalEditorState: initialEditorState,
    });

    const setEditorState = newEditorState => {
        componentStore.set({ exampleExternalEditorState: newEditorState });
    };

    return (
        <State store={componentStore}>
            {state => (
                <DraftJSEditor
                    editorState={state.exampleExternalEditorState}
                    hideLabel={boolean('hideLabel', false)}
                    inputProps={{}}
                    isDisabled={boolean('isDisabled', false)}
                    isRequired={boolean('isRequired', true)}
                    label="Draft.js Editor Example"
                    onBlur={() => null}
                    onChange={setEditorState}
                    onFocus={() => null}
                />
            )}
        </State>
    );
};

export default {
    title: 'Components|DraftJSEditor',
    component: DraftJSEditor,
    parameters: {
        notes,
    },
};
