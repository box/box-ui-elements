import * as React from 'react';
import { injectIntl } from 'react-intl';
import IconClose from '../../icon/fill/X16';
import PlainButton from '../plain-button';

// @ts-ignore flow import
import messages from '../../common/messages';
const CloseButton = ({
  intl,
  onClick
}) => /*#__PURE__*/React.createElement(PlainButton, {
  "aria-label": intl.formatMessage(messages.close),
  className: "tooltip-close-button",
  onClick: onClick
}, /*#__PURE__*/React.createElement(IconClose, {
  className: "bdl-Tooltip-iconClose",
  width: 14,
  height: 14
}));
export { CloseButton as CloseButtonBase };
export default injectIntl(CloseButton);
//# sourceMappingURL=CloseButton.js.map