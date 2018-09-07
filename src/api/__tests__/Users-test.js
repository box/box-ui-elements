import Users from '../Users';

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
            expect(users.getAvatarUrl('foo')).toBe(
                'https://api.box.com/2.0/users/foo/avatar',
            );
        });
    });
});
