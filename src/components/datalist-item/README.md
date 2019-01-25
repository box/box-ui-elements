### Description
**Datalist Item (ARIA-compliant)**

This component renders a list item compatible with a datalist such as `SelectorDropdown`.
It handles creating a unique ID and propagating the ID up to the parent component when active.

When using this component with `SelectorDropdown`, it is important to specify keys
based on the data instead of the default index so state is reset properly.
