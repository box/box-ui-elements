import { DEFAULT_USER_API_RESPONSE, MOCK_ITEM } from '../../utils/__mocks__/ContentSharingV2Mocks';
import { FIELD_ENTERPRISE, FIELD_HOSTNAME } from '../../../../constants';
import { fetchCurrentUser } from '..';
import { createSuccessMock, createUsersAPIMock } from './testUtils';

const getDefaultUserMock = jest.fn().mockImplementation(createSuccessMock(DEFAULT_USER_API_RESPONSE));
const defaultAPIMock = createUsersAPIMock({ getUser: getDefaultUserMock });

describe('content-sharing/apis/fetchCurrentUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should fetch current user successfully', async () => {
        const result = await fetchCurrentUser({ api: defaultAPIMock, itemID: MOCK_ITEM.id });

        expect(defaultAPIMock.getUsersAPI).toHaveBeenCalledWith(false);
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
        const errorAPIMock = createUsersAPIMock({ getUser: errorMock });
        await expect(fetchCurrentUser({ api: errorAPIMock, itemID: MOCK_ITEM.id })).rejects.toThrow('API Error');
    });
});
