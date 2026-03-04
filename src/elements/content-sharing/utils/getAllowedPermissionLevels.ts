import {
    ACCESS_COMPANY,
    ACCESS_OPEN,
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_EDIT,
    PERMISSION_CAN_PREVIEW,
    TYPE_FOLDER,
} from '../../../constants';

type GetAllowedPermissionLevelsParams = {
    access: string;
    canChangeAccessLevel: boolean;
    extension: string;
    isDownloadSettingAvailable: boolean;
    itemType: string;
    permission: string;
};

export const getAllowedPermissionLevels = ({
    access,
    canChangeAccessLevel,
    extension,
    isDownloadSettingAvailable,
    itemType,
    permission,
}: GetAllowedPermissionLevelsParams): Array<string> => {
    let allowedPermissionLevels = [PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_PREVIEW, PERMISSION_CAN_EDIT];

    if (!canChangeAccessLevel) {
        // remove all but current level
        allowedPermissionLevels = allowedPermissionLevels.filter(level => level === permission);
    }

    // if we cannot set the download value, we remove this option from the dropdown
    if (!isDownloadSettingAvailable) {
        allowedPermissionLevels = allowedPermissionLevels.filter(level => level !== PERMISSION_CAN_DOWNLOAD);
    }

    // Can Edit requires ACCESS_OPEN or ACCESS_COMPANY, and must NOT be a folder
    const canEditAccessLevels = [ACCESS_OPEN, ACCESS_COMPANY];
    if (!canEditAccessLevels.includes(access) || itemType === TYPE_FOLDER || extension?.toLowerCase() === 'webdoc') {
        allowedPermissionLevels = allowedPermissionLevels.filter(level => level !== PERMISSION_CAN_EDIT);
    }

    return allowedPermissionLevels;
};
