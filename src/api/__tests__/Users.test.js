import TokenService from '../../utils/TokenService';
import Users from '../Users';
import { ERROR_CODE_FETCH_ENTERPRISE_USERS } from '../../constants';

jest.mock('../../utils/TokenService');
TokenService.getReadToken.mockImplementation(() => Promise.resolve(`${Math.random()}`));

const MOCK_FILTER = 'content';
const MOCK_ITEM_ID = '140984325';
const MOCK_ENTERPRISE_USERS_URL = 'https://api.box.com/2.0/users';
const MOCK_ENTERPRISE_USERS_URL_WITH_FILTER = `https://api.box.com/2.0/users?filter_term=${MOCK_FILTER}`;
const MOCK_ENTERPRISE_USERS_RESPONSE = { total_count: 0, entries: [], limit: 25, offset: 0 };

let users;

describe('api/Users', () => {
    beforeEach(() => {
        users = new Users({});
    });

    describe('getUrl()', () => {
        test('should return correct users api url without id', () => {
            expect(users.getUrl()).toBe('https://api.box.com/2.0/users/me');
        });
    });

    describe('getAvatarUrl()', () => {
        test('should return correct users avatar url', () => {
            expect(users.getAvatarUrl('foo')).toBe('https://api.box.com/2.0/users/foo/avatar');
        });
    });

    describe('getAvatarUrlWithAccessToken()', () => {
        test('should return cached avatar url if called with same user id', async () => {
            const url1 = await users.getAvatarUrlWithAccessToken('foo');
            const url2 = await users.getAvatarUrlWithAccessToken('foo');
            expect(url1).toEqual(url2);
            expect(url1.startsWith('https://api.box.com/2.0/users/foo/avatar?access_token=')).toBe(true);
            expect(url1.indexOf('pic_type') !== -1).toBe(true);
        });

        test('should not return cached avatar url if called with another id', async () => {
            const url1 = await users.getAvatarUrlWithAccessToken('foo');
            const url2 = await users.getAvatarUrlWithAccessToken('bar');
            expect(url1).not.toEqual(url2);
        });

        test('should return null if there is no user id specified', async () => {
            const url1 = await users.getAvatarUrlWithAccessToken();
            expect(url1).toBeNull();
        });
    });

    describe('getUsersInEnterpriseUrl()', () => {
        test('should return the enterprise users URL with the provided filter term', () => {
            expect(users.getUsersInEnterpriseUrl(MOCK_FILTER)).toBe(MOCK_ENTERPRISE_USERS_URL_WITH_FILTER);
        });

        test('should return the default enterprise users URL if called without a filter term', () => {
            expect(users.getUsersInEnterpriseUrl()).toBe(MOCK_ENTERPRISE_USERS_URL);
        });
    });

    describe('getUsersInEnterprise()', () => {
        test.each`
            filterTerm     | description
            ${MOCK_FILTER} | ${'provided'}
            ${undefined}   | ${'default'}
        `('should call this.get() with the $description filter term and return a promise', ({ filterTerm }) => {
            const getSpy = jest.spyOn(users, 'get').mockResolvedValue(MOCK_ENTERPRISE_USERS_RESPONSE);
            const getUsersInEnterpriseUrlSpy = jest
                .spyOn(users, 'getUsersInEnterpriseUrl')
                .mockReturnValue(MOCK_ENTERPRISE_USERS_URL);
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            users.getUsersInEnterprise(MOCK_ITEM_ID, successCallback, errorCallback, filterTerm);
            expect(users.errorCode).toBe(ERROR_CODE_FETCH_ENTERPRISE_USERS);
            expect(getUsersInEnterpriseUrlSpy).toHaveBeenCalledWith(filterTerm);
            expect(getSpy).toHaveBeenCalledWith({
                id: MOCK_ITEM_ID,
                successCallback,
                errorCallback,
                url: MOCK_ENTERPRISE_USERS_URL,
            });
        });
    });
});
