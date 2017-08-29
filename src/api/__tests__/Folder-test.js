/* eslint-disable no-underscore-dangle */

import Folder from '../Folder';
import Cache from '../../util/Cache';
import { FIELDS_TO_FETCH, X_REP_HINTS } from '../../constants';

let folder;
let cache;
let item1;
let item2;
let item3;
let response;
let folderResults;
const sandbox = sinon.sandbox.create();

describe('api/Folder', () => {
    beforeEach(() => {
        folder = new Folder();
        cache = new Cache();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('getCacheKey()', () => {
        it('should return correct key', () => {
            expect(folder.getCacheKey('foo')).to.equal('folder_foo');
        });
    });

    describe('getUrl()', () => {
        it('should return correct folder api url', () => {
            expect(folder.getUrl()).to.equal('https://api.box.com/2.0/folders');
        });
        it('should return correct folder api url with id', () => {
            expect(folder.getUrl('foo')).to.equal('https://api.box.com/2.0/folders/foo');
        });
    });

    describe('isLoaded()', () => {
        it('should return false when not cached', () => {
            folder.key = 'key';
            expect(folder.isLoaded()).to.equal(false);
        });
        it('should return false when no item collection', () => {
            folder.key = 'key';
            cache.set('key', {});
            folder.getCache = sandbox.mock().returns(cache);
            expect(folder.isLoaded()).to.equal(false);
        });
        it('should return false when not loaded', () => {
            folder.key = 'key';
            cache.set('key', { item_collection: { isLoaded: false } });
            folder.getCache = sandbox.mock().returns(cache);
            expect(folder.isLoaded()).to.equal(false);
        });
        it('should return true when loaded', () => {
            folder.key = 'key';
            cache.set('key', { item_collection: { isLoaded: true } });
            folder.getCache = sandbox.mock().returns(cache);
            expect(folder.isLoaded()).to.equal(true);
        });
    });

    describe('folder()', () => {
        it('should not do anything if destroyed', () => {
            folder.isDestroyed = sandbox.mock().returns(true);
            folder.folderRequest = sandbox.mock().never();
            folder.getCache = sandbox.mock().never();
            folder.getCacheKey = sandbox.mock().never();
            folder.folder('id', 'query', 'by', 'direction', 'success', 'fail');
        });
        it('should save args and make folder request when not cached', () => {
            folder.folderRequest = sandbox.mock();
            folder.getCacheKey = sandbox.mock().withArgs('id').returns('key');
            folder.isLoaded = sandbox.mock().returns(false);
            folder.folder('id', 'by', 'direction', 'success', 'fail');
            expect(folder.id).to.equal('id');
            expect(folder.successCallback).to.equal('success');
            expect(folder.errorCallback).to.equal('fail');
            expect(folder.sortBy).to.equal('by');
            expect(folder.sortDirection).to.equal('direction');
            expect(folder.key).to.equal('key');
            expect(folder.offset).to.equal(0);
        });
        it('should save args and not make folder request when cached', () => {
            folder.folderRequest = sandbox.mock().never();
            folder.finish = sandbox.mock();
            folder.getCacheKey = sandbox.mock().withArgs('id').returns('key');
            folder.isLoaded = sandbox.mock().returns(true);
            folder.folder('id', 'by', 'direction', 'success', 'fail');
            expect(folder.id).to.equal('id');
            expect(folder.successCallback).to.equal('success');
            expect(folder.errorCallback).to.equal('fail');
            expect(folder.sortBy).to.equal('by');
            expect(folder.sortDirection).to.equal('direction');
            expect(folder.key).to.equal('key');
            expect(folder.offset).to.equal(0);
        });
        it('should save args and make folder request when cached but forced to fetch', () => {
            folder.folderRequest = sandbox.mock();
            folder.getCache = sandbox.mock().returns({ unset: sandbox.mock().withArgs('key') });
            folder.getCacheKey = sandbox.mock().withArgs('id').returns('key');
            folder.isLoaded = sandbox.mock().returns(false);
            folder.folder('id', 'by', 'direction', 'success', 'fail', true);
            expect(folder.id).to.equal('id');
            expect(folder.successCallback).to.equal('success');
            expect(folder.errorCallback).to.equal('fail');
            expect(folder.sortBy).to.equal('by');
            expect(folder.sortDirection).to.equal('direction');
            expect(folder.key).to.equal('key');
            expect(folder.offset).to.equal(0);
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

        it('should not do anything if destroyed', () => {
            folder.isDestroyed = sandbox.mock().returns(true);
            folder.xhr = null;
            return folder.folderRequest().should.be.rejected;
        });
        it('should make xhr to folder and call success callback', () => {
            folder.folderSuccessHandler = sandbox.mock().withArgs('success');
            folder.folderErrorHandler = sandbox.mock().never();
            folder.xhr = {
                get: sandbox
                    .mock()
                    .withArgs({
                        url: 'https://api.box.com/2.0/folders/id',
                        params: {
                            offset: 0,
                            limit: 1000,
                            fields: FIELDS_TO_FETCH
                        },
                        headers: {
                            'X-Rep-Hints': X_REP_HINTS
                        }
                    })
                    .returns(Promise.resolve('success'))
            };
            return folder.folderRequest();
        });
        it('should make xhr to folder and call error callback', () => {
            folder.folderSuccessHandler = sandbox.mock().never();
            folder.folderErrorHandler = sandbox.mock().withArgs('error');
            folder.xhr = {
                get: sandbox
                    .mock()
                    .withArgs({
                        url: 'https://api.box.com/2.0/folders/id',
                        params: {
                            offset: 0,
                            limit: 1000,
                            fields: FIELDS_TO_FETCH
                        },
                        headers: {
                            'X-Rep-Hints': X_REP_HINTS
                        }
                    })
                    .returns(Promise.reject('error'))
            };
            return folder.folderRequest();
        });
    });

    describe('folderErrorHandler()', () => {
        it('should not do anything if destroyed', () => {
            folder.isDestroyed = sandbox.mock().returns(true);
            folder.errorCallback = sandbox.mock().never();
            folder.folderErrorHandler('foo');
        });
        it('should call error callback', () => {
            folder.errorCallback = sandbox.mock().withArgs('foo');
            folder.folderErrorHandler('foo');
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

        it('should not do anything if destroyed', () => {
            folder.isDestroyed = sandbox.mock().returns(true);
            folder.finish = sandbox.mock().never();
            folder.folderSuccessHandler('foo');
        });

        it('should parse the response, flatten the collection and call finish', () => {
            folder.options = { cache };
            folder.id = 'id';
            folder.key = 'key';
            folder.finish = sandbox.mock();
            folder.getCache = sandbox.mock().returns(cache);
            folder.folderSuccessHandler(response);

            expect(cache.get('key')).to.deep.equal({
                id: 'id',
                item_collection: {
                    isLoaded: true,
                    limit: 1000,
                    offset: 0,
                    total_count: 3,
                    entries: ['file_item1', 'file_item2', 'file_item3']
                }
            });
            expect(cache.get('file_item1')).to.deep.equal(item1);
            expect(cache.get('file_item2')).to.deep.equal(item2);
            expect(cache.get('file_item3')).to.deep.equal(item3);
        });

        it('should parse the response, append the collection and call finish', () => {
            folder.options = { cache };
            folder.id = 'id';
            folder.key = 'key';
            folder.finish = sandbox.mock();
            folder.getCache = sandbox.mock().returns(cache);
            folder.itemCache = ['foo', 'bar'];

            response.item_collection.total_count = 5;
            folder.folderSuccessHandler(response);

            expect(cache.get('key')).to.deep.equal({
                id: 'id',
                item_collection: {
                    isLoaded: true,
                    limit: 1000,
                    offset: 0,
                    total_count: 5,
                    entries: ['foo', 'bar', 'file_item1', 'file_item2', 'file_item3']
                }
            });
            expect(cache.get('file_item1')).to.deep.equal(item1);
            expect(cache.get('file_item2')).to.deep.equal(item2);
            expect(cache.get('file_item3')).to.deep.equal(item3);
        });

        it('should call folder request again if returned items are less than total', () => {
            folder.options = { cache };
            folder.offset = 0;
            folder.key = 'key';
            folder.finish = sandbox.mock();
            folder.folderRequest = sandbox.mock();
            folder.getCache = sandbox.mock().returns(cache);
            response.item_collection.total_count = 10;
            folder.folderSuccessHandler(response);
            expect(cache.get('key')).to.deep.equal({
                id: 'id',
                item_collection: {
                    isLoaded: false,
                    limit: 1000,
                    offset: 0,
                    total_count: 10,
                    entries: ['file_item1', 'file_item2', 'file_item3']
                }
            });
            expect(folder.offset).to.equal(1000);
        });

        it('should append the collection and call folder request again if returned items are less than total', () => {
            folder.options = { cache };
            folder.offset = 0;
            folder.key = 'key';
            folder.finish = sandbox.mock();
            folder.folderRequest = sandbox.mock();
            folder.getCache = sandbox.mock().returns(cache);
            folder.itemCache = ['foo', 'bar'];
            response.item_collection.total_count = 10;
            folder.folderSuccessHandler(response);
            expect(cache.get('key')).to.deep.equal({
                id: 'id',
                item_collection: {
                    isLoaded: false,
                    limit: 1000,
                    offset: 0,
                    total_count: 10,
                    entries: ['foo', 'bar', 'file_item1', 'file_item2', 'file_item3']
                }
            });
            expect(folder.offset).to.equal(1000);
        });

        it('should throw bad item error when item collection is missing', () => {
            folder.finish = sandbox.mock().never();
            expect(folder.folderSuccessHandler.bind(folder, {})).to.throw(Error, /Bad box item/);
        });

        it('should throw bad item error when item collection entries is missing', () => {
            folder.finish = sandbox.mock().never();
            expect(folder.folderSuccessHandler.bind(folder, { item_collection: { total_count: 1 } })).to.throw(
                Error,
                /Bad box item/
            );
        });

        it('should throw bad item error when item collection total count is missing', () => {
            folder.finish = sandbox.mock().never();
            expect(folder.folderSuccessHandler.bind(folder, { item_collection: { entries: [] } })).to.throw(
                Error,
                /Bad box item/
            );
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
                    isLoaded: true,
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

        it('should not do anything if destroyed', () => {
            folder.isDestroyed = sandbox.mock().returns(true);
            folder.finish();
        });

        it('should call success callback with proper collection', () => {
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'DESC';
            folder.getCache = sandbox.mock().returns(cache);
            folder.successCallback = sandbox.mock().withArgs({
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
            folder.finish();
        });

        it('should call success callback with proper percent loaded', () => {
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'DESC';
            folder.getCache = sandbox.mock().returns(cache);
            folder.successCallback = sandbox.mock().withArgs({
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

            folderResults.item_collection.entries = ['file_item1', 'file_item2'];
            cache.set('key', folderResults);
            folder.finish();
        });

        it('should throw bad item error when item collection is missing', () => {
            Folder.__Rewire__(
                'sort',
                sandbox.mock().withArgs(folderResults, 'name', 'DESC', cache).returns({ path_collection: 'foo' })
            );
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'DESC';
            folder.getCache = sandbox.mock().returns(cache);
            folder.successCallback = sandbox.mock().never();
            expect(folder.finish.bind(folder)).to.throw(Error, /Bad box item/);
            Folder.__ResetDependency__('sort');
        });

        it('should throw bad item error when path collection is missing', () => {
            Folder.__Rewire__(
                'sort',
                sandbox.mock().withArgs(folderResults, 'name', 'DESC', cache).returns({ item_collection: 'foo' })
            );
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'DESC';
            folder.getCache = sandbox.mock().returns(cache);
            folder.successCallback = sandbox.mock().never();
            expect(folder.finish.bind(folder)).to.throw(Error, /Bad box item/);
            Folder.__ResetDependency__('sort');
        });

        it('should throw bad item error when item collection is missing entries', () => {
            Folder.__Rewire__(
                'sort',
                sandbox
                    .mock()
                    .withArgs(folderResults, 'name', 'DESC', cache)
                    .returns({ path_collection: 'foo', item_collection: { total_count: 123 } })
            );
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'DESC';
            folder.getCache = sandbox.mock().returns(cache);
            folder.successCallback = sandbox.mock().never();
            expect(folder.finish.bind(folder)).to.throw(Error, /Bad box item/);
            Folder.__ResetDependency__('sort');
        });

        it('should throw bad item error when item collection is missing total_count', () => {
            Folder.__Rewire__(
                'sort',
                sandbox
                    .mock()
                    .withArgs(folderResults, 'name', 'DESC', cache)
                    .returns({ path_collection: 'foo', item_collection: { entries: [] } })
            );
            folder.id = 'id';
            folder.key = 'key';
            folder.sortBy = 'name';
            folder.sortDirection = 'DESC';
            folder.getCache = sandbox.mock().returns(cache);
            folder.successCallback = sandbox.mock().never();
            expect(folder.finish.bind(folder)).to.throw(Error, /Bad box item/);
            Folder.__ResetDependency__('sort');
        });
    });

    describe('create()', () => {
        it('should not do anything if destroyed', () => {
            folder.isDestroyed = sandbox.mock().returns(true);
            folder.folderCreateRequest = sandbox.mock().never();
            folder.getCache = sandbox.mock().never();
            folder.getCacheKey = sandbox.mock().never();
            folder.create('id', 'name', 'success', 'fail');
        });
        it('should save args and make folder create request when not cached', () => {
            folder.folderCreateRequest = sandbox.mock();
            folder.getCacheKey = sandbox.mock().withArgs('id').returns('key');
            folder.create('id', 'name', 'success', 'fail');
            expect(folder.id).to.equal('id');
            expect(folder.successCallback).to.equal('success');
            expect(folder.errorCallback).to.equal('fail');
            expect(folder.key).to.equal('key');
        });
    });

    describe('folderCreateRequest()', () => {
        beforeEach(() => {
            folder.id = 'id';
            folder.successCallback = 'success';
            folder.errorCallback = 'fail';
            folder.key = 'key';
        });

        it('should not do anything if destroyed', () => {
            folder.isDestroyed = sandbox.mock().returns(true);
            folder.xhr = null;
            return folder.folderCreateRequest('foo').should.be.rejected;
        });
        it('should make xhr to folder create and call success callback', () => {
            folder.createSuccessHandler = sandbox.mock().withArgs('success');
            folder.folderErrorHandler = sandbox.mock().never();
            folder.xhr = {
                post: sandbox
                    .mock()
                    .withArgs({
                        url: `https://api.box.com/2.0/folders?fields=${FIELDS_TO_FETCH}`,
                        data: {
                            name: 'foo',
                            parent: {
                                id: 'id'
                            }
                        }
                    })
                    .returns(Promise.resolve('success'))
            };
            return folder.folderCreateRequest('foo');
        });
        it('should make xhr to folder and call error callback', () => {
            folder.createSuccessHandler = sandbox.mock().never();
            folder.folderErrorHandler = sandbox.mock().withArgs('error');
            folder.xhr = {
                post: sandbox
                    .mock()
                    .withArgs({
                        url: `https://api.box.com/2.0/folders?fields=${FIELDS_TO_FETCH}`,
                        data: {
                            name: 'foo',
                            parent: {
                                id: 'id'
                            }
                        }
                    })
                    .returns(Promise.reject('error'))
            };
            return folder.folderCreateRequest('foo');
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

        it('should not do anything if destroyed', () => {
            folder.isDestroyed = sandbox.mock().returns(true);
            folder.successCallback = sandbox.mock().never();
            folder.createSuccessHandler(response);
        });

        it('should not do anything if new child folder doesnt have an id', () => {
            folder.isDestroyed = sandbox.mock().returns(false);
            folder.successCallback = sandbox.mock().never();
            folder.createSuccessHandler({});
        });

        it('should insert the response item inside the parent folder', () => {
            folder.id = 'id';
            folder.key = 'key';
            folder.successCallback = sandbox.mock().withArgs(item1);
            folder.getCache = sandbox.mock().returns(cache);
            folder.createSuccessHandler(item1);

            expect(cache.get('key')).to.deep.equal({
                id: 'id',
                item_collection: {
                    total_count: 3,
                    entries: ['folder_item1', 'file_item2', 'file_item3']
                }
            });

            expect(cache.get('folder_item1')).to.deep.equal(item1);
        });

        it('should throw bad item error when item collection is missing', () => {
            folder.id = 'id';
            folder.key = 'key';
            folder.successCallback = sandbox.mock().never();
            folder.getCache = sandbox.mock().returns(cache);
            cache.set('key', {
                id: 'id'
            });
            expect(folder.createSuccessHandler.bind(folder, { id: 'foo' })).to.throw(Error, /Bad box item/);
        });

        it('should throw bad item error when item collection entries is missing', () => {
            folder.id = 'id';
            folder.key = 'key';
            folder.successCallback = sandbox.mock().never();
            folder.getCache = sandbox.mock().returns(cache);
            cache.set('key', {
                id: 'id',
                item_collection: {
                    total_count: 2
                }
            });
            expect(folder.createSuccessHandler.bind(folder, { id: 'foo' })).to.throw(Error, /Bad box item/);
        });

        it('should throw bad item error when total count is missing', () => {
            folder.id = 'id';
            folder.key = 'key';
            folder.successCallback = sandbox.mock().never();
            folder.getCache = sandbox.mock().returns(cache);
            cache.set('key', {
                id: 'id',
                item_collection: {
                    entries: []
                }
            });
            expect(folder.createSuccessHandler.bind(folder, { id: 'foo', item_collection: { entries: [] } })).to.throw(
                Error,
                /Bad box item/
            );
        });
    });
});
