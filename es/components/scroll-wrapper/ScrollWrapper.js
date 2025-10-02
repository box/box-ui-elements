const _excluded = ["children", "className", "scrollRefFn", "shadowSize"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import throttle from 'lodash/throttle';
import './ScrollWrapper.scss';
class ScrollWrapper extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "state", {
      shouldShowTopScrollShadow: false,
      shouldShowBottomScrollShadow: false
    });
    _defineProperty(this, "componentDidMount", () => {
      const newState = this.getScrollShadowState();
      this.setState(newState);
      if (this.scrollRef) {
        this.scrollRef.addEventListener('transitionend', this.throttledOnContentScroll);

        // Apparently, flow only allows for one truthy check per command, so I have to either:
        // 1) duplicate this check per call, or
        // 2) nest if checks (_slightly more performant_)
        if (this.scrollRef) {
          this.observer.observe(this.scrollRef, {
            attributes: true,
            childlist: true,
            subtree: true
          });
        }
      }
    });
    _defineProperty(this, "onContentScroll", () => {
      const newState = this.getScrollShadowState();
      this.setState(newState);
    });
    _defineProperty(this, "getScrollShadowState", () => {
      const {
        scrollTop,
        scrollHeight,
        clientHeight
      } = this.scrollRef || {};
      const newState = {};
      if (scrollTop > 0 && scrollTop < scrollHeight - clientHeight) {
        newState.shouldShowTopScrollShadow = true;
        newState.shouldShowBottomScrollShadow = true;
      }
      if (scrollTop === 0) {
        newState.shouldShowTopScrollShadow = false;
      }
      if (scrollTop < scrollHeight - clientHeight) {
        newState.shouldShowBottomScrollShadow = true;
      }
      if (scrollTop === scrollHeight - clientHeight) {
        newState.shouldShowBottomScrollShadow = false;
      }
      return newState;
    });
    _defineProperty(this, "scrollRef", null);
    // Throttle to 10 fps
    _defineProperty(this, "throttledOnContentScroll", throttle(this.onContentScroll, 100));
    this.observer = new MutationObserver(this.throttledOnContentScroll);
  }
  componentWillUnmount() {
    this.observer.disconnect();
    if (this.scrollRef) {
      this.scrollRef.removeEventListener('transitionend', this.throttledOnContentScroll);
    }
  }
  render() {
    const _this$props = this.props,
      {
        children,
        className = '',
        scrollRefFn,
        shadowSize
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const {
      shouldShowTopScrollShadow,
      shouldShowBottomScrollShadow
    } = this.state;
    const classes = classNames(`scroll-container`, className, {
      'is-showing-top-shadow': shouldShowTopScrollShadow,
      'is-showing-bottom-shadow': shouldShowBottomScrollShadow
    });
    return /*#__PURE__*/React.createElement("div", _extends({
      className: classes
    }, rest), /*#__PURE__*/React.createElement("div", {
      className: classNames('scroll-wrap-container', `style--${shadowSize}`),
      onScroll: this.throttledOnContentScroll,
      ref: el => {
        this.scrollRef = el;
        scrollRefFn(el);
      }
    }, children));
  }
}
_defineProperty(ScrollWrapper, "defaultProps", {
  scrollRefFn: noop,
  shadowSize: 'cover'
});
export default ScrollWrapper;
//# sourceMappingURL=ScrollWrapper.js.map