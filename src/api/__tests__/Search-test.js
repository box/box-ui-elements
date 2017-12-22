import Search from '../Search';
import Cache from '../../util/Cache';
import getFields from '../../util/fields';
import { X_REP_HINTS } from '../../constants';
import * as sort from '../../util/sorter';

let search;
let cache;
let item1;
let item2;
let item3;
let response;
let searchResults;

describe('api/Search', () => {
    beforeEach(() => {
        search = new Search();
        cache = new Cache();
    });

    describe('getEncodedQuery()', () => {
        test('should return url encoded string', () => {
            expect(search.getEncodedQuery('foo bar')).toBe('foo%20bar');
        });
    });

    describe('getCacheKey()', () => {
        test('should return correct key', () => {
            expect(search.getCacheKey('foo', 'bar')).toBe('search_foo|bar');
        });
    });

    describe('getUrl()', () => {
        test('should return correct search api url', () => {
            expect(search.getUrl()).toBe('https://api.box.com/2.0/search');
        });
    });

    describe('isLoaded()', () => {
        test('should return false when not cached', () => {
            search.key = 'key';
            expect(search.isLoaded()).toBe(false);
        });

        test('should return false when no item collection', () => {
            search.key = 'key';
            cache.set('key', {});
            search.getCache = jest.fn().mockReturnValueOnce(cache);
            expect(search.isLoaded()).toBe(false);
        });

        test('should return false when not loaded', () => {
            search.key = 'key';
            cache.set('key', { item_collection: { isLoaded: false } });
            search.getCache = jest.fn().mockReturnValueOnce(cache);
            expect(search.isLoaded()).toBe(false);
        });

        test('should return true when loaded', () => {
            search.key = 'key';
            cache.set('key', { item_collection: { isLoaded: true } });
            search.getCache = jest.fn().mockReturnValueOnce(cache);
            expect(search.isLoaded()).toBe(true);
        });
    });

    describe('search()', () => {
        test('should not do anything if destroyed', () => {
            search.isDestroyed = jest.fn().mockReturnValueOnce(true);
            search.searchRequest = jest.fn();
            search.getCache = jest.fn();
            search.getCacheKey = jest.fn();
            search.search('id', 'query', 'by', 'direction', 'success', 'fail');
            expect(search.searchRequest).not.toHaveBeenCalled();
            expect(search.getCache).not.toHaveBeenCalled();
            expect(search.getCacheKey).not.toHaveBeenCalled();
        });
        test('should save args and make search request when not cached', () => {
            search.searchRequest = jest.fn();
            search.getCacheKey = jest.fn().mockReturnValueOnce('key');
            search.isLoaded = jest.fn().mockReturnValueOnce(false);
            search.search('id', 'foo query', 'by', 'direction', 'success', 'fail', false, 'preview', 'sidebar');
            expect(search.getCacheKey).toHaveBeenCalledWith('id', 'foo%20query');
            expect(search.id).toBe('id');
            expect(search.successCallback).toBe('success');
            expect(search.errorCallback).toBe('fail');
            expect(search.sortBy).toBe('by');
            expect(search.sortDirection).toBe('direction');
            expect(search.key).toBe('key');
            expect(search.offset).toBe(0);
            expect(search.query).toBe('foo query');
            expect(search.includePreviewFields).toBe('preview');
            expect(search.includePreviewSidebarFields).toBe('sidebar');
        });
        test('should save args and not make search request when cached', () => {
            search.searchRequest = jest.fn();
            search.finish = jest.fn();
            search.getCacheKey = jest.fn().mockReturnValueOnce('key');
            search.isLoaded = jest.fn().mockReturnValueOnce(true);
            search.search('id', 'foo query', 'by', 'direction', 'success', 'fail', false, 'preview', 'sidebar');
            expect(search.searchRequest).not.toHaveBeenCalled();
            expect(search.getCacheKey).toHaveBeenCalledWith('id', 'foo%20query');
            expect(search.id).toBe('id');
            expect(search.successCallback).toBe('success');
            expect(search.errorCallback).toBe('fail');
            expect(search.sortBy).toBe('by');
            expect(search.sortDirection).toBe('direction');
            expect(search.key).toBe('key');
            expect(search.offset).toBe(0);
            expect(search.query).toBe('foo query');
            expect(search.includePreviewFields).toBe('preview');
            expect(search.includePreviewSidebarFields).toBe('sidebar');
        });
        test('should save args and make search request when cached but forced to fetch', () => {
            const unsetMock = jest.fn();
            search.searchRequest = jest.fn();
            search.getCache = jest.fn().mockReturnValueOnce({ unset: unsetMock });
            search.getCacheKey = jest.fn().mockReturnValueOnce('key');
            search.isLoaded = jest.fn().mockReturnValueOnce(false);
            search.search('id', 'foo query', 'by', 'direction', 'success', 'fail', true, 'preview', 'sidebar');
            expect(unsetMock).toHaveBeenCalledWith('key');
            expect(search.getCacheKey).toHaveBeenCalledWith('id', 'foo%20query');
            expect(search.id).toBe('id');
            expect(search.successCallback).toBe('success');
            expect(search.errorCallback).toBe('fail');
            expect(search.sortBy).toBe('by');
            expect(search.sortDirection).toBe('direction');
            expect(search.key).toBe('key');
            expect(search.offset).toBe(0);
            expect(search.query).toBe('foo query');
            expect(search.includePreviewFields).toBe('preview');
            expect(search.includePreviewSidebarFields).toBe('sidebar');
        });
    });

    describe('searchRequest()', () => {
        beforeEach(() => {
            search.id = 'id';
            search.successCallback = 'success';
            search.errorCallback = 'fail';
            search.sortBy = 'by';
            search.sortDirection = 'direction';
            search.key = 'key';
            search.offset = 0;
            search.query = 'query';
        });

        test('should not do anything if destroyed', () => {
            search.isDestroyed = jest.fn().mockReturnValueOnce(true);
            search.xhr = null;
            return expect(search.searchRequest()).rejects.toBeUndefined();
        });

        test('should make xhr to search and call success callback', () => {
            search.searchSuccessHandler = jest.fn();
            search.searchErrorHandler = jest.fn();
            search.includePreviewFields = true;
            search.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve('success'))
            };
            return search.searchRequest().then(() => {
                expect(search.searchSuccessHandler).toHaveBeenCalledWith('success');
                expect(search.searchErrorHandler).not.toHaveBeenCalled();
                expect(search.xhr.get).toHaveBeenCalledWith({
                    url: 'https://api.box.com/2.0/search',
                    params: {
                        offset: 0,
                        query: 'query',
                        ancestor_folder_ids: 'id',
                        limit: 200,
                        fields: getFields(true)
                    },
                    headers: { 'X-Rep-Hints': X_REP_HINTS }
                });
            });
        });

        test('should make xhr to search and call error callback', () => {
            const error = new Error('error');
            search.searchSuccessHandler = jest.fn();
            search.searchErrorHandler = jest.fn();
            search.includePreviewFields = true;
            search.includePreviewSidebarFields = true;
            search.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.reject(error))
            };
            return search.searchRequest().then(() => {
                expect(search.searchErrorHandler).toHaveBeenCalledWith(error);
                expect(search.searchSuccessHandler).not.toHaveBeenCalled();
                expect(search.xhr.get).toHaveBeenCalledWith({
                    url: 'https://api.box.com/2.0/search',
                    params: {
                        offset: 0,
                        query: 'query',
                        ancestor_folder_ids: 'id',
                        limit: 200,
                        fields: getFields(true, true)
                    },
                    headers: { 'X-Rep-Hints': X_REP_HINTS }
                });
            });
        });
    });

    describe('searchErrorHandler()', () => {
        test('should not do anything if destroyed', () => {
            search.isDestroyed = jest.fn().mockReturnValueOnce(true);
            search.errorCallback = jest.fn();
            search.searchErrorHandler('foo');
            expect(search.errorCallback).not.toHaveBeenCalled();
        });
        test('should call error callback', () => {
            search.errorCallback = jest.fn();
            search.searchErrorHandler('foo');
            expect(search.errorCallback).toHaveBeenCalledWith('foo');
        });
    });

    describe('searchSuccessHandler()', () => {
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
                limit: 200,
                offset: 0,
                total_count: 3,
                entries: [item1, item2, item3]
            };
        });

        test('should not do anything if destroyed', () => {
            search.isDestroyed = jest.fn().mockReturnValueOnce(true);
            search.finish = jest.fn();
            search.searchSuccessHandler('foo');
            expect(search.finish).not.toHaveBeenCalled();
        });

        test('should parse the response, flatten the collection and call finish', () => {
            search.options = { cache };
            search.id = 'id';
            search.key = 'key';
            search.finish = jest.fn();
            search.getCache = jest.fn().mockReturnValueOnce(cache);
            search.searchSuccessHandler(response);

            expect(cache.get('key')).toEqual({
                item_collection: {
                    isLoaded: true,
                    limit: 200,
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
            search.options = { cache };
            search.id = 'id';
            search.key = 'key';
            search.finish = jest.fn();
            search.getCache = jest.fn().mockReturnValueOnce(cache);
            search.itemCache = ['foo', 'bar'];

            response.total_count = 5;
            search.searchSuccessHandler(response);

            expect(cache.get('key')).toEqual({
                item_collection: {
                    isLoaded: true,
                    limit: 200,
                    offset: 0,
                    total_count: 5,
                    entries: ['foo', 'bar', 'file_item1', 'file_item2', 'file_item3']
                }
            });
            expect(cache.get('file_item1')).toBe(item1);
            expect(cache.get('file_item2')).toBe(item2);
            expect(cache.get('file_item3')).toBe(item3);
        });

        test('should call search request again if offset + limit less than total', () => {
            search.options = { cache };
            search.offset = 0;
            search.key = 'key';
            search.finish = jest.fn();
            search.searchRequest = jest.fn();
            search.getCache = jest.fn().mockReturnValueOnce(cache);
            response.total_count = 2000;
            search.searchSuccessHandler(response);
            expect(cache.get('key')).toEqual({
                item_collection: {
                    isLoaded: false,
                    limit: 200,
                    offset: 0,
                    total_count: 2000,
                    entries: ['file_item1', 'file_item2', 'file_item3']
                }
            });
            expect(search.offset).toBe(200);
        });

        test('should append the collection and call search request again if returned items are less than total', () => {
            search.options = { cache };
            search.offset = 0;
            search.key = 'key';
            search.finish = jest.fn();
            search.searchRequest = jest.fn();
            search.getCache = jest.fn().mockReturnValueOnce(cache);
            search.itemCache = ['foo', 'bar'];
            response.total_count = 2000;
            search.searchSuccessHandler(response);
            expect(cache.get('key')).toEqual({
                item_collection: {
                    isLoaded: false,
                    limit: 200,
                    offset: 0,
                    total_count: 2000,
                    entries: ['foo', 'bar', 'file_item1', 'file_item2', 'file_item3']
                }
            });
            expect(search.offset).toBe(200);
        });

        test('should throw bad item error when entries is missing', () => {
            search.finish = jest.fn();
            expect(search.searchSuccessHandler.bind(search, { total_count: 1, offset: 0, limit: 100 })).toThrow(
                Error,
                /Bad box item/
            );
            expect(search.finish).not.toHaveBeenCalled();
        });

        test('should throw bad item error when total count is missing', () => {
            search.finish = jest.fn();
            expect(search.searchSuccessHandler.bind(search, { entries: [], offset: 0, limit: 100 })).toThrow(
                Error,
                /Bad box item/
            );
            expect(search.finish).not.toHaveBeenCalled();
        });

        test('should throw bad item error when offset is missing', () => {
            search.finish = jest.fn();
            expect(
                search.searchSuccessHandler.bind(search, {
                    entries: [],
                    total_count: 0,
                    limit: 100
                })
            ).toThrow(Error, /Bad box item/);
            expect(search.finish).not.toHaveBeenCalled();
        });

        test('should throw bad item error when limit is missing', () => {
            search.finish = jest.fn();
            expect(
                search.searchSuccessHandler.bind(search, {
                    entries: [],
                    total_count: 0,
                    offset: 100
                })
            ).toThrow(Error, /Bad box item/);
            expect(search.finish).not.toHaveBeenCalled();
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
            searchResults = {
                item_collection: {
                    isLoaded: false,
                    limit: 200,
                    offset: 0,
                    total_count: 3,
                    entries: ['file_item1', 'file_item2', 'file_item3']
                }
            };

            cache.set('file_item1', item1);
            cache.set('file_item2', item2);
            cache.set('file_item3', item3);
            cache.set('key', searchResults);
        });

        test('should not do anything if destroyed', () => {
            search.successCallback = jest.fn();
            search.isDestroyed = jest.fn().mockReturnValueOnce(true);
            search.finish();
            expect(search.successCallback).not.toHaveBeenCalled();
        });

        test('should call success callback with proper collection', () => {
            search.id = 'id';
            search.key = 'key';
            search.sortBy = 'name';
            search.sortDirection = 'DESC';
            search.getCache = jest.fn().mockReturnValueOnce(cache);
            search.successCallback = jest.fn();
            search.finish();
            expect(search.successCallback).toHaveBeenCalledWith({
                percentLoaded: 100,
                id: 'id',
                sortBy: 'name',
                sortDirection: 'DESC',
                items: [item3, item2, item1]
            });
        });

        test('should call success callback with proper percent loaded', () => {
            search.id = 'id';
            search.key = 'key';
            search.sortBy = 'name';
            search.sortDirection = 'DESC';
            search.getCache = jest.fn().mockReturnValueOnce(cache);
            search.successCallback = jest.fn();

            searchResults.item_collection.entries = ['file_item1', 'file_item2'];
            cache.set('key', searchResults);
            search.finish();
            expect(search.successCallback).toHaveBeenCalledWith({
                percentLoaded: 66.66666666666667,
                id: 'id',
                sortBy: 'name',
                sortDirection: 'DESC',
                items: [item2, item1]
            });
        });

        test('should call success callback with 100% percent loaded when item collection isLoaded is true', () => {
            search.id = 'id';
            search.key = 'key';
            search.sortBy = 'name';
            search.sortDirection = 'DESC';
            search.getCache = jest.fn().mockReturnValueOnce(cache);
            search.successCallback = jest.fn();

            searchResults.item_collection.entries = ['file_item1', 'file_item2'];
            searchResults.item_collection.isLoaded = true;
            cache.set('key', searchResults);
            search.finish();
            expect(search.successCallback).toHaveBeenCalledWith({
                percentLoaded: 100,
                id: 'id',
                sortBy: 'name',
                sortDirection: 'DESC',
                items: [item2, item1]
            });
        });

        test('should call success callback with 100% loaded when item collection total count is 0', () => {
            search.id = 'id';
            search.key = 'key';
            search.sortBy = 'name';
            search.sortDirection = 'DESC';
            search.getCache = jest.fn().mockReturnValueOnce(cache);
            search.successCallback = jest.fn();

            searchResults.item_collection.entries = ['file_item1', 'file_item2'];
            searchResults.item_collection.total_count = 0;
            cache.set('key', searchResults);
            search.finish();
            expect(search.successCallback).toHaveBeenCalledWith({
                percentLoaded: 100,
                id: 'id',
                sortBy: 'name',
                sortDirection: 'DESC',
                items: [item2, item1]
            });
        });

        test('should throw bad item error when item collection is missing', () => {
            sort.default = jest.fn().mockReturnValueOnce({});
            search.id = 'id';
            search.key = 'key';
            search.sortBy = 'name';
            search.sortDirection = 'DESC';
            search.getCache = jest.fn().mockReturnValueOnce(cache);
            search.successCallback = jest.fn();
            expect(search.finish.bind(search)).toThrow(Error, /Bad box item/);
            expect(sort.default).toHaveBeenCalledWith(searchResults, 'name', 'DESC', cache);
            expect(search.successCallback).not.toHaveBeenCalled();
        });

        test('should throw bad item error when item collection is missing entries', () => {
            sort.default = jest.fn();
            search.id = 'id';
            search.key = 'key';
            search.sortBy = 'name';
            search.sortDirection = 'DESC';
            search.getCache = jest.fn().mockReturnValueOnce(cache);
            search.successCallback = jest.fn();
            expect(search.finish.bind(search)).toThrow(Error, /Bad box item/);
            expect(sort.default).toHaveBeenCalledWith(searchResults, 'name', 'DESC', cache);
            expect(search.successCallback).not.toHaveBeenCalled();
        });

        test('should throw bad item error when item collection is missing total count', () => {
            sort.default = jest.fn().mockReturnValueOnce({ item_collection: { entries: [] } });
            search.id = 'id';
            search.key = 'key';
            search.sortBy = 'name';
            search.sortDirection = 'DESC';
            search.getCache = jest.fn().mockReturnValueOnce(cache);
            search.successCallback = jest.fn();
            expect(search.finish.bind(search)).toThrow(Error, /Bad box item/);
            expect(search.successCallback).not.toHaveBeenCalled();
            expect(sort.default).toHaveBeenCalledWith(searchResults, 'name', 'DESC', cache);
        });
    });
});
