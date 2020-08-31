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
            groups.get = jest.fn();
            groups.checkApiCallValidity = jest.fn(() => true);
            groups.getBaseApiUrl = jest.fn(() => BASE_URL);
        });

        describe('getGroupCount()', () => {
            test('should get group data from the groups endpoint', () => {
                const expectedRequestData = {
                    params: {
                        limit: 1,
                    },
                };

                groups.getGroupCount({
                    file,
                    group,
                    successCallback,
                    errorCallback,
                });

                expect(groups.get).toBeCalledWith({
                    id: FILE_ID,
                    url: `${BASE_URL}/groups/${id}/memberships`,
                    requestData: expectedRequestData,
                    successCallback: expect.any(Function),
                    errorCallback: expect.any(Function),
                });
            });
        });
    });
});
