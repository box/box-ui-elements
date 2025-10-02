import * as React from 'react';
import Label from './Label';
import notes from './Label.stories.md';
export const basic = () => /*#__PURE__*/React.createElement(Label, {
  text: "Input Label",
  tooltip: "This is an input label."
}, /*#__PURE__*/React.createElement("input", {
  type: "text"
}));
export const withOptionalText = () => /*#__PURE__*/React.createElement(Label, {
  text: "Input Label",
  showOptionalText: true
}, /*#__PURE__*/React.createElement("input", {
  type: "text"
}));
export const withInfoTooltip = () => /*#__PURE__*/React.createElement(Label, {
  text: "Input Label",
  infoTooltip: "I stand above this icon"
}, /*#__PURE__*/React.createElement("input", {
  type: "text"
}));
export default {
  title: 'Components/Label',
  component: Label,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Label.stories.js.map