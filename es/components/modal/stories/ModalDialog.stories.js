import * as React from 'react';
import { IntlProvider } from 'react-intl';
import ModalDialog from '../ModalDialog';
import notes from './ModalDialog.stories.md';
export const basic = () => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(ModalDialog, {
  title: "Static ModalDialog"
}, /*#__PURE__*/React.createElement("p", null, "I can be rendered statically! Because I\u2019m not in a portal!"), /*#__PURE__*/React.createElement("p", null, "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum congue, lacus ut scelerisque porttitor, libero diam luctus ante, non porta lectus dolor eu lectus. Suspendisse sagittis ut orci eget placerat.")));
export default {
  title: 'Components/ModalDialog',
  component: ModalDialog,
  parameters: {
    notes
  }
};
//# sourceMappingURL=ModalDialog.stories.js.map