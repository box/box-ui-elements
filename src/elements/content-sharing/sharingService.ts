import { PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_PREVIEW } from '../../constants';
import { CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS } from './constants';

export const convertSharedLinkPermissions = (permissionLevel: string) => {
    if (!permissionLevel) {
        return null;
    }

    return {
        [PERMISSION_CAN_DOWNLOAD]: permissionLevel === PERMISSION_CAN_DOWNLOAD,
        [PERMISSION_CAN_PREVIEW]: permissionLevel === PERMISSION_CAN_PREVIEW,
    };
};

export const createSharingService = ({ itemApiInstance, itemData, onSuccess }) => {
    const changeSharedLinkPermission = async (permissionLevel: string) => {
        return itemApiInstance.updateSharedLink(
            itemData,
            { permissions: convertSharedLinkPermissions(permissionLevel) },
            onSuccess,
            {},
            CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
        );
    };

    return {
        changeSharedLinkPermission,
    };
};
