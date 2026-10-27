import { fromAbsolute, getLocalTimeZone, toCalendarDate } from '@box/blueprint-web';
import { type LinkSettingsFormData, type SharedLinkSettings } from '@box/unified-share-modal';

import {
    ACCESS_COLLAB,
    ACCESS_OPEN,
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_EDIT,
    PERMISSION_CAN_PREVIEW,
} from '../../../constants';
import { OTP_MODE_ALLOWLIST } from '../constants';

import type { OtpAccess } from '../../../common/types/core';

export interface ConvertSharedLinkSettingsReturnType {
    one_time_passcode?: OtpAccess;
    password?: string | null;
    permissions?: {
        can_download?: boolean;
        can_edit?: boolean;
        can_preview: boolean;
    };
    unshared_at?: string | null;
    vanity_url: string;
}

export const convertSharedLinkPermissions = (permissionLevel: string) => {
    if (!permissionLevel) {
        return {};
    }

    const isEdit = permissionLevel === PERMISSION_CAN_EDIT;

    return {
        [PERMISSION_CAN_DOWNLOAD]: isEdit || permissionLevel === PERMISSION_CAN_DOWNLOAD,
        [PERMISSION_CAN_EDIT]: isEdit,
        [PERMISSION_CAN_PREVIEW]: permissionLevel === PERMISSION_CAN_PREVIEW,
    };
};

export const convertSharedLinkSettings = (
    nextSettings: LinkSettingsFormData,
    prevSettings: SharedLinkSettings,
    accessLevel: string,
    expiresAt: number,
    serverUrl: string,
): ConvertSharedLinkSettingsReturnType => {
    const { expiration, isDownloadEnabled, isExpirationEnabled, isPasswordEnabled, otpMode, password, vanityName } =
        nextSettings;

    const convertedSettings: ConvertSharedLinkSettingsReturnType = {
        vanity_url: serverUrl && vanityName ? `${serverUrl}${vanityName}` : '',
    };

    if (prevSettings.canChangeExpiration) {
        const prevExpiration = toCalendarDate(fromAbsolute(expiresAt ?? 0, getLocalTimeZone()));

        if (!isExpirationEnabled || !expiration) {
            convertedSettings.unshared_at = null;
        } else if (expiration.compare(prevExpiration) !== 0) {
            convertedSettings.unshared_at = expiration.toDate(getLocalTimeZone()).toISOString();
        }
    }

    // Download permissions can only be set on "company" or "open" shared links.
    if (accessLevel !== ACCESS_COLLAB) {
        const permissions: ConvertSharedLinkSettingsReturnType['permissions'] = { can_preview: !isDownloadEnabled };
        if (prevSettings.isDownloadAvailable) {
            permissions.can_download = isDownloadEnabled;
        }

        convertedSettings.permissions = permissions;
    }

    /**
     * Setting a new password and updating the OTP settings are mutually exclusive. Certain fields must be
     * omitted from the payload to prevent the backend from resetting or validating properties.
     *
     * This block covers the following cases:
     *
     * - If a password is unchanged, the `password` and `one_time_passcode` fields must be omitted
     * - If a password is removed, the `password` field must be set to `null`
     * - If a password is updated, the `one_time_passcode` field must be omitted
     * - If the OTP mode is unchanged, the `one_time_passcode` field must be omitted
     * - If the OTP mode is updated, the `password` field must be omitted or set to `null`
     */
    if (accessLevel === ACCESS_OPEN) {
        if (!isPasswordEnabled) {
            convertedSettings.password = null;

            if (prevSettings.isOtpAvailable && prevSettings.otpMode !== otpMode) {
                convertedSettings.one_time_passcode = {
                    mode: otpMode,
                    ...(otpMode === OTP_MODE_ALLOWLIST ? { allowlist: [] } : null),
                };
            }
        } else if (password) {
            convertedSettings.password = password;
        }
    }

    return convertedSettings;
};
