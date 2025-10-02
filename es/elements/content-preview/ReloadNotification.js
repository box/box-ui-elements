/**
 * 
 * @file Preview loading and error UI wrapper
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../../components/button/Button';
import { Notification, NotificationConstants } from '../../components/notification';
import messages from '../common/messages';
import './ReloadNotification.scss';
const ReloadNotification = ({
  onClick,
  onClose
}) => /*#__PURE__*/React.createElement("span", {
  className: "bcpr-notification"
}, /*#__PURE__*/React.createElement(Notification, {
  onClose: onClose,
  type: NotificationConstants.TYPE_INFO
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.previewUpdate), /*#__PURE__*/React.createElement(Button, {
  onClick: onClick
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.reload))));
export default ReloadNotification;
//# sourceMappingURL=ReloadNotification.js.map