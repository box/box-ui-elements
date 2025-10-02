import * as React from 'react';
import { IntlProvider } from 'react-intl';
import SidebarToggleButton from './SidebarToggleButton';
import notes from './SidebarToggleButton.stories.md';
export const open = () => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(SidebarToggleButton, {
  isOpen: true
}));
export const closed = () => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(SidebarToggleButton, {
  isOpen: false
}));
export const leftFacing = () => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(SidebarToggleButton, {
  direction: "left",
  isOpen: true
}));
export default {
  title: 'Components/SidebarToggleButton',
  component: SidebarToggleButton,
  parameters: {
    notes
  }
};
//# sourceMappingURL=SidebarToggleButton.stories.js.map