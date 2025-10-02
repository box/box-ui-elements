import React, { useState } from 'react';
import Modal from 'react-modal';
import { useIntl } from 'react-intl';
import { Modal as BlueprintModal, TextInput } from '@box/blueprint-web';
import { CLASS_MODAL_CONTENT, CLASS_MODAL_OVERLAY, CLASS_MODAL, ERROR_CODE_ITEM_NAME_TOO_LONG, ERROR_CODE_ITEM_NAME_IN_USE } from '../../../constants';
import messages from '../messages';
const CreateFolderDialog = ({
  appElement,
  errorCode,
  isOpen,
  isLoading,
  onCancel,
  onCreate,
  parentElement
}) => {
  const {
    formatMessage
  } = useIntl();
  const [value, setValue] = useState('');
  let error;
  const handleChange = e => {
    setValue(e.target.value);
  };
  const handleCreate = () => {
    if (value) {
      onCreate(value);
    }
  };
  const handleKeyDown = ({
    key
  }) => {
    switch (key) {
      case 'Enter':
        handleCreate();
        break;
      default:
        break;
    }
  };
  switch (errorCode) {
    case ERROR_CODE_ITEM_NAME_IN_USE:
      error = formatMessage(messages.createDialogErrorInUse);
      break;
    case ERROR_CODE_ITEM_NAME_TOO_LONG:
      error = formatMessage(messages.createDialogErrorTooLong);
      break;
    default:
      error = errorCode ? formatMessage(messages.createDialogErrorInvalid) : null;
      break;
  }
  return /*#__PURE__*/React.createElement(Modal, {
    appElement: appElement,
    className: CLASS_MODAL_CONTENT,
    contentLabel: formatMessage(messages.createDialogLabel),
    isOpen: isOpen,
    onRequestClose: onCancel,
    overlayClassName: CLASS_MODAL_OVERLAY,
    parentSelector: () => parentElement,
    portalClassName: `${CLASS_MODAL} be-modal-create-folder`
  }, /*#__PURE__*/React.createElement(BlueprintModal.Body, null, /*#__PURE__*/React.createElement(TextInput, {
    autoFocus: true,
    error: error,
    label: formatMessage(messages.createDialogText),
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    required: true,
    value: value
  })), /*#__PURE__*/React.createElement(BlueprintModal.Footer, null, /*#__PURE__*/React.createElement(BlueprintModal.Footer.SecondaryButton, {
    disabled: isLoading,
    onClick: onCancel,
    size: "large"
  }, formatMessage(messages.cancel)), /*#__PURE__*/React.createElement(BlueprintModal.Footer.PrimaryButton, {
    loading: isLoading,
    loadingAriaLabel: formatMessage(messages.loading),
    onClick: handleCreate,
    size: "large"
  }, formatMessage(messages.create))));
};
export default CreateFolderDialog;
//# sourceMappingURL=CreateFolderDialog.js.map