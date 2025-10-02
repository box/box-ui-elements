function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import AccessibleSVG from '../accessible-svg';
const ICON_CLASS = 'icon-iwork-pages';
class IconIWorkPages extends React.Component {
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
      gradientTransform: "matrix(1.33 0 0 1.33 1369.1 2112.94)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}a`,
      x1: "-1015.61",
      x2: "-1015.59",
      y1: "-1562.33",
      y2: "-1584.47"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#ff8500"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#ffb900"
    }))), /*#__PURE__*/React.createElement("path", {
      d: "M6.88 0h16.24A6.87 6.87 0 0 1 30 6.88v16.24A6.87 6.87 0 0 1 23.12 30H6.88A6.87 6.87 0 0 1 0 23.12V6.88A6.87 6.87 0 0 1 6.88 0z",
      fill: `url(#${this.idPrefix}a)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7.8 22.7c.49-.32.91-.61.93-.63s0-.09-.38-.46a3.31 3.31 0 0 0-.47-.43A20.63 20.63 0 0 0 6.62 23a.2.2 0 0 0 .22.27 11 11 0 0 0 1-.61zm1.67-1.1a18 18 0 0 0 2.35-1.89c1.63-1.45 5.32-5 5.32-5.06s-1.82-1.88-1.88-1.88-3 3-4.44 4.63C9.84 18.48 9.36 19 9 19.48a12.15 12.15 0 0 0-1 1.44 7.33 7.33 0 0 0 1 1 3.47 3.47 0 0 0 .47-.32zm9.65-6.6a.26.26 0 0 0 .1-.23.93.93 0 0 0 0-.23.57.57 0 0 1 .17-.52A19.61 19.61 0 0 1 21 12.27c1.69-1.74 2.7-2.82 3.16-3.38a1.13 1.13 0 0 0 .35-.79c0-.2 0-.22-.17-.54-.06-.12 0-.24.08-.41a1.25 1.25 0 0 0 .05-1.65A1.15 1.15 0 0 0 23 5.41a19.43 19.43 0 0 0-1.77 1.53c-1.9 1.76-5.71 5.51-5.71 5.63s1.82 1.87 1.87 1.87.81-.76 1.74-1.69c1.74-1.75 2.55-2.59 3.55-3.67.87-.93.87-.93.95-.94s.08 0 .09.07 0 .15-.27.45c-.49.58-1.34 1.49-3.23 3.43-.63.64-1.21 1.26-1.3 1.37a2.45 2.45 0 0 0-.41.83c-.09.41.13.8.46.8a.29.29 0 0 0 .15-.09zM6.54 23.59a.41.41 0 0 0 0 .81h23.35v-.19L30 24V23.59H6.54z",
      fill: "#fff"
    }));
  }
}
_defineProperty(IconIWorkPages, "defaultProps", {
  className: '',
  height: 30,
  width: 30
});
export default IconIWorkPages;
//# sourceMappingURL=IconIWorkPages.js.map