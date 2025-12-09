import { DEFAULT_USER_API_RESPONSE, MOCK_ITEM } from '../../utils/__mocks__/ContentSharingV2Mocks';
import { FIELD_ENTERPRISE, FIELD_HOSTNAME } from '../../../../constants';
import { fetchCurrentUser } from '..';
import { createSuccessMock, createUsersApiMock } from './testUtils';

const getDefaultUserMock = jest.fn().mockImplementation(createSuccessMock(DEFAULT_USER_API_RESPONSE));
const defaultApiMock = createUsersApiMock({ getUser: getDefaultUserMock });

describe('content-sharing/apis/fetchCurrentUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should fetch current user successfully', async () => {
        const result = await fetchCurrentUser({ api: defaultApiMock, itemId: MOCK_ITEM.id });

        expect(defaultApiMock.getUsersAPI).toHaveBeenCalledWith(false);
        expect(getDefaultUserMock).toHaveBeenCalledWith(MOCK_ITEM.id, expect.any(Function), expect.any(Function), {
            params: {
                fields: [FIELD_ENTERPRISE, FIELD_HOSTNAME].toString(),
            },
        });
        expect(result).toEqual(DEFAULT_USER_API_RESPONSE);
    });

    test('should handle API errors', async () => {
        const errorMock = jest.fn().mockImplementation((userID, successCallback, errorCallback) => {
            errorCallback(new Error('API Error'));
        });
        const errorApiMock = createUsersApiMock({ getUser: errorMock });
        await expect(fetchCurrentUser({ api: errorApiMock, itemId: MOCK_ITEM.id })).rejects.toThrow('API Error');
    });
});
