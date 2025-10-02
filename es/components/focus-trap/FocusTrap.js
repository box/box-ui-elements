const _excluded = ["children", "className", "getRef", "handleOverlayKeyDown", "shouldDefaultFocus", "shouldOutlineFocus"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import tabbable from 'tabbable';
import classNames from 'classnames';
class FocusTrap extends React.Component {
  constructor(...args) {
    super(...args);
    /**
     * Focus the first tabbable element
     */
    _defineProperty(this, "focusFirstElement", () => {
      if (!this.el) {
        return;
      }
      const tabbableEls = tabbable(this.el);

      // There are three trap-related elements, including first element.
      // If there are 3 or fewer tabbable elements, that means there are no
      // tabbable children, so focus on the trap element instead.
      if (tabbableEls.length > 3) {
        tabbableEls[1].focus();
      } else if (this.trapEl) {
        this.trapEl.focus();
      }
    });
    /**
     * Focus the last tabbable element
     */
    _defineProperty(this, "focusLastElement", () => {
      if (!this.el) {
        return;
      }
      const tabbableEls = tabbable(this.el);

      // There are three trap-related elements, including the last two elements.
      // If there are 3 or fewer tabbable elements, that means there are no
      // tabbable children, so focus on the trap element instead.
      if (tabbableEls.length > 3) {
        tabbableEls[tabbableEls.length - 3].focus();
      } else if (this.trapEl) {
        this.trapEl.focus();
      }
    });
    _defineProperty(this, "handleElKeyDown", event => {
      const {
        handleOverlayKeyDown
      } = this.props;
      if (this.el === document.activeElement && event.key === 'Tab') {
        this.focusFirstElement();
        event.stopPropagation();
        event.preventDefault();
      }
      if (handleOverlayKeyDown) {
        handleOverlayKeyDown(event);
      }
    });
    _defineProperty(this, "handleTrapElKeyDown", event => {
      if (event.key !== 'Tab') {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
    });
  }
  componentDidMount() {
    if (this.props.shouldDefaultFocus) {
      setTimeout(() => {
        this.previousFocusEl = document.activeElement;
        this.focusFirstElement();
      }, 0);
    } else {
      setTimeout(() => {
        if (this.el) {
          this.el.focus();
        }
      }, 0);
    }
  }
  componentWillUnmount() {
    setTimeout(() => {
      if (this.previousFocusEl) {
        this.previousFocusEl.focus();
      }
    }, 0);
  }
  render() {
    const _this$props = this.props,
      {
        children,
        className,
        getRef,
        handleOverlayKeyDown,
        shouldDefaultFocus,
        shouldOutlineFocus
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    return (
      /*#__PURE__*/
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      React.createElement("div", _extends({
        ref: ref => {
          this.el = ref;
          if (getRef) {
            getRef(ref);
          }
        },
        className: classNames(className, {
          'should-outline-focus': shouldOutlineFocus
        }),
        onKeyDown: this.handleElKeyDown
      }, rest), /*#__PURE__*/React.createElement("i", {
        "aria-hidden": true,
        onFocus: this.focusLastElement,
        tabIndex: "0"
      }), children, /*#__PURE__*/React.createElement("i", {
        "aria-hidden": true,
        onFocus: this.focusFirstElement,
        tabIndex: "0"
      }), /*#__PURE__*/React.createElement("i", {
        ref: ref => {
          this.trapEl = ref;
        },
        "aria-hidden": true,
        onKeyDown: this.handleTrapElKeyDown
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        ,
        tabIndex: "0"
      }))
    );
  }
}
export default FocusTrap;
//# sourceMappingURL=FocusTrap.js.map