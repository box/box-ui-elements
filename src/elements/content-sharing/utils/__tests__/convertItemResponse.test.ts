import {
    DEFAULT_ITEM_API_RESPONSE,
    MOCK_ITEM_API_RESPONSE_WITH_CLASSIFICATION,
    MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK,
    mockOwnerEmail,
    mockOwnerId,
    mockOwnerName,
} from '../__mocks__/ContentSharingV2Mocks';

import { convertItemResponse } from '../convertItemResponse';
import { getAllowedPermissionLevels } from '../getAllowedPermissionLevels';

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
            collaborationRoles: [
                { id: 'editor', isDefault: true },
                { id: 'viewer', isDefault: false },
            ],
            item: {
                classification: undefined,
                id: '123456789',
                name: 'Box Development Guide.pdf',
                permissions: {
                    canInviteCollaborator: true,
                    canSetShareAccess: true,
                    canShare: true,
                },
                type: 'file',
            },
            ownedBy: {
                id: mockOwnerId,
                login: mockOwnerEmail,
                name: mockOwnerName,
            },
            sharingService: {
                can_set_share_access: true,
                can_share: true,
                ownerEmail: mockOwnerEmail,
                ownerId: mockOwnerId,
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
                downloadUrl: 'https://example.com/shared_link=abc123',
                expiresAt: 1704067200000,
                permission: 'can_download',
                permissionLevels: ['can_edit', 'can_download', 'can_preview'],
                settings: {
                    canChangeDownload: true,
                    canChangeExpiration: true,
                    canChangePassword: true,
                    canChangeVanityName: false,
                    isDirectLinkAvailable: true,
                    isDownloadAvailable: true,
                    isDownloadEnabled: true,
                    isPasswordAvailable: true,
                    isPasswordEnabled: true,
                    isVanityNameAvailable: true,
                },
                url: 'https://example.com/shared-link',
                vanityDomain: 'https://example.com/vanity-url',
                vanityName: 'vanity-name',
            });
        });

        test('should use shared_link_permission_options from API when available', () => {
            const result = convertItemResponse(MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK);
            expect(result.sharedLink?.permissionLevels).toEqual(['can_edit', 'can_download', 'can_preview']);
            expect(getAllowedPermissionLevels).not.toHaveBeenCalled();
        });

        test('should call getAllowedPermissionLevels when shared_link_permission_options is not available', () => {
            const mockItemWithoutPermissionOptions = {
                ...MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK,
                shared_link_permission_options: undefined,
            };
            convertItemResponse(mockItemWithoutPermissionOptions);
            expect(getAllowedPermissionLevels).toHaveBeenCalledWith(true, true, 'can_download');
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
                shared_link_features: { download_url: false, password: false, vanity_name: false },
                permissions: {
                    ...MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK.permissions,
                },
            };
            const result = convertItemResponse(MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK_WITH_PERMISSIONS);
            expect(result.sharedLink.settings.canChangeDownload).toEqual(false);
            expect(result.sharedLink.settings.canChangePassword).toEqual(false);
            expect(result.sharedLink.settings.canChangeExpiration).toEqual(false);
            expect(result.sharedLink.settings.isDirectLinkAvailable).toEqual(false);
            expect(result.sharedLink.settings.isVanityNameAvailable).toEqual(false);
        });
    });

    describe('direct link availability', () => {
        test('should extract downloadUrl from shared_link.download_url', () => {
            const result = convertItemResponse(MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK);
            expect(result.sharedLink?.downloadUrl).toEqual('https://example.com/shared_link=abc123');
            expect(result.sharedLink.settings.isDirectLinkAvailable).toEqual(true);
        });

        test('should handle when direct link is not available (free users)', () => {
            const mockItemWithoutDirectLink = {
                ...MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK,
                shared_link: {
                    ...MOCK_ITEM_API_RESPONSE_WITH_SHARED_LINK.shared_link,
                    download_url: undefined,
                },
                shared_link_features: { download_url: false, password: true, vanity_name: true },
            };
            const result = convertItemResponse(mockItemWithoutDirectLink);
            expect(result.sharedLink.settings.isDirectLinkAvailable).toEqual(false);
            expect(result.sharedLink.downloadUrl).toBeUndefined();
        });
    });
});
