// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import API from '../../api';
import Notification from '../../components/notification/Notification';
import NotificationsWrapper from '../../components/notification/NotificationsWrapper';
import {
    convertCollabsResponse,
    convertItemResponse,
    convertSharedLinkPermissions,
    USM_TO_API_ACCESS_LEVEL_MAP,
} from '../../features/unified-share-modal/utils/convertData';
import { ACCESS_COLLAB, ACCESS_NONE, STATUS_ERROR, TYPE_FILE, TYPE_FOLDER } from '../../constants';
import { CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS } from './constants';
import contentSharingMessages from './messages';
import type { RequestOptions } from '../../common/types/api';
import type { BoxItemPermission, Collaborations, ItemType, NotificationType } from '../../common/types/core';
import type { collaboratorsListType, item as itemFlowType } from '../../features/unified-share-modal/flowTypes';
import type { ContentSharingItemAPIResponse, ContentSharingSharedLinkType, SharedLinkUpdateFnType } from './types';

type SharingNotificationProps = {
    api: API,
    collaboratorsList: collaboratorsListType | null,
    currentUserID: string | null,
    itemID: string,
    itemType: ItemType,
    ownerEmail: ?string,
    ownerID: ?string,
    permissions: ?BoxItemPermission,
    setChangeSharedLinkAccessLevel: (changeSharedLinkAccessLevel: SharedLinkUpdateFnType) => void,
    setChangeSharedLinkPermissionLevel: (changeSharedLinkPermissionLevel: SharedLinkUpdateFnType) => void,
    setCollaboratorsList: (collaboratorsList: collaboratorsListType) => void,
    setGetContacts: () => void,
    setItem: ((item: itemFlowType | null) => itemFlowType) => void,
    setOnAddLink: (addLink: SharedLinkUpdateFnType) => void,
    setOnRemoveLink: (removeLink: SharedLinkUpdateFnType) => void,
    setSharedLink: ((sharedLink: ContentSharingSharedLinkType | null) => ContentSharingSharedLinkType) => void,
};

function SharingNotification({
    api,
    collaboratorsList,
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
    const [retrievedCollaborators, setRetrievedCollaborators] = React.useState<boolean>(false); // add an internal check for testing purposes
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
                return itemAPIInstance.share(itemData, accessType, successFn, handleUpdateItemError, options);
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
                    handleUpdateItemError,
                    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                );
            };
            setChangeSharedLinkPermissionLevel(updatedChangeSharedLinkPermissionLevelFn);
        }
    }, [
        api,
        createNotification,
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

    /**
     * Get the item's collaborators
     *
     * A note on the wording: the USM uses the term "collaborators" internally,
     * so the state variable and state setting function also refer to "collaborators."
     * However, we are using the Collaborations API here, so the API-related functions
     * use the term "collaborations." For more details, see ./api/FileCollaborations.
     */
    React.useEffect(() => {
        const handleGetCollaborationsSuccess = (response: Collaborations) => {
            const updatedCollaboratorsList = convertCollabsResponse(response, ownerEmail, ownerID === currentUserID);
            setCollaboratorsList(updatedCollaboratorsList);
            setRetrievedCollaborators(true);
        };

        const handleGetCollaborationsError = () => {
            const updatedNotifications = { ...notifications };
            if (updatedNotifications[notificationID]) {
                return;
            }
            updatedNotifications[notificationID] = createNotification(
                STATUS_ERROR,
                contentSharingMessages.collaboratorsLoadingError,
            );
            setCollaboratorsList({ collaborators: [] }); // default to an empty collaborators list for the USM
            setNotifications(updatedNotifications);
            setNotificationID(notificationID + 1);
            setRetrievedCollaborators(true);
        };

        if (itemID && currentUserID && !retrievedCollaborators) {
            let collabAPIInstance;
            if (itemType === TYPE_FILE) {
                collabAPIInstance = api.getFileCollaborationsAPI(false);
            } else if (itemType === TYPE_FOLDER) {
                collabAPIInstance = api.getFolderCollaborationsAPI(false);
            }
            if (collabAPIInstance) {
                collabAPIInstance.getCollaborations(
                    itemID,
                    handleGetCollaborationsSuccess,
                    handleGetCollaborationsError,
                );
            }
        }
    }, [
        api,
        collaboratorsList,
        createNotification,
        currentUserID,
        itemID,
        itemType,
        notificationID,
        notifications,
        ownerEmail,
        ownerID,
        retrievedCollaborators,
        setCollaboratorsList,
    ]);

    // Set the getContacts function, which is used for inviting collaborators in the USM
    React.useEffect(() => {
        const handleGetContactsSuccess = response => {
            setGetContactsExists(true);
            return response.entries;
        };

        // Handle failed PUT requests to /files or /folders
        const handleGetContactsError = () => {
            const updatedNotifications = { ...notifications };
            updatedNotifications[notificationID] = createNotification(
                STATUS_ERROR,
                contentSharingMessages.getContactsError,
            );
            setNotifications(updatedNotifications);
            setNotificationID(notificationID + 1);
        };

        if (!getContactsExists) {
            const updatedGetContactsFn = () => (filterTerm: string) =>
                api
                    .getUsersAPI(false)
                    .getUsersInEnterprise(itemID, handleGetContactsSuccess, handleGetContactsError, filterTerm);
            setGetContacts(updatedGetContactsFn);
        }
    }, [api, createNotification, getContactsExists, itemID, notificationID, notifications, setGetContacts]);

    return (
        <NotificationsWrapper>
            <>{[...Object.values(notifications)]}</>
        </NotificationsWrapper>
    );
}

export default SharingNotification;
