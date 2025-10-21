import * as React from 'react';

import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import { convertItemResponse, convertCollab, convertCollabsRequest } from '../utils';
import { createSharingService } from '../sharingService';
import useInvites from './useInvites';

export const useSharingService = ({
    api,
    avatarURLMap,
    collaborators,
    currentUserId,
    item,
    itemId,
    itemType,
    sharedLink,
    sharingServiceProps,
    setCollaborators,
    setItem,
    setSharedLink,
}) => {
    // itemApiInstance should only be called once or the API will cause an issue where it gets cancelled
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
            permissions: {
                can_set_share_access: sharingServiceProps.can_set_share_access,
                can_share: sharingServiceProps.can_share,
            },
            serverURL: sharingServiceProps.serverURL,
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

    // Create the sendInvitations callbacks using the existing memoized useInvites hook
    const handleSuccess = response => {
        const { id: ownerId, login: ownerEmail } = response.created_by;
        const ownerEmailDomain = ownerEmail && /@/.test(ownerEmail) ? ownerEmail.split('@')[1] : null;
        setCollaborators(prevList => {
            const newCollab = convertCollab({
                collab: response,
                currentUserId,
                isCurrentUserOwner: currentUserId === ownerId,
                ownerEmailDomain,
                avatarURLMap,
            });

            return newCollab ? [...prevList, newCollab] : prevList;
        });
    };

    const sendInvitations = useInvites(api, itemId, itemType, {
        collaborators,
        handleSuccess,
        transformRequest: data => convertCollabsRequest(data, collaborators),
    });

    return { sharingService: { ...sharingService, sendInvitations } };
};
