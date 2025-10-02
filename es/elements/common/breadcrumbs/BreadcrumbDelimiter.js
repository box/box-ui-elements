import * as React from 'react';
import { PointerChevronRight } from '@box/blueprint-web-assets/icons/Fill';
import { Gray50, Size3 } from '@box/blueprint-web-assets/tokens/tokens';
import { DELIMITER_CARET } from '../../../constants';
const BreadcrumbDelimiter = ({
  delimiter
}) => delimiter === DELIMITER_CARET ? /*#__PURE__*/React.createElement(PointerChevronRight, {
  className: "be-breadcrumb-seperator",
  color: Gray50,
  height: Size3,
  role: "presentation",
  width: Size3
}) : /*#__PURE__*/React.createElement("span", null, "/");
export default BreadcrumbDelimiter;
//# sourceMappingURL=BreadcrumbDelimiter.js.map