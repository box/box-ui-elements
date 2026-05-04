import { ACCESS_COLLAB, INVITEE_ROLE_EDITOR, PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_EDIT } from '../../../constants';

import { getAllowedAccessLevels } from './getAllowedAccessLevels';
import { getAllowedPermissionLevels } from './getAllowedPermissionLevels';

import { API_TO_USM_CLASSIFICATION_COLORS_MAP, API_TO_USM_COLLAB_ROLE_MAP, SORTED_INVITEE_ROLES } from '../constants';

import type { ContentSharingItemAPIResponse, ItemData } from '../types';

export const convertItemResponse = (itemApiData: ContentSharingItemAPIResponse): ItemData => {
    const {
        allowed_invitee_roles,
        allowed_shared_link_access_levels,
        allowed_shared_link_access_levels_disabled_reasons,
        classification,
        id,
        name,
        owned_by: ownedBy,
        permissions,
        shared_link,
        shared_link_features,
        shared_link_permission_options,
        type,
    } = itemApiData;

    const {
        download_url: isDirectLinkAvailable,
        password: isPasswordAvailable,
        vanity_name: isVanityNameAvailable,
    } = shared_link_features;

    const {
        can_download: isDownloadSettingAvailable,
        can_invite_collaborator: canInvite,
        can_set_share_access: canChangeAccessLevel,
        can_share: canShare,
    } = permissions;

    // Convert classification data for the item if available
    let classificationData;
    if (classification) {
        const { color, definition, name: classificationName } = classification;
        classificationData = {
            colorId: API_TO_USM_CLASSIFICATION_COLORS_MAP[color],
            definition,
            name: classificationName,
        };
    }

    const isEditAllowed = allowed_invitee_roles.includes(INVITEE_ROLE_EDITOR);

    let sharedLink;
    if (shared_link) {
        const {
            access,
            download_url: downloadUrl,
            effective_permission: permission,
            is_password_enabled: isPasswordEnabled,
            unshared_at: expirationTimestamp,
            url,
            vanity_name: vanityName,
            vanity_url: vanityUrl,
        } = shared_link;

        const isDownloadAllowed = permission === PERMISSION_CAN_DOWNLOAD || permission === PERMISSION_CAN_EDIT;
        const canChangeDownload = canChangeAccessLevel && isDownloadSettingAvailable && access !== ACCESS_COLLAB; // access must be "company" or "open"
        const canChangePassword = canChangeAccessLevel && isPasswordAvailable;
        const canChangeExpiration = canChangeAccessLevel && isEditAllowed;

        sharedLink = {
            access,
            accessLevels: getAllowedAccessLevels(
                allowed_shared_link_access_levels,
                allowed_shared_link_access_levels_disabled_reasons,
            ),
            downloadUrl,
            expiresAt: expirationTimestamp ? new Date(expirationTimestamp).getTime() : undefined, // convert to milliseconds
            permission,
            permissionLevels:
                shared_link_permission_options ??
                getAllowedPermissionLevels(canChangeAccessLevel, isDownloadSettingAvailable, permission),
            settings: {
                canChangeDownload,
                canChangeExpiration,
                canChangePassword,
                canChangeVanityName: false,
                isDirectLinkAvailable,
                isDownloadAvailable: isDownloadSettingAvailable,
                isDownloadEnabled: isDownloadAllowed,
                isPasswordAvailable,
                isPasswordEnabled,
                isVanityNameAvailable,
            },
            url,
            vanityDomain: vanityUrl,
            vanityName: vanityName || '',
        };
    }

    const sortedAllowedRoles = SORTED_INVITEE_ROLES.filter(role => allowed_invitee_roles.includes(role));

    const collaborationRoles = sortedAllowedRoles.map(role => ({
        id: API_TO_USM_COLLAB_ROLE_MAP[role],
        isDefault: role === INVITEE_ROLE_EDITOR,
    }));

    return {
        collaborationRoles,
        item: {
            classification: classificationData,
            id,
            name,
            permissions: {
                canInviteCollaborator: !!canInvite,
                canSetShareAccess: canChangeAccessLevel,
                canShare: !!canShare,
            },
            type,
        },
        ownedBy,
        sharedLink,
        sharingService: {
            can_set_share_access: canChangeAccessLevel,
            can_share: canShare,
            ownerEmail: ownedBy.login,
            ownerId: ownedBy.id,
        },
    };
};
