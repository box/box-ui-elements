import * as React from 'react';
import { bdlBoxBlue } from '../../styles/variables';
import Header from './Header';
import notes from './Header.stories.md';
export const regular = () => /*#__PURE__*/React.createElement(Header, {
  color: bdlBoxBlue
}, /*#__PURE__*/React.createElement("h1", {
  style: {
    color: '#fff'
  }
}, "Lorem Ipsum"));
export default {
  title: 'Components/Header',
  component: Header,
  parameters: {
    notes
  }
};
//# sourceMappingURL=Header.stories.js.map