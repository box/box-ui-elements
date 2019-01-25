### Description
This component requires a target component and a `<Menu>` component to be passed in as the only children.
It handles positioning the menu attached to the target on right click and global document click closing.

### Examples
**Simple Menu**
```js
// @NOTE (wyu): You can only use require instead of import in markdown.
const Menu = require('../menu').Menu;
const MenuItem = require('../menu').MenuItem;

<ContextMenu>
    <div className="context-menu-example-target">
        Target Component - right click me
    </div>
    <Menu>
        <MenuItem>
            View Profile
        </MenuItem>
        <MenuItem>
            Help
        </MenuItem>
    </Menu>
</ContextMenu>
```
**With Submenu**
```js
const Example = require('examples').ContextMenuWithSubmenuWithBoundariesElementExample;

<Example/>
```
