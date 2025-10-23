import * as React from 'react';
import isEmpty from 'lodash/isEmpty';

import { UnifiedShareModal } from '@box/unified-share-modal';
import type { CollaborationRole, Collaborator, Item, SharedLink, User } from '@box/unified-share-modal';

import API from '../../api';
import Internationalize from '../common/Internationalize';
import Providers from '../common/Providers';
import { withBlueprintModernization } from '../common/withBlueprintModernization';
import { fetchAvatars, fetchCollaborators, fetchCurrentUser, fetchItem } from './apis';
import { useContactService, useSharingService } from './hooks';
import { convertCollabsResponse, convertItemResponse } from './utils';

import type { Collaborations, ItemType, StringMap } from '../../common/types/core';
import type { AvatarURLMap } from './types';

export interface ContentSharingV2Props {
    /** api - API instance */
    api: API;
    /** children - Children for the element to open the Unified Share Modal */
    children?: React.ReactElement;
    /** itemId - Box file or folder ID */
    itemId: string;
    /** itemType - "file" or "folder" */
    itemType: ItemType;
    /** hasProviders - Whether the element has providers for USM already */
    hasProviders?: boolean;
    /** language - Language used for the element */
    language?: string;
    /** messages - Localized strings used by the element */
    messages?: StringMap;
}

function ContentSharingV2({
    api,
    children,
    itemId,
    itemType,
    hasProviders,
    language,
    messages,
}: ContentSharingV2Props) {
    const [avatarUrlMap, setAvatarUrlMap] = React.useState<AvatarURLMap | null>(null);
    const [item, setItem] = React.useState<Item | null>(null);
    const [sharedLink, setSharedLink] = React.useState<SharedLink | null>(null);
    const [sharingServiceProps, setSharingServiceProps] = React.useState(null);
    const [currentUser, setCurrentUser] = React.useState<User | null>(null);
    const [collaborationRoles, setCollaborationRoles] = React.useState<CollaborationRole[] | null>(null);
    const [collaborators, setCollaborators] = React.useState<Collaborator[] | null>(null);
    const [collaboratorsData, setCollaboratorsData] = React.useState<Collaborations | null>(null);
    const [owner, setOwner] = React.useState({ id: '', email: '', name: '' });

    const { sharingService } = useSharingService({
        api,
        avatarUrlMap,
        collaborators,
        currentUserId: currentUser?.id,
        item,
        itemId,
        itemType,
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
        setOwner({ id: ownedBy.id, email: ownedBy.login, name: ownedBy.name });
    }, []);

    // Reset state if the API has changed
    React.useEffect(() => {
        setItem(null);
        setSharedLink(null);
        setCurrentUser(null);
        setCollaborationRoles(null);
        setAvatarUrlMap(null);
        setCollaborators(null);
        setCollaboratorsData(null);
    }, [api]);

    // Get initial data for the item
    React.useEffect(() => {
        if (!api || isEmpty(api) || item) return;

        (async () => {
            const itemData = await fetchItem({ api, itemId, itemType });
            handleGetItemSuccess(itemData);
        })();
    }, [api, item, itemId, itemType, sharedLink, handleGetItemSuccess]);

    // Get current user
    React.useEffect(() => {
        if (!api || isEmpty(api) || !item || currentUser) return;

        const getUserSuccess = userData => {
            const { id, enterprise, hostname } = userData;
            setCurrentUser({
                id,
                enterprise: { name: enterprise ? enterprise.name : '' },
            });
            setSharingServiceProps(prevSharingServiceProps => ({
                ...prevSharingServiceProps,
                serverUrl: hostname ? `${hostname}v/` : '',
            }));
        };

        (async () => {
            const userData = await fetchCurrentUser({ api, itemId });
            getUserSuccess(userData);
        })();
    }, [api, currentUser, item, itemId, itemType, sharedLink]);

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

    const config = { sharedLinkEmail: false };

    return (
        <Internationalize language={language} messages={messages}>
            <Providers hasProviders={hasProviders}>
                {item && (
                    <UnifiedShareModal
                        config={config}
                        collaborationRoles={collaborationRoles}
                        collaborators={collaborators}
                        contactService={contactService}
                        currentUser={currentUser}
                        item={item}
                        sharedLink={sharedLink}
                        sharingService={sharingService}
                    >
                        {children}
                    </UnifiedShareModal>
                )}
            </Providers>
        </Internationalize>
    );
}

export default withBlueprintModernization(ContentSharingV2);
