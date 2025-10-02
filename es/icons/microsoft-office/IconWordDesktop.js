function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import AccessibleSVG from '../accessible-svg';
const ICON_CLASS = 'icon-word-desktop';
class IconWordDesktop extends React.Component {
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
      viewBox: "0 0 96 96",
      width: width
    }, /*#__PURE__*/React.createElement("path", {
      d: "M47 81.5c-.8 0-1.5-.7-1.5-1.5V16c0-.8.7-1.5 1.5-1.5h42c.8 0 1.5.7 1.5 1.5v64c0 .8-.7 1.5-1.5 1.5H47z",
      fill: "#FFF"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M89 16v64H47V16h42m0-3H47c-1.7 0-3 1.3-3 3v64c0 1.7 1.3 3 3 3h42c1.7 0 3-1.3 3-3V16c0-1.7-1.3-3-3-3z",
      fill: "#2B579A"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M50 23h32v4H50zm0 9h32v4H50zm0 9h32v4H50zm0 9h32v4H50zm0 9h32v4H50zm0 9h32v4H50z",
      fill: "#2B579A"
    }), /*#__PURE__*/React.createElement("path", {
      clipRule: "evenodd",
      d: "M56 4L4 13v70l52 9V4z",
      fill: "#2B579A",
      fillRule: "evenodd"
    }), /*#__PURE__*/React.createElement("g", {
      opacity: "0.05"
    }, /*#__PURE__*/React.createElement("linearGradient", {
      gradientUnits: "userSpaceOnUse",
      id: `${this.idPrefix}a`,
      x1: "4",
      x2: "56",
      y1: "48",
      y2: "48"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#FFF"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1"
    })), /*#__PURE__*/React.createElement("path", {
      clipRule: "evenodd",
      d: "M56 4L4 13v70l52 9V4z",
      fill: `url(#${this.idPrefix}a)`,
      fillRule: "evenodd"
    })), /*#__PURE__*/React.createElement("path", {
      d: "M43.6 32.7L38 33l-3.3 19.3c0 .3-.1.5-.1.8 0 .3-.1.5-.1.8 0 .3-.1.5-.1.8v.8h-.1c0-.3-.1-.7-.1-1 0-.3-.1-.6-.1-.8 0-.3-.1-.5-.1-.7 0-.2-.1-.4-.1-.6l-3.8-18.9-5.3.3-3.9 18.1c-.1.3-.1.5-.2.8 0 .3-.1.5-.1.8 0 .3-.1.5-.1.8v.7h-.1v-.9c0-.3 0-.6-.1-.8 0-.3 0-.5-.1-.7 0-.2-.1-.4-.1-.6l-2.9-17.6-4.9.3 5.2 26.1 5.4.3 3.7-17.5c0-.2.1-.4.1-.7 0-.2.1-.5.1-.7 0-.3.1-.5.1-.8 0-.3.1-.6.1-.9h.1v.9c0 .3 0 .5.1.8 0 .3.1.5.1.7 0 .2.1.5.1.7l3.7 18 5.9.4 6.6-29.3",
      fill: "#FFF"
    }));
  }
}
_defineProperty(IconWordDesktop, "defaultProps", {
  className: '',
  height: 30,
  width: 30
});
export default IconWordDesktop;
//# sourceMappingURL=IconWordDesktop.js.map