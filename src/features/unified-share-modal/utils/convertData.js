// @flow
import { getTypedFileId, getTypedFolderId } from '../../../utils/file';
import { checkIsExternalUser } from '../../../utils/parseEmails';
import {
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    ACCESS_NONE,
    ACCESS_OPEN,
    INVITEE_ROLE_EDITOR,
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_PREVIEW,
    STATUS_ACCEPTED,
    TYPE_FOLDER,
} from '../../../constants';
import {
    ALLOWED_ACCESS_LEVELS,
    ANYONE_IN_COMPANY,
    ANYONE_WITH_LINK,
    CAN_VIEW_DOWNLOAD,
    CAN_VIEW_ONLY,
    COLLAB_GROUP_TYPE,
    COLLAB_USER_TYPE,
    PEOPLE_IN_ITEM,
} from '../constants';
import type {
    ContentSharingCollaborationsRequest,
    ContentSharingItemAPIResponse,
    ContentSharingItemDataType,
    ContentSharingUserDataType,
    SharedLinkSettingsOptions,
} from '../../../elements/content-sharing/types';
import type { BoxItemPermission, Collaborations, SharedLink, User, UserCollection } from '../../../common/types/core';
import type { collaboratorsListType, collaboratorType, contactType, InviteCollaboratorsRequest } from '../flowTypes';

/**
 * The following constants are used for converting API requests
 * and responses into objects expected by the USM, and vice versa
 */
export const API_TO_USM_ACCESS_LEVEL_MAP = {
    [ACCESS_COLLAB]: PEOPLE_IN_ITEM,
    [ACCESS_COMPANY]: ANYONE_IN_COMPANY,
    [ACCESS_OPEN]: ANYONE_WITH_LINK,
    [ACCESS_NONE]: '',
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
        shared_link_features: { download_url: isDirectLinkAvailable, password: isPasswordAvailable },
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

        const accessLevel = effective_access ? API_TO_USM_ACCESS_LEVEL_MAP[effective_access] : '';
        const permissionLevel = effective_permission ? API_TO_USM_PERMISSION_LEVEL_MAP[effective_permission] : null;
        const isDownloadAllowed = permissionLevel === API_TO_USM_PERMISSION_LEVEL_MAP.can_download;
        const canChangeDownload =
            canChangeAccessLevel && isDownloadSettingAvailable && effective_access !== ACCESS_COLLAB; // access must be "company" or "open"
        const canChangePassword = canChangeAccessLevel && isPasswordAvailable;
        const canChangeExpiration = canChangeAccessLevel && isEditAllowed;

        sharedLink = {
            accessLevel,
            allowedAccessLevels: ALLOWED_ACCESS_LEVELS,
            canChangeAccessLevel,
            canChangeDownload,
            canChangeExpiration,
            canChangePassword,
            canChangeVanityName: false, // vanity URLs cannot be set via the API
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
 * Convert a shared link settings object from the USM into the format that the API expects.
 *
 * @param {SharedLinkSettingsOptions} newSettings
 * @param {accessLevel} string
 * @param {serverURL} string
 * @returns {$Shape<SharedLink>}
 */
export const convertSharedLinkSettings = (
    newSettings: SharedLinkSettingsOptions,
    accessLevel: string,
    serverURL: string,
): $Shape<SharedLink> => {
    const {
        expirationTimestamp,
        isDownloadEnabled: can_download,
        isExpirationEnabled,
        isPasswordEnabled,
        password,
        vanityName,
    } = newSettings;
    const convertedSettings: $Shape<SharedLink> = {
        unshared_at: expirationTimestamp && isExpirationEnabled ? new Date(expirationTimestamp).toISOString() : null,
        vanity_url: serverURL && vanityName ? `${serverURL}${vanityName}` : '',
        // Download permissions can only be set on "company" or "open" shared links.
        // A Flow limitation prevents the usage of an && statement in an object spread: https://github.com/facebook/flow/issues/5946
        ...(accessLevel !== PEOPLE_IN_ITEM ? { permissions: { can_download, can_preview: !can_download } } : {}),
    };

    /**
     * This block covers the following cases:
     * - Setting a new password: "isPasswordEnabled" is true, and "password" is a non-empty string.
     * - Removing a password: "isPasswordEnabled" is false, and "password" is an empty string.
     *   The API only accepts non-empty strings and null values, so the empty string must be converted to null.
     *
     * Other notes:
     * - Passwords can only be set on "open" shared links.
     * - Attempting to set the password field on any other type of shared link will throw a 400 error.
     * - When other settings are updated, and a password has already been set, the SharedLinkSettingsModal
     *   returns password = '' and isPasswordEnabled = true. In these cases, the password should *not*
     *   be converted to null, because that would remove the existing password.
     */
    if (accessLevel === ANYONE_WITH_LINK) {
        if (isPasswordEnabled && !!password) {
            convertedSettings.password = password;
        } else if (!isPasswordEnabled) {
            convertedSettings.password = null;
        }
    }

    return convertedSettings;
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
    const { entries = [] } = collabsAPIData;

    if (!entries.length) return { collaborators: [] };

    const ownerEmailDomain = ownerEmail && /@/.test(ownerEmail) ? ownerEmail.split('@')[1] : null;

    const collaborators = entries
        // Only show accepted collaborations
        .filter(collab => collab.status === STATUS_ACCEPTED)
        .map(collab => {
            const {
                accessible_by: { id: userID, login: email, name, type },
                id: collabID,
                expires_at: executeAt,
                role,
            } = collab;
            const convertedCollab: collaboratorType = {
                collabID: parseInt(collabID, 10),
                email,
                hasCustomAvatar: false, // to do: connect to Avatar API
                imageURL: null, // to do: connect to Avatar API
                isExternalCollab: checkIsExternalUser(isCurrentUserOwner, ownerEmailDomain, email),
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
 * Convert a request from the USM (specifically the Invite Collaborators Modal) into the format expected by the Collaborations API.
 * ContentSharing/USM will only call this function when at least one properly-formatted email is entered into the "Invite People" field.
 * Within the context of this feature, groups are identified by IDs, whereas users are identified by their emails.
 *
 * @param {InviteCollaboratorsRequest} collabRequest
 * @returns {ContentSharingCollaborationsRequest}
 */
export const convertCollabsRequest = (
    collabRequest: InviteCollaboratorsRequest,
): ContentSharingCollaborationsRequest => {
    const { emails, groupIDs, permission } = collabRequest;
    const emailArray = emails ? emails.split(',') : [];
    const groupIDArray = groupIDs ? groupIDs.split(',') : [];

    const roleSettings = {
        role: permission.toLowerCase(), // USM permissions are identical to API roles, except for the casing
    };

    const groups = groupIDArray.map(groupID => ({
        accessible_by: {
            id: groupID,
            type: COLLAB_GROUP_TYPE,
        },
        ...roleSettings,
    }));

    const users = emailArray.map(email => ({
        accessible_by: {
            login: email,
            type: COLLAB_USER_TYPE,
        },
        ...roleSettings,
    }));

    return { groups, users };
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
