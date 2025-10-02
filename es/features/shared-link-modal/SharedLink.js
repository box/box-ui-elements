function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import TextInputWithCopyButton from '../../components/text-input-with-copy-button';
import Tooltip from '../../components/tooltip';
import PlainButton from '../../components/plain-button';
import { convertToMs } from '../../utils/datetime';
import IconExpirationInverted from '../../icons/general/IconExpirationInverted';
import IconSettingInverted from '../../icons/general/IconSettingInverted';
import SharedLinkAccess from './SharedLinkAccess';
import messages from './messages';
import { accessLevelPropType, allowedAccessLevelsPropType, permissionLevelPropType } from './propTypes';
import './SharedLink.scss';
const SharedLink = props => {
  const {
    accessDropdownMenuProps,
    accessLevel,
    accessMenuButtonProps,
    allowedAccessLevels,
    canRemoveLink,
    changeAccessLevel,
    changePermissionLevel,
    copyButtonProps,
    enterpriseName,
    expiration,
    intl,
    isDownloadAllowed,
    isEditAllowed,
    isPreviewAllowed,
    itemType,
    onCopySuccess,
    onSettingsClick,
    permissionLevel,
    removeLink,
    removeLinkButtonProps,
    settingsButtonProps = {},
    sharedLink,
    submitting
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    className: "shared-link"
  }, /*#__PURE__*/React.createElement("div", {
    className: "shared-link-icons"
  }, expiration ? /*#__PURE__*/React.createElement(Tooltip, {
    position: "middle-left",
    text: /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.sharedLinkExpirationTooltip, {
      values: {
        expiration: convertToMs(expiration)
      }
    }))
  }, /*#__PURE__*/React.createElement("span", {
    className: "shared-link-expiration"
  }, /*#__PURE__*/React.createElement(IconExpirationInverted, {
    height: 16,
    width: 16
  }))) : null, onSettingsClick && /*#__PURE__*/React.createElement(PlainButton, _extends({}, settingsButtonProps, {
    "aria-label": intl.formatMessage(messages.settingsButtonLabel),
    className: "shared-link-settings-btn",
    onClick: onSettingsClick,
    type: "button"
  }), /*#__PURE__*/React.createElement(IconSettingInverted, null))), /*#__PURE__*/React.createElement(TextInputWithCopyButton, {
    buttonProps: copyButtonProps,
    className: "shared-link-container",
    disabled: submitting,
    label: /*#__PURE__*/React.createElement(FormattedMessage, messages.sharedLinkLabel),
    onCopySuccess: onCopySuccess,
    type: "url",
    value: sharedLink
  }), /*#__PURE__*/React.createElement(SharedLinkAccess, {
    accessDropdownMenuProps: accessDropdownMenuProps,
    accessLevel: accessLevel,
    accessMenuButtonProps: accessMenuButtonProps,
    allowedAccessLevels: allowedAccessLevels,
    canRemoveLink: canRemoveLink,
    changeAccessLevel: changeAccessLevel,
    changePermissionLevel: changePermissionLevel,
    enterpriseName: enterpriseName,
    isDownloadAllowed: isDownloadAllowed,
    isEditAllowed: isEditAllowed,
    isPreviewAllowed: isPreviewAllowed,
    itemType: itemType,
    permissionLevel: permissionLevel,
    removeLink: removeLink,
    removeLinkButtonProps: removeLinkButtonProps,
    submitting: submitting
  }));
};
export { SharedLink as SharedLinkBase };
export default injectIntl(SharedLink);
//# sourceMappingURL=SharedLink.js.map