import Base from '../Base';
import Xhr from '../../util/Xhr';
import Cache from '../../util/Cache';

let base;

describe('api/Base', () => {
    const baseResponse = { total_count: 0, entries: [] };

    beforeEach(() => {
        base = new Base({});
    });

    test('should should have correct defaults on construct', () => {
        expect(base.options.apiHost).toBe('https://api.box.com');
        expect(base.options.uploadHost).toBe('https://upload.box.com');
        expect(base.cache).toBeInstanceOf(Cache);
        expect(base.apiHost).toBe('https://api.box.com');
        expect(base.uploadHost).toBe('https://upload.box.com');
        expect(base.xhr).toBeInstanceOf(Xhr);
        expect(base.destroyed).toBeFalsy();
    });

    test('should should have correct values on construct', () => {
        const options = {
            cache: 'cache',
            apiHost: 'apiHost',
            uploadHost: 'uploadHost'
        };
        base = new Base(options);
        expect(base.options).toEqual(options);
        expect(base.cache).toBe('cache');
        expect(base.apiHost).toBe('apiHost');
        expect(base.uploadHost).toBe('uploadHost');
        expect(base.xhr).toBeInstanceOf(Xhr);
        expect(base.destroyed).toBeFalsy();
    });

    describe('destroy()', () => {
        test('should return false when no destroyed', () => {
            expect(base.isDestroyed()).toBeFalsy();
        });
        test('should return true when destroyed', () => {
            base.destroy();
            expect(base.isDestroyed()).toBeTruthy();
        });
    });

    describe('getBaseApiUrl()', () => {
        test('should return correct api url', () => {
            base = new Base({
                apiHost: 'apiHost'
            });
            expect(base.getBaseApiUrl()).toBe('apiHost/2.0');
        });
        test('should return correct api url with trailing /', () => {
            base = new Base({
                apiHost: 'apiHost/'
            });
            expect(base.getBaseApiUrl()).toBe('apiHost/2.0');
        });
    });

    describe('getBaseUploadUrl()', () => {
        test('should return correct api upload url', () => {
            base = new Base({
                uploadHost: 'uploadHost'
            });
            expect(base.getBaseUploadUrl()).toBe('uploadHost/api/2.0');
        });
        test('should return correct api upload url with trailing /', () => {
            base = new Base({
                uploadHost: 'uploadHost/'
            });
            expect(base.getBaseUploadUrl()).toBe('uploadHost/api/2.0');
        });
    });

    describe('getCache()', () => {
        test('should return correct cache', () => {
            base.cache = 'foo';
            expect(base.getCache()).toBe('foo');
        });
    });

    describe('get()', () => {
        const url = 'https://foo.bar';
        beforeEach(() => {
            base.successHandler = jest.fn((data, cb) => {
                cb(data);
            });

            base.getUrl = jest.fn(() => url);
        });

        test('should not do anything if destroyed', () => {
            base.isDestroyed = jest.fn().mockReturnValueOnce(true);
            base.xhr = null;

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return base.get('id', successCb, errorCb).catch(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        test('should make xhr to get base and call success callback', () => {
            base.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: baseResponse }))
            };

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return base.get('id', successCb, errorCb).then(() => {
                expect(successCb).toHaveBeenCalledWith(baseResponse);
                expect(base.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url
                });
            });
        });

        test('should immediately reject if offset >= total_count', () => {
            const pagedCommentsResponse = {
                total_count: 50,
                entries: []
            };
            base.xhr = {
                get: jest.fn().mockReturnValue(
                    Promise.resolve({
                        data: pagedCommentsResponse
                    })
                )
            };

            const successCb = jest.fn();
            const errorCb = jest.fn();

            base.totalCount = 50;
            base.offset = 50;

            return base.get('id', successCb, errorCb).catch(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
                expect(base.xhr.get).not.toHaveBeenCalled();
            });
        });

        test('should call error callback when xhr fails', () => {
            const error = new Error('error');
            base.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.reject(error))
            };

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return base.get('id', successCb, errorCb).then(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).toHaveBeenCalledWith(error);
                expect(base.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url
                });
            });
        });
    });
});
