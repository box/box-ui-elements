// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import API from '../../api';
import Notification, { TYPE_ERROR, TYPE_INFO } from '../../components/notification/Notification';
import NotificationsWrapper from '../../components/notification/NotificationsWrapper';
import useSharedLink from './hooks/useSharedLink';
import {
    convertCollabsResponse,
    convertContactsResponse,
    convertItemResponse,
    convertSharedLinkPermissions,
    convertSharedLinkSettings,
    USM_TO_API_ACCESS_LEVEL_MAP,
} from '../../features/unified-share-modal/utils/convertData';
import useCollaborators from './hooks/useCollaborators';
import useContacts from './hooks/useContacts';
import contentSharingMessages from './messages';
import type { BoxItemPermission, Collaborations, ItemType, NotificationType } from '../../common/types/core';
import type { collaboratorsListType, item as itemFlowType } from '../../features/unified-share-modal/flowTypes';
import type { ContentSharingSharedLinkType, GetContactsFnType, SharedLinkUpdateFnType } from './types';

type SharingNotificationProps = {
    api: API,
    collaboratorsList: collaboratorsListType | null,
    currentUserID: string | null,
    getContacts: GetContactsFnType | null,
    itemID: string,
    itemType: ItemType,
    onRequestClose: Function,
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
    setOnSubmitSettings: Function,
    setSharedLink: ((sharedLink: ContentSharingSharedLinkType | null) => ContentSharingSharedLinkType) => void,
    sharedLink: any,
};

function SharingNotification({
    api,
    collaboratorsList,
    currentUserID,
    getContacts,
    itemID,
    itemType,
    onRequestClose,
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
    setOnSubmitSettings,
    setSharedLink,
    sharedLink,
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

    // Generate shared link CRUD functions for the item
    const { serverURL } = sharedLink;
    const {
        changeSharedLinkAccessLevel,
        changeSharedLinkPermissionLevel,
        onAddLink,
        onRemoveLink,
        onSubmitSettings,
    } = useSharedLink(
        api,
        itemID,
        itemType,
        sharedLink,
        permissions,
        setItem,
        setSharedLink,
        {
            handleError: () => createNotification(TYPE_ERROR, contentSharingMessages.sharedLinkUpdateError),
            handleSuccess: () => {
                createNotification(TYPE_INFO, contentSharingMessages.sharedLinkSettingsUpdateSuccess);
                onRequestClose();
            },
        },
        {
            transformAccess: access => USM_TO_API_ACCESS_LEVEL_MAP[access],
            transformItem: item => convertItemResponse(item),
            transformPermissions: newSharedLinkPermissionLevel =>
                convertSharedLinkPermissions(newSharedLinkPermissionLevel),
            transformSettings: newSettings => convertSharedLinkSettings(newSettings, serverURL),
        },
    );

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

    return (
        <NotificationsWrapper>
            <>{[...Object.values(notifications)]}</>
        </NotificationsWrapper>
    );
}

export default SharingNotification;
