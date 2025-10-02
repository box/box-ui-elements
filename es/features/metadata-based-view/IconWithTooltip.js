import React from 'react';
import { FormattedMessage } from 'react-intl';
import PlainButton from '../../components/plain-button';
import Button from '../../components/button';
import Tooltip from '../../components/tooltip';
import IconCheck from '../../icons/general/IconCheck';
import IconClose from '../../icons/general/IconClose';
import IconPencil from '../../icons/general/IconPencil';
import { bdlGray65 } from '../../styles/variables';
import { CANCEL_ICON_TYPE, EDIT_ICON_TYPE, SAVE_ICON_TYPE } from './constants';
const IconWithTooltip = ({
  className,
  isUpdating,
  onClick,
  tooltipText,
  type
}) => {
  let iconBtn;
  switch (type) {
    case CANCEL_ICON_TYPE:
      iconBtn = /*#__PURE__*/React.createElement(PlainButton, {
        className: className,
        type: "button",
        onClick: onClick
      }, /*#__PURE__*/React.createElement(IconClose, {
        color: bdlGray65,
        width: 16,
        height: 16
      }));
      break;
    case EDIT_ICON_TYPE:
      iconBtn = /*#__PURE__*/React.createElement(PlainButton, {
        className: className,
        type: "button",
        onClick: onClick
      }, /*#__PURE__*/React.createElement(IconPencil, {
        color: bdlGray65
      }));
      break;
    case SAVE_ICON_TYPE:
      iconBtn = /*#__PURE__*/React.createElement(Button, {
        className: className,
        isLoading: isUpdating,
        type: "button",
        onClick: onClick
      }, /*#__PURE__*/React.createElement(IconCheck, {
        color: bdlGray65,
        width: 16,
        height: 16
      }));
      break;
    default:
      return null;
  }
  return /*#__PURE__*/React.createElement(Tooltip, {
    text: tooltipText
  }, iconBtn);
};
export default IconWithTooltip;
//# sourceMappingURL=IconWithTooltip.js.map