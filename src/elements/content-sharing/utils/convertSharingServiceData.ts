import { ACCESS_COLLAB, ACCESS_OPEN, PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_PREVIEW } from '../../../constants';
import { convertISOStringToUTCDate } from '../../../utils/datetime';

import type { SharedLinkSettings } from '../types';

export interface ConvertSharedLinkSettingsReturnType {
    password?: string | null;
    permissions?: {
        can_download?: boolean;
        can_preview: boolean;
    };
    unshared_at: string | null;
    vanity_url: string;
}

export const convertSharedLinkPermissions = (permissionLevel: string) => {
    if (!permissionLevel) {
        return {};
    }

    return {
        [PERMISSION_CAN_DOWNLOAD]: permissionLevel === PERMISSION_CAN_DOWNLOAD,
        [PERMISSION_CAN_PREVIEW]: permissionLevel === PERMISSION_CAN_PREVIEW,
    };
};

/**
 * Convert a shared link settings object from the USM into the format that the API expects.
 * This function compares the provided access level to both API and internal USM access level constants, to accommodate two potential flows:
 * - Changing the settings for a shared link right after the shared link has been created. The access level is saved directly from the data
 *   returned by the API, so it is in API format.
 * - Changing the settings for a shared link in any other scenario. The access level is saved from the initial calls to the Item API and
 *   convertItemResponse, so it is in internal USM format.
 */
export const convertSharedLinkSettings = (
    newSettings: SharedLinkSettings,
    accessLevel: string,
    isDownloadAvailable: boolean,
    serverUrl: string,
): ConvertSharedLinkSettingsReturnType => {
    const { expiration, isDownloadEnabled, isExpirationEnabled, isPasswordEnabled, password, vanityName } = newSettings;

    const convertedSettings: ConvertSharedLinkSettingsReturnType = {
        unshared_at:
            expiration && isExpirationEnabled
                ? convertISOStringToUTCDate(new Date(expiration).toISOString()).toISOString()
                : null,
        vanity_url: serverUrl && vanityName ? `${serverUrl}${vanityName}` : '',
    };

    // Download permissions can only be set on "company" or "open" shared links.
    if (accessLevel !== ACCESS_COLLAB) {
        const permissions: ConvertSharedLinkSettingsReturnType['permissions'] = { can_preview: !isDownloadEnabled };
        if (isDownloadAvailable) {
            permissions.can_download = isDownloadEnabled;
        }

        (convertedSettings as ConvertSharedLinkSettingsReturnType).permissions = permissions;
    }

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
    if (accessLevel === ACCESS_OPEN) {
        if (isPasswordEnabled && !!password) {
            convertedSettings.password = password;
        } else if (!isPasswordEnabled) {
            convertedSettings.password = null;
        }
    }

    return convertedSettings;
};
