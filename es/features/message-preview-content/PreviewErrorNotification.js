import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Picture16 from '../../icon/fill/Picture16';
import messages from './messages';
import './styles/PreviewErrorNotification.scss';
function PreviewErrorNotification() {
  return /*#__PURE__*/React.createElement("div", {
    className: "PreviewErrorNotification"
  }, /*#__PURE__*/React.createElement(Picture16, {
    className: "PreviewErrorNotification-image"
  }), /*#__PURE__*/React.createElement("div", {
    className: "PreviewErrorNotification-message"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.messagePreviewError)));
}
export default PreviewErrorNotification;
//# sourceMappingURL=PreviewErrorNotification.js.map