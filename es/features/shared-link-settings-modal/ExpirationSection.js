function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Checkbox from '../../components/checkbox';
import DatePicker from '../../components/date-picker';
import Fieldset from '../../components/fieldset';
import messages from './messages';
export const defaultDisplayFormat = {
  weekday: 'short',
  year: 'numeric',
  month: 'short',
  day: 'numeric'
};
const ExpirationSection = ({
  canChangeExpiration,
  dateFormat,
  dateDisplayFormat = defaultDisplayFormat,
  error,
  expirationCheckboxProps = {},
  expirationDate,
  expirationInputProps = {},
  isExpirationEnabled,
  onCheckboxChange,
  onExpirationDateChange
}) => {
  const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  const datepicker = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DatePicker, {
    dateFormat: dateFormat,
    displayFormat: dateDisplayFormat,
    error: error,
    hideLabel: true,
    inputProps: expirationInputProps,
    isDisabled: !canChangeExpiration,
    isRequired: true,
    label: /*#__PURE__*/React.createElement(FormattedMessage, messages.expirationLabel),
    minDate: tomorrow,
    name: "expiration",
    onChange: onExpirationDateChange,
    value: expirationDate
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(Fieldset, {
    className: "be expiration-section",
    title: /*#__PURE__*/React.createElement(FormattedMessage, messages.expirationTitle)
  }, /*#__PURE__*/React.createElement(Checkbox, _extends({
    isChecked: isExpirationEnabled,
    isDisabled: !canChangeExpiration,
    label: /*#__PURE__*/React.createElement(FormattedMessage, messages.expirationLabel),
    name: "isExpirationEnabled",
    onChange: onCheckboxChange,
    subsection: isExpirationEnabled ? datepicker : undefined
  }, expirationCheckboxProps))));
};
ExpirationSection.propTypes = {
  canChangeExpiration: PropTypes.bool.isRequired,
  dateDisplayFormat: PropTypes.object,
  /** The format of the date value for form submit */
  dateFormat: PropTypes.string,
  error: PropTypes.string,
  expirationCheckboxProps: PropTypes.object,
  expirationDate: PropTypes.instanceOf(Date),
  expirationInputProps: PropTypes.object,
  isExpirationEnabled: PropTypes.bool.isRequired,
  onCheckboxChange: PropTypes.func.isRequired,
  onExpirationDateChange: PropTypes.func.isRequired
};
export default ExpirationSection;
//# sourceMappingURL=ExpirationSection.js.map