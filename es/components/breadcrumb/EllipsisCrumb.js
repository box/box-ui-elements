import * as React from 'react';
import DropdownMenu from '../dropdown-menu';
import { Menu } from '../menu';
import PlainButton from '../plain-button';
const EllipsisCrumb = ({
  children,
  menuButton
}) => {
  const defaultMenuButton = /*#__PURE__*/React.createElement(PlainButton, {
    className: "breadcrumb-toggler"
  }, "\u22EF");
  return /*#__PURE__*/React.createElement(DropdownMenu, null, menuButton || defaultMenuButton, /*#__PURE__*/React.createElement(Menu, null, children));
};
export default EllipsisCrumb;
//# sourceMappingURL=EllipsisCrumb.js.map