import * as React from 'react';
import { PreviewTitleBodyTags, PreviewTitleBodyTagsButton, TitleBodyTags, TitleBodyTagsButton } from '../templates';
import { PREVIEW_TITLE_BODY_TAGS, PREVIEW_TITLE_BODY_TAGS_BUTTON, TITLE_BODY_TAGS, TITLE_BODY_TAGS_BUTTON } from '../../constants';
function Message({
  activateDate,
  apiHost,
  contentPreviewProps,
  getToken,
  templateName,
  templateParams: {
    body,
    button1,
    fileUpload,
    tags,
    title
  },
  name
}) {
  const date = new Date(activateDate * 1000);
  if (templateName === PREVIEW_TITLE_BODY_TAGS && fileUpload) {
    return /*#__PURE__*/React.createElement(PreviewTitleBodyTags, {
      apiHost: apiHost,
      body: body,
      contentPreviewProps: contentPreviewProps,
      date: date,
      fileUpload: fileUpload,
      getToken: getToken,
      tags: tags,
      title: title,
      name: name
    });
  }
  if (templateName === PREVIEW_TITLE_BODY_TAGS_BUTTON && button1 && fileUpload) {
    return /*#__PURE__*/React.createElement(PreviewTitleBodyTagsButton, {
      apiHost: apiHost,
      body: body,
      button1: button1,
      contentPreviewProps: contentPreviewProps,
      date: date,
      fileUpload: fileUpload,
      getToken: getToken,
      tags: tags,
      title: title,
      name: name
    });
  }
  if (templateName === TITLE_BODY_TAGS) {
    return /*#__PURE__*/React.createElement(TitleBodyTags, {
      body: body,
      date: date,
      tags: tags,
      title: title,
      name: name
    });
  }
  if (templateName === TITLE_BODY_TAGS_BUTTON && button1) {
    return /*#__PURE__*/React.createElement(TitleBodyTagsButton, {
      body: body,
      button1: button1,
      date: date,
      tags: tags,
      title: title,
      name: name
    });
  }
  return null;
}
export default Message;
//# sourceMappingURL=Message.js.map