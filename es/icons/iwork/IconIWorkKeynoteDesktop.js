function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import AccessibleSVG from '../accessible-svg';
const ICON_CLASS = 'icon-iwork-keynote-desktop';
class IconIWorkKeynoteDesktop extends React.Component {
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
      viewBox: "0 0 75.55 84.65",
      width: width
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(-6.64 127.65)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}a`,
      x1: "26.5",
      x2: "62.47",
      y1: "-47.68",
      y2: "-47.68"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#847b70"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".08",
      stopColor: "#b5cfe1"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".11",
      stopColor: "#b7d0e2"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".23",
      stopColor: "#c5dae8"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".31",
      stopColor: "#c5dae8"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".47",
      stopColor: "#91a7b4"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".63",
      stopColor: "#91a7b4"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".69",
      stopColor: "#91a7b4"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".84",
      stopColor: "#b8b19f"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#5e5851"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(0 132)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}b`,
      x1: "19.86",
      x2: "55.82",
      y1: "-55.93",
      y2: "-55.93"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#d0e6f5"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".5",
      stopColor: "#fff"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#d0e6f5"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(0 132)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}c`,
      x1: "37.84",
      x2: "37.84",
      y1: "-62.16",
      y2: "-50.26"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#c5d9e6"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".5",
      stopColor: "#b5cfe1"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#dfecf2"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(-6.64 127.65)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}d`,
      x1: "41.66",
      x2: "47.31",
      y1: "-73.76",
      y2: "-73.76"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#847b70"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".11",
      stopColor: "#c5dae8"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".23",
      stopColor: "#c5dae8"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".31",
      stopColor: "#c5dae8"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".56",
      stopColor: "#91a7b4"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".69",
      stopColor: "#91a7b4"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".84",
      stopColor: "#6e6a65"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#5e5851"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(-6.64 127.65)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}e`,
      x1: "44.41",
      x2: "44.41",
      y1: "-92.82",
      y2: "-95.79"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#00588a"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: ".5",
      stopColor: "#0088b1"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#00588a"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(-6.64 127.65)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}f`,
      x1: "44.41",
      x2: "44.41",
      y1: "-127.59",
      y2: "-94.47"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#00a0e8"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#4fc8ec"
    })), /*#__PURE__*/React.createElement("linearGradient", {
      gradientTransform: "translate(-6.64 127.65)",
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}g`,
      x1: "44.41",
      x2: "44.41",
      y1: "-126.1",
      y2: "-94.5"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#00a9fa"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#7ce1fd"
    }))), /*#__PURE__*/React.createElement("path", {
      d: "M55.83 78.3c0 3.51-8.06 6.35-18 6.35S19.9 81.81 19.9 78.3v-2.19h35.92z",
      fill: "#565653"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M55.83 78c0 3.43-8.06 6.2-18 6.2S19.9 81.38 19.9 78v-2.21h35.92z",
      fill: `url(#${this.idPrefix}a)`
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "37.84",
      cy: "76.07",
      fill: `url(#${this.idPrefix}b)`,
      rx: "17.98",
      ry: "5.95"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "37.84",
      cy: "75.79",
      fill: `url(#${this.idPrefix}c)`,
      rx: "17.98",
      ry: "5.95"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M40.55 74.92c0 .52-1.23 1-2.77 1s-2.76-.44-2.76-1V31.86h5.73z",
      fill: `url(#${this.idPrefix}d)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M75.54 31.86v.28c0 2-1.16 2.69-2.12 2.69H2.5a2.35 2.35 0 0 1-2.5-2.2 2.29 2.29 0 0 1 0-.37v-.33z",
      fill: `url(#${this.idPrefix}e)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M74 33.45H1.73A1.49 1.49 0 0 1 0 32.2a1.6 1.6 0 0 1 0-.49L6.32 1c.15-.67 1.07-1 2-1h59.55c.52 0 1.81 0 2 1l5.71 30.73a1.48 1.48 0 0 1-1.21 1.69 1.66 1.66 0 0 1-.37.03z",
      fill: "#00588a"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M74.15 33.12H1.52c-.58 0-1.49-.7-1.29-1.49L6.43 1c.14-.61.93-.94 1.83-.94h59.55c.52 0 1.62-.09 1.86 1l5.65 30.71c.17.65-.65 1.35-1.17 1.35z",
      fill: `url(#${this.idPrefix}f)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M73.73 33.15H1.57c-.26 0-.73 0-.7-.56l5.85-30.1c.09-.61.92-.94 1.83-.94H67c.52 0 1.67 0 1.86 1l5.79 30.12c0 .44-.41.48-.94.48z",
      fill: `url(#${this.idPrefix}g)`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M59.7 4.69a.39.39 0 0 0-.39-.34h-43a.43.43 0 0 0-.43.37L12.89 27v.4h49.73V27z",
      fill: "#0098c1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M62.14 26.74H13.27l3-22h43.05z",
      fill: "#fff"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "42.31",
      cy: "12.67",
      fill: "#06bff8",
      rx: "1.04",
      ry: ".61"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "42.41",
      cy: "14.89",
      fill: "#f19cf8",
      rx: "1.04",
      ry: ".61"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "42.41",
      cy: "17.16",
      fill: "#ff6d65",
      rx: "1.04",
      ry: ".61"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "42.5",
      cy: "19.58",
      fill: "#ffe65f",
      rx: "1.04",
      ry: ".7"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: "42.58",
      cy: 22,
      fill: "#98e87c",
      rx: "1.04",
      ry: ".74"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M44.94 12.24h7.89v.82h-7.89zm0 2.24h7.61v.82h-7.61zm.14 2.27h9v.82h-9zm.07 2.42h7.53V20h-7.53zm.09 2.42h10.38v.82H45.24z",
      fill: "#c8cdd6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M28.55 23.74a11.87 11.87 0 0 0 6.26-1.63l-6-4.56-8.48 2.64c1.32 2.11 4.28 3.55 8.22 3.55z",
      fill: "#98e87c"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M37.77 18.3l-8.93-.7 6 4.55a5.94 5.94 0 0 0 2.93-3.85z",
      fill: "#ffe65f"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M36 14.07l-7.2 3.5 8.93.7a5.31 5.31 0 0 0 .09-.79A4.47 4.47 0 0 0 36 14.07z",
      fill: "#ff6d65"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M30.62 12l-1.78 5.6 7.26-3.5a10.6 10.6 0 0 0-5.48-2.1z",
      fill: "#f09df8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M29.51 11.42c-.51 0-1-.08-1.49-.08-4.93 0-9.36 2.52-9.36 6a4.92 4.92 0 0 0 .61 2.37l8.41-2.76z",
      fill: "#00a9fa"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19.1 6.3h.54l-.09 1 .36-.3 1.35-.76h.67l-1.61.83L22 8.3h-.73l-1.34-1-.42.22v.78h-.54zm5.79 1h-1.78V8h2v.3h-2.54l.1-2h2.41v.23h-1.87v.64H25zm2 1v-.85L25.52 6.3h.61l.59.55.42.42c.12-.13.27-.27.42-.42l.61-.55h.67l-1.52 1.11v.89zm2.48 0v-2h.57l1.28 1a7.3 7.3 0 0 1 .71.65 5.75 5.75 0 0 1 0-.83V6.3h.5v2h-.55l-1.29-1a7.85 7.85 0 0 1-.74-.67 5.75 5.75 0 0 1 0 .83v.84zm7.17-1.06c0 .69-.85 1-1.88 1s-1.81-.41-1.81-1 .8-1.06 1.87-1.06 1.77.46 1.77 1.06zm-3.17.06c0 .43.47.81 1.3.81s1.29-.38 1.29-.83-.41-.82-1.29-.82-1.35.36-1.35.84zm4.45-.82h-1.33V6.3h3.11v.23h-1.28V8.3h-.55zm4.47.82h-1.81V8h2v.3h-2.55v-2h2.46v.23h-1.92v.62h1.76z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M18.42 9.59H57v.13H18.42z",
      fill: "#1e1e1e"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M2.56 29.09l-.18.91s0 .11.18.11H73s.21 0 .21-.14l-.22-.89z",
      fill: "#8ae7fb"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M2.62 31s0 .24.21.24h69.86a.31.31 0 0 0 .24-.24l.22-1H2.38z",
      fill: "none"
    }));
  }
}
_defineProperty(IconIWorkKeynoteDesktop, "defaultProps", {
  className: '',
  height: 30,
  width: 30
});
export default IconIWorkKeynoteDesktop;
//# sourceMappingURL=IconIWorkKeynoteDesktop.js.map