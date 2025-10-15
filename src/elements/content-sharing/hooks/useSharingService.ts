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

        const handleUpdateSharedLinkSuccess = updatedItemData => {
            const { item: updatedItem, sharedLink: updatedSharedLink } = convertItemResponse(updatedItemData);
            setItem(prevItem => ({ ...prevItem, ...updatedItem }));
            setSharedLink(prevSharedLink => ({ ...prevSharedLink, ...updatedSharedLink }));
        };

        /**
         * Handle a successful shared link removal request.
         *
         * Most of the data for the shared link will be removed, with the exception of the "canInvite", "serverURL"
         * and "enterpriseName" properties, both of which are still necessary for rendering the form-only version of ContentSharing.
         * We retain "serverURL" and "enterpriseName" from the previous shared link, to avoid having to make another call to the Users API.
         */
        const handleRemoveSharedLinkSuccess = itemData => {
            const { item: updatedItem, sharedLink: updatedSharedLink } = convertItemResponse(itemData);
            setItem(prevItem => ({ ...prevItem, ...updatedItem }));
            setSharedLink(prevSharedLink => {
                return {
                    ...updatedSharedLink,
                    serverURL: prevSharedLink ? prevSharedLink.serverURL : '',
                    enterpriseName:
                        prevSharedLink && prevSharedLink.enterpriseName ? prevSharedLink.enterpriseName : '',
                };
            });
        };

        const onSuccess = {
            handleUpdateSharedLinkSuccess,
            handleRemoveSharedLinkSuccess,
        };

        return createSharingService({ itemApiInstance, onSuccess, options });
    }, [itemApiInstance, itemId, sharedLink, sharingServiceProps, setItem, setSharedLink]);

    return { sharingService };
};
