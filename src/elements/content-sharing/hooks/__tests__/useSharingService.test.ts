import { renderHook } from '@testing-library/react';

import { TYPE_FILE, TYPE_FOLDER } from '../../../../constants';
import { createSharingService } from '../../sharingService';
import { convertCollab, convertCollabsRequest, convertItemResponse } from '../../utils';
import { useSharingService } from '../useSharingService';
import useInvites from '../useInvites';

jest.mock('../../utils/convertItemResponse');
jest.mock('../../utils/convertCollaborators');
jest.mock('../../sharingService');
jest.mock('../useInvites');

const mockApi = {
    getFileAPI: jest.fn(),
    getFolderAPI: jest.fn(),
};
const mockSharingService = {
    createSharedLink: jest.fn(),
    changeSharedLinkAccess: jest.fn(),
    changeSharedLinkPermission: jest.fn(),
    deleteSharedLink: jest.fn(),
    updateSharedLink: jest.fn(),
};
const mockSendInvitations = jest.fn();

const mockItemId = '123';
const mockSharingServiceProps = {
    can_set_share_access: true,
    can_share: true,
    serverURL: 'https://example.com/server-url',
};
const mockItem = {
    id: mockItemId,
    permissions: {
        can_download: true,
        can_preview: false,
    },
    sharingServiceProps: mockSharingServiceProps,
};
const mockSharedLink = {
    access: 'open',
    settings: {
        isDownloadAvailable: true,
    },
};

const mockConvertedData = {
    item: mockItem,
    sharedLink: mockSharedLink,
};

const mockSetItem = jest.fn();
const mockSetSharedLink = jest.fn();
const mockSetCollaborators = jest.fn();

const renderHookWithProps = (props = {}) => {
    return renderHook(() =>
        useSharingService({
            api: mockApi,
            avatarURLMap: {},
            collaborators: [],
            currentUserId: '123',
            item: mockItem,
            itemId: mockItemId,
            itemType: TYPE_FILE,
            sharedLink: mockSharedLink,
            sharingServiceProps: mockSharingServiceProps,
            setCollaborators: mockSetCollaborators,
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
        (useInvites as jest.Mock).mockReturnValue(mockSendInvitations);
        (convertCollab as jest.Mock).mockReturnValue({ id: 'collab-1', email: 'test@example.com' });
        (convertCollabsRequest as jest.Mock).mockReturnValue({ users: [], groups: [] });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return null itemApiInstance and sharingService when item is null', () => {
        const { result } = renderHookWithProps({ item: null });

        expect(result.current.sharingService).toEqual({ sendInvitations: expect.any(Function) });
        expect(mockApi.getFileAPI).not.toHaveBeenCalled();
        expect(mockApi.getFolderAPI).not.toHaveBeenCalled();
        expect(createSharingService).not.toHaveBeenCalled();
    });

    test('should return null itemApiInstance and sharingService when sharedLink is null', () => {
        const { result } = renderHookWithProps({ sharedLink: null });

        expect(result.current.sharingService).toEqual({ sendInvitations: expect.any(Function) });
        expect(mockApi.getFileAPI).not.toHaveBeenCalled();
        expect(mockApi.getFolderAPI).not.toHaveBeenCalled();
        expect(createSharingService).not.toHaveBeenCalled();
    });

    test('should return null itemApiInstance and sharingService when itemType is neither TYPE_FILE nor TYPE_FOLDER', () => {
        const { result } = renderHookWithProps({ itemType: 'hubs' });

        expect(result.current.sharingService).toEqual({ sendInvitations: expect.any(Function) });
        expect(mockApi.getFileAPI).not.toHaveBeenCalled();
        expect(mockApi.getFolderAPI).not.toHaveBeenCalled();
        expect(createSharingService).not.toHaveBeenCalled();
    });

    describe('when itemType is TYPE_FILE', () => {
        beforeEach(() => {
            mockApi.getFileAPI.mockReturnValue({});
        });

        test('should create file API instance and sharing service', () => {
            const { result } = renderHookWithProps();
            const { can_set_share_access, can_share, serverURL } = mockItem.sharingServiceProps;

            expect(mockApi.getFileAPI).toHaveBeenCalled();
            expect(mockApi.getFolderAPI).not.toHaveBeenCalled();
            expect(result.current.sharingService).toEqual({
                ...mockSharingService,
                sendInvitations: expect.any(Function),
            });
            expect(createSharingService).toHaveBeenCalledWith({
                itemApiInstance: {},
                onUpdateSharedLink: expect.any(Function),
                onRemoveSharedLink: expect.any(Function),
                options: {
                    access: mockSharedLink.access,
                    isDownloadAvailable: mockSharedLink.settings.isDownloadAvailable,
                    id: mockItemId,
                    permissions: { can_set_share_access, can_share },
                    serverURL,
                },
            });
        });

        test('should handle update shared link success callback correctly', () => {
            (convertItemResponse as jest.Mock).mockReturnValue(mockConvertedData);
            renderHookWithProps();

            // Get the callbacks that were passed to mock createSharingService
            const createSharingServiceArgs = (createSharingService as jest.Mock).mock.calls[0][0];
            createSharingServiceArgs.onUpdateSharedLink(mockConvertedData);

            expect(convertItemResponse).toHaveBeenCalledWith(mockConvertedData);
            expect(mockSetItem).toHaveBeenCalledTimes(1);
            expect(mockSetSharedLink).toHaveBeenCalledTimes(1);
        });

        test('should handle remove shared link success callback correctly', () => {
            (convertItemResponse as jest.Mock).mockReturnValue(mockConvertedData);
            renderHookWithProps();

            // Get the callbacks that were passed to mock createSharingService
            const createSharingServiceArgs = (createSharingService as jest.Mock).mock.calls[0][0];
            createSharingServiceArgs.onRemoveSharedLink(mockConvertedData);

            expect(convertItemResponse).toHaveBeenCalledWith(mockConvertedData);
            expect(mockSetItem).toHaveBeenCalledTimes(1);
            expect(mockSetSharedLink).toHaveBeenCalledTimes(1);
        });
    });

    describe('when itemType is TYPE_FOLDER', () => {
        beforeEach(() => {
            mockApi.getFolderAPI.mockReturnValue({});
        });

        test('should create folder API instance and sharing service', () => {
            const { result } = renderHookWithProps({ itemType: TYPE_FOLDER });
            const { can_set_share_access, can_share, serverURL } = mockItem.sharingServiceProps;

            expect(mockApi.getFolderAPI).toHaveBeenCalled();
            expect(mockApi.getFileAPI).not.toHaveBeenCalled();
            expect(result.current.sharingService).toEqual({
                ...mockSharingService,
                sendInvitations: expect.any(Function),
            });
            expect(createSharingService).toHaveBeenCalledWith({
                itemApiInstance: {},
                onUpdateSharedLink: expect.any(Function),
                onRemoveSharedLink: expect.any(Function),
                options: {
                    access: mockSharedLink.access,
                    isDownloadAvailable: mockSharedLink.settings.isDownloadAvailable,
                    id: mockItemId,
                    permissions: { can_set_share_access, can_share },
                    serverURL,
                },
            });
        });

        test('should handle update shared link success callback correctly for folders', () => {
            (convertItemResponse as jest.Mock).mockReturnValue(mockConvertedData);
            renderHookWithProps({ itemType: TYPE_FOLDER });

            // Get the callbacks that were passed to mock createSharingService
            const createSharingServiceArgs = (createSharingService as jest.Mock).mock.calls[0][0];
            createSharingServiceArgs.onUpdateSharedLink(mockConvertedData);

            expect(convertItemResponse).toHaveBeenCalledWith(mockConvertedData);
            expect(mockSetItem).toHaveBeenCalledTimes(1);
            expect(mockSetSharedLink).toHaveBeenCalledTimes(1);
        });

        test('should handle remove shared link success callback correctly for folders', () => {
            (convertItemResponse as jest.Mock).mockReturnValue(mockConvertedData);
            renderHookWithProps({ itemType: TYPE_FOLDER });

            // Get the callbacks that were passed to mock createSharingService
            const createSharingServiceArgs = (createSharingService as jest.Mock).mock.calls[0][0];
            createSharingServiceArgs.onRemoveSharedLink(mockConvertedData);

            expect(convertItemResponse).toHaveBeenCalledWith(mockConvertedData);
            expect(mockSetItem).toHaveBeenCalledTimes(1);
            expect(mockSetSharedLink).toHaveBeenCalledTimes(1);
        });
    });

    describe('sendInvitations', () => {
        const mockCollaborators = [{ id: 'collab-1', email: 'existing@example.com', type: 'user' }];
        const mockAvatarURLMap = { 'user-1': 'https://example.com/avatar.jpg' };
        const mockCurrentUserId = 'current-user-123';

        test('should call useInvites with correct parameters', () => {
            renderHookWithProps({
                collaborators: mockCollaborators,
                avatarURLMap: mockAvatarURLMap,
                currentUserId: mockCurrentUserId,
            });

            expect(useInvites).toHaveBeenCalledWith(mockApi, mockItemId, TYPE_FILE, {
                collaborators: mockCollaborators,
                handleSuccess: expect.any(Function),
                transformRequest: expect.any(Function),
            });
        });

        test('should handle success callback correctly', () => {
            const mockResponse = {
                created_by: {
                    id: 'owner-123',
                    login: 'owner@test.com',
                },
            };

            renderHookWithProps({
                collaborators: mockCollaborators,
                avatarURLMap: mockAvatarURLMap,
                currentUserId: mockCurrentUserId,
            });

            // Get the handleSuccess and setCollaborators function that was passed to useInvites
            const useInvitesCallOptions = (useInvites as jest.Mock).mock.calls[0][3];
            useInvitesCallOptions.handleSuccess(mockResponse);
            const setCollaboratorsCallback = mockSetCollaborators.mock.calls[0][0];
            setCollaboratorsCallback(mockCollaborators);

            expect(convertCollab).toHaveBeenCalledWith({
                collab: mockResponse,
                currentUserId: mockCurrentUserId,
                isCurrentUserOwner: false,
                ownerEmailDomain: 'test.com',
                avatarURLMap: mockAvatarURLMap,
            });
        });

        test('should call transformRequest with convertCollabsRequest', () => {
            const mockCollabRequest = {
                contacts: [{ id: 'user-1', email: 'user@test.com', type: 'user' }],
                role: 'editor',
            };

            renderHookWithProps({
                collaborators: mockCollaborators,
            });

            const useInvitesCallOptions = (useInvites as jest.Mock).mock.calls[0][3];
            useInvitesCallOptions.transformRequest(mockCollabRequest);

            expect(convertCollabsRequest).toHaveBeenCalledWith(mockCollabRequest, mockCollaborators);
        });
    });
});
