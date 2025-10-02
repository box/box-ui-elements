const _excluded = ["isTouch", "size", "className", "componentRef"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file HOC to make responsive Box UI Elements
 * @author Box
 */

import * as React from 'react';
import debounce from 'lodash/debounce';
import Measure from 'react-measure';
import classNames from 'classnames';
import { CLASS_IS_MEDIUM, CLASS_IS_SMALL, CLASS_IS_TOUCH, SIZE_LARGE, SIZE_MEDIUM, SIZE_SMALL, SIZE_VERY_LARGE } from '../../constants';
const CROSS_OVER_WIDTH_SMALL = 700;
const CROSS_OVER_WIDTH_MEDIUM = 1000;
const CROSS_OVER_WIDTH_LARGE = 1500;
const HAS_TOUCH = !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch);
function makeResponsive(Wrapped) {
  var _Class;
  return _Class = class extends React.PureComponent {
    /**
     * [constructor]
     *
     * @param {*} data
     * @return {void}
     */
    constructor(props) {
      super(props);
      /**
       * Resizing function
       *
       * @private
       * @param {Component} react component
       * @return {void}
       */
      _defineProperty(this, "onResize", debounce(({
        bounds: {
          width
        }
      }) => {
        this.setState({
          size: this.getSize(width)
        });
      }, 500));
      /**
       * Callback function for setting the ref which measureRef is attached to
       *
       * @return {void}
       */
      _defineProperty(this, "innerRef", el => {
        this.innerElement = el;
      });
      /**
       * Gets the ref element which measureRef is attached to
       *
       * @return {?HTMLElement} - the HTML element
       */
      _defineProperty(this, "getInnerElement", () => this.innerElement);
      this.state = {
        size: props.size || this.getSize(window.innerWidth)
      };
    }

    /**
     * Calculates the new size
     *
     * @private
     * @param {Component} react component
     * @return {void}
     */
    getSize(width) {
      let size = SIZE_VERY_LARGE;
      if (width <= CROSS_OVER_WIDTH_SMALL) {
        size = SIZE_SMALL;
      } else if (width <= CROSS_OVER_WIDTH_MEDIUM) {
        size = SIZE_MEDIUM;
      } else if (width <= CROSS_OVER_WIDTH_LARGE) {
        size = SIZE_LARGE;
      }
      return size;
    }
    /**
     * Renders the Box UI Element
     *
     * @private
     * @inheritdoc
     * @return {Element}
     */
    render() {
      const _this$props = this.props,
        {
          isTouch,
          size,
          className,
          componentRef
        } = _this$props,
        rest = _objectWithoutProperties(_this$props, _excluded);
      let isLarge = size === SIZE_LARGE;
      let isMedium = size === SIZE_MEDIUM;
      let isSmall = size === SIZE_SMALL;
      let isVeryLarge = size === SIZE_VERY_LARGE;
      const isResponsive = !isSmall && !isLarge && !isMedium && !isVeryLarge;
      if ([isSmall, isMedium, isLarge, isVeryLarge].filter(item => item).length > 1) {
        throw new Error('Box UI Element cannot be small or medium or large or very large at the same time');
      }
      if (!isResponsive) {
        return /*#__PURE__*/React.createElement(Wrapped, _extends({
          ref: componentRef,
          className: className,
          isLarge: isLarge,
          isMedium: isMedium,
          isSmall: isSmall,
          isTouch: isTouch,
          isVeryLarge: isVeryLarge
        }, rest));
      }
      const {
        size: sizeFromState
      } = this.state;
      isSmall = sizeFromState === SIZE_SMALL;
      isMedium = sizeFromState === SIZE_MEDIUM;
      isLarge = sizeFromState === SIZE_LARGE;
      isVeryLarge = sizeFromState === SIZE_VERY_LARGE;
      const styleClassName = classNames({
        [CLASS_IS_SMALL]: isSmall,
        [CLASS_IS_MEDIUM]: isMedium,
        [CLASS_IS_TOUCH]: isTouch
      }, className);
      return /*#__PURE__*/React.createElement(Measure, {
        bounds: true,
        innerRef: this.innerRef,
        onResize: this.onResize
      }, ({
        measureRef
      }) => /*#__PURE__*/React.createElement(Wrapped, _extends({
        ref: componentRef,
        className: styleClassName,
        getInnerRef: this.getInnerElement,
        isLarge: isLarge,
        isMedium: isMedium,
        isSmall: isSmall,
        isTouch: isTouch,
        isVeryLarge: isVeryLarge,
        measureRef: measureRef
      }, rest)));
    }
  }, _defineProperty(_Class, "defaultProps", {
    className: '',
    isTouch: HAS_TOUCH
  }), _Class;
}
export default makeResponsive;
//# sourceMappingURL=makeResponsive.js.map