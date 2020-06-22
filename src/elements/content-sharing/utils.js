// @flow
import type { User } from '../../common/types/core';
import { getTypedFileId, getTypedFolderId } from '../../utils/file';
import {
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    ACCESS_OPEN,
    INVITEE_ROLE_EDITOR,
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
import type { ContentSharingItemAPIResponse, ContentSharingItemDataType, ContentSharingUserDataType } from './types';

const ACCESS_LEVEL_MAP = {
    [ACCESS_COLLAB]: PEOPLE_IN_ITEM,
    [ACCESS_OPEN]: ANYONE_WITH_LINK,
    [ACCESS_COMPANY]: ANYONE_IN_COMPANY,
};

const PERMISSION_LEVEL_MAP = {
    [PERMISSION_CAN_DOWNLOAD]: CAN_VIEW_DOWNLOAD,
    [PERMISSION_CAN_PREVIEW]: CAN_VIEW_ONLY,
};

/**
 * Convert a response from the Item API to the object that the USM expects.
 * @param {BoxItem} itemAPIData
 */
const normalizeItemResponse = (itemAPIData: ContentSharingItemAPIResponse): ContentSharingItemDataType => {
    let sharedLink = { canInvite: false };

    const {
        allowed_invitee_roles,
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
        can_invite_collaborator: canInvite,
        can_preview: isPreviewAllowed,
        can_set_share_access: canChangeAccessLevel,
        can_share: itemShare,
    } = permissions;

    const isEditAllowed = allowed_invitee_roles.indexOf(INVITEE_ROLE_EDITOR) !== -1;

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
            canChangeDownload,
            canChangePassword,
            canChangeVanityName,
            canInvite,
            directLink,
            expirationTimestamp,
            isDirectLinkAvailable,
            isDownloadAllowed,
            isDownloadAvailable: isDownloadSettingAvailable,
            isDownloadEnabled: isDownloadAllowed,
            isDownloadSettingAvailable,
            isEditAllowed,
            isNewSharedLink: false,
            isPasswordAvailable,
            isPasswordEnabled,
            isPreviewAllowed,
            permissionLevel,
            url,
            vanityName,
        };
    }

    return {
        item: {
            canUserSeeClassification: false,
            description,
            extension,
            grantedPermissions: {
                itemShare,
            },
            hideCollaborators: false, // to do: connect to Collaborators API
            id,
            name,
            type,
            typedID: type === TYPE_FOLDER ? getTypedFolderId(id) : getTypedFileId(id),
        },
        sharedLink,
    };
};

/**
 * Convert a response from the User API into the object that the USM expects.
 * @param {User} userAPIData
 */
const normalizeUserResponse = (userAPIData: User): ContentSharingUserDataType => {
    const { enterprise, hostname, id } = userAPIData;

    return {
        id,
        userEnterpriseData: {
            enterpriseName: enterprise ? enterprise.name : '',
            serverURL: hostname ? `${hostname}/v/` : '',
        },
    };
};

export { normalizeItemResponse, normalizeUserResponse, PERMISSION_LEVEL_MAP };
