function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import AccessibleSVG from '../accessible-svg';
const ICON_CLASS = 'icon-trophy-cup';
class IconTrophyCup extends React.PureComponent {
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
      viewBox: "0 0 36 30",
      width: width
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("path", {
      d: "M18 15.707c6.395 0 11.579-5.1 11.579-11.393H6.42c0 6.292 5.184 11.393 11.579 11.393z",
      id: `${this.idPrefix}b`
    }), /*#__PURE__*/React.createElement("filter", {
      filterUnits: "objectBoundingBox",
      height: "126.3%",
      id: `${this.idPrefix}a`,
      width: "113%",
      x: "-6.5%",
      y: "-13.2%"
    }, /*#__PURE__*/React.createElement("feOffset", {
      in: "SourceAlpha",
      result: "shadowOffsetOuter1"
    }), /*#__PURE__*/React.createElement("feGaussianBlur", {
      in: "shadowOffsetOuter1",
      result: "shadowBlurOuter1",
      stdDeviation: ".5"
    }), /*#__PURE__*/React.createElement("feColorMatrix", {
      in: "shadowBlurOuter1",
      values: "0 0 0 0 0.960784314 0 0 0 0 0.725490196 0 0 0 0 0.352941176 0 0 0 0.32 0"
    }))), /*#__PURE__*/React.createElement("g", {
      fill: "none",
      fillRule: "evenodd"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M32.822 4.173h-16.17c.546 3.901 3.954 6.911 8.085 6.911 4.13 0 7.539-3.01 8.085-6.911z",
      stroke: "#F8D371",
      strokeWidth: "2.203"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M19.348 4.173H3.178c.546 3.901 3.955 6.911 8.085 6.911 4.13 0 7.539-3.01 8.085-6.911z",
      stroke: "#F8D371",
      strokeWidth: "2.203"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6.972 1h22.056a.55.55 0 0 1 .55.55v2.764H6.422V1.551A.55.55 0 0 1 6.971 1z",
      fill: "#F5B95A"
    }), /*#__PURE__*/React.createElement("rect", {
      fill: "#F5B95A",
      height: "3.314",
      rx: ".551",
      width: "10.947",
      x: "12.526",
      y: "18.607"
    }), /*#__PURE__*/React.createElement("rect", {
      fill: "#0061D5",
      height: "8",
      rx: ".551",
      width: "16.632",
      x: "9.789",
      y: "20.3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10.34 20.3h15.53a.55.55 0 0 1 .551.55v7.45H9.79v-7.45a.55.55 0 0 1 .551-.55z",
      fill: "#FC627A"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M11.603 20.3h12.794a.55.55 0 0 1 .55.55v7.45H11.053v-7.45a.55.55 0 0 1 .55-.55z",
      fill: "#FFF",
      fillOpacity: ".2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M15.474 13.221h5.052L18.842 21.3h-1.684z",
      fill: "#F5B95A"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M14.34 20.3h7.11a.55.55 0 0 1 .55.55v7.45h-8.21v-7.45a.55.55 0 0 1 .55-.55z",
      fill: "#FC627A"
    }), /*#__PURE__*/React.createElement("use", {
      fill: "#000",
      filter: `url(#${this.idPrefix}a)`,
      xlinkHref: `#${this.idPrefix}b`
    }), /*#__PURE__*/React.createElement("use", {
      fill: "#F8D371",
      xlinkHref: `#${this.idPrefix}b`
    })));
  }
}
_defineProperty(IconTrophyCup, "defaultProps", {
  className: '',
  height: 30,
  width: 36
});
export default IconTrophyCup;
//# sourceMappingURL=IconTrophyCup.js.map