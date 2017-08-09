/* eslint-disable no-underscore-dangle */
/* eslint-disable arrow-body-style */

import noop from 'lodash.noop';
import Item from '../Item';
import Cache from '../../util/Cache';

let item;
let file;
let folder;
let cache;
const sandbox = sinon.sandbox.create();

describe('api/Item', () => {
    beforeEach(() => {
        item = new Item();
        cache = new Cache();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('getParentCacheKey()', () => {
        it('should return correct key', () => {
            expect(item.getParentCacheKey('foo')).to.equal('folder_foo');
        });
    });

    describe('getCacheKey()', () => {
        it('should return correct key', () => {
            expect(item.getCacheKey('foo')).to.equal('getCacheKey(foo) should be overriden');
        });
    });

    describe('getUrl()', () => {
        it('should return correct folder api url', () => {
            expect(item.getUrl('foo')).to.equal('getUrl(foo) should be overriden');
        });
    });

    describe('errorHandler()', () => {
        it('should not do anything if destroyed', () => {
            item.isDestroyed = sandbox.mock().returns(true);
            item.errorCallback = sandbox.mock().never();
            item.errorHandler('foo');
        });
        it('should not do anything if no response', () => {
            item.errorCallback = sandbox.mock().never();
            item.errorHandler('foo');
        });
        it('should call error callback', () => {
            const json = () => {
                return {
                    then: sandbox.mock().withArgs(item.errorCallback)
                };
            };
            item.errorHandler({ response: { json } });
        });
    });

    describe('merge()', () => {
        it('should not do anything if destroyed', () => {
            item.isDestroyed = sandbox.mock().returns(true);
            item.errorCallback = sandbox.mock().never();
            item.merge('foo', 'bar', 'baz');
        });
        it('should merge new value', () => {
            cache.set('key', {
                foo: 'foo'
            });
            item.getCache = sandbox.mock().returns(cache);
            item.successCallback = sandbox.mock().withArgs({
                foo: 'bar'
            });
            item.merge('key', 'foo', 'bar');
        });
    });

    describe('postDeleteCleanup()', () => {
        it('should not do anything if destroyed', () => {
            item.isDestroyed = sandbox.mock().returns(true);
            item.errorCallback = sandbox.mock().never();
            item.postDeleteCleanup();
        });
        it('should unset cache and call success callback', () => {
            cache.set('key', {
                foo: 'foo'
            });
            item.getCache = () => {
                return {
                    unsetAll: sandbox.mock().withArgs('search_')
                };
            };
            item.successCallback = sandbox.mock();
            item.postDeleteCleanup();
        });
    });

    describe('renameSuccessHandler()', () => {
        it('should unset cache and call merge', () => {
            item.id = 'id';
            item.getCache = () => {
                return {
                    unsetAll: sandbox.mock().withArgs('search_')
                };
            };
            item.getCacheKey = sandbox.mock().withArgs('id').returns('key');
            item.merge = sandbox.mock().withArgs('key', 'name', 'name');
            item.renameSuccessHandler({
                name: 'name'
            });
        });
    });

    describe('shareSuccessHandler()', () => {
        it('should call merge', () => {
            item.id = 'id';
            item.getCacheKey = sandbox.mock().withArgs('id').returns('key');
            item.merge = sandbox.mock().withArgs('key', 'shared_link', 'link');
            item.shareSuccessHandler({
                shared_link: 'link'
            });
        });
    });

    describe('rename()', () => {
        it('should not do anything if destroyed', () => {
            item.isDestroyed = sandbox.mock().returns(true);
            item.xhr = null;
            return item.rename().should.be.rejected;
        });
        it('should make xhr to rename item and call success callback', () => {
            item.renameSuccessHandler = sandbox.mock().withArgs('success');
            item.errorHandler = sandbox.mock().never();
            item.getUrl = sandbox.mock().withArgs('id').returns('url');
            item.xhr = {
                put: sandbox.mock().withArgs('url', { name: 'name' }).returns(Promise.resolve('success'))
            };
            return item.rename('id', 'name', 'success', 'error').then(() => {
                expect(item.successCallback).to.equal('success');
                expect(item.errorCallback).to.equal('error');
                expect(item.id).to.equal('id');
            });
        });
        it('should make xhr to rename item and call error callback', () => {
            item.renameSuccessHandler = sandbox.mock().never();
            item.errorHandler = sandbox.mock().withArgs('error');
            item.getUrl = sandbox.mock().withArgs('id').returns('url');
            item.xhr = {
                put: sandbox.mock().withArgs('url', { name: 'name' }).returns(Promise.reject('error'))
            };
            return item.rename('id', 'name', 'success', 'error').then(() => {
                expect(item.successCallback).to.equal('success');
                expect(item.errorCallback).to.equal('error');
                expect(item.id).to.equal('id');
            });
        });
        it('should default to noop error callback', () => {
            item.xhr = {
                put: sandbox.mock().returns(Promise.resolve('success'))
            };
            item.rename('id', 'name', 'success');
            expect(item.errorCallback).to.equal(noop);
        });
    });

    describe('share()', () => {
        it('should not do anything if destroyed', () => {
            item.isDestroyed = sandbox.mock().returns(true);
            item.xhr = null;
            return item.share().should.be.rejected;
        });
        it('should make xhr to share item and call success callback with access', () => {
            item.shareSuccessHandler = sandbox.mock().withArgs('success');
            item.errorHandler = sandbox.mock().never();
            item.getUrl = sandbox.mock().withArgs('id').returns('url');
            item.xhr = {
                put: sandbox
                    .mock()
                    .withArgs('url', { shared_link: { access: 'access' } })
                    .returns(Promise.resolve('success'))
            };
            return item.share('id', 'access', 'success', 'error').then(() => {
                expect(item.successCallback).to.equal('success');
                expect(item.errorCallback).to.equal('error');
                expect(item.id).to.equal('id');
            });
        });
        it('should make xhr to share item and call success callback with access null', () => {
            item.shareSuccessHandler = sandbox.mock().withArgs('success');
            item.errorHandler = sandbox.mock().never();
            item.getUrl = sandbox.mock().withArgs('id').returns('url');
            item.xhr = {
                put: sandbox.mock().withArgs('url', { shared_link: null }).returns(Promise.resolve('success'))
            };
            return item.share('id', 'none', 'success', 'error').then(() => {
                expect(item.successCallback).to.equal('success');
                expect(item.errorCallback).to.equal('error');
                expect(item.id).to.equal('id');
            });
        });
        it('should make xhr to share item and call error callback', () => {
            item.shareSuccessHandler = sandbox.mock().never();
            item.errorHandler = sandbox.mock().withArgs('error');
            item.getUrl = sandbox.mock().withArgs('id').returns('url');
            item.xhr = {
                put: sandbox
                    .mock()
                    .withArgs('url', { shared_link: { access: 'access' } })
                    .returns(Promise.reject('error'))
            };
            return item.share('id', 'access', 'success', 'error').then(() => {
                expect(item.successCallback).to.equal('success');
                expect(item.errorCallback).to.equal('error');
                expect(item.id).to.equal('id');
            });
        });
        it('should default to noop error callback', () => {
            item.xhr = {
                put: sandbox.mock().returns(Promise.resolve('success'))
            };
            item.share('id', 'name', 'success');
            expect(item.errorCallback).to.equal(noop);
        });
    });

    describe('delete()', () => {
        beforeEach(() => {
            file = {
                id: 'id',
                parent: {
                    id: 'parentId'
                },
                type: 'file',
                permissions: {
                    can_delete: true
                }
            };
        });

        it('should not do anything if destroyed', () => {
            item.isDestroyed = sandbox.mock().returns(true);
            item.xhr = null;
            return item.delete().should.be.rejected;
        });

        it('should not do anything if id is missing', () => {
            delete file.id;
            item.xhr = null;
            return item.delete(file, 'success', sandbox.mock()).should.be.rejected;
        });

        it('should not do anything if parent is missing', () => {
            delete file.parent;
            item.xhr = null;
            return item.delete(file, 'success', sandbox.mock()).should.be.rejected;
        });

        it('should not do anything if parent id is missing', () => {
            delete file.parent.id;
            item.xhr = null;
            return item.delete(file, 'success', sandbox.mock()).should.be.rejected;
        });

        it('should not do anything if type is missing', () => {
            delete file.type;
            item.xhr = null;
            return item.delete(file, 'success', sandbox.mock()).should.be.rejected;
        });

        it('should not do anything if permissions is missing', () => {
            delete file.permissions;
            item.xhr = null;
            return item.delete(file, 'success', sandbox.mock()).should.be.rejected;
        });

        it('should not do anything if can delete is false', () => {
            delete file.permissions.can_delete;
            item.xhr = null;
            return item.delete(file, 'success', sandbox.mock()).should.be.rejected;
        });

        it('should make xhr to delete file and call success callback', () => {
            item.deleteSuccessHandler = sandbox.mock().withArgs('success');
            item.errorHandler = sandbox.mock().never();
            item.getUrl = sandbox.mock().withArgs('id').returns('url');
            item.xhr = {
                delete: sandbox.mock().withArgs('url').returns(Promise.resolve('success'))
            };
            return item.delete(file, 'success', 'error').then(() => {
                expect(item.successCallback).to.equal('success');
                expect(item.errorCallback).to.equal('error');
                expect(item.id).to.equal('id');
                expect(item.parentId).to.equal('parentId');
            });
        });

        it('should make xhr to delete folder and call success callback', () => {
            file.type = 'folder';
            item.deleteSuccessHandler = sandbox.mock().withArgs('success');
            item.errorHandler = sandbox.mock().never();
            item.getUrl = sandbox.mock().withArgs('id').returns('url');
            item.xhr = {
                delete: sandbox.mock().withArgs('url?recursive=true').returns(Promise.resolve('success'))
            };
            return item.delete(file, 'success', 'error').then(() => {
                expect(item.successCallback).to.equal('success');
                expect(item.errorCallback).to.equal('error');
                expect(item.id).to.equal('id');
                expect(item.parentId).to.equal('parentId');
            });
        });

        it('should make xhr to share item and call error callback', () => {
            item.shareSuccessHandler = sandbox.mock().never();
            item.errorHandler = sandbox.mock().withArgs('error');
            item.getUrl = sandbox.mock().withArgs('id').returns('url');
            item.xhr = {
                delete: sandbox.mock().withArgs('url').returns(Promise.reject('error'))
            };
            return item.delete(file, 'success', 'error').then(() => {
                expect(item.successCallback).to.equal('success');
                expect(item.errorCallback).to.equal('error');
                expect(item.id).to.equal('id');
                expect(item.parentId).to.equal('parentId');
            });
        });
        it('should default to noop error callback', () => {
            item.xhr = {
                delete: sandbox.mock().returns(Promise.resolve('success'))
            };
            item.delete(file, 'success');
            expect(item.errorCallback).to.equal(noop);
        });
    });

    describe('deleteSuccessHandler()', () => {
        beforeEach(() => {
            folder = {
                id: 'parentId',
                item_collection: {
                    total_count: 4,
                    entries: ['file_item1', 'child', 'file_item2', 'file_item3']
                }
            };
        });

        it('should not do anything if destroyed', () => {
            item.isDestroyed = sandbox.mock().returns(true);
            item.postDeleteCleanup = sandbox.mock().never();
            item.deleteSuccessHandler();
        });

        it('should parse the response, flatten the collection and call finish', () => {
            cache.set('parent', folder);
            item.id = 'id';
            item.parentId = 'parentId';
            item.postDeleteCleanup = sandbox.mock();
            item.getCache = sandbox.mock().returns(cache);
            item.getCacheKey = sandbox.mock().withArgs('id').returns('child');
            item.getParentCacheKey = sandbox.mock().withArgs('parentId').returns('parent');
            item.merge = sandbox.mock().withArgs('parent', 'item_collection', {
                total_count: 3,
                entries: ['file_item1', 'file_item2', 'file_item3']
            });
            item.deleteSuccessHandler();

            expect(cache.get('parent')).to.deep.equal({
                id: 'parentId',
                item_collection: {
                    total_count: 3,
                    entries: ['file_item1', 'file_item2', 'file_item3']
                }
            });
            expect(cache.get('child')).to.equal(undefined);
        });

        it('should throw bad item error when entries is missing', () => {
            delete folder.item_collection.entries;
            cache.set('parent', folder);

            item.id = 'id';
            item.parentId = 'parentId';
            item.postDeleteCleanup = sandbox.mock().never();
            item.getCache = sandbox.mock().returns(cache);
            item.getCacheKey = sandbox.mock().never();
            item.getParentCacheKey = sandbox.mock().withArgs('parentId').returns('parent');
            expect(item.deleteSuccessHandler.bind(folder)).to.throw(Error, /Bad box item/);
        });

        it('should just cleanup when parent folder is not there', () => {
            item.parentId = 'parentId';
            item.postDeleteCleanup = sandbox.mock();
            item.getCache = sandbox.mock().returns(cache);
            item.getCacheKey = sandbox.mock().never();
            item.getParentCacheKey = sandbox.mock().withArgs('parentId').returns('parent');
            item.deleteSuccessHandler();
        });

        it('should just cleanup when parent folders item collection is not there', () => {
            delete folder.item_collection;
            cache.set('parent', folder);

            item.parentId = 'parentId';
            item.postDeleteCleanup = sandbox.mock();
            item.getCache = sandbox.mock().returns(cache);
            item.getCacheKey = sandbox.mock().never();
            item.getParentCacheKey = sandbox.mock().withArgs('parentId').returns('parent');
            item.deleteSuccessHandler();
        });
    });
});
