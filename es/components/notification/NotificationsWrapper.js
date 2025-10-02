import * as React from 'react';
import FocusTrap from '../focus-trap';
import Portal from '../portal';
const NotificationsWrapper = ({
  children
}) => /*#__PURE__*/React.createElement(Portal, {
  className: "notifications-wrapper",
  "aria-live": "polite"
}, children ? /*#__PURE__*/React.createElement(FocusTrap, {
  className: "notification-container"
}, children) : null);
export default NotificationsWrapper;
//# sourceMappingURL=NotificationsWrapper.js.map