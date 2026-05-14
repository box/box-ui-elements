import isEmpty from 'lodash/isEmpty';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { useNotification } from '@box/blueprint-web';
import { UnifiedShareModal } from '@box/unified-share-modal';
import type {
    CollaborationRole,
    Collaborator,
    Configuration,
    Item,
    SharedLink,
    SharingService,
    User,
    VariantType,
} from '@box/unified-share-modal';

import API from '../../api';
import { withBlueprintModernization } from '../common/withBlueprintModernization';
import { fetchAvatars, fetchCollaborators, fetchCurrentUser, fetchItem } from './apis';
import { CONTENT_SHARING_ERRORS } from './constants';
import { useContactService, useSharingService } from './hooks';
import { convertCollabsResponse, convertItemResponse } from './utils';

import type { ElementsXhrError } from '../../common/types/api';
import type { Collaborations, ItemType } from '../../common/types/core';
import type { AvatarURLMap } from './types';

import messages from './messages';

export interface ContentSharingV2Props {
    /** api - API instance */
    api: API;
    /** children - Children for the element to open the Unified Share Modal */
    children?: React.ReactElement;
    /** config - Configuration object for the Unified Share Modal */
    config?: Configuration;
    /** itemId - Box file or folder ID */
    itemId: string;
    /** itemType - "file" or "folder" */
    itemType: ItemType;
    /** onClose - Callback when the modal is closed by user action */
    onClose?: () => void;
    /** onError - Callback when item data fails to load, preventing USM from opening */
    onError?: (error: ElementsXhrError) => void;
    /** onSendSharedLink - Callback to email the shared link to the selected contacts */
    onSendSharedLink?: SharingService['sendSharedLink'];
    /** variant - "desktop" or "modal" variant of the Unified Share Modal */
    variant?: VariantType;
}

function ContentSharingV2({
    api,
    children,
    config: usmConfig,
    itemId,
    itemType,
    onClose,
    onError,
    onSendSharedLink,
    variant,
}: ContentSharingV2Props) {
    const { formatMessage } = useIntl();
    const { addNotification } = useNotification();

    const [avatarUrlMap, setAvatarUrlMap] = React.useState<AvatarURLMap | null>(null);
    const [item, setItem] = React.useState<Item | null>(null);
    const [hasError, setHasError] = React.useState<boolean>(false);
    const [sharedLink, setSharedLink] = React.useState<SharedLink | null>(null);
    const [sharingServiceProps, setSharingServiceProps] = React.useState(null);
    const [currentUser, setCurrentUser] = React.useState<User | null>(null);
    const [collaborationRoles, setCollaborationRoles] = React.useState<CollaborationRole[] | null>(null);
    const [collaborators, setCollaborators] = React.useState<Collaborator[] | null>(null);
    const [collaboratorsData, setCollaboratorsData] = React.useState<Collaborations | null>(null);
    const [owner, setOwner] = React.useState({ email: '', id: '', name: '' });
    const [isEnterpriseUser, setIsEnterpriseUser] = React.useState<boolean | null>(null);

    const config = React.useMemo(() => {
        return {
            collaborationMessage: false,
            sharedLinkEmail: !!onSendSharedLink,
            ...usmConfig,
        };
    }, [onSendSharedLink, usmConfig]);

    const sharingService = useSharingService({
        api,
        avatarUrlMap,
        collaborators,
        currentUserId: currentUser?.id,
        item,
        itemId,
        itemType,
        onSendSharedLink,
        sharedLink,
        sharingServiceProps,
        setCollaborators,
        setItem,
        setSharedLink,
    });
    const { contactService } = useContactService(api, itemId, currentUser?.id);

    // Handle successful GET requests to /files or /folders
    const handleGetItemSuccess = React.useCallback(itemData => {
        const {
            collaborationRoles: collaborationRolesFromApi,
            item: itemFromApi,
            ownedBy,
            sharedLink: sharedLinkFromApi,
            sharingService: sharingServicePropsFromApi,
        } = convertItemResponse(itemData);

        setItem(itemFromApi);
        setSharedLink(sharedLinkFromApi);
        setSharingServiceProps(sharingServicePropsFromApi);
        setCollaborationRoles(collaborationRolesFromApi);
        setOwner({ email: ownedBy.login, id: ownedBy.id, name: ownedBy.name });
    }, []);

    // Handle initial data retrieval errors
    const getError = React.useCallback(
        (error: ElementsXhrError) => {
            // display only one component-level notification at a time
            if (hasError) {
                return;
            }

            let errorMessage;
            if (error.status) {
                errorMessage = messages[CONTENT_SHARING_ERRORS[error.status]];
            } else if (error.response && error.response.status) {
                errorMessage = messages[CONTENT_SHARING_ERRORS[error.response.status]];
            } else {
                errorMessage = messages.loadingError;
            }

            if (!errorMessage) {
                errorMessage = messages.defaultErrorNoticeText;
            }

            setHasError(true);
            addNotification({
                closeButtonAriaLabel: formatMessage(messages.noticeCloseLabel),
                sensitivity: 'foreground' as const,
                styledText: formatMessage(errorMessage),
                typeIconAriaLabel: formatMessage(messages.errorNoticeIcon),
                variant: 'error',
            });
        },
        [addNotification, formatMessage, hasError],
    );

    // Reset state if the API has changed
    React.useEffect(() => {
        setHasError(false);
        setItem(null);
        setSharedLink(null);
        setCurrentUser(null);
        setIsEnterpriseUser(null);
        setCollaborationRoles(null);
        setAvatarUrlMap(null);
        setCollaborators(null);
        setCollaboratorsData(null);
    }, [api]);

    // Get initial data for the item
    React.useEffect(() => {
        if (!api || isEmpty(api) || item) return;

        (async () => {
            try {
                const itemData = await fetchItem({ api, itemId, itemType });
                handleGetItemSuccess(itemData);
            } catch (error) {
                getError(error);
                onError?.(error);
            }
        })();
    }, [api, item, itemId, itemType, sharedLink, getError, handleGetItemSuccess, onError]);

    // Get current user
    React.useEffect(() => {
        if (!api || isEmpty(api) || !item || currentUser) return;

        const getUserSuccess = userData => {
            if (!userData) {
                return;
            }

            const { enterprise, hostname, id } = userData;
            setCurrentUser({ id });
            setSharingServiceProps(prevSharingServiceProps => ({
                ...prevSharingServiceProps,
                serverUrl: hostname ? `${hostname}v/` : '',
            }));

            setIsEnterpriseUser(!!enterprise);
        };

        (async () => {
            try {
                const userData = await fetchCurrentUser({ api, itemId });
                getUserSuccess(userData);
            } catch (error) {
                getError(error);
            }
        })();
    }, [api, currentUser, item, itemId, itemType, sharedLink, getError]);

    // Set canChangeExpiration to false for non-enterprise (individual) users on every sharedLink update
    React.useEffect(() => {
        if (isEnterpriseUser !== false || !sharedLink?.settings?.canChangeExpiration) {
            return;
        }

        setSharedLink(prevSharedLink => {
            if (!prevSharedLink) {
                return prevSharedLink;
            }

            return {
                ...prevSharedLink,
                settings: {
                    ...prevSharedLink.settings,
                    canChangeExpiration: false,
                },
            };
        });
    }, [isEnterpriseUser, sharedLink]);

    // Get collaborators
    React.useEffect(() => {
        if (!api || isEmpty(api) || !item || collaboratorsData) return;

        (async () => {
            try {
                const response = await fetchCollaborators({ api, itemId, itemType });
                setCollaboratorsData(response);
            } catch {
                setCollaboratorsData({ entries: [], next_marker: null });
            }
        })();
    }, [api, collaboratorsData, item, itemId, itemType]);

    // Get avatars when collaborators are available
    React.useEffect(() => {
        if (avatarUrlMap || !collaboratorsData || !collaboratorsData.entries || !owner.id) return;
        (async () => {
            const ownerEntry = {
                accessible_by: {
                    id: owner.id,
                    login: owner.email,
                    name: owner.name,
                },
            };
            const response = await fetchAvatars({
                api,
                itemId,
                collaborators: [...collaboratorsData.entries, ownerEntry],
            });
            setAvatarUrlMap(response);
        })();
    }, [api, avatarUrlMap, collaboratorsData, itemId, owner]);

    React.useEffect(() => {
        if (avatarUrlMap && collaboratorsData && currentUser && owner) {
            const collaboratorsWithAvatars = convertCollabsResponse(
                collaboratorsData,
                currentUser.id,
                owner,
                avatarUrlMap,
            );
            setCollaborators(collaboratorsWithAvatars);
        }
    }, [avatarUrlMap, collaboratorsData, currentUser, owner]);

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose?.();
        }
    };

    return (
        item && (
            <UnifiedShareModal
                config={config}
                collaborationRoles={collaborationRoles}
                collaborators={collaborators}
                contactService={contactService}
                currentUser={currentUser}
                item={item}
                onOpenChange={handleOpenChange}
                sharedLink={sharedLink}
                sharingService={sharingService}
                variant={variant}
            >
                {children}
            </UnifiedShareModal>
        )
    );
}

export default withBlueprintModernization(ContentSharingV2);
