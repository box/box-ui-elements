/**
 * @flow
 * @file SharingModal
 * @description This is the second-level component for the ContentSharing Element. It receives an API instance
 * from its parent component, ContentSharing, and then instantiates the UnifiedShareModal with API data.
 * @author Box
 */
import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import type { $AxiosError } from 'axios';
import API from '../../api';
import Internationalize from '../common/Internationalize';
import ErrorMask from '../../components/error-mask/ErrorMask';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import UnifiedShareModal from '../../features/unified-share-modal';
import SharedLinkSettingsModal from '../../features/shared-link-settings-modal';
import SharingNotification from './SharingNotification';
import { convertItemResponse, convertUserResponse } from '../../features/unified-share-modal/utils/convertData';
import { FIELD_ENTERPRISE, FIELD_HOSTNAME, TYPE_FILE, TYPE_FOLDER } from '../../constants';
import { CONTENT_SHARING_ERRORS, CONTENT_SHARING_ITEM_FIELDS, CONTENT_SHARING_VIEWS } from './constants';
import { INVITEE_PERMISSIONS } from '../../features/unified-share-modal/constants';
import contentSharingMessages from './messages';
import type { ErrorResponseData } from '../../common/types/api';
import type { ItemType, StringMap } from '../../common/types/core';
import type {
    collaboratorsListType,
    item as itemFlowType,
    USMConfig,
} from '../../features/unified-share-modal/flowTypes';
import type {
    ContentSharingItemAPIResponse,
    ContentSharingSharedLinkType,
    GetContactsFnType,
    SendInvitesFnType,
    SharedLinkUpdateLevelFnType,
    SharedLinkUpdateSettingsFnType,
} from './types';

type SharingModalProps = {
    api: API,
    config?: USMConfig,
    displayInModal: boolean,
    itemID: string,
    itemType: ItemType,
    language: string,
    messages?: StringMap,
};

function SharingModal({ api, config, displayInModal, itemID, itemType, language, messages }: SharingModalProps) {
    const [item, setItem] = React.useState<itemFlowType | null>(null);
    const [sharedLink, setSharedLink] = React.useState<ContentSharingSharedLinkType | null>(null);
    const [currentUserID, setCurrentUserID] = React.useState<string | null>(null);
    const [componentErrorMessage, setComponentErrorMessage] = React.useState<Object | null>(null);
    const [collaboratorsList, setCollaboratorsList] = React.useState<collaboratorsListType | null>(null);
    const [onAddLink, setOnAddLink] = React.useState<null | SharedLinkUpdateLevelFnType>(null);
    const [onRemoveLink, setOnRemoveLink] = React.useState<null | SharedLinkUpdateLevelFnType>(null);
    const [
        changeSharedLinkAccessLevel,
        setChangeSharedLinkAccessLevel,
    ] = React.useState<null | SharedLinkUpdateLevelFnType>(null);
    const [
        changeSharedLinkPermissionLevel,
        setChangeSharedLinkPermissionLevel,
    ] = React.useState<null | SharedLinkUpdateLevelFnType>(null);
    const [onSubmitSettings, setOnSubmitSettings] = React.useState<null | SharedLinkUpdateSettingsFnType>(null);
    const [currentView, setCurrentView] = React.useState<string>(CONTENT_SHARING_VIEWS.UNIFIED_SHARE_MODAL);
    const [getContacts, setGetContacts] = React.useState<null | GetContactsFnType>(null);
    const [sendInvites, setSendInvites] = React.useState<null | SendInvitesFnType>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isOpen, setIsOpen] = React.useState<boolean>(true);

    // Handle successful GET requests to /files or /folders
    const handleGetItemSuccess = React.useCallback((itemData: ContentSharingItemAPIResponse) => {
        const { item: itemFromAPI, sharedLink: sharedLinkFromAPI } = convertItemResponse(itemData);
        setComponentErrorMessage(null);
        setItem(itemFromAPI);
        setSharedLink(sharedLinkFromAPI);
        setIsLoading(false);
    }, []);

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

    // Reset state if the API has changed
    React.useEffect(() => {
        setChangeSharedLinkAccessLevel(null);
        setChangeSharedLinkPermissionLevel(null);
        setCollaboratorsList(null);
        setCurrentUserID(null);
        setItem(null);
        setOnAddLink(null);
        setOnRemoveLink(null);
        setSharedLink(null);
        setIsLoading(true);
    }, []);

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
    }, [api, getError, handleGetItemSuccess, item, itemID, itemType, sharedLink]);

    // Get initial data for the user
    React.useEffect(() => {
        const getUserSuccess = userData => {
            const { id, userEnterpriseData } = convertUserResponse(userData);
            setCurrentUserID(id);
            setSharedLink(prevSharedLink => ({ ...prevSharedLink, ...userEnterpriseData }));
            setComponentErrorMessage(null);
            setIsLoading(false);
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
    }, [getError, item, itemID, itemType, sharedLink, currentUserID, api]);

    if (componentErrorMessage) {
        return <ErrorMask errorHeader={<FormattedMessage {...componentErrorMessage} />} />;
    }

    // Ensure that all necessary data has been received before rendering child components
    // "serverURL" is added to sharedLink after the call to the Users API
    if (!item || !sharedLink || !currentUserID || !sharedLink.serverURL) {
        return <LoadingIndicator />;
    }

    const { ownerEmail, ownerID, permissions } = item;
    const { accessLevel = '', serverURL } = sharedLink;
    return (
        <Internationalize language={language} messages={messages}>
            <div className="be">
                <SharingNotification
                    accessLevel={accessLevel}
                    api={api}
                    closeComponent={displayInModal ? () => setIsOpen(false) : noop}
                    closeSettings={() => setCurrentView(CONTENT_SHARING_VIEWS.UNIFIED_SHARE_MODAL)}
                    collaboratorsList={collaboratorsList}
                    currentUserID={currentUserID}
                    getContacts={getContacts}
                    itemID={itemID}
                    itemType={itemType}
                    onSubmitSettings={onSubmitSettings}
                    ownerEmail={ownerEmail}
                    ownerID={ownerID}
                    permissions={permissions}
                    sendInvites={sendInvites}
                    serverURL={serverURL}
                    setChangeSharedLinkAccessLevel={setChangeSharedLinkAccessLevel}
                    setChangeSharedLinkPermissionLevel={setChangeSharedLinkPermissionLevel}
                    setGetContacts={setGetContacts}
                    setCollaboratorsList={setCollaboratorsList}
                    setIsLoading={setIsLoading}
                    setItem={setItem}
                    setOnAddLink={setOnAddLink}
                    setOnRemoveLink={setOnRemoveLink}
                    setOnSubmitSettings={setOnSubmitSettings}
                    setSendInvites={setSendInvites}
                    setSharedLink={setSharedLink}
                />
                {isOpen && currentView === CONTENT_SHARING_VIEWS.SHARED_LINK_SETTINGS && (
                    <SharedLinkSettingsModal
                        isDirectLinkUnavailableDueToDownloadSettings={false}
                        isDirectLinkUnavailableDueToAccessPolicy={false}
                        isDirectLinkUnavailableDueToMaliciousContent={false}
                        isOpen
                        item={item}
                        onRequestClose={() => setCurrentView(CONTENT_SHARING_VIEWS.UNIFIED_SHARE_MODAL)}
                        onSubmit={onSubmitSettings}
                        submitting={isLoading}
                        {...sharedLink}
                    />
                )}
                {isOpen && currentView === CONTENT_SHARING_VIEWS.UNIFIED_SHARE_MODAL && (
                    <UnifiedShareModal
                        canInvite={sharedLink.canInvite}
                        config={config}
                        changeSharedLinkAccessLevel={changeSharedLinkAccessLevel}
                        changeSharedLinkPermissionLevel={changeSharedLinkPermissionLevel}
                        collaboratorsList={collaboratorsList}
                        currentUserID={currentUserID}
                        displayInModal={displayInModal}
                        getCollaboratorContacts={getContacts}
                        initialDataReceived
                        inviteePermissions={INVITEE_PERMISSIONS}
                        isOpen
                        item={item}
                        onAddLink={onAddLink}
                        onRequestClose={displayInModal ? () => setIsOpen(false) : noop}
                        onRemoveLink={onRemoveLink}
                        onSettingsClick={() => setCurrentView(CONTENT_SHARING_VIEWS.SHARED_LINK_SETTINGS)}
                        sendInvites={sendInvites}
                        sharedLink={sharedLink}
                        submitting={isLoading}
                    />
                )}
            </div>
        </Internationalize>
    );
}

export default SharingModal;
