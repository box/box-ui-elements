`import DraftJSEditor from 'box-ui-elements/es/components/draft-js-editor/DraftJSEditor';`

This component exposes a [Draft][1] editor for use in box-ui-elements.
It was initially written for use with `es/components/form-elements`'s `<DraftJSMentionSelector />` components.

It doesn't own its own `editorState`. Any changes in the `<Editor />` cause the component's `onChange` method to be called with the new state.

Because `<DraftJSEditor />` doesn't own its `EditorState`, it doesn't have its own [decorator][2]. You assign the decorator wherever the `EditorState` lives.

[1]: https://draftjs.org
[2]: https://draftjs.org/docs/advanced-topics-decorators/#__docusaurus
