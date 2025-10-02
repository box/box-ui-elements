function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import Checkbox from '../../components/checkbox';
import TextInput from '../../components/text-input';
import Fieldset from '../../components/fieldset';
import ExclamationMarkBadge16 from '../../icon/line/ExclamationMarkBadge16';
import messages from './messages';
const PasswordSection = ({
  canChangePassword,
  error,
  intl: {
    formatMessage
  },
  isPasswordAvailable,
  isPasswordEnabled,
  isPasswordInitiallyEnabled,
  onCheckboxChange,
  onPasswordChange,
  password,
  passwordCheckboxProps = {},
  passwordInformationText,
  passwordInputProps = {}
}) => {
  if (!isPasswordAvailable) {
    return null;
  }
  const passwordInput = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TextInput, _extends({
    disabled: !canChangePassword,
    error: error,
    hideLabel: true,
    isRequired: !isPasswordInitiallyEnabled,
    label: /*#__PURE__*/React.createElement(FormattedMessage, messages.passwordPlaceholder),
    maxLength: 100 /* maxlength due to backend constraint */,
    name: "password",
    onChange: onPasswordChange,
    placeholder: isPasswordInitiallyEnabled ? '••••••••' : formatMessage(messages.passwordPlaceholder),
    type: "password",
    value: password
  }, passwordInputProps)), passwordInformationText && /*#__PURE__*/React.createElement("div", {
    className: "be password-section-information"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(ExclamationMarkBadge16, {
    className: "password-section-information-icon",
    height: 12,
    width: 12
  })), /*#__PURE__*/React.createElement("span", {
    className: "password-section-information-text"
  }, passwordInformationText)));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(Fieldset, {
    className: "be password-section",
    title: /*#__PURE__*/React.createElement(FormattedMessage, messages.passwordTitle)
  }, /*#__PURE__*/React.createElement(Checkbox, _extends({
    isChecked: isPasswordEnabled,
    isDisabled: !canChangePassword,
    label: /*#__PURE__*/React.createElement(FormattedMessage, messages.passwordLabel),
    name: "isPasswordEnabled",
    onChange: onCheckboxChange,
    subsection: isPasswordEnabled ? passwordInput : undefined
  }, passwordCheckboxProps))));
};
PasswordSection.propTypes = {
  canChangePassword: PropTypes.bool.isRequired,
  error: PropTypes.string,
  intl: PropTypes.any,
  isPasswordAvailable: PropTypes.bool.isRequired,
  isPasswordEnabled: PropTypes.bool.isRequired,
  isPasswordInitiallyEnabled: PropTypes.bool.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  password: PropTypes.string,
  passwordCheckboxProps: PropTypes.object,
  passwordInformationText: PropTypes.string,
  passwordInputProps: PropTypes.object
};
export { PasswordSection as PasswordSectionBase };
export default injectIntl(PasswordSection);
//# sourceMappingURL=PasswordSection.js.map