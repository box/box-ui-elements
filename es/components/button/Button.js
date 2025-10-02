const _excluded = ["children", "className", "icon", "isDisabled", "isLoading", "isSelected", "setRef", "size", "type", "showRadar"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* eslint-disable react/button-has-type */

import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import LoadingIndicator from '../loading-indicator';
import RadarAnimation from '../radar';
export let ButtonType = /*#__PURE__*/function (ButtonType) {
  ButtonType["BUTTON"] = "button";
  ButtonType["RESET"] = "reset";
  ButtonType["SUBMIT"] = "submit";
  return ButtonType;
}({});
class Button extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "btnElement", null);
    _defineProperty(this, "handleClick", event => {
      const {
        isDisabled,
        onClick
      } = this.props;
      if (isDisabled || this.btnElement && this.btnElement.classList.contains('is-disabled')) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      if (onClick) {
        onClick(event);
      }
    });
  }
  render() {
    const _this$props = this.props,
      {
        children,
        className,
        icon,
        isDisabled,
        isLoading,
        isSelected,
        setRef,
        size,
        type,
        showRadar
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const buttonProps = omit(rest, ['onClick']);
    if (isDisabled) {
      buttonProps['aria-disabled'] = true;
    }
    const styleClassName = classNames('btn', {
      'is-disabled': isDisabled,
      'is-loading': isLoading,
      'is-selected': isSelected,
      'bdl-is-disabled': isDisabled,
      'bdl-btn--large': size === 'large',
      'bdl-has-icon': !!icon
    }, className);
    let button = /*#__PURE__*/React.createElement("button", _extends({
      ref: element => {
        this.btnElement = element;
        if (setRef) {
          setRef(element);
        }
      },
      className: styleClassName,
      onClick: this.handleClick,
      type: type
    }, buttonProps), children ? /*#__PURE__*/React.createElement("span", {
      className: "btn-content"
    }, children) : null, icon ? /*#__PURE__*/React.createElement("span", {
      className: "bdl-btn-icon"
    }, /*#__PURE__*/React.cloneElement(icon, {
      width: icon && children ? 16 : 20,
      height: icon && children ? 16 : 20
    })) : null, isLoading && /*#__PURE__*/React.createElement(LoadingIndicator, {
      className: "btn-loading-indicator"
    }));
    if (showRadar) {
      button = /*#__PURE__*/React.createElement(RadarAnimation, null, button);
    }
    return button;
  }
}
_defineProperty(Button, "defaultProps", {
  className: '',
  isLoading: false,
  showRadar: false,
  type: ButtonType.SUBMIT
});
export default Button;
//# sourceMappingURL=Button.js.map