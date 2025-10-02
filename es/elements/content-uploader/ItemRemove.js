function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { useIntl } from 'react-intl';
import { IconButton, Tooltip } from '@box/blueprint-web';
import { XMark } from '@box/blueprint-web-assets/icons/Fill';
import { STATUS_ERROR, STATUS_IN_PROGRESS, STATUS_STAGED } from '../../constants';
import messages from '../common/messages';
const ItemRemove = ({
  onClick,
  status
}) => {
  const {
    formatMessage
  } = useIntl();
  const resin = {};
  let target = null;
  if (status === STATUS_IN_PROGRESS) {
    target = 'uploadcancel';
  } else if (status === STATUS_ERROR) {
    target = 'remove-failed';
  }
  if (target) {
    resin['data-resin-target'] = target;
  }
  const isDisabled = status === STATUS_STAGED;
  const tooltipText = formatMessage(messages.remove);
  return /*#__PURE__*/React.createElement("div", {
    className: "bcu-item-action"
  }, /*#__PURE__*/React.createElement(Tooltip, {
    content: tooltipText
  }, /*#__PURE__*/React.createElement(IconButton, _extends({
    "aria-label": tooltipText,
    disabled: isDisabled,
    onClick: onClick,
    icon: XMark
  }, resin))));
};
export default ItemRemove;
//# sourceMappingURL=ItemRemove.js.map