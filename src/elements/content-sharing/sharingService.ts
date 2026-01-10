import type { API } from '../../api';
import { ACCESS_NONE } from '../../constants';
import { CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS } from './constants';
import { convertSharedLinkPermissions, convertSharedLinkSettings } from './utils';

import type { SharedLinkSettings } from './types';

export interface ItemData {
    id: string;
    permissions: {
        can_set_share_access: boolean;
        can_share: boolean;
    };
}

export interface Options extends ItemData {
    access?: string;
    isDownloadAvailable?: boolean;
    serverUrl?: string;
}

export interface CreateSharingServiceArgs {
    itemApiInstance: API;
    onUpdateSharedLink: (itemData: ItemData) => void;
    onRemoveSharedLink: (itemData: ItemData) => void;
    options: Options;
}

export const createSharingService = ({
    itemApiInstance,
    onUpdateSharedLink,
    onRemoveSharedLink,
    options,
}: CreateSharingServiceArgs) => {
    const { id, permissions } = options;

    const changeSharedLinkAccess = async (access: string): Promise<void> => {
        return itemApiInstance.share(
            { id, permissions },
            access,
            onUpdateSharedLink,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    const changeSharedLinkPermission = async (permissionLevel: string): Promise<void> => {
        return itemApiInstance.updateSharedLink(
            { id, permissions },
            { permissions: convertSharedLinkPermissions(permissionLevel) },
            onUpdateSharedLink,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    const updateSharedLink = async (sharedLinkSettings: SharedLinkSettings) => {
        const { access, isDownloadAvailable, serverUrl } = options;

        return new Promise((resolve, reject) => {
            itemApiInstance.updateSharedLink(
                { id, permissions },
                convertSharedLinkSettings(sharedLinkSettings, access, isDownloadAvailable, serverUrl),
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
    };
};
