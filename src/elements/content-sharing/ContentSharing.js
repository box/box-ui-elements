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
    ACCESS_NONE,
    CLIENT_NAME_CONTENT_SHARING,
    FIELD_ENTERPRISE,
    FIELD_HOSTNAME,
    TYPE_FILE,
    TYPE_FOLDER,
} from '../../constants';
import {
    CONTENT_SHARING_ERRORS,
    CONTENT_SHARING_ITEM_FIELDS,
    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
} from './constants';
import {
    USM_TO_API_ACCESS_LEVEL_MAP,
    USM_TO_API_PERMISSION_LEVEL_MAP,
} from '../../features/unified-share-modal/constants';
import contentSharingMessages from './messages';
import type { ErrorResponseData, FetchOptions } from '../../common/types/api';
import type { Access, BoxItemPermission, ItemType } from '../../common/types/core';
import type { item as itemFlowType } from '../../features/unified-share-modal/flowTypes';
import type { ContentSharingItemAPIResponse, ContentSharingSharedLinkType } from './types';

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
    const [notifications, setNotifications] = React.useState<Record<string, Notification>>({});
    const [notificationID, setNotificationID] = React.useState<number>(0);
    const [onAddLink, setOnAddLink] = React.useState<() => () => void | null>(null);
    const [onRemoveLink, setOnRemoveLink] = React.useState<() => () => void | null>(null);
    const [changeSharedLinkAccessLevel, setChangeSharedLinkAccessLevel] = React.useState<() => () => void | null>(null);
    const [changeSharedLinkPermissionLevel, setChangeSharedLinkPermissionLevel] = React.useState<
        () => () => void | null,
    >(null);

    // Reset the API if necessary
    React.useEffect(() => {
        setAPI(createAPI(apiHost, itemID, itemType, token));
    }, [apiHost, itemID, itemType, token]);

    // Success handler for GET requests to /files or /folders
    const handleGetItemSuccess = (itemData: ContentSharingItemAPIResponse) => {
        const { item: itemFromAPI, originalItemPermissions, sharedLink: sharedLinkFromAPI } = convertItemResponse(
            itemData,
        );
        setComponentErrorMessage(null);
        setItem(itemFromAPI);
        setItemPermissions(originalItemPermissions);
        setSharedLink(sharedLinkFromAPI);
    };

    // Error handler for failed requests
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
    }, [api]);

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
        (notificationType: string, message: Record<string, string>) => {
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

    // Generate the onAddLink and onRemoveLink functions for the item
    React.useEffect(() => {
        // Success handler for PUT requests to /files or /folders
        const handleUpdateItemSuccess = (itemData: ContentSharingItemAPIResponse) => {
            const { item: updatedItem, sharedLink: updatedSharedLink } = convertItemResponse(itemData);
            setItem(prevItem => ({ ...prevItem, ...updatedItem }));
            setSharedLink(prevSharedLink => ({ ...prevSharedLink, ...updatedSharedLink }));
        };

        const handleUpdateItemError = () => {
            const updatedNotifications = { ...notifications };
            updatedNotifications[notificationID] = createNotification(
                'error',
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

            const createSharedLinkAPIConnection = (
                accessType: ?Access,
                options?: FetchOptions = CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                sharedLinkRequestBody?: { permissions: BoxItemPermission },
            ) => {
                return itemAPIInstance.share(
                    dataForAPI,
                    accessType,
                    handleUpdateItemSuccess,
                    handleUpdateItemError,
                    options,
                    sharedLinkRequestBody,
                );
            };

            setOnAddLink(() => () => createSharedLinkAPIConnection(ACCESS_COLLAB));
            setOnRemoveLink(() => () => createSharedLinkAPIConnection(ACCESS_NONE));
            setChangeSharedLinkAccessLevel(() => newAccessLevel =>
                createSharedLinkAPIConnection(USM_TO_API_ACCESS_LEVEL_MAP[newAccessLevel]),
            );
            setChangeSharedLinkPermissionLevel(() => newSharedLinkPermissionLevel => {
                const updatedSharedLinkPermissions = {};
                Object.keys(USM_TO_API_PERMISSION_LEVEL_MAP).forEach(level => {
                    if (level === newSharedLinkPermissionLevel) {
                        updatedSharedLinkPermissions[USM_TO_API_PERMISSION_LEVEL_MAP[level]] = true;
                    } else {
                        updatedSharedLinkPermissions[USM_TO_API_PERMISSION_LEVEL_MAP[level]] = false;
                    }
                });
                createSharedLinkAPIConnection(null, CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS, {
                    permissions: updatedSharedLinkPermissions,
                });
            });
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
        sharedLink,
    ]);

    if (componentErrorMessage) {
        return <ErrorMask errorHeader={<FormattedMessage {...componentErrorMessage} />} />;
    }

    if (item && sharedLink) {
        return (
            <>
                <NotificationsWrapper>{[...Object.values(notifications)]}</NotificationsWrapper>
                <Internationalize language={language} messages={usmMessages}>
                    <UnifiedShareModal
                        canInvite={sharedLink.canInvite}
                        changeSharedLinkAccessLevel={changeSharedLinkAccessLevel}
                        changeSharedLinkPermissionLevel={changeSharedLinkPermissionLevel}
                        collaboratorsList={{ collaborators: [] }} // to do: replace with Collaborators API
                        currentUserID={currentUserID}
                        displayInModal={displayInModal}
                        getCollaboratorContacts={() => Promise.resolve([])} // to do: replace with Collaborators API
                        getSharedLinkContacts={() => Promise.resolve([])} // to do: replace with Collaborators API
                        initialDataReceived
                        item={item}
                        onAddLink={onAddLink}
                        onRemoveLink={onRemoveLink}
                        sharedLink={sharedLink}
                    />
                </Internationalize>
            </>
        );
    }
    return null;
}

export default ContentSharing;
