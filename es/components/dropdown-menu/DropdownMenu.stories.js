import * as React from 'react';
import Avatar from '../avatar/Avatar';
import Button from '../button/Button';
import Link from '../link/Link';
import Menu from '../menu/Menu';
import MenuItem from '../menu/MenuItem';
import MenuLinkItem from '../menu/MenuLinkItem';
import MenuSeparator from '../menu/MenuSeparator';
import MenuHeader from '../menu/MenuHeader';
import MenuToggle from './MenuToggle';
import PlainButton from '../plain-button/PlainButton';
import SubmenuItem from '../menu/SubmenuItem';
import DropdownMenu from './DropdownMenu';
import notes from './DropdownMenu.stories.md';
function generateClickHandler(message) {
  return event => {
    event.preventDefault();
    /* eslint-disable-next-line no-console */
    console.log(`${message} menu option selected`);
  };
}
export const basic = () => /*#__PURE__*/React.createElement(DropdownMenu, {
  isResponsive: true,
  onMenuOpen: () => {
    /* eslint-disable-next-line no-console */
    console.log('menu opened');
  },
  onMenuClose: () => {
    /* eslint-disable-next-line no-console */
    console.log('menu closed');
  }
}, /*#__PURE__*/React.createElement(PlainButton, {
  className: "dropdown-menu-example-button",
  type: "button"
}, /*#__PURE__*/React.createElement(MenuToggle, null, /*#__PURE__*/React.createElement(Avatar, {
  id: "123",
  name: "Jay Tee"
}))), /*#__PURE__*/React.createElement(Menu, null, /*#__PURE__*/React.createElement(MenuItem, {
  onClick: generateClickHandler('View Profile')
}, "View Profile"), /*#__PURE__*/React.createElement(MenuItem, {
  onClick: generateClickHandler('Help')
}, "Help"), /*#__PURE__*/React.createElement(MenuItem, {
  onClick: generateClickHandler('Should Not Fire This Handler'),
  isDisabled: true
}, "Disabled Option"), /*#__PURE__*/React.createElement(MenuSeparator, null), /*#__PURE__*/React.createElement(MenuLinkItem, null, /*#__PURE__*/React.createElement(Link, {
  href: "/logout-example-link",
  onClick: generateClickHandler('Log Out')
}, "Log Out"))));
export const withLinkMenu = () =>
/*#__PURE__*/
// When using `MenuToggle` in an element with the `lnk` class, the caret icon is automatically colored blue.
React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(PlainButton, {
  className: "lnk"
}, /*#__PURE__*/React.createElement(MenuToggle, null, "Hello")), /*#__PURE__*/React.createElement(Menu, null, /*#__PURE__*/React.createElement(MenuItem
/* eslint-disable-next-line no-console */, {
  onClick: () => console.log('hey')
}, "Menu Item")));
export const responsiveWithHeader = () => /*#__PURE__*/React.createElement(DropdownMenu, {
  isResponsive: true
}, /*#__PURE__*/React.createElement(PlainButton, {
  className: "dropdown-menu-example-button",
  type: "button"
}, /*#__PURE__*/React.createElement(MenuToggle, null, /*#__PURE__*/React.createElement(Button, null, "View in mobile"))), /*#__PURE__*/React.createElement(Menu, null, /*#__PURE__*/React.createElement(MenuHeader, {
  title: "Optional Title",
  subtitle: "Subtitle"
}), " ", /*#__PURE__*/React.createElement(MenuItem, null, "View Profile"), /*#__PURE__*/React.createElement(MenuItem, null, "Help"), /*#__PURE__*/React.createElement(MenuItem, {
  isDisabled: true
}, "Disabled Option"), /*#__PURE__*/React.createElement(MenuSeparator, null), /*#__PURE__*/React.createElement(SubmenuItem, null, "Submenu", /*#__PURE__*/React.createElement(Menu, null, /*#__PURE__*/React.createElement(MenuItem, null, "View Profile"), /*#__PURE__*/React.createElement(MenuItem, null, "Help"))), /*#__PURE__*/React.createElement(MenuItem, null, "Help")));
export default {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    notes
  }
};
//# sourceMappingURL=DropdownMenu.stories.js.map