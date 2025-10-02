import * as React from 'react';
import { action } from 'storybook/actions';
import PrimaryButton from './PrimaryButton';
import notes from './PrimaryButton.stories.md';
export const regular = () => /*#__PURE__*/React.createElement(PrimaryButton, {
  onClick: action('onClick called')
}, "Click Here");
export const loading = () => /*#__PURE__*/React.createElement(PrimaryButton, {
  isLoading: true
}, "Click Here");
export const disabled = () => /*#__PURE__*/React.createElement(PrimaryButton, {
  isDisabled: true
}, "Click Here");
export default {
  title: 'Components/Buttons/PrimaryButton',
  component: PrimaryButton,
  parameters: {
    notes
  }
};
//# sourceMappingURL=PrimaryButton.stories.js.map