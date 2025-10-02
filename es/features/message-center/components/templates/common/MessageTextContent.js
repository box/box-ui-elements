import * as React from 'react';
import classNames from 'classnames';
import sanitizeHTML from 'sanitize-html';
import './styles/MessageTextContent.scss';
function MessageTextContent({
  body = '',
  title,
  className
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('MessageTextContent', className)
  }, /*#__PURE__*/React.createElement("div", {
    className: "MessageTextContent-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "MessageTextContent-body",
    dangerouslySetInnerHTML: {
      __html: sanitizeHTML(body)
    }
  }));
}
export default MessageTextContent;
//# sourceMappingURL=MessageTextContent.js.map