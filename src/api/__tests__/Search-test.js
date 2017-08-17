/* eslint-disable no-underscore-dangle */

import Search from '../Search';
import Cache from '../../util/Cache';
import { FIELDS_TO_FETCH } from '../../constants';

let search;
let cache;
let item1;
let item2;
let item3;
let response;
let searchResults;
const sandbox = sinon.sandbox.create();

describe('api/Search', () => {
    beforeEach(() => {
        search = new Search();
        cache = new Cache();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('getEncodedQuery()', () => {
        it('should return url encoded string', () => {
            expect(search.getEncodedQuery('foo bar')).to.equal('foo%20bar');
        });
    });

    describe('getCacheKey()', () => {
        it('should return correct key', () => {
            expect(search.getCacheKey('foo', 'bar')).to.equal('search_foo|bar');
        });
    });

    describe('getUrl()', () => {
        it('should return correct search api url', () => {
            expect(search.getUrl()).to.equal('https://api.box.com/2.0/search');
        });
    });

    describe('isLoaded()', () => {
        it('should return false when not cached', () => {
            search.key = 'key';
            expect(search.isLoaded()).to.equal(false);
        });
        it('should return false when no item collection', () => {
            search.key = 'key';
            cache.set('key', {});
            search.getCache = sandbox.mock().returns(cache);
            expect(search.isLoaded()).to.equal(false);
        });
        it('should return false when not loaded', () => {
            search.key = 'key';
            cache.set('key', { item_collection: { isLoaded: false } });
            search.getCache = sandbox.mock().returns(cache);
            expect(search.isLoaded()).to.equal(false);
        });
        it('should return true when loaded', () => {
            search.key = 'key';
            cache.set('key', { item_collection: { isLoaded: true } });
            search.getCache = sandbox.mock().returns(cache);
            expect(search.isLoaded()).to.equal(true);
        });
    });

    describe('search()', () => {
        it('should not do anything if destroyed', () => {
            search.isDestroyed = sandbox.mock().returns(true);
            search.searchRequest = sandbox.mock().never();
            search.getCache = sandbox.mock().never();
            search.getCacheKey = sandbox.mock().never();
            search.search('id', 'query', 'by', 'direction', 'success', 'fail');
        });
        it('should save args and make search request when not cached', () => {
            search.searchRequest = sandbox.mock();
            search.getCacheKey = sandbox.mock().withArgs('id', 'foo%20query').returns('key');
            search.isLoaded = sandbox.mock().returns(false);
            search.search('id', 'foo query', 'by', 'direction', 'success', 'fail');
            expect(search.id).to.equal('id');
            expect(search.successCallback).to.equal('success');
            expect(search.errorCallback).to.equal('fail');
            expect(search.sortBy).to.equal('by');
            expect(search.sortDirection).to.equal('direction');
            expect(search.key).to.equal('key');
            expect(search.offset).to.equal(0);
            expect(search.query).to.equal('foo query');
        });
        it('should save args and not make search request when cached', () => {
            search.searchRequest = sandbox.mock().never();
            search.finish = sandbox.mock();
            search.getCacheKey = sandbox.mock().withArgs('id', 'foo%20query').returns('key');
            search.isLoaded = sandbox.mock().returns(true);
            search.search('id', 'foo query', 'by', 'direction', 'success', 'fail');
            expect(search.id).to.equal('id');
            expect(search.successCallback).to.equal('success');
            expect(search.errorCallback).to.equal('fail');
            expect(search.sortBy).to.equal('by');
            expect(search.sortDirection).to.equal('direction');
            expect(search.key).to.equal('key');
            expect(search.offset).to.equal(0);
            expect(search.query).to.equal('foo query');
        });
        it('should save args and make search request when cached but forced to fetch', () => {
            search.searchRequest = sandbox.mock();
            search.getCache = sandbox.mock().returns({ unset: sandbox.mock().withArgs('key') });
            search.getCacheKey = sandbox.mock().withArgs('id', 'foo%20query').returns('key');
            search.isLoaded = sandbox.mock().returns(false);
            search.search('id', 'foo query', 'by', 'direction', 'success', 'fail', true);
            expect(search.id).to.equal('id');
            expect(search.successCallback).to.equal('success');
            expect(search.errorCallback).to.equal('fail');
            expect(search.sortBy).to.equal('by');
            expect(search.sortDirection).to.equal('direction');
            expect(search.key).to.equal('key');
            expect(search.offset).to.equal(0);
            expect(search.query).to.equal('foo query');
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

        it('should not do anything if destroyed', () => {
            search.isDestroyed = sandbox.mock().returns(true);
            search.xhr = null;
            return search.searchRequest().should.be.rejected;
        });
        it('should make xhr to search and call success callback', () => {
            search.searchSuccessHandler = sandbox.mock().withArgs('success');
            search.searchErrorHandler = sandbox.mock().never();
            search.xhr = {
                get: sandbox
                    .mock()
                    .withArgs('https://api.box.com/2.0/search', {
                        offset: 0,
                        query: 'query',
                        ancestor_folder_ids: 'id',
                        limit: 200,
                        fields: FIELDS_TO_FETCH
                    })
                    .returns(Promise.resolve('success'))
            };
            return search.searchRequest();
        });
        it('should make xhr to search and call error callback', () => {
            search.searchSuccessHandler = sandbox.mock().never();
            search.searchErrorHandler = sandbox.mock().withArgs('error');
            search.xhr = {
                get: sandbox
                    .mock()
                    .withArgs('https://api.box.com/2.0/search', {
                        offset: 0,
                        query: 'query',
                        ancestor_folder_ids: 'id',
                        limit: 200,
                        fields: FIELDS_TO_FETCH
                    })
                    .returns(Promise.reject('error'))
            };
            return search.searchRequest();
        });
    });

    describe('searchErrorHandler()', () => {
        it('should not do anything if destroyed', () => {
            search.isDestroyed = sandbox.mock().returns(true);
            search.errorCallback = sandbox.mock().never();
            search.searchErrorHandler('foo');
        });
        it('should call error callback', () => {
            search.errorCallback = sandbox.mock().withArgs('foo');
            search.searchErrorHandler('foo');
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

        it('should not do anything if destroyed', () => {
            search.isDestroyed = sandbox.mock().returns(true);
            search.finish = sandbox.mock().never();
            search.searchSuccessHandler('foo');
        });

        it('should parse the response, flatten the collection and call finish', () => {
            search.options = { cache };
            search.id = 'id';
            search.key = 'key';
            search.finish = sandbox.mock();
            search.getCache = sandbox.mock().returns(cache);
            search.searchSuccessHandler(response);

            expect(cache.get('key')).to.deep.equal({
                item_collection: {
                    isLoaded: true,
                    limit: 200,
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
            search.options = { cache };
            search.id = 'id';
            search.key = 'key';
            search.finish = sandbox.mock();
            search.getCache = sandbox.mock().returns(cache);
            search.itemCache = ['foo', 'bar'];

            response.total_count = 5;
            search.searchSuccessHandler(response);

            expect(cache.get('key')).to.deep.equal({
                item_collection: {
                    isLoaded: true,
                    limit: 200,
                    offset: 0,
                    total_count: 5,
                    entries: ['foo', 'bar', 'file_item1', 'file_item2', 'file_item3']
                }
            });
            expect(cache.get('file_item1')).to.deep.equal(item1);
            expect(cache.get('file_item2')).to.deep.equal(item2);
            expect(cache.get('file_item3')).to.deep.equal(item3);
        });

        it('should call search request again if returned items are less than total', () => {
            search.options = { cache };
            search.offset = 0;
            search.key = 'key';
            search.finish = sandbox.mock();
            search.searchRequest = sandbox.mock();
            search.getCache = sandbox.mock().returns(cache);
            response.total_count = 10;
            search.searchSuccessHandler(response);
            expect(cache.get('key')).to.deep.equal({
                item_collection: {
                    isLoaded: false,
                    limit: 200,
                    offset: 0,
                    total_count: 10,
                    entries: ['file_item1', 'file_item2', 'file_item3']
                }
            });
            expect(search.offset).to.equal(200);
        });

        it('should append the collection and call search request again if returned items are less than total', () => {
            search.options = { cache };
            search.offset = 0;
            search.key = 'key';
            search.finish = sandbox.mock();
            search.searchRequest = sandbox.mock();
            search.getCache = sandbox.mock().returns(cache);
            search.itemCache = ['foo', 'bar'];
            response.total_count = 10;
            search.searchSuccessHandler(response);
            expect(cache.get('key')).to.deep.equal({
                item_collection: {
                    isLoaded: false,
                    limit: 200,
                    offset: 0,
                    total_count: 10,
                    entries: ['foo', 'bar', 'file_item1', 'file_item2', 'file_item3']
                }
            });
            expect(search.offset).to.equal(200);
        });

        it('should throw bad item error when item collection total count is missing', () => {
            search.finish = sandbox.mock().never();
            expect(search.searchSuccessHandler.bind(search, { total_count: 1 })).to.throw(Error, /Bad box item/);
        });

        it('should throw bad item error when entries is missing', () => {
            search.finish = sandbox.mock().never();
            expect(search.searchSuccessHandler.bind(search, { entries: [] })).to.throw(Error, /Bad box item/);
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
                    isLoaded: true,
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

        it('should not do anything if destroyed', () => {
            search.isDestroyed = sandbox.mock().returns(true);
            search.finish();
        });

        it('should call success callback with proper collection', () => {
            search.id = 'id';
            search.key = 'key';
            search.sortBy = 'name';
            search.sortDirection = 'DESC';
            search.getCache = sandbox.mock().returns(cache);
            search.successCallback = sandbox.mock().withArgs({
                percentLoaded: 100,
                id: 'id',
                sortBy: 'name',
                sortDirection: 'DESC',
                items: [item3, item2, item1]
            });
            search.finish();
        });

        it('should call success callback with proper percent loaded', () => {
            search.id = 'id';
            search.key = 'key';
            search.sortBy = 'name';
            search.sortDirection = 'DESC';
            search.getCache = sandbox.mock().returns(cache);
            search.successCallback = sandbox.mock().withArgs({
                percentLoaded: 66.66666666666667,
                id: 'id',
                sortBy: 'name',
                sortDirection: 'DESC',
                items: [item2, item1]
            });

            searchResults.item_collection.entries = ['file_item1', 'file_item2'];
            cache.set('key', searchResults);
            search.finish();
        });

        it('should throw bad item error when item collection is missing', () => {
            Search.__Rewire__('sort', sandbox.mock().withArgs(searchResults, 'name', 'DESC', cache).returns({}));
            search.id = 'id';
            search.key = 'key';
            search.sortBy = 'name';
            search.sortDirection = 'DESC';
            search.getCache = sandbox.mock().returns(cache);
            search.successCallback = sandbox.mock().never();
            expect(search.finish.bind(search)).to.throw(Error, /Bad box item/);
            Search.__ResetDependency__('sort');
        });

        it('should throw bad item error when item collection is missing entries', () => {
            Search.__Rewire__(
                'sort',
                sandbox
                    .mock()
                    .withArgs(searchResults, 'name', 'DESC', cache)
                    .returns({ item_collection: { total_count: 123 } })
            );
            search.id = 'id';
            search.key = 'key';
            search.sortBy = 'name';
            search.sortDirection = 'DESC';
            search.getCache = sandbox.mock().returns(cache);
            search.successCallback = sandbox.mock().never();
            expect(search.finish.bind(search)).to.throw(Error, /Bad box item/);
            Search.__ResetDependency__('sort');
        });

        it('should throw bad item error when item collection is missing entries', () => {
            Search.__Rewire__(
                'sort',
                sandbox
                    .mock()
                    .withArgs(searchResults, 'name', 'DESC', cache)
                    .returns({ item_collection: { entrise: [] } })
            );
            search.id = 'id';
            search.key = 'key';
            search.sortBy = 'name';
            search.sortDirection = 'DESC';
            search.getCache = sandbox.mock().returns(cache);
            search.successCallback = sandbox.mock().never();
            expect(search.finish.bind(search)).to.throw(Error, /Bad box item/);
            Search.__ResetDependency__('sort');
        });
    });
});
