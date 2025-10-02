import * as React from 'react';
import Link from '../../link/Link';
import Menu from '../Menu';
import SelectMenuLinkItem from '../SelectMenuLinkItem';
import notes from './SelectMenuLinkItem.stories.md';
export const basic = () => /*#__PURE__*/React.createElement(Menu, null, /*#__PURE__*/React.createElement(SelectMenuLinkItem, {
  isSelected: true
}, /*#__PURE__*/React.createElement(Link, {
  href: "http://opensource.box.com/box-ui-elements/storybook"
}, "View Profile")), /*#__PURE__*/React.createElement(SelectMenuLinkItem, null, /*#__PURE__*/React.createElement(Link, {
  href: "http://opensource.box.com/box-ui-elements/storybook"
}, "Awesome Link")));
export default {
  title: 'Components/SelectMenuLinkItem',
  component: SelectMenuLinkItem,
  parameters: {
    notes
  }
};
//# sourceMappingURL=SelectMenuLinkItem.stories.js.map