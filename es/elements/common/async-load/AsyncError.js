function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
class AsyncError extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      error: null
    });
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  render() {
    const {
      children,
      component: ErrorComponent
    } = this.props;
    const {
      error
    } = this.state;
    return error ? /*#__PURE__*/React.createElement(ErrorComponent, {
      error: error
    }) : children;
  }
}
_defineProperty(AsyncError, "defaultProps", {
  component: () => null
});
export default AsyncError;
//# sourceMappingURL=AsyncError.js.map