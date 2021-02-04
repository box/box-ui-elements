import MarkerBasedGroups from '../MarkerBasedGroups';
import { DEFAULT_MAX_CONTACTS, ERROR_CODE_FETCH_ENTERPRISE_GROUPS } from '../../constants';

let markerBasedGroups;
let markerGetSpy;
let successCallback;
let errorCallback;
const BASE_URL = 'https://api.box.com/2.0';
const ITEM_ID = '14237093';
const MOCK_REQUEST_DATA = { fields: ['name', 'permissions'], filter_term: 'foo', usemarker: true };

describe('api/MarkerBasedGroups', () => {
    beforeEach(() => {
        markerBasedGroups = new MarkerBasedGroups({});
        markerGetSpy = jest.spyOn(markerBasedGroups, 'markerGet');
        successCallback = jest.fn();
        errorCallback = jest.fn();
    });

    describe('getUrl()', () => {
        test('should return the default API URL', () => {
            expect(markerBasedGroups.getUrl()).toBe(`${BASE_URL}/groups`);
        });
    });

    describe('getGroupsInEnterprise()', () => {
        test.each`
            providedLimit | providedRequestData  | limit                   | requestData            | description
            ${undefined}  | ${undefined}         | ${DEFAULT_MAX_CONTACTS} | ${{ usemarker: true }} | ${'default arguments'}
            ${100}        | ${MOCK_REQUEST_DATA} | ${100}                  | ${MOCK_REQUEST_DATA}   | ${'provided arguments'}
        `('should call this.markerGet() with the $description', ({ requestData, limit }) => {
            jest.spyOn(markerBasedGroups, 'getUrl').mockReturnValue(BASE_URL);
            markerBasedGroups.getGroupsInEnterprise(ITEM_ID, successCallback, errorCallback, requestData, limit);
            expect(markerBasedGroups.errorCode).toBe(ERROR_CODE_FETCH_ENTERPRISE_GROUPS);
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
