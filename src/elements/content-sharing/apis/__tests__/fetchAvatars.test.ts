import { DEFAULT_USER_API_RESPONSE, MOCK_ITEM } from '../../utils/__mocks__/ContentSharingV2Mocks';
import { fetchAvatars } from '..';
import { createSuccessMock, createUsersAPIMock } from './testUtils';

const getAvatarUrlMock = jest.fn();
const getDefaultUserMock = jest.fn().mockImplementation(createSuccessMock(DEFAULT_USER_API_RESPONSE));
const defaultAPIMock = createUsersAPIMock({
    getUser: getDefaultUserMock,
    getAvatarUrlWithAccessToken: getAvatarUrlMock,
});

const mockCollaborations = [
    { accessible_by: { id: 123 } },
    { accessible_by: { id: 456 } },
    { accessible_by: { id: 789 } },
];

describe('content-sharing/apis/fetchAvatars', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should fetch avatars successfully', async () => {
        getAvatarUrlMock
            .mockResolvedValueOnce('https://example.com/avatar1.jpg')
            .mockResolvedValueOnce('https://example.com/avatar2.jpg')
            .mockResolvedValueOnce('https://example.com/avatar3.jpg');

        const result = await fetchAvatars({
            api: defaultAPIMock,
            itemID: MOCK_ITEM.id,
            collaborators: mockCollaborations,
        });

        expect(defaultAPIMock.getUsersAPI).toHaveBeenCalledWith(false);
        expect(getAvatarUrlMock).toHaveBeenCalledTimes(3);
        expect(getAvatarUrlMock).toHaveBeenCalledWith('123', MOCK_ITEM.id);
        expect(getAvatarUrlMock).toHaveBeenCalledWith('456', MOCK_ITEM.id);
        expect(getAvatarUrlMock).toHaveBeenCalledWith('789', MOCK_ITEM.id);
        expect(result).toEqual({
            123: 'https://example.com/avatar1.jpg',
            456: 'https://example.com/avatar2.jpg',
            789: 'https://example.com/avatar3.jpg',
        });
    });

    test('should handle avatar fetch errors gracefully', async () => {
        getAvatarUrlMock
            .mockResolvedValueOnce('https://example.com/avatar1.jpg')
            .mockRejectedValueOnce(new Error('Avatar fetch failed'))
            .mockResolvedValueOnce('https://example.com/avatar3.jpg');

        const result = await fetchAvatars({
            api: defaultAPIMock,
            itemID: MOCK_ITEM.id,
            collaborators: mockCollaborations,
        });

        expect(result).toEqual({
            123: 'https://example.com/avatar1.jpg',
            456: null,
            789: 'https://example.com/avatar3.jpg',
        });
    });

    test('should handle collaborators without accessible_by', async () => {
        const collaboratorsWithMissingData = [{ accessible_by: { id: 123 } }, {}, { accessible_by: null }];

        getAvatarUrlMock.mockResolvedValue('https://example.com/avatar.jpg');

        const result = await fetchAvatars({
            api: defaultAPIMock,
            itemID: MOCK_ITEM.id,
            collaborators: collaboratorsWithMissingData,
        });

        expect(getAvatarUrlMock).toHaveBeenCalledTimes(1);
        expect(getAvatarUrlMock).toHaveBeenCalledWith('123', MOCK_ITEM.id);
        expect(result).toEqual({
            123: 'https://example.com/avatar.jpg',
        });
    });

    test('should handle empty collaborators array', async () => {
        const result = await fetchAvatars({
            api: defaultAPIMock,
            itemID: MOCK_ITEM.id,
            collaborators: [],
        });

        expect(getAvatarUrlMock).not.toHaveBeenCalled();
        expect(result).toEqual({});
    });
});
