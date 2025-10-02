import * as React from 'react';
import AccessDescription from './AccessDescription';
import AccessMenu from './AccessMenu';
import PermissionMenu from './PermissionMenu';
import { accessLevelPropType, allowedAccessLevelsPropType, permissionLevelPropType } from './propTypes';
const SharedLinkAccess = props => {
  const {
    accessDropdownMenuProps,
    accessLevel,
    accessMenuButtonProps,
    allowedAccessLevels,
    canRemoveLink,
    changeAccessLevel,
    changePermissionLevel,
    enterpriseName,
    isDownloadAllowed,
    isEditAllowed,
    isPreviewAllowed,
    itemType,
    permissionLevel,
    removeLink,
    removeLinkButtonProps,
    submitting
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    className: "shared-link-access"
  }, /*#__PURE__*/React.createElement(AccessDescription, {
    accessLevel: accessLevel,
    enterpriseName: enterpriseName,
    isDownloadAllowed: isDownloadAllowed,
    isEditAllowed: isEditAllowed,
    isPreviewAllowed: isPreviewAllowed,
    itemType: itemType
  }), /*#__PURE__*/React.createElement(AccessMenu, {
    accessDropdownMenuProps: accessDropdownMenuProps,
    accessLevel: accessLevel,
    accessMenuButtonProps: accessMenuButtonProps,
    allowedAccessLevels: allowedAccessLevels,
    canRemoveLink: canRemoveLink,
    changeAccessLevel: changeAccessLevel,
    enterpriseName: enterpriseName,
    isDownloadAllowed: isDownloadAllowed,
    isEditAllowed: isEditAllowed,
    isPreviewAllowed: isPreviewAllowed,
    itemType: itemType,
    removeLink: removeLink,
    removeLinkButtonProps: removeLinkButtonProps,
    submitting: submitting
  }), /*#__PURE__*/React.createElement(PermissionMenu, {
    changePermissionLevel: changePermissionLevel,
    permissionLevel: permissionLevel,
    submitting: submitting
  }));
};
export default SharedLinkAccess;
//# sourceMappingURL=SharedLinkAccess.js.map