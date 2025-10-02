function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import AccessibleSVG from '../accessible-svg';
const ICON_CLASS = 'icon-trophy-cup-with-tooltip';
class IconTrophyCupWithTooltip extends React.PureComponent {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "idPrefix", `${uniqueId(ICON_CLASS)}-`);
  }
  render() {
    const {
      className,
      height,
      title,
      tooltipColor,
      tooltipText,
      width
    } = this.props;
    return /*#__PURE__*/React.createElement(AccessibleSVG, {
      className: `${ICON_CLASS} ${className}`,
      height: height,
      title: title,
      viewBox: "0 0 60 54",
      width: width
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("path", {
      d: "M30 38.707c6.395 0 11.579-5.1 11.579-11.393H18.42c0 6.292 5.184 11.393 11.579 11.393z",
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
      d: "M44.822 27.173h-16.17c.546 3.901 3.954 6.911 8.085 6.911 4.13 0 7.539-3.01 8.085-6.911z",
      stroke: "#F8D371",
      strokeWidth: "2.203"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M31.348 27.173h-16.17c.546 3.901 3.955 6.911 8.085 6.911 4.13 0 7.539-3.01 8.085-6.911z",
      stroke: "#F8D371",
      strokeWidth: "2.203"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M18.972 24h22.056a.55.55 0 0 1 .55.55v2.764H18.422v-2.763a.55.55 0 0 1 .55-.551z",
      fill: "#F5B95A"
    }), /*#__PURE__*/React.createElement("rect", {
      fill: "#F5B95A",
      height: "3.314",
      rx: ".551",
      width: "10.947",
      x: "24.526",
      y: "41.607"
    }), /*#__PURE__*/React.createElement("rect", {
      fill: "#0061D5",
      height: "8",
      rx: ".551",
      width: "16.632",
      x: "21.789",
      y: "43.3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M22.34 43.3h15.53a.55.55 0 0 1 .551.55v7.45H21.79v-7.45a.55.55 0 0 1 .551-.55z",
      fill: "#FC627A"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M23.603 43.3h12.794a.55.55 0 0 1 .55.55v7.45H23.053v-7.45a.55.55 0 0 1 .55-.55z",
      fill: "#FFF",
      fillOpacity: ".2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M27.474 36.221h5.052L30.842 44.3h-1.684z",
      fill: "#F5B95A"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M26.34 43.3h7.11a.55.55 0 0 1 .55.55v7.45h-8.21v-7.45a.55.55 0 0 1 .55-.55z",
      fill: "#FC627A"
    }), /*#__PURE__*/React.createElement("use", {
      fill: "#000",
      filter: `url(#${this.idPrefix}a)`,
      xlinkHref: `#${this.idPrefix}b`
    }), /*#__PURE__*/React.createElement("use", {
      fill: "#F8D371",
      xlinkHref: `#${this.idPrefix}b`
    }), /*#__PURE__*/React.createElement("path", {
      d: "M4.564 2h50.872c.892 0 1.215.093 1.54.267.327.174.583.43.757.756.174.326.267.65.267 1.54v14.873c0 .892-.093 1.215-.267 1.54-.174.327-.43.583-.756.757-.326.174-.65.267-1.54.267H32l-2 2-2-2H4.564c-.892 0-1.215-.093-1.54-.267a1.817 1.817 0 0 1-.757-.756c-.174-.326-.267-.65-.267-1.54V4.563c0-.892.093-1.215.267-1.54.174-.327.43-.583.756-.757.326-.174.65-.267 1.54-.267z",
      fill: tooltipColor
    }), /*#__PURE__*/React.createElement("text", {
      fill: "#FFF",
      fontFamily: "Lato-Bold, Lato",
      fontSize: "11",
      fontWeight: "bold",
      letterSpacing: ".6"
    }, /*#__PURE__*/React.createElement("tspan", {
      x: "6.532",
      y: "16"
    }, tooltipText))));
  }
}
_defineProperty(IconTrophyCupWithTooltip, "defaultProps", {
  className: '',
  height: 54,
  tooltipColor: '#27C281',
  tooltipText: '',
  width: 60
});
export default IconTrophyCupWithTooltip;
//# sourceMappingURL=IconTrophyCupWithTooltip.js.map