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
import type { ErrorResponseData } from '../../common/types/api';
import type { BoxItemPermission, ItemType } from '../../common/types/core';
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
    const [currentUser, setCurrentUser] = React.useState<string | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<Object | null>(null);
    const [itemPermissions, setItemPermissions] = React.useState<BoxItemPermission | null>(null);
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
        setErrorMessage(null);
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

            setErrorMessage(errorObject);
        },
        [setErrorMessage],
    );

    // Reset state if necessary
    React.useEffect(() => {
        setCurrentUser(null);
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
    }, [api, getError, item, itemID, itemType, sharedLink, currentUser]);

    // Get initial data for the user
    React.useEffect(() => {
        const getUserSuccess = userData => {
            setCurrentUser(convertUserResponse(userData));
            setErrorMessage(null);
        };

        const getUserData = () => {
            api.getUsersAPI(false).getUser(itemID, getUserSuccess, getError, {
                params: {
                    fields: [FIELD_ENTERPRISE, FIELD_HOSTNAME].toString(),
                },
            });
        };

        if (item && sharedLink && !currentUser) {
            getUserData();
        }
    }, [api, getError, item, itemID, itemType, sharedLink, currentUser]);

    // Generate the onAddLink and onRemoveLink functions for the item
    React.useEffect(() => {
        // Success handler for PUT requests to /files or /folders
        const handleUpdateItemSuccess = (itemData: ContentSharingItemAPIResponse) => {
            const { item: updatedItem, sharedLink: updatedSharedLink } = convertItemResponse(itemData);
            setErrorMessage(null);
            setItem({ ...item, ...updatedItem });
            setSharedLink({ ...sharedLink, ...updatedSharedLink });
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

            setOnAddLink(() => () => {
                itemAPIInstance.share(
                    dataForAPI,
                    ACCESS_COLLAB,
                    handleUpdateItemSuccess,
                    getError,
                    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                );
            });
            setOnRemoveLink(() => () => {
                itemAPIInstance.share(
                    dataForAPI,
                    ACCESS_NONE,
                    handleUpdateItemSuccess,
                    getError,
                    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                );
            });
            setChangeSharedLinkAccessLevel(() => newAccessLevel => {
                itemAPIInstance.share(
                    dataForAPI,
                    USM_TO_API_ACCESS_LEVEL_MAP[newAccessLevel],
                    handleUpdateItemSuccess,
                    getError,
                    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                );
            });
            setChangeSharedLinkPermissionLevel(() => newSharedLinkPermissionLevel => {
                const updatedSharedLinkPermissions = {};
                Object.keys(USM_TO_API_PERMISSION_LEVEL_MAP).forEach(level => {
                    if (level === newSharedLinkPermissionLevel) {
                        updatedSharedLinkPermissions[USM_TO_API_PERMISSION_LEVEL_MAP[level]] = true;
                    } else {
                        updatedSharedLinkPermissions[USM_TO_API_PERMISSION_LEVEL_MAP[level]] = false;
                    }
                });
                itemAPIInstance.share(
                    dataForAPI,
                    null,
                    handleUpdateItemSuccess,
                    getError,
                    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                    {
                        permissions: updatedSharedLinkPermissions,
                    },
                );
            });
        }
    }, [api, getError, item, itemID, itemPermissions, itemType, onAddLink, sharedLink]);

    if (errorMessage) {
        return <ErrorMask errorHeader={<FormattedMessage {...errorMessage} />} />;
    }

    if (item && sharedLink && currentUser) {
        const { id: currentUserID, userEnterpriseData } = currentUser;
        const sharedLinkWithEnterpriseData = { ...userEnterpriseData, ...sharedLink };
        return (
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
                    sharedLink={sharedLinkWithEnterpriseData}
                />
            </Internationalize>
        );
    }
    return null;
}

export default ContentSharing;
