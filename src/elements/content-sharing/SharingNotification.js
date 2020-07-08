// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import API from '../../api';
import Notification from '../../components/notification/Notification';
import NotificationsWrapper from '../../components/notification/NotificationsWrapper';
import { convertItemResponse, USM_TO_API_ACCESS_LEVEL_MAP } from '../../features/unified-share-modal/utils/convertData';
import { ACCESS_COLLAB, ACCESS_NONE, STATUS_ERROR, TYPE_FILE, TYPE_FOLDER } from '../../constants';
import { CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS } from './constants';
import contentSharingMessages from './messages';
import type { RequestOptions } from '../../common/types/api';
import type { BoxItemPermission, ItemType, NotificationType } from '../../common/types/core';
import type { item as itemFlowType } from '../../features/unified-share-modal/flowTypes';
import type { ContentSharingItemAPIResponse, ContentSharingSharedLinkType, SharedLinkUpdateFnType } from './types';

type SharingNotificationProps = {
    api: API,
    itemID: string,
    itemPermissions: BoxItemPermission | null,
    itemType: ItemType,
    setChangeSharedLinkAccessLevel: (changeSharedLinkAccessLevel: SharedLinkUpdateFnType) => void,
    setItem: ((item: itemFlowType | null) => itemFlowType) => void,
    setOnAddLink: (addLink: SharedLinkUpdateFnType) => void,
    setOnRemoveLink: (removeLink: SharedLinkUpdateFnType) => void,
    setSharedLink: ((sharedLink: ContentSharingSharedLinkType | null) => ContentSharingSharedLinkType) => void,
};

function SharingNotification({
    api,
    itemID,
    itemPermissions,
    itemType,
    setChangeSharedLinkAccessLevel,
    setItem,
    setOnAddLink,
    setOnRemoveLink,
    setSharedLink,
}: SharingNotificationProps) {
    const [notifications, setNotifications] = React.useState<{ [string]: typeof Notification }>({});
    const [notificationID, setNotificationID] = React.useState<number>(0);

    // Close a notification
    const handleNotificationClose = React.useCallback(
        (id: number) => {
            const updatedNotifications = { ...notifications };
            delete updatedNotifications[id];
            setNotifications(updatedNotifications);
        },
        [notifications],
    );

    // Create a notification
    const createNotification = React.useCallback(
        (notificationType: NotificationType, message: MessageDescriptor) => {
            return (
                <Notification
                    duration="short"
                    key={notificationID}
                    onClose={() => handleNotificationClose(notificationID)}
                    type={notificationType}
                >
                    <span>
                        <FormattedMessage {...message} />
                    </span>
                </Notification>
            );
        },
        [handleNotificationClose, notificationID],
    );

    // Generate the onAddLink function for the item
    React.useEffect(() => {
        // Handle successful PUT requests to /files or /folders
        const handleUpdateItemSuccess = (itemData: ContentSharingItemAPIResponse) => {
            const { item: updatedItem, sharedLink: updatedSharedLink } = convertItemResponse(itemData);
            setItem((prevItem: itemFlowType | null) => ({ ...prevItem, ...updatedItem }));
            setSharedLink((prevSharedLink: ContentSharingSharedLinkType | null) => ({
                ...prevSharedLink,
                ...updatedSharedLink,
            }));
        };

        const handleRemoveSharedLinkSuccess = (itemData: ContentSharingItemAPIResponse) => {
            const { item: updatedItem, sharedLink: updatedSharedLink } = convertItemResponse(itemData);
            setItem((prevItem: itemFlowType | null) => ({ ...prevItem, ...updatedItem }));
            setSharedLink(() => updatedSharedLink);
        };

        // Handle failed PUT requests to /files or /folders
        const handleUpdateItemError = () => {
            const updatedNotifications = { ...notifications };
            updatedNotifications[notificationID] = createNotification(
                STATUS_ERROR,
                contentSharingMessages.sharedLinkUpdateError,
            );
            setNotifications(updatedNotifications);
            setNotificationID(notificationID + 1);
        };

        if (itemPermissions) {
            const dataForAPI = {
                id: itemID,
                permissions: itemPermissions,
            };

            let itemAPIInstance;
            if (itemType === TYPE_FILE) {
                itemAPIInstance = api.getFileAPI();
            } else if (itemType === TYPE_FOLDER) {
                itemAPIInstance = api.getFolderAPI();
            }

            const createSharedLinkAPIConnection = (
                accessType: string,
                options?: RequestOptions = CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                successFn?: (itemData: ContentSharingItemAPIResponse) => void = handleUpdateItemSuccess,
            ) => {
                return itemAPIInstance.share(dataForAPI, accessType, successFn, handleUpdateItemError, options);
            };

            const updatedOnAddLinkFn: SharedLinkUpdateFnType = () => () => createSharedLinkAPIConnection(ACCESS_COLLAB);
            setOnAddLink(updatedOnAddLinkFn);

            const updatedOnRemoveLinkFn: SharedLinkUpdateFnType = () => () =>
                createSharedLinkAPIConnection(ACCESS_NONE, undefined, handleRemoveSharedLinkSuccess);
            setOnRemoveLink(updatedOnRemoveLinkFn);

            const updatedChangeSharedLinkAccessLevelFn: SharedLinkUpdateFnType = () => (newAccessLevel: string) =>
                createSharedLinkAPIConnection(USM_TO_API_ACCESS_LEVEL_MAP[newAccessLevel]);
            setChangeSharedLinkAccessLevel(updatedChangeSharedLinkAccessLevelFn);
        }
    }, [
        api,
        createNotification,
        itemID,
        itemPermissions,
        itemType,
        notificationID,
        notifications,
        setChangeSharedLinkAccessLevel,
        setItem,
        setOnAddLink,
        setOnRemoveLink,
        setSharedLink,
    ]);

    return (
        <NotificationsWrapper>
            <>{[...Object.values(notifications)]}</>
        </NotificationsWrapper>
    );
}

export default SharingNotification;
