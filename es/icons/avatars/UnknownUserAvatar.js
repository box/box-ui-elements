function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import * as vars from '../../styles/variables';
const ICON_CLASS = 'unknown-user-avatar';
class UnknownUserAvatar extends React.PureComponent {
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
      viewBox: "0 0 16 16",
      width: width
    }, /*#__PURE__*/React.createElement("path", {
      fill: vars.bdlGray50,
      fillRule: "evenodd",
      d: "M8 0a8 8 0 110 16A8 8 0 018 0zm0 9.5c-1.21 0-2.293.413-3.232 1.096-.56.407-.953.817-1.168 1.104a.5.5 0 00.8.6c.035-.047.114-.141.234-.267.205-.214.447-.428.722-.629.78-.567 1.665-.904 2.644-.904.979 0 1.865.337 2.644.904.275.2.517.415.722.63.12.125.199.219.234.266a.5.5 0 00.8-.6c-.215-.287-.607-.697-1.168-1.104C10.293 9.913 9.21 9.5 8 9.5zm0-6a2.5 2.5 0 000 5 2.5 2.5 0 000-5zm0 1a1.5 1.5 0 11-.001 3.001A1.5 1.5 0 018 4.5z"
    }));
  }
}
_defineProperty(UnknownUserAvatar, "defaultProps", {
  className: '',
  height: 28,
  width: 28
});
export default UnknownUserAvatar;
//# sourceMappingURL=UnknownUserAvatar.js.map