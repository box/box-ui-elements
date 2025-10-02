const _excluded = ["children", "className"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import FocusTrap from '../focus-trap';
class Overlay extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "closeOverlay", () => {
      const {
        onClose
      } = this.props;
      if (!onClose) {
        return;
      }
      setTimeout(() => onClose(), 0);
    });
    _defineProperty(this, "handleOverlayKeyDown", event => {
      if (event.key !== 'Escape') {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      this.closeOverlay();
    });
  }
  render() {
    const _this$props = this.props,
      {
        children,
        className
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const overlayProps = omit(rest, ['onClose']);
    overlayProps.className = classNames('bdl-Overlay', className);
    overlayProps.handleOverlayKeyDown = this.handleOverlayKeyDown;
    overlayProps.tabIndex = 0;
    return /*#__PURE__*/React.createElement(FocusTrap, overlayProps, /*#__PURE__*/React.createElement("div", {
      className: "overlay"
    }, children));
  }
}
export default Overlay;
//# sourceMappingURL=Overlay.js.map