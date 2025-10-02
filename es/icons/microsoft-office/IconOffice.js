function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import AccessibleSVG from '../accessible-svg';
const ICON_CLASS = 'icon-office';
class IconOffice extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "idPrefix", `${uniqueId(ICON_CLASS)}-`);
  }
  render() {
    const {
      className,
      height,
      title,
      width
    } = this.props;
    return /*#__PURE__*/React.createElement(AccessibleSVG, {
      className: `${ICON_CLASS} ${className}`,
      height: height,
      title: title,
      viewBox: "0 0 64 77",
      width: width
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 0 62.113281 L 0 15.304688 L 41.464844 0.00390625 L 64 7.199219 L 64 70.214844 L 41.464844 77 L 0 62.113281 L 41.464844 67.097656 L 41.464844 12.605469 L 14.421875 18.90625 L 14.421875 55.816406 Z M 0 62.113281 ",
      fill: "#d83b01"
    }));
  }
}
_defineProperty(IconOffice, "defaultProps", {
  className: '',
  height: 30,
  width: 30
});
export default IconOffice;
//# sourceMappingURL=IconOffice.js.map