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

        test('should return correct users api url with id', () => {
            expect(users.getUrl('foo')).toBe('https://api.box.com/2.0/users/foo');
        });
    });
});
