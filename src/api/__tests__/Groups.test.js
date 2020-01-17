import Groups from '../Groups';

let groups;
const BASE_URL = 'https://www.foo.com';
const FILE_ID = 'foo';
const id = 123;
describe('api/Groups', () => {
    beforeEach(() => {
        groups = new Groups({});
    });

    describe('CRUD operations', () => {
        const file = {
            id: 'foo',
            permissions: {},
        };
        const groupId = '123';
        const group = {
            id: groupId,
        };

        const successCallback = jest.fn();
        const errorCallback = jest.fn();

        beforeEach(() => {
            // mock out groups.get response
            groups.get = jest.fn();
            groups.checkApiCallValidity = jest.fn(() => true);
            groups.getBaseApiUrl = jest.fn(() => BASE_URL);
        });

        describe('getGroupCount()', () => {
            test('should get a well formed', () => {
                const expectedRequestData = {
                    data: {
                        limit: 1,
                    },
                };

                groups.getGroupCount({
                    file,
                    group,
                    successCallback,
                    errorCallback,
                });

                // getGroupCount() returns Promise
                // Verify whether groups.get resolves or rejects
                // cannot use toBeCalledWith()
                expect(groups.get).toBeCalledWith({
                    id: FILE_ID,
                    url: `${BASE_URL}/groups/${id}/memberships`,
                    data: expectedRequestData,
                    successCallback,
                    errorCallback,
                });
            });
        });
    });
});
