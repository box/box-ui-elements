import * as React from 'react';
import Section from './Section';
import notes from './Section.stories.md';
export const basic = () => /*#__PURE__*/React.createElement(Section, {
  title: "User Info",
  description: "Your account info"
}, /*#__PURE__*/React.createElement("input", {
  name: "textinput",
  type: "email",
  placeholder: "Enter email here"
}));
export default {
  title: 'Components/Section',
  component: Section,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Section.stories.js.map