import * as React from 'react';
import Button from '../button';
import IconHelp from '../../icons/general/IconHelp';
// @ts-ignore JS import
import TextInput from '../text-input';
import PlainButton from '../plain-button';
import PrimaryButton from '../primary-button';
// @ts-ignore JS import
import TextArea from '../text-area';

// @ts-ignore JS import
import { Flyout, Overlay } from '.';
import notes from './Flyout.stories.md';
export const Basic = () => {
  const position = 'bottom-center';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 200,
      marginLeft: 200
    }
  }, /*#__PURE__*/React.createElement(Flyout, {
    closeOnClickOutside: false,
    position: position
  }, /*#__PURE__*/React.createElement(Button, null, "Nothing to see here"), /*#__PURE__*/React.createElement(Overlay, null, /*#__PURE__*/React.createElement("div", {
    className: "accessible-overlay-content"
  }, /*#__PURE__*/React.createElement("p", null, "Try hitting the Tab key."), /*#__PURE__*/React.createElement("p", null, "Now try click outside, go ahead."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", null, "You are not going anywhere."))))));
};
export const OpenOnHover = () => {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 200,
      marginLeft: 200
    }
  }, /*#__PURE__*/React.createElement(Flyout, {
    openOnHover: true
  }, /*#__PURE__*/React.createElement(Button, null, "Open on Hover"), /*#__PURE__*/React.createElement(Overlay, null, /*#__PURE__*/React.createElement("div", {
    className: "accessible-overlay-content"
  }, /*#__PURE__*/React.createElement("h1", null, "Some text"), /*#__PURE__*/React.createElement("p", null, "Some more text"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("a", {
    href: "https://google.com"
  }, "Go to Google?")))));
};
export const Complex = () => {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 200,
      marginLeft: 200
    }
  }, /*#__PURE__*/React.createElement(Flyout, {
    className: "amsterdam-survey-overlay",
    offset: "0 0"
  }, /*#__PURE__*/React.createElement(PlainButton, {
    className: "amsterdam-survey-button"
  }, /*#__PURE__*/React.createElement(IconHelp, null)), /*#__PURE__*/React.createElement(Overlay, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TextArea, {
    name: "textarea",
    label: "Provide Feedback"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(TextInput, {
    name: "email",
    label: "Email Address",
    placeholder: "user@example.com",
    type: "email"
  })), /*#__PURE__*/React.createElement("div", {
    className: "icon-menu-container"
  }, /*#__PURE__*/React.createElement(PrimaryButton, null, "Submit"), /*#__PURE__*/React.createElement(Button, null, "Close")))));
};
export default {
  title: 'Components/Flyout',
  component: Flyout,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Flyout.stories.js.map