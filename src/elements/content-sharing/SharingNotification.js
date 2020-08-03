// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import API from '../../api';
import Notification, { TYPE_ERROR, TYPE_INFO } from '../../components/notification/Notification';
import NotificationsWrapper from '../../components/notification/NotificationsWrapper';
import useSharedLink from './hooks/useSharedLink';
import {
    convertCollabsRequest,
    convertCollabsResponse,
    convertContactsResponse,
    convertItemResponse,
    convertSharedLinkPermissions,
    convertSharedLinkSettings,
    USM_TO_API_ACCESS_LEVEL_MAP,
} from '../../features/unified-share-modal/utils/convertData';
import useCollaborators from './hooks/useCollaborators';
import useContacts from './hooks/useContacts';
import useInvites from './hooks/useInvites';
import contentSharingMessages from './messages';
import type { BoxItemPermission, Collaborations, ItemType, NotificationType } from '../../common/types/core';
import type { collaboratorsListType, item as itemFlowType } from '../../features/unified-share-modal/flowTypes';
import type {
    ContentSharingItemAPIResponse,
    ContentSharingSharedLinkType,
    GetContactsFnType,
    SendInvitesFnType,
    SharedLinkUpdateLevelFnType,
    SharedLinkUpdateSettingsFnType,
} from './types';

type SharingNotificationProps = {
    accessLevel: string,
    api: API,
    closeComponent?: () => void,
    closeSettings: () => void,
    collaboratorsList: collaboratorsListType | null,
    currentUserID: string | null,
    getContacts: GetContactsFnType | null,
    itemID: string,
    itemType: ItemType,
    ownerEmail: ?string,
    ownerID: ?string,
    permissions: ?BoxItemPermission,
    sendInvites: SendInvitesFnType | null,
    serverURL: string,
    setChangeSharedLinkAccessLevel: (changeSharedLinkAccessLevel: () => SharedLinkUpdateLevelFnType | null) => void,
    setChangeSharedLinkPermissionLevel: (
        changeSharedLinkPermissionLevel: () => SharedLinkUpdateLevelFnType | null,
    ) => void,
    setCollaboratorsList: (collaboratorsList: collaboratorsListType | null) => void,
    setGetContacts: (getContacts: () => GetContactsFnType | null) => void,
    setIsLoading: boolean => void,
    setItem: ((item: itemFlowType | null) => itemFlowType) => void,
    setOnAddLink: (addLink: () => SharedLinkUpdateLevelFnType | null) => void,
    setOnRemoveLink: (removeLink: () => SharedLinkUpdateLevelFnType | null) => void,
    setOnSubmitSettings: (submitSettings: () => SharedLinkUpdateSettingsFnType | null) => void,
    setSendInvites: (sendInvites: () => SendInvitesFnType | null) => void,
    setSharedLink: ((sharedLink: ContentSharingSharedLinkType | null) => ContentSharingSharedLinkType) => void,
};

function SharingNotification({
    accessLevel,
    api,
    closeComponent = noop,
    closeSettings,
    collaboratorsList,
    currentUserID,
    getContacts,
    itemID,
    itemType,
    ownerEmail,
    ownerID,
    permissions,
    sendInvites,
    serverURL,
    setChangeSharedLinkAccessLevel,
    setChangeSharedLinkPermissionLevel,
    setGetContacts,
    setCollaboratorsList,
    setIsLoading,
    setItem,
    setOnAddLink,
    setOnRemoveLink,
    setOnSubmitSettings,
    setSendInvites,
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
            const updatedNotifications = { ...notifications };
            if (updatedNotifications[notificationID]) {
                return;
            }
            updatedNotifications[notificationID] = (
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
            setNotifications(updatedNotifications);
            setNotificationID(notificationID + 1);
        },
        [handleNotificationClose, notificationID, notifications],
    );

    // Handle successful PUT requests to /files or /folders
    const handleUpdateSharedLinkSuccess = (itemData: ContentSharingItemAPIResponse) => {
        const { item: updatedItem, sharedLink: updatedSharedLink } = convertItemResponse(itemData);
        setItem((prevItem: itemFlowType | null) => ({ ...prevItem, ...updatedItem }));
        setSharedLink((prevSharedLink: ContentSharingSharedLinkType | null) => {
            return {
                ...prevSharedLink,
                ...updatedSharedLink,
            };
        }); // merge new shared link data with current shared link data
    };

    /**
     * Handle a successful shared link removal request.
     *
     * Most of the data for the shared link will be removed, with the exception of the "canInvite" and "serverURL"
     * properties, both of which are still necessary for rendering the form-only version of ContentSharing.
     * We retain "serverURL" from the previous shared link, to avoid having to make another call to the Users API.
     *
     * @param {ContentSharingItemAPIResponse} itemData
     */
    const handleRemoveSharedLinkSuccess = (itemData: ContentSharingItemAPIResponse) => {
        const { item: updatedItem, sharedLink: updatedSharedLink } = convertItemResponse(itemData);
        setItem((prevItem: itemFlowType | null) => ({ ...prevItem, ...updatedItem }));
        setSharedLink((prevSharedLink: ContentSharingSharedLinkType | null) => {
            return {
                ...updatedSharedLink,
                serverURL: prevSharedLink ? prevSharedLink.serverURL : '',
            };
        });
    };

    // Generate shared link CRUD functions for the item
    const {
        changeSharedLinkAccessLevel,
        changeSharedLinkPermissionLevel,
        onAddLink,
        onRemoveLink,
        onSubmitSettings,
    } = useSharedLink(api, itemID, itemType, permissions, accessLevel, {
        handleError: () => {
            createNotification(TYPE_ERROR, contentSharingMessages.sharedLinkUpdateError);
            setIsLoading(false);
            closeSettings();
        },
        handleUpdateSharedLinkSuccess: itemData => {
            createNotification(TYPE_INFO, contentSharingMessages.sharedLinkSettingsUpdateSuccess);
            handleUpdateSharedLinkSuccess(itemData);
            setIsLoading(false);
            closeSettings();
        },
        handleRemoveSharedLinkSuccess: itemData => {
            createNotification(TYPE_INFO, contentSharingMessages.sharedLinkSettingsUpdateSuccess);
            handleRemoveSharedLinkSuccess(itemData);
            setIsLoading(false);
            closeComponent(); // if this function is provided, it will close the modal
        },
        setIsLoading,
        transformAccess: newAccessLevel => USM_TO_API_ACCESS_LEVEL_MAP[newAccessLevel],
        transformPermissions: newSharedLinkPermissionLevel =>
            convertSharedLinkPermissions(newSharedLinkPermissionLevel),
        transformSettings: (settings, access) => convertSharedLinkSettings(settings, access, serverURL),
    });

    setChangeSharedLinkAccessLevel(() => changeSharedLinkAccessLevel);
    setChangeSharedLinkPermissionLevel(() => changeSharedLinkPermissionLevel);
    setOnAddLink(() => onAddLink);
    setOnRemoveLink(() => onRemoveLink);
    setOnSubmitSettings(() => onSubmitSettings);

    // Set the collaborators list
    const collaboratorsListFromAPI: Collaborations | null = useCollaborators(api, itemID, itemType, {
        handleError: () => createNotification(TYPE_ERROR, contentSharingMessages.collaboratorsLoadingError),
    });
    if (collaboratorsListFromAPI && !collaboratorsList) {
        setCollaboratorsList(convertCollabsResponse(collaboratorsListFromAPI, ownerEmail, currentUserID === ownerID));
    }

    // Set the getContacts function
    const getContactsFn: GetContactsFnType | null = useContacts(api, itemID, {
        handleError: () => createNotification(TYPE_ERROR, contentSharingMessages.getContactsError),
        transformResponse: data => convertContactsResponse(data, currentUserID),
    });
    if (getContactsFn && !getContacts) {
        setGetContacts(() => getContactsFn);
    }

    // Set the sendInvites function
    const sendInvitesFn = useInvites(api, itemID, itemType, {
        handleSuccess: () => {
            createNotification(TYPE_INFO, contentSharingMessages.sendInvitesSuccess);
            setIsLoading(false);
        },
        handleError: () => {
            createNotification(TYPE_ERROR, contentSharingMessages.sendInvitesError);
            setIsLoading(false);
        },
        setIsLoading,
        transformRequest: data => convertCollabsRequest(data),
    });
    if (sendInvitesFn && !sendInvites) {
        setSendInvites(() => sendInvitesFn);
    }

    return (
        <NotificationsWrapper>
            <>{[...Object.values(notifications)]}</>
        </NotificationsWrapper>
    );
}

export default SharingNotification;
