import * as React from 'react';
import CompactCount from './CompactCount';
import './HeaderWithCount.scss';
function isNumber(count) {
  return typeof count === 'number';
}
function HeaderWithCount({
  title,
  totalCount
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "HeaderWithCount"
  }, /*#__PURE__*/React.createElement("span", {
    className: "HeaderWithCount-title"
  }, title), isNumber(totalCount) ? /*#__PURE__*/React.createElement(CompactCount, {
    className: "HeaderWithCount-titleCount",
    count: totalCount
  }) : null);
}
export default HeaderWithCount;
//# sourceMappingURL=HeaderWithCount.js.map