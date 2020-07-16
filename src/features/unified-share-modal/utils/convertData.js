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
import type { BoxItemPermission, Collaborations, User, UserCollection } from '../../../common/types/core';
import type { collaboratorsListType, collaboratorType, contactType } from '../flowTypes';

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
 *
 * @param {BoxItem} itemAPIData
 * @returns {ContentSharingItemDataType} Object containing item and shared link information
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
            password,
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
        const canChangeExpiration = canChangeAccessLevel && isEditAllowed;

        sharedLink = {
            accessLevel,
            allowedAccessLevels: ALLOWED_ACCESS_LEVELS,
            canChangeAccessLevel,
            canChangeDownload,
            canChangeExpiration,
            canChangePassword,
            canChangeVanityName,
            canInvite: !!canInvite,
            directLink,
            expirationTimestamp: expirationTimestamp ? new Date(expirationTimestamp).getTime() : null, // convert to milliseconds
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
            password,
            permissionLevel,
            url,
            vanityName: vanityName || '',
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
            hideCollaborators: false, // to do: connect to Collaborations API
            id,
            name,
            ownerEmail, // the owner email is used to determine whether collaborators are external
            ownerID, // the owner ID is used to determine whether external collaborator badges should be shown
            permissions, // the original permissions are necessary for PUT requests to the Item API
            type,
            typedID: type === TYPE_FOLDER ? getTypedFolderId(id) : getTypedFileId(id),
        },
        sharedLink,
    };
};

/**
 * Convert a response from the User API into the object that the USM expects.
 *
 * @param {User} userAPIData
 * @returns {ContentSharingUserDataType} Object containing user and enterprise information
 */
export const convertUserResponse = (userAPIData: User): ContentSharingUserDataType => {
    const { enterprise, hostname, id } = userAPIData;

    return {
        id,
        userEnterpriseData: {
            enterpriseName: enterprise ? enterprise.name : '',
            serverURL: hostname ? `${hostname}v/` : '',
        },
    };
};

/**
 * Create a shared link permissions object for the API based on a USM permission level.
 *
 * @param {string} newSharedLinkPermissionLevel
 * @returns {$Shape<BoxItemPermission>} Object containing shared link permissions
 */
export const convertSharedLinkPermissions = (newSharedLinkPermissionLevel: string): $Shape<BoxItemPermission> => {
    const sharedLinkPermissions = {};
    Object.keys(USM_TO_API_PERMISSION_LEVEL_MAP).forEach(level => {
        if (level === newSharedLinkPermissionLevel) {
            sharedLinkPermissions[USM_TO_API_PERMISSION_LEVEL_MAP[level]] = true;
        } else {
            sharedLinkPermissions[USM_TO_API_PERMISSION_LEVEL_MAP[level]] = false;
        }
    });
    return sharedLinkPermissions;
};

/**
 * Convert an item from the USM into the object that the Item API expects.
 * @param {*} newSettings
 */
export const convertSharedLinkSettings = (newSettings, serverURL: string) => {
    const { expirationTimestamp, isDownloadEnabled: can_download, password, vanityName } = newSettings;

    return {
        can_download,
        vanity_url: vanityName ? `${serverURL}${vanityName}` : null,
        unshared_at: expirationTimestamp ? new Date(expirationTimestamp).toISOString() : null,
        ...(password && { password }),
    };
};

/**
 * Convert a response from the Item Collaborations API into the object that the USM expects.
 *
 * @param {Collaborations} collabsAPIData
 * @param {string | null | undefined} ownerEmail
 * @param {boolean} isCurrentUserOwner
 * @returns {collaboratorsListType} Object containing an array of collaborators
 */
export const convertCollabsResponse = (
    collabsAPIData: Collaborations,
    ownerEmail: ?string,
    isCurrentUserOwner: boolean,
): collaboratorsListType => {
    const { entries } = collabsAPIData;

    if (!entries.length) return { collaborators: [] };

    const ownerEmailDomain = ownerEmail && /@/.test(ownerEmail) ? ownerEmail.split('@')[1] : null;
    const collaborators = entries.map(collab => {
        const {
            accessible_by: { id: userID, login: email, name, type },
            id: collabID,
            expires_at: executeAt,
            role,
        } = collab;
        const collabEmailDomain = email.split('@')[1];
        // Only display external collaborator icons if the current user owns the item
        // and if the collaborator's email domain differs from the owner's email domain
        const isExternalCollab = isCurrentUserOwner && collabEmailDomain !== ownerEmailDomain;
        const convertedCollab: collaboratorType = {
            collabID: parseInt(collabID, 10),
            email,
            hasCustomAvatar: false, // to do: connect to Avatar API
            imageURL: null, // to do: connect to Avatar API
            isExternalCollab,
            name,
            translatedRole: `${role[0].toUpperCase()}${role.slice(1)}`, // capitalize the user's role
            type,
            userID: parseInt(userID, 10),
        };
        if (executeAt) {
            convertedCollab.expiration = { executeAt };
        }
        return convertedCollab;
    });

    return { collaborators };
};

/**
 * Convert an enterprise users API response into an array of internal USM contacts.
 *
 * @param {UserCollection} contactsAPIData
 * @param {string|null} currentUserID
 * @returns {Array<contactType>} Array of USM contacts
 */
export const convertContactsResponse = (
    contactsAPIData: UserCollection,
    currentUserID: string | null,
): Array<contactType> => {
    const { entries = [] } = contactsAPIData;

    // Return all users except for the current user
    return entries
        .map(contact => {
            const { id, login: email, name, type } = contact;
            return {
                id,
                email,
                name,
                type,
            };
        })
        .filter(({ id }) => id !== currentUserID);
};
