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

export const DEFAULT_USER_API_RESPONSE = {
    id: '123',
    enterprise: {
        name: 'Parrot Enterprise',
    },
};

export const DEFAULT_ITEM_API_RESPONSE = {
    allowed_invitee_roles: ['editor', 'viewer'],
    allowed_shared_link_access_levels: ['open', 'company', 'collaborators'],
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

export const MOCK_ITEM_API_RESPONSE_WITH_CLASSIFICATION = {
    ...DEFAULT_ITEM_API_RESPONSE,
    classification: MOCK_CLASSIFICATION,
};

// Mock API class for ContentSharingV2 storybook
export const createMockAPI = (itemResponse = DEFAULT_ITEM_API_RESPONSE, userResponse = DEFAULT_USER_API_RESPONSE) => {
    const mockFileAPI = {
        getFile: (itemID, successCallback) => {
            // Simulate async behavior
            setTimeout(() => {
                successCallback(itemResponse);
            }, 100);
        },
    };

    const mockFolderAPI = {
        getFolderFields: (itemID, successCallback) => {
            // Simulate async behavior
            setTimeout(() => {
                successCallback(itemResponse);
            }, 100);
        },
    };

    const mockUsersAPI = {
        getUser: (itemID, successCallback) => {
            // Simulate async behavior
            setTimeout(() => {
                successCallback(userResponse);
            }, 100);
        },
    };

    return {
        getFileAPI: () => mockFileAPI,
        getFolderAPI: () => mockFolderAPI,
        getUsersAPI: () => mockUsersAPI,
    };
};

// Pre-configured mock APIs for different scenarios
export const mockAPIWithSharedLink = createMockAPI(MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK);
export const mockAPIWithoutSharedLink = createMockAPI(DEFAULT_ITEM_API_RESPONSE);
