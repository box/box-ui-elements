import * as React from 'react';
import Modal from 'react-modal';
import noop from 'lodash/noop';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Modal as BlueprintModal, Text } from '@box/blueprint-web';
import ShareAccessSelect from '../common/share-access-select';
import { CLASS_MODAL_CONTENT, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../constants';
import messages from '../common/messages';
import './ShareDialog.scss';
const ShareDialog = ({
  appElement,
  canSetShareAccess,
  isLoading,
  isOpen,
  item,
  onCancel,
  onShareAccessChange,
  parentElement
}) => {
  const {
    formatMessage
  } = useIntl();
  let textInput = null;
  const copy = () => {
    if (textInput instanceof HTMLInputElement) {
      textInput.select();
      document.execCommand('copy');
    }
  };
  const {
    shared_link: sharedLink
  } = item;
  const {
    url
  } = sharedLink || {
    url: formatMessage(messages.shareDialogNone)
  };
  return /*#__PURE__*/React.createElement(Modal, {
    appElement: appElement,
    className: CLASS_MODAL_CONTENT,
    contentLabel: formatMessage(messages.shareDialogLabel),
    isOpen: isOpen,
    onRequestClose: onCancel,
    overlayClassName: CLASS_MODAL_OVERLAY,
    parentSelector: () => parentElement,
    portalClassName: `${CLASS_MODAL} be-modal-share`
  }, /*#__PURE__*/React.createElement(BlueprintModal.Body, null, /*#__PURE__*/React.createElement(Text, {
    as: "label"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.shareDialogText)), /*#__PURE__*/React.createElement("div", {
    className: "be-modal-input-group"
  }, /*#__PURE__*/React.createElement("input", {
    ref: input => {
      textInput = input;
    },
    onChange: noop,
    type: "text",
    value: url
  }), /*#__PURE__*/React.createElement(Button, {
    autoFocus: true,
    className: "be-modal-button-copy",
    onClick: copy,
    variant: "primary"
  }, formatMessage(messages.copy))), /*#__PURE__*/React.createElement(BlueprintModal.Footer, {
    className: "be-modal-btns"
  }, /*#__PURE__*/React.createElement(ShareAccessSelect, {
    canSetShareAccess: canSetShareAccess,
    className: "bce-shared-access-select",
    item: item,
    onChange: onShareAccessChange
  }), /*#__PURE__*/React.createElement(Button, {
    loading: isLoading,
    loadingAriaLabel: formatMessage(messages.loading),
    onClick: onCancel,
    size: "large",
    variant: "secondary"
  }, formatMessage(messages.close)))));
};
export default ShareDialog;
//# sourceMappingURL=ShareDialog.js.map