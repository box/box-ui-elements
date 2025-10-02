function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import AccessibleSVG from '../accessible-svg';
const ICON_CLASS = 'icon-annotation-highlight';
class IconHighlightAnnotation extends React.Component {
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
      focusable: false,
      height: height,
      title: title,
      viewBox: "0 0 24 24",
      width: width
    }, /*#__PURE__*/React.createElement("g", {
      fillRule: "evenodd"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M1 23h11.875v-3H1v3zm9.19-9.854l4.103 4.102.694.694.707-.68 7-6.742.306-.295V.07l-1.673 1.524L10.224 11.7l-.775.705.74.74z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M11.023 12.17L6.33 16.58C5.28 17.62 5.9 19 7.32 19h3.95c.82 0 1.826-.413 2.406-.995l1.544-1.383.768-.69-.713-.745-2.844-2.976-.683-.717-.723.68v-.003zm-.038 1.42l2.844 2.977.053-1.435-1.584 1.42c-.244.243-.74.446-1.03.446l-2.454-.008 3.577-3.36-1.408-.04z"
    })));
  }
}
_defineProperty(IconHighlightAnnotation, "defaultProps", {
  className: '',
  height: 24,
  width: 24
});
export default IconHighlightAnnotation;
//# sourceMappingURL=IconHighlightAnnotation.js.map