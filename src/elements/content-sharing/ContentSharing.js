/**
 * @flow
 * @file ContentSharing Element
 * @author Box
 */
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { $AxiosError } from 'axios';
import API from '../../api';
import Internationalize from '../common/Internationalize';
import ErrorMask from '../../components/error-mask/ErrorMask';
import Notification from '../../components/notification/Notification';
import NotificationsWrapper from '../../components/notification/NotificationsWrapper';
import UnifiedShareModal from '../../features/unified-share-modal';
import usmMessages from '../../features/unified-share-modal/messages';
import { convertItemResponse, convertUserResponse } from '../../features/unified-share-modal/utils/convertData';
import {
    ACCESS_COLLAB,
    CLIENT_NAME_CONTENT_SHARING,
    FIELD_ENTERPRISE,
    FIELD_HOSTNAME,
    STATUS_ERROR,
    TYPE_FILE,
    TYPE_FOLDER,
} from '../../constants';
import {
    CONTENT_SHARING_ERRORS,
    CONTENT_SHARING_ITEM_FIELDS,
    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
} from './constants';
import contentSharingMessages from './messages';
import type { ErrorResponseData } from '../../common/types/api';
import type { BoxItemPermission, ItemType, NotificationType, StringMap } from '../../common/types/core';
import type { item as itemFlowType } from '../../features/unified-share-modal/flowTypes';
import type { ContentSharingItemAPIResponse, ContentSharingSharedLinkType, SharedLinkUpdateFnType } from './types';

type ContentSharingProps = {
    apiHost: string,
    displayInModal?: boolean,
    itemID: string,
    itemType: ItemType,
    language: string,
    token: string,
};

const createAPI = (apiHost, itemID, itemType, token) =>
    new API({
        apiHost,
        clientName: CLIENT_NAME_CONTENT_SHARING,
        id: `${itemType}_${itemID}`,
        token,
    });

function ContentSharing({ apiHost, displayInModal, itemID, itemType, language, token }: ContentSharingProps) {
    const [api, setAPI] = React.useState<API>(createAPI(apiHost, itemID, itemType, token));
    const [item, setItem] = React.useState<itemFlowType | null>(null);
    const [sharedLink, setSharedLink] = React.useState<ContentSharingSharedLinkType | null>(null);
    const [currentUserID, setCurrentUserID] = React.useState<string | null>(null);
    const [itemPermissions, setItemPermissions] = React.useState<BoxItemPermission | null>(null);
    const [componentErrorMessage, setComponentErrorMessage] = React.useState<Object | null>(null);
    const [notifications, setNotifications] = React.useState<{ [string]: typeof Notification }>({});
    const [notificationID, setNotificationID] = React.useState<number>(0);
    const [onAddLink, setOnAddLink] = React.useState<null | SharedLinkUpdateFnType>(null);

    // Reset the API if necessary
    React.useEffect(() => {
        setAPI(createAPI(apiHost, itemID, itemType, token));
    }, [apiHost, itemID, itemType, token]);

    // Handle successful GET requests to /files or /folders
    const handleGetItemSuccess = (itemData: ContentSharingItemAPIResponse) => {
        const { item: itemFromAPI, originalItemPermissions, sharedLink: sharedLinkFromAPI } = convertItemResponse(
            itemData,
        );
        setComponentErrorMessage(null);
        setItem(itemFromAPI);
        setItemPermissions(originalItemPermissions);
        setSharedLink(sharedLinkFromAPI);
    };

    // Handle component-level errors
    const getError = React.useCallback(
        (error: $AxiosError<Object> | ErrorResponseData) => {
            let errorObject;
            if (error.status) {
                errorObject = contentSharingMessages[CONTENT_SHARING_ERRORS[error.status]];
            } else if (error.response && error.response.status) {
                errorObject = contentSharingMessages[CONTENT_SHARING_ERRORS[error.response.status]];
            } else {
                errorObject = contentSharingMessages.loadingError;
            }

            setComponentErrorMessage(errorObject);
        },
        [setComponentErrorMessage],
    );

    // Reset state if necessary
    React.useEffect(() => {
        setCurrentUserID(null);
        setItem(null);
        setOnAddLink(null);
        setItemPermissions(null);
        setSharedLink(null);
    }, [api, setOnAddLink]);

    // Get initial data for the item
    React.useEffect(() => {
        const getItem = () => {
            if (itemType === TYPE_FILE) {
                api.getFileAPI().getFile(itemID, handleGetItemSuccess, getError, {
                    fields: CONTENT_SHARING_ITEM_FIELDS,
                });
            } else if (itemType === TYPE_FOLDER) {
                api.getFolderAPI().getFolderFields(itemID, handleGetItemSuccess, getError, {
                    fields: CONTENT_SHARING_ITEM_FIELDS,
                });
            }
        };

        if (!item && !sharedLink) {
            getItem();
        }
    }, [api, getError, item, itemID, itemType, sharedLink]);

    // Get initial data for the user
    React.useEffect(() => {
        const getUserSuccess = userData => {
            const { id, userEnterpriseData } = convertUserResponse(userData);
            setCurrentUserID(id);
            setSharedLink(prevSharedLink => ({ ...prevSharedLink, ...userEnterpriseData }));
            setComponentErrorMessage(null);
        };

        const getUserData = () => {
            api.getUsersAPI(false).getUser(itemID, getUserSuccess, getError, {
                params: {
                    fields: [FIELD_ENTERPRISE, FIELD_HOSTNAME].toString(),
                },
            });
        };

        if (item && sharedLink && !currentUserID) {
            getUserData();
        }
    }, [api, getError, item, itemID, itemType, sharedLink, currentUserID]);

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
        (notificationType: NotificationType, message: StringMap) => {
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
            setItem(prevItem => ({ ...prevItem, ...updatedItem }));
            setSharedLink(prevSharedLink => ({ ...prevSharedLink, ...updatedSharedLink }));
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

        if (item && itemPermissions && !onAddLink) {
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

            const updatedOnAddLink: SharedLinkUpdateFnType = () => () =>
                itemAPIInstance.share(
                    dataForAPI,
                    ACCESS_COLLAB,
                    handleUpdateItemSuccess,
                    handleUpdateItemError,
                    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                );
            setOnAddLink(updatedOnAddLink);
        }
    }, [
        api,
        createNotification,
        item,
        itemID,
        itemPermissions,
        itemType,
        notificationID,
        notifications,
        onAddLink,
        setOnAddLink,
        sharedLink,
    ]);

    if (componentErrorMessage) {
        return <ErrorMask errorHeader={<FormattedMessage {...componentErrorMessage} />} />;
    }

    if (item && sharedLink) {
        return (
            <>
                <NotificationsWrapper>
                    <>{[...Object.values(notifications)]}</>
                </NotificationsWrapper>
                <Internationalize language={language} messages={usmMessages}>
                    <UnifiedShareModal
                        canInvite={sharedLink.canInvite}
                        changeSharedLinkAccessLevel={() => Promise.resolve([])} // to do: replace with a PUT to the Shared Link API
                        changeSharedLinkPermissionLevel={() => Promise.resolve([])} // to do: replace with a PUT to the Shared Link API
                        collaboratorsList={{ collaborators: [] }} // to do: replace with Collaborators API
                        currentUserID={currentUserID}
                        displayInModal={displayInModal}
                        getCollaboratorContacts={() => Promise.resolve([])} // to do: replace with Collaborators API
                        getSharedLinkContacts={() => Promise.resolve([])} // to do: replace with Collaborators API
                        initialDataReceived
                        item={item}
                        onAddLink={onAddLink}
                        onRemoveLink={() => Promise.resolve([])} // to do: replace with a PUT to the Shared Link API
                        sharedLink={sharedLink}
                    />
                </Internationalize>
            </>
        );
    }
    return null;
}

export default ContentSharing;
