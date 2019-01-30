### Description
This component required a "button" component and a `<Menu>` component to be passed in as the only children.
This component handles keyboard navigation, focus states, and global document click closing.

Following the following standards: [WAI-ARIA Menu Buttons](https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton)

### Examples
**Simple Menu**
```js
// @NOTE: You can only use require instead of import in markdown.
const Menu = require('../menu').Menu;
const MenuItem = require('../menu').MenuItem;
const MenuLinkItem = require('../menu').MenuLinkItem;
const MenuSeparator = require('../menu').MenuSeparator;
const MenuToggle = require('./MenuToggle').default;

function generateClickHandler(message) {
    return event => {
        event.preventDefault();

        console.log(`${message} menu option selected`);
    };
}
<DropdownMenu onMenuOpen={ () => { console.log('menu opened'); } }>
    <PlainButton
        className="dropdown-menu-example-button"
        type="button"
    >
        <MenuToggle>
            <Avatar id="123" name="Jay Tee" />
        </MenuToggle>
    </PlainButton>
    <Menu>
        <MenuItem onClick={ generateClickHandler('View Profile') }>
            View Profile
        </MenuItem>
        <MenuItem onClick={ generateClickHandler('Help') }>
            Help
        </MenuItem>
        <MenuItem
            onClick={ generateClickHandler('Should Not Fire This Handler') }
            isDisabled
        >
            Disabled Option
        </MenuItem>
        <MenuSeparator />
        <MenuLinkItem>
            <Link
                href="/logout-example-link"
                onClick={ generateClickHandler('Log Out') }
            >
                Log Out
            </Link>
        </MenuLinkItem>
    </Menu>
</DropdownMenu>
```

**Link Menu**

When using `MenuToggle` in an element with the `lnk` class, the caret icon is automatically colored blue.

```js
const Menu = require('../menu').Menu;
const MenuItem = require('../menu').MenuItem;
const MenuLinkItem = require('../menu').MenuLinkItem;
const MenuSeparator = require('../menu').MenuSeparator;
const MenuToggle = require('./MenuToggle').default;

<DropdownMenu>
    <PlainButton className="lnk">
        <MenuToggle>
            Hello
        </MenuToggle>
    </PlainButton>
    <Menu>
        <MenuItem onClick={ () => console.log('hey') }>
            Menu item
        </MenuItem>
    </Menu>
</DropdownMenu>
```
