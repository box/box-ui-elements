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

    const changeSharedLinkAccess = async (access: string) => {
        return itemApiInstance.share(
            { id, permissions },
            access,
            onUpdateSharedLink,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    const changeSharedLinkPermission = async (permissionLevel: string) => {
        return itemApiInstance.updateSharedLink(
            { id, permissions },
            { permissions: convertSharedLinkPermissions(permissionLevel) },
            onUpdateSharedLink,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    const updateSharedLink = async (sharedLinkSettings: SharedLinkSettings) => {
        const { access, isDownloadAvailable, serverURL } = options;

        return itemApiInstance.updateSharedLink(
            { id, permissions },
            convertSharedLinkSettings(sharedLinkSettings, access, isDownloadAvailable, serverURL),
            onUpdateSharedLink,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    const createSharedLink = async () => {
        return itemApiInstance.share(
            { id, permissions },
            options.access ?? undefined, // if "access" is undefined, the backend will set the default access level for the shared link
            onUpdateSharedLink,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    const deleteSharedLink = async () => {
        return itemApiInstance.share(
            { id, permissions },
            ACCESS_NONE,
            onRemoveSharedLink,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    return {
        createSharedLink,
        changeSharedLinkAccess,
        changeSharedLinkPermission,
        deleteSharedLink,
        updateSharedLink,
    };
};
