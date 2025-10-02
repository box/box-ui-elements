import * as React from 'react';
import isEmpty from 'lodash/isEmpty';

import { UnifiedShareModal } from '@box/unified-share-modal';
import type { CollaborationRole, Collaborator, Item, SharedLink, User } from '@box/unified-share-modal';

import API from '../../api';
import Internationalize from '../common/Internationalize';
import Providers from '../common/Providers';
import { fetchAvatars, fetchCollaborators, fetchCurrentUser, fetchItem } from './apis';
import { convertCollabsResponse, convertItemResponse } from './utils';

import type { Collaborations, ItemType, StringMap } from '../../common/types/core';
import type { AvatarURLMap } from './types';

export interface ContentSharingV2Props {
    /** api - API instance */
    api: API;
    /** children - Children for the element to open the Unified Share Modal */
    children?: React.ReactElement;
    /** itemID - Box file or folder ID */
    itemID: string;
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
    itemID,
    itemType,
    hasProviders,
    language,
    messages,
}: ContentSharingV2Props) {
    const [avatarURLMap, setAvatarURLMap] = React.useState<AvatarURLMap | null>(null);
    const [item, setItem] = React.useState<Item | null>(null);
    const [sharedLink, setSharedLink] = React.useState<SharedLink | null>(null);
    const [currentUser, setCurrentUser] = React.useState<User | null>(null);
    const [collaborationRoles, setCollaborationRoles] = React.useState<CollaborationRole[] | null>(null);
    const [collaborators, setCollaborators] = React.useState<Collaborator[] | null>(null);
    const [collaboratorsData, setCollaboratorsData] = React.useState<Collaborations | null>(null);

    // Handle successful GET requests to /files or /folders
    const handleGetItemSuccess = React.useCallback(itemData => {
        console.log('handleGetItemSuccess itemData', itemData);
        const {
            collaborationRoles: collaborationRolesFromAPI,
            item: itemFromAPI,
            sharedLink: sharedLinkFromAPI,
        } = convertItemResponse(itemData);
        setItem(itemFromAPI);
        setSharedLink(sharedLinkFromAPI);
        setCollaborationRoles(collaborationRolesFromAPI);
    }, []);

    // Reset state if the API has changed
    React.useEffect(() => {
        setItem(null);
        setSharedLink(null);
        setCurrentUser(null);
        setCollaborationRoles(null);
        setAvatarURLMap(null);
        setCollaborators(null);
        setCollaboratorsData(null);
    }, [api]);

    // Get initial data for the item
    React.useEffect(() => {
        if (!api || isEmpty(api) || item || sharedLink) return;

        (async () => {
            const itemData = await fetchItem({ api, itemID, itemType });
            handleGetItemSuccess(itemData);
        })();
    }, [api, item, itemID, itemType, sharedLink, handleGetItemSuccess]);

    // Get current user
    React.useEffect(() => {
        if (!api || isEmpty(api) || item || sharedLink || currentUser) return;

        const getUserSuccess = userData => {
            const { enterprise, id } = userData;
            setCurrentUser({
                id,
                enterprise: { name: enterprise ? enterprise.name : '' },
            });
        };

        (async () => {
            const userData = await fetchCurrentUser({ api, itemID });
            getUserSuccess(userData);
        })();
    }, [api, currentUser, item, itemID, itemType, sharedLink]);

    // Get collaborators
    React.useEffect(() => {
        if (!api || isEmpty(api) || item || collaboratorsData) return;

        (async () => {
            try {
                const response = await fetchCollaborators({ api, itemID, itemType });
                setCollaboratorsData(response);
            } catch {
                setCollaboratorsData({ entries: [], next_marker: null });
            }
        })();
    }, [api, collaboratorsData, item, itemID, itemType]);

    // Get avatars when collaborators are available
    React.useEffect(() => {
        if (avatarURLMap || !collaboratorsData || !collaboratorsData.entries) return;

        (async () => {
            const response = await fetchAvatars({ api, itemID, collaborators: collaboratorsData.entries });
            setAvatarURLMap(response);
        })();
    }, [api, avatarURLMap, collaboratorsData, itemID]);

    // Return processed data when both are ready
    React.useEffect(() => {
        if (collaboratorsData && avatarURLMap) {
            const collaboratorsWithAvatars = convertCollabsResponse(collaboratorsData, avatarURLMap);
            setCollaborators(collaboratorsWithAvatars);
        }
    }, [collaboratorsData, avatarURLMap]);

    const config = { sharedLinkEmail: false };

    return (
        <Internationalize language={language} messages={messages}>
            <Providers hasProviders={hasProviders}>
                {item && (
                    <UnifiedShareModal
                        config={config}
                        collaborationRoles={collaborationRoles}
                        collaborators={collaborators}
                        currentUser={currentUser}
                        item={item}
                        sharedLink={sharedLink}
                    >
                        {children}
                    </UnifiedShareModal>
                )}
            </Providers>
        </Internationalize>
    );
}

export default ContentSharingV2;
