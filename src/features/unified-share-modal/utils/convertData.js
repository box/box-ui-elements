// @flow
import type { User } from '../../../common/types/core';
import { getTypedFileId, getTypedFolderId } from '../../../utils/file';
import { INVITEE_ROLE_EDITOR, TYPE_FOLDER } from '../../../constants';
import { ALLOWED_ACCESS_LEVELS, API_TO_USM_ACCESS_LEVEL_MAP, API_TO_USM_PERMISSION_LEVEL_MAP } from '../constants';
import type {
    ContentSharingItemAPIResponse,
    ContentSharingItemDataType,
    ContentSharingUserDataType,
} from '../../../elements/content-sharing/types';

/**
 * Convert a response from the Item API to the object that the USM expects.
 * @param {BoxItem} itemAPIData
 */
const convertItemResponse = (itemAPIData: ContentSharingItemAPIResponse): ContentSharingItemDataType => {
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

    // The "canInvite" property is necessary even if the item does not have a shared link,
    // because it allows users to invite individual collaborators.
    let sharedLink = { canInvite: !!canInvite };

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

        const accessLevel = effective_access ? API_TO_USM_ACCESS_LEVEL_MAP[effective_access] : null;
        const permissionLevel = effective_permission ? API_TO_USM_PERMISSION_LEVEL_MAP[effective_permission] : null;
        const isDownloadAllowed = permissionLevel === API_TO_USM_PERMISSION_LEVEL_MAP.can_download;
        const canChangeDownload = canChangeAccessLevel && isDownloadAllowed;
        const canChangePassword = canChangeAccessLevel && isPasswordAvailable;
        const canChangeVanityName = canChangeAccessLevel && isVanityNameAvailable;

        sharedLink = {
            accessLevel,
            allowedAccessLevels: ALLOWED_ACCESS_LEVELS,
            canChangeAccessLevel,
            canChangeDownload,
            canChangePassword,
            canChangeVanityName,
            canInvite: !!canInvite,
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
                itemShare: !!itemShare,
            },
            hideCollaborators: false, // to do: connect to Collaborators API
            id,
            name,
            type,
            typedID: type === TYPE_FOLDER ? getTypedFolderId(id) : getTypedFileId(id),
        },
        originalItemPermissions: permissions, // the original permissions are necessary for PUT requests to the Item API
        sharedLink,
    };
};

/**
 * Convert a response from the User API into the object that the USM expects.
 * @param {User} userAPIData
 */
const convertUserResponse = (userAPIData: User): ContentSharingUserDataType => {
    const { enterprise, hostname, id } = userAPIData;

    return {
        id,
        userEnterpriseData: {
            enterpriseName: enterprise ? enterprise.name : '',
            serverURL: hostname ? `${hostname}/v/` : '',
        },
    };
};

export { convertItemResponse, convertUserResponse };
