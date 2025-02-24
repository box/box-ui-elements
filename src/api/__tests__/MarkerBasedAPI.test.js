import MarkerBasedAPI from '../MarkerBasedAPI';

const LIMIT = 1000;

describe('api/MarkerBasedAPI', () => {
    let markerBasedAPI;
    const markerBasedAPIResponse = {
        next_marker: '',
        limit: LIMIT,
        entries: [],
    };
    const url = 'https://foo.bar';
    const errorCode = 'foo';

    beforeEach(() => {
        markerBasedAPI = new MarkerBasedAPI({});
        markerBasedAPI.errorCode = errorCode;
    });

    describe('hasMoreItems()', () => {
        test('should not be more items', () => {
            expect(markerBasedAPI.hasMoreItems(null)).toBe(false);
            expect(markerBasedAPI.hasMoreItems('')).toBe(false);
        });

        test('should be more items', () => {
            expect(markerBasedAPI.hasMoreItems('next_marker')).toBe(true);
        });
    });

    describe('markerGetRequest()', () => {
        beforeEach(() => {
            markerBasedAPI.getUrl = jest.fn(() => url);
            markerBasedAPI.successHandler = jest.fn();
            markerBasedAPI.errorHandler = jest.fn();
        });

        test('should do two xhr calls and call successHandler once', () => {
            markerBasedAPI.xhr = {
                get: jest
                    .fn()
                    .mockReturnValueOnce(
                        Promise.resolve({
                            data: {
                                next_marker: 'next_marker',
                                limit: LIMIT,
                                entries: [],
                            },
                        }),
                    )
                    .mockReturnValueOnce(
                        Promise.resolve({
                            data: markerBasedAPIResponse,
                        }),
                    ),
            };

            return markerBasedAPI.markerGetRequest('id', 'next_marker', LIMIT, true).then(() => {
                expect(markerBasedAPI.xhr.get).toHaveBeenCalledTimes(2);
                expect(markerBasedAPI.successHandler).toHaveBeenCalledTimes(1);
                expect(markerBasedAPI.errorHandler).not.toHaveBeenCalled();
            });
        });

        test('should do one xhr call and call successHandler once', () => {
            markerBasedAPI.xhr = {
                get: jest.fn().mockReturnValue(
                    Promise.resolve({
                        data: markerBasedAPIResponse,
                    }),
                ),
            };

            return markerBasedAPI.markerGetRequest('id', 'next_marker', LIMIT, true).then(() => {
                expect(markerBasedAPI.xhr.get).toHaveBeenCalledTimes(1);
                expect(markerBasedAPI.successHandler).toHaveBeenCalledTimes(1);
                expect(markerBasedAPI.errorHandler).not.toHaveBeenCalled();
            });
        });
    });

    describe('markerGet()', () => {
        const successCallback = jest.fn();
        const errorCallback = jest.fn();

        beforeEach(() => {
            markerBasedAPI.getUrl = jest.fn(() => url);
        });

        test('should not do anything if destroyed', () => {
            markerBasedAPI.isDestroyed = jest.fn().mockReturnValue(true);
            markerBasedAPI.xhr = null;

            return markerBasedAPI
                .markerGet({
                    id: 'id',
                    successCallback,
                    errorCallback,
                })
                .catch(() => {
                    expect(successCallback).not.toHaveBeenCalled();
                    expect(errorCallback).not.toHaveBeenCalled();
                });
        });

        test('should make xhr to get markerBasedAPI and call success callback', () => {
            const requestData = {
                foo: 'bar',
            };
            markerBasedAPI.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: markerBasedAPIResponse })),
            };
            markerBasedAPI.marker = '';

            return markerBasedAPI
                .markerGet({
                    id: 'id',
                    successCallback,
                    errorCallback,
                    marker: 'next_marker',
                    limit: LIMIT,
                    shouldFetchAll: true,
                    requestData,
                })
                .then(() => {
                    expect(successCallback).toHaveBeenCalledWith(markerBasedAPIResponse);
                    expect(successCallback).toHaveBeenCalledTimes(1);
                    expect(errorCallback).not.toHaveBeenCalled();
                    expect(markerBasedAPI.xhr.get).toHaveBeenCalledWith({
                        id: 'file_id',
                        url,
                        params: {
                            marker: 'next_marker',
                            limit: LIMIT,
                            ...requestData,
                        },
                    });
                });
        });

        test('should call error callback when xhr fails', () => {
            const error = new Error('error');
            markerBasedAPI.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.reject(error)),
            };

            return markerBasedAPI
                .markerGet({
                    id: 'id',
                    successCallback,
                    errorCallback,
                    marker: '',
                    limit: LIMIT,
                    shouldFetchAll: true,
                    errorCode,
                })
                .then(() => {
                    expect(successCallback).toHaveBeenCalledWith({ entries: [], limit: 1000, next_marker: '' });
                    expect(errorCallback).toHaveBeenCalledWith(error, errorCode);
                    expect(markerBasedAPI.xhr.get).toHaveBeenCalledWith({
                        id: 'file_id',
                        url,
                        params: {
                            marker: '',
                            limit: LIMIT,
                        },
                    });
                });
        });
    });
});
