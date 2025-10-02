function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Modal from 'react-modal';
import { Modal as BlueprintModal } from '@box/blueprint-web';
import { CLASS_MODAL_CONTENT, CLASS_MODAL_OVERLAY, CLASS_MODAL, TYPE_FOLDER } from '../../constants';
import messages from '../common/messages';
const DeleteConfirmationDialog = ({
  appElement,
  isLoading,
  isOpen,
  item,
  onCancel,
  onDelete,
  parentElement
}) => {
  const {
    formatMessage
  } = useIntl();
  const message = item.type === TYPE_FOLDER ? messages.deleteDialogFolderText : messages.deleteDialogFileText;
  return /*#__PURE__*/React.createElement(Modal, {
    appElement: appElement,
    className: CLASS_MODAL_CONTENT,
    contentLabel: formatMessage(messages.deleteDialogLabel),
    isOpen: isOpen,
    onRequestClose: onCancel,
    overlayClassName: CLASS_MODAL_OVERLAY,
    parentSelector: () => parentElement,
    portalClassName: `${CLASS_MODAL} be-modal-delete`
  }, /*#__PURE__*/React.createElement(BlueprintModal.Body, null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, message, {
    values: {
      name: item.name
    }
  }))), /*#__PURE__*/React.createElement(BlueprintModal.Footer, null, /*#__PURE__*/React.createElement(BlueprintModal.Footer.SecondaryButton, {
    autoFocus: true,
    disabled: isLoading,
    onClick: onCancel,
    size: "large"
  }, formatMessage(messages.cancel)), /*#__PURE__*/React.createElement(BlueprintModal.Footer.PrimaryButton, {
    loading: isLoading,
    loadingAriaLabel: formatMessage(messages.loading),
    onClick: onDelete,
    size: "large"
  }, formatMessage(messages.delete))));
};
export default DeleteConfirmationDialog;
//# sourceMappingURL=DeleteConfirmationDialog.js.map