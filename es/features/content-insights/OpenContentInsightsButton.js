import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button, { ButtonType } from '../../components/button';
import messages from './messages';
const OpenContentInsightsButton = ({
  onClick
}) => {
  return /*#__PURE__*/React.createElement(Button, {
    className: "OpenContentInsightsButton",
    onClick: onClick,
    type: ButtonType.BUTTON
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.openContentInsightsButton));
};
export default OpenContentInsightsButton;
//# sourceMappingURL=OpenContentInsightsButton.js.map