## Dropdown Menus (ARIA-compliant)

This component required a "button" component and a `<Menu>` component to be passed in as the only children.
This component handles keyboard navigation, focus states, and global document click closing.

Following the following standards: [WAI-ARIA Menu Buttons](https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton)

### Usage
```js
    import { Button } from 'box-react-ui-core';
    import { Menu, MenuItem } from 'box-react-ui-overlays';

    ...

    <DropdownMenu>
        <Button className='buik-dropdown-menu-example-button' type='button'>
            Push Me
        </Button>
        <Menu>
            <MenuItem onClick={ ... }>View Profile</MenuItem>
            <MenuItem onClick={ ... }>Help</MenuItem>
        </Menu>
    </DropdownMenu>

```

#### Options
- **`constrainToScrollParent: bool` [optional]**: default: `false` - Forces menu to render within the scroll parent
- **`constrainToWindow: bool` [optional]**: default: `false` - Forces menu to render within the visible window
- **`isRightAligned: bool` [optional]**: default: `false` - Right aligns menu to button
