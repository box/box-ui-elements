import { PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_PREVIEW } from '../../../constants';
import { CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS } from '../constants';
import { createSharingService } from '../sharingService';
import { convertSharedLinkPermissions, convertSharedLinkSettings } from '../utils';

jest.mock('../utils');

const mockItemApiInstance = {
    updateSharedLink: jest.fn(),
};
const options = { id: '123', permissions: { can_set_share_access: true, can_share: true } };
const mockOnSuccess = jest.fn();

describe('elements/content-sharing/sharingService', () => {
    beforeEach(() => {
        (convertSharedLinkPermissions as jest.Mock).mockReturnValue({
            [PERMISSION_CAN_DOWNLOAD]: true,
            [PERMISSION_CAN_PREVIEW]: false,
        });
        (convertSharedLinkSettings as jest.Mock).mockReturnValue({
            unshared_at: null,
            vanity_url: 'https://example.com/vanity-url',
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('changeSharedLinkPermission', () => {
        test('should return an object with changeSharedLinkPermission method', () => {
            const service = createSharingService({
                itemApiInstance: mockItemApiInstance,
                onSuccess: mockOnSuccess,
                options,
            });

            expect(service).toHaveProperty('changeSharedLinkPermission');
            expect(typeof service.changeSharedLinkPermission).toBe('function');
        });

        test('should call updateSharedLink with correct parameters when changeSharedLinkPermission is called', async () => {
            const service = createSharingService({
                itemApiInstance: mockItemApiInstance,
                onSuccess: mockOnSuccess,
                options,
            });

            const permissionLevel = PERMISSION_CAN_DOWNLOAD;
            const expectedPermissions = {
                [PERMISSION_CAN_DOWNLOAD]: true,
                [PERMISSION_CAN_PREVIEW]: false,
            };

            await service.changeSharedLinkPermission(permissionLevel);

            expect(mockItemApiInstance.updateSharedLink).toHaveBeenCalledWith(
                options,
                { permissions: expectedPermissions },
                mockOnSuccess,
                {},
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        });
    });

    describe('updateSharedLink', () => {
        test('should return an object with updateSharedLink method', () => {
            const service = createSharingService({
                itemApiInstance: mockItemApiInstance,
                onSuccess: mockOnSuccess,
                options,
            });

            expect(service).toHaveProperty('updateSharedLink');
            expect(typeof service.updateSharedLink).toBe('function');
        });

        test('should call updateSharedLink with basic shared link settings', async () => {
            const service = createSharingService({
                itemApiInstance: mockItemApiInstance,
                onSuccess: mockOnSuccess,
                options,
            });

            const sharedLinkSettings = {
                expiration: null,
                isDownloadEnabled: true,
                isExpirationEnabled: false,
                isPasswordEnabled: false,
                password: '',
                vanityName: 'vanity-name',
            };

            const expectedConvertedSettings = {
                unshared_at: null,
                vanity_url: 'https://example.com/vanity-url',
            };

            await service.updateSharedLink(sharedLinkSettings);

            expect(convertSharedLinkSettings).toHaveBeenCalledWith(
                sharedLinkSettings,
                undefined, // access
                undefined, // isDownloadAvailable
                undefined, // serverURL
            );
            expect(mockItemApiInstance.updateSharedLink).toHaveBeenCalledWith(
                options,
                expectedConvertedSettings,
                mockOnSuccess,
                {},
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        });

        test('should call updateSharedLink with options including access, isDownloadAvailable, and serverURL', async () => {
            const mockConvertedSharedLinkSettings = {
                password: 'test-password',
                permissions: { can_download: false, can_preview: true },
                unshared_at: null,
                vanity_url: 'https://example.com/vanity-url',
            };

            (convertSharedLinkSettings as jest.Mock).mockReturnValue(mockConvertedSharedLinkSettings);

            const service = createSharingService({
                itemApiInstance: mockItemApiInstance,
                onSuccess: mockOnSuccess,
                options: {
                    ...options,
                    access: 'open',
                    isDownloadAvailable: true,
                    serverURL: 'https://example.com/server-url',
                },
            });

            const sharedLinkSettings = {
                expiration: null,
                isDownloadEnabled: false,
                isExpirationEnabled: true,
                isPasswordEnabled: true,
                password: 'test-password',
                vanityName: 'vanity-name',
            };

            await service.updateSharedLink(sharedLinkSettings);

            expect(convertSharedLinkSettings).toHaveBeenCalledWith(
                sharedLinkSettings,
                'open',
                true,
                'https://example.com/server-url',
            );
            expect(mockItemApiInstance.updateSharedLink).toHaveBeenCalledWith(
                options,
                mockConvertedSharedLinkSettings,
                mockOnSuccess,
                {},
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        });

        test('should handle shared link settings correctly', async () => {
            const service = createSharingService({
                itemApiInstance: mockItemApiInstance,
                onSuccess: mockOnSuccess,
                options,
            });

            const expirationDate = new Date('2024-12-31T23:59:59Z');
            const sharedLinkSettings = {
                expiration: expirationDate,
                isDownloadEnabled: false,
                isExpirationEnabled: true,
                isPasswordEnabled: false,
                password: 'test-password',
                vanityName: 'vanity-name',
            };

            await service.updateSharedLink(sharedLinkSettings);

            expect(convertSharedLinkSettings).toHaveBeenCalledWith(sharedLinkSettings, undefined, undefined, undefined);
        });
    });
});
