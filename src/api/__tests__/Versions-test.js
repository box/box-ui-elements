import Versions from '../Versions';

let versions;
const versionsResponse = { total_count: 0, entries: [] };

describe('api/Versions', () => {
    beforeEach(() => {
        versions = new Versions({});
    });

    describe('getUrl()', () => {
        test('should throw when version api url without id', () => {
            expect(() => {
                versions.getUrl();
            }).toThrow();
        });
        test('should return correct version api url with id', () => {
            expect(versions.getUrl('foo')).toBe('https://api.box.com/2.0/files/foo/versions');
        });
    });

    describe('versions()', () => {
        test('should not do anything if destroyed', () => {
            versions.isDestroyed = jest.fn().mockReturnValueOnce(true);
            versions.xhr = null;

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return versions.versions('id', successCb, errorCb).catch(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        test('should make xhr to get versions and call success callback', () => {
            versions.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: versionsResponse }))
            };

            const successCb = jest.fn();

            return versions.versions('id', successCb).then(() => {
                expect(successCb).toHaveBeenCalledWith(versionsResponse);
                expect(versions.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url: 'https://api.box.com/2.0/files/id/versions',
                    params: {
                        limit: 100,
                        offset: 0
                    }
                });
            });
        });

        test('should increment offset by limit on each call', () => {
            const pagedVersionsResponse = {
                total_count: 200,
                entries: []
            };
            versions.xhr = {
                get: jest.fn().mockReturnValue(
                    Promise.resolve({
                        data: pagedVersionsResponse
                    })
                )
            };

            const successCb = jest.fn();

            versions.versions('id');

            return versions.versions('id', successCb).then(() => {
                expect(successCb).toHaveBeenCalledWith(pagedVersionsResponse);
                expect(versions.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url: 'https://api.box.com/2.0/files/id/versions',
                    params: {
                        limit: 100,
                        offset: 100
                    }
                });
                expect(versions.offset).toBe(200);
            });
        });

        test('should immediately reject if offset >= total_count', () => {
            const pagedCommentsResponse = {
                total_count: 50,
                entries: []
            };
            versions.xhr = {
                get: jest.fn().mockReturnValue(
                    Promise.resolve({
                        data: pagedCommentsResponse
                    })
                )
            };

            const successCb = jest.fn();
            const errorCb = jest.fn();

            versions.totalCount = 50;
            versions.offset = 50;

            return versions.versions('id', successCb, errorCb).catch(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
                expect(versions.xhr.get).not.toHaveBeenCalled();
            });
        });

        test('should call error callback when xhr fails', () => {
            const error = new Error('error');
            versions.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.reject(error))
            };

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return versions.versions('id', successCb, errorCb).then(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).toHaveBeenCalledWith(error);
                expect(versions.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url: 'https://api.box.com/2.0/files/id/versions',
                    params: {
                        limit: 100,
                        offset: 0
                    }
                });
            });
        });
    });
});
