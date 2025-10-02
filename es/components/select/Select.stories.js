import * as React from 'react';
import Select from './Select';
import notes from './Select.stories.md';
export const basic = () => /*#__PURE__*/React.createElement(Select, {
  name: "select",
  label: "Album"
}, /*#__PURE__*/React.createElement("option", null, "Illmatic"), /*#__PURE__*/React.createElement("option", null, "The Marshall Mathers LP"), /*#__PURE__*/React.createElement("option", null, "All Eyez on Me"), /*#__PURE__*/React.createElement("option", null, "Ready To Die"), /*#__PURE__*/React.createElement("option", null, "Enter the Wu-Tang"), /*#__PURE__*/React.createElement("option", null, "The Eminem Show"), /*#__PURE__*/React.createElement("option", null, "The Chronic"), /*#__PURE__*/React.createElement("option", null, "Straight Outta Compton"), /*#__PURE__*/React.createElement("option", null, "Reasonable Doubt"));
export const disabled = () => /*#__PURE__*/React.createElement(Select, {
  name: "select",
  label: "Disabled Select",
  isDisabled: true
}, /*#__PURE__*/React.createElement("option", null, "Straight Outta Compton"));
export const withErrorMessage = () => /*#__PURE__*/React.createElement(Select, {
  name: "select",
  label: "Album",
  error: "Not For Kidz"
}, /*#__PURE__*/React.createElement("option", null, "Illmatic"), /*#__PURE__*/React.createElement("option", null, "The Marshall Mathers LP"), /*#__PURE__*/React.createElement("option", null, "All Eyez on Me"), /*#__PURE__*/React.createElement("option", null, "Ready To Die"), /*#__PURE__*/React.createElement("option", null, "Enter the Wu-Tang"), /*#__PURE__*/React.createElement("option", null, "The Eminem Show"), /*#__PURE__*/React.createElement("option", null, "The Chronic"), /*#__PURE__*/React.createElement("option", null, "Straight Outta Compton"), /*#__PURE__*/React.createElement("option", null, "Reasonable Doubt"));
export const withErrorOutline = () => /*#__PURE__*/React.createElement(Select, {
  name: "select",
  label: "Album",
  showErrorOutline: true
}, /*#__PURE__*/React.createElement("option", null, "Illmatic"), /*#__PURE__*/React.createElement("option", null, "The Marshall Mathers LP"), /*#__PURE__*/React.createElement("option", null, "All Eyez on Me"), /*#__PURE__*/React.createElement("option", null, "Ready To Die"), /*#__PURE__*/React.createElement("option", null, "Enter the Wu-Tang"), /*#__PURE__*/React.createElement("option", null, "The Eminem Show"), /*#__PURE__*/React.createElement("option", null, "The Chronic"), /*#__PURE__*/React.createElement("option", null, "Straight Outta Compton"), /*#__PURE__*/React.createElement("option", null, "Reasonable Doubt"));
export const withInfoTooltip = () => /*#__PURE__*/React.createElement(Select, {
  name: "select",
  label: "Album",
  infoTooltip: "Here's your favorite 90s rap albums"
}, /*#__PURE__*/React.createElement("option", null, "Illmatic"), /*#__PURE__*/React.createElement("option", null, "The Marshall Mathers LP"), /*#__PURE__*/React.createElement("option", null, "All Eyez on Me"), /*#__PURE__*/React.createElement("option", null, "Ready To Die"), /*#__PURE__*/React.createElement("option", null, "Enter the Wu-Tang"), /*#__PURE__*/React.createElement("option", null, "The Eminem Show"), /*#__PURE__*/React.createElement("option", null, "The Chronic"), /*#__PURE__*/React.createElement("option", null, "Straight Outta Compton"), /*#__PURE__*/React.createElement("option", null, "Reasonable Doubt"));
export default {
  title: 'Components/Select',
  component: Select,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Select.stories.js.map