/* eslint-disable */
import * as React from 'react';
import { action } from 'storybook/actions';
import NavSidebar from './NavSidebar';
import NavListCollapseHeader from './NavListCollapseHeader';
import NavList from './NavList';
import Link from '../link/Link';
import notes from './NavSidebar.stories.md';
export const notCollapsible = () => /*#__PURE__*/React.createElement(NavSidebar, {
  "data-resin-component": "leftnav"
}, /*#__PURE__*/React.createElement(NavList, null, /*#__PURE__*/React.createElement(Link, null, "Item 1-1"), /*#__PURE__*/React.createElement(Link, null, "Item 1-2")), /*#__PURE__*/React.createElement(NavList, {
  heading: "Item 2"
}, /*#__PURE__*/React.createElement(Link, null, "Item 2-1"), /*#__PURE__*/React.createElement(Link, null, "Item 2-2"), /*#__PURE__*/React.createElement(Link, null, "Item 2-3")));
export const collapsible = () => /*#__PURE__*/React.createElement(NavSidebar, {
  "data-resin-component": "leftnav"
}, /*#__PURE__*/React.createElement(NavList, {
  heading: /*#__PURE__*/React.createElement(NavListCollapseHeader, {
    onToggleCollapse: action('onToggleCollapse called')
  }, "Collapse or Expand"),
  className: "is-collapsible",
  collapsed: false
}, /*#__PURE__*/React.createElement(Link, null, "Item 1-1"), /*#__PURE__*/React.createElement(Link, null, "Item 1-2")), /*#__PURE__*/React.createElement(NavList, {
  heading: "Item 2"
}, /*#__PURE__*/React.createElement(Link, null, "Item 2-1"), /*#__PURE__*/React.createElement(Link, null, "Item 2-2"), /*#__PURE__*/React.createElement(Link, null, "Item 2-3")));
export default {
  title: 'Components/NavSidebar',
  component: NavSidebar,
  parameters: {
    notes
  }
};
//# sourceMappingURL=NavSidebar.stories.js.map