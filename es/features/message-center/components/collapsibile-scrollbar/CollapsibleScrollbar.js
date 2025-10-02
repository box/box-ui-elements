const _excluded = ["children", "className", "onScroll", "style", "thumbYStyles", "trackYStyles"],
  _excluded2 = ["elementRef"],
  _excluded3 = ["elementRef", "style"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import Scrollbar from 'react-scrollbars-custom';
import styled from 'styled-components';
import { getScrollShadowClassName } from '../../../collapsible-sidebar/utils/scrollShadow';
const StyledScrollThumb = styled.div.withConfig({
  displayName: "CollapsibleScrollbar__StyledScrollThumb",
  componentId: "sc-6dom38-0"
})(["opacity:0;transition:opacity 0.15s;.scroll-shadow-container:hover &,&.dragging{opacity:0.5;}"]);

// The following values match the derived values from scrollShadow.scss
const StyledScrollContainer = styled.div.withConfig({
  displayName: "CollapsibleScrollbar__StyledScrollContainer",
  componentId: "sc-6dom38-1"
})(["&::before{box-shadow:0 6px 6px -2px ", ";}&::after{box-shadow:0 -6px 6px -2px ", ";}"], props => props.theme.primary.scrollShadowRgba, props => props.theme.primary.scrollShadowRgba);
function CollapsibleScrollbar(_ref, ref) {
  let {
      children,
      className,
      onScroll,
      style,
      thumbYStyles,
      trackYStyles
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const scrollRef = React.useRef(null);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [scrollShadowClassName, setScrollShadowClassName] = React.useState();
  const turnOffScrollingState = () => {
    setIsScrolling(false);
  };

  // If there hasn't been an update to isScrolling in 100ms, it'll be set to false.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedTurnOffScrollingState = React.useCallback(debounce(turnOffScrollingState, 100), []);
  const onScrollHandler = (scrollValues, prevScrollValues) => {
    if (!scrollRef.current) {
      return;
    }
    const {
      scrollHeight,
      clientHeight,
      scrollTop
    } = scrollValues;
    const scrollShadowClassNameValue = getScrollShadowClassName(scrollTop, scrollHeight, clientHeight);
    setIsScrolling(true);
    setScrollShadowClassName(scrollShadowClassNameValue);
    debouncedTurnOffScrollingState();
    if (onScroll) {
      onScroll(scrollValues, prevScrollValues);
    }
  };
  const setScrollShadowState = React.useCallback(() => {
    if (!scrollRef.current) {
      return;
    }
    const {
      scrollHeight,
      clientHeight,
      scrollTop
    } = scrollRef.current;
    const newScrollShadowClassName = getScrollShadowClassName(scrollTop, scrollHeight, clientHeight);
    if (scrollShadowClassName !== newScrollShadowClassName) {
      setScrollShadowClassName(newScrollShadowClassName);
    }
  }, [scrollShadowClassName]);
  const onUpdateHandler = (scrollValues, prevScrollValues) => {
    const {
      clientHeight,
      contentScrollHeight
    } = scrollValues;
    const {
      clientHeight: prevClientHeight,
      contentScrollHeight: prevContentScrollHeight
    } = prevScrollValues;
    if (clientHeight !== prevClientHeight || contentScrollHeight !== prevContentScrollHeight) {
      setScrollShadowState();
    }
  };

  // sets onScrollHandler to true for a maximum of once every 50ms.
  const throttledOnScrollHandler = throttle(onScrollHandler, 50);
  const throttledOnUpdateHandler = throttle(onUpdateHandler, 50);
  const classes = classNames('bdl-CollapsibleScrollbar', className, {
    'is-scrolling': isScrolling
  });
  React.useEffect(() => {
    setScrollShadowState();
  }, [setScrollShadowState]);

  // $FlowFixMe
  React.useImperativeHandle(ref, () => ({
    scrollbarRef: scrollRef
  }));
  return /*#__PURE__*/React.createElement(Scrollbar, _extends({
    ref: scrollRef,
    className: scrollShadowClassName,
    onScroll: throttledOnScrollHandler,
    onUpdate: throttledOnUpdateHandler,
    renderer: props => {
      const {
          elementRef
        } = props,
        restProps = _objectWithoutProperties(props, _excluded2);
      return /*#__PURE__*/React.createElement(StyledScrollContainer, _extends({}, restProps, {
        ref: elementRef
      }));
    },
    style: style,
    thumbYProps: {
      renderer: renderProps => {
        const {
            elementRef,
            style: renderPropStyle
          } = renderProps,
          restProps = _objectWithoutProperties(renderProps, _excluded3);
        return /*#__PURE__*/React.createElement(StyledScrollThumb, _extends({
          style: _objectSpread(_objectSpread({}, renderPropStyle), thumbYStyles)
        }, restProps, {
          ref: elementRef
        }));
      }
    },
    trackYProps: {
      style: _objectSpread({
        background: 'none',
        top: '0',
        height: '100%',
        width: '8px',
        marginRight: '1px'
      }, trackYStyles)
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: classes,
    "data-testid": "content-wrapper"
  }, children));
}
export default /*#__PURE__*/React.forwardRef(CollapsibleScrollbar);
//# sourceMappingURL=CollapsibleScrollbar.js.map