import { ACCESS_COLLAB, INVITEE_ROLE_EDITOR, PERMISSION_CAN_DOWNLOAD } from '../../../constants';
import { API_TO_USM_CLASSIFICATION_COLORS_MAP } from '../constants';
import { getAllowedAccessLevels } from './getAllowedAccessLevels';
import { getAllowedPermissionLevels } from './getAllowedPermissionLevels';

import type { ContentSharingItemAPIResponse, ItemData } from '../types';

export const convertItemResponse = (itemAPIData: ContentSharingItemAPIResponse): ItemData => {
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
        type,
    } = itemAPIData;

    const { password: isPasswordAvailable } = shared_link_features;

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

    const isEditAllowed = allowed_invitee_roles.indexOf(INVITEE_ROLE_EDITOR) !== -1;

    let sharedLink;
    if (shared_link) {
        const {
            access,
            effective_permission: permission,
            is_password_enabled: isPasswordEnabled,
            unshared_at: expirationTimestamp,
            url,
            vanity_name: vanityName,
            vanity_url: vanityUrl,
        } = shared_link;

        const isDownloadAllowed = permission === PERMISSION_CAN_DOWNLOAD;
        const canChangeDownload = canChangeAccessLevel && isDownloadSettingAvailable && access !== ACCESS_COLLAB; // access must be "company" or "open"
        const canChangePassword = canChangeAccessLevel && isPasswordAvailable;
        const canChangeExpiration = canChangeAccessLevel && isEditAllowed;

        sharedLink = {
            access,
            accessLevels: getAllowedAccessLevels(
                allowed_shared_link_access_levels,
                allowed_shared_link_access_levels_disabled_reasons,
            ),
            expiresAt: expirationTimestamp,
            permission,
            permissionLevels: getAllowedPermissionLevels(canChangeAccessLevel, isDownloadSettingAvailable, permission),
            settings: {
                canChangeDownload,
                canChangeExpiration,
                canChangePassword,
                canChangeVanityName: false, // vanity URLs cannot be set via the API,
                isDownloadAvailable: isDownloadSettingAvailable,
                isDownloadEnabled: isDownloadAllowed,
                isPasswordAvailable: isPasswordAvailable ?? false,
                isPasswordEnabled,
            },
            url,
            vanityDomain: vanityUrl,
            vanityName: vanityName || '',
        };
    }

    const collaborationRoles = allowed_invitee_roles.map(role => ({ id: role }));

    return {
        collaborationRoles,
        item: {
            id,
            classification: classificationData,
            name,
            permissions: {
                canInviteCollaborator: !!canInvite,
                canSetShareAccess: canChangeAccessLevel,
                canShare: !!canShare,
            },
            type,
        },
        sharedLink,
        sharingService: {
            can_set_share_access: canChangeAccessLevel,
            can_share: canShare,
        },
        ownedBy,
    };
};
