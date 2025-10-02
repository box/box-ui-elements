import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Modal, ModalActions } from '../../components/modal';
import Button from '../../components/button';
import PrimaryButton from '../../components/primary-button';
import commonMessages from '../../common/messages';
import messages from './messages';
const RemoveLinkConfirmModal = props => {
  const {
    isOpen,
    onRequestClose,
    removeLink,
    submitting
  } = props;
  return /*#__PURE__*/React.createElement(Modal, {
    focusElementSelector: ".btn-primary",
    isOpen: isOpen,
    onRequestClose: submitting ? undefined : onRequestClose,
    title: /*#__PURE__*/React.createElement(FormattedMessage, messages.removeLinkConfirmationTitle),
    type: "alert"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.removeLinkConfirmationDescription), /*#__PURE__*/React.createElement(ModalActions, null, /*#__PURE__*/React.createElement(Button, {
    isDisabled: submitting,
    onClick: onRequestClose
  }, /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.cancel)), /*#__PURE__*/React.createElement(PrimaryButton, {
    isDisabled: submitting,
    isLoading: submitting,
    onClick: removeLink
  }, /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.okay))));
};
RemoveLinkConfirmModal.displayName = 'RemoveLinkConfirmModal';
export default RemoveLinkConfirmModal;
//# sourceMappingURL=RemoveLinkConfirmModal.js.map