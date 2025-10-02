import * as React from 'react';
import MessagePreviewContent from '../../../../message-preview-content/MessagePreviewContent';
import MessageTextContent from '../common/MessageTextContent';
import MessageTags from '../common/MessageTags';
import MessageFooter from '../common/MessageFooter';
import BottomContentWrapper from '../common/BottomContentWrapper';
function PreviewTitleBodyTagsButton({
  apiHost,
  date,
  body,
  button1,
  contentPreviewProps,
  fileUpload: {
    fileId,
    sharedLinkUrl
  } = {},
  getToken,
  tags,
  title,
  name
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "PreviewTitleBodyTagsButton"
  }, /*#__PURE__*/React.createElement(MessagePreviewContent, {
    apiHost: apiHost,
    contentPreviewProps: contentPreviewProps,
    fileId: fileId,
    getToken: getToken,
    sharedLink: sharedLinkUrl
  }), /*#__PURE__*/React.createElement(BottomContentWrapper, null, /*#__PURE__*/React.createElement(MessageTextContent, {
    body: body,
    title: title
  }), /*#__PURE__*/React.createElement(MessageTags, {
    tags: tags
  }), /*#__PURE__*/React.createElement(MessageFooter, {
    actionItem: button1,
    date: date,
    name: name
  })));
}
export default PreviewTitleBodyTagsButton;
//# sourceMappingURL=PreviewTitleBodyTagsButton.js.map