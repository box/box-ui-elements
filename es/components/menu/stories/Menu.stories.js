import * as React from 'react';
import Link from '../../link/Link';
import MenuItem from '../MenuItem';
import MenuLinkItem from '../MenuLinkItem';
import MenuSectionHeader from '../MenuSectionHeader';
import MenuSeparator from '../MenuSeparator';
import SelectMenuLinkItem from '../SelectMenuLinkItem';
import SubmenuItem from '../SubmenuItem';
import Menu from '../Menu';
import notes from './Menu.stories.md';
export const basic = () => /*#__PURE__*/React.createElement(Menu, null, /*#__PURE__*/React.createElement(MenuItem, null, "View Profile"), /*#__PURE__*/React.createElement(MenuItem, {
  showRadar: true
}, "Help"), /*#__PURE__*/React.createElement(MenuSeparator, null), /*#__PURE__*/React.createElement(MenuSectionHeader, null, "Menu Section"), /*#__PURE__*/React.createElement(MenuLinkItem, null, /*#__PURE__*/React.createElement(Link, {
  href: "/#"
}, "Awesome Link")));
export const withSubmenu = () => /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: '220px'
  }
}, /*#__PURE__*/React.createElement(Menu, null, /*#__PURE__*/React.createElement(MenuItem, null, "View Profile"), /*#__PURE__*/React.createElement(SubmenuItem, null, "Submenu", /*#__PURE__*/React.createElement(Menu, null, /*#__PURE__*/React.createElement(MenuItem, null, "View Profile"), /*#__PURE__*/React.createElement(MenuItem, null, "Help"))), /*#__PURE__*/React.createElement(MenuItem, null, "Help")));
export const withSubmenuFlip = () => /*#__PURE__*/React.createElement("div", {
  style: {
    maxWidth: '220px'
  }
}, /*#__PURE__*/React.createElement(Menu, null, /*#__PURE__*/React.createElement(MenuItem, null, "View Profile"), /*#__PURE__*/React.createElement(SubmenuItem, null, "Submenu", /*#__PURE__*/React.createElement(Menu, null, /*#__PURE__*/React.createElement(MenuItem, null, "View Profile"), /*#__PURE__*/React.createElement(MenuItem, null, "Help"), /*#__PURE__*/React.createElement(MenuItem, null, "Help"))), /*#__PURE__*/React.createElement(MenuItem, null, "Help")));
export const withSelectMenu = () => /*#__PURE__*/React.createElement(Menu, null, /*#__PURE__*/React.createElement(SelectMenuLinkItem, {
  isSelected: true
}, /*#__PURE__*/React.createElement(Link, {
  href: "http://opensource.box.com/box-ui-elements/storybook"
}, "View Profile")), /*#__PURE__*/React.createElement(SelectMenuLinkItem, null, /*#__PURE__*/React.createElement(Link, {
  href: "http://opensource.box.com/box-ui-elements/storybook"
}, "Awesome Link")));
export const withChildOnResize = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isLargeMenu, setIsLargeMenu] = React.useState(true);
  const setVisibility = () => {
    if (window.innerWidth < 700 && !isLargeMenu) {
      setIsLargeMenu(true);
    }
  };
  window.addEventListener('resize', setVisibility);
  return /*#__PURE__*/React.createElement(Menu, null, /*#__PURE__*/React.createElement(MenuItem, null, "View Profile"), /*#__PURE__*/React.createElement(MenuItem, null, "Help"), isLargeMenu && /*#__PURE__*/React.createElement(MenuItem, null, "Visible on Resize"), /*#__PURE__*/React.createElement(MenuItem, null, "Last Item"));
};
export default {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Menu.stories.js.map