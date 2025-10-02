import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../components/button/Button';
import PrimaryButton from '../../components/primary-button/PrimaryButton';
import messages from './messages';
import './MetadataInstanceConfirmDialog.scss';
const MetadataInstanceConfirmDialog = ({
  onCancel,
  onConfirm,
  confirmationMessage
}) => {
  const cancelButtonRef = React.useRef(null);
  React.useEffect(() => {
    if (cancelButtonRef.current) {
      cancelButtonRef.current.btnElement.focus();
    }
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "metadata-instance-confirm-cover"
  }, /*#__PURE__*/React.createElement("div", {
    className: "metadata-instance-confim-container",
    role: "alert"
  }, /*#__PURE__*/React.createElement("p", {
    className: "metadata-instance-confirm-text"
  }, confirmationMessage), /*#__PURE__*/React.createElement("div", {
    className: "metadata-instance-confirm-buttons"
  }, /*#__PURE__*/React.createElement(Button, {
    ref: cancelButtonRef,
    "data-resin-target": "metadata-confirmcancel",
    onClick: onCancel,
    type: "button"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.metadataCancel)), /*#__PURE__*/React.createElement(PrimaryButton, {
    "data-resin-target": "metadata-confirmremove",
    onClick: onConfirm,
    type: "button"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.customRemove)))));
};
export default MetadataInstanceConfirmDialog;
//# sourceMappingURL=MetadataInstanceConfirmDialog.js.map