/**
 * @flow
 * @file ContentSharing Element
 * @author Box
 */
import React, { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import type { $AxiosError } from 'axios';
import API from '../../api';
import Internationalize from '../common/Internationalize';
import ErrorMask from '../../components/error-mask/ErrorMask';
import UnifiedShareModal from '../../features/unified-share-modal';
import messages from '../../features/unified-share-modal/messages';
import { convertItemResponse, convertUserResponse } from '../../features/unified-share-modal/utils/convertData';
import {
    CLIENT_NAME_CONTENT_SHARING,
    FIELD_ALLOWED_INVITEE_ROLES,
    FIELD_ENTERPRISE,
    FIELD_HOSTNAME,
    FIELD_ID,
    FIELD_NAME,
    FIELD_TYPE as FIELD_ITEM_TYPE,
    FIELD_SHARED_LINK,
    FIELD_SHARED_LINK_FEATURES,
    TYPE_FILE,
    TYPE_FOLDER,
    FIELD_PERMISSIONS,
    FIELD_EXTENSION,
    FIELD_DESCRIPTION,
} from '../../constants';
import { contentSharingMessages, CONTENT_SHARING_ERRORS } from './messages';
import type { ErrorResponseData } from '../../common/types/api';
import type { ItemType } from '../../common/types/core';
import type { item as itemFlowType } from '../../features/unified-share-modal/flowTypes';
import type { ContentSharingItemAPIResponse, ContentSharingSharedLinkType } from './types';

type ContentSharingProps = {
    apiHost: string,
    itemID: string,
    itemType: ItemType,
    language: string,
    showFormOnly?: boolean,
    token: string,
};

function ContentSharing(props: ContentSharingProps) {
    const { apiHost, itemID, itemType, language, token } = props;
    const [item, setItem] = useState<?itemFlowType>(null);
    const [sharedLink, setSharedLink] = useState<?ContentSharingSharedLinkType>(null);
    const [currentUserID, setCurrentUserID] = useState<?string>(null);
    const [errorMessage, setErrorMessage] = useState<?Object>(null);

    const api = new API({
        apiHost,
        clientName: CLIENT_NAME_CONTENT_SHARING,
        id: `${itemType}_${itemID}`,
        token,
    });

    const getError = useCallback(
        (error: $AxiosError<any> | ErrorResponseData) => {
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

    useEffect(() => {
        setItem(null);
        setSharedLink(null);
        setCurrentUserID(null);
    }, [token, itemID, itemType]);

    useEffect(() => {
        const getItemSuccess = (itemData: ContentSharingItemAPIResponse) => {
            const { item: itemFromAPI, sharedLink: sharedLinkFromAPI } = convertItemResponse(itemData);
            setItem(itemFromAPI);
            setSharedLink(sharedLinkFromAPI);
            setErrorMessage(null);
        };

        const getItem = () => {
            const fields = {
                fields: [
                    FIELD_ALLOWED_INVITEE_ROLES,
                    FIELD_DESCRIPTION,
                    FIELD_EXTENSION,
                    FIELD_ID,
                    FIELD_NAME,
                    FIELD_PERMISSIONS,
                    FIELD_SHARED_LINK,
                    FIELD_SHARED_LINK_FEATURES,
                    FIELD_ITEM_TYPE,
                ],
            };
            if (itemType === TYPE_FILE) {
                api.getFileAPI().getFile(itemID, getItemSuccess, getError, fields);
            } else if (itemType === TYPE_FOLDER) {
                api.getFolderAPI().getFolderFields(itemID, getItemSuccess, getError, fields);
            }
        };

        if (!item && !sharedLink) {
            getItem();
        }
    }, [api, getError, item, itemID, itemType, sharedLink, currentUserID]);

    useEffect(() => {
        const getUserSuccess = userData => {
            const { id, userEnterpriseData } = convertUserResponse(userData);
            setSharedLink({ ...sharedLink, ...userEnterpriseData });
            setCurrentUserID(id);
            setErrorMessage(null);
        };

        const getUserData = () => {
            api.getUsersAPI(false).getUser(itemID, getUserSuccess, getError, {
                fields: [FIELD_ENTERPRISE, FIELD_HOSTNAME],
            });
        };
        if (item && sharedLink && !currentUserID) {
            getUserData();
        }
    }, [api, getError, item, itemID, itemType, sharedLink, currentUserID]);

    const renderElement = () => {
        if (errorMessage) {
            return <ErrorMask errorHeader={<FormattedMessage {...errorMessage} />} />;
        }

        if (item && sharedLink) {
            return (
                <Internationalize language={language} messages={messages}>
                    <UnifiedShareModal
                        canInvite={sharedLink.canInvite}
                        changeSharedLinkPermissionLevel={() => Promise.resolve([])} // to do: replace with a POST to the Shared Link API
                        collaboratorsList={{ collaborators: [] }} // to do: replace with Collaborators API
                        currentUserID={currentUserID}
                        displayInModal={false}
                        getCollaboratorContacts={() => Promise.resolve([])} // to do: replace with Collaborators API
                        getSharedLinkContacts={() => Promise.resolve([])} // to do: replace with Collaborators API
                        initialDataReceived
                        item={item}
                        onAddLink={() => Promise.resolve([])} // to do: replace with a POST to the Shared Link API
                        sharedLink={sharedLink}
                    />
                </Internationalize>
            );
        }

        return null;
    };

    return renderElement();
}

export default ContentSharing;
