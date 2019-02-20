import noop from 'lodash/noop';
import Cache from '../../utils/Cache';
import Item from '../Item';

let item;
let file;
let folder;
let cache;
const errorCode = 'foo';

describe('api/Item', () => {
    beforeEach(() => {
        item = new Item({});
        cache = new Cache();
    });

    describe('getParentCacheKey()', () => {
        test('should return correct key', () => {
            expect(item.getParentCacheKey('foo')).toBe('folder_foo');
        });
    });

    describe('getCacheKey()', () => {
        test('should return correct key', () => {
            expect(item.getCacheKey('foo')).toBe('getCacheKey(foo) should be overriden');
        });
    });

    describe('getUrl()', () => {
        test('should return correct folder api url', () => {
            expect(item.getUrl('foo')).toBe('getUrl(foo) should be overriden');
        });
    });

    describe('errorHandler()', () => {
        beforeEach(() => {
            item.errorCode = errorCode;
        });
        test('should not do anything if destroyed', () => {
            item.isDestroyed = jest.fn().mockReturnValueOnce(true);
            item.errorCallback = jest.fn();
            item.errorHandler('foo');
            expect(item.errorCallback).not.toHaveBeenCalled();
        });

        test('should call error callback even when no response', () => {
            item.errorCallback = jest.fn();
            item.errorHandler('foo');
            expect(item.errorCallback).toHaveBeenCalled();
        });

        test('should call error callback with response data', () => {
            item.errorCallback = jest.fn();
            item.errorHandler({ response: { data: 'foo' } });
            expect(item.errorCallback).toHaveBeenCalledWith('foo', errorCode);
        });
    });

    describe('merge()', () => {
        test('should merge new value', () => {
            cache.set('key', {
                foo: 'foo',
            });
            item.getCache = jest.fn().mockReturnValueOnce(cache);
            const result = item.merge('key', 'foo', 'bar');
            expect(result.foo).toEqual('bar');
        });
    });

    describe('postDeleteCleanup()', () => {
        test('should not do anything if destroyed', () => {
            item.isDestroyed = jest.fn().mockReturnValueOnce(true);
            item.errorCallback = jest.fn();
            item.postDeleteCleanup();
            expect(item.errorCallback).not.toHaveBeenCalled();
        });
        test('should unset cache and call success callback', () => {
            const unsetAllMock = jest.fn();
            cache.set('key', {
                foo: 'foo',
            });
            item.successCallback = jest.fn();
            item.getCache = () => ({
                unsetAll: unsetAllMock,
            });
            item.postDeleteCleanup();
            expect(item.successCallback).toHaveBeenCalled();
            expect(unsetAllMock).toHaveBeenCalledWith('search_');
        });
    });

    describe('renameSuccessHandler()', () => {
        test('should not do anything if destroyed', () => {
            item.isDestroyed = jest.fn().mockReturnValueOnce(true);
            const unsetAllMock = jest.fn();
            item.id = 'id';
            item.getCache = () => ({
                unsetAll: unsetAllMock,
            });
            item.getCacheKey = jest.fn();
            item.merge = jest.fn();
            item.successCallback = jest.fn();
            item.renameSuccessHandler({
                data: {
                    name: 'name',
                },
            });
            expect(unsetAllMock).not.toHaveBeenCalled();
            expect(item.getCacheKey).not.toHaveBeenCalled();
            expect(item.merge).not.toHaveBeenCalled();
        });
        test('should unset cache and call merge', () => {
            const unsetAllMock = jest.fn();
            item.id = 'id';
            item.getCache = () => ({
                unsetAll: unsetAllMock,
            });
            item.getCacheKey = jest.fn().mockReturnValueOnce('key');
            item.merge = jest.fn();
            item.successCallback = jest.fn();
            item.renameSuccessHandler({
                data: {
                    name: 'name',
                },
            });
            expect(unsetAllMock).toHaveBeenCalledWith('search_');
            expect(item.getCacheKey).toHaveBeenCalledWith('id');
            expect(item.merge).toHaveBeenCalledWith('key', 'name', 'name');
        });
    });

    describe('shareSuccessHandler()', () => {
        test('should not do anything if destroyed', () => {
            item.isDestroyed = jest.fn().mockReturnValueOnce(true);
            item.id = 'id';
            item.getCacheKey = jest.fn();
            item.merge = jest.fn();
            item.successCallback = jest.fn();
            item.shareSuccessHandler({
                data: {
                    shared_link: 'link',
                },
            });
            expect(item.getCacheKey).not.toHaveBeenCalled();
            expect(item.merge).not.toHaveBeenCalled();
        });
        test('should call merge', () => {
            item.id = 'id';
            item.getCacheKey = jest.fn().mockReturnValueOnce('key');
            item.merge = jest.fn();
            item.successCallback = jest.fn();
            item.shareSuccessHandler({
                data: {
                    shared_link: 'link',
                },
            });
            expect(item.getCacheKey).toHaveBeenCalledWith('id');
            expect(item.merge).toHaveBeenCalledWith('key', 'shared_link', 'link');
        });
    });

    describe('rename()', () => {
        beforeEach(() => {
            file = {
                id: 'id',
                permissions: {
                    can_rename: true,
                },
            };
        });

        test('should not do anything if destroyed', () => {
            item.isDestroyed = jest.fn().mockReturnValueOnce(true);
            item.xhr = null;
            return expect(item.rename()).rejects.toBeUndefined();
        });

        test('should not do anything if id is missing', () => {
            delete file.id;
            item.xhr = null;
            return expect(item.rename(file, 'name', 'success', jest.fn())).rejects.toBeUndefined();
        });

        test('should not do anything if permissions is missing', () => {
            delete file.permissions;
            item.xhr = null;
            return expect(item.rename(file, 'name', 'success', jest.fn())).rejects.toBeUndefined();
        });

        test('should not do anything if can rename is false', () => {
            delete file.permissions.can_rename;
            item.xhr = null;
            return expect(item.rename(file, 'name', 'success', jest.fn())).rejects.toBeUndefined();
        });

        test('should make xhr to rename item and call success callback', () => {
            item.renameSuccessHandler = jest.fn();
            item.errorHandler = jest.fn();
            item.getUrl = jest.fn().mockReturnValueOnce('url');
            item.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.resolve('success')),
            };
            return item.rename(file, 'name', 'success', 'error').then(() => {
                expect(item.renameSuccessHandler).toHaveBeenCalledWith('success');
                expect(item.errorHandler).not.toHaveBeenCalled();
                expect(item.successCallback).toBe('success');
                expect(item.errorCallback).toBe('error');
                expect(item.id).toBe('id');
                expect(item.xhr.put).toHaveBeenCalledWith({
                    url: 'url',
                    data: { name: 'name' },
                });
                expect(item.getUrl).toHaveBeenCalledWith('id');
            });
        });

        test('should make xhr to rename item and call error callback', () => {
            const error = new Error('error');
            item.renameSuccessHandler = jest.fn();
            item.errorHandler = jest.fn();
            item.getUrl = jest.fn().mockReturnValueOnce('url');
            item.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.reject(error)),
            };
            return item.rename(file, 'name', 'success', 'error').then(() => {
                expect(item.errorHandler).toHaveBeenCalledWith(error);
                expect(item.renameSuccessHandler).not.toHaveBeenCalled();
                expect(item.successCallback).toBe('success');
                expect(item.errorCallback).toBe('error');
                expect(item.id).toBe('id');
                expect(item.xhr.put).toHaveBeenCalledWith({
                    url: 'url',
                    data: { name: 'name' },
                });
                expect(item.getUrl).toHaveBeenCalledWith('id');
            });
        });

        test('should default to noop error callback', () => {
            item.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.resolve('success')),
            };
            return item.rename(file, 'name', 'success').catch(() => {
                expect(item.errorCallback).toBe(noop);
            });
        });
    });

    describe('share()', () => {
        beforeEach(() => {
            file = {
                id: 'id',
                permissions: {
                    can_share: true,
                    can_set_share_access: true,
                },
            };
        });

        test('should not do anything if destroyed', () => {
            item.isDestroyed = jest.fn().mockReturnValueOnce(true);
            item.xhr = null;
            return expect(item.share()).rejects.toBeUndefined();
        });

        test('should not do anything if id is missing', () => {
            delete file.id;
            item.xhr = null;
            return expect(item.share(file, 'access', 'success', jest.fn())).rejects.toBeUndefined();
        });

        test('should not do anything if permissions is missing', () => {
            delete file.permissions;
            item.xhr = null;
            return expect(item.share(file, 'access', 'success', jest.fn())).rejects.toBeUndefined();
        });

        test('should not do anything if can share is false', () => {
            delete file.permissions.can_share;
            item.xhr = null;
            return expect(item.share(file, 'access', 'success', jest.fn())).rejects.toBeUndefined();
        });

        test('should not do anything if can set share access is false', () => {
            delete file.permissions.can_set_share_access;
            item.xhr = null;
            return expect(item.share(file, 'access', 'success', jest.fn())).rejects.toBeUndefined();
        });

        test('should make xhr to share item and call success callback with access', () => {
            item.shareSuccessHandler = jest.fn();
            item.errorHandler = jest.fn();
            item.getUrl = jest.fn().mockReturnValueOnce('url');
            item.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.resolve('success')),
            };
            return item.share(file, 'access', 'success', 'error').then(() => {
                expect(item.shareSuccessHandler).toHaveBeenCalledWith('success');
                expect(item.errorHandler).not.toHaveBeenCalled();
                expect(item.successCallback).toBe('success');
                expect(item.errorCallback).toBe('error');
                expect(item.id).toBe('id');
                expect(item.xhr.put).toHaveBeenCalledWith({
                    url: 'url',
                    data: { shared_link: { access: 'access' } },
                });
                expect(item.getUrl).toHaveBeenCalledWith('id');
            });
        });

        test('should make xhr to share item and call success callback with access null', () => {
            item.shareSuccessHandler = jest.fn();
            item.errorHandler = jest.fn();
            item.getUrl = jest.fn().mockReturnValueOnce('url');
            item.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.resolve('success')),
            };
            return item.share(file, 'none', 'success', 'error').then(() => {
                expect(item.shareSuccessHandler).toHaveBeenCalledWith('success');
                expect(item.errorHandler).not.toHaveBeenCalled();
                expect(item.successCallback).toBe('success');
                expect(item.errorCallback).toBe('error');
                expect(item.id).toBe('id');
                expect(item.xhr.put).toHaveBeenCalledWith({
                    url: 'url',
                    data: { shared_link: null },
                });
                expect(item.getUrl).toHaveBeenCalledWith('id');
            });
        });

        test('should make xhr to share item and call error callback', () => {
            const error = new Error('error');
            item.shareSuccessHandler = jest.fn();
            item.errorHandler = jest.fn();
            item.getUrl = jest.fn().mockReturnValueOnce('url');
            item.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.reject(error)),
            };
            return item.share(file, 'access', 'success', 'error').then(() => {
                expect(item.errorHandler).toHaveBeenCalledWith(error);
                expect(item.shareSuccessHandler).not.toHaveBeenCalled();
                expect(item.successCallback).toBe('success');
                expect(item.errorCallback).toBe('error');
                expect(item.id).toBe('id');
                expect(item.xhr.put).toHaveBeenCalledWith({
                    url: 'url',
                    data: { shared_link: { access: 'access' } },
                });
                expect(item.getUrl).toHaveBeenCalledWith('id');
            });
        });

        test('should default to noop error callback', () => {
            item.xhr = {
                put: jest.fn().mockReturnValueOnce(Promise.resolve('success')),
            };
            return item.share(file, 'access', 'success').catch(() => {
                expect(item.errorCallback).toBe(noop);
            });
        });
    });

    describe('deleteItem()', () => {
        beforeEach(() => {
            file = {
                id: 'id',
                parent: {
                    id: 'parentId',
                },
                type: 'file',
                permissions: {
                    can_delete: true,
                },
            };
        });

        test('should not do anything if destroyed', () => {
            item.isDestroyed = jest.fn().mockReturnValueOnce(true);
            item.xhr = null;
            return expect(item.deleteItem()).rejects.toBeUndefined();
        });

        test('should not do anything if id is missing', () => {
            delete file.id;
            item.xhr = null;
            return expect(item.deleteItem(file, 'success', jest.fn())).rejects.toBeUndefined();
        });

        test('should not do anything if parent is missing', () => {
            delete file.parent;
            item.xhr = null;
            return expect(item.deleteItem(file, 'success', jest.fn())).rejects.toBeUndefined();
        });

        test('should not do anything if parent id is missing', () => {
            delete file.parent.id;
            item.xhr = null;
            return expect(item.deleteItem(file, 'success', jest.fn())).rejects.toBeUndefined();
        });

        test('should not do anything if type is missing', () => {
            delete file.type;
            item.xhr = null;
            return expect(item.deleteItem(file, 'success', jest.fn())).rejects.toBeUndefined();
        });

        test('should not do anything if permissions is missing', () => {
            delete file.permissions;
            item.xhr = null;
            return expect(item.deleteItem(file, 'success', jest.fn())).rejects.toBeUndefined();
        });

        test('should not do anything if can delete is false', () => {
            delete file.permissions.can_delete;
            item.xhr = null;
            return expect(item.deleteItem(file, 'success', jest.fn())).rejects.toBeUndefined();
        });

        test('should make xhr to delete file and call success callback', () => {
            item.deleteSuccessHandler = jest.fn();
            item.errorHandler = jest.fn();
            item.getUrl = jest.fn().mockReturnValueOnce('url');
            item.xhr = {
                delete: jest.fn().mockReturnValueOnce(Promise.resolve('success')),
            };
            return item.deleteItem(file, 'success', 'error').then(() => {
                expect(item.deleteSuccessHandler).toHaveBeenCalledWith('success');
                expect(item.errorHandler).not.toHaveBeenCalled();
                expect(item.successCallback).toBe('success');
                expect(item.errorCallback).toBe('error');
                expect(item.id).toBe('id');
                expect(item.parentId).toBe('parentId');
                expect(item.xhr.delete).toHaveBeenCalledWith({ url: 'url' });
                expect(item.getUrl).toHaveBeenCalledWith('id');
            });
        });

        test('should make xhr to delete folder and call success callback', () => {
            file.type = 'folder';
            item.deleteSuccessHandler = jest.fn();
            item.errorHandler = jest.fn();
            item.getUrl = jest.fn().mockReturnValueOnce('url');
            item.xhr = {
                delete: jest.fn().mockReturnValueOnce(Promise.resolve('success')),
            };
            return item.deleteItem(file, 'success', 'error').then(() => {
                expect(item.deleteSuccessHandler).toHaveBeenCalledWith('success');
                expect(item.errorHandler).not.toHaveBeenCalled();
                expect(item.successCallback).toBe('success');
                expect(item.errorCallback).toBe('error');
                expect(item.id).toBe('id');
                expect(item.parentId).toBe('parentId');
                expect(item.xhr.delete).toHaveBeenCalledWith({
                    url: 'url?recursive=true',
                });
                expect(item.getUrl).toHaveBeenCalledWith('id');
            });
        });

        test('should make xhr to share item and call error callback', () => {
            const error = new Error('error');
            item.deleteSuccessHandler = jest.fn();
            item.errorHandler = jest.fn();
            item.getUrl = jest.fn().mockReturnValueOnce('url');
            item.xhr = {
                delete: jest.fn().mockReturnValueOnce(Promise.reject(error)),
            };
            return item.deleteItem(file, 'success', 'error').then(() => {
                expect(item.errorHandler).toHaveBeenCalledWith(error);
                expect(item.deleteSuccessHandler).not.toHaveBeenCalled();
                expect(item.successCallback).toBe('success');
                expect(item.errorCallback).toBe('error');
                expect(item.id).toBe('id');
                expect(item.parentId).toBe('parentId');
                expect(item.xhr.delete).toHaveBeenCalledWith({ url: 'url' });
                expect(item.getUrl).toHaveBeenCalledWith('id');
            });
        });
        test('should default to noop error callback', () => {
            item.xhr = {
                delete: jest.fn().mockReturnValueOnce(Promise.resolve('success')),
            };
            return item.deleteItem(file, 'success').catch(() => {
                expect(item.errorCallback).toBe(noop);
            });
        });
    });

    describe('deleteSuccessHandler()', () => {
        beforeEach(() => {
            folder = {
                id: 'parentId',
                item_collection: {
                    total_count: 4,
                    entries: ['file_item1', 'child', 'file_item2', 'file_item3'],
                },
            };
        });

        test('should not do anything if destroyed', () => {
            item.isDestroyed = jest.fn().mockReturnValueOnce(true);
            item.postDeleteCleanup = jest.fn();
            item.deleteSuccessHandler();
            expect(item.postDeleteCleanup).not.toHaveBeenCalled();
        });

        test('should parse the response, flatten the collection and call finish', () => {
            cache.set('parent', folder);
            item.id = 'id';
            item.parentId = 'parentId';
            item.postDeleteCleanup = jest.fn();
            item.getCache = jest.fn().mockReturnValueOnce(cache);
            item.getCacheKey = jest.fn().mockReturnValueOnce('child');
            item.getParentCacheKey = jest.fn().mockReturnValueOnce('parent');
            item.merge = jest.fn();
            item.successCallback = jest.fn();
            item.deleteSuccessHandler();

            expect(cache.get('parent')).toEqual({
                id: 'parentId',
                item_collection: {
                    total_count: 3,
                    entries: ['file_item1', 'file_item2', 'file_item3'],
                },
            });
            expect(cache.get('child')).toBe(undefined);
            expect(item.getCacheKey).toHaveBeenCalledWith('id');
            expect(item.postDeleteCleanup).toHaveBeenCalled();
            expect(item.getParentCacheKey).toHaveBeenCalledWith('parentId');
            expect(item.merge).toHaveBeenCalledWith('parent', 'item_collection', {
                total_count: 3,
                entries: ['file_item1', 'file_item2', 'file_item3'],
            });
        });

        test('should throw bad item error when entries is missing', () => {
            delete folder.item_collection.entries;
            cache.set('parent', folder);

            item.id = 'id';
            item.parentId = 'parentId';
            item.postDeleteCleanup = jest.fn();
            item.getCache = jest.fn().mockReturnValueOnce(cache);
            item.getCacheKey = jest.fn();
            item.getParentCacheKey = jest.fn().mockReturnValueOnce('parent');
            expect(item.deleteSuccessHandler.bind(folder)).toThrow(Error, /Bad box item/);
            expect(item.getCacheKey).not.toHaveBeenCalled();
            expect(item.postDeleteCleanup).not.toHaveBeenCalled();
            expect(item.getParentCacheKey).toHaveBeenCalledWith('parentId');
        });

        test('should just cleanup when parent folder is not there', () => {
            item.parentId = 'parentId';
            item.postDeleteCleanup = jest.fn();
            item.getCache = jest.fn().mockReturnValueOnce(cache);
            item.getCacheKey = jest.fn();
            item.getParentCacheKey = jest.fn().mockReturnValueOnce('parent');
            item.deleteSuccessHandler();
            expect(item.getCacheKey).not.toHaveBeenCalled();
            expect(item.postDeleteCleanup).toHaveBeenCalled();
            expect(item.getParentCacheKey).toHaveBeenCalledWith('parentId');
        });

        test('should just cleanup when parent folders item collection is not there', () => {
            delete folder.item_collection;
            cache.set('parent', folder);

            item.parentId = 'parentId';
            item.postDeleteCleanup = jest.fn();
            item.getCache = jest.fn().mockReturnValueOnce(cache);
            item.getCacheKey = jest.fn();
            item.getParentCacheKey = jest.fn().mockReturnValueOnce('parent');
            item.deleteSuccessHandler();
            expect(item.getCacheKey).not.toHaveBeenCalled();
            expect(item.postDeleteCleanup).toHaveBeenCalled();
            expect(item.getParentCacheKey).toHaveBeenCalledWith('parentId');
        });
    });
});
