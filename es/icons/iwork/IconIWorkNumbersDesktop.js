function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import AccessibleSVG from '../accessible-svg';
const ICON_CLASS = 'icon-iwork-numbers-desktop';
class IconIWorkNumbersDesktop extends React.Component {
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
      viewBox: "0 0 85.2 80",
      width: width
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(-3.7 125.99)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}a`,
      x1: "3.7",
      x2: "88.9",
      y1: "-64.17",
      y2: "-64.17"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#8c8c8c"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".02",
      stopColor: "#939493"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(-3.7 125.99)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}b`,
      x1: "46.3",
      x2: "46.3",
      y1: "-48.22",
      y2: "-81.41"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#e0e0e0"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#fff"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(-3.7 125.99)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}c`,
      x1: "74.66",
      x2: "74.66",
      y1: "-110.68",
      y2: "-55.91"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#4dc4fc"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#0f67f7"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "matrix(-1 0 0 1 175.62 125.99)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}d`,
      x1: "97.76",
      x2: "97.76",
      y1: "-56.2",
      y2: "-108.93"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#0b55d3"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#409fcd"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(0 132)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}e`,
      x1: "70.89",
      x2: "70.89",
      y1: "-114.21",
      y2: "-118.45"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#76cffd"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#4dc4fc"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(-3.7 125.99)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}f`,
      x1: "41.45",
      x2: "41.45",
      y1: "-100.9",
      y2: "-55.9"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#fba51e"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#e64e04"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "matrix(-1 0 0 1 175.62 125.99)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}g`,
      x1: "130.97",
      x2: "130.97",
      y1: "-56.18",
      y2: "-99.15"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#c83600"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#bc6a15"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(0 132)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}h`,
      x1: "37.73",
      x2: "37.73",
      y1: "-104.44",
      y2: "-109.04"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#fcbf56"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#fcbd4a"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(-3.7 125.99)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}i`,
      x1: "24.85",
      x2: "24.85",
      y1: "-84.31",
      y2: "-55.91"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#e93f54"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#d20b2f"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(-3.7 125.99)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}j`,
      x1: "31.75",
      x2: "31.75",
      y1: "-56.2",
      y2: "-82.57"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#bb0e2b"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#ba2c3d"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(0 132)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}k`,
      x1: "21.12",
      x2: "21.12",
      y1: "-87.84",
      y2: "-93.2"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#f87e7a"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#f3636b"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(-3.7 125.99)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}l`,
      x1: "58.04",
      x2: "58.04",
      y1: "-123.99",
      y2: "-55.94"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#54e56c"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#2ab203"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "matrix(-1 0 0 1 175.62 125.99)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}m`,
      x1: "114.37",
      x2: "114.37",
      y1: "-56.26",
      y2: "-123.23"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#2d9e20"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#43b656"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(0 132)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}n`,
      x1: "54.31",
      x2: "54.31",
      y1: "-128.5",
      y2: "-131.97"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#98e97d"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#74f482"
    }))), /*#__PURE__*/React.createElement("path", {
      d: "M1.88 80A1.88 1.88 0 0 1 0 78.18v-1.51l1.73-31.19a2 2 0 0 1 2-1.84h77.53a2 2 0 0 1 2 1.89l1.94 31.11v1.51A1.87 1.87 0 0 1 83.32 80z",
      fill: `url(#${this.idPrefix}a)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M83.05 77.77H2.15A1.14 1.14 0 0 1 1 76.64l1.71-30.93a1.14 1.14 0 0 1 1.13-1.13h77.31a1.14 1.14 0 0 1 1.13 1.13l1.9 30.93a1.14 1.14 0 0 1-1.13 1.13z",
      fill: `url(#${this.idPrefix}b)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M78.52 15.31v52.38a2.39 2.39 0 0 1-2.39 2.39H65.77a2.39 2.39 0 0 1-2.38-2.39V15.31z",
      fill: `url(#${this.idPrefix}c)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M77.21 18.22h.11a1.16 1.16 0 0 0 1.2-1.12v50.59a2.39 2.39 0 0 1-1.27 2.1z",
      fill: `url(#${this.idPrefix}d)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M64.66 18.22h-.14a1.16 1.16 0 0 1-1.16-1.16v50.63a2.38 2.38 0 0 0 1.27 2.1z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M77.32 17.78h-12.8a1.16 1.16 0 0 1-1.16-1.16v.43a1.16 1.16 0 0 0 1.16 1.16h12.8a1.16 1.16 0 0 0 1.2-1.12v-.44a1.15 1.15 0 0 1-1.13 1.17h-.07z",
      fill: "#8ddfff"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M64.87 13.61h12.07a1.51 1.51 0 0 1 1.51 1.5v1.51a1.16 1.16 0 0 1-1.16 1.16H64.52a1.15 1.15 0 0 1-1.19-1.11v-1.56a1.51 1.51 0 0 1 1.52-1.5z",
      fill: `url(#${this.idPrefix}e)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M45.29 25.09v43a2.37 2.37 0 0 1-2.39 2H32.58a2.37 2.37 0 0 1-2.38-2v-43z",
      fill: `url(#${this.idPrefix}f)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M44 28h.11a1.16 1.16 0 0 0 1.16-1.16v40.87a2.39 2.39 0 0 1-1.27 2.1z",
      fill: `url(#${this.idPrefix}g)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M31.52 28h-.11a1.16 1.16 0 0 1-1.16-1.16v40.87a2.38 2.38 0 0 0 1.27 2.1z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M44.13 27.56H31.36a1.16 1.16 0 0 1-1.16-1.16v.42A1.16 1.16 0 0 0 31.34 28h12.79a1.16 1.16 0 0 0 1.16-1.16v-.44a1.16 1.16 0 0 1-1.16 1.16z",
      fill: "#fccb88"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M31.68 23h12.07a1.51 1.51 0 0 1 1.51 1.51v1.89a1.16 1.16 0 0 1-1.16 1.16H31.36a1.16 1.16 0 0 1-1.16-1.16v-1.93A1.51 1.51 0 0 1 31.71 23z",
      fill: `url(#${this.idPrefix}h)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M28.69 41.68v26.37a2.37 2.37 0 0 1-2.38 2H16a2.36 2.36 0 0 1-2.38-2V41.68z",
      fill: `url(#${this.idPrefix}i)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M27.42 44.58h.1a1.16 1.16 0 0 0 1.16-1.16v24.27a2.38 2.38 0 0 1-1.27 2.1z",
      fill: `url(#${this.idPrefix}j)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M14.87 44.58h-.1a1.16 1.16 0 0 1-1.16-1.16v24.27a2.39 2.39 0 0 0 1.26 2.1z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M27.52 44.16H14.77A1.16 1.16 0 0 1 13.61 43v.43a1.16 1.16 0 0 0 1.16 1.16h12.75a1.16 1.16 0 0 0 1.16-1.16V43a1.16 1.16 0 0 1-1.16 1.16z",
      fill: "#f7a6a6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15.08 38.8h12.07a1.51 1.51 0 0 1 1.51 1.51V43a1.16 1.16 0 0 1-1.14 1.16H14.77A1.16 1.16 0 0 1 13.58 43v-2.69a1.52 1.52 0 0 1 1.5-1.51z",
      fill: `url(#${this.idPrefix}k)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M61.88 2v64.88c0 2.08-1.07 3.17-2.38 3.17H49.18c-1.31 0-2.38-1.08-2.38-3.17V2z",
      fill: `url(#${this.idPrefix}l)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M60.62 3.92h.1a1.16 1.16 0 0 0 1.16-1.16v64.87a2.39 2.39 0 0 1-1.26 2.1z",
      fill: `url(#${this.idPrefix}m)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M48.06 3.92H48a1.16 1.16 0 0 1-1.2-1.16v64.87a2.39 2.39 0 0 0 1.26 2.1z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M60.72 3.48H48a1.16 1.16 0 0 1-1.2-1.16v.42A1.16 1.16 0 0 0 48 3.9h12.72a1.16 1.16 0 0 0 1.16-1.16v-.42a1.16 1.16 0 0 1-1.16 1.16z",
      fill: "#a3f4ac"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M48.27 0h12.07a1.5 1.5 0 0 1 1.51 1.49v.8a1.16 1.16 0 0 1-1.16 1.16H48a1.16 1.16 0 0 1-1.19-1.13v-.81A1.5 1.5 0 0 1 48.26 0z",
      fill: `url(#${this.idPrefix}n)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6.79 47.87h.9L8 47.7a.35.35 0 0 0 .17-.15h.63v1.86H8v-1.32H6.79zm2.64 7.48H6.17a.52.52 0 0 1 .31-.45 2.7 2.7 0 0 1 .76-.33l.48-.14.47-.15a1.62 1.62 0 0 0 .35-.17.28.28 0 0 0 .13-.21.24.24 0 0 0 0-.12.34.34 0 0 0-.12-.12 1 1 0 0 0-.24-.09H7.9a1.15 1.15 0 0 0-.37 0 .8.8 0 0 0-.25.11.51.51 0 0 0-.13.16.67.67 0 0 0 0 .2h-.89a.51.51 0 0 1 .1-.32.93.93 0 0 1 .32-.24 2.35 2.35 0 0 1 .51-.17 4.21 4.21 0 0 1 .71 0 4.45 4.45 0 0 1 .73 0 1.77 1.77 0 0 1 .46.15.86.86 0 0 1 .26.2.38.38 0 0 1 0 .21.32.32 0 0 1-.09.23 1.08 1.08 0 0 1-.24.18l-.35.15-.39.14-.28.13-.37.11-.31.12a.36.36 0 0 0-.18.12h2.3zM7 59.88h.73a.76.76 0 0 0 .27-.15.18.18 0 0 0 .09-.15c0-.1 0-.16-.21-.22a1.58 1.58 0 0 0-.53-.07H7l-.24.09a.51.51 0 0 0-.16.13.43.43 0 0 0 0 .16h-.87a.44.44 0 0 1 .14-.28 1 1 0 0 1 .31-.21 2.13 2.13 0 0 1 .49-.18 3.42 3.42 0 0 1 .64 0h.55l.48.11a1.23 1.23 0 0 1 .35.16.31.31 0 0 1 .13.24.32.32 0 0 1-.16.28 1.21 1.21 0 0 1-.52.16 1.6 1.6 0 0 1 .64.17.39.39 0 0 1 .22.33.33.33 0 0 1-.13.26 1.24 1.24 0 0 1-.36.19 2.57 2.57 0 0 1-.55.12 4.49 4.49 0 0 1-1.37 0 2.12 2.12 0 0 1-.51-.13.9.9 0 0 1-.32-.23.45.45 0 0 1-.12-.33h.88c0 .12 0 .23.22.3a1.53 1.53 0 0 0 .67.12 1.84 1.84 0 0 0 .62 0 .26.26 0 0 0 .26-.26.19.19 0 0 0-.14-.11 1 1 0 0 0-.28-.11H7zm2 6.51h-.6v.49h-.77v-.49h-2v-.33l2-1.17h.74v1.28H9zm-2.79-.21h1.48v-.89zm-.47 4.65h2.43v.3H6.29l-.24.51a1.58 1.58 0 0 1 .43-.1H7a3.32 3.32 0 0 1 .63 0 1.93 1.93 0 0 1 .47.13.67.67 0 0 1 .28.22.39.39 0 0 1 0 .52.78.78 0 0 1-.29.25 2.16 2.16 0 0 1-.51.16 3.14 3.14 0 0 1-.75 0h-.68a2.31 2.31 0 0 1-.52-.12 1.07 1.07 0 0 1-.36-.2.39.39 0 0 1-.15-.27h.77a.37.37 0 0 0 .27.26 1.64 1.64 0 0 0 .62.09h.41a1 1 0 0 0 .25-.15.36.36 0 0 0 .16-.14.54.54 0 0 0 0-.18.43.43 0 0 0 0-.16.46.46 0 0 0-.17-.14l-.29-.09h-.86a.51.51 0 0 0-.31.15h-.79z",
      fill: "#868786"
    }));
  }
}
_defineProperty(IconIWorkNumbersDesktop, "defaultProps", {
  className: '',
  height: 30,
  width: 30
});
export default IconIWorkNumbersDesktop;
//# sourceMappingURL=IconIWorkNumbersDesktop.js.map