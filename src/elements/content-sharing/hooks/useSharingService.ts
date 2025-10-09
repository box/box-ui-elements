import * as React from 'react';

import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import { convertItemResponse } from '../utils/convertItemResponse';
import { createSharingService } from '../sharingService';

export const useSharingService = (api, item, itemId, itemType, setItem, setSharedLink) => {
    const itemApiInstance = React.useMemo(() => {
        if (!item) {
            return null;
        }

        if (itemType === TYPE_FILE) {
            return api.getFileAPI();
        }

        if (itemType === TYPE_FOLDER) {
            return api.getFolderAPI();
        }

        return null;
    }, [api, item, itemType]);

    const sharingService = React.useMemo(() => {
        if (!itemApiInstance) {
            return null;
        }

        const itemData = {
            id: itemId,
            permissions: item.permissions,
        };

        const handleSuccess = updatedItemData => {
            const { item: updatedItem, sharedLink: updatedSharedLink } = convertItemResponse(updatedItemData);
            setItem(prevItem => ({ ...prevItem, ...updatedItem }));
            setSharedLink(prevSharedLink => ({ ...prevSharedLink, ...updatedSharedLink }));
        };

        return createSharingService({ itemApiInstance, itemData, onSuccess: handleSuccess });
    }, [itemApiInstance, item, itemId, setItem, setSharedLink]);

    return { sharingService };
};
