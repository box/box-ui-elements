const _excluded = ["canInvite", "canShare", "className", "getSharedLinkProps", "inviteCollabsProps", "inviteRestrictionCode", "isDownloadAllowed", "isPreviewAllowed", "onGetSharedLinkSelect", "onInviteCollabSelect"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Tooltip from '../../components/tooltip';
import { Menu, MenuItem } from '../../components/menu';
import IconSharedLink from '../../icons/general/IconSharedLink';
import IconInviteCollaborators from '../../icons/general/IconInviteCollaborators';
import IconCollaboratorsRestricted from '../../icons/general/IconCollaboratorsRestricted';
import IconSharedLinkRestricted from '../../icons/general/IconSharedLinkRestricted';
import messages from './messages';
import './ShareMenu.scss';
const OWNER_COOWNER_ONLY = 'owner_coowner_only';
const INSUFFICIENT_PERMISSIONS = 'insufficient_permissions';
const ShareMenu = _ref => {
  let {
      canInvite,
      canShare,
      className = '',
      getSharedLinkProps = {},
      inviteCollabsProps = {},
      inviteRestrictionCode,
      isDownloadAllowed,
      isPreviewAllowed,
      onGetSharedLinkSelect,
      onInviteCollabSelect
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const inviteCollabsOption = /*#__PURE__*/React.createElement(MenuItem, _extends({
    className: "invite-collaborators",
    isDisabled: !canInvite,
    onClick: onInviteCollabSelect
  }, inviteCollabsProps), canInvite ? /*#__PURE__*/React.createElement(IconInviteCollaborators, null) : /*#__PURE__*/React.createElement(IconCollaboratorsRestricted, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FormattedMessage, messages.inviteCollabs)), /*#__PURE__*/React.createElement("div", {
    className: "share-option-description"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.editAndComment))));
  const inviteCollabTooltip = inviteRestrictionCode === OWNER_COOWNER_ONLY ? /*#__PURE__*/React.createElement(FormattedMessage, messages.ownerCoownerOnlyTooltip) : /*#__PURE__*/React.createElement(FormattedMessage, messages.insufficientPermissionsTooltip);
  let sharedLinkPermissions;
  if (isDownloadAllowed && isPreviewAllowed) {
    sharedLinkPermissions = /*#__PURE__*/React.createElement(FormattedMessage, messages.viewAndDownload);
  } else if (isPreviewAllowed) {
    sharedLinkPermissions = /*#__PURE__*/React.createElement(FormattedMessage, messages.viewOnly);
  } else if (isDownloadAllowed) {
    sharedLinkPermissions = /*#__PURE__*/React.createElement(FormattedMessage, messages.downloadOnly);
  } else {
    sharedLinkPermissions = /*#__PURE__*/React.createElement(FormattedMessage, messages.shortcutOnly);
  }
  return /*#__PURE__*/React.createElement(Menu, _extends({
    className: `share-menu ${className}`
  }, rest), canInvite ? inviteCollabsOption : /*#__PURE__*/React.createElement(Tooltip, {
    position: "middle-left",
    text: inviteCollabTooltip
  }, inviteCollabsOption), /*#__PURE__*/React.createElement(MenuItem, _extends({
    className: "get-shared-link",
    isDisabled: !canShare,
    onClick: onGetSharedLinkSelect
  }, getSharedLinkProps), canShare ? /*#__PURE__*/React.createElement(IconSharedLink, null) : /*#__PURE__*/React.createElement(IconSharedLinkRestricted, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FormattedMessage, messages.getSharedLink)), /*#__PURE__*/React.createElement("div", {
    className: "share-option-description"
  }, sharedLinkPermissions))));
};
ShareMenu.propTypes = {
  canInvite: PropTypes.bool.isRequired,
  canShare: PropTypes.bool.isRequired,
  className: PropTypes.string,
  getSharedLinkProps: PropTypes.object,
  inviteCollabsProps: PropTypes.object,
  inviteRestrictionCode: PropTypes.oneOf([INSUFFICIENT_PERMISSIONS, OWNER_COOWNER_ONLY]),
  isDownloadAllowed: PropTypes.bool.isRequired,
  isPreviewAllowed: PropTypes.bool.isRequired,
  onGetSharedLinkSelect: PropTypes.func.isRequired,
  onInviteCollabSelect: PropTypes.func.isRequired
};
export { OWNER_COOWNER_ONLY, INSUFFICIENT_PERMISSIONS };
export default ShareMenu;
//# sourceMappingURL=ShareMenu.js.map