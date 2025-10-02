import * as React from 'react';
import Modal from 'react-modal';
import { useIntl } from 'react-intl';
import { Modal as BlueprintModal, TextInput } from '@box/blueprint-web';
import { CLASS_MODAL_CONTENT, CLASS_MODAL_OVERLAY, CLASS_MODAL, ERROR_CODE_ITEM_NAME_TOO_LONG, ERROR_CODE_ITEM_NAME_IN_USE } from '../../constants';
import messages from '../common/messages';
const RenameDialog = ({
  appElement,
  errorCode,
  isOpen,
  isLoading,
  item,
  onCancel,
  onRename,
  parentElement
}) => {
  const {
    formatMessage
  } = useIntl();
  let textInput = null;
  let error;
  const {
    name = '',
    extension
  } = item;
  const ext = extension ? `.${extension}` : '';
  const nameWithoutExt = extension ? name.replace(ext, '') : name;

  /**
   * Appends the extension and calls rename function
   */
  const handleRename = () => {
    if (textInput && textInput.value) {
      if (textInput.value === nameWithoutExt) {
        onCancel();
      } else {
        onRename(textInput.value, ext);
      }
    }
  };

  /**
   * Grabs reference to the input element
   */
  const ref = input => {
    textInput = input;
    if (textInput instanceof HTMLInputElement) {
      textInput.focus();
      textInput.select();
    }
  };

  /**
   * Handles enter key down
   */
  const onKeyDown = ({
    key
  }) => {
    switch (key) {
      case 'Enter':
        handleRename();
        break;
      default:
        break;
    }
  };
  switch (errorCode) {
    case ERROR_CODE_ITEM_NAME_IN_USE:
      error = messages.renameDialogErrorInUse;
      break;
    case ERROR_CODE_ITEM_NAME_TOO_LONG:
      error = messages.renameDialogErrorTooLong;
      break;
    default:
      error = errorCode ? messages.renameDialogErrorInvalid : null;
      break;
  }
  return /*#__PURE__*/React.createElement(Modal, {
    appElement: appElement,
    className: CLASS_MODAL_CONTENT,
    contentLabel: formatMessage(messages.renameDialogLabel),
    isOpen: isOpen,
    onRequestClose: onCancel,
    overlayClassName: CLASS_MODAL_OVERLAY,
    parentSelector: () => parentElement,
    portalClassName: `${CLASS_MODAL} be-modal-rename`
  }, /*#__PURE__*/React.createElement(BlueprintModal.Body, null, /*#__PURE__*/React.createElement(TextInput, {
    defaultValue: nameWithoutExt,
    error: error && formatMessage(error, {
      name: nameWithoutExt
    }),
    label: formatMessage(messages.renameDialogText, {
      name: nameWithoutExt
    }),
    onKeyDown: onKeyDown,
    ref: ref,
    required: true
  })), /*#__PURE__*/React.createElement(BlueprintModal.Footer, null, /*#__PURE__*/React.createElement(BlueprintModal.Footer.SecondaryButton, {
    disabled: isLoading,
    onClick: onCancel,
    size: "large"
  }, formatMessage(messages.cancel)), /*#__PURE__*/React.createElement(BlueprintModal.Footer.PrimaryButton, {
    loading: isLoading,
    loadingAriaLabel: formatMessage(messages.loading),
    onClick: handleRename,
    size: "large"
  }, formatMessage(messages.rename))));
};
export default RenameDialog;
//# sourceMappingURL=RenameDialog.js.map