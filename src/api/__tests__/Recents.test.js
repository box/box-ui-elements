import Cache from '../../utils/Cache';
import { FOLDER_FIELDS_TO_FETCH } from '../../utils/fields';
import Recents from '../Recents';
import { X_REP_HINT_HEADER_DIMENSIONS_DEFAULT } from '../../constants';

describe('api/Recents', () => {
    let recents;
    let cache;
    const errorCode = 'foo';
    beforeEach(() => {
        recents = new Recents({});
        recents.errorCode = errorCode;
        cache = new Cache();
    });

    describe('getCacheKey()', () => {
        test('should return correct key', () => {
            expect(recents.getCacheKey('foo')).toBe('recents_foo');
        });
    });

    describe('getUrl()', () => {
        test('should return correct recents api url', () => {
            expect(recents.getUrl()).toBe('https://api.box.com/2.0/recent_items');
        });
    });

    describe('recents()', () => {
        test('should not do anything if destroyed', () => {
            recents.isDestroyed = jest.fn().mockReturnValueOnce(true);
            recents.recentsRequest = jest.fn();
            recents.getCache = jest.fn();
            recents.getCacheKey = jest.fn();
            recents.recents('id', 'success', 'fail');
            expect(recents.recentsRequest).not.toHaveBeenCalled();
            expect(recents.getCache).not.toHaveBeenCalled();
            expect(recents.getCacheKey).not.toHaveBeenCalled();
        });
        test('should save args and make recents request when not cached', () => {
            recents.recentsRequest = jest.fn();
            recents.getCache = jest.fn().mockReturnValueOnce(cache);
            recents.getCacheKey = jest.fn().mockReturnValueOnce('key');
            recents.recents('id', 'success', 'fail');
            expect(recents.getCacheKey).toHaveBeenCalledWith('id');
            expect(recents.id).toBe('id');
            expect(recents.successCallback).toBe('success');
            expect(recents.errorCallback).toBe('fail');
            expect(recents.key).toBe('key');
        });
        test('should save args and not make recents request when cached', () => {
            cache.set('key', 'value');
            recents.finish = jest.fn();
            recents.getCache = jest.fn().mockReturnValueOnce(cache);
            recents.getCacheKey = jest.fn().mockReturnValueOnce('key');
            recents.recents('id', 'success', 'fail');
            expect(recents.getCacheKey).toHaveBeenCalledWith('id');
            expect(recents.id).toBe('id');
            expect(recents.successCallback).toBe('success');
            expect(recents.errorCallback).toBe('fail');
            expect(recents.key).toBe('key');
        });
        test('should save args and make recents request when cached but forced to fetch', () => {
            cache.set('key', 'value');
            recents.recentsRequest = jest.fn();
            recents.getCache = jest.fn().mockReturnValueOnce(cache);
            recents.getCacheKey = jest.fn().mockReturnValueOnce('key');
            recents.recents('id', 'success', 'fail', { forceFetch: true });
            expect(recents.getCacheKey).toHaveBeenCalledWith('id');
            expect(recents.id).toBe('id');
            expect(recents.successCallback).toBe('success');
            expect(recents.errorCallback).toBe('fail');
            expect(recents.key).toBe('key');
        });
    });

    describe('recentsRequest()', () => {
        beforeEach(() => {
            recents.id = 'id';
        });

        test('should not do anything if destroyed', () => {
            recents.isDestroyed = jest.fn().mockReturnValueOnce(true);
            recents.xhr = null;
            return expect(recents.recentsRequest()).rejects.toBeUndefined();
        });
        test('should make xhr get recents and call success callback', () => {
            recents.recentsSuccessHandler = jest.fn();
            recents.recentsErrorHandler = jest.fn();
            recents.includePreviewFields = true;
            recents.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve('success')),
            };
            return recents.recentsRequest().then(() => {
                expect(recents.recentsSuccessHandler).toHaveBeenCalledWith('success');
                expect(recents.recentsErrorHandler).not.toHaveBeenCalled();
                expect(recents.xhr.get).toHaveBeenCalledWith({
                    url: 'https://api.box.com/2.0/recent_items',
                    params: { fields: FOLDER_FIELDS_TO_FETCH.toString() },
                    headers: { 'X-Rep-Hints': X_REP_HINT_HEADER_DIMENSIONS_DEFAULT },
                });
            });
        });
        test('should make xhr to get recents and call error callback', () => {
            const error = new Error('error');
            recents.recentsSuccessHandler = jest.fn();
            recents.recentsErrorHandler = jest.fn();
            recents.includePreviewFields = true;
            recents.includePreviewSidebarFields = true;
            recents.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve(error)),
            };

            return recents.recentsRequest().then(() => {
                expect(recents.recentsSuccessHandler).toHaveBeenCalledWith(error);
                expect(recents.recentsErrorHandler).not.toHaveBeenCalled();
                expect(recents.xhr.get).toHaveBeenCalledWith({
                    url: 'https://api.box.com/2.0/recent_items',
                    params: { fields: FOLDER_FIELDS_TO_FETCH.toString() },
                    headers: { 'X-Rep-Hints': X_REP_HINT_HEADER_DIMENSIONS_DEFAULT },
                });
            });
        });
    });

    describe('recentsErrorHandler()', () => {
        test('should not do anything if destroyed', () => {
            recents.isDestroyed = jest.fn().mockReturnValueOnce(true);
            recents.errorCallback = jest.fn();
            recents.recentsErrorHandler('foo', errorCode);
            expect(recents.errorCallback).not.toHaveBeenCalled();
        });
        test('should call error callback', () => {
            recents.errorCallback = jest.fn();
            recents.recentsErrorHandler('foo', errorCode);
            expect(recents.errorCallback).toHaveBeenCalledWith('foo', errorCode);
        });
    });

    describe('recentsSuccessHandler()', () => {
        test('should not do anything if destroyed', () => {
            recents.isDestroyed = jest.fn().mockReturnValueOnce(true);
            recents.finish = jest.fn();
            recents.recentsSuccessHandler('foo');
            expect(recents.finish).not.toHaveBeenCalled();
        });
        test('should parse the response, flatten the collection and call finish', () => {
            const item1 = {
                id: 'item1',
                type: 'file',
                path_collection: {
                    entries: [{ id: 'id0' }, { id: 'id1' }, { id: 'id2' }],
                },
            };
            const item2 = {
                id: 'item2',
                type: 'file',
                path_collection: {
                    entries: [{ id: 'id4' }, { id: 'id5' }, { id: 'id6' }],
                },
            };
            const item3 = {
                id: 'item3',
                type: 'file',
                path_collection: {
                    entries: [{ id: 'id0' }, { id: 'id2' }, { id: 'id3' }],
                },
            };
            const response = {
                data: {
                    order: {
                        by: 'by',
                        direction: 'direction',
                    },
                    entries: [
                        {
                            interacted_at: 'interacted_at1',
                            item: item1,
                        },
                        {
                            interacted_at: 'interacted_at2',
                            item: item2,
                        },
                        {
                            interacted_at: 'interacted_at3',
                            item: item3,
                        },
                    ],
                },
            };

            recents.options = { cache };
            recents.id = 'id2'; // root folder
            recents.key = 'key';
            recents.finish = jest.fn();
            recents.getCache = jest.fn().mockReturnValueOnce(cache);
            recents.recentsSuccessHandler(response);

            expect(cache.get('key')).toEqual({
                item_collection: {
                    entries: ['file_item1', 'file_item3'],
                    order: [
                        {
                            by: 'by',
                            direction: 'direction',
                        },
                    ],
                },
            });
            expect(cache.get('file_item1')).toEqual({ ...item1, interacted_at: 'interacted_at1' });
            expect(cache.get('file_item3')).toEqual({ ...item3, interacted_at: 'interacted_at3' });
            expect(cache.get('file_item2')).toBeUndefined();
        });
    });

    describe('finish()', () => {
        const item1 = {
            id: 'item1',
            name: 'item1',
            type: 'file',
            path_collection: {
                entries: [{ id: 'id0' }, { id: 'id1' }, { id: 'id2' }],
            },
        };
        const item2 = {
            id: 'item2',
            name: 'item2',
            type: 'file',
            path_collection: {
                entries: [{ id: 'id4' }, { id: 'id5' }, { id: 'id6' }],
            },
        };
        const item3 = {
            id: 'item3',
            name: 'item3',
            type: 'file',
            path_collection: {
                entries: [{ id: 'id0' }, { id: 'id2' }, { id: 'id3' }],
            },
        };
        const recent = {
            item_collection: {
                entries: ['file_item1', 'file_item2', 'file_item3'],
                order: [
                    {
                        by: 'by',
                        direction: 'direction',
                    },
                ],
            },
        };

        beforeEach(() => {
            cache.set('file_item1', item1);
            cache.set('file_item2', item2);
            cache.set('file_item3', item3);
            cache.set('key', recent);
        });

        test('should not do anything if destroyed', () => {
            recents.successCallback = jest.fn();
            recents.isDestroyed = jest.fn().mockReturnValueOnce(true);
            recents.finish();
            expect(recents.successCallback).not.toHaveBeenCalled();
        });

        test('should call success callback with proper collection', () => {
            recents.id = 'id';
            recents.key = 'key';
            recents.getCache = jest.fn().mockReturnValueOnce(cache);
            recents.successCallback = jest.fn();
            recents.finish();
            expect(recents.successCallback).toHaveBeenCalledWith({
                percentLoaded: 100,
                id: 'id',
                sortBy: 'date',
                sortDirection: 'DESC',
                items: [item1, item2, item3],
            });
        });

        test('should throw bad item error when item collection is missing', () => {
            cache.set('key', {});
            recents.id = 'id';
            recents.key = 'key';
            recents.getCache = jest.fn().mockReturnValueOnce(cache);
            recents.successCallback = jest.fn();
            expect(recents.finish.bind(recents)).toThrow(Error, /Bad box item/);
            expect(recents.successCallback).not.toHaveBeenCalled();
        });

        test('should throw bad item error when item collection is missing entries', () => {
            cache.set('key', { item_collection: {} });
            recents.id = 'id';
            recents.key = 'key';
            recents.getCache = jest.fn().mockReturnValueOnce(cache);
            recents.successCallback = jest.fn();
            expect(recents.finish.bind(recents)).toThrow(Error, /Bad box item/);
            expect(recents.successCallback).not.toHaveBeenCalled();
        });
    });
});
