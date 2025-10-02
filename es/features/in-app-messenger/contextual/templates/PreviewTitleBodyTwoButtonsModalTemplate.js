import * as React from 'react';
import PrimaryButton from '../../../../components/primary-button';
import { Modal, ModalActions } from '../../../../components/modal';
import Button from '../../../../components/button';
import MessagePreviewContent from '../../../message-preview-content/MessagePreviewContent';
import { messageActions } from '../../types/message-actions';
import './styles/PreviewTitleBodyTwoButtonsModalTemplate.scss';
const handleClose = onAction => {
  onAction([messageActions.close]);
};
const handleButtonClick = (onAction, button) => {
  if (button) {
    onAction(button.actions);
  }
};
const PreviewTitleBodyTwoButtonsModalTemplate = ({
  apiHost,
  contentPreviewProps,
  getToken,
  onAction,
  params: {
    body,
    button1,
    button2,
    fileUpload: {
      fileId,
      sharedLinkUrl
    } = {},
    title
  }
}) => {
  return /*#__PURE__*/React.createElement(Modal, {
    className: "bdl-PreviewTitleBodyTwoButtonsModalTemplate",
    closeButtonProps: {
      'data-resin-target': 'dismiss'
    },
    isOpen: true,
    onRequestClose: () => handleClose(onAction),
    shouldNotUsePortal: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdl-PreviewTitleBodyTwoButtonsModalTemplate-contentContainer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdl-PreviewTitleBodyTwoButtonsModalTemplate-title",
    dangerouslySetInnerHTML: {
      __html: title
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "bdl-PreviewTitleBodyTwoButtonsModalTemplate-body",
    dangerouslySetInnerHTML: {
      __html: body
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "bdl-PreviewTitleBodyTwoButtonsModalTemplate-previewContainer"
  }, /*#__PURE__*/React.createElement(MessagePreviewContent, {
    apiHost: apiHost,
    contentPreviewProps: contentPreviewProps,
    fileId: fileId,
    getToken: getToken,
    sharedLink: sharedLinkUrl
  })), /*#__PURE__*/React.createElement(ModalActions, null, /*#__PURE__*/React.createElement(PrimaryButton, {
    "data-resin-target": "cta1",
    onClick: () => handleButtonClick(onAction, button1)
  }, button1.label), button2 && /*#__PURE__*/React.createElement(Button, {
    "data-resin-target": "cta2",
    onClick: () => handleButtonClick(onAction, button2)
  }, button2.label))));
};
export default PreviewTitleBodyTwoButtonsModalTemplate;
//# sourceMappingURL=PreviewTitleBodyTwoButtonsModalTemplate.js.map