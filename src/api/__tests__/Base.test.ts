import Xhr from '../../utils/Xhr';
import Cache from '../../utils/Cache';
import { getBadItemError, getBadPermissionsError } from '../../utils/error';
import Base from '../Base';
import { HTTP_GET, HTTP_POST, HTTP_PUT } from '../../constants';

type BaseError = Parameters<Base['errorHandler']>[0];

let base: Base;

describe('api/Base', () => {
    const baseResponse = { total_count: 0, entries: [] };
    const errorCode = 'foo';

    beforeEach(() => {
        base = new Base({});
        base.errorCode = errorCode;
    });

    test('should have correct defaults on construct', () => {
        expect(base.options.apiHost).toBe('https://api.box.com');
        expect(base.options.uploadHost).toBe('https://upload.box.com');
        expect(base.cache).toBeInstanceOf(Cache);
        expect(base.apiHost).toBe('https://api.box.com');
        expect(base.uploadHost).toBe('https://upload.box.com');
        expect(base.xhr).toBeInstanceOf(Xhr);
        expect(base.destroyed).toBeFalsy();
    });

    test('should have correct values on construct', () => {
        const options = {
            cache: 'cache',
            apiHost: 'apiHost',
            uploadHost: 'uploadHost',
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
        beforeEach(() => {
            base.xhr = { abort: jest.fn() } as unknown as Xhr;
        });

        test('should return false when no destroyed', () => {
            expect(base.isDestroyed()).toBeFalsy();
            expect(base.xhr.abort).not.toHaveBeenCalled();
        });
        test('should return true when destroyed', () => {
            base.destroy();
            expect(base.isDestroyed()).toBeTruthy();
            expect(base.xhr.abort).toHaveBeenCalled();
        });
    });

    describe('checkApiCallValidity()', () => {
        const badItemError = getBadItemError();
        const permissionsError = getBadPermissionsError();

        test('should throw a bad item error for a missing file ID or permissions object', () => {
            expect(() => base.checkApiCallValidity('can_edit', undefined, 'id')).toThrow(badItemError.message);
            expect(() => base.checkApiCallValidity('can_edit', { can_edit: false }, null)).toThrow(
                badItemError.message,
            );
        });

        test('should throw a bad permissions error if the given permission is missing or false', () => {
            expect(() => base.checkApiCallValidity('can_edit', {}, 'id')).toThrow(permissionsError.message);
            expect(() => base.checkApiCallValidity('can_edit', { can_edit: false }, 'id')).toThrow(
                permissionsError.message,
            );
        });
    });

    describe('getBaseApiUrl()', () => {
        test('should return correct api url', () => {
            base = new Base({
                apiHost: 'apiHost',
            });
            expect(base.getBaseApiUrl()).toBe('apiHost/2.0');
        });
        test('should return correct api url with trailing /', () => {
            base = new Base({
                apiHost: 'apiHost/',
            });
            expect(base.getBaseApiUrl()).toBe('apiHost/2.0');
        });
    });

    describe('getBaseUploadUrl()', () => {
        test('should return correct api upload url', () => {
            base = new Base({
                uploadHost: 'uploadHost',
            });
            expect(base.getBaseUploadUrl()).toBe('uploadHost/api/2.0');
        });
        test('should return correct api upload url with trailing /', () => {
            base = new Base({
                uploadHost: 'uploadHost/',
            });
            expect(base.getBaseUploadUrl()).toBe('uploadHost/api/2.0');
        });
    });

    describe('getCache()', () => {
        test('should return correct cache', () => {
            base.cache = 'foo' as unknown as Cache;
            expect(base.getCache()).toBe('foo');
        });
    });

    describe('errorCallback()', () => {
        beforeEach(() => {
            base.errorCallback = jest.fn();
            base.isDestroyed = jest.fn().mockReturnValue(false);
            base.errorCode = '1';
        });

        test('should do nothing if destroyed', () => {
            base.isDestroyed = jest.fn().mockReturnValueOnce(true);
            base.errorHandler(new Error() as BaseError);
            expect(base.errorCallback).not.toBeCalled();
        });
        test('should call the error callback with the response data if present', () => {
            base.errorCallback = jest.fn();
            const error = {
                response: {
                    data: 'foo',
                },
            };

            base.errorHandler(error as unknown as BaseError);
            expect(base.errorCallback).toBeCalledWith('foo', '1');
        });
        test('should call the error callback with the whole error if the response data is not present', () => {
            base.errorCallback = jest.fn();
            const error = {
                customStuff: {
                    data: 'foo',
                },
            };

            base.errorHandler(error as unknown as BaseError);
            expect(base.errorCallback).toBeCalledWith(error, '1');
        });
    });

    describe('get()', () => {
        test('should make a correct GET request', () => {
            const id = 'id';
            const url = 'https://www.foo.com';
            const successCallback = jest.fn();
            const errorCallback = jest.fn();
            const requestData = {
                fields: 'start=0',
            };
            base.makeRequest = jest.fn();
            base.getUrl = jest.fn(() => url);

            base.get({ id, successCallback, errorCallback, requestData });
            expect(base.makeRequest).toHaveBeenCalledWith(
                HTTP_GET,
                id,
                url,
                successCallback,
                errorCallback,
                requestData,
            );
        });
    });

    describe('makeRequest()', () => {
        const url = 'https://foo.bar';
        test('should not do anything if destroyed', async () => {
            base.isDestroyed = jest.fn().mockReturnValueOnce(true);
            base.xhr = null;

            const successCb = jest.fn();
            const errorCb = jest.fn();

            await base.makeRequest(HTTP_GET, 'id', url, successCb, errorCb);

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).not.toHaveBeenCalled();
        });

        test('should make xhr to get base and call success callback', () => {
            base.xhr = {
                post: jest.fn().mockReturnValueOnce(Promise.resolve({ data: baseResponse })),
            } as unknown as Xhr;

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return base.makeRequest(HTTP_POST, 'id', url, successCb, errorCb).then(() => {
                expect(successCb).toHaveBeenCalledWith(baseResponse);
                expect(base.xhr.post).toHaveBeenCalledWith({
                    id: 'file_id',
                    url,
                });
            });
        });

        test('should call error callback when xhr fails', () => {
            const error = new Error('error');
            base.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.reject(error)),
            } as unknown as Xhr;

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return base.makeRequest(HTTP_PUT, 'id', url, successCb, errorCb).then(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).toHaveBeenCalledWith(error, errorCode);
                expect(base.xhr.put).toHaveBeenCalledWith({
                    id: 'file_id',
                    url,
                });
            });
        });

        test('should pass along request data', () => {
            const requestData = {
                data: {
                    item: {
                        id: 'id',
                        type: 'file',
                    },
                    message: 'hello world',
                },
            };
            base.xhr = {
                post: jest.fn().mockReturnValueOnce(Promise.resolve({ data: baseResponse })),
            } as unknown as Xhr;

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return base.makeRequest(HTTP_POST, 'id', url, successCb, errorCb, requestData).then(() => {
                expect(successCb).toHaveBeenCalledWith(baseResponse);
                expect(base.xhr.post).toHaveBeenCalledWith({
                    id: 'file_id',
                    url,
                    data: requestData.data,
                });
            });
        });
    });
});
