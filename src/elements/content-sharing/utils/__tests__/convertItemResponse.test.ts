import {
    DEFAULT_ITEM_API_RESPONSE,
    MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK,
    MOCK_ITEM_API_RESPONSE_WITH_CLASSIFICATION,
    mockOwnerId,
    mockOwnerEmail,
    mockOwnerName,
} from '../__mocks__/ContentSharingV2Mocks';
import { convertItemResponse } from '../convertItemResponse';

jest.mock('../getAllowedAccessLevels', () => ({
    getAllowedAccessLevels: jest.fn().mockReturnValue(['open', 'company', 'collaborators']),
}));

jest.mock('../getAllowedPermissionLevels', () => ({
    getAllowedPermissionLevels: jest.fn().mockReturnValue(['canDownload', 'canPreview']),
}));

describe('convertItemResponse', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should convert basic item without shared link', () => {
        const result = convertItemResponse(DEFAULT_ITEM_API_RESPONSE);
        expect(result).toEqual({
            collaborationRoles: [{ id: 'editor' }, { id: 'viewer' }],
            item: {
                id: '123456789',
                classification: undefined,
                name: 'Box Development Guide.pdf',
                permissions: {
                    canInviteCollaborator: true,
                    canSetShareAccess: true,
                    canShare: true,
                },
                type: 'file',
            },
            owned_by: {
                id: mockOwnerId,
                login: mockOwnerEmail,
                name: mockOwnerName,
            },
        });
    });

    test('should handle folder type', () => {
        const MOCK_ITEM_API_RESPONSE_WITH_FOLDER_TYPE = {
            ...DEFAULT_ITEM_API_RESPONSE,
            type: 'folder',
        };
        const result = convertItemResponse(MOCK_ITEM_API_RESPONSE_WITH_FOLDER_TYPE);
        expect(result.item.type).toBe('folder');
    });

    test('should handle item with classification', () => {
        const result = convertItemResponse(MOCK_ITEM_API_RESPONSE_WITH_CLASSIFICATION);
        expect(result.item.classification).toEqual({
            colorId: 4,
            definition: 'Blue classification',
            name: 'Blue',
        });
    });

    describe('shared link settings', () => {
        test('should convert item with shared link', () => {
            const result = convertItemResponse(MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK);
            expect(result.sharedLink).toEqual({
                access: 'open',
                accessLevels: ['open', 'company', 'collaborators'],
                expiresAt: 1704067200000,
                permission: 'can_download',
                permissionLevels: ['canDownload', 'canPreview'],
                settings: {
                    canChangeDownload: true,
                    canChangeExpiration: true,
                    canChangePassword: true,
                    canChangeVanityName: false,
                    isDownloadAvailable: true,
                    isDownloadEnabled: true,
                    isPasswordAvailable: true,
                    isPasswordEnabled: true,
                },
                url: 'https://example.com/shared-link',
                vanityDomain: 'https://example.com/vanity-url',
                vanityName: 'vanity-name',
            });
        });

        test('should convert shared link settings correctly if user cannot change access level', () => {
            const MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK_WITH_PERMISSIONS = {
                ...MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK,
                permissions: {
                    ...MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK.permissions,
                    can_set_share_access: false,
                },
            };
            const result = convertItemResponse(MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK_WITH_PERMISSIONS);
            expect(result.sharedLink.settings.canChangeDownload).toEqual(false);
            expect(result.sharedLink.settings.canChangePassword).toEqual(false);
            expect(result.sharedLink.settings.canChangeExpiration).toEqual(false);
        });

        test('should convert shared link settings correctly if user does not have permissions', () => {
            const MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK_WITH_PERMISSIONS = {
                ...MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK,
                allowed_invitee_roles: ['viewer'],
                shared_link: {
                    ...MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK.shared_link,
                    access: 'collaborators',
                },
                shared_link_features: { password: false },
                permissions: {
                    ...MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK.permissions,
                },
            };
            const result = convertItemResponse(MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK_WITH_PERMISSIONS);
            expect(result.sharedLink.settings.canChangeDownload).toEqual(false);
            expect(result.sharedLink.settings.canChangePassword).toEqual(false);
            expect(result.sharedLink.settings.canChangeExpiration).toEqual(false);
        });
    });
});
