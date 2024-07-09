### Description

**Menu (ARIA-compliant)**
This component is used to render a ARIA-compliant menu.
The component handles adding aria attributes, keyboard navigation, and focus.

The `<MenuLinkItem>` component is required to wrap anchor tags since there are special ARIA rules for those.
The `<SelectMenuLinkItem>` component is for items that can be selected with a checkmark.

Following the following standards: [WAI-ARIA Menu](https://www.w3.org/TR/wai-aria-1.1/#menu)

### Examples

```
const Menu = require('box-ui-elements/es/components/menu').Menu;

<Menu>
    <SelectMenuLinkItem isSelected>
        <Link href="#">View Profile</Link>
    </SelectMenuLinkItem>
    <SelectMenuLinkItem>
        <Link href="#">Awesome Link</Link>
    </SelectMenuLinkItem>
</Menu>
```
