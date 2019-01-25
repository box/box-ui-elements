### Description

This component requires a selector component (input text field or wrapper containing an input)
that receives `inputProps` as a prop and spreads it onto the `input` element.
It renders the specified children as options in a dropdown.

The component handles opening and closing the dropdown, updating the active option,
keyboard handling, and aria attributes necessary for a [combobox widget](https://www.w3.org/TR/wai-aria/roles#combobox).

### Examples
```
const SelectorDropdownExamples = require('examples').SelectorDropdownExamples;

<SelectorDropdownExamples />
```
