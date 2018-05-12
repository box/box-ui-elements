import MarkerBasedAPI from '../MarkerBasedAPI';

const LIMIT = 1000;

describe('api/MarkerBasedAPI', () => {
    let markerBasedAPI;
    const markerBasedAPIResponse = { next_marker: '', limit: LIMIT, entries: [] };
    const url = 'https://foo.bar';

    beforeEach(() => {
        markerBasedAPI = new MarkerBasedAPI({});
    });

    describe('hasMoreItems()', () => {
        test('should not be more items', () => {
            markerBasedAPI.marker = null;
            expect(markerBasedAPI.hasMoreItems()).toBe(false);

            markerBasedAPI.marker = '';
            expect(markerBasedAPI.hasMoreItems()).toBe(false);
        });

        test('should be more items', () => {
            markerBasedAPI.marker = 'next_marker';
            expect(markerBasedAPI.hasMoreItems()).toBe(true);
        });
    });

    describe('markerGetRequest()', () => {
        beforeEach(() => {
            markerBasedAPI.getUrl = jest.fn(() => url);
            markerBasedAPI.marker = 'next_marker';
            markerBasedAPI.limit = 1000;
            markerBasedAPI.successHandler = jest.fn();
            markerBasedAPI.errorHandler = jest.fn();
            markerBasedAPI.shouldFetchAll = true;
        });

        test('should do two xhr calls and call successHandler once', () => {
            markerBasedAPI.xhr = {
                get: jest
                    .fn()
                    .mockReturnValueOnce(
                        Promise.resolve({
                            data: { next_marker: 'next_marker', limit: LIMIT, entries: [] }
                        })
                    )
                    .mockReturnValueOnce(
                        Promise.resolve({
                            data: markerBasedAPIResponse
                        })
                    )
            };

            return markerBasedAPI.markerGetRequest().then(() => {
                expect(markerBasedAPI.xhr.get).toHaveBeenCalledTimes(2);
                expect(markerBasedAPI.successHandler).toHaveBeenCalledTimes(1);
                expect(markerBasedAPI.errorHandler).not.toHaveBeenCalled();
            });
        });

        test('should do one xhr call and call successHandler once', () => {
            markerBasedAPI.xhr = {
                get: jest.fn().mockReturnValue(
                    Promise.resolve({
                        data: markerBasedAPIResponse
                    })
                )
            };

            return markerBasedAPI.markerGetRequest().then(() => {
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
            markerBasedAPI.isDestroyed = jest.fn().mockReturnValueOnce(true);
            markerBasedAPI.xhr = null;

            return markerBasedAPI
                .markerGet({
                    id: 'id',
                    successCallback,
                    errorCallback
                })
                .catch(() => {
                    expect(successCallback).not.toHaveBeenCalled();
                    expect(errorCallback).not.toHaveBeenCalled();
                });
        });

        test('should make xhr to get markerBasedAPI and call success callback', () => {
            markerBasedAPI.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: markerBasedAPIResponse }))
            };
            markerBasedAPI.marker = '';

            return markerBasedAPI
                .markerGet({
                    id: 'id',
                    successCallback,
                    errorCallback,
                    marker: 'next_marker'
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
                            limit: LIMIT
                        }
                    });
                });
        });

        test('should call error callback when xhr fails', () => {
            const error = new Error('error');
            markerBasedAPI.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.reject(error))
            };

            return markerBasedAPI
                .markerGet({
                    id: 'id',
                    successCallback,
                    errorCallback,
                    marker: ''
                })
                .then(() => {
                    expect(successCallback).not.toHaveBeenCalled();
                    expect(errorCallback).toHaveBeenCalledWith(error);
                    expect(markerBasedAPI.xhr.get).toHaveBeenCalledWith({
                        id: 'file_id',
                        url,
                        params: {
                            marker: '',
                            limit: LIMIT
                        }
                    });
                });
        });
    });
});
