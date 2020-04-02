import cloneDeep from 'lodash/cloneDeep';
import Cache from '../../utils/Cache';
import * as fields from '../../utils/fields';
import * as utils from '../../utils/function';
import File from '../File';
import TokenService from '../../utils/TokenService';
import { X_REP_HINTS, ERROR_CODE_FETCH_FILE, ERROR_CODE_GET_DOWNLOAD_URL, FIELD_EXTENSION } from '../../constants';

jest.mock('../../utils/file', () => ({
    getTypedFileId: jest.fn().mockReturnValue('file_id'),
}));

const TOKEN = 'token';
let file;
let cache;

describe('api/File', () => {
    beforeEach(() => {
        file = new File({
            token: TOKEN,
        });
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
        const ERROR = 'Download is missing required fields or token.';

        test('should return a download url for a file', () => {
            const downloadUrl = 'https://api.box.com/2.0/files/foo/content';
            const downloadFile = {
                authenticated_download_url: downloadUrl,
                id: 'foo',
                is_download_available: true,
            };
            const success = jest.fn();

            return file.getDownloadUrl('foo', downloadFile, success).then(() => {
                expect(success).toHaveBeenCalledWith(`${downloadUrl}?access_token=${TOKEN}`);
            });
        });

        test('should return a download url for a file version', () => {
            const downloadVersion = {
                authenticated_download_url: 'https://api.box.com/2.0/files/foo/content?version=bar',
                id: 'bar',
                is_download_available: true,
            };
            const success = jest.fn();

            return file.getDownloadUrl('foo', downloadVersion, success).then(() => {
                expect(success).toHaveBeenCalledWith(
                    `https://api.box.com/2.0/files/foo/content?access_token=${TOKEN}&version=bar`,
                );
            });
        });

        test('should return an error if authenticatd_download_url is missing', () => {
            const downloadFile = {
                id: 'foo',
                is_download_available: true,
            };
            const error = jest.fn();
            const success = jest.fn();

            return file.getDownloadUrl('foo', downloadFile, success, error).catch(() => {
                expect(success).not.toHaveBeenCalled();
                expect(error).toHaveBeenCalledWith(new Error(ERROR), ERROR_CODE_GET_DOWNLOAD_URL);
            });
        });

        test('should return an error if is_download_available is false', () => {
            const downloadFile = {
                id: 'foo',
                is_download_available: false,
            };
            const error = jest.fn();
            const success = jest.fn();

            return file.getDownloadUrl('foo', downloadFile, success, error).catch(() => {
                expect(success).not.toHaveBeenCalled();
                expect(error).toHaveBeenCalledWith(new Error(ERROR), ERROR_CODE_GET_DOWNLOAD_URL);
            });
        });
    });

    describe('generateRepresentation()', () => {
        const representation = { info: { url: 'info.url' } };

        test('should return given representation if info.url is not defined', () => {
            const badRepresentation = { representation: 'representation' };

            file.xhr = {
                get: jest.fn(),
            };

            utils.retryNumOfTimes = jest.fn();

            return file.generateRepresentation(badRepresentation).then(result => {
                expect(file.xhr.get).not.toHaveBeenCalled();
                expect(result).toBe(badRepresentation);
            });
        });

        test('should throw from get if initial xhr request is rejected', () => {
            file.xhr = {
                get: jest.fn().mockRejectedValue(new Error()),
            };

            utils.retryNumOfTimes = jest.fn();

            return file.generateRepresentation(representation).catch(() => {
                expect(file.xhr.get).toThrow();
                expect(utils.retryNumOfTimes).not.toHaveBeenCalled();
            });
        });

        test('should throw from retryNumOfTimes if xhr successful but retryNumOfTimes unsuccessful throws error', () => {
            file.xhr = {
                get: jest.fn().mockResolvedValue('data'),
            };

            utils.retryNumOfTimes = jest.fn().mockImplementation(() => {
                throw new Error();
            });

            return file.generateRepresentation(representation).catch(() => {
                expect(utils.retryNumOfTimes).toThrow();
            });
        });

        test('should return updated representation if successful', () => {
            const updatedRepresentation = 'updatedRepresentation';
            file.xhr = {
                get: jest.fn().mockResolvedValue('data'),
            };

            utils.retryNumOfTimes = jest.fn().mockReturnValue(updatedRepresentation);

            return file.generateRepresentation(representation).then(result => {
                expect(utils.retryNumOfTimes).toHaveBeenCalled();
                expect(result).toBe(updatedRepresentation);
            });
        });
    });

    describe('getThumbnailUrl()', () => {
        const baseUrl = 'baseUrl';
        const url_template = `${baseUrl}/{+asset_path}`;
        const representation = 'jpg';

        const baseItem = {
            representations: {
                entries: [
                    {
                        representation,
                        status: { state: 'success' },
                        content: {
                            url_template,
                        },
                    },
                ],
            },
        };

        let item;
        beforeEach(() => {
            item = cloneDeep(baseItem);
        });

        test('should return thumbnail url for item with jpg representation', () => {
            TokenService.getReadToken = jest.fn().mockReturnValueOnce(TOKEN);
            return file
                .getThumbnailUrl(item)
                .then(thumbnailUrl => expect(thumbnailUrl).toBe(`${baseUrl}/?access_token=${TOKEN}`));
        });

        test('should return thumbnail url for item with png representation', () => {
            TokenService.getReadToken = jest.fn().mockReturnValueOnce(TOKEN);
            item.representations.entries[0].representation = 'png';
            return file
                .getThumbnailUrl(item)
                .then(thumbnailUrl => expect(thumbnailUrl).toBe(`${baseUrl}/1.png?access_token=${TOKEN}`));
        });

        test('should return null if item has no representations field', () => {
            item.representations = undefined;
            return file.getThumbnailUrl(item).then(thumbnailUrl => expect(thumbnailUrl).toBe(null));
        });

        test('should return null if item has no entries', () => {
            item.representations.entries = [];
            return file.getThumbnailUrl(item).then(thumbnailUrl => expect(thumbnailUrl).toBe(null));
        });

        test('should return null if TokenService returns null', () => {
            TokenService.getReadToken = jest.fn().mockReturnValueOnce(null);
            return file.getThumbnailUrl(item).then(thumbnailUrl => expect(thumbnailUrl).toBe(null));
        });

        test('should return null if response status is not success', () => {
            item.representations.entries[0].status.state = 'failure';
            return file.getThumbnailUrl(item).then(thumbnailUrl => expect(thumbnailUrl).toBe(null));
        });

        test('should return null if no representation in reponse', () => {
            item.representations.entries[0].representation = undefined;
            return file.getThumbnailUrl(item).then(thumbnailUrl => expect(thumbnailUrl).toBe(null));
        });

        test('should return null if no template in response', () => {
            item.representations.entries[0].content.url_template = undefined;
            return file.getThumbnailUrl(item).then(thumbnailUrl => expect(thumbnailUrl).toBe(null));
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
                    can_rename: false,
                },
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
                    can_rename: true,
                },
                description: 'foo',
            };
            file.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.resolve(mockFile)),
            };

            return file.setFileDescription(mockFile, 'foo', success, error).then(() => {
                expect(file.xhr.put).toHaveBeenCalledWith({
                    id: 'file_id',
                    url: 'url',
                    data: {
                        description: 'foo',
                    },
                });
            });
        });

        test('should merge the new file description in and execute the success callback', () => {
            file.getCacheKey = jest.fn().mockReturnValue('key');
            file.merge = jest.fn();

            const mockFile = {
                id: '1',
                permissions: {
                    can_rename: true,
                },
                description: 'foo',
            };

            const mockFileResponse = mockFile;
            mockFileResponse.description = 'fo';

            file.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.resolve({ data: mockFileResponse })),
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
                    can_rename: true,
                },
                description: 'foo',
            };

            const mockFileResponse = mockFile;
            mockFileResponse.description = 'fo';
            file.isDestroyed = jest.fn().mockReturnValueOnce(true);

            file.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.resolve({ data: mockFileResponse })),
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
                    can_rename: true,
                },
                description: 'foo',
            };
            const mockError = new Error();

            file.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.reject(mockError)),
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
                    can_rename: true,
                },
                description: 'foo',
            };
            const mockError = new Error();

            file.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.reject(mockError)),
            };

            return file.setFileDescription(mockFile, 'bar', success, error).then(() => {
                expect(file.xhr.put).toHaveBeenCalled();
                expect(file.merge).toHaveBeenCalledWith('file_1', 'description', 'foo');
                expect(error).toHaveBeenCalledWith('orig');
            });
        });
    });

    describe('getFile()', () => {
        test('should not do anything if destroyed', async () => {
            file.isDestroyed = jest.fn().mockReturnValueOnce(true);
            file.getCache = jest.fn();
            file.getCacheKey = jest.fn();
            file.xhr = null;
            const success = jest.fn();
            const error = jest.fn();
            await file.getFile('id', success, error);
            expect(file.getCache).not.toHaveBeenCalled();
            expect(file.getCacheKey).not.toHaveBeenCalled();
            expect(success).not.toHaveBeenCalled();
            expect(error).not.toHaveBeenCalled();
        });

        test('should return cached file', async () => {
            cache.set('key', 'file');
            file.xhr = null;
            file.options = { cache };
            file.getCache = jest.fn().mockReturnValueOnce(cache);
            file.getCacheKey = jest.fn().mockReturnValueOnce('key');
            fields.findMissingProperties = jest.fn().mockReturnValueOnce([]);
            const success = jest.fn();
            await file.getFile('id', success);
            expect(file.getCacheKey).toHaveBeenCalledWith('id');
            expect(success).toHaveBeenCalledWith('file');
            expect(fields.findMissingProperties).toHaveBeenCalledWith('file', undefined);
        });

        test('should make xhr to get file when cached if missing fields', async () => {
            cache.set('key', { id: '123' });
            file.options = { cache };
            file.getCache = jest.fn().mockReturnValueOnce(cache);
            file.getCacheKey = jest.fn().mockReturnValueOnce('key');
            fields.findMissingProperties = jest.fn().mockReturnValueOnce(['missing1', 'missing2']);
            fields.fillMissingProperties = jest.fn().mockReturnValueOnce({ id: '123', foo: 'bar', missing: null });
            file.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: { foo: 'bar' } })),
            };

            const success = jest.fn();
            await file.getFile('id', success);
            expect(success).toHaveBeenCalledWith({
                id: '123',
                foo: 'bar',
                missing: null,
            });
            expect(fields.findMissingProperties).toHaveBeenCalledWith({ id: '123' }, undefined);
            expect(fields.fillMissingProperties).toHaveBeenCalledWith({ foo: 'bar' }, ['missing1', 'missing2']);
            expect(file.xhr.get).toHaveBeenCalledWith({
                id: 'file_id',
                url: 'https://api.box.com/2.0/files/id',
                params: {
                    fields: 'missing1,missing2',
                },
                headers: {
                    'X-Rep-Hints': X_REP_HINTS,
                },
            });
        });

        test('should make xhr to get file and call success callback when missing fields', async () => {
            file.options = { cache };
            file.getCache = jest.fn().mockReturnValueOnce(cache);
            file.getCacheKey = jest.fn().mockReturnValueOnce('key');
            fields.findMissingProperties = jest.fn().mockReturnValueOnce(['missing1', 'missing2']);
            fields.fillMissingProperties = jest.fn().mockReturnValueOnce('new file');
            file.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: 'new file' })),
            };

            const success = jest.fn();
            await file.getFile('id', success);
            expect(success).toHaveBeenCalledWith('new file');
            expect(fields.findMissingProperties).toHaveBeenCalledWith({ id: 'id' }, undefined);
            expect(fields.fillMissingProperties).toHaveBeenCalledWith('new file', ['missing1', 'missing2']);
            expect(file.xhr.get).toHaveBeenCalledWith({
                id: 'file_id',
                url: 'https://api.box.com/2.0/files/id',
                params: {
                    fields: 'missing1,missing2',
                },
                headers: {
                    'X-Rep-Hints': X_REP_HINTS,
                },
            });
        });

        test('should make xhr to get file and not call success callback when destroyed', async () => {
            fields.findMissingProperties = jest.fn().mockReturnValueOnce([]);
            file.isDestroyed = jest
                .fn()
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true);
            file.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: { file: 'new file' } })),
            };

            const success = jest.fn();

            await file.getFile('id', success);
            expect(success).not.toHaveBeenCalled();
            expect(file.xhr.get).toHaveBeenCalledWith({
                id: 'file_id',
                url: 'https://api.box.com/2.0/files/id',
                headers: {
                    'X-Rep-Hints': X_REP_HINTS,
                },
            });
        });

        test('should call error callback when xhr fails', async () => {
            const error = new Error('error');
            fields.findMissingProperties = jest.fn().mockReturnValueOnce([]);
            file.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.reject(error)),
            };

            const successCb = jest.fn();
            const errorCb = jest.fn();

            await file.getFile('id', successCb, errorCb, {
                forceFetch: false,
                includePreviewSidebarFields: true,
            });

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalledWith(error, ERROR_CODE_FETCH_FILE);
            expect(file.xhr.get).toHaveBeenCalledWith({
                id: 'file_id',
                url: 'https://api.box.com/2.0/files/id',
                headers: {
                    'X-Rep-Hints': X_REP_HINTS,
                },
            });
        });

        test('should make xhr to get file when forced to clear cache', async () => {
            cache.set('key', { id: '123' });
            fields.findMissingProperties = jest.fn().mockReturnValueOnce([]);
            fields.fillMissingProperties = jest.fn().mockReturnValueOnce({ id: '123', foo: 'bar' });
            file.options = { cache };
            file.getCache = jest.fn().mockReturnValueOnce(cache);
            file.getCacheKey = jest.fn().mockReturnValueOnce('key');
            file.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: { foo: 'bar' } })),
            };

            const success = jest.fn();

            await file.getFile('id', success, 'error', { forceFetch: true });
            expect(file.getCacheKey).toHaveBeenCalledWith('id');
            expect(success).toHaveBeenCalledWith({ id: '123', foo: 'bar' });
            expect(fields.findMissingProperties).toHaveBeenCalledWith({ id: 'id' }, undefined);
            expect(fields.fillMissingProperties).toHaveBeenCalledWith({ foo: 'bar' }, []);
            expect(file.xhr.get).toHaveBeenCalledWith({
                id: 'file_id',
                url: 'https://api.box.com/2.0/files/id',
                headers: {
                    'X-Rep-Hints': X_REP_HINTS,
                },
            });
        });

        test('should make xhr to get file even with cached file when asked to update cache', async () => {
            cache.set('key', { id: '123' });
            fields.findMissingProperties = jest.fn().mockReturnValueOnce([]);
            fields.fillMissingProperties = jest.fn().mockReturnValueOnce({ id: 'new', foo: 'bar', missing: null });
            file.options = { cache };
            file.getCache = jest.fn().mockReturnValueOnce(cache);
            file.getCacheKey = jest.fn().mockReturnValueOnce('key');
            file.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: { id: 'new', foo: 'bar' } })),
            };

            const success = jest.fn();

            await file.getFile('id', success, 'error', {
                forceFetch: false,
                refreshCache: true,
            });
            expect(file.getCacheKey).toHaveBeenCalledWith('id');
            expect(success).toHaveBeenCalledTimes(2);
            expect(success).toHaveBeenNthCalledWith(1, { id: '123' });
            expect(success).toHaveBeenNthCalledWith(2, {
                id: 'new',
                foo: 'bar',
                missing: null,
            });
            expect(fields.findMissingProperties).toHaveBeenCalledWith({ id: '123' }, undefined);
            expect(fields.fillMissingProperties).toHaveBeenCalledWith({ id: 'new', foo: 'bar' }, []);
            expect(file.xhr.get).toHaveBeenCalledWith({
                id: 'file_id',
                url: 'https://api.box.com/2.0/files/id',
                headers: {
                    'X-Rep-Hints': X_REP_HINTS,
                },
            });
        });
    });

    describe('getFileExtension()', () => {
        beforeEach(() => {
            file.getFile = jest.fn();
        });
        test('should do nothing if destroyed', () => {
            file.isDestroyed = jest.fn().mockReturnValue(true);
            file.getFileExtension(
                'id',
                () => {},
                () => {},
            );
            expect(file.getFile).not.toBeCalled();
        });

        test('should get the file with the extension field only', () => {
            file.isDestroyed = jest.fn().mockReturnValue(false);
            const id = 'id';
            const successCallback = jest.fn();
            const errorCallback = jest.fn();

            file.getFileExtension(id, successCallback, errorCallback);

            expect(file.getFile).toBeCalledWith(id, successCallback, errorCallback, {
                fields: [FIELD_EXTENSION],
            });
        });
    });
});
