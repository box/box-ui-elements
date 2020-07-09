import noop from 'lodash/noop';
import Cache from '../../utils/Cache';
import Item from '../Item';
import { fillMissingProperties } from '../../utils/fields';
import { getBadItemError, getBadPermissionsError } from '../../utils/error';
import { ERROR_CODE_SHARE_ITEM } from '../../constants';

let item;
let file;
let folder;
let cache;
const errorCode = 'foo';

jest.mock('../../utils/fields', () => ({
    fillMissingProperties: jest.fn(),
}));

jest.mock('../../utils/error', () => ({
    getBadItemError: jest.fn(),
    getBadPermissionsError: jest.fn(),
}));

const MOCK_FIELDS_LIST = ['shared_link', 'shared_link_features'];
const MOCK_FIELDS_STRING = 'shared_link,shared_link_features';

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
        let getItemStub;
        let setItemStub;
        let mergeItemStub;
        let getCacheKeySpy;
        const MOCK_UPDATED_ITEM = { shared_link: 'link' };
        const MOCK_MERGED_ITEM = { shared_link: 'link', permissions: {} };
        const MOCK_KEY = 'file_123456789';

        const createGetCacheSpy = isCached => {
            jest.spyOn(item, 'getCache').mockImplementation(() => ({
                has: jest.fn().mockReturnValue(isCached),
                get: getItemStub,
                set: setItemStub,
                merge: mergeItemStub,
            }));
        };

        beforeEach(() => {
            setItemStub = jest.fn();
            mergeItemStub = jest.fn();
            getItemStub = jest.fn().mockReturnValue(MOCK_MERGED_ITEM);
            getCacheKeySpy = jest.spyOn(item, 'getCacheKey').mockReturnValue(MOCK_KEY);
            item.id = 'id';
            item.successCallback = jest.fn();
        });

        test('should not do anything if destroyed', () => {
            jest.spyOn(item, 'isDestroyed').mockReturnValueOnce(true);
            item.shareSuccessHandler(MOCK_UPDATED_ITEM);
            expect(getCacheKeySpy).not.toHaveBeenCalled();
            expect(mergeItemStub).not.toHaveBeenCalled();
            expect(getItemStub).not.toHaveBeenCalled();
            expect(setItemStub).not.toHaveBeenCalled();
            expect(item.successCallback).not.toHaveBeenCalled();
        });

        test('should call merge() if cache has key', () => {
            createGetCacheSpy(true);
            item.shareSuccessHandler(MOCK_UPDATED_ITEM);
            expect(getCacheKeySpy).toHaveBeenCalledWith('id');
            expect(mergeItemStub).toHaveBeenCalledWith(MOCK_KEY, MOCK_UPDATED_ITEM);
            expect(setItemStub).not.toHaveBeenCalled();
            expect(getItemStub).toHaveBeenCalledWith(MOCK_KEY);
            expect(item.successCallback).toHaveBeenCalledWith(MOCK_MERGED_ITEM);
        });

        test('should call set() if cache does not have key', () => {
            createGetCacheSpy(false);
            item.shareSuccessHandler(MOCK_UPDATED_ITEM);
            expect(getCacheKeySpy).toHaveBeenCalledWith('id');
            expect(setItemStub).toHaveBeenCalledWith(MOCK_KEY, MOCK_UPDATED_ITEM);
            expect(mergeItemStub).not.toHaveBeenCalled();
            expect(getItemStub).toHaveBeenCalledWith(MOCK_KEY);
            expect(item.successCallback).toHaveBeenCalledWith(MOCK_MERGED_ITEM);
        });

        test('should call fillMissingProperties if there are fields', () => {
            createGetCacheSpy(false);
            item.shareSuccessHandler(MOCK_UPDATED_ITEM, MOCK_FIELDS_LIST);
            expect(fillMissingProperties).toHaveBeenCalledWith(MOCK_UPDATED_ITEM, MOCK_FIELDS_LIST);
        });

        test('should not call fillMissingProperties if there are no fields', () => {
            createGetCacheSpy(false);
            item.shareSuccessHandler(MOCK_UPDATED_ITEM, undefined);
            expect(fillMissingProperties).not.toHaveBeenCalled();
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

    describe('validateRequest()', () => {
        const MOCK_ITEM_ERROR = new Error('missing item data');
        const MOCK_PERMISSIONS_ERROR = new Error('missing permissions');
        const MOCK_SUFFICIENT_PERMISSIONS = {
            can_share: true,
            can_set_share_access: true,
        };
        const MOCK_ITEM_ID = '123456789';
        beforeEach(() => {
            getBadItemError.mockReturnValue(MOCK_ITEM_ERROR);
            getBadPermissionsError.mockReturnValue(MOCK_PERMISSIONS_ERROR);
        });

        test.each`
            itemID          | itemPermissions                | description
            ${undefined}    | ${MOCK_SUFFICIENT_PERMISSIONS} | ${'itemID is missing'}
            ${MOCK_ITEM_ID} | ${undefined}                   | ${'itemPermissions is missing'}
        `('should throw a bad item error if $description', ({ itemID, itemPermissions }) => {
            expect(() => item.validateRequest(itemID, itemPermissions)).toThrowError(MOCK_ITEM_ERROR);
            expect(item.errorCode).toBe(ERROR_CODE_SHARE_ITEM);
        });

        test.each`
            itemPermissions                                      | description
            ${{ can_share: false, can_set_share_access: false }} | ${'neither share nor set share access'}
            ${{ can_share: false, can_set_share_access: true }}  | ${'set share access but not share'}
            ${{ can_share: true, can_set_share_access: false }}  | ${'share but not set share access'}
        `('should throw a bad permissions error when the user can $description', ({ itemPermissions }) => {
            expect(() => item.validateRequest(MOCK_ITEM_ID, itemPermissions)).toThrowError(MOCK_PERMISSIONS_ERROR);
            expect(item.errorCode).toBe(ERROR_CODE_SHARE_ITEM);
        });

        test('should not throw an error if the request is valid', () => {
            expect(() => item.validateRequest(MOCK_ITEM_ID, MOCK_SUFFICIENT_PERMISSIONS)).not.toThrow();
            expect(item.errorCode).toBeUndefined();
        });
    });

    describe('share()', () => {
        let shareSuccessHandlerSpy;
        let errorHandlerSpy;
        let getUrlSpy;
        let validateRequestSpy;
        const MOCK_DATA = { shared_link: '', permissions: {} };
        beforeEach(() => {
            file = {
                id: 'id',
                permissions: {
                    can_share: true,
                    can_set_share_access: true,
                },
            };
            shareSuccessHandlerSpy = jest.spyOn(item, 'shareSuccessHandler');
            errorHandlerSpy = jest.spyOn(item, 'errorHandler');
            getUrlSpy = jest.spyOn(item, 'getUrl').mockReturnValue('url');
            validateRequestSpy = jest.spyOn(item, 'validateRequest').mockReturnValue(null);
            jest.spyOn(item, 'getCache').mockImplementation(() => ({
                get: jest.fn().mockReturnValue('success'),
                has: jest.fn().mockReturnValue(false),
                set: jest.fn(),
            }));
            jest.spyOn(item, 'merge');
            item.xhr = {
                put: jest.fn().mockResolvedValue({ data: MOCK_DATA }),
            };
        });

        test('should not do anything if destroyed', () => {
            jest.spyOn(item, 'isDestroyed').mockReturnValueOnce(true);
            item.xhr = null;
            return expect(item.share()).rejects.toBeUndefined();
        });

        describe('with missing data', () => {
            const MOCK_MISSING_DATA_ERROR = new Error('missing data');
            beforeEach(() => {
                validateRequestSpy.mockImplementation(() => {
                    throw MOCK_MISSING_DATA_ERROR;
                });
            });

            test('should call the error handler if id is missing', () => {
                delete file.id;
                item.xhr = null;
                item.share(file, 'access', 'success', jest.fn());
                expect(errorHandlerSpy).toHaveBeenCalledWith(MOCK_MISSING_DATA_ERROR);
            });

            test('should call the error handler if permissions is missing', () => {
                delete file.permissions;
                item.xhr = null;
                item.share(file, 'access', 'success', jest.fn());
                expect(errorHandlerSpy).toHaveBeenCalledWith(MOCK_MISSING_DATA_ERROR);
            });

            test('should call the error handler if can share is false', () => {
                delete file.permissions.can_share;
                item.xhr = null;
                item.share(file, 'access', 'success', jest.fn());
                expect(errorHandlerSpy).toHaveBeenCalledWith(MOCK_MISSING_DATA_ERROR);
            });

            test('should call the error handler if can set share access is false', () => {
                delete file.permissions.can_set_share_access;
                item.xhr = null;
                item.share(file, 'access', 'success', jest.fn());
                expect(errorHandlerSpy).toHaveBeenCalledWith(MOCK_MISSING_DATA_ERROR);
            });
        });

        test('should make xhr to share item and call success callback with access', () => {
            return item.share(file, 'access', jest.fn(), jest.fn()).then(() => {
                expect(shareSuccessHandlerSpy).toHaveBeenCalledWith(MOCK_DATA, undefined);
                expect(errorHandlerSpy).not.toHaveBeenCalled();
                expect(item.xhr.put).toHaveBeenCalledWith({
                    url: 'url',
                    data: { shared_link: { access: 'access' } },
                });
                expect(getUrlSpy).toHaveBeenCalledWith('id');
            });
        });

        test('should make xhr to share item and call success callback with access null', () => {
            return item.share(file, 'none', jest.fn(), jest.fn()).then(() => {
                expect(shareSuccessHandlerSpy).toHaveBeenCalledWith(MOCK_DATA, undefined);
                expect(errorHandlerSpy).not.toHaveBeenCalled();
                expect(item.xhr.put).toHaveBeenCalledWith({
                    url: 'url',
                    data: { shared_link: null },
                });
                expect(getUrlSpy).toHaveBeenCalledWith('id');
            });
        });

        test('should make xhr to share item and call error callback', () => {
            const error = new Error('error');
            item.xhr = {
                put: jest.fn().mockRejectedValue(error),
            };
            return item.share(file, 'access', 'success', 'error').then(() => {
                expect(errorHandlerSpy).toHaveBeenCalledWith(error);
                expect(shareSuccessHandlerSpy).not.toHaveBeenCalled();
                expect(item.xhr.put).toHaveBeenCalledWith({
                    url: 'url',
                    data: { shared_link: { access: 'access' } },
                });
                expect(getUrlSpy).toHaveBeenCalledWith('id');
            });
        });

        test('should default to noop error callback', () => {
            return item.share(file, 'access', 'success').catch(() => {
                expect(item.errorCallback).toBe(noop);
            });
        });

        test('should make an xhr with options.fields', async () => {
            await item.share(file, 'access', 'success', 'error', {
                fields: MOCK_FIELDS_LIST,
            });
            expect(shareSuccessHandlerSpy).toHaveBeenCalledWith(MOCK_DATA, MOCK_FIELDS_LIST);
            expect(item.xhr.put).toHaveBeenCalledWith({
                url: 'url',
                data: { shared_link: { access: 'access' } },
                params: { fields: MOCK_FIELDS_STRING },
            });
            expect(getUrlSpy).toHaveBeenCalledWith('id');
        });
    });

    describe('updateSharedLink', () => {
        let shareSuccessHandlerSpy;
        let getUrlSpy;
        const MOCK_PERMISSIONS = {
            can_download: false,
            can_preview: true,
        };
        const MOCK_DATA = { shared_link: { permissions: MOCK_PERMISSIONS } };
        beforeEach(() => {
            file = {
                id: 'id',
                permissions: {
                    can_share: true,
                    can_set_share_access: true,
                },
            };
            shareSuccessHandlerSpy = jest.spyOn(item, 'shareSuccessHandler');
            getUrlSpy = jest.spyOn(item, 'getUrl').mockReturnValue('url');
            jest.spyOn(item, 'validateRequest').mockReturnValue(null);
            jest.spyOn(item, 'getCache').mockImplementation(() => ({
                get: jest.fn().mockReturnValue('success'),
                has: jest.fn().mockReturnValue(false),
                set: jest.fn(),
            }));
            jest.spyOn(item, 'merge');
            item.xhr = {
                put: jest.fn().mockResolvedValue({ data: MOCK_DATA }),
            };
        });

        test.each`
            requestBody                                           | description
            ${{ permissions: MOCK_PERMISSIONS }}                  | ${'updates permissions'}
            ${{ is_password_enabled: true }}                      | ${'sets a password'}
            ${{ is_password_enabled: false }}                     | ${'removes a password'}
            ${{ unshared_at: 'time' }}                            | ${'sets an expiration date'}
            ${{ unshared_at: null }}                              | ${'removes an expiration date'}
            ${{ is_password_enabled: true, unshared_at: 'time' }} | ${'sets a password and an expiration date'}
            ${{ is_password_enabled: false, unshared_at: null }}  | ${'removes a password and an expiration date'}
        `('should make an xhr that $description', async ({ requestBody }) => {
            await item.updateSharedLink(file, requestBody, 'success', 'error');
            expect(shareSuccessHandlerSpy).toHaveBeenCalledWith(MOCK_DATA, undefined);
            expect(item.xhr.put).toHaveBeenCalledWith({
                url: 'url',
                data: { shared_link: requestBody },
            });
            expect(getUrlSpy).toHaveBeenCalledWith('id');
        });

        test('should make an xhr with a shared link request body and options.fields', async () => {
            await item.updateSharedLink(
                file,
                {
                    permissions: MOCK_PERMISSIONS,
                },
                'success',
                'error',
                { fields: MOCK_FIELDS_LIST },
            );
            expect(shareSuccessHandlerSpy).toHaveBeenCalledWith(MOCK_DATA, MOCK_FIELDS_LIST);
            expect(item.xhr.put).toHaveBeenCalledWith({
                url: 'url',
                data: { shared_link: { permissions: MOCK_PERMISSIONS } },
                params: { fields: MOCK_FIELDS_STRING },
            });
            expect(getUrlSpy).toHaveBeenCalledWith('id');
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
            getBadItemError.mockReturnValue(new Error('Bad Box item'));
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
            expect(item.deleteSuccessHandler.bind(folder)).toThrow(Error, /Bad Box item/);
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
