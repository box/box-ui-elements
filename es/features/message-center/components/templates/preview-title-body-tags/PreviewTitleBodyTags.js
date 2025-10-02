import * as React from 'react';
import MessageTextContent from '../common/MessageTextContent';
import MessagePreviewContent from '../../../../message-preview-content/MessagePreviewContent';
import MessageTags from '../common/MessageTags';
import MessageFooter from '../common/MessageFooter';
import BottomContentWrapper from '../common/BottomContentWrapper';
function PreviewTitleBodyTags({
  apiHost,
  date,
  body,
  contentPreviewProps,
  fileUpload: {
    fileId,
    sharedLinkUrl
  } = {},
  tags,
  title,
  getToken,
  name
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "PreviewTitleBodyTags"
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
    date: date,
    name: name
  })));
}
export default PreviewTitleBodyTags;
//# sourceMappingURL=PreviewTitleBodyTags.js.map