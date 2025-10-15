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
    serverURL?: string;
}

export interface CreateSharingServiceProps {
    itemApiInstance: API;
    onSuccess: {
        handleUpdateSharedLinkSuccess: (itemData: ItemData) => void;
        handleRemoveSharedLinkSuccess: (itemData: ItemData) => void;
    };
    options: Options;
}

export const createSharingService = ({ itemApiInstance, onSuccess, options }: CreateSharingServiceProps) => {
    const { id, permissions } = options;
    const { handleUpdateSharedLinkSuccess, handleRemoveSharedLinkSuccess } = onSuccess;

    const changeSharedLinkAccess = async (access: string) => {
        return itemApiInstance.share(
            { id, permissions },
            access,
            handleUpdateSharedLinkSuccess,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    const changeSharedLinkPermission = async (permissionLevel: string) => {
        return itemApiInstance.updateSharedLink(
            { id, permissions },
            { permissions: convertSharedLinkPermissions(permissionLevel) },
            handleUpdateSharedLinkSuccess,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    const updateSharedLink = async (sharedLinkSettings: SharedLinkSettings) => {
        const { access, isDownloadAvailable, serverURL } = options;

        return itemApiInstance.updateSharedLink(
            { id, permissions },
            convertSharedLinkSettings(sharedLinkSettings, access, isDownloadAvailable, serverURL),
            handleUpdateSharedLinkSuccess,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    const createSharedLink = async () => {
        return itemApiInstance.share(
            { id, permissions },
            undefined,
            handleUpdateSharedLinkSuccess,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    const deleteSharedLink = async () => {
        return itemApiInstance.share(
            { id, permissions },
            ACCESS_NONE,
            handleRemoveSharedLinkSuccess,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    return {
        deleteSharedLink,
        changeSharedLinkAccess,
        changeSharedLinkPermission,
        createSharedLink,
        updateSharedLink,
    };
};
