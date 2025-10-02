function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
// TODO: convert to stateless function
// eslint-disable-next-line react/prefer-stateless-function
class LinkGroup extends React.Component {
  render() {
    const {
      title,
      children,
      className
    } = this.props;
    return /*#__PURE__*/React.createElement("div", {
      className: `link-group ${className}`
    }, title ? /*#__PURE__*/React.createElement("div", {
      className: "link-group-title"
    }, title) : null, /*#__PURE__*/React.createElement("ul", null, React.Children.map(children, (item, i) => item ? /*#__PURE__*/React.createElement("li", {
      key: i
    }, item, " ") : null)));
  }
}
_defineProperty(LinkGroup, "defaultProps", {
  title: '',
  className: ''
});
export default LinkGroup;
//# sourceMappingURL=LinkGroup.js.map