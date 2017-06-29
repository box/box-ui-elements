## Dropdown Menus (ARIA-compliant)

This component is used to render a ARIA-compliant menu.
The component handles adding aria attributes, keyboard navigation, and focus.

The `<MenuLinkItem>` component is required to wrap anchor tags since there are special ARIA rules for those.

Following the following standards: [WAI-ARIA Menu](https://www.w3.org/TR/wai-aria-practices-1.1/#menu)

### Usage
```js
    import { Link } from 'box-react-ui-core';
    import { Menu, MenuItem, MenuSeparator, MenuLinkItem } from 'box-react-ui-overlays';

    ...

    <Menu>
        <MenuItem onClick={ ... }>View Profile</MenuItem>
        <MenuItem onClick={ ... }>Help</MenuItem>
        <MenuSeparator />
        <MenuLinkItem>
            <Link href="/awesome">Awesome Link</Link>
        </MenuLinkItem>
    </Menu>

```

#### Options
- **`initialFocusIndex: number` [optional]**: `0` - Focuses a specific menu item index when menu is mounted
- **`onClose: function` [optional]**: Will fire this callback when menu should "close'

#### Possible Enhancements (not planned yet)
- Jump to option via keyboard (i.e. 'a' jumps to first option that starts with 'a')
- Menu with checkbox - role="menuitemcheckbox"
- Menu with radio buttons - role="menuitemradio"
- Menu Navigation Bars (we don't have any instances of this though) - role="menubar"
