const _excluded = ["className", "children", "subtitle", "title"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import CloseButton from '../close-button';
import MenuContext from './MenuContext';
import './MenuHeader.scss';
const MenuHeader = _ref => {
  let {
      className,
      children,
      subtitle,
      title
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const {
    closeMenu
  } = React.useContext(MenuContext);
  return /*#__PURE__*/React.createElement("div", _extends({
    className: classNames('bdl-MenuHeader', className),
    "data-testid": "bdl-MenuHeader",
    role: "presentation"
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: "bdl-MenuHeader-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdl-MenuHeader-title-container"
  }, title && /*#__PURE__*/React.createElement("div", {
    className: "bdl-MenuHeader-title"
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    className: "bdl-MenuHeader-subtitle"
  }, subtitle)), children), /*#__PURE__*/React.createElement(CloseButton, {
    className: "bdl-MenuHeader-close-button",
    onClick: closeMenu
  }));
};
export default MenuHeader;
//# sourceMappingURL=MenuHeader.js.map