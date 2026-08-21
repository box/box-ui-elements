import type { UserContactType } from '@box/user-selector';
import { createFetchAvatarUrls, createFetchUsers, mapToUserContact } from '../fetchers/metadataUserFetcher';
import type API from '../../../api';
import type { GroupMini, UserMini } from '../../../common/types/core';

describe('metadataUserFetcher', () => {
    const fileId = '12345';

    const getUsersInEnterpriseMock = jest.fn();
    const getGroupsInEnterpriseMock = jest.fn();
    const getAvatarUrlWithAccessTokenMock = jest.fn();

    const apiMock = {
        getMarkerBasedUsersAPI: jest.fn().mockReturnValue({ getUsersInEnterprise: getUsersInEnterpriseMock }),
        getMarkerBasedGroupsAPI: jest.fn().mockReturnValue({ getGroupsInEnterprise: getGroupsInEnterpriseMock }),
        getUsersAPI: jest.fn().mockReturnValue({ getAvatarUrlWithAccessToken: getAvatarUrlWithAccessTokenMock }),
    } as unknown as jest.Mocked<API>;

    const mockUser: UserMini = {
        id: '111',
        name: 'Albert Einstein',
        email: 'albert@example.com',
        type: 'user',
    };

    const mockGroup: GroupMini = {
        id: '222',
        name: 'Physics Department',
        type: 'group',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('mapToUserContact', () => {
        test('maps a user with email', () => {
            expect(mapToUserContact(mockUser)).toEqual({
                email: 'albert@example.com',
                id: 111,
                name: 'Albert Einstein',
                type: 'user',
                value: '111',
            });
        });

        test('falls back to login when email is missing', () => {
            const userWithLoginOnly = { ...mockUser, email: undefined, login: 'albert@box.com' };

            expect(mapToUserContact(userWithLoginOnly).email).toBe('albert@box.com');
        });

        test('maps a group with empty email', () => {
            expect(mapToUserContact(mockGroup)).toEqual({
                email: '',
                id: 222,
                name: 'Physics Department',
                type: 'group',
                value: '222',
            });
        });

        test('collapses non-numeric id to 0 while preserving value', () => {
            const userWithExternalId = { ...mockUser, id: 'external-abc' };

            expect(mapToUserContact(userWithExternalId)).toEqual(
                expect.objectContaining({ id: 0, value: 'external-abc' }),
            );
        });
    });

    describe('createFetchUsers', () => {
        test('fetches enterprise users and groups with filter_term and merges them', async () => {
            getUsersInEnterpriseMock.mockImplementation((id, successCallback) =>
                successCallback({ entries: [mockUser] }),
            );
            getGroupsInEnterpriseMock.mockImplementation((id, successCallback) =>
                successCallback({ entries: [mockGroup] }),
            );

            const result = await createFetchUsers(apiMock, fileId)('alb');

            expect(getUsersInEnterpriseMock).toHaveBeenCalledWith(fileId, expect.any(Function), expect.any(Function), {
                filter_term: 'alb',
            });
            expect(getGroupsInEnterpriseMock).toHaveBeenCalledWith(fileId, expect.any(Function), expect.any(Function), {
                filter_term: 'alb',
            });
            expect(result).toEqual([
                { email: 'albert@example.com', id: 111, name: 'Albert Einstein', type: 'user', value: '111' },
                { email: '', id: 222, name: 'Physics Department', type: 'group', value: '222' },
            ]);
        });

        test('returns groups when the users request fails', async () => {
            getUsersInEnterpriseMock.mockImplementation((id, successCallback, errorCallback) =>
                errorCallback(new Error('users failed')),
            );
            getGroupsInEnterpriseMock.mockImplementation((id, successCallback) =>
                successCallback({ entries: [mockGroup] }),
            );

            const result = await createFetchUsers(apiMock, fileId)('alb');

            expect(result).toEqual([{ email: '', id: 222, name: 'Physics Department', type: 'group', value: '222' }]);
        });

        test('returns users when the groups request fails', async () => {
            getUsersInEnterpriseMock.mockImplementation((id, successCallback) =>
                successCallback({ entries: [mockUser] }),
            );
            getGroupsInEnterpriseMock.mockImplementation((id, successCallback, errorCallback) =>
                errorCallback(new Error('groups failed')),
            );

            const result = await createFetchUsers(apiMock, fileId)('alb');

            expect(result).toEqual([
                { email: 'albert@example.com', id: 111, name: 'Albert Einstein', type: 'user', value: '111' },
            ]);
        });

        test('returns an empty list when both responses have no entries', async () => {
            getUsersInEnterpriseMock.mockImplementation((id, successCallback) => successCallback({}));
            getGroupsInEnterpriseMock.mockImplementation((id, successCallback) => successCallback({}));

            const result = await createFetchUsers(apiMock, fileId)('alb');

            expect(result).toEqual([]);
        });
    });

    describe('createFetchAvatarUrls', () => {
        const userContact: UserContactType = {
            email: 'albert@example.com',
            id: 111,
            name: 'Albert Einstein',
            type: 'user',
            value: '111',
        };
        const groupContact: UserContactType = {
            email: '',
            id: 222,
            name: 'Physics Department',
            type: 'group',
            value: '222',
        };

        test('resolves avatar urls keyed by contact value', async () => {
            getAvatarUrlWithAccessTokenMock.mockResolvedValue('https://example.com/avatar?access_token=token');

            const result = await createFetchAvatarUrls(apiMock, fileId)([userContact]);

            expect(getAvatarUrlWithAccessTokenMock).toHaveBeenCalledWith('111', fileId);
            expect(result).toEqual({ '111': 'https://example.com/avatar?access_token=token' });
        });

        test('skips groups entirely', async () => {
            const result = await createFetchAvatarUrls(apiMock, fileId)([groupContact]);

            expect(getAvatarUrlWithAccessTokenMock).not.toHaveBeenCalled();
            expect(result).toEqual({});
        });

        test('omits contacts without an avatar url', async () => {
            getAvatarUrlWithAccessTokenMock.mockResolvedValue(null);

            const result = await createFetchAvatarUrls(apiMock, fileId)([userContact]);

            expect(result).toEqual({});
        });

        test('omits contacts whose avatar request fails', async () => {
            getAvatarUrlWithAccessTokenMock.mockRejectedValue(new Error('avatar failed'));

            const result = await createFetchAvatarUrls(apiMock, fileId)([userContact]);

            expect(result).toEqual({});
        });
    });
});
