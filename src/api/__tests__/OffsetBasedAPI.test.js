import OffsetBasedAPI from '../OffsetBasedAPI';

const LIMIT = 1000;

describe('api/OffsetBasedAPI', () => {
    let offsetBasedAPI;
    const offsetBasedAPIResponse = { total_count: 0, entries: [] };
    const url = 'https://foo.bar';
    const errorCode = 'foo';

    beforeEach(() => {
        offsetBasedAPI = new OffsetBasedAPI({});
        offsetBasedAPI.errorCode = errorCode;
    });

    describe('getQueryParameters()', () => {
        test('should return query parameters with no fields', () => {
            expect(offsetBasedAPI.getQueryParameters(0, LIMIT)).toEqual({
                offset: 0,
                limit: LIMIT,
            });
        });

        test('should return query parameters with fields', () => {
            expect(offsetBasedAPI.getQueryParameters(0, LIMIT, ['foo', 'bar'])).toEqual({
                offset: 0,
                limit: LIMIT,
                fields: 'foo,bar',
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

    describe('offsetGetRequest()', () => {
        beforeEach(() => {
            offsetBasedAPI.getUrl = jest.fn(() => url);
            offsetBasedAPI.successHandler = jest.fn();
            offsetBasedAPI.errorHandler = jest.fn();
        });

        test('should do two xhr calls and call successHandler once', () => {
            offsetBasedAPI.xhr = {
                get: jest.fn().mockReturnValue(
                    Promise.resolve({
                        data: {
                            ...offsetBasedAPIResponse,
                            total_count: 1500,
                        },
                    }),
                ),
            };

            return offsetBasedAPI.offsetGetRequest('id', 0, 1000, true).then(() => {
                expect(offsetBasedAPI.xhr.get).toHaveBeenCalledTimes(2);
                expect(offsetBasedAPI.successHandler).toHaveBeenCalledTimes(1);
                expect(offsetBasedAPI.errorHandler).not.toHaveBeenCalled();
            });
        });

        test('should do one xhr call and call successHandler once', () => {
            offsetBasedAPI.xhr = {
                get: jest.fn().mockReturnValue(
                    Promise.resolve({
                        data: offsetBasedAPIResponse,
                    }),
                ),
            };

            return offsetBasedAPI.offsetGetRequest('id', 0, 1000, true).then(() => {
                expect(offsetBasedAPI.xhr.get).toHaveBeenCalledTimes(1);
                expect(offsetBasedAPI.successHandler).toHaveBeenCalledTimes(1);
                expect(offsetBasedAPI.errorHandler).not.toHaveBeenCalled();
            });
        });
    });

    describe('offsetGet()', () => {
        const successCb = jest.fn();
        const errorCb = jest.fn();

        beforeEach(() => {
            offsetBasedAPI.getUrl = jest.fn(() => url);
        });

        test('should not do anything if destroyed', () => {
            offsetBasedAPI.isDestroyed = jest.fn().mockReturnValueOnce(true);
            offsetBasedAPI.xhr = null;

            return offsetBasedAPI.offsetGet('id', successCb, errorCb).catch(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        test('should make xhr to get offsetBasedAPI and call success callback', () => {
            offsetBasedAPI.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: offsetBasedAPIResponse })),
            };

            return offsetBasedAPI.offsetGet('id', successCb, errorCb).then(() => {
                expect(successCb).toHaveBeenCalledWith(offsetBasedAPIResponse);
                expect(successCb).toHaveBeenCalledTimes(1);
                expect(offsetBasedAPI.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url,
                    params: {
                        offset: 0,
                        limit: LIMIT,
                    },
                });
            });
        });

        test('should immediately reject if offset >= total_count', () => {
            const pagedCommentsResponse = {
                total_count: 50,
                entries: [],
            };
            offsetBasedAPI.xhr = {
                get: jest.fn().mockReturnValue(
                    Promise.resolve({
                        data: pagedCommentsResponse,
                    }),
                ),
            };

            return offsetBasedAPI.offsetGet('id', successCb, errorCb, 50).catch(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
                expect(offsetBasedAPI.xhr.get).not.toHaveBeenCalled();
            });
        });

        test('should call error callback when xhr fails', () => {
            const error = new Error('error');
            offsetBasedAPI.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.reject(error)),
            };

            return offsetBasedAPI.offsetGet('id', successCb, errorCb).then(() => {
                expect(successCb).toHaveBeenCalledWith({ entries: [], total_count: 0 });
                expect(errorCb).toHaveBeenCalledWith(error, errorCode);
                expect(offsetBasedAPI.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url,
                    params: {
                        offset: 0,
                        limit: LIMIT,
                    },
                });
            });
        });
    });
});
