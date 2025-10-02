import * as React from 'react';
import Menu from '../menu/Menu';
import MenuItem from '../menu/MenuItem';
import ContextMenu from './ContextMenu';
import notes from './ContextMenu.stories.md';
import ContextMenuWithSubmenuExample from './ContextMenuWithSubmenuExample';
import './ContextMenuExample.scss';
export const basic = () => /*#__PURE__*/React.createElement(ContextMenu, null, /*#__PURE__*/React.createElement("div", {
  className: "context-menu-example-target"
}, "Target Component - right click me"), /*#__PURE__*/React.createElement(Menu, null, /*#__PURE__*/React.createElement(MenuItem, null, "View Profile"), /*#__PURE__*/React.createElement(MenuItem, null, "Help")));
export const withSubmenu = () => /*#__PURE__*/React.createElement(ContextMenuWithSubmenuExample, null);
export default {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  parameters: {
    notes
  }
};
//# sourceMappingURL=ContextMenu.stories.js.map