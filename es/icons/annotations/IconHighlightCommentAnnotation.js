function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import AccessibleSVG from '../accessible-svg';
const ICON_CLASS = 'icon-annotation-highlight-comment';
class IconHighlightCommentAnnotation extends React.Component {
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
      viewBox: "0 0 20 20",
      width: width
    }, /*#__PURE__*/React.createElement("g", {
      fill: "none",
      fillRule: "evenodd"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M-2-2h24v24H-2"
    }), /*#__PURE__*/React.createElement("path", {
      className: "icon",
      d: "M18 0H2C.9 0 .01.9.01 2L0 20l4-4h14c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zM4 7h10v2H4V7zm8 5H4v-2h8v2zm4-6H4V4h12v2z",
      fill: "#000"
    })));
  }
}
_defineProperty(IconHighlightCommentAnnotation, "defaultProps", {
  className: '',
  height: 20,
  width: 20
});
export default IconHighlightCommentAnnotation;
//# sourceMappingURL=IconHighlightCommentAnnotation.js.map