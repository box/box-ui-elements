import File from '../File';
import Cache from '../../util/Cache';
import { getFieldsAsString } from '../../util/fields';
import { X_REP_HINTS } from '../../constants';

jest.mock('../../util/file', () => ({
    getTypedFileId: jest.fn().mockReturnValue('file_id')
}));

let file;
let cache;

describe('api/File', () => {
    beforeEach(() => {
        file = new File({});
        cache = new Cache();
    });

    describe('getCacheKey()', () => {
        test('should return correct key', () => {
            expect(file.getCacheKey('foo')).toBe('file_foo');
        });
    });

    describe('getUrl()', () => {
        test('should return correct file api url without id', () => {
            expect(file.getUrl()).toBe('https://api.box.com/2.0/files');
        });
        test('should return correct file api url with id', () => {
            expect(file.getUrl('foo')).toBe('https://api.box.com/2.0/files/foo');
        });
    });

    describe('getDownloadUrl()', () => {
        test('should make xhr to get download url and call success callback', () => {
            const success = jest.fn();
            const get = jest.fn().mockReturnValueOnce(Promise.resolve({ data: { download_url: 'bar' } }));
            file.xhr = { get };
            return file.getDownloadUrl('foo', success).then(() => {
                expect(success).toHaveBeenCalledWith('bar');
                expect(get).toHaveBeenCalledWith({
                    url: 'https://api.box.com/2.0/files/foo',
                    params: { fields: 'download_url' }
                });
            });
        });

        test('should make xhr to get download url and not call success callback if destroyed', () => {
            file.isDestroyed = jest.fn().mockReturnValueOnce(true);
            const success = jest.fn();
            const get = jest.fn().mockReturnValueOnce(Promise.resolve({ data: { download_url: 'bar' } }));
            file.xhr = { get };
            return file.getDownloadUrl('foo', success).then(() => {
                expect(success).not.toHaveBeenCalled();
                expect(get).toHaveBeenCalledWith({
                    url: 'https://api.box.com/2.0/files/foo',
                    params: { fields: 'download_url' }
                });
            });
        });

        test('should make xhr to get download url and call error callback', () => {
            const error = new Error('error');
            const successCb = jest.fn();
            const errorCb = jest.fn();
            const get = jest.fn().mockReturnValueOnce(Promise.reject(error));
            file.xhr = { get };
            return file.getDownloadUrl('foo', successCb, errorCb).then(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).toHaveBeenCalledWith(error);
                expect(get).toHaveBeenCalledWith({
                    url: 'https://api.box.com/2.0/files/foo',
                    params: { fields: 'download_url' }
                });
            });
        });

        test('should make xhr to get download url and not call error callback when destroyed', () => {
            file.isDestroyed = jest.fn().mockReturnValueOnce(true);
            const error = new Error('error');
            const successCb = jest.fn();
            const errorCb = jest.fn();
            const get = jest.fn().mockReturnValueOnce(Promise.reject(error));
            file.xhr = { get };
            return file.getDownloadUrl('foo', successCb, errorCb).then(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
                expect(get).toHaveBeenCalledWith({
                    url: 'https://api.box.com/2.0/files/foo',
                    params: { fields: 'download_url' }
                });
            });
        });
    });

    describe('setFileDescription()', () => {
        const success = jest.fn();
        const error = jest.fn();

        test('should fail if the file object is bad', () => {
            file.xhr = jest.fn();
            return file.setFileDescription({}, 'foo', success, error).catch(() => {
                expect(file.xhr).not.toHaveBeenCalled();
                expect(success).not.toHaveBeenCalled();
                expect(error).toHaveBeenCalled();
            });
        });

        test('should fail if we have insufficient permissions', () => {
            file.xhr = jest.fn();
            const mockFile = {
                id: '1',
                permissions: {
                    can_rename: false
                }
            };

            return file.setFileDescription(mockFile, 'foo', success, error).catch(() => {
                expect(file.xhr).not.toHaveBeenCalled();
                expect(success).not.toHaveBeenCalled();
                expect(error).toHaveBeenCalled();
            });
        });

        test('should make an xhr', () => {
            file.getUrl = jest.fn().mockReturnValue('url');
            file.merge = jest.fn();

            const mockFile = {
                id: '1',
                permissions: {
                    can_rename: true
                },
                description: 'foo'
            };
            file.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.resolve(mockFile))
            };

            return file.setFileDescription(mockFile, 'foo', success, error).then(() => {
                expect(file.xhr.put).toHaveBeenCalledWith({
                    id: 'file_id',
                    url: 'url',
                    data: {
                        description: 'foo'
                    }
                });
            });
        });

        test('should merge the new file description in and execute the success callback', () => {
            file.getCacheKey = jest.fn().mockReturnValue('key');
            file.merge = jest.fn();

            const mockFile = {
                id: '1',
                permissions: {
                    can_rename: true
                },
                description: 'foo'
            };

            const mockFileResponse = mockFile;
            mockFileResponse.description = 'fo';

            file.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.resolve({ data: mockFileResponse }))
            };

            return file.setFileDescription(mockFile, 'foo', success, error).then(() => {
                expect(file.xhr.put).toHaveBeenCalled();
                expect(file.merge).toHaveBeenCalledWith('key', 'description', 'fo');
                expect(error).not.toHaveBeenCalled();
            });
        });

        test('should not merge the new file description in and not execute the success callback when destroyed', () => {
            file.getCacheKey = jest.fn().mockReturnValue('key');
            file.merge = jest.fn();

            const mockFile = {
                id: '1',
                permissions: {
                    can_rename: true
                },
                description: 'foo'
            };

            const mockFileResponse = mockFile;
            mockFileResponse.description = 'fo';
            file.isDestroyed = jest.fn().mockReturnValueOnce(true);

            file.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.resolve({ data: mockFileResponse }))
            };

            return file.setFileDescription(mockFile, 'foo', success, error).then(() => {
                expect(file.xhr.put).toHaveBeenCalled();
                expect(file.merge).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();
            });
        });

        test('should not call the error callback on failure when destroyed', () => {
            file.isDestroyed = jest.fn().mockReturnValueOnce(true);
            file.merge = jest.fn();
            const mockFile = {
                id: '1',
                permissions: {
                    can_rename: true
                },
                description: 'foo'
            };
            const mockError = new Error();

            file.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.reject(mockError))
            };

            return file.setFileDescription(mockFile, 'bar', success, error).then(() => {
                expect(file.xhr.put).toHaveBeenCalled();
                expect(file.merge).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();
            });
        });

        test('should call the error callback on failure', () => {
            file.merge = jest.fn().mockReturnValueOnce('orig');
            const mockFile = {
                id: '1',
                permissions: {
                    can_rename: true
                },
                description: 'foo'
            };
            const mockError = new Error();

            file.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.reject(mockError))
            };

            return file.setFileDescription(mockFile, 'bar', success, error).then(() => {
                expect(file.xhr.put).toHaveBeenCalled();
                expect(file.merge).toHaveBeenCalledWith('file_1', 'description', 'foo');
                expect(error).toHaveBeenCalledWith(mockError, 'orig');
            });
        });
    });

    describe('file()', () => {
        test('should not do anything if destroyed', () => {
            file.isDestroyed = jest.fn().mockReturnValueOnce(true);
            file.getCache = jest.fn();
            file.getCacheKey = jest.fn();
            file.xhr = null;
            const success = jest.fn();
            const error = jest.fn();
            return file.getFile('id', success, error).catch(() => {
                expect(file.getCache).not.toHaveBeenCalled();
                expect(file.getCacheKey).not.toHaveBeenCalled();
                expect(success).not.toHaveBeenCalled();
                expect(error).not.toHaveBeenCalled();
            });
        });

        test('should return cached file', () => {
            cache.set('key', 'file');
            file.xhr = null;
            file.options = { cache };
            file.getCache = jest.fn().mockReturnValueOnce(cache);
            file.getCacheKey = jest.fn().mockReturnValueOnce('key');
            const success = jest.fn();
            return file.getFile('id', success).then(() => {
                expect(file.getCacheKey).toHaveBeenCalledWith('id');
                expect(success).toHaveBeenCalledWith('file');
            });
        });

        test('should make xhr to get file and call success callback', () => {
            file.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: 'new file' }))
            };

            const success = jest.fn();

            return file.getFile('id', success).then(() => {
                expect(success).toHaveBeenCalledWith('new file');
                expect(file.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url: 'https://api.box.com/2.0/files/id',
                    params: {
                        fields: getFieldsAsString(true)
                    },
                    headers: {
                        'X-Rep-Hints': X_REP_HINTS
                    }
                });
            });
        });

        test('should make xhr to get file and not call success callback when destroyed', () => {
            file.isDestroyed = jest
                .fn()
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true);
            file.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: { file: 'new file' } }))
            };

            const success = jest.fn();

            return file.getFile('id', success).then(() => {
                expect(success).not.toHaveBeenCalled();
                expect(file.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url: 'https://api.box.com/2.0/files/id',
                    params: {
                        fields: getFieldsAsString(true)
                    },
                    headers: {
                        'X-Rep-Hints': X_REP_HINTS
                    }
                });
            });
        });

        test('should call error callback when xhr fails', () => {
            const error = new Error('error');
            file.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.reject(error))
            };

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return file
                .getFile('id', successCb, errorCb, { forceFetch: false, includePreviewSidebarFields: true })
                .then(() => {
                    expect(successCb).not.toHaveBeenCalled();
                    expect(errorCb).toHaveBeenCalledWith(error);
                    expect(file.xhr.get).toHaveBeenCalledWith({
                        id: 'file_id',
                        url: 'https://api.box.com/2.0/files/id',
                        params: {
                            fields: getFieldsAsString(true, true)
                        },
                        headers: {
                            'X-Rep-Hints': X_REP_HINTS
                        }
                    });
                });
        });

        test('should make xhr to get file when forced to clear cache', () => {
            cache.set('key', 'file');
            file.options = { cache };
            file.getCache = jest.fn().mockReturnValueOnce(cache);
            file.getCacheKey = jest.fn().mockReturnValueOnce('key');
            file.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: 'new file' }))
            };

            const success = jest.fn();

            return file.getFile('id', success, 'error', { forceFetch: true }).then(() => {
                expect(file.getCacheKey).toHaveBeenCalledWith('id');
                expect(success).toHaveBeenCalledWith('new file');
                expect(file.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url: 'https://api.box.com/2.0/files/id',
                    params: {
                        fields: getFieldsAsString(true)
                    },
                    headers: {
                        'X-Rep-Hints': X_REP_HINTS
                    }
                });
            });
        });

        test('should make xhr to get file even with cached file when asked to update cache', () => {
            cache.set('key', 'file');
            file.options = { cache };
            file.getCache = jest.fn().mockReturnValueOnce(cache);
            file.getCacheKey = jest.fn().mockReturnValueOnce('key');
            file.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: 'new file' }))
            };

            const success = jest.fn();

            return file.getFile('id', success, 'error', { forceFetch: false, refreshCache: true }).then(() => {
                expect(file.getCacheKey).toHaveBeenCalledWith('id');
                expect(success).toHaveBeenCalledTimes(2);
                expect(success).toHaveBeenNthCalledWith(1, 'file');
                expect(success).toHaveBeenNthCalledWith(2, 'new file');
                expect(file.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url: 'https://api.box.com/2.0/files/id',
                    params: {
                        fields: getFieldsAsString(true)
                    },
                    headers: {
                        'X-Rep-Hints': X_REP_HINTS
                    }
                });
            });
        });
    });
});
