function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { bdlGray65 } from '../../styles/variables';
import Checkbox from '../../components/checkbox';
import TextInput from '../../components/text-input';
import Fieldset from '../../components/fieldset';
import QuarantineBadge from '../../icons/badges/QuarantineBadge';
import messages from './messages';
const VanityNameSection = ({
  canChangeVanityName,
  error,
  intl: {
    formatMessage
  },
  isVanityEnabled,
  vanityName,
  vanityNameInputProps = {},
  serverURL,
  onChange,
  onCheckboxChange
}) => {
  const inputValue = canChangeVanityName ? vanityName : vanityName || formatMessage(messages.vanityNameNotSet);
  const vanityURLInput = /*#__PURE__*/React.createElement("div", {
    className: "vanity-name-content"
  }, /*#__PURE__*/React.createElement(TextInput, _extends({
    description: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(QuarantineBadge, {
      color: bdlGray65
    }), /*#__PURE__*/React.createElement(FormattedMessage, messages.vanityURLWarning)),
    hideLabel: true,
    disabled: !canChangeVanityName,
    error: error,
    name: "vanityName",
    onChange: onChange,
    placeholder: formatMessage(messages.vanityNamePlaceholder),
    type: "text",
    value: inputValue
  }, vanityNameInputProps)), (canChangeVanityName || !!vanityName) && /*#__PURE__*/React.createElement("p", {
    className: "custom-url-preview"
  }, `${serverURL}${vanityName}`));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(Fieldset, {
    className: "be vanity-name-section",
    title: /*#__PURE__*/React.createElement(FormattedMessage, messages.customURLLabel)
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: /*#__PURE__*/React.createElement(FormattedMessage, messages.vanityURLEnableText),
    isChecked: isVanityEnabled,
    isDisabled: !canChangeVanityName,
    subsection: isVanityEnabled ? vanityURLInput : undefined,
    onChange: onCheckboxChange
  })));
};
VanityNameSection.propTypes = {
  canChangeVanityName: PropTypes.bool.isRequired,
  error: PropTypes.string,
  intl: PropTypes.any,
  isVanityEnabled: PropTypes.bool.isRequired,
  vanityName: PropTypes.string.isRequired,
  vanityNameInputProps: PropTypes.object,
  serverURL: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onCheckboxChange: PropTypes.func
};
export { VanityNameSection as VanityNameSectionBase };
export default injectIntl(VanityNameSection);
//# sourceMappingURL=VanityNameSection.js.map