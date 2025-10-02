function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { createPortal } from 'react-dom';
class Portal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.container = this.props.container;
    this.layer = document.createElement('div');
    this.layer.setAttribute('data-portal', '');
    if (this.container && this.layer) {
      this.container.appendChild(this.layer);
    }
  }
  componentWillUnmount() {
    if (this.container && this.layer) {
      this.container.removeChild(this.layer);
    }
    this.layer = null;
  }
  render() {
    const _this$props = this.props,
      elementProps = _extends({}, (_objectDestructuringEmpty(_this$props), _this$props));
    if (!this.layer) {
      return null;
    }
    return /*#__PURE__*/createPortal(/*#__PURE__*/React.createElement("div", elementProps), this.layer);
  }
}
_defineProperty(Portal, "defaultProps", {
  container: document.body
});
export default Portal;
//# sourceMappingURL=Portal.js.map