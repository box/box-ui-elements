// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import API from '../../api';
import Notification from '../../components/notification/Notification';
import NotificationsWrapper from '../../components/notification/NotificationsWrapper';
import {
    convertCollabsResponse,
    convertContactsResponse,
    convertItemResponse,
    convertSharedLinkPermissions,
    USM_TO_API_ACCESS_LEVEL_MAP,
} from '../../features/unified-share-modal/utils/convertData';
import useCollaborators from './hooks/useCollaborators';
import useContacts from './hooks/useContacts';
import { ACCESS_COLLAB, ACCESS_NONE, STATUS_ERROR, TYPE_FILE, TYPE_FOLDER } from '../../constants';
import { CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS } from './constants';
import contentSharingMessages from './messages';
import type { RequestOptions } from '../../common/types/api';
import type { BoxItemPermission, Collaborations, ItemType, NotificationType } from '../../common/types/core';
import type { collaboratorsListType, item as itemFlowType } from '../../features/unified-share-modal/flowTypes';
import type {
    ContentSharingItemAPIResponse,
    ContentSharingSharedLinkType,
    GetContactsFnType,
    SharedLinkUpdateFnType,
} from './types';

type SharingNotificationProps = {
    api: API,
    currentUserID: string | null,
    itemID: string,
    itemType: ItemType,
    ownerEmail: ?string,
    ownerID: ?string,
    permissions: ?BoxItemPermission,
    setChangeSharedLinkAccessLevel: (changeSharedLinkAccessLevel: SharedLinkUpdateFnType) => void,
    setChangeSharedLinkPermissionLevel: (changeSharedLinkPermissionLevel: SharedLinkUpdateFnType) => void,
    setCollaboratorsList: (collaboratorsList: collaboratorsListType | null) => void,
    setGetContacts: (getContacts: () => GetContactsFnType | null) => void,
    setItem: ((item: itemFlowType | null) => itemFlowType) => void,
    setOnAddLink: (addLink: SharedLinkUpdateFnType) => void,
    setOnRemoveLink: (removeLink: SharedLinkUpdateFnType) => void,
    setSharedLink: ((sharedLink: ContentSharingSharedLinkType | null) => ContentSharingSharedLinkType) => void,
};

function SharingNotification({
    api,
    currentUserID,
    itemID,
    itemType,
    ownerEmail,
    ownerID,
    permissions,
    setChangeSharedLinkAccessLevel,
    setChangeSharedLinkPermissionLevel,
    setGetContacts,
    setCollaboratorsList,
    setItem,
    setOnAddLink,
    setOnRemoveLink,
    setSharedLink,
}: SharingNotificationProps) {
    const [notifications, setNotifications] = React.useState<{ [string]: typeof Notification }>({});
    const [notificationID, setNotificationID] = React.useState<number>(0);
    const [collabsExist, setCollabsExist] = React.useState<boolean>(false);
    const [getContactsExists, setGetContactsExists] = React.useState<boolean>(false);

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

    // Create a notification with the provided error message
    const handleError = React.useCallback(
        (errorMessage: MessageDescriptor) => {
            const updatedNotifications = { ...notifications };
            if (updatedNotifications[notificationID]) {
                return;
            }
            updatedNotifications[notificationID] = createNotification(STATUS_ERROR, errorMessage);
            setNotifications(updatedNotifications);
            setNotificationID(notificationID + 1);
        },
        [createNotification, notificationID, notifications],
    );

    // Generate shared link CRUD functions for the item
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

        if (permissions) {
            const itemData = {
                id: itemID,
                permissions,
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
                return itemAPIInstance.share(
                    itemData,
                    accessType,
                    successFn,
                    () => handleError(contentSharingMessages.sharedLinkUpdateError),
                    options,
                );
            };

            const updatedOnAddLinkFn: SharedLinkUpdateFnType = () => () => createSharedLinkAPIConnection(ACCESS_COLLAB);
            setOnAddLink(updatedOnAddLinkFn);

            const updatedOnRemoveLinkFn: SharedLinkUpdateFnType = () => () =>
                createSharedLinkAPIConnection(ACCESS_NONE, undefined, handleRemoveSharedLinkSuccess);
            setOnRemoveLink(updatedOnRemoveLinkFn);

            const updatedChangeSharedLinkAccessLevelFn: SharedLinkUpdateFnType = () => (newAccessLevel: string) =>
                createSharedLinkAPIConnection(USM_TO_API_ACCESS_LEVEL_MAP[newAccessLevel]);
            setChangeSharedLinkAccessLevel(updatedChangeSharedLinkAccessLevelFn);

            const updatedChangeSharedLinkPermissionLevelFn: SharedLinkUpdateFnType = () => (
                newSharedLinkPermissionLevel: string,
            ) => {
                return itemAPIInstance.updateSharedLink(
                    itemData,
                    {
                        permissions: convertSharedLinkPermissions(newSharedLinkPermissionLevel),
                    },
                    handleUpdateItemSuccess,
                    () => handleError(contentSharingMessages.sharedLinkUpdateError),
                    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                );
            };
            setChangeSharedLinkPermissionLevel(updatedChangeSharedLinkPermissionLevelFn);
        }
    }, [
        api,
        createNotification,
        handleError,
        itemID,
        itemType,
        notificationID,
        notifications,
        permissions,
        setChangeSharedLinkAccessLevel,
        setChangeSharedLinkPermissionLevel,
        setItem,
        setOnAddLink,
        setOnRemoveLink,
        setSharedLink,
    ]);

    // Set the collaborators list
    const collaboratorsListFromAPI: Collaborations | null = useCollaborators(api, itemID, itemType, undefined, () =>
        handleError(contentSharingMessages.collaboratorsLoadingError),
    );
    if (collaboratorsListFromAPI && !collabsExist) {
        const collaboratorsList = convertCollabsResponse(
            collaboratorsListFromAPI,
            ownerEmail,
            currentUserID === ownerID,
        );
        setCollaboratorsList(collaboratorsList);
        setCollabsExist(true);
    }

    // Set the getContacts function
    const getContactsFn: GetContactsFnType | null = useContacts(
        api,
        itemID,
        data => convertContactsResponse(data, currentUserID),
        () => handleError(contentSharingMessages.getContactsError),
    );
    if (getContactsFn && !getContactsExists) {
        setGetContacts(() => getContactsFn);
        setGetContactsExists(true);
    }

    return (
        <NotificationsWrapper>
            <>{[...Object.values(notifications)]}</>
        </NotificationsWrapper>
    );
}

export default SharingNotification;
