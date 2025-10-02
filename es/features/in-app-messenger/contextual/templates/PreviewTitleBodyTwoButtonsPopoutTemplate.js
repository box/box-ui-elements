/**
 * This component is intended to be passed to TemplateContainer as templateComponent prop, like this:
 *   <TemplateContainer templateID='my-template' templateComponent=MyTemplate/>
 */
import * as React from 'react';
import Button from '../../../../components/button/Button';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';
import Overlay from '../../../../components/flyout/Overlay';
import MessagePreviewContent from '../../../message-preview-content/MessagePreviewContent';
import './styles/PreviewTitleBodyTwoButtonsPopoutTemplate.scss';
const handleButtonClick = (onAction, button) => {
  if (button) {
    onAction(button.actions);
  }
};
const PreviewTitleBodyTwoButtonsPopoutTemplate = ({
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
  return /*#__PURE__*/React.createElement("div", {
    className: "bdl-PreviewTitleBodyTwoButtonsPopoutTemplate"
  }, /*#__PURE__*/React.createElement(Overlay, null, /*#__PURE__*/React.createElement("div", {
    className: "bdl-PreviewTitleBodyTwoButtonsPopoutTemplate-contentContainer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdl-PreviewTitleBodyTwoButtonsPopoutTemplate-previewContainer"
  }, /*#__PURE__*/React.createElement(MessagePreviewContent, {
    apiHost: apiHost,
    contentPreviewProps: contentPreviewProps,
    fileId: fileId,
    getToken: getToken,
    sharedLink: sharedLinkUrl
  })), /*#__PURE__*/React.createElement("div", {
    className: "bdl-PreviewTitleBodyTwoButtonsPopoutTemplate-mainContainer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdl-PreviewTitleBodyTwoButtonsPopoutTemplate-title",
    dangerouslySetInnerHTML: {
      __html: title
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "bdl-PreviewTitleBodyTwoButtonsPopoutTemplate-body",
    dangerouslySetInnerHTML: {
      __html: body
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "bdl-PreviewTitleBodyTwoButtonsPopoutTemplate-buttons"
  }, button2 && /*#__PURE__*/React.createElement(Button, {
    "data-resin-target": "cta2",
    onClick: () => handleButtonClick(onAction, button2)
  }, button2.label), /*#__PURE__*/React.createElement(PrimaryButton, {
    "data-resin-target": "cta1",
    onClick: () => handleButtonClick(onAction, button1)
  }, button1.label))))));
};
export default PreviewTitleBodyTwoButtonsPopoutTemplate;
//# sourceMappingURL=PreviewTitleBodyTwoButtonsPopoutTemplate.js.map