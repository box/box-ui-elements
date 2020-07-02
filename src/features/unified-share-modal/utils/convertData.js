// @flow
import { getTypedFileId, getTypedFolderId } from '../../../utils/file';
import {
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    ACCESS_NONE,
    ACCESS_OPEN,
    INVITEE_ROLE_EDITOR,
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_PREVIEW,
    TYPE_FOLDER,
} from '../../../constants';
import {
    ALLOWED_ACCESS_LEVELS,
    ANYONE_IN_COMPANY,
    ANYONE_WITH_LINK,
    CAN_VIEW_DOWNLOAD,
    CAN_VIEW_ONLY,
    PEOPLE_IN_ITEM,
} from '../constants';
import type {
    ContentSharingItemAPIResponse,
    ContentSharingItemDataType,
    ContentSharingUserDataType,
} from '../../../elements/content-sharing/types';
import type { User } from '../../../common/types/core';

/**
 * The following constants are used for converting API requests
 * and responses into objects expected by the USM, and vice versa
 */
export const API_TO_USM_ACCESS_LEVEL_MAP = {
    [ACCESS_COLLAB]: PEOPLE_IN_ITEM,
    [ACCESS_COMPANY]: ANYONE_IN_COMPANY,
    [ACCESS_OPEN]: ANYONE_WITH_LINK,
    [ACCESS_NONE]: null,
};
export const API_TO_USM_PERMISSION_LEVEL_MAP = {
    [PERMISSION_CAN_DOWNLOAD]: CAN_VIEW_DOWNLOAD,
    [PERMISSION_CAN_PREVIEW]: CAN_VIEW_ONLY,
};

export const USM_TO_API_ACCESS_LEVEL_MAP = {
    [ANYONE_IN_COMPANY]: ACCESS_COMPANY,
    [ANYONE_WITH_LINK]: ACCESS_OPEN,
    [PEOPLE_IN_ITEM]: ACCESS_COLLAB,
};

export const USM_TO_API_PERMISSION_LEVEL_MAP = {
    [CAN_VIEW_DOWNLOAD]: PERMISSION_CAN_DOWNLOAD,
    [CAN_VIEW_ONLY]: PERMISSION_CAN_PREVIEW,
};

/**
 * Convert a response from the Item API to the object that the USM expects.
 * @param {BoxItem} itemAPIData
 */
export const convertItemResponse = (itemAPIData: ContentSharingItemAPIResponse): ContentSharingItemDataType => {
    const {
        allowed_invitee_roles,
        id,
        description,
        extension,
        name,
        owned_by: { id: ownerID, login: ownerEmail },
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
            ownerEmail, // the owner email is used to determine whether collaborators are external
            ownerID, // the owner ID is used to determine whether external collaborator badges should be shown
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
export const convertUserResponse = (userAPIData: User): ContentSharingUserDataType => {
    const { enterprise, hostname, id } = userAPIData;

    return {
        id,
        userEnterpriseData: {
            enterpriseName: enterprise ? enterprise.name : '',
            hostname,
            serverURL: hostname ? `${hostname}/v/` : '',
        },
    };
};

/**
 * Convert a response from the Item Collaborators API into the object that the USM expects.
 * @param {Collaborators} collabsAPIData
 */
export const convertCollabsResponse = (
    collabsAPIData: Collaborators,
    hostname: string,
    ownerEmail: string,
    isCurrentUserOwner: boolean,
): collaboratorsListType => {
    let collaborators = [];

    const { entries } = collabsAPIData;

    if (entries.length) {
        const ownerEmailDomain = ownerEmail.split('@')[1];
        collaborators = entries.map(collab => {
            const {
                accessible_by: { id: userID, login: email, name },
                id: collabID,
                expires_at: executeAt,
                role: translatedRole,
                type,
            } = collab;
            const collabEmailDomain = email.split('@')[1];
            // Only display external collaborator icons if the current user owns the item
            // and if the collaborator's email domain differs from the owner's email domain
            const isExternalCollab = isCurrentUserOwner && collabEmailDomain !== ownerEmailDomain;
            return {
                collabID,
                email,
                expiration: executeAt
                    ? {
                          executeAt,
                      }
                    : null,
                hasCustomAvatar: false, // to do: connect to Avatar API
                imageURL: null, // to do: connect to Avatar API
                isExternalCollab,
                name,
                profileURL: `${hostname}/profile/${userID}`,
                translatedRole,
                type,
                userID,
            };
        });
    }

    return {
        collaborators,
    };
};
