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
    sharingServiceProps: {
        can_set_share_access: true,
        can_share: true,
    },
};
const mockSharedLink = {
    access: 'open',
    serverURL: 'https://example.com/server-url',
    settings: {
        isDownloadAvailable: true,
    },
};
const mockSharingServiceProps = {
    can_set_share_access: true,
    can_share: true,
};

const mockSetItem = jest.fn();
const mockSetSharedLink = jest.fn();

const renderHookWithProps = (props = {}) => {
    return renderHook(() =>
        useSharingService({
            api: mockApi,
            item: mockItem,
            itemId: mockItemId,
            itemType: TYPE_FILE,
            sharedLink: mockSharedLink,
            sharingServiceProps: mockSharingServiceProps,
            setItem: mockSetItem,
            setSharedLink: mockSetSharedLink,
            ...props,
        }),
    );
};

describe('elements/content-sharing/hooks/useSharingService', () => {
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
        const { result } = renderHookWithProps({ item: null });

        expect(result.current.sharingService).toBeNull();
        expect(mockApi.getFileAPI).not.toHaveBeenCalled();
        expect(mockApi.getFolderAPI).not.toHaveBeenCalled();
        expect(createSharingService).not.toHaveBeenCalled();
    });

    test('should return null itemApiInstance and sharingService when sharedLink is null', () => {
        const { result } = renderHookWithProps({ sharedLink: null });

        expect(result.current.sharingService).toBeNull();
        expect(mockApi.getFileAPI).not.toHaveBeenCalled();
        expect(mockApi.getFolderAPI).not.toHaveBeenCalled();
        expect(createSharingService).not.toHaveBeenCalled();
    });

    test('should return null itemApiInstance and sharingService when itemType is neither TYPE_FILE nor TYPE_FOLDER', () => {
        const { result } = renderHookWithProps({ itemType: 'hubs' });

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
            const { result } = renderHookWithProps();

            expect(mockApi.getFileAPI).toHaveBeenCalled();
            expect(mockApi.getFolderAPI).not.toHaveBeenCalled();
            expect(result.current.sharingService).toBe(mockSharingService);
            expect(createSharingService).toHaveBeenCalledWith({
                itemApiInstance: mockItemApiInstance,
                onSuccess: expect.any(Function),
                options: {
                    access: mockSharedLink.access,
                    isDownloadAvailable: mockSharedLink.settings.isDownloadAvailable,
                    id: mockItemId,
                    permissions: mockItem.sharingServiceProps,
                    serverURL: mockSharedLink.serverURL,
                },
            });
        });

        test('should handle success callback correctly', () => {
            const mockConvertedData = {
                item: {
                    id: mockItemId,
                    permissions: { can_download: false, can_preview: true },
                },
                sharedLink: {},
            };

            (convertItemResponse as jest.Mock).mockReturnValue(mockConvertedData);
            renderHookWithProps();

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
            const { result } = renderHookWithProps({ itemType: TYPE_FOLDER });

            expect(mockApi.getFolderAPI).toHaveBeenCalled();
            expect(mockApi.getFileAPI).not.toHaveBeenCalled();
            expect(result.current.sharingService).toBe(mockSharingService);
            expect(createSharingService).toHaveBeenCalledWith({
                itemApiInstance: mockItemApiInstance,
                onSuccess: expect.any(Function),
                options: {
                    access: mockSharedLink.access,
                    isDownloadAvailable: mockSharedLink.settings.isDownloadAvailable,
                    id: mockItemId,
                    permissions: mockItem.sharingServiceProps,
                    serverURL: mockSharedLink.serverURL,
                },
            });
        });
    });
});
