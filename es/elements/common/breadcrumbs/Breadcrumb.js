import * as React from 'react';
import { TextButton } from '@box/blueprint-web';
import BreadcrumbDelimiter from './BreadcrumbDelimiter';
import './Breadcrumb.scss';
const Breadcrumb = ({
  name = '',
  onClick,
  isLast,
  delimiter
}) => {
  const title = onClick ? /*#__PURE__*/React.createElement(TextButton, {
    className: "bdl-Breadcrumb-title",
    inheritFont: true,
    onClick: onClick
  }, name) : /*#__PURE__*/React.createElement("div", {
    className: "bdl-Breadcrumb-title"
  }, name);
  return /*#__PURE__*/React.createElement("span", {
    className: "be-breadcrumb"
  }, title, isLast ? null : /*#__PURE__*/React.createElement(BreadcrumbDelimiter, {
    delimiter: delimiter
  }));
};
export default Breadcrumb;
//# sourceMappingURL=Breadcrumb.js.map