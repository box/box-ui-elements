import * as React from 'react';
import MessageTextContent from '../common/MessageTextContent';
import MessageTags from '../common/MessageTags';
import MessageFooter from '../common/MessageFooter';
import BottomContentWrapper from '../common/BottomContentWrapper';
function TitleBodyTags({
  date,
  body,
  tags,
  title,
  name
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "TitleBodyTags"
  }, /*#__PURE__*/React.createElement(BottomContentWrapper, null, /*#__PURE__*/React.createElement(MessageTextContent, {
    body: body,
    title: title
  }), /*#__PURE__*/React.createElement(MessageTags, {
    tags: tags
  }), /*#__PURE__*/React.createElement(MessageFooter, {
    date: date,
    name: name
  })));
}
export default TitleBodyTags;
//# sourceMappingURL=TitleBodyTags.js.map