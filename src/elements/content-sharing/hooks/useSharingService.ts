import * as React from 'react';
import { useIntl } from 'react-intl';

import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';
import { convertItemResponse, convertCollab, convertCollabsRequest } from '../utils';
import { createSharingService } from '../sharingService';
import useInvites from './useInvites';

import messages from '../messages';

export const useSharingService = ({
    api,
    avatarUrlMap,
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
    const { formatMessage } = useIntl();

    // itemApiInstance should only be called once or the API will cause an issue where it gets cancelled
    const itemApiInstance = React.useMemo(() => {
        if (!item) {
            return null;
        }

        if (itemType === TYPE_FILE) {
            return api.getFileAPI(false);
        }

        if (itemType === TYPE_FOLDER) {
            return api.getFolderAPI(false);
        }

        return null;
    }, [api, item, itemType]);

    const sharingService = React.useMemo(() => {
        if (!itemApiInstance) {
            return null;
        }

        const options = {
            id: itemId,
            access: sharedLink?.access,
            permissions: {
                can_set_share_access: sharingServiceProps?.can_set_share_access,
                can_share: sharingServiceProps?.can_share,
            },
            serverUrl: sharingServiceProps?.serverUrl,
            isDownloadAvailable: sharedLink?.settings?.isDownloadAvailable ?? false,
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
            hasSharedLink: !!sharedLink?.url,
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
                avatarUrlMap,
                collab: response,
                currentUserId,
                isCurrentUserOwner: currentUserId === ownerId,
                ownerEmailDomain,
            });

            return newCollab ? [...prevList, newCollab] : prevList;
        });
    };

    const handleSendInvitations = useInvites(api, itemId, itemType, {
        collaborators,
        handleSuccess,
        isContentSharingV2Enabled: true,
        transformRequest: data => convertCollabsRequest(data, collaborators),
    });

    const sendInvitations = (...request) => {
        return handleSendInvitations(...request).then(response => {
            const { contacts: collabRequest } = request[0];
            if (!response || !collabRequest || collabRequest.length === 0) {
                return null;
            }

            const successCount = response.length;
            const errorCount = collabRequest.length - successCount;

            const notification = [];
            if (errorCount > 0) {
                notification.push({
                    text: formatMessage(messages.sendInvitationsError, { count: errorCount }),
                    type: 'error',
                });
            }
            if (successCount > 0) {
                notification.push({
                    text: formatMessage(messages.sendInvitationsSuccess, { count: successCount }),
                    type: 'success',
                });
            }

            return notification.length > 0 ? { messages: notification } : null;
        });
    };

    return { sharingService: { ...sharingService, sendInvitations } };
};
