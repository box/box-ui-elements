import * as React from 'react';
import TimeInput from './TimeInput';
export const required = () => {
  const INITIAL_DATE = new Date(2018, 7, 9, 15, 35);
  return /*#__PURE__*/React.createElement(TimeInput, {
    initialDate: INITIAL_DATE
  });
};
export const optional = () => {
  const INITIAL_DATE = new Date(2018, 7, 9, 15, 35);
  return /*#__PURE__*/React.createElement(TimeInput, {
    initialDate: INITIAL_DATE,
    isRequired: false
  });
};
export default {
  title: 'Components/TimeInput',
  component: TimeInput
};
//# sourceMappingURL=TimeInput.stories.js.map