import OffsetBasedAPI from '../OffsetBasedAPI';

const LIMIT = 1000;

describe('api/OffsetBasedAPI', () => {
    let offsetBasedAPI;
    const offsetBasedAPIResponse = { total_count: 0, entries: [] };

    beforeEach(() => {
        offsetBasedAPI = new OffsetBasedAPI({});
    });

    describe('getQueryParameters()', () => {
        test('should return query parameters with no fields', () => {
            expect(offsetBasedAPI.getQueryParameters(0, LIMIT)).toEqual({
                offset: 0,
                limit: LIMIT
            });
        });

        test('should return query parameters with fields', () => {
            const fields = ['foo', 'bar'];
            expect(offsetBasedAPI.getQueryParameters(0, LIMIT, fields)).toEqual({
                offset: 0,
                limit: LIMIT,
                fields: 'foo,bar'
            });
        });
    });

    describe('hasMoreItems()', () => {
        test('should be more items', () => {
            expect(offsetBasedAPI.hasMoreItems(LIMIT, LIMIT + 1)).toBe(true);
        });

        test('should be more items with no totalCount', () => {
            expect(offsetBasedAPI.hasMoreItems(LIMIT)).toBe(true);
        });

        test('should not be more items', () => {
            expect(offsetBasedAPI.hasMoreItems(LIMIT, LIMIT)).toBe(false);
        });
    });

    describe('get()', () => {
        const url = 'https://foo.bar';
        beforeEach(() => {
            offsetBasedAPI.getUrl = jest.fn(() => url);
        });

        test('should not do anything if destroyed', () => {
            offsetBasedAPI.isDestroyed = jest.fn().mockReturnValueOnce(true);
            offsetBasedAPI.xhr = null;

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return offsetBasedAPI.get('id', successCb, errorCb).catch(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        test('should make xhr to get offsetBasedAPI and call success callback', () => {
            offsetBasedAPI.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: offsetBasedAPIResponse }))
            };

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return offsetBasedAPI.get('id', successCb, errorCb).then(() => {
                expect(successCb).toHaveBeenCalledWith(offsetBasedAPIResponse);
                expect(offsetBasedAPI.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url,
                    params: {
                        offset: 0,
                        limit: LIMIT
                    }
                });
            });
        });

        test('should immediately reject if offset >= total_count', () => {
            const pagedCommentsResponse = {
                total_count: 50,
                entries: []
            };
            offsetBasedAPI.xhr = {
                get: jest.fn().mockReturnValue(
                    Promise.resolve({
                        data: pagedCommentsResponse
                    })
                )
            };

            const successCb = jest.fn();
            const errorCb = jest.fn();

            offsetBasedAPI.totalCount = 50;
            offsetBasedAPI.offset = 50;

            return offsetBasedAPI.get('id', successCb, errorCb).catch(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
                expect(offsetBasedAPI.xhr.get).not.toHaveBeenCalled();
            });
        });

        test('should call error callback when xhr fails', () => {
            const error = new Error('error');
            offsetBasedAPI.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.reject(error))
            };

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return offsetBasedAPI.get('id', successCb, errorCb).then(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).toHaveBeenCalledWith(error);
                expect(offsetBasedAPI.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url,
                    params: {
                        offset: 0,
                        limit: LIMIT
                    }
                });
            });
        });
    });
});
