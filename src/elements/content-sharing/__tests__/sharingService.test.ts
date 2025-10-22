import { ACCESS_NONE, PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_PREVIEW } from '../../../constants';
import { CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS } from '../constants';
import { createSharingService } from '../sharingService';
import { convertSharedLinkPermissions, convertSharedLinkSettings } from '../utils';

jest.mock('../utils');

const mockItemApiInstance = {
    updateSharedLink: jest.fn(),
    share: jest.fn(),
};
const options = { id: '123', permissions: { can_set_share_access: true, can_share: true } };
const mockOnUpdateSharedLink = jest.fn();
const mockOnRemoveSharedLink = jest.fn();

const createSharingServiceWrapper = () => {
    return createSharingService({
        itemApiInstance: mockItemApiInstance,
        onUpdateSharedLink: mockOnUpdateSharedLink,
        onRemoveSharedLink: mockOnRemoveSharedLink,
        options,
    });
};

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
            const service = createSharingServiceWrapper();
            expect(service).toHaveProperty('changeSharedLinkPermission');
            expect(typeof service.changeSharedLinkPermission).toBe('function');
        });

        test('should call updateSharedLink with correct parameters when changeSharedLinkPermission is called', async () => {
            const service = createSharingServiceWrapper();
            const permissionLevel = PERMISSION_CAN_DOWNLOAD;
            const expectedPermissions = {
                [PERMISSION_CAN_DOWNLOAD]: true,
                [PERMISSION_CAN_PREVIEW]: false,
            };

            await service.changeSharedLinkPermission(permissionLevel);

            expect(mockItemApiInstance.updateSharedLink).toHaveBeenCalledWith(
                options,
                { permissions: expectedPermissions },
                mockOnUpdateSharedLink,
                {},
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        });
    });

    describe('changeSharedLinkAccess', () => {
        test('should return an object with changeSharedLinkAccess method', () => {
            const service = createSharingServiceWrapper();
            expect(service).toHaveProperty('changeSharedLinkAccess');
            expect(typeof service.changeSharedLinkAccess).toBe('function');
        });

        test.each(['open', 'company', 'collaborators'])(
            'should call share with correct parameters when changeSharedLinkAccess is called',
            async access => {
                const service = createSharingServiceWrapper();
                await service.changeSharedLinkAccess(access);

                expect(mockItemApiInstance.share).toHaveBeenCalledWith(
                    options,
                    access,
                    mockOnUpdateSharedLink,
                    {},
                    CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
                );
            },
        );
    });

    describe('createSharedLink', () => {
        test('should return an object with createSharedLink method', () => {
            const service = createSharingServiceWrapper();
            expect(service).toHaveProperty('createSharedLink');
            expect(typeof service.createSharedLink).toBe('function');
        });

        test('should call share with correct parameters when createSharedLink is called', async () => {
            const service = createSharingServiceWrapper();
            await service.createSharedLink();

            expect(mockItemApiInstance.share).toHaveBeenCalledWith(
                options,
                undefined,
                mockOnUpdateSharedLink,
                {},
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        });
    });

    describe('deleteSharedLink', () => {
        test('should return an object with deleteSharedLink method', () => {
            const service = createSharingServiceWrapper();
            expect(service).toHaveProperty('deleteSharedLink');
            expect(typeof service.deleteSharedLink).toBe('function');
        });

        test('should call share with ACCESS_NONE and onRemoveSharedLink when deleteSharedLink is called', async () => {
            const service = createSharingServiceWrapper();
            await service.deleteSharedLink();

            expect(mockItemApiInstance.share).toHaveBeenCalledWith(
                options,
                ACCESS_NONE,
                mockOnRemoveSharedLink,
                {},
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        });
    });

    describe('updateSharedLink', () => {
        test('should return an object with updateSharedLink method', () => {
            const service = createSharingServiceWrapper();

            expect(service).toHaveProperty('updateSharedLink');
            expect(typeof service.updateSharedLink).toBe('function');
        });

        test('should call updateSharedLink with basic shared link settings', async () => {
            const service = createSharingServiceWrapper();

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
                undefined, // serverUrl
            );
            expect(mockItemApiInstance.updateSharedLink).toHaveBeenCalledWith(
                options,
                expectedConvertedSettings,
                mockOnUpdateSharedLink,
                {},
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        });

        test('should call updateSharedLink with options including access, isDownloadAvailable, and serverUrl', async () => {
            const mockConvertedSharedLinkSettings = {
                password: 'test-password',
                permissions: { can_download: false, can_preview: true },
                unshared_at: null,
                vanity_url: 'https://example.com/vanity-url',
            };

            (convertSharedLinkSettings as jest.Mock).mockReturnValue(mockConvertedSharedLinkSettings);

            const service = createSharingService({
                itemApiInstance: mockItemApiInstance,
                onUpdateSharedLink: mockOnUpdateSharedLink,
                onRemoveSharedLink: mockOnRemoveSharedLink,
                options: {
                    ...options,
                    access: 'open',
                    isDownloadAvailable: true,
                    serverUrl: 'https://example.com/server-url',
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
                mockOnUpdateSharedLink,
                {},
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        });

        test('should handle shared link settings correctly', async () => {
            const service = createSharingServiceWrapper();

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
