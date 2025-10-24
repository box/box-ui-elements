import * as React from 'react';

import { Button, Notification, TooltipProvider } from '@box/blueprint-web';

import { TYPE_FILE } from '../../../../constants';
import ContentSharingV2 from '../../ContentSharingV2';

export const MOCK_PERMISSIONS = {
    can_download: true,
    can_invite_collaborator: true,
    can_set_share_access: true,
    can_share: true,
};

export const MOCK_CLASSIFICATION = {
    color: '#91c2fd',
    definition: 'Blue classification',
    name: 'Blue',
};

export const MOCK_ITEM = {
    id: '123456789',
    name: 'Box Development Guide.pdf',
    type: 'file',
};

export const MOCK_SHARED_LINK = {
    access: 'open',
    effective_permission: 'can_download',
    is_password_enabled: true,
    unshared_at: 1704067200000,
    url: 'https://example.com/shared-link',
    vanity_name: 'vanity-name',
    vanity_url: 'https://example.com/vanity-url',
};

export const mockAvatarUrlMap = {
    456: 'https://example.com/avatar.jpg',
};

export const mockOwnerEmail = 'aotter@example.com';
export const mockOwnerName = 'Astronaut Otter';
export const mockOwnerId = 789;

export const collabUser1 = {
    id: 456,
    login: 'dparrot@example.com',
    name: 'Detective Parrot',
    role: 'editor',
};

export const collabUser2 = {
    id: 457,
    login: 'rqueen@external.example.com',
    name: 'Raccoon Queen',
};

export const collabUser3 = {
    id: 458,
    login: 'dpenguin@example.com',
    name: 'Dancing Penguin',
};

export const mockOwner = {
    id: mockOwnerId,
    login: mockOwnerEmail,
    name: mockOwnerName,
};

export const MOCK_COLLABORATORS = [collabUser1, collabUser2, collabUser3];

export const MOCK_COLLABORATIONS_RESPONSE = {
    entries: MOCK_COLLABORATORS.map(user => ({
        id: `record_${user.id}`,
        accessible_by: user,
        expires_at: user.expires_at,
        created_by: {
            id: mockOwnerId,
            login: mockOwnerEmail,
            name: mockOwnerName,
            type: 'user',
        },
        role: user.id === mockOwnerId ? 'owner' : 'editor',
        status: 'accepted',
        type: user.type,
    })),
};

export const EMPTY_COLLABORATIONS_RESPONSE = {
    entries: [],
};

export const DEFAULT_USER_API_RESPONSE = {
    id: '789',
    enterprise: {
        name: 'Otter Enterprise',
    },
};

export const DEFAULT_ITEM_API_RESPONSE = {
    allowed_invitee_roles: ['editor', 'viewer'],
    allowed_shared_link_access_levels: ['open', 'company', 'collaborators'],
    allowed_shared_link_access_levels_disabled_reasons: {
        peopleInThisItem: 'access_policy',
    },
    classification: null,
    id: MOCK_ITEM.id,
    name: MOCK_ITEM.name,
    owned_by: mockOwner,
    permissions: MOCK_PERMISSIONS,
    shared_link: null,
    shared_link_features: { password: true },
    type: MOCK_ITEM.type,
};

export const MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK = {
    ...DEFAULT_ITEM_API_RESPONSE,
    shared_link: MOCK_SHARED_LINK,
};

export const MOCK_ITEM_API_RESPONSE_WITH_COLLABORATORS = {
    ...DEFAULT_ITEM_API_RESPONSE,
    collaborators: MOCK_COLLABORATORS,
};

export const MOCK_ITEM_API_RESPONSE_WITH_CLASSIFICATION = {
    ...DEFAULT_ITEM_API_RESPONSE,
    classification: MOCK_CLASSIFICATION,
};

// Mock API class for ContentSharingV2 storybook
export const createMockApi = (
    itemResponse = DEFAULT_ITEM_API_RESPONSE,
    userResponse = DEFAULT_USER_API_RESPONSE,
    collaboratorsResponse = MOCK_COLLABORATIONS_RESPONSE,
) => {
    const mockFileApi = {
        getFile: (itemId, successCallback) => {
            setTimeout(() => {
                successCallback(itemResponse);
            }, 100);
        },
    };

    const mockFolderApi = {
        getFolderFields: (itemId, successCallback) => {
            setTimeout(() => {
                successCallback(itemResponse);
            }, 100);
        },
    };

    const mockUsersApi = {
        getUser: (itemId, successCallback) => {
            setTimeout(() => {
                successCallback(userResponse);
            }, 100);
        },
        getAvatarUrlWithAccessToken: userId => mockAvatarUrlMap[userId] ?? null,
    };

    const getFileCollaborationsAPI = () => ({
        getCollaborations: (itemId, successCallback) => {
            setTimeout(() => {
                successCallback(collaboratorsResponse);
            }, 100);
        },
    });

    const getFolderCollaborationsAPI = () => ({
        getCollaborations: (itemId, successCallback) => {
            setTimeout(() => {
                successCallback(collaboratorsResponse);
            }, 100);
        },
    });

    return {
        getFileAPI: () => mockFileApi,
        getFolderAPI: () => mockFolderApi,
        getUsersAPI: () => mockUsersApi,
        getFileCollaborationsAPI,
        getFolderCollaborationsAPI,
    };
};

// Pre-configured mock APIs for different scenarios
export const mockApiWithSharedLink = createMockApi(
    MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK,
    DEFAULT_USER_API_RESPONSE,
    EMPTY_COLLABORATIONS_RESPONSE,
);
export const mockApiWithoutSharedLink = createMockApi(
    DEFAULT_ITEM_API_RESPONSE,
    DEFAULT_USER_API_RESPONSE,
    EMPTY_COLLABORATIONS_RESPONSE,
);
export const mockApiWithCollaborators = createMockApi(
    MOCK_ITEM_API_RESPONSE_WITH_COLLABORATORS,
    DEFAULT_USER_API_RESPONSE,
    MOCK_COLLABORATIONS_RESPONSE,
);

export const ContentSharingV2Template = (props = {}) => {
    return (
        <Notification.Provider>
            <TooltipProvider>
                <ContentSharingV2
                    api={mockApiWithoutSharedLink}
                    itemId={global.FILE_ID}
                    itemType={TYPE_FILE}
                    {...props}
                >
                    <Button>Open Unified Share Modal</Button>
                </ContentSharingV2>
            </TooltipProvider>
        </Notification.Provider>
    );
};
