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

export const mockAvatarURLMap = {
    456: 'https://example.com/avatar.jpg',
};

export const mockOwnerEmail = 'aotter@example.com';

export const mockCurrentUserID = 789;

export const collabUser1 = {
    id: 456,
    login: 'dparrot@example.com',
    name: 'Detective Parrot',
    role: 'editor',
};

export const collabUser2 = {
    id: 457,
    login: 'rqueen@example.com',
    name: 'Raccoon Queen',
};

export const collabUser3 = {
    id: 458,
    login: 'dpenguin@example.com',
    name: 'Dancing Penguin',
};

export const collabUser4 = {
    id: mockCurrentUserID,
    login: mockOwnerEmail,
    name: 'Astronaut Otter',
};

export const MOCK_COLLABORATORS = [collabUser4, collabUser1, collabUser2, collabUser3];

export const MOCK_COLLABORATIONS_RESPONSE = {
    entries: MOCK_COLLABORATORS.map(user => ({
        id: `record_${user.id}`,
        accessible_by: user,
        expires_at: user.expires_at,
        created_by: {
            id: mockCurrentUserID,
            login: mockOwnerEmail,
            name: 'Astronaut Otter',
            type: 'user',
        },
        role: user.id === mockCurrentUserID ? 'owner' : 'editor',
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
export const createMockAPI = (
    itemResponse = DEFAULT_ITEM_API_RESPONSE,
    userResponse = DEFAULT_USER_API_RESPONSE,
    collaboratorsResponse = MOCK_COLLABORATIONS_RESPONSE,
) => {
    const mockFileAPI = {
        getFile: (itemID, successCallback) => {
            setTimeout(() => {
                successCallback(itemResponse);
            }, 100);
        },
    };

    const mockFolderAPI = {
        getFolderFields: (itemID, successCallback) => {
            setTimeout(() => {
                successCallback(itemResponse);
            }, 100);
        },
    };

    const mockUsersAPI = {
        getUser: (itemID, successCallback) => {
            setTimeout(() => {
                successCallback(userResponse);
            }, 100);
        },
        getAvatarUrlWithAccessToken: userID => mockAvatarURLMap[userID] ?? null,
    };

    const getFileCollaborationsAPI = () => ({
        getCollaborations: (itemID, successCallback) => {
            setTimeout(() => {
                successCallback(collaboratorsResponse);
            }, 100);
        },
    });

    const getFolderCollaborationsAPI = () => ({
        getCollaborations: (itemID, successCallback) => {
            setTimeout(() => {
                successCallback(collaboratorsResponse);
            }, 100);
        },
    });

    return {
        getFileAPI: () => mockFileAPI,
        getFolderAPI: () => mockFolderAPI,
        getUsersAPI: () => mockUsersAPI,
        getFileCollaborationsAPI,
        getFolderCollaborationsAPI,
    };
};

// Pre-configured mock APIs for different scenarios
export const mockAPIWithSharedLink = createMockAPI(
    MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK,
    DEFAULT_USER_API_RESPONSE,
    EMPTY_COLLABORATIONS_RESPONSE,
);
export const mockAPIWithoutSharedLink = createMockAPI(
    DEFAULT_ITEM_API_RESPONSE,
    DEFAULT_USER_API_RESPONSE,
    EMPTY_COLLABORATIONS_RESPONSE,
);
export const mockAPIWithCollaborators = createMockAPI(
    MOCK_ITEM_API_RESPONSE_WITH_COLLABORATORS,
    DEFAULT_USER_API_RESPONSE,
    MOCK_COLLABORATIONS_RESPONSE,
);
