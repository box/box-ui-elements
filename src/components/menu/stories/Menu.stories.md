`import Menu from 'box-ui-elements/es/components/menu';`

The `<Menu>` component is used to render a ARIA-compliant menu. It handles adding ARIA attributes, keyboard navigation,
and focus.
The `<MenuLinkItem>` component is required to wrap anchor tags since there are special ARIA rules for those.
The `<SelectMenuLinkItem>` component is for items that can be selected with a checkmark.

These components are compliant with the [WAI-ARIA Menu standards](https://www.w3.org/TR/wai-aria-practices-1.1/#menu).

### Possible Enhancements (not planned yet)

- Jump to option via keyboard (i.e. 'a' jumps to first option that starts with 'a')
- Menu with checkbox - role="menuitemcheckbox"
- Menu with radio buttons - role="menuitemradio"
- Menu Navigation Bars (we don't have any instances of this though) - role="menubar"
