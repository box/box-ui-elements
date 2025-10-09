import { PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_PREVIEW } from '../../../constants';
import { CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS } from '../constants';
import { convertSharedLinkPermissions, createSharingService } from '../sharingService';

describe('content-sharing/sharingService', () => {
    describe('convertSharedLinkPermissions', () => {
        test.each([
            [PERMISSION_CAN_DOWNLOAD, { [PERMISSION_CAN_DOWNLOAD]: true, [PERMISSION_CAN_PREVIEW]: false }],
            [PERMISSION_CAN_PREVIEW, { [PERMISSION_CAN_DOWNLOAD]: false, [PERMISSION_CAN_PREVIEW]: true }],
        ])('should return correct permissions for download permission level', (permissionLevel, expected) => {
            const result = convertSharedLinkPermissions(permissionLevel);
            expect(result).toEqual(expected);
        });

        test('should handle empty string permission level', () => {
            const result = convertSharedLinkPermissions('');
            expect(result).toEqual({});
        });
    });

    describe('createSharingService', () => {
        const mockItemApiInstance = {
            updateSharedLink: jest.fn(),
        };
        const mockItemData = { id: '123' };
        const mockOnSuccess = jest.fn();

        afterEach(() => {
            jest.clearAllMocks();
        });

        test('should return an object with changeSharedLinkPermission method', () => {
            const service = createSharingService({
                itemApiInstance: mockItemApiInstance,
                itemData: mockItemData,
                onSuccess: mockOnSuccess,
            });

            expect(service).toHaveProperty('changeSharedLinkPermission');
            expect(typeof service.changeSharedLinkPermission).toBe('function');
        });

        test('should call updateSharedLink with correct parameters when changeSharedLinkPermission is called', async () => {
            const service = createSharingService({
                itemApiInstance: mockItemApiInstance,
                itemData: mockItemData,
                onSuccess: mockOnSuccess,
            });

            const permissionLevel = PERMISSION_CAN_DOWNLOAD;
            const expectedPermissions = {
                [PERMISSION_CAN_DOWNLOAD]: true,
                [PERMISSION_CAN_PREVIEW]: false,
            };

            await service.changeSharedLinkPermission(permissionLevel);

            expect(mockItemApiInstance.updateSharedLink).toHaveBeenCalledWith(
                mockItemData,
                { permissions: expectedPermissions },
                mockOnSuccess,
                {},
                CONTENT_SHARING_SHARED_LINK_UPDATE_PARAMS,
            );
        });
    });
});
