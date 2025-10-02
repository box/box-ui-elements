import * as React from 'react';
import { IntlProvider } from 'react-intl';
import Button from '../../button/Button';
import ModalDialog from '../ModalDialog';
import PrimaryButton from '../../primary-button/PrimaryButton';
import ModalActions from '../ModalActions';
import notes from './ModalActions.stories.md';
export const basic = () => /*#__PURE__*/React.createElement(IntlProvider, {
  locale: "en"
}, /*#__PURE__*/React.createElement(ModalDialog, {
  title: "Alert ModalDialog",
  type: "alert"
}, "This is the alert message. It will automatically be wrapped in a paragraph tag.", /*#__PURE__*/React.createElement(ModalActions, null, /*#__PURE__*/React.createElement(Button, null, "Cancel"), /*#__PURE__*/React.createElement(PrimaryButton, null, "Okay"))));
export default {
  title: 'Components/ModalActions',
  component: ModalActions,
  parameters: {
    notes
  }
};
//# sourceMappingURL=ModalActions.stories.js.map