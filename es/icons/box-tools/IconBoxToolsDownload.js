function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import AccessibleSVG from '../accessible-svg';
const ICON_CLASS = 'icon-box-tools-download';
class IconBoxToolsDownload extends React.Component {
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
      viewBox: "0 0 136 134",
      width: width
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("rect", {
      height: "120",
      id: `${this.idPrefix}a`,
      rx: "27.692",
      width: "120"
    })), /*#__PURE__*/React.createElement("g", {
      fill: "none",
      fillRule: "evenodd"
    }, /*#__PURE__*/React.createElement("g", {
      transform: "translate(3 11)"
    }, /*#__PURE__*/React.createElement("use", {
      fill: "#0065E3",
      xlinkHref: `#${this.idPrefix}a`
    }), /*#__PURE__*/React.createElement("rect", {
      height: "122.308",
      rx: "27.692",
      stroke: "#C3D1D9",
      strokeOpacity: ".154",
      strokeWidth: "2.308",
      width: "122.308",
      x: "-1.154",
      y: "-1.154"
    })), /*#__PURE__*/React.createElement("path", {
      d: "M64.075 72.337c-4.742 0-8.587-3.95-8.587-8.828 0-4.873 3.845-8.823 8.587-8.823 4.74 0 8.582 3.95 8.582 8.823 0 4.878-3.843 8.828-8.582 8.828m-25.282 0c-4.741 0-8.589-3.95-8.589-8.826 0-4.875 3.848-8.825 8.589-8.825 4.74 0 8.58 3.95 8.58 8.823 0 4.878-3.84 8.828-8.58 8.828m25.282-23.543c7.9 0 14.308 6.587 14.308 14.715 0 8.132-6.408 14.721-14.308 14.721-5.476 0-10.24-3.17-12.64-7.817-2.4 4.646-7.163 7.817-12.642 7.817-7.827 0-14.178-6.458-14.304-14.475h-.003V39.338c.035-1.602 1.293-2.884 2.857-2.884 1.563 0 2.833 1.282 2.861 2.884v12.4a14.009 14.009 0 0 1 8.589-2.944c5.479 0 10.241 3.168 12.642 7.82 2.4-4.652 7.164-7.82 12.64-7.82zm36.51 24.509c.987 1.3.703 3.106-.656 4.072-1.36.966-3.27.72-4.323-.54l-6.69-8.434-6.694 8.434c-1.042 1.26-2.963 1.506-4.32.54-1.356-.966-1.64-2.772-.65-4.072h-.003l7.773-9.813-7.773-9.831h.003c-.99-1.297-.706-3.107.65-4.07 1.357-.97 3.278-.722 4.32.536v-.002l6.694 8.446 6.7-8.446v.002c1.052-1.258 2.961-1.507 4.322-.536 1.36.962 1.641 2.773.657 4.07l-7.787 9.831 7.778 9.813z",
      fill: "#FFFFFE"
    }), /*#__PURE__*/React.createElement("text", {
      fill: "#FFF",
      fontFamily: "Lato-Regular, Lato",
      fontSize: "23.077",
      transform: "translate(23.77 36.385)"
    }, /*#__PURE__*/React.createElement("tspan", {
      x: "1.154",
      y: "68"
    }, "TOOLS")), /*#__PURE__*/React.createElement("g", {
      transform: "translate(99 1)"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "18",
      cy: "18",
      fill: "#26C281",
      r: "18",
      stroke: "#F5F7F9",
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M18.376 26.57l5.898-6.74a.5.5 0 0 0-.376-.83h-3.565v-7.5a.5.5 0 0 0-.5-.5h-3.666a.5.5 0 0 0-.5.5V19h-3.565a.5.5 0 0 0-.376.83l5.898 6.74a.5.5 0 0 0 .752 0z",
      fill: "#FFF"
    }))));
  }
}
_defineProperty(IconBoxToolsDownload, "defaultProps", {
  className: '',
  height: 134,
  width: 136
});
export default IconBoxToolsDownload;
//# sourceMappingURL=IconBoxToolsDownload.js.map