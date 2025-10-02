function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import AccessibleSVG from '../accessible-svg';
const ICON_CLASS = 'icon-google-sheets';
class IconGoogleSheets extends React.Component {
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
      viewBox: "0 0 30 30",
      width: width
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "matrix(2.67 0 0 -2.67 596.67 1357)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}a`,
      x1: "-215.49",
      x2: "-215.49",
      y1: "505.79",
      y2: "503.19"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#208256"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".55",
      stopColor: "#19955a",
      stopOpacity: ".2"
    }))), /*#__PURE__*/React.createElement("path", {
      d: "M17.64 0H6.05A2.05 2.05 0 0 0 4 2.05V28a2.05 2.05 0 0 0 2.05 2h17.72a2.05 2.05 0 0 0 2.05-2V8.18l-4.77-3.41z",
      fill: "#22a565"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M18.23 7.58l7.59 7.58V8.18l-7.59-.6z",
      fill: `url(#${this.idPrefix}a)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M17.64 0v6.14a2 2 0 0 0 2 2h6.14z",
      fill: "#8ed1b1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6.05 0A2.05 2.05 0 0 0 4 2.05v.17A2.05 2.05 0 0 1 6.05.17h11.59V0z",
      fill: "#fff",
      fillOpacity: ".2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19.68 8.18a2 2 0 0 1-2-2v.17a2 2 0 0 0 2 2h6.14v-.17z",
      fill: "#1a237e",
      fillOpacity: ".1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 14v10h10V14zm1 1h3.5v2H11zm0 3h3.5v2H11zm0 5v-2h3.5v2zm8 0h-3.5v-2H19zm0-3h-3.5v-2H19zm0-3h-3.5v-2H19z",
      fill: "#f1f1f1"
    }));
  }
}
_defineProperty(IconGoogleSheets, "defaultProps", {
  className: '',
  height: 30,
  width: 30
});
export default IconGoogleSheets;
//# sourceMappingURL=IconGoogleSheets.js.map