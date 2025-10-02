function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button } from '@box/blueprint-web';
import { ERROR_CODE_UPLOAD_FILE_LIMIT } from '../../constants';
import messages from '../common/messages';
import './Footer.scss';
const Footer = ({
  isLoading,
  hasFiles,
  errorCode,
  onCancel,
  onClose,
  onUpload,
  fileLimit,
  isDone
}) => {
  const {
    formatMessage
  } = useIntl();
  const isCloseButtonDisabled = hasFiles;
  const isCancelButtonDisabled = !hasFiles || isDone;
  const isUploadButtonDisabled = !hasFiles;
  let message;
  if (errorCode === ERROR_CODE_UPLOAD_FILE_LIMIT) {
    message = /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.uploadErrorTooManyFiles, {
      values: {
        fileLimit
      }
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "bcu-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bcu-footer-left"
  }, onClose ? /*#__PURE__*/React.createElement(Button, {
    disabled: isCloseButtonDisabled,
    onClick: onClose,
    size: "large",
    variant: "secondary"
  }, formatMessage(messages.close)) : null), message && /*#__PURE__*/React.createElement("div", {
    className: "bcu-footer-message"
  }, message), /*#__PURE__*/React.createElement("div", {
    className: "bcu-footer-right"
  }, /*#__PURE__*/React.createElement(Button, {
    disabled: isCancelButtonDisabled,
    onClick: onCancel,
    size: "large",
    variant: "secondary"
  }, formatMessage(messages.cancel)), /*#__PURE__*/React.createElement(Button, {
    disabled: isUploadButtonDisabled,
    loading: isLoading,
    loadingAriaLabel: formatMessage(messages.loading),
    onClick: onUpload,
    size: "large",
    variant: "primary"
  }, formatMessage(messages.upload))));
};
export default Footer;
//# sourceMappingURL=Footer.js.map