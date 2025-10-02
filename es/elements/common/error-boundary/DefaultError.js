import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ErrorMask from '../../../components/error-mask/ErrorMask';
import messages from '../messages';
import './DefaultError.scss';
const DefaultError = () => /*#__PURE__*/React.createElement("section", {
  className: "be-default-error"
}, /*#__PURE__*/React.createElement(ErrorMask, {
  errorHeader: /*#__PURE__*/React.createElement(FormattedMessage, messages.defaultErrorMaskHeaderMessage),
  errorSubHeader: /*#__PURE__*/React.createElement(FormattedMessage, messages.defaultErrorMaskSubHeaderMessage)
}));
export default DefaultError;
//# sourceMappingURL=DefaultError.js.map