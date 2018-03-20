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

    describe('file()', () => {
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
                    url: 'https://api.box.com/2.0/files/id/versions'
                });
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
                    url: 'https://api.box.com/2.0/files/id/versions'
                });
            });
        });
    });
});
