const _excluded = ["className", "description", "error", "errorPosition", "hideLabel", "hideOptionalLabel", "icon", "inputRef", "isLoading", "isRequired", "isValid", "label", "labelTooltip", "tooltipTetherClassName"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import IconVerified from '../../icons/general/IconVerified';
import Label from '../label';
import LoadingIndicator from '../loading-indicator';
import Tooltip from '../tooltip';
import './TextInput.scss';
const TextInput = _ref => {
  let {
      className = '',
      description,
      error,
      errorPosition,
      hideLabel,
      hideOptionalLabel,
      icon,
      inputRef,
      isLoading,
      isRequired,
      isValid,
      label,
      labelTooltip,
      tooltipTetherClassName
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const hasError = !!error;
  const classes = classNames(className, 'text-input-container', {
    'show-error': hasError
  });
  const descriptionID = React.useRef(uniqueId('description')).current;
  const ariaAttrs = {
    'aria-invalid': hasError,
    'aria-required': isRequired,
    'aria-describedby': description ? descriptionID : undefined
  };
  return /*#__PURE__*/React.createElement("div", {
    className: classes
  }, /*#__PURE__*/React.createElement(Label, {
    hideLabel: hideLabel,
    showOptionalText: !hideOptionalLabel && !isRequired,
    text: label,
    tooltip: labelTooltip
  }, !!description && /*#__PURE__*/React.createElement("div", {
    id: descriptionID,
    className: "text-input-description"
  }, description), /*#__PURE__*/React.createElement(Tooltip, {
    isShown: hasError,
    position: errorPosition || 'middle-right',
    tetherElementClassName: tooltipTetherClassName,
    text: error || '',
    theme: "error"
  }, /*#__PURE__*/React.createElement("input", _extends({
    ref: inputRef,
    required: isRequired
  }, ariaAttrs, rest))), isLoading && !isValid && /*#__PURE__*/React.createElement(LoadingIndicator, {
    className: "text-input-loading"
  }), isValid && !isLoading && /*#__PURE__*/React.createElement(IconVerified, {
    className: "text-input-verified"
  }), !isLoading && !isValid && icon ? icon : null));
};
TextInput.displayName = 'TextInput';
export default TextInput;
//# sourceMappingURL=TextInput.js.map