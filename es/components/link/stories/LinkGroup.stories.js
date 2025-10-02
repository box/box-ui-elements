import * as React from 'react';
import Link from '../Link';
import LinkGroup from '../LinkGroup';
import notes from './LinkGroup.stories.md';
export const basic = () => /*#__PURE__*/React.createElement(LinkGroup, null, /*#__PURE__*/React.createElement(Link, {
  href: "https://www.box.com/platform"
}, "A Link"), /*#__PURE__*/React.createElement(Link, {
  href: "https://developer.box.com"
}, "B Link"), /*#__PURE__*/React.createElement(Link, {
  href: "https://github.com/box/box-ui-elements"
}, "C Link"));
export default {
  title: 'Components/Links/LinkGroup',
  component: LinkGroup,
  parameters: {
    notes
  }
};
//# sourceMappingURL=LinkGroup.stories.js.map