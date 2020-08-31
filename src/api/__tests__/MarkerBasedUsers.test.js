import MarkerBasedUsers from '../MarkerBasedUsers';
import { DEFAULT_MAX_CONTACTS, ERROR_CODE_FETCH_ENTERPRISE_USERS } from '../../constants';

let markerBasedUsers;
let markerGetSpy;
let successCallback;
let errorCallback;
const BASE_URL = 'https://api.box.com/2.0';
const ITEM_ID = '14237093';
const MOCK_REQUEST_DATA = { fields: ['name', 'permissions'], filter_term: 'foo', usemarker: true };

describe('api/MarkerBasedUsers', () => {
    beforeEach(() => {
        markerBasedUsers = new MarkerBasedUsers({});
        markerGetSpy = jest.spyOn(markerBasedUsers, 'markerGet');
        successCallback = jest.fn();
        errorCallback = jest.fn();
    });

    describe('getUrl()', () => {
        test('should return the default API URL', () => {
            expect(markerBasedUsers.getUrl()).toBe(`${BASE_URL}/users`);
        });
    });

    describe('getUsersInEnterprise()', () => {
        test.each`
            providedLimit | providedRequestData  | limit                   | requestData            | description
            ${undefined}  | ${undefined}         | ${DEFAULT_MAX_CONTACTS} | ${{ usemarker: true }} | ${'default arguments'}
            ${100}        | ${MOCK_REQUEST_DATA} | ${100}                  | ${MOCK_REQUEST_DATA}   | ${'provided arguments'}
        `('should call this.markerGet() with the $description', ({ requestData, limit }) => {
            jest.spyOn(markerBasedUsers, 'getUrl').mockReturnValue(BASE_URL);
            markerBasedUsers.getUsersInEnterprise(ITEM_ID, successCallback, errorCallback, requestData, limit);
            expect(markerBasedUsers.errorCode).toBe(ERROR_CODE_FETCH_ENTERPRISE_USERS);
            expect(markerGetSpy).toHaveBeenCalledWith({
                id: ITEM_ID,
                limit,
                successCallback,
                errorCallback,
                requestData,
                shouldFetchAll: false,
            });
        });
    });
});
