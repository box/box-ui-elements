import type { API } from '../../api';
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
    serverURL?: string;
}

export interface CreateSharingServiceProps {
    itemApiInstance: API;
    onSuccess: (itemData: ItemData) => void;
    options: Options;
}

export const createSharingService = ({ itemApiInstance, onSuccess, options }: CreateSharingServiceProps) => {
    const { id, permissions } = options;

    const changeSharedLinkPermission = async (permissionLevel: string) => {
        return itemApiInstance.updateSharedLink(
            { id, permissions },
            { permissions: convertSharedLinkPermissions(permissionLevel) },
            onSuccess,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    const updateSharedLink = async (sharedLinkSettings: SharedLinkSettings) => {
        const { access, isDownloadAvailable, serverURL } = options;

        return itemApiInstance.updateSharedLink(
            { id, permissions },
            convertSharedLinkSettings(sharedLinkSettings, access, isDownloadAvailable, serverURL),
            onSuccess,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    return {
        changeSharedLinkPermission,
        updateSharedLink,
    };
};
