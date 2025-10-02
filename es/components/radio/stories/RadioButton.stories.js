import * as React from 'react';
import RadioButton from '../RadioButton';
import notes from './RadioButton.stories.md';
export const basic = () => /*#__PURE__*/React.createElement(RadioButton, {
  label: "Radio Button 1",
  value: "radio1"
});
export const disabled = () => /*#__PURE__*/React.createElement(RadioButton, {
  label: "Disabled Radio Button",
  value: "radio2",
  isDisabled: true
});
export default {
  title: 'Components/Radio/RadioButton',
  component: RadioButton,
  parameters: {
    notes
  }
};
//# sourceMappingURL=RadioButton.stories.js.map