import OffsetBasedAPI from '../OffsetBasedAPI';

describe('api/OffsetBasedAPI', () => {
    let offsetBasedAPI;
    beforeEach(() => {
        offsetBasedAPI = new OffsetBasedAPI({});
    });

    describe('getQueryParameters()', () => {
        test('should return query parameters with no fields', () => {
            expect(offsetBasedAPI.getQueryParameters()).toEqual({
                offset: 0,
                limit: 100
            });
        });

        test('should return query parameters with no fields', () => {
            offsetBasedAPI.fields = ['foo', 'bar'];
            expect(offsetBasedAPI.getQueryParameters()).toEqual({
                offset: 0,
                limit: 100,
                fields: 'foo,bar'
            });
        });
    });

    describe('hasMoreItems()', () => {
        test('should be more items', () => {
            offsetBasedAPI.totalCount = 101;
            offsetBasedAPI.offset = 100;

            expect(offsetBasedAPI.hasMoreItems()).toBe(true);
        });

        test('should not be more items', () => {
            offsetBasedAPI.totalCount = 101;
            offsetBasedAPI.offset = 101;

            expect(offsetBasedAPI.hasMoreItems()).toBe(false);
        });
    });
});
