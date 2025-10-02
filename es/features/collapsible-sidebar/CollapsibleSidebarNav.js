const _excluded = ["elementRef"],
  _excluded2 = ["elementRef", "style"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Scroll container for lists to be used within CollapsibleSidebar component.
 * @author Box
 *
 * A Scroll container for lists to be used within CollapsibleSidebar component.
 * Applies scroll shadow in the container based on scroll position.
 */

import * as React from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import Scrollbar from 'react-scrollbars-custom';
import styled from 'styled-components';
import CollapsibleSidebarContext from './CollapsibleSidebarContext';
import { getScrollShadowClassName } from './utils/scrollShadow';
const StyledScrollThumb = styled.div.withConfig({
  displayName: "CollapsibleSidebarNav__StyledScrollThumb",
  componentId: "sc-csqupn-0"
})(["background:", ";opacity:0;transition:opacity 0.15s;.scroll-shadow-container:hover &,&.dragging{opacity:0.5;}"], props => props.theme.primary.foreground);

// The following values match the derived values from scrollShadow.scss
const StyledScrollContainer = styled.div.withConfig({
  displayName: "CollapsibleSidebarNav__StyledScrollContainer",
  componentId: "sc-csqupn-1"
})(["&::before{box-shadow:0 6px 6px -2px ", ";}&::after{box-shadow:0 -6px 6px -2px ", ";}"], props => props.theme.primary.scrollShadowRgba, props => props.theme.primary.scrollShadowRgba);
class CollapsibleSidebarNav extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "scrollRef", /*#__PURE__*/React.createRef());
    _defineProperty(this, "turnOffScrollingState", () => {
      this.setState({
        isScrolling: false
      });
    });
    // If there hasn't been an update to isScrolling in 100ms, it'll be set to false.
    // eslint-disable-next-line react/sort-comp
    _defineProperty(this, "debouncedTurnOffScrollingState", debounce(this.turnOffScrollingState, 100));
    _defineProperty(this, "onScrollHandler", () => {
      if (!this.scrollRef.current) {
        return;
      }
      const {
        scrollHeight,
        clientHeight,
        scrollTop
      } = this.scrollRef.current;
      const scrollShadowClassName = getScrollShadowClassName(scrollTop, scrollHeight, clientHeight);
      this.setState({
        isScrolling: true,
        scrollShadowClassName
      });
      this.debouncedTurnOffScrollingState();
    });
    _defineProperty(this, "onUpdateHandler", (scrollValues, prevScrollValues) => {
      const {
        clientHeight,
        contentScrollHeight
      } = scrollValues;
      const {
        clientHeight: prevClientHeight,
        contentScrollHeight: prevContentScrollHeight
      } = prevScrollValues;
      if (clientHeight !== prevClientHeight || contentScrollHeight !== prevContentScrollHeight) {
        this.setScrollShadowState();
      }
    });
    _defineProperty(this, "setScrollShadowState", () => {
      if (!this.scrollRef.current) {
        return;
      }
      const {
        scrollShadowClassName
      } = this.state;
      const {
        scrollHeight,
        clientHeight,
        scrollTop
      } = this.scrollRef.current;
      const newScrollShadowClassName = getScrollShadowClassName(scrollTop, scrollHeight, clientHeight);
      if (scrollShadowClassName !== newScrollShadowClassName) {
        this.setState({
          scrollShadowClassName: newScrollShadowClassName
        });
      }
    });
    // sets onScrollHandler to true for a maximum of once every 50ms.
    _defineProperty(this, "throtteldOnScrollHandler", throttle(this.onScrollHandler, 50));
    _defineProperty(this, "throttleOnUpdateHandler", throttle(this.onUpdateHandler, 50));
    this.state = {
      isScrolling: false
    };
  }
  componentDidMount() {
    this.setScrollShadowState();
  }
  render() {
    const {
      className,
      children,
      customScrollBarProps = {}
    } = this.props;
    const {
      isScrolling,
      scrollShadowClassName
    } = this.state;
    const classes = classNames('bdl-CollapsibleSidebar-nav', className, {
      'is-scrolling': isScrolling
    });
    return /*#__PURE__*/React.createElement(CollapsibleSidebarContext.Provider, {
      value: {
        isScrolling
      }
    }, /*#__PURE__*/React.createElement(Scrollbar, _extends({
      ref: this.scrollRef,
      className: scrollShadowClassName,
      noScrollX: true,
      onScroll: this.throtteldOnScrollHandler,
      onUpdate: this.throttleOnUpdateHandler,
      renderer: props => {
        const {
            elementRef
          } = props,
          restProps = _objectWithoutProperties(props, _excluded);
        return /*#__PURE__*/React.createElement(StyledScrollContainer, _extends({}, restProps, {
          ref: elementRef
        }));
      },
      style: {
        height: 'auto',
        width: '100%',
        flexGrow: 1
      },
      thumbYProps: {
        renderer: renderProps => {
          const {
              elementRef,
              style
            } = renderProps,
            restProps = _objectWithoutProperties(renderProps, _excluded2);
          if (style && style.background) {
            delete style.background; // remove the hardcoded valued so that the theme value can be assigned
          }
          return /*#__PURE__*/React.createElement(StyledScrollThumb, _extends({
            style: style
          }, restProps, {
            ref: elementRef
          }));
        }
      },
      trackYProps: {
        style: {
          background: 'none',
          top: '0',
          height: '100%',
          width: '8px',
          marginRight: '1px'
        }
      }
    }, customScrollBarProps), /*#__PURE__*/React.createElement("div", {
      className: classes
    }, children)));
  }
}
export default CollapsibleSidebarNav;
//# sourceMappingURL=CollapsibleSidebarNav.js.map