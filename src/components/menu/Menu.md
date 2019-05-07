### Description

**Menu (ARIA-compliant)**
This component is used to render a ARIA-compliant menu.
The component handles adding aria attributes, keyboard navigation, and focus.

The `<MenuLinkItem>` component is required to wrap anchor tags since there are special ARIA rules for those.
The `<SelectMenuLinkItem>` component is for items that can be selected with a checkmark.

Following the following standards: [WAI-ARIA Menu](https://www.w3.org/TR/wai-aria-practices-1.1/#menu)

### Examples

**Basic Menu**

```js
const Menu = require('box-ui-elements/es/components/menu').Menu;
const MenuItem = require('box-ui-elements/es/components/menu').MenuItem;
const MenuSeparator = require('box-ui-elements/es/components/menu')
  .MenuSeparator;
const MenuLinkItem = require('box-ui-elements/es/components/menu').MenuLinkItem;
const MenuSectionHeader = require('box-ui-elements/es/components/menu')
  .MenuSectionHeader;

<Menu>
  <MenuItem>View Profile</MenuItem>
  <MenuItem showRadar>Help</MenuItem>
  <MenuSeparator />
  <MenuSectionHeader>Menu Section</MenuSectionHeader>
  <MenuLinkItem>
    <Link href="/#">Awesome Link</Link>
  </MenuLinkItem>
</Menu>;
```

**Submenu**

```js
const MenuItem = require('box-ui-elements/es/components/menu').MenuItem;
const SubmenuItem = require('box-ui-elements/es/components/menu').SubmenuItem;

<div style={{ maxWidth: '220px' }}>
  <Menu>
    <MenuItem>View Profile</MenuItem>
    <SubmenuItem>
      Submenu
      <Menu>
        <MenuItem>View Profile</MenuItem>
        <MenuItem>Help</MenuItem>
      </Menu>
    </SubmenuItem>
    <MenuItem>Help</MenuItem>
  </Menu>
</div>;
```

**Submenu Flip**

```js
const MenuItem = require('box-ui-elements/es/components/menu').MenuItem;
const SubmenuItem = require('box-ui-elements/es/components/menu').SubmenuItem;

<div style={{ maxWidth: '220px' }}>
  <Menu>
    <MenuItem>View Profile</MenuItem>
    <SubmenuItem>
      Submenu
      <Menu>
        <MenuItem>View Profile</MenuItem>
        <MenuItem>Help</MenuItem>
        <MenuItem>Help</MenuItem>
      </Menu>
    </SubmenuItem>
    <MenuItem>Help</MenuItem>
  </Menu>
</div>;
```

**Select Menu**

```
const Menu = require('box-ui-elements/es/components/menu').Menu;
const MenuItem = require('box-ui-elements/es/components/menu').MenuItem;
const MenuSeparator = require('box-ui-elements/es/components/menu').MenuSeparator;
const MenuLinkItem = require('box-ui-elements/es/components/menu').MenuLinkItem;

<Menu>
    <SelectMenuLinkItem isSelected>
        <Link href="#">View Profile</Link>
    </SelectMenuLinkItem>
    <SelectMenuLinkItem>
        <Link href="#">Awesome Link</Link>
    </SelectMenuLinkItem>
</Menu>
```

**Menu with new child when window is resized to < 700px**

```js
const Menu = require('box-ui-elements/es/components/menu').Menu;
const MenuItem = require('box-ui-elements/es/components/menu').MenuItem;

class MenuWithChildOnResize extends React.Component {
  constructor() {
    super();
    this.state = { isLargeMenu: false };
    this.setVisibility = this.setVisibility.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.setVisibility);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setVisibility);
  }

  setVisibility() {
    if (window.innerWidth < 700 && !this.state.isLargeMenu) {
      this.setState({ isLargeMenu: true });
    }
  }

  render() {
    return (
      <Menu>
        <MenuItem>View Profile</MenuItem>
        <MenuItem>Help</MenuItem>
        {this.state.isLargeMenu && <MenuItem>Visible on Resize</MenuItem>}
        <MenuItem>Last Item</MenuItem>
      </Menu>
    );
  }
}
<MenuWithChildOnResize />;
```

### Possible Enhancements (not planned yet)

- Jump to option via keyboard (i.e. 'a' jumps to first option that starts with 'a')
- Menu with checkbox - role="menuitemcheckbox"
- Menu with radio buttons - role="menuitemradio"
- Menu Navigation Bars (we don't have any instances of this though) - role="menubar"
