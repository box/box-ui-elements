import Groups from '../Groups';
import { ERROR_CODE_FETCH_ENTERPRISE_GROUPS } from '../../constants';

let groups;
const BASE_URL = 'https://www.foo.com';
const FILE_ID = 'foo';
const id = 123;
const MOCK_FILTER = 'content';
const MOCK_ENTERPRISE_GROUPS_RESPONSE = { total_count: 0, entries: [], limit: 25, offset: 0 };
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

        describe('getGroupsInEnterpriseUrl', () => {
            test('should return the enterprise groups URL with the provided filter term', () => {
                expect(groups.getGroupsInEnterpriseUrl(MOCK_FILTER)).toBe(
                    `${BASE_URL}/groups?filter_term=${MOCK_FILTER}`,
                );
            });

            test('should return the default enterprise groups URL if called without a filter term', () => {
                expect(groups.getGroupsInEnterpriseUrl()).toBe(`${BASE_URL}/groups`);
            });
        });

        describe('getGroupsInEnterprise', () => {
            test.each`
                filterTerm     | description
                ${MOCK_FILTER} | ${'provided'}
                ${undefined}   | ${'default'}
            `('should call this.get() with the $description filter term and return a promise', ({ filterTerm }) => {
                const getSpy = jest.spyOn(groups, 'get').mockResolvedValue(MOCK_ENTERPRISE_GROUPS_RESPONSE);
                const getGroupsInEnterpriseUrlSpy = jest
                    .spyOn(groups, 'getGroupsInEnterpriseUrl')
                    .mockReturnValue(BASE_URL);
                groups.getGroupsInEnterprise(FILE_ID, successCallback, errorCallback, filterTerm);
                expect(groups.errorCode).toBe(ERROR_CODE_FETCH_ENTERPRISE_GROUPS);
                expect(getGroupsInEnterpriseUrlSpy).toHaveBeenCalledWith(filterTerm);
                expect(getSpy).toHaveBeenCalledWith({
                    id: FILE_ID,
                    successCallback,
                    errorCallback,
                    url: BASE_URL,
                });
            });
        });
    });
});
