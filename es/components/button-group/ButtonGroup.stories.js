import * as React from 'react';
import Button from '../button/Button';
import ButtonGroup from './ButtonGroup';
import notes from './ButtonGroup.stories.md';
export const regular = () => /*#__PURE__*/React.createElement(ButtonGroup, null, /*#__PURE__*/React.createElement(Button, null, "Add"), /*#__PURE__*/React.createElement(Button, null, "Update"), /*#__PURE__*/React.createElement(Button, null, "Remove"));
export const disabled = () => /*#__PURE__*/React.createElement(ButtonGroup, {
  isDisabled: true
}, /*#__PURE__*/React.createElement(Button, null, "Add"), /*#__PURE__*/React.createElement(Button, null, "Update"), /*#__PURE__*/React.createElement(Button, null, "Remove"));
export default {
  title: 'Components/Buttons/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    notes
  }
};
//# sourceMappingURL=ButtonGroup.stories.js.map