import Folder from '../Folder';
import Cache from '../../util/Cache';
import { getFieldsAsString } from '../../util/fields';
import { X_REP_HINTS } from '../../constants';
import * as sort from '../../util/sorter';

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
        test('should return false when not cached', () => {
            folder.key = 'key';
            expect(folder.isLoaded()).toBe(false);
        });
        test('should return false when no item collection', () => {
            folder.key = 'key';
            cache.set('key', {});
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            expect(folder.isLoaded()).toBe(false);
        });
        test('should return false when not loaded', () => {
            folder.key = 'key';
            cache.set('key', { item_collection: { isLoaded: false } });
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            expect(folder.isLoaded()).toBe(false);
        });
        test('should return true when loaded', () => {
            folder.key = 'key';
            cache.set('key', { item_collection: { isLoaded: true } });
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            expect(folder.isLoaded()).toBe(true);
        });
    });

    describe('folder()', () => {
        test('should not do anything if destroyed', () => {
            folder.isDestroyed = jest.fn().mockReturnValueOnce(true);
            folder.folderRequest = jest.fn();
            folder.getCache = jest.fn();
            folder.getCacheKey = jest.fn();
            folder.folder('id', 'query', 'by', 'direction', 'success', 'fail');
            expect(folder.folderRequest).not.toHaveBeenCalled();
            expect(folder.getCache).not.toHaveBeenCalled();
            expect(folder.getCacheKey).not.toHaveBeenCalled();
        });
        test('should save args and make folder request when not cached', () => {
            folder.folderRequest = jest.fn();
            folder.getCacheKey = jest.fn().mockReturnValueOnce('key');
            folder.isLoaded = jest.fn().mockReturnValueOnce(false);
            folder.folder('id', 'by', 'direction', 'success', 'fail', false, 'preview', 'sidebar');
            expect(folder.getCacheKey).toHaveBeenCalledWith('id');
            expect(folder.id).toBe('id');
            expect(folder.successCallback).toBe('success');
            expect(folder.errorCallback).toBe('fail');
            expect(folder.sortBy).toBe('by');
            expect(folder.sortDirection).toBe('direction');
            expect(folder.key).toBe('key');
            expect(folder.offset).toBe(0);
            expect(folder.includePreviewFields).toBe('preview');
            expect(folder.includePreviewSidebarFields).toBe('sidebar');
        });
        test('should save args and not make folder request when cached', () => {
            folder.folderRequest = jest.fn();
            folder.finish = jest.fn();
            folder.getCacheKey = jest.fn().mockReturnValueOnce('key');
            folder.isLoaded = jest.fn().mockReturnValueOnce(true);
            folder.folder('id', 'by', 'direction', 'success', 'fail', false, 'preview', 'sidebar');
            expect(folder.getCacheKey).toHaveBeenCalledWith('id');
            expect(folder.folderRequest).not.toHaveBeenCalled();
            expect(folder.id).toBe('id');
            expect(folder.successCallback).toBe('success');
            expect(folder.errorCallback).toBe('fail');
            expect(folder.sortBy).toBe('by');
            expect(folder.sortDirection).toBe('direction');
            expect(folder.key).toBe('key');
            expect(folder.offset).toBe(0);
            expect(folder.includePreviewFields).toBe('preview');
            expect(folder.includePreviewSidebarFields).toBe('sidebar');
        });
        test('should save args and make folder request when cached but forced to fetch', () => {
            const unsetMock = jest.fn();
            folder.folderRequest = jest.fn();
            folder.getCache = jest.fn().mockReturnValueOnce({ unset: unsetMock });
            folder.getCacheKey = jest.fn().mockReturnValueOnce('key');
            folder.isLoaded = jest.fn().mockReturnValueOnce(false);
            folder.folder('id', 'by', 'direction', 'success', 'fail', true, 'preview', 'sidebar');
            expect(unsetMock).toHaveBeenCalledWith('key');
            expect(folder.getCacheKey).toHaveBeenCalledWith('id');
            expect(folder.id).toBe('id');
            expect(folder.successCallback).toBe('success');
            expect(folder.errorCallback).toBe('fail');
            expect(folder.sortBy).toBe('by');
            expect(folder.sortDirection).toBe('direction');
            expect(folder.key).toBe('key');
            expect(folder.offset).toBe(0);
            expect(folder.includePreviewFields).toBe('preview');
            expect(folder.includePreviewSidebarFields).toBe('sidebar');
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
                get: jest.fn().mockReturnValueOnce(Promise.resolve('success'))
            };
            return folder.folderRequest().then(() => {
                expect(folder.folderSuccessHandler).toHaveBeenCalledWith('success');
                expect(folder.errorHandler).not.toHaveBeenCalled();
                expect(folder.xhr.get).toHaveBeenCalledWith({
                    url: 'https://api.box.com/2.0/folders/id',
                    params: {
                        offset: 0,
                        limit: 1000,
                        fields: getFieldsAsString(true)
                    },
                    headers: {
                        'X-Rep-Hints': X_REP_HINTS
                    }
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
                get: jest.fn().mockReturnValueOnce(Promise.reject(error))
            };
            return folder.folderRequest().then(() => {
                expect(folder.errorHandler).toHaveBeenCalledWith(error);
                expect(folder.folderSuccessHandler).not.toHaveBeenCalled();
                expect(folder.xhr.get).toHaveBeenCalledWith({
                    url: 'https://api.box.com/2.0/folders/id',
                    params: {
                        offset: 0,
                        limit: 1000,
                        fields: getFieldsAsString(true, true)
                    },
                    headers: {
                        'X-Rep-Hints': X_REP_HINTS
                    }
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
                    entries: [{ id: 'id0' }, { id: 'id1' }, { id: 'id2' }]
                }
            };
            item2 = {
                id: 'item2',
                name: 'item2',
                type: 'file',
                path_collection: {
                    entries: [{ id: 'id4' }, { id: 'id5' }, { id: 'id6' }]
                }
            };
            item3 = {
                id: 'item3',
                name: 'item3',
                type: 'file',
                path_collection: {
                    entries: [{ id: 'id0' }, { id: 'id2' }, { id: 'id3' }]
                }
            };
            response = {
                id: 'id',
                item_collection: {
                    limit: 1000,
                    offset: 0,
                    total_count: 3,
                    entries: [item1, item2, item3]
                }
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
                    isLoaded: true,
                    limit: 1000,
                    offset: 0,
                    total_count: 3,
                    entries: ['file_item1', 'file_item2', 'file_item3']
                }
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

            response.item_collection.total_count = 5;
            folder.folderSuccessHandler(response);

            expect(cache.get('key')).toEqual({
                id: 'id',
                item_collection: {
                    isLoaded: true,
                    limit: 1000,
                    offset: 0,
                    total_count: 5,
                    entries: ['foo', 'bar', 'file_item1', 'file_item2', 'file_item3']
                }
            });
            expect(cache.get('file_item1')).toBe(item1);
            expect(cache.get('file_item2')).toBe(item2);
            expect(cache.get('file_item3')).toBe(item3);
        });

        test('should call folder request again if limit + offset is less than total', () => {
            folder.options = { cache };
            folder.offset = 0;
            folder.key = 'key';
            folder.finish = jest.fn();
            folder.folderRequest = jest.fn();
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            response.item_collection.total_count = 2000;
            folder.folderSuccessHandler(response);
            expect(cache.get('key')).toEqual({
                id: 'id',
                item_collection: {
                    isLoaded: false,
                    limit: 1000,
                    offset: 0,
                    total_count: 2000,
                    entries: ['file_item1', 'file_item2', 'file_item3']
                }
            });
            expect(folder.offset).toBe(1000);
        });

        test('should append the collection and call folder request again if limit + offset is less than total', () => {
            folder.options = { cache };
            folder.offset = 0;
            folder.key = 'key';
            folder.finish = jest.fn();
            folder.folderRequest = jest.fn();
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.itemCache = ['foo', 'bar'];
            response.item_collection.total_count = 2000;
            folder.folderSuccessHandler(response);
            expect(cache.get('key')).toEqual({
                id: 'id',
                item_collection: {
                    isLoaded: false,
                    limit: 1000,
                    offset: 0,
                    total_count: 2000,
                    entries: ['foo', 'bar', 'file_item1', 'file_item2', 'file_item3']
                }
            });
            expect(folder.offset).toBe(1000);
        });

        test('should throw bad item error when item collection is missing', () => {
            folder.finish = jest.fn();
            expect(folder.folderSuccessHandler.bind(folder, {})).toThrow(Error, /Bad box item/);
            expect(folder.finish).not.toHaveBeenCalled();
        });

        test('should throw bad item error when item collection entries is missing', () => {
            folder.finish = jest.fn();
            expect(
                folder.folderSuccessHandler.bind(folder, { item_collection: { total_count: 1, offset: 0, limit: 100 } })
            ).toThrow(Error, /Bad box item/);
            expect(folder.finish).not.toHaveBeenCalled();
        });

        test('should throw bad item error when item collection total count is missing', () => {
            folder.finish = jest.fn();
            expect(
                folder.folderSuccessHandler.bind(folder, { item_collection: { entries: [], offset: 0, limit: 100 } })
            ).toThrow(Error, /Bad box item/);
            expect(folder.finish).not.toHaveBeenCalled();
        });

        test('should throw bad item error when item collection offset is missing', () => {
            folder.finish = jest.fn();
            expect(
                folder.folderSuccessHandler.bind(folder, {
                    item_collection: { entries: [], total_count: 0, limit: 100 }
                })
            ).toThrow(Error, /Bad box item/);
            expect(folder.finish).not.toHaveBeenCalled();
        });

        test('should throw bad item error when item collection limit is missing', () => {
            folder.finish = jest.fn();
            expect(
                folder.folderSuccessHandler.bind(folder, {
                    item_collection: { entries: [], total_count: 0, offset: 100 }
                })
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
                    entries: [{ id: 'id0' }, { id: 'id1' }, { id: 'id2' }]
                }
            };
            item2 = {
                id: 'item2',
                name: 'item2',
                type: 'file',
                path_collection: {
                    entries: [{ id: 'id4' }, { id: 'id5' }, { id: 'id6' }]
                }
            };
            item3 = {
                id: 'item3',
                name: 'item3',
                type: 'file',
                path_collection: {
                    entries: [{ id: 'id0' }, { id: 'id2' }, { id: 'id3' }]
                }
            };
            folderResults = {
                id: 'id',
                name: 'name',
                permissions: 'permissions',
                path_collection: {
                    entries: 'breadcrumbs'
                },
                item_collection: {
                    isLoaded: false,
                    limit: 1000,
                    offset: 0,
                    total_count: 3,
                    entries: ['file_item1', 'file_item2', 'file_item3']
                }
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
            folder.sortDirection = 'DESC';
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.successCallback = jest.fn();
            folder.finish();
            expect(folder.successCallback).toHaveBeenCalledWith({
                id: 'id',
                name: 'name',
                percentLoaded: 100,
                permissions: 'permissions',
                sortBy: 'name',
                sortDirection: 'DESC',
                boxItem: folderResults,
                breadcrumbs: 'breadcrumbs',
                items: [item3, item2, item1]
            });
        });

        test('should call success callback with proper percent loaded', () => {
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'DESC';
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.successCallback = jest.fn();

            folderResults.item_collection.entries = ['file_item1', 'file_item2'];
            cache.set('key', folderResults);
            folder.finish();
            expect(folder.successCallback).toHaveBeenCalledWith({
                id: 'id',
                name: 'name',
                percentLoaded: 66.66666666666667,
                permissions: 'permissions',
                sortBy: 'name',
                sortDirection: 'DESC',
                boxItem: folderResults,
                breadcrumbs: 'breadcrumbs',
                items: [item2, item1]
            });
        });

        test('should call success callback with 100% percent loaded when item collection isLoaded', () => {
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'DESC';
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.successCallback = jest.fn();

            folderResults.item_collection.entries = ['file_item1', 'file_item2'];
            folderResults.item_collection.isLoaded = true;
            cache.set('key', folderResults);
            folder.finish();
            expect(folder.successCallback).toHaveBeenCalledWith({
                id: 'id',
                name: 'name',
                percentLoaded: 100,
                permissions: 'permissions',
                sortBy: 'name',
                sortDirection: 'DESC',
                boxItem: folderResults,
                breadcrumbs: 'breadcrumbs',
                items: [item2, item1]
            });
        });

        test('should call success callback with 100% percent loaded when item collection total count is 0', () => {
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'DESC';
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.successCallback = jest.fn();

            folderResults.item_collection.entries = ['file_item1', 'file_item2'];
            folderResults.item_collection.total_count = 0;
            cache.set('key', folderResults);
            folder.finish();
            expect(folder.successCallback).toHaveBeenCalledWith({
                id: 'id',
                name: 'name',
                percentLoaded: 100,
                permissions: 'permissions',
                sortBy: 'name',
                sortDirection: 'DESC',
                boxItem: folderResults,
                breadcrumbs: 'breadcrumbs',
                items: [item2, item1]
            });
        });

        test('should throw bad item error when item collection is missing', () => {
            sort.default = jest.fn().mockReturnValueOnce({ path_collection: 'foo' });
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'DESC';
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.successCallback = jest.fn();
            expect(folder.finish.bind(folder)).toThrow(Error, /Bad box item/);
            expect(sort.default).toHaveBeenCalledWith(folderResults, 'name', 'DESC', cache);
            expect(folder.successCallback).not.toHaveBeenCalled();
        });

        test('should throw bad item error when path collection is missing', () => {
            sort.default = jest.fn().mockReturnValueOnce({ item_collection: 'foo' });
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'DESC';
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.successCallback = jest.fn();
            expect(folder.finish.bind(folder)).toThrow(Error, /Bad box item/);
            expect(sort.default).toHaveBeenCalledWith(folderResults, 'name', 'DESC', cache);
            expect(folder.successCallback).not.toHaveBeenCalled();
        });

        test('should throw bad item error when item collection is missing entries', () => {
            sort.default = jest
                .fn()
                .mockReturnValueOnce({ path_collection: 'foo', item_collection: { total_count: 123 } });
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'DESC';
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.successCallback = jest.fn();
            expect(folder.finish.bind(folder)).toThrow(Error, /Bad box item/);
            expect(sort.default).toHaveBeenCalledWith(folderResults, 'name', 'DESC', cache);
            expect(folder.successCallback).not.toHaveBeenCalled();
        });

        test('should throw bad item error when item collection is missing total_count', () => {
            sort.default = jest.fn().mockReturnValueOnce({ path_collection: 'foo', item_collection: { entries: [] } });
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'DESC';
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.successCallback = jest.fn();
            expect(folder.finish.bind(folder)).toThrow(Error, /Bad box item/);
            expect(sort.default).toHaveBeenCalledWith(folderResults, 'name', 'DESC', cache);
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
                post: jest.fn().mockReturnValueOnce(Promise.resolve('success'))
            };
            return folder.folderCreateRequest('foo').then(() => {
                expect(folder.createSuccessHandler).toHaveBeenCalledWith('success');
                expect(folder.errorHandler).not.toHaveBeenCalled();
                expect(folder.xhr.post).toHaveBeenCalledWith({
                    url: `https://api.box.com/2.0/folders?fields=${getFieldsAsString()}`,
                    data: {
                        name: 'foo',
                        parent: {
                            id: 'id'
                        }
                    }
                });
            });
        });
        test('should make xhr to folder and call error callback', () => {
            const error = new Error('error');
            folder.createSuccessHandler = jest.fn();
            folder.errorHandler = jest.fn();
            folder.xhr = {
                post: jest.fn().mockReturnValueOnce(Promise.reject(error))
            };
            return folder.folderCreateRequest('foo').then(() => {
                expect(folder.errorHandler).toHaveBeenCalledWith(error);
                expect(folder.createSuccessHandler).not.toHaveBeenCalled();
                expect(folder.xhr.post).toHaveBeenCalledWith({
                    url: `https://api.box.com/2.0/folders?fields=${getFieldsAsString()}`,
                    data: {
                        name: 'foo',
                        parent: {
                            id: 'id'
                        }
                    }
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
                    entries: [{ id: 'id0' }, { id: 'id1' }, { id: 'id2' }]
                }
            };
            cache.set('key', {
                id: 'id',
                item_collection: {
                    total_count: 2,
                    entries: ['file_item2', 'file_item3']
                }
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
            folder.createSuccessHandler({});
            expect(folder.successCallback).not.toHaveBeenCalled();
        });

        test('should insert the response item inside the parent folder', () => {
            folder.id = 'id';
            folder.key = 'key';
            folder.successCallback = jest.fn();
            folder.getCache = jest.fn().mockReturnValueOnce(cache);
            folder.createSuccessHandler(item1);

            expect(cache.get('key')).toEqual({
                id: 'id',
                item_collection: {
                    total_count: 3,
                    entries: ['folder_item1', 'file_item2', 'file_item3']
                }
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
                id: 'id'
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
                    total_count: 2
                }
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
                    entries: []
                }
            });
            expect(folder.createSuccessHandler.bind(folder, { id: 'foo', item_collection: { entries: [] } })).toThrow(
                Error,
                /Bad box item/
            );
            expect(folder.successCallback).not.toHaveBeenCalled();
        });
    });
});
