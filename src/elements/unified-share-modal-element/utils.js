// @flow
import type { BoxItem, BoxUser } from '../../common/types/core';
import { getTypedFileId, getTypedFolderId } from '../../utils/file';
import {
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    ACCESS_OPEN,
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_PREVIEW,
    TYPE_FOLDER,
} from '../../constants';
import {
    ANYONE_IN_COMPANY,
    ANYONE_WITH_LINK,
    CAN_VIEW_DOWNLOAD,
    CAN_VIEW_ONLY,
    PEOPLE_IN_ITEM,
} from '../../features/unified-share-modal/constants';

const ACCESS_LEVEL_MAP = {
    [ACCESS_COLLAB]: PEOPLE_IN_ITEM,
    [ACCESS_OPEN]: ANYONE_WITH_LINK,
    [ACCESS_COMPANY]: ANYONE_IN_COMPANY,
};

const PERMISSION_LEVEL_MAP = {
    [PERMISSION_CAN_DOWNLOAD]: CAN_VIEW_DOWNLOAD,
    [PERMISSION_CAN_PREVIEW]: CAN_VIEW_ONLY,
};

const normalizeItemResponse = (itemAPIData: BoxItem) => {
    let sharedLink = {};

    const {
        id,
        description,
        extension,
        name,
        permissions,
        shared_link,
        shared_link_features: {
            download_url: isDirectLinkAvailable,
            password: isPasswordAvailable,
            vanity_name: isVanityNameAvailable,
        },
        type,
    } = itemAPIData;
    const {
        can_download: isDownloadSettingAvailable,
        can_edit: isEditAllowed,
        can_invite_collaborator: canInvite,
        can_preview: isPreviewAllowed,
        can_set_share_access: canChangeAccessLevel,
        can_share: itemShare,
    } = permissions;

    if (shared_link) {
        const {
            download_url: directLink,
            effective_access,
            effective_permission,
            is_password_enabled: isPasswordEnabled,
            unshared_at: expirationTimestamp,
            url,
            vanity_name: vanityName,
        } = shared_link;

        const accessLevel = ACCESS_LEVEL_MAP[effective_access];
        const permissionLevel = PERMISSION_LEVEL_MAP[effective_permission];
        const isDownloadAllowed = permissionLevel === PERMISSION_LEVEL_MAP.can_download;
        const canChangeDownload = canChangeAccessLevel && isDownloadAllowed;
        const canChangePassword = canChangeAccessLevel && isPasswordAvailable;
        const canChangeVanityName = canChangeAccessLevel && isVanityNameAvailable;

        sharedLink = {
            accessLevel,
            allowedAccessLevels: {
                peopleInThisItem: accessLevel === PEOPLE_IN_ITEM,
                peopleInYourCompany: accessLevel === ANYONE_IN_COMPANY,
                peopleWithTheLink: accessLevel === ANYONE_WITH_LINK,
            },
            canChangeAccessLevel,
            canChangeDownload, // SLS
            canChangePassword, // SLS
            canChangeVanityName, // SLS
            canInvite,
            directLink, // SLS
            expirationTimestamp, // SLS
            isDirectLinkAvailable, // SLS
            isDownloadAllowed,
            isDownloadAvailable: isDownloadSettingAvailable, // SLS
            isDownloadEnabled: isDownloadAllowed, // SLS
            isDownloadSettingAvailable,
            isEditAllowed,
            isNewSharedLink: false,
            isPasswordAvailable, // SLS
            isPasswordEnabled, // SLS
            isPreviewAllowed,
            permissionLevel,
            url,
            vanityName, // SLS
        };
    }

    return {
        item: {
            description,
            extension,
            id,
            grantedPermissions: {
                itemShare,
            },
            name,
            type,
            typedID: type === TYPE_FOLDER ? getTypedFolderId(id) : getTypedFileId(id),
        },
        sharedLink,
    };
};

const normalizeUserResponse = (userAPIData: BoxUser) => {
    const { enterprise, hostname, id } = userAPIData;

    return {
        id,
        userEnterpriseData: {
            enterpriseName: enterprise ? enterprise.name : '',
            serverURL: hostname ? `${hostname}/v/` : '', // SLS
        },
    };
};

export { normalizeItemResponse, normalizeUserResponse, PERMISSION_LEVEL_MAP };
