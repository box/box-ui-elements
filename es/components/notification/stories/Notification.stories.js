import * as React from 'react';
import { IntlProvider } from 'react-intl';
import Button from '../../button/Button';
import Notification from '../Notification';
import notes from './Notification.stories.md';
export const basic = () => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(Notification, null, "This is a default notification."));
export const info = () => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(Notification, {
  type: "info"
}, /*#__PURE__*/React.createElement("span", null, "This is an info notification with a button."), /*#__PURE__*/React.createElement(Button, null, "Click me")));
export const warn = () => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(Notification, {
  type: "warn"
}, /*#__PURE__*/React.createElement("span", null, "This is a warning notification with two buttons."), /*#__PURE__*/React.createElement(Button, null, "Click me"), /*#__PURE__*/React.createElement(Button, null, "Click me again")));
export const error = () => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(Notification, {
  type: "error"
}, /*#__PURE__*/React.createElement("span", null, "This is an error notification.")));
export const basicV2 = () => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(Notification, {
  useV2Icons: true
}, "This is a default notification."));
export const infoV2 = () => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(Notification, {
  type: "info",
  useV2Icons: true
}, /*#__PURE__*/React.createElement("span", null, "This is an info notification with a button."), /*#__PURE__*/React.createElement(Button, null, "Click me")));
export const warnV2 = () => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(Notification, {
  type: "warn",
  useV2Icons: true
}, /*#__PURE__*/React.createElement("span", null, "This is a warning notification with two buttons."), /*#__PURE__*/React.createElement(Button, null, "Click me"), /*#__PURE__*/React.createElement(Button, null, "Click me again")));
export const errorV2 = () => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(Notification, {
  type: "error",
  useV2Icons: true
}, /*#__PURE__*/React.createElement("span", null, "This is an error notification.")));
export default {
  title: 'Components/Notifications/Notification',
  component: Notification,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Notification.stories.js.map