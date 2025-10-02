import * as React from 'react';
import { useIntl } from 'react-intl';
import { Button, IconButton, LoadingIndicator, Tooltip } from '@box/blueprint-web';
import { ArrowCurveForward, Checkmark, XMark } from '@box/blueprint-web-assets/icons/Fill';
import { Size5, SurfaceStatusSurfaceSuccess } from '@box/blueprint-web-assets/tokens/tokens';
import IconInProgress from './IconInProgress';
import { ERROR_CODE_ITEM_NAME_IN_USE, ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED, STATUS_COMPLETE, STATUS_ERROR, STATUS_IN_PROGRESS, STATUS_PENDING, STATUS_STAGED } from '../../constants';
import messages from '../common/messages';
import './ItemAction.scss';
const ItemAction = ({
  error,
  isFolder = false,
  isResumableUploadsEnabled,
  onClick,
  onUpgradeCTAClick,
  status
}) => {
  const {
    formatMessage
  } = useIntl();
  const {
    code
  } = error || {};
  const LoadingIndicatorIcon = /*#__PURE__*/React.forwardRef(() => /*#__PURE__*/React.createElement(LoadingIndicator, {
    "aria-label": formatMessage(messages.loading),
    className: "bcu-ItemAction-loading"
  }));
  let Icon = XMark;
  let tooltip;
  if (isFolder && status !== STATUS_PENDING) {
    return null;
  }
  switch (status) {
    case STATUS_COMPLETE:
      Icon = /*#__PURE__*/React.forwardRef(() => /*#__PURE__*/React.createElement(Checkmark, {
        "aria-label": formatMessage(messages.complete),
        color: SurfaceStatusSurfaceSuccess,
        height: Size5,
        width: Size5
      }));
      if (!isResumableUploadsEnabled) {
        tooltip = messages.remove;
      }
      break;
    case STATUS_ERROR:
      if (code === ERROR_CODE_ITEM_NAME_IN_USE) {
        Icon = XMark;
        tooltip = messages.uploadsCancelButtonTooltip;
      } else {
        Icon = ArrowCurveForward;
        tooltip = isResumableUploadsEnabled ? messages.resume : messages.retry;
      }
      break;
    case STATUS_IN_PROGRESS:
    case STATUS_STAGED:
      if (isResumableUploadsEnabled) {
        Icon = LoadingIndicatorIcon;
      } else {
        Icon = IconInProgress;
        tooltip = messages.uploadsCancelButtonTooltip;
      }
      break;
    case STATUS_PENDING:
    default:
      if (isResumableUploadsEnabled) {
        Icon = LoadingIndicatorIcon;
      } else {
        tooltip = messages.uploadsCancelButtonTooltip;
      }
      break;
  }
  if (status === STATUS_ERROR && code === ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED && !!onUpgradeCTAClick) {
    return /*#__PURE__*/React.createElement(Button, {
      onClick: onUpgradeCTAClick,
      "data-resin-target": "large_version_error_inline_upgrade_cta",
      variant: "primary"
    }, formatMessage(messages.uploadsFileSizeLimitExceededUpgradeMessageForUpgradeCta));
  }
  const isDisabled = status === STATUS_STAGED;
  const tooltipText = tooltip && formatMessage(tooltip);
  return /*#__PURE__*/React.createElement("div", {
    className: "bcu-item-action"
  }, tooltip ? /*#__PURE__*/React.createElement(Tooltip, {
    content: tooltipText
  }, /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": tooltipText,
    disabled: isDisabled,
    icon: Icon,
    onClick: onClick
  })) : /*#__PURE__*/React.createElement(Icon, null));
};
export default ItemAction;
//# sourceMappingURL=ItemAction.js.map