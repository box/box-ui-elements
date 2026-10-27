import type { LinkSettingsFormData, OtpAccessEntry, SharedLinkSettings } from '@box/unified-share-modal';

import type { API } from '../../api';
import { convertSharedLinkPermissions, convertSharedLinkSettings } from './utils';

import { ACCESS_NONE } from '../../constants';
import { CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS, OTP_MODE_ALLOWLIST } from './constants';

export interface ItemData {
    id: string;
    permissions: {
        can_set_share_access: boolean;
        can_share: boolean;
    };
}

export interface Options extends ItemData {
    access?: string;
    expiresAt?: number;
    serverUrl?: string;
    settings?: SharedLinkSettings;
}

export interface CreateSharingServiceArgs {
    hasSharedLink: boolean;
    itemApiInstance: API;
    onUpdateSharedLink: (itemData: ItemData) => void;
    onRemoveSharedLink: (itemData: ItemData) => void;
    options: Options;
}

export const createSharingService = ({
    hasSharedLink,
    itemApiInstance,
    onUpdateSharedLink,
    onRemoveSharedLink,
    options,
}: CreateSharingServiceArgs) => {
    const { id, permissions } = options;

    const changeSharedLinkAccess = async (access: string): Promise<void> => {
        if (!hasSharedLink) {
            return Promise.reject(Object.assign(new Error('Shared link not found'), { status: 404 }));
        }

        return itemApiInstance.share(
            { id, permissions },
            access,
            onUpdateSharedLink,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    const changeSharedLinkPermission = async (permissionLevel: string): Promise<void> => {
        if (!hasSharedLink) {
            return Promise.reject(Object.assign(new Error('Shared link not found'), { status: 404 }));
        }

        return itemApiInstance.updateSharedLink(
            { id, permissions },
            { permissions: convertSharedLinkPermissions(permissionLevel) },
            onUpdateSharedLink,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    const updateSharedLink = async (nextSettings: LinkSettingsFormData) => {
        if (!hasSharedLink) {
            return Promise.reject(Object.assign(new Error('Shared link not found'), { status: 404 }));
        }

        const { access, expiresAt, serverUrl, settings: prevSettings = {} } = options;

        return new Promise((resolve, reject) => {
            itemApiInstance.updateSharedLink(
                { id, permissions },
                convertSharedLinkSettings(nextSettings, prevSettings, access, expiresAt, serverUrl),
                data => {
                    onUpdateSharedLink(data);
                    resolve(data);
                },
                error => {
                    reject(error);
                },
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        });
    };

    const updateSharedLinkOtpAccess = async (entries: OtpAccessEntry[]) => {
        if (!hasSharedLink) {
            return Promise.reject(Object.assign(new Error('Shared link not found'), { status: 404 }));
        }

        return new Promise((resolve, reject) => {
            itemApiInstance.updateSharedLink(
                { id, permissions },
                {
                    one_time_passcode: {
                        allowlist: entries.map(({ type, value }) => ({ type, value })),
                        mode: OTP_MODE_ALLOWLIST,
                    },
                },
                data => {
                    onUpdateSharedLink(data);
                    resolve(data);
                },
                error => {
                    reject(error);
                },
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        });
    };

    const createSharedLink = async () => {
        return new Promise((resolve, reject) => {
            itemApiInstance.share(
                { id, permissions },
                undefined, // if "access" is undefined, the backend will set the default access level for the shared link
                data => {
                    onUpdateSharedLink(data);
                    resolve(data);
                },
                error => {
                    reject(error);
                },
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        });
    };

    const deleteSharedLink = async () => {
        if (!hasSharedLink) {
            return Promise.reject(Object.assign(new Error('Shared link not found'), { status: 404 }));
        }

        return new Promise((resolve, reject) => {
            itemApiInstance.share(
                { id, permissions },
                ACCESS_NONE,
                data => {
                    onRemoveSharedLink(data);
                    resolve(data);
                },
                error => {
                    reject(error);
                },
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        });
    };

    return {
        createSharedLink,
        changeSharedLinkAccess,
        changeSharedLinkPermission,
        deleteSharedLink,
        updateSharedLink,
        updateSharedLinkOtpAccess,
    };
};
