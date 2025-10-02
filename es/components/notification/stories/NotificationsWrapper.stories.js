function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import Button from '../../button/Button';
import PrimaryButton from '../../primary-button/PrimaryButton';
import Notification from '../Notification';
import NotificationsWrapper from '../NotificationsWrapper';
import notes from './NotificationsWrapper.stories.md';
export const example = () => {
  const DATE = new Date('May 13, 2002 23:15:30').toTimeString();
  const [notificationData, setNotificationData] = React.useState({
    id: 0,
    notifications: new Map()
  });
  const closeNotification = id => {
    const notifications = new Map(notificationData.notifications);
    notifications.delete(id);
    setNotificationData(_objectSpread(_objectSpread({}, notificationData), {}, {
      notifications
    }));
  };
  const addNotification = (duration, type) => {
    const {
      id
    } = notificationData;
    const {
      notifications
    } = notificationData;
    const notification = /*#__PURE__*/React.createElement(Notification, {
      key: id,
      duration: duration,
      onClose: () => closeNotification(id),
      type: type
    }, /*#__PURE__*/React.createElement("span", null, "Hello world! I was made at ", DATE), /*#__PURE__*/React.createElement(Button, null, "Okay"));
    setNotificationData({
      notifications: notifications.set(id, notification),
      id: id + 1
    });
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(NotificationsWrapper, null, [...notificationData.notifications.values()]), /*#__PURE__*/React.createElement(Button, {
    onClick: () => addNotification('short', 'info')
  }, "Display timed notification"), /*#__PURE__*/React.createElement(PrimaryButton, {
    onClick: () => addNotification(undefined, 'warn')
  }, "Display persistent notification"));
};
export default {
  title: 'Components/Notifications/NotificationsWrapper',
  component: NotificationsWrapper,
  parameters: {
    notes
  }
};
//# sourceMappingURL=NotificationsWrapper.stories.js.map