function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import commonMessages from '../../common/messages';
const badInput = () => ({
  code: 'badInput',
  message: /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.invalidInputError)
});
const patternMismatch = () => ({
  code: 'patternMismatch',
  message: /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.invalidInputError)
});
const tooShort = minLength => ({
  code: 'tooShort',
  message: /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, commonMessages.minLengthError, {
    values: {
      min: minLength
    }
  }))
});
const tooLong = maxLength => ({
  code: 'tooLong',
  message: /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, commonMessages.maxLengthError, {
    values: {
      max: maxLength
    }
  }))
});
const typeMismatchEmail = () => ({
  code: 'typeMismatch',
  message: /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.invalidEmailError)
});
const typeMismatchUrl = () => ({
  code: 'typeMismatch',
  message: /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.invalidURLError)
});
const valueMissing = () => ({
  code: 'valueMissing',
  message: /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.requiredFieldError)
});
export { badInput, patternMismatch, tooShort, tooLong, typeMismatchEmail, typeMismatchUrl, valueMissing };
//# sourceMappingURL=input-messages.js.map