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
import SharingNotification from './SharingNotification';
import usmMessages from '../../features/unified-share-modal/messages';
import { convertItemResponse, convertUserResponse } from '../../features/unified-share-modal/utils/convertData';
import { CLIENT_NAME_CONTENT_SHARING, FIELD_ENTERPRISE, FIELD_HOSTNAME, TYPE_FILE, TYPE_FOLDER } from '../../constants';
import { CONTENT_SHARING_ERRORS, CONTENT_SHARING_ITEM_FIELDS } from './constants';
import contentSharingMessages from './messages';
import type { ErrorResponseData } from '../../common/types/api';
import type { BoxItemPermission, ItemType } from '../../common/types/core';
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
    const [onAddLink, setOnAddLink] = React.useState<null | SharedLinkUpdateFnType>(null);
    const [onRemoveLink, setOnRemoveLink] = React.useState<null | SharedLinkUpdateFnType>(null);

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

    if (componentErrorMessage) {
        return <ErrorMask errorHeader={<FormattedMessage {...componentErrorMessage} />} />;
    }

    if (item && sharedLink) {
        return (
            <Internationalize language={language} messages={usmMessages}>
                <>
                    <SharingNotification
                        api={api}
                        itemID={itemID}
                        itemPermissions={itemPermissions}
                        itemType={itemType}
                        setItem={setItem}
                        setOnAddLink={setOnAddLink}
                        setOnRemoveLink={setOnRemoveLink}
                        setSharedLink={setSharedLink}
                    />
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
                        onRemoveLink={onRemoveLink}
                        sharedLink={sharedLink}
                    />
                </>
            </Internationalize>
        );
    }
    return null;
}

export default ContentSharing;
