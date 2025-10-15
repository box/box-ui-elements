import * as React from 'react';

import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import { convertItemResponse } from '../utils/convertItemResponse';
import { createSharingService } from '../sharingService';

export const useSharingService = ({
    api,
    item,
    itemId,
    itemType,
    sharedLink,
    sharingServiceProps,
    setItem,
    setSharedLink,
}) => {
    const itemApiInstance = React.useMemo(() => {
        if (!item || !sharedLink) {
            return null;
        }

        if (itemType === TYPE_FILE) {
            return api.getFileAPI();
        }

        if (itemType === TYPE_FOLDER) {
            return api.getFolderAPI();
        }

        return null;
    }, [api, item, itemType, sharedLink]);

    const sharingService = React.useMemo(() => {
        if (!itemApiInstance) {
            return null;
        }

        const options = {
            id: itemId,
            access: sharedLink.access,
            permissions: sharingServiceProps,
            serverURL: sharedLink.serverURL,
            isDownloadAvailable: sharedLink.settings?.isDownloadAvailable ?? false,
        };

        const handleUpdateSharedLink = updatedItemData => {
            const { item: updatedItem, sharedLink: updatedSharedLink } = convertItemResponse(updatedItemData);
            setItem(prevItem => ({ ...prevItem, ...updatedItem }));
            setSharedLink(prevSharedLink => ({ ...prevSharedLink, ...updatedSharedLink }));
        };

        const handleRemoveSharedLink = itemData => {
            const { item: updatedItem } = convertItemResponse(itemData);
            setItem(prevItem => ({ ...prevItem, ...updatedItem }));
            setSharedLink({});
        };

        return createSharingService({
            itemApiInstance,
            onUpdateSharedLink: handleUpdateSharedLink,
            onRemoveSharedLink: handleRemoveSharedLink,
            options,
        });
    }, [itemApiInstance, itemId, sharedLink, sharingServiceProps, setItem, setSharedLink]);

    return { sharingService };
};
