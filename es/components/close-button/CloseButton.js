import * as React from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import Button, { ButtonType } from '../button';
import IconClose from '../../icons/general/IconClose';
import { bdlGray65 } from '../../styles/variables';

// @ts-ignore flow import
import messages from '../../common/messages';
import './CloseButton.scss';
const CloseButton = ({
  className,
  intl,
  onClick
}) => {
  return /*#__PURE__*/React.createElement(Button, {
    "aria-label": intl.formatMessage(messages.close),
    className: classNames('bdl-CloseButton', className),
    "data-testid": "bdl-CloseButton",
    onClick: onClick,
    type: ButtonType.BUTTON
  }, /*#__PURE__*/React.createElement(IconClose, {
    color: bdlGray65,
    height: 18,
    width: 18
  }));
};
export default injectIntl(CloseButton);
//# sourceMappingURL=CloseButton.js.map