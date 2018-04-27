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
            expect(offsetBasedAPI.getQueryParameters()).toEqual({
                offset: 0,
                limit: LIMIT
            });
        });

        test('should return query parameters with fields', () => {
            const fields = ['foo', 'bar'];
            expect(offsetBasedAPI.getQueryParameters(fields)).toEqual({
                offset: 0,
                limit: LIMIT,
                fields: 'foo,bar'
            });
        });
    });

    describe('hasMoreItems()', () => {
        test('should be more items', () => {
            offsetBasedAPI.totalCount = LIMIT + 1;
            offsetBasedAPI.offset = LIMIT;

            expect(offsetBasedAPI.hasMoreItems()).toBe(true);
        });

        test('should not be more items', () => {
            offsetBasedAPI.totalCount = 101;
            offsetBasedAPI.offset = 101;

            expect(offsetBasedAPI.hasMoreItems()).toBe(false);
        });
    });

    describe('get()', () => {
        const url = 'https://foo.bar';
        beforeEach(() => {
            offsetBasedAPI.successHandler = jest.fn((data, cb) => {
                cb(data);
            });
            offsetBasedAPI.errorHandler = jest.fn((error, cb) => {
                cb(error);
            });
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

        test('should increment offset by limit on each call', () => {
            const pagedVersionsResponse = {
                total_count: 200,
                entries: []
            };
            offsetBasedAPI.xhr = {
                get: jest.fn().mockReturnValue(
                    Promise.resolve({
                        data: pagedVersionsResponse
                    })
                )
            };

            const successCb = jest.fn();

            offsetBasedAPI.get('id');

            return offsetBasedAPI.get('id', successCb).then(() => {
                expect(successCb).toHaveBeenCalledWith(pagedVersionsResponse);
                expect(offsetBasedAPI.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url,
                    params: {
                        limit: LIMIT,
                        offset: LIMIT
                    }
                });
                expect(offsetBasedAPI.offset).toBe(LIMIT * 2);
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
