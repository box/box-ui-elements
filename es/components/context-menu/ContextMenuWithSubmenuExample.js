function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { Menu, SubmenuItem, MenuItem } from '../menu';
import ContextMenu from './ContextMenu';
class ContextMenuWithSubmenuExample extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      rightBoundaryElement: undefined,
      bottomBoundaryElement: undefined
    });
  }
  render() {
    return /*#__PURE__*/React.createElement(ContextMenu, null, /*#__PURE__*/React.createElement("div", {
      ref: ref => {
        if (!this.state.rightBoundaryElement) {
          this.setState({
            rightBoundaryElement: ref
          });
        }
      },
      className: "context-menu-example-target",
      style: {
        height: 200
      }
    }, "Target Component - right click me"), /*#__PURE__*/React.createElement(Menu, {
      setRef: ref => {
        if (!this.state.bottomBoundaryElement) {
          this.setState({
            bottomBoundaryElement: ref
          });
        }
      }
    }, /*#__PURE__*/React.createElement(MenuItem, null, "View Profile"), /*#__PURE__*/React.createElement(MenuItem, null, "View Profile"), this.state.rightBoundaryElement && /*#__PURE__*/React.createElement(SubmenuItem, {
      bottomBoundaryElement: this.state.bottomBoundaryElement,
      rightBoundaryElement: this.state.rightBoundaryElement
    }, "Submenu", /*#__PURE__*/React.createElement(Menu, null, /*#__PURE__*/React.createElement(MenuItem, null, "View Profile"), /*#__PURE__*/React.createElement(MenuItem, null, "View Profile"), /*#__PURE__*/React.createElement(MenuItem, null, "View Profile"))), /*#__PURE__*/React.createElement(MenuItem, null, "Help")));
  }
}
export default ContextMenuWithSubmenuExample;
//# sourceMappingURL=ContextMenuWithSubmenuExample.js.map