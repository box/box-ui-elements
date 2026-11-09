import TokenService from '../../utils/TokenService';
import Users from '../Users';
import type { APIOptions } from '../../common/types/api';

jest.mock('../../utils/TokenService');
(TokenService.getReadToken as jest.Mock).mockImplementation(() => Promise.resolve(`${Math.random()}`));

let users: Users;
const FILE_ID = '123';

describe('api/Users', () => {
    beforeEach(() => {
        users = new Users({} as APIOptions);
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

    describe('getAvatarUrlWithAccessToken(undefined, FILE_ID)', () => {
        test('should return cached avatar url if called with same user id', async () => {
            const url1 = await users.getAvatarUrlWithAccessToken('foo', FILE_ID);
            const url2 = await users.getAvatarUrlWithAccessToken('foo', FILE_ID);
            expect(url1).toEqual(url2);
            expect(url1.startsWith('https://api.box.com/2.0/users/foo/avatar?access_token=')).toBe(true);
            expect(url1.indexOf('pic_type') !== -1).toBe(true);
        });

        test('should not return cached avatar url if called with another id', async () => {
            const url1 = await users.getAvatarUrlWithAccessToken('foo', FILE_ID);
            const url2 = await users.getAvatarUrlWithAccessToken('bar', FILE_ID);
            expect(url1).not.toEqual(url2);
        });

        test('should return null if there is no user id specified', async () => {
            const url1 = await users.getAvatarUrlWithAccessToken(undefined, FILE_ID);
            expect(url1).toBeNull();
        });
    });
});
