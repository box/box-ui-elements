### Introduction
`<DraftJSMentionSelector />` is like `<MentionSelector />`,
except the underlying text editor is implemented
using [Draft][1] instead of our handrolled `<ContentEditable />`.
It borrows its structure from its predecessor.
The component hierarchy from topmost to bottommost is:

- `box-ui-elements/es/components/form-elements/draft-js-mention-selector`
- `box-ui-elements/es/components/draft-js-editor`

[1]: https://draftjs.org

### Draft for Newbies

- Everything in Draft is immutable.
    - If you want to change `EditorState`, you have to instantiate a new `EditorState`, which you propagate with nested `onChange` handlers up to wherever the state can be mutated.
    - `<DraftJSEditor />` has an `onChange` prop which it passes into its actual DraftJS `<Editor />` component.
    `<DraftJSEditor/>` gets its onChange prop from `box-ui-elements/es/components/form-elements/draft-js-mention-selector` and this is the only one which has `EditorState` as state - its descendents have `EditorState` as a prop.
- The `EditorState` represents the overall state of an editor.
    - An `EditorState` contains a stack of `ContentState` objects. You can undo, redo etc through this stack.
    - A `ContentState` represents the content of the editor and the selection position.
    - A `ContentState` contains an `OrderedMap` of `ContentBlock` objects.
    Think of a "ContentBlock" as being like a paragraph.

- There are two key concepts re: rich styling text in Draft - `Entity` and `DraftDecorator`
    - `Entity`
        - A way of annotating a range of text with metadata.
        We create our `Mention` entity in `DraftJSMentionSelector`.
        We create it with `contentState.createEntity()` (where `contentState` is the current `ContentState`), and then replace the partial mention (eg "@se") with the entity-ified full mention (eg "@Sebastian Motraghi") using `Modifier.replaceText(…)` to create a new `ContentState`.
        - Our Mention entity has its "id" metadata set.
    - `Decorator`
        - Scans the text and decides which ranges of text should be rendered in a special way.
        - We apply the mentionDecorator when we create our initial EditorState.
        Ranges of text that satisfy the mentionStrategy are displayed as components.
            - The component can have whatever attributes you want, but __DON'T SET ITS TEXT FROM A PROP__.
            The decorator will set the children prop to the actual text contents you're interested in.
            Your component should look like `<foo>{ props.children }</foo>`, not `<foo>{ props.text }</foo>`, or else the rendered state won't match the internal state.
        - Strategies can be more or less complex, but our mentionStrategy just checks if an Entity is annotated as being a "MENTION".

### Restoring Editor State

Use `createMentionTimestampSelector(tagged_message)` instead of `EditorState.createFromContent()` when restoring content that already contains mentions.

This will parse the tagged message and create `type: MENTION` or `type: UNEDITABLE_TIMESTAMP_TEXT` entities. It returns an EditorState instance.

### Examples

```
const DraftJSMentionSelectorExamples = require('examples').DraftJSMentionSelectorExamples;

<DraftJSMentionSelectorExamples />
```
