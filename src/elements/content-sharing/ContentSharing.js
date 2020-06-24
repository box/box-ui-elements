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
import { CLIENT_NAME_CONTENT_SHARING, FIELD_ENTERPRISE, FIELD_HOSTNAME, TYPE_FILE, TYPE_FOLDER } from '../../constants';
import { CONTENT_SHARING_ERRORS, CONTENT_SHARING_ITEM_FIELDS } from './constants';
import contentSharingMessages from './messages';
import type { ErrorResponseData } from '../../common/types/api';
import type { ItemType } from '../../common/types/core';
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

function ContentSharing(props: ContentSharingProps) {
    const { apiHost, displayInModal, itemID, itemType, language, token } = props;
    const [api, setAPI] = React.useState<API>(
        new API({
            apiHost,
            clientName: CLIENT_NAME_CONTENT_SHARING,
            id: `${itemType}_${itemID}`,
            token,
        }),
    );
    const [item, setItem] = React.useState<itemFlowType | null>(null);
    const [sharedLink, setSharedLink] = React.useState<ContentSharingSharedLinkType | null>(null);
    const [currentUserID, setCurrentUserID] = React.useState<string | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<Object | null>(null);

    React.useEffect(() => {
        setAPI(
            new API({
                apiHost,
                clientName: CLIENT_NAME_CONTENT_SHARING,
                id: `${itemType}_${itemID}`,
                token,
            }),
        );
    }, [apiHost, itemID, itemType, token]);

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

    React.useEffect(() => {
        setItem(null);
        setSharedLink(null);
        setCurrentUserID(null);
    }, [token, itemID, itemType]);

    React.useEffect(() => {
        const getItemSuccess = (itemData: ContentSharingItemAPIResponse) => {
            const { item: itemFromAPI, sharedLink: sharedLinkFromAPI } = convertItemResponse(itemData);
            setItem(itemFromAPI);
            setSharedLink(sharedLinkFromAPI);
            setErrorMessage(null);
        };

        const getItem = () => {
            if (itemType === TYPE_FILE) {
                api.getFileAPI().getFile(itemID, getItemSuccess, getError, CONTENT_SHARING_ITEM_FIELDS);
            } else if (itemType === TYPE_FOLDER) {
                api.getFolderAPI().getFolderFields(itemID, getItemSuccess, getError, CONTENT_SHARING_ITEM_FIELDS);
            }
        };

        if (!item && !sharedLink) {
            getItem();
        }
    }, [api, getError, item, itemID, itemType, sharedLink, currentUserID]);

    React.useEffect(() => {
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
                <Internationalize language={language} messages={usmMessages}>
                    <UnifiedShareModal
                        canInvite={sharedLink.canInvite}
                        changeSharedLinkPermissionLevel={() => Promise.resolve([])} // to do: replace with a POST to the Shared Link API
                        collaboratorsList={{ collaborators: [] }} // to do: replace with Collaborators API
                        currentUserID={currentUserID}
                        displayInModal={displayInModal}
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
