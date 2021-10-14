// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import API from '../../api';
import Notification from '../../components/notification/Notification';
import { DURATION_SHORT, TYPE_ERROR, TYPE_INFO } from '../../components/notification/constants';
import NotificationsWrapper from '../../components/notification/NotificationsWrapper';
import useSharedLink from './hooks/useSharedLink';
import {
    convertCollab,
    convertCollabsRequest,
    convertCollabsResponse,
    convertGroupContactsResponse,
    convertItemResponse,
    convertSharedLinkPermissions,
    convertSharedLinkSettings,
    convertUserContactsResponse,
    USM_TO_API_ACCESS_LEVEL_MAP,
} from '../../features/unified-share-modal/utils/convertData';
import useAvatars from './hooks/useAvatars';
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
    closeComponent: () => void,
    closeSettings: () => void,
    collaboratorsList: collaboratorsListType | null,
    currentUserID: string | null,
    getContacts: GetContactsFnType | null,
    isDownloadAvailable: boolean,
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
    setCollaboratorsList: (
        collaboratorsList:
            | collaboratorsListType
            | null
            | ((prevList: collaboratorsListType | null) => collaboratorsListType),
    ) => void,
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
    closeComponent,
    closeSettings,
    collaboratorsList,
    currentUserID,
    getContacts,
    isDownloadAvailable,
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
                    key={notificationID}
                    duration={DURATION_SHORT}
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
     * Most of the data for the shared link will be removed, with the exception of the "canInvite", "serverURL"
     * and "enterpriseName" properties, both of which are still necessary for rendering the form-only version of ContentSharing.
     * We retain "serverURL" and "enterpriseName" from the previous shared link, to avoid having to make another call to the Users API.
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
                enterpriseName: prevSharedLink && prevSharedLink.enterpriseName ? prevSharedLink.enterpriseName : '',
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
        handleUpdateSharedLinkError: () => {
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
        handleRemoveSharedLinkError: () => {
            createNotification(TYPE_ERROR, contentSharingMessages.sharedLinkUpdateError);
            setIsLoading(false);
            closeComponent(); // if this function is provided, it will close the modal
        },
        handleRemoveSharedLinkSuccess: itemData => {
            createNotification(TYPE_INFO, contentSharingMessages.sharedLinkRemovalSuccess);
            handleRemoveSharedLinkSuccess(itemData);
            setIsLoading(false);
            closeComponent();
        },
        setIsLoading,
        transformAccess: newAccessLevel => USM_TO_API_ACCESS_LEVEL_MAP[newAccessLevel],
        transformPermissions: newSharedLinkPermissionLevel =>
            convertSharedLinkPermissions(newSharedLinkPermissionLevel),
        transformSettings: (settings, access) =>
            convertSharedLinkSettings(settings, access, isDownloadAvailable, serverURL),
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
    const avatarsFromAPI = useAvatars(api, itemID, collaboratorsListFromAPI);

    if (collaboratorsListFromAPI && avatarsFromAPI && !collaboratorsList) {
        setCollaboratorsList(
            convertCollabsResponse(collaboratorsListFromAPI, avatarsFromAPI, ownerEmail, currentUserID === ownerID),
        );
    }

    // Set the getContacts function
    const getContactsFn: GetContactsFnType | null = useContacts(api, itemID, {
        handleError: () => createNotification(TYPE_ERROR, contentSharingMessages.getContactsError),
        transformGroups: data => convertGroupContactsResponse(data),
        transformUsers: data => convertUserContactsResponse(data, currentUserID),
    });
    if (getContactsFn && !getContacts) {
        setGetContacts(() => getContactsFn);
    }

    // Set the sendInvites function
    const sendInvitesFn = useInvites(api, itemID, itemType, {
        handleSuccess: response => {
            createNotification(TYPE_INFO, contentSharingMessages.sendInvitesSuccess);
            setIsLoading(false);
            setCollaboratorsList((prevList: collaboratorsListType | null) => {
                const newList = prevList ? { ...prevList } : { collaborators: [] };
                const newCollab = convertCollab({
                    collab: response,
                    ownerEmail,
                    isCurrentUserOwner: currentUserID === ownerID,
                });
                if (newCollab) {
                    newList.collaborators.push(newCollab);
                }
                return newList;
            });
            closeComponent();
        },
        handleError: () => {
            createNotification(TYPE_ERROR, contentSharingMessages.sendInvitesError);
            setIsLoading(false);
            closeComponent();
        },
        setIsLoading,
        transformRequest: data => convertCollabsRequest(data, collaboratorsList),
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
