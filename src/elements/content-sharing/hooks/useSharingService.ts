import * as React from 'react';
import { useIntl } from 'react-intl';

import type { SharingService } from '@box/unified-share-modal';

import { convertItemResponse, convertCollab, convertCollabsRequest } from '../utils';
import { createSharingService } from '../sharingService';
import useInvites from './useInvites';

import { TYPE_FILE, TYPE_FOLDER } from '../../../constants';

import messages from '../messages';

export const useSharingService = ({
    api,
    avatarUrlMap,
    collaborators,
    currentUserId,
    item,
    itemId,
    itemType,
    onSendSharedLink,
    sharedLink,
    sharingServiceProps,
    setCollaborators,
    setItem,
    setSharedLink,
}): SharingService => {
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

    const sharedLinkService = React.useMemo(() => {
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
    const handleSuccess = React.useCallback(
        response => {
            const { id: ownerId, login: ownerEmail } = response.created_by;
            const ownerEmailDomain = ownerEmail && /@/.test(ownerEmail) ? ownerEmail.split('@')[1] : null;

            setCollaborators(prevCollabs => {
                const nextCollab = convertCollab({
                    avatarUrlMap,
                    collab: response,
                    currentUserId,
                    isCurrentUserOwner: currentUserId === ownerId,
                    ownerEmailDomain,
                });

                return nextCollab ? [...prevCollabs, nextCollab] : prevCollabs;
            });
        },
        [avatarUrlMap, currentUserId, setCollaborators],
    );

    const handleSendInvitations = useInvites(api, itemId, itemType, {
        collaborators,
        handleSuccess,
        isContentSharingV2Enabled: true,
        transformRequest: data => convertCollabsRequest(data, collaborators),
    });

    const sendInvitations = React.useCallback(
        async data => {
            if (!handleSendInvitations) {
                return null;
            }

            const response = await handleSendInvitations(data);

            const { contacts } = data;

            if (!response || !contacts?.length) {
                return null;
            }

            const successCount = response.length;
            const errorCount = contacts.length - successCount;

            const notifications = [];

            if (successCount) {
                notifications.push({
                    text: formatMessage(messages.sendInvitationsSuccess, { count: successCount }),
                    type: 'success',
                });
            }

            if (errorCount) {
                notifications.push({
                    text: formatMessage(messages.sendInvitationsError, { count: errorCount }),
                    type: 'error',
                });
            }

            return notifications.length ? { messages: notifications } : null;
        },
        [formatMessage, handleSendInvitations],
    );

    const sharingService = React.useMemo(() => {
        return {
            sendInvitations,
            sendSharedLink: onSendSharedLink,
            ...sharedLinkService,
        };
    }, [onSendSharedLink, sendInvitations, sharedLinkService]);

    return sharingService;
};
