const _excluded = ["children", "title"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
class AccessibleSVG extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "id", uniqueId('icon'));
  }
  render() {
    const _this$props = this.props,
      {
        children,
        title
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const titleID = `${this.id}-title`;

    // Make sure parent doesn't accidentally override these values
    const svgProps = omit(rest, ['role', 'aria-labelledby']);

    // Accessibility fix for IE11, which treats all SVGs as focusable by default
    svgProps.focusable = 'false';
    if (title) {
      svgProps['aria-labelledby'] = titleID;
      svgProps.role = 'img';
    } else {
      svgProps['aria-hidden'] = 'true';
      svgProps.role = 'presentation';
    }
    return /*#__PURE__*/React.createElement("svg", svgProps, title ? /*#__PURE__*/React.createElement("title", {
      id: titleID
    }, title) : null, children);
  }
}
export default AccessibleSVG;
//# sourceMappingURL=AccessibleSVG.js.map