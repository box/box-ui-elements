/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import { ContentState, EditorState } from 'draft-js';
import DraftJSEditor from './DraftJSEditor';
import notes from './DraftJSEditor.stories.md';
import { DraftMentionDecorator } from '../form-elements/draft-js-mention-selector';
export const basic = () => {
  const initialEditorState = EditorState.createWithContent(ContentState.createFromText('Example'), DraftMentionDecorator);
  const [exampleExternalEditorState, setExampleExternalEditorState] = React.useState(initialEditorState);
  const setEditorState = newEditorState => setExampleExternalEditorState(newEditorState);
  return /*#__PURE__*/React.createElement(DraftJSEditor, {
    editorState: exampleExternalEditorState,
    hideLabel: false,
    inputProps: {},
    isDisabled: false,
    isRequired: true,
    label: "Draft.js Editor Example",
    description: "Description for screenReader users",
    onBlur: () => null,
    onChange: setEditorState,
    onFocus: () => null
  });
};
export default {
  title: 'Components/DraftJSEditor',
  component: DraftJSEditor,
  parameters: {
    notes
  }
};
//# sourceMappingURL=DraftJSEditor.stories.js.map