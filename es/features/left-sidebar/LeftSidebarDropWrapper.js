const _excluded = ["children", "className", "isDragging", "showDropZoneOnHover", "message", "dropTargetRef"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import './styles/LeftSidebarDropWrapper.scss';
class LeftSidebarDropWrapper extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      dropZoneHover: false
    });
    _defineProperty(this, "handleDropZoneHover", () => this.setState({
      dropZoneHover: true
    }));
    _defineProperty(this, "handleDropZoneHoverLeave", () => this.setState({
      dropZoneHover: false
    }));
  }
  componentDidUpdate(prevProps) {
    const {
      showDropZoneOnHover,
      isDragging
    } = this.props;

    // Reset drop zone hover state if dragging has stopped without firing a mouseleave event.
    if (showDropZoneOnHover && !isDragging && prevProps.isDragging) {
      this.setState({
        dropZoneHover: false
      });
    }
  }
  render() {
    const _this$props = this.props,
      {
        children,
        className = '',
        isDragging = false,
        showDropZoneOnHover = false,
        message = '',
        dropTargetRef
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const {
      dropZoneHover
    } = this.state;
    const shouldShowVeil = isDragging && (showDropZoneOnHover ? dropZoneHover : true);
    const hoverEventHandlers = isDragging && showDropZoneOnHover ? {
      onMouseEnter: this.handleDropZoneHover,
      onMouseLeave: this.handleDropZoneHoverLeave
    } : {};
    const classes = classNames('left-sidebar-drop-wrapper', className);
    return /*#__PURE__*/React.createElement("div", _extends({
      ref: dropTargetRef,
      className: classes
    }, hoverEventHandlers, rest), shouldShowVeil ? /*#__PURE__*/React.createElement("div", {
      className: "left-sidebar-drop-veil"
    }, /*#__PURE__*/React.createElement("span", {
      className: "left-sidebar-drop-wrapper-text"
    }, message)) : null, children);
  }
}
export default LeftSidebarDropWrapper;
//# sourceMappingURL=LeftSidebarDropWrapper.js.map