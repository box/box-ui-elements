import * as React from 'react';
import SelectButton from './SelectButton';
import notes from './SelectButton.stories.md';
export const regular = () => /*#__PURE__*/React.createElement(SelectButton, {
  className: "",
  isDisabled: false
}, "Click Here");
export const disabled = () => /*#__PURE__*/React.createElement(SelectButton, {
  className: "",
  isDisabled: true
}, "Click Here");
export const withError = () => /*#__PURE__*/React.createElement(SelectButton, {
  className: "",
  error: "Error text",
  isDisabled: false
}, "Click Here");
export default {
  title: 'Components/SelectButton',
  component: SelectButton,
  parameters: {
    notes
  }
};
//# sourceMappingURL=SelectButton.stories.js.map