const _excluded = ["body", "children", "className", "icon", "image", "isShown", "primaryButtonProps", "steps", "secondaryButtonProps", "showCloseButton", "title"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import Tooltip, { TooltipTheme } from '../tooltip';
import Button from '../button';
// @ts-ignore flow import
import messages from './messages';
import './GuideTooltip.scss';
function GuideTooltip(_ref) {
  let {
      body,
      children,
      className = '',
      icon,
      image,
      isShown = true,
      primaryButtonProps,
      steps,
      secondaryButtonProps,
      showCloseButton = true,
      title
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(Tooltip, _extends({}, rest, {
    className: `bdl-GuideTooltip ${className}`,
    isShown: isShown,
    showCloseButton: showCloseButton,
    text: /*#__PURE__*/React.createElement(React.Fragment, null, icon && /*#__PURE__*/React.createElement("div", {
      className: "bdl-GuideTooltip-icon"
    }, icon), /*#__PURE__*/React.createElement("div", {
      className: "bdl-GuideTooltip-right"
    }, title && /*#__PURE__*/React.createElement("div", {
      className: "bdl-GuideTooltip-title"
    }, title), !icon && image && /*#__PURE__*/React.createElement("div", {
      className: "bdl-GuideTooltip-image"
    }, image), /*#__PURE__*/React.createElement("div", {
      className: "bdl-GuideTooltip-body"
    }, body), (secondaryButtonProps || primaryButtonProps || steps) && /*#__PURE__*/React.createElement("div", {
      className: "bdl-GuideTooltip-bottom"
    }, (secondaryButtonProps || primaryButtonProps) && /*#__PURE__*/React.createElement("div", {
      className: "bdl-GuideTooltip-navigation"
    }, secondaryButtonProps && /*#__PURE__*/React.createElement(Button, _extends({}, secondaryButtonProps, {
      className: classNames('bdl-GuideTooltip-previousButton', secondaryButtonProps.className)
    })), primaryButtonProps && /*#__PURE__*/React.createElement(Button, _extends({}, primaryButtonProps, {
      className: classNames('bdl-GuideTooltip-nextButton', primaryButtonProps.className)
    }))), steps && /*#__PURE__*/React.createElement("div", {
      className: "bdl-GuideTooltip-steps"
    }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.navigation, {
      values: {
        currentStepIndex: steps[0],
        totalNumSteps: steps[1]
      }
    })))))),
    theme: TooltipTheme.CALLOUT
  }), children);
}
export default GuideTooltip;
//# sourceMappingURL=GuideTooltip.js.map