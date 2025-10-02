const _excluded = ["header", "footer", "flyoutButton", "children", "scrollRefFn", "className", "isOverlayHeaderActionEnabled"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import { Flyout, Overlay, OverlayHeader } from '../../components/flyout';
import ScrollWrapper from '../../components/scroll-wrapper';
import './styles/HeaderFlyout.scss';
class HeaderFlyout extends React.Component {
  render() {
    const _this$props = this.props,
      {
        header,
        footer,
        flyoutButton,
        children,
        scrollRefFn,
        className,
        isOverlayHeaderActionEnabled = false
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    return /*#__PURE__*/React.createElement(Flyout, _extends({
      className: classNames('header-flyout', className),
      closeOnClick: false,
      constrainToWindow: true,
      offset: HeaderFlyout.panelOffset
    }, rest), flyoutButton, /*#__PURE__*/React.createElement(Overlay, {
      className: "header-flyout-overlay"
    }, /*#__PURE__*/React.createElement(OverlayHeader, {
      isOverlayHeaderActionEnabled: isOverlayHeaderActionEnabled
    }, header && /*#__PURE__*/React.createElement("h4", {
      className: "header-flyout-title"
    }, header)), /*#__PURE__*/React.createElement("div", {
      className: "header-flyout-list-container"
    }, /*#__PURE__*/React.createElement("div", {
      className: classNames('flyout-list-container-body', {
        'with-header': !!header,
        'with-footer': !!footer
      })
    }, children != null && /*#__PURE__*/React.createElement(ScrollWrapper, {
      scrollRefFn: scrollRefFn,
      shadowSize: "contain"
    }, children)), footer && /*#__PURE__*/React.createElement("div", {
      className: "flyout-list-container-footer"
    }, footer))));
  }
}
_defineProperty(HeaderFlyout, "panelOffset", '-4px 0px');
_defineProperty(HeaderFlyout, "defaultProps", {
  position: 'bottom-left'
});
export default HeaderFlyout;
//# sourceMappingURL=HeaderFlyout.js.map