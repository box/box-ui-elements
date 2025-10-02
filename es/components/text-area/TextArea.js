const _excluded = ["className", "description", "error", "errorTooltipPosition", "hideLabel", "hideOptionalLabel", "isRequired", "isResizable", "label", "textareaRef", "tooltipTetherClassName"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import Label from '../label';
import Tooltip from '../tooltip';
import './TextArea.scss';
const TextArea = _ref => {
  let {
      className = '',
      description,
      error,
      errorTooltipPosition,
      hideLabel,
      hideOptionalLabel,
      isRequired,
      isResizable,
      label,
      textareaRef,
      tooltipTetherClassName
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const hasError = !!error;
  const classes = classNames(className, 'text-area-container', {
    'show-error': hasError
  });
  const errorMessageID = React.useRef(uniqueId('errorMessage')).current;
  const descriptionID = React.useRef(uniqueId('description')).current;
  const ariaAttrs = {
    'aria-invalid': hasError,
    'aria-required': isRequired,
    'aria-errormessage': errorMessageID,
    'aria-describedby': description ? descriptionID : undefined
  };
  return /*#__PURE__*/React.createElement("div", {
    className: classes
  }, /*#__PURE__*/React.createElement(Label, {
    hideLabel: hideLabel,
    showOptionalText: !hideOptionalLabel && !isRequired,
    text: label
  }, !!description && /*#__PURE__*/React.createElement("div", {
    id: descriptionID,
    className: "text-area-description"
  }, description), /*#__PURE__*/React.createElement(Tooltip, {
    isShown: hasError,
    position: errorTooltipPosition || 'bottom-left',
    tetherElementClassName: tooltipTetherClassName,
    text: error || '',
    theme: "error"
  }, /*#__PURE__*/React.createElement("textarea", _extends({
    ref: textareaRef,
    required: isRequired,
    style: {
      resize: isResizable ? '' : 'none'
    }
  }, ariaAttrs, rest))), /*#__PURE__*/React.createElement("span", {
    id: errorMessageID,
    className: "accessibility-hidden",
    role: "alert"
  }, error)));
};
TextArea.displayName = 'TextArea';
export default TextArea;
//# sourceMappingURL=TextArea.js.map