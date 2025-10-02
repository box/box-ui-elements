import { PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_PREVIEW } from '../../../constants';
export const getAllowedPermissionLevels = (canChangeAccessLevel, isDownloadSettingAvailable, permission) => {
  let allowedPermissionLevels = [PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_PREVIEW];
  if (!canChangeAccessLevel) {
    // remove all but current level
    allowedPermissionLevels = allowedPermissionLevels.filter(level => level === permission);
  }

  // if we cannot set the download value, we remove this option from the dropdown
  if (!isDownloadSettingAvailable) {
    allowedPermissionLevels = allowedPermissionLevels.filter(level => level !== PERMISSION_CAN_DOWNLOAD);
  }
  return allowedPermissionLevels;
};
//# sourceMappingURL=getAllowedPermissionLevels.js.map