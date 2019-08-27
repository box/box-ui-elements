import Cache from '../../utils/Cache';
import Folder from '../Folder';
import { FOLDER_FIELDS_TO_FETCH } from '../../utils/fields';
import { X_REP_HINT_HEADER_DIMENSIONS_DEFAULT } from '../../constants';

let folder;
let cache;
let item1;
let item2;
let item3;
let response;
let folderResults;

describe('api/Folder', () => {
    beforeEach(() => {
        folder = new Folder({});
        cache = new Cache();
    });

    describe('getCacheKey()', () => {
        test('should return correct key', () => {
            expect(folder.getCacheKey('foo')).toBe('folder_foo');
        });
    });

    describe('getUrl()', () => {
        test('should return correct folder api url', () => {
            expect(folder.getUrl()).toBe('https://api.box.com/2.0/folders');
        });
        test('should return correct folder api url with id', () => {
            expect(folder.getUrl('foo')).toBe('https://api.box.com/2.0/folders/foo');
        });
    });

    describe('isLoaded()', () => {
        test('should return false when no cache', () => {
            folder.key = 'key';
            expect(folder.isLoaded()).toBe(false);
        });

        test('should return false when no value', () => {
            folder.key = 'key';
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            expect(folder.isLoaded()).toBe(false);
        });

        test('should return true when loaded', () => {
            folder.key = 'key';
            cache.set('key', { item_collection: {} });
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            expect(folder.isLoaded()).toBe(true);
        });
    });

    describe('getFolder()', () => {
        test('should not do anything if destroyed', () => {
            folder.isDestroyed = jest.fn().mockReturnValueOnce(true);
            folder.folderRequest = jest.fn();
            folder.getCache = jest.fn();
            folder.getCacheKey = jest.fn();
            folder.getFolder('id', 'query', 'by', 'direction', 'success', 'fail');
            expect(folder.folderRequest).not.toHaveBeenCalled();
            expect(folder.getCache).not.toHaveBeenCalled();
            expect(folder.getCacheKey).not.toHaveBeenCalled();
        });
        test('should save args and make folder request when not cached', () => {
            folder.folderRequest = jest.fn();
            folder.getCacheKey = jest.fn().mockReturnValueOnce('key');
            folder.isLoaded = jest.fn().mockReturnValueOnce(false);
            folder.getFolder('id', 20, 0, 'by', 'direction', 'success', 'fail');
            expect(folder.getCacheKey).toHaveBeenCalledWith('id');
            expect(folder.id).toBe('id');
            expect(folder.successCallback).toBe('success');
            expect(folder.errorCallback).toBe('fail');
            expect(folder.sortBy).toBe('by');
            expect(folder.sortDirection).toBe('direction');
            expect(folder.key).toBe('key');
            expect(folder.limit).toBe(20);
            expect(folder.offset).toBe(0);
        });
        test('should save args and not make folder request when cached', () => {
            folder.folderRequest = jest.fn();
            folder.finish = jest.fn();
            folder.getCacheKey = jest.fn().mockReturnValueOnce('key');
            folder.isLoaded = jest.fn().mockReturnValueOnce(true);
            folder.getFolder('id', 20, 0, 'by', 'direction', 'success', 'fail');
            expect(folder.getCacheKey).toHaveBeenCalledWith('id');
            expect(folder.folderRequest).not.toHaveBeenCalled();
            expect(folder.id).toBe('id');
            expect(folder.successCallback).toBe('success');
            expect(folder.errorCallback).toBe('fail');
            expect(folder.sortBy).toBe('by');
            expect(folder.sortDirection).toBe('direction');
            expect(folder.key).toBe('key');
            expect(folder.limit).toBe(20);
            expect(folder.offset).toBe(0);
        });
        test('should save args and make folder request when cached but forced to fetch', () => {
            const unsetMock = jest.fn();
            folder.folderRequest = jest.fn();
            folder.getCache = jest.fn().mockReturnValueOnce({ unset: unsetMock });
            folder.getCacheKey = jest.fn().mockReturnValueOnce('key');
            folder.isLoaded = jest.fn().mockReturnValueOnce(false);
            folder.getFolder('id', 20, 0, 'by', 'direction', 'success', 'fail', {
                forceFetch: true,
            });
            expect(unsetMock).toHaveBeenCalledWith('key');
            expect(folder.getCacheKey).toHaveBeenCalledWith('id');
            expect(folder.id).toBe('id');
            expect(folder.successCallback).toBe('success');
            expect(folder.errorCallback).toBe('fail');
            expect(folder.sortBy).toBe('by');
            expect(folder.sortDirection).toBe('direction');
            expect(folder.key).toBe('key');
            expect(folder.limit).toBe(20);
            expect(folder.offset).toBe(0);
        });
    });

    describe('folderRequest()', () => {
        beforeEach(() => {
            folder.id = 'id';
            folder.successCallback = 'success';
            folder.errorCallback = 'fail';
            folder.sortBy = 'by';
            folder.sortDirection = 'direction';
            folder.key = 'key';
            folder.limit = 20;
            folder.offset = 0;
            folder.query = 'query';
        });

        test('should not do anything if destroyed', () => {
            folder.isDestroyed = jest.fn().mockReturnValueOnce(true);
            folder.xhr = null;
            return expect(folder.folderRequest()).rejects.toBeUndefined();
        });
        test('should make xhr to folder and call success callback', () => {
            folder.folderSuccessHandler = jest.fn();
            folder.errorHandler = jest.fn();
            folder.includePreviewFields = true;
            folder.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve('success')),
            };
            return folder.folderRequest().then(() => {
                expect(folder.folderSuccessHandler).toHaveBeenCalledWith('success');
                expect(folder.errorHandler).not.toHaveBeenCalled();
                expect(folder.xhr.get).toHaveBeenCalledWith({
                    url: 'https://api.box.com/2.0/folders/id',
                    params: {
                        direction: 'direction',
                        limit: 20,
                        offset: 0,
                        fields: FOLDER_FIELDS_TO_FETCH.toString(),
                        sort: 'by',
                    },
                    headers: { 'X-Rep-Hints': X_REP_HINT_HEADER_DIMENSIONS_DEFAULT },
                });
            });
        });

        test('should make xhr to folder and call error callback', () => {
            const error = new Error('error');
            folder.folderSuccessHandler = jest.fn();
            folder.errorHandler = jest.fn();
            folder.includePreviewFields = true;
            folder.includePreviewSidebarFields = true;
            folder.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.reject(error)),
            };
            return folder.folderRequest().then(() => {
                expect(folder.errorHandler).toHaveBeenCalledWith(error);
                expect(folder.folderSuccessHandler).not.toHaveBeenCalled();
                expect(folder.xhr.get).toHaveBeenCalledWith({
                    url: 'https://api.box.com/2.0/folders/id',
                    params: {
                        direction: 'direction',
                        limit: 20,
                        offset: 0,
                        fields: FOLDER_FIELDS_TO_FETCH.toString(),
                        sort: 'by',
                    },
                    headers: { 'X-Rep-Hints': X_REP_HINT_HEADER_DIMENSIONS_DEFAULT },
                });
            });
        });
    });

    describe('folderSuccessHandler()', () => {
        beforeEach(() => {
            item1 = {
                id: 'item1',
                name: 'item1',
                type: 'file',
                path_collection: {
                    entries: [{ id: 'id0' }, { id: 'id1' }, { id: 'id2' }],
                },
            };
            item2 = {
                id: 'item2',
                name: 'item2',
                type: 'file',
                path_collection: {
                    entries: [{ id: 'id4' }, { id: 'id5' }, { id: 'id6' }],
                },
            };
            item3 = {
                id: 'item3',
                name: 'item3',
                type: 'file',
                path_collection: {
                    entries: [{ id: 'id0' }, { id: 'id2' }, { id: 'id3' }],
                },
            };
            response = {
                data: {
                    id: 'id',
                    item_collection: {
                        limit: 1000,
                        offset: 0,
                        total_count: 3,
                        entries: [item1, item2, item3],
                    },
                },
            };
        });

        test('should not do anything if destroyed', () => {
            folder.isDestroyed = jest.fn().mockReturnValueOnce(true);
            folder.finish = jest.fn();
            folder.folderSuccessHandler('foo');
            expect(folder.finish).not.toHaveBeenCalled();
        });

        test('should parse the response, flatten the collection and call finish', () => {
            folder.options = { cache };
            folder.id = 'id';
            folder.key = 'key';
            folder.finish = jest.fn();
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.folderSuccessHandler(response);

            expect(cache.get('key')).toEqual({
                id: 'id',
                item_collection: {
                    limit: 1000,
                    offset: 0,
                    total_count: 3,
                    entries: ['file_item1', 'file_item2', 'file_item3'],
                },
            });
            expect(cache.get('file_item1')).toBe(item1);
            expect(cache.get('file_item2')).toBe(item2);
            expect(cache.get('file_item3')).toBe(item3);
        });

        test('should parse the response, append the collection and call finish', () => {
            folder.options = { cache };
            folder.id = 'id';
            folder.key = 'key';
            folder.finish = jest.fn();
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.itemCache = ['foo', 'bar'];

            response.data.item_collection.total_count = 5;
            folder.folderSuccessHandler(response);

            expect(cache.get('key')).toEqual({
                id: 'id',
                item_collection: {
                    limit: 1000,
                    offset: 0,
                    total_count: 5,
                    entries: ['foo', 'bar', 'file_item1', 'file_item2', 'file_item3'],
                },
            });
            expect(cache.get('file_item1')).toBe(item1);
            expect(cache.get('file_item2')).toBe(item2);
            expect(cache.get('file_item3')).toBe(item3);
        });

        test('should throw bad item error when item collection is missing', () => {
            folder.finish = jest.fn();
            expect(folder.folderSuccessHandler.bind(folder, {})).toThrow(Error, /Bad box item/);
            expect(folder.finish).not.toHaveBeenCalled();
        });

        test('should throw bad item error when item collection entries is missing', () => {
            folder.finish = jest.fn();
            expect(
                folder.folderSuccessHandler.bind(folder, {
                    item_collection: { total_count: 1, offset: 0, limit: 100 },
                }),
            ).toThrow(Error, /Bad box item/);
            expect(folder.finish).not.toHaveBeenCalled();
        });

        test('should throw bad item error when item collection total count is missing', () => {
            folder.finish = jest.fn();
            expect(
                folder.folderSuccessHandler.bind(folder, {
                    item_collection: { entries: [], offset: 0, limit: 100 },
                }),
            ).toThrow(Error, /Bad box item/);
            expect(folder.finish).not.toHaveBeenCalled();
        });

        test('should throw bad item error when item collection offset is missing', () => {
            folder.finish = jest.fn();
            expect(
                folder.folderSuccessHandler.bind(folder, {
                    item_collection: {
                        entries: [],
                        total_count: 0,
                        limit: 100,
                    },
                }),
            ).toThrow(Error, /Bad box item/);
            expect(folder.finish).not.toHaveBeenCalled();
        });

        test('should throw bad item error when item collection limit is missing', () => {
            folder.finish = jest.fn();
            expect(
                folder.folderSuccessHandler.bind(folder, {
                    item_collection: {
                        entries: [],
                        total_count: 0,
                        offset: 100,
                    },
                }),
            ).toThrow(Error, /Bad box item/);
            expect(folder.finish).not.toHaveBeenCalled();
        });
    });

    describe('finish()', () => {
        beforeEach(() => {
            item1 = {
                id: 'item1',
                name: 'item1',
                type: 'file',
                path_collection: {
                    entries: [{ id: 'id0' }, { id: 'id1' }, { id: 'id2' }],
                },
            };
            item2 = {
                id: 'item2',
                name: 'item2',
                type: 'file',
                path_collection: {
                    entries: [{ id: 'id4' }, { id: 'id5' }, { id: 'id6' }],
                },
            };
            item3 = {
                id: 'item3',
                name: 'item3',
                type: 'file',
                path_collection: {
                    entries: [{ id: 'id0' }, { id: 'id2' }, { id: 'id3' }],
                },
            };
            folderResults = {
                id: 'id',
                name: 'name',
                permissions: 'permissions',
                path_collection: {
                    entries: 'breadcrumbs',
                },
                item_collection: {
                    limit: 20,
                    offset: 0,
                    total_count: 3,
                    entries: ['file_item1', 'file_item2', 'file_item3'],
                },
            };

            cache.set('file_item1', item1);
            cache.set('file_item2', item2);
            cache.set('file_item3', item3);
            cache.set('key', folderResults);
        });

        test('should not do anything if destroyed', () => {
            folder.successCallback = jest.fn();
            folder.isDestroyed = jest.fn().mockReturnValueOnce(true);
            folder.finish();
            expect(folder.successCallback).not.toHaveBeenCalled();
        });

        test('should call success callback with proper collection', () => {
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'ASC';
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.successCallback = jest.fn();
            folder.finish();
            expect(folder.successCallback).toHaveBeenCalledWith({
                id: 'id',
                name: 'name',
                offset: 0,
                percentLoaded: 100,
                permissions: 'permissions',
                sortBy: 'name',
                sortDirection: 'ASC',
                boxItem: folderResults,
                breadcrumbs: 'breadcrumbs',
                items: [item1, item2, item3],
                totalCount: 3,
            });
        });

        test('should call success callback with 100% percent loaded when item collection is loaded', () => {
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'ASC';
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.successCallback = jest.fn();

            folderResults.item_collection.entries = ['file_item1', 'file_item2'];
            cache.set('key', folderResults);
            folder.finish();
            expect(folder.successCallback).toHaveBeenCalledWith({
                id: 'id',
                name: 'name',
                offset: 0,
                percentLoaded: 100,
                permissions: 'permissions',
                sortBy: 'name',
                sortDirection: 'ASC',
                boxItem: folderResults,
                breadcrumbs: 'breadcrumbs',
                items: [item1, item2],
                totalCount: 3,
            });
        });

        test('should call success callback with 100% percent loaded when item collection total count is 0', () => {
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'ASC';
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.successCallback = jest.fn();

            folderResults.item_collection.entries = ['file_item1', 'file_item2'];
            folderResults.item_collection.total_count = 0;
            cache.set('key', folderResults);
            folder.finish();
            expect(folder.successCallback).toHaveBeenCalledWith({
                id: 'id',
                name: 'name',
                offset: 0,
                percentLoaded: 100,
                permissions: 'permissions',
                sortBy: 'name',
                sortDirection: 'ASC',
                boxItem: folderResults,
                breadcrumbs: 'breadcrumbs',
                items: [item1, item2],
                totalCount: 0,
            });
        });

        test('should throw bad item error when item collection is missing', () => {
            cache.set('key', { path_collection: 'foo' });
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'ASC';
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.successCallback = jest.fn();
            expect(folder.finish.bind(folder)).toThrow(Error, /Bad box item/);
            expect(folder.successCallback).not.toHaveBeenCalled();
        });

        test('should throw bad item error when path collection is missing', () => {
            cache.set('key', { item_collection: 'foo' });
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'ASC';
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.successCallback = jest.fn();
            expect(folder.finish.bind(folder)).toThrow(Error, /Bad box item/);
            expect(folder.successCallback).not.toHaveBeenCalled();
        });

        test('should throw bad item error when item collection is missing entries', () => {
            cache.set('key', {
                path_collection: 'foo',
                item_collection: { total_count: 123 },
            });
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'ASC';
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.successCallback = jest.fn();
            expect(folder.finish.bind(folder)).toThrow(Error, /Bad box item/);
            expect(folder.successCallback).not.toHaveBeenCalled();
        });

        test('should throw bad item error when item collection is missing total_count', () => {
            cache.set('key', {
                path_collection: 'foo',
                item_collection: { entries: [] },
            });
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'ASC';
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.successCallback = jest.fn();
            expect(folder.finish.bind(folder)).toThrow(Error, /Bad box item/);
            expect(folder.successCallback).not.toHaveBeenCalled();
        });
    });

    describe('create()', () => {
        test('should not do anything if destroyed', () => {
            folder.isDestroyed = jest.fn().mockReturnValueOnce(true);
            folder.folderCreateRequest = jest.fn();
            folder.getCache = jest.fn();
            folder.getCacheKey = jest.fn();
            folder.create('id', 'name', 'success', 'fail');
            expect(folder.folderCreateRequest).not.toHaveBeenCalled();
            expect(folder.getCache).not.toHaveBeenCalled();
            expect(folder.getCacheKey).not.toHaveBeenCalled();
        });
        test('should save args and make folder create request when not cached', () => {
            folder.folderCreateRequest = jest.fn();
            folder.getCacheKey = jest.fn().mockReturnValueOnce('key');
            folder.create('id', 'name', 'success', 'fail');
            expect(folder.getCacheKey).toHaveBeenCalledWith('id');
            expect(folder.id).toBe('id');
            expect(folder.successCallback).toBe('success');
            expect(folder.errorCallback).toBe('fail');
            expect(folder.key).toBe('key');
        });
    });

    describe('folderCreateRequest()', () => {
        beforeEach(() => {
            folder.id = 'id';
            folder.successCallback = 'success';
            folder.errorCallback = 'fail';
            folder.key = 'key';
        });

        test('should not do anything if destroyed', () => {
            folder.isDestroyed = jest.fn().mockReturnValueOnce(true);
            folder.xhr = null;
            return expect(folder.folderCreateRequest('foo')).rejects.toBeUndefined();
        });
        test('should make xhr to folder create and call success callback', () => {
            folder.createSuccessHandler = jest.fn();
            folder.errorHandler = jest.fn();
            folder.xhr = {
                post: jest.fn().mockReturnValueOnce(Promise.resolve('success')),
            };
            return folder.folderCreateRequest('foo').then(() => {
                expect(folder.createSuccessHandler).toHaveBeenCalledWith('success');
                expect(folder.errorHandler).not.toHaveBeenCalled();
                expect(folder.xhr.post).toHaveBeenCalledWith({
                    url: `https://api.box.com/2.0/folders?fields=${FOLDER_FIELDS_TO_FETCH.toString()}`,
                    data: {
                        name: 'foo',
                        parent: {
                            id: 'id',
                        },
                    },
                });
            });
        });
        test('should make xhr to folder and call error callback', () => {
            const error = new Error('error');
            folder.createSuccessHandler = jest.fn();
            folder.errorHandler = jest.fn();
            folder.xhr = {
                post: jest.fn().mockReturnValueOnce(Promise.reject(error)),
            };
            return folder.folderCreateRequest('foo').then(() => {
                expect(folder.errorHandler).toHaveBeenCalledWith(error);
                expect(folder.createSuccessHandler).not.toHaveBeenCalled();
                expect(folder.xhr.post).toHaveBeenCalledWith({
                    url: `https://api.box.com/2.0/folders?fields=${FOLDER_FIELDS_TO_FETCH.toString()}`,
                    data: {
                        name: 'foo',
                        parent: {
                            id: 'id',
                        },
                    },
                });
            });
        });
    });

    describe('createSuccessHandler()', () => {
        beforeEach(() => {
            item1 = {
                id: 'item1',
                name: 'item1',
                type: 'folder',
                path_collection: {
                    entries: [{ id: 'id0' }, { id: 'id1' }, { id: 'id2' }],
                },
            };
            cache.set('key', {
                id: 'id',
                item_collection: {
                    total_count: 2,
                    entries: ['file_item2', 'file_item3'],
                },
            });
        });

        test('should not do anything if destroyed', () => {
            folder.isDestroyed = jest.fn().mockReturnValueOnce(true);
            folder.successCallback = jest.fn();
            folder.createSuccessHandler(response);
            expect(folder.successCallback).not.toHaveBeenCalled();
        });

        test('should not do anything if new child folder doesnt have an id', () => {
            folder.isDestroyed = jest.fn().mockReturnValueOnce(false);
            folder.successCallback = jest.fn();
            folder.createSuccessHandler({ data: {} });
            expect(folder.successCallback).not.toHaveBeenCalled();
        });

        test('should insert the response item inside the parent folder', () => {
            folder.id = 'id';
            folder.key = 'key';
            folder.successCallback = jest.fn();
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.createSuccessHandler({ data: item1 });

            expect(cache.get('key')).toEqual({
                id: 'id',
                item_collection: {
                    total_count: 3,
                    entries: ['folder_item1', 'file_item2', 'file_item3'],
                },
            });

            expect(cache.get('folder_item1')).toBe(item1);
            expect(folder.successCallback).toHaveBeenCalledWith(item1);
        });

        test('should throw bad item error when item collection is missing', () => {
            folder.id = 'id';
            folder.key = 'key';
            folder.successCallback = jest.fn();
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            cache.set('key', {
                id: 'id',
            });
            expect(folder.createSuccessHandler.bind(folder, { id: 'foo' })).toThrow(Error, /Bad box item/);
            expect(folder.successCallback).not.toHaveBeenCalled();
        });

        test('should throw bad item error when item collection entries is missing', () => {
            folder.id = 'id';
            folder.key = 'key';
            folder.successCallback = jest.fn();
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            cache.set('key', {
                id: 'id',
                item_collection: {
                    total_count: 2,
                },
            });
            expect(folder.createSuccessHandler.bind(folder, { id: 'foo' })).toThrow(Error, /Bad box item/);
            expect(folder.successCallback).not.toHaveBeenCalled();
        });

        test('should throw bad item error when total count is missing', () => {
            folder.id = 'id';
            folder.key = 'key';
            folder.successCallback = jest.fn();
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            cache.set('key', {
                id: 'id',
                item_collection: {
                    entries: [],
                },
            });
            expect(
                folder.createSuccessHandler.bind(folder, {
                    id: 'foo',
                    item_collection: { entries: [] },
                }),
            ).toThrow(Error, /Bad box item/);
            expect(folder.successCallback).not.toHaveBeenCalled();
        });
    });
});
