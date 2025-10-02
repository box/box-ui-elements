function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import IconCaretDown from '../../icons/general/IconCaretDown';
import PlainButton from '../plain-button';
const NavListCollapseHeader = ({
  children,
  onToggleCollapse,
  containerProps = {}
}) => /*#__PURE__*/React.createElement("div", _extends({
  className: "nav-list-collapse-header"
}, containerProps), children, /*#__PURE__*/React.createElement(PlainButton, {
  className: "nav-list-collapse",
  onClick: onToggleCollapse,
  type: "button"
}, /*#__PURE__*/React.createElement(IconCaretDown, {
  width: 8
})));
export default NavListCollapseHeader;
//# sourceMappingURL=NavListCollapseHeader.js.map