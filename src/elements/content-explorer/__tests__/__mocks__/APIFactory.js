// Mock API functions
const mockGetAPI = jest.fn();
const mockGetFolder = jest.fn();
const mockGetFile = jest.fn();
const mockGetThumbnailUrl = jest.fn();
const mockGenerateRepresentation = jest.fn();
const mockSearch = jest.fn();
const mockRecents = jest.fn();
const mockDestroy = jest.fn((shouldDestroy, successCallback, errorCallback) => {
    return Promise.resolve().then(() => {
        if (shouldDestroy && errorCallback) {
            errorCallback();
        } else if (!shouldDestroy && successCallback) {
            successCallback();
        }
    });
});

const mockShare = jest.fn((item, access, successCallback) => {
    if (successCallback) {
        successCallback({ ...item, shared_link: { url: 'https://test.com' } });
    }
    return Promise.resolve({ ...item, shared_link: { url: 'https://test.com' } });
});

const mockDeleteItem = jest.fn((item, successCallback, errorCallback) => {
    return mockDestroy(false, successCallback, errorCallback);
});

const mockGetCache = jest.fn();
const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
};
mockGetCache.mockReturnValue(mockCache);

const resetMocks = () => {
    mockGetAPI.mockReset();
    mockGetFolder.mockReset();
    mockGetFile.mockReset();
    mockGetThumbnailUrl.mockReset();
    mockGenerateRepresentation.mockReset();
    mockSearch.mockReset();
    mockRecents.mockReset();
    mockDestroy.mockReset();
    mockShare.mockReset();
    mockDeleteItem.mockReset();
};

// Removed old createMockAPI implementation since we're using the class-based approach

// Create the constructor first
class APIConstructor {
    static createMockAPI() {
        const api = new APIConstructor({
            apiHost: 'https://api.box.com',
            clientName: 'ContentExplorer',
            id: 'folder_123',
            token: 'dummy_token',
        });

        // Clear mock histories
        mockShare.mockClear();
        mockDeleteItem.mockClear();
        mockDestroy.mockClear();

        return api;
    }

    constructor(options = {}) {
        // Store configuration
        this.options = options;

        // Bind destroy method
        this.destroy = this.destroy.bind(this);
    }

    destroy(shouldDestroy, successCallback, errorCallback) {
        return mockDestroy(shouldDestroy, successCallback, errorCallback);
    }

    getAPI() {
        mockGetAPI();
        const api = {
            share: mockShare,
            getThumbnailUrl: mockGetThumbnailUrl,
            deleteItem: (item, successCallback, errorCallback) => {
                return this.destroy(false, successCallback, errorCallback);
            },
            destroy: this.destroy.bind(this),
        };
        return api;
    }

    getFolderAPI() {
        return {
            getFolder: mockGetFolder,
        };
    }

    getFileAPI() {
        return {
            getFile: mockGetFile,
            getThumbnailUrl: mockGetThumbnailUrl,
            generateRepresentation: mockGenerateRepresentation,
        };
    }

    getSearchAPI() {
        return {
            search: mockSearch,
        };
    }

    getRecentsAPI() {
        return {
            recents: mockRecents,
        };
    }

    getCache() {
        return mockCache;
    }

    // All methods are now defined in the constructor as bound properties

    static resetMocks = resetMocks;

    static mockGetAPI = mockGetAPI;

    static mockGetFolder = mockGetFolder;

    static mockGetFile = mockGetFile;

    static mockGetThumbnailUrl = mockGetThumbnailUrl;

    static mockGenerateRepresentation = mockGenerateRepresentation;

    static mockSearch = mockSearch;

    static mockRecents = mockRecents;

    static mockDestroy = mockDestroy;

    static mockGetCache = mockGetCache;

    static mockShare = mockShare;

    static mockDeleteItem = mockDeleteItem;
}

export default APIConstructor;
