import { renderHook } from '@testing-library/react';

import { TYPE_FILE, TYPE_FOLDER } from '../../../../constants';
import { createSharingService } from '../../sharingService';
import { convertItemResponse } from '../../utils/convertItemResponse';
import { useSharingService } from '../useSharingService';

jest.mock('../../utils/convertItemResponse');
jest.mock('../../sharingService');

const mockApi = {
    getFileAPI: jest.fn(),
    getFolderAPI: jest.fn(),
};
const mockItemApiInstance = {
    updateSharedLink: jest.fn(),
};
const mockSharingService = {
    changeSharedLinkPermission: jest.fn(),
};

const mockItemId = '123';
const mockItem = {
    id: mockItemId,
    permissions: {
        can_download: true,
        can_preview: false,
    },
};

const mockSetItem = jest.fn();
const mockSetSharedLink = jest.fn();

describe('content-sharing/hooks/useSharingService', () => {
    beforeEach(() => {
        (createSharingService as jest.Mock).mockReturnValue(mockSharingService);
        (convertItemResponse as jest.Mock).mockReturnValue({
            item: mockItem,
            sharedLink: {},
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return null itemApiInstance and sharingService when item is null', () => {
        const { result } = renderHook(() =>
            useSharingService(mockApi, null, mockItemId, TYPE_FILE, mockSetItem, mockSetSharedLink),
        );

        expect(result.current.sharingService).toBeNull();
        expect(mockApi.getFileAPI).not.toHaveBeenCalled();
        expect(mockApi.getFolderAPI).not.toHaveBeenCalled();
        expect(createSharingService).not.toHaveBeenCalled();
    });

    test('should return null itemApiInstance and sharingService when itemType is neither TYPE_FILE nor TYPE_FOLDER', () => {
        const { result } = renderHook(() =>
            useSharingService(mockApi, mockItem, mockItemId, 'hubs', mockSetItem, mockSetSharedLink),
        );

        expect(result.current.sharingService).toBeNull();
        expect(mockApi.getFileAPI).not.toHaveBeenCalled();
        expect(mockApi.getFolderAPI).not.toHaveBeenCalled();
        expect(createSharingService).not.toHaveBeenCalled();
    });

    describe('when itemType is TYPE_FILE', () => {
        beforeEach(() => {
            mockApi.getFileAPI.mockReturnValue(mockItemApiInstance);
        });

        test('should create file API instance and sharing service', () => {
            const { result } = renderHook(() =>
                useSharingService(mockApi, mockItem, mockItemId, TYPE_FILE, mockSetItem, mockSetSharedLink),
            );

            expect(mockApi.getFileAPI).toHaveBeenCalled();
            expect(mockApi.getFolderAPI).not.toHaveBeenCalled();
            expect(result.current.sharingService).toBe(mockSharingService);
            expect(createSharingService).toHaveBeenCalledWith({
                itemApiInstance: mockItemApiInstance,
                itemData: {
                    id: mockItemId,
                    permissions: mockItem.permissions,
                },
                onSuccess: expect.any(Function),
            });
        });

        test('should handle success callback correctly', () => {
            const mockConvertedData = {
                item: {
                    id: mockItemId,
                    permissions: { can_download: false },
                },
                sharedLink: {},
            };

            (convertItemResponse as jest.Mock).mockReturnValue(mockConvertedData);
            renderHook(() =>
                useSharingService(mockApi, mockItem, mockItemId, TYPE_FILE, mockSetItem, mockSetSharedLink),
            );

            // Get the onSuccess callback that was passed to mock createSharingService
            const onSuccessCallback = (createSharingService as jest.Mock).mock.calls[0][0].onSuccess;
            onSuccessCallback(mockConvertedData);

            expect(mockSetItem).toHaveBeenCalledTimes(1);
            expect(mockSetSharedLink).toHaveBeenCalledTimes(1);
        });
    });

    describe('when itemType is TYPE_FOLDER', () => {
        beforeEach(() => {
            mockApi.getFolderAPI.mockReturnValue(mockItemApiInstance);
        });

        test('should create folder API instance and sharing service', () => {
            const { result } = renderHook(() =>
                useSharingService(mockApi, mockItem, mockItemId, TYPE_FOLDER, mockSetItem, mockSetSharedLink),
            );

            expect(mockApi.getFolderAPI).toHaveBeenCalled();
            expect(mockApi.getFileAPI).not.toHaveBeenCalled();
            expect(result.current.sharingService).toBe(mockSharingService);
            expect(createSharingService).toHaveBeenCalledWith({
                itemApiInstance: mockItemApiInstance,
                itemData: {
                    id: mockItemId,
                    permissions: mockItem.permissions,
                },
                onSuccess: expect.any(Function),
            });
        });
    });
});
