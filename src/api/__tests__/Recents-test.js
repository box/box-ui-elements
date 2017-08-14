/* eslint-disable no-underscore-dangle */

import Recents from '../Recents';
import Cache from '../../util/Cache';
import { FIELDS_TO_FETCH } from '../../constants';

let recents;
let cache;
const sandbox = sinon.sandbox.create();

describe('api/Recents', () => {
    beforeEach(() => {
        recents = new Recents();
        cache = new Cache();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('getCacheKey()', () => {
        it('should return correct key', () => {
            expect(recents.getCacheKey('foo')).to.equal('recents_foo');
        });
    });

    describe('getUrl()', () => {
        it('should return correct recents api url', () => {
            expect(recents.getUrl()).to.equal('https://api.box.com/2.0/recent_items');
        });
    });

    describe('recents()', () => {
        it('should not do anything if destroyed', () => {
            recents.isDestroyed = sandbox.mock().returns(true);
            recents.recentsRequest = sandbox.mock().never();
            recents.getCache = sandbox.mock().never();
            recents.getCacheKey = sandbox.mock().never();
            recents.recents('id', 'by', 'direction', 'success', 'fail');
        });
        it('should save args and make recents request when not cached', () => {
            recents.recentsRequest = sandbox.mock();
            recents.getCache = sandbox.mock().returns(cache);
            recents.getCacheKey = sandbox.mock().withArgs('id').returns('key');
            recents.recents('id', 'by', 'direction', 'success', 'fail');
            expect(recents.id).to.equal('id');
            expect(recents.successCallback).to.equal('success');
            expect(recents.errorCallback).to.equal('fail');
            expect(recents.sortBy).to.equal('interacted_at');
            expect(recents.sortDirection).to.equal('DESC');
            expect(recents.key).to.equal('key');
        });
        it('should save args and not make recents request when cached', () => {
            cache.set('key', 'value');
            recents.finish = sandbox.mock();
            recents.getCache = sandbox.mock().returns(cache);
            recents.getCacheKey = sandbox.mock().withArgs('id').returns('key');
            recents.recents('id', 'by', 'direction', 'success', 'fail');
            expect(recents.id).to.equal('id');
            expect(recents.successCallback).to.equal('success');
            expect(recents.errorCallback).to.equal('fail');
            expect(recents.sortBy).to.equal('by');
            expect(recents.sortDirection).to.equal('direction');
            expect(recents.key).to.equal('key');
        });
        it('should save args and make recents request when cached but forced to fetch', () => {
            cache.set('key', 'value');
            recents.recentsRequest = sandbox.mock();
            recents.getCache = sandbox.mock().returns(cache);
            recents.getCacheKey = sandbox.mock().withArgs('id').returns('key');
            recents.recents('id', 'by', 'direction', 'success', 'fail', true);
            expect(recents.id).to.equal('id');
            expect(recents.successCallback).to.equal('success');
            expect(recents.errorCallback).to.equal('fail');
            expect(recents.sortBy).to.equal('interacted_at');
            expect(recents.sortDirection).to.equal('DESC');
            expect(recents.key).to.equal('key');
        });
    });

    describe('recentsRequest()', () => {
        it('should not do anything if destroyed', () => {
            recents.isDestroyed = sandbox.mock().returns(true);
            recents.xhr = null;
            return recents.recentsRequest().should.be.rejected;
        });
        it('should make xhr get recents and call success callback', () => {
            recents.recentsSuccessHandler = sandbox.mock().withArgs('success');
            recents.recentsErrorHandler = sandbox.mock().never();
            recents.xhr = {
                get: sandbox
                    .mock()
                    .withArgs('https://api.box.com/2.0/recent_items', { fields: FIELDS_TO_FETCH })
                    .returns(Promise.resolve('success'))
            };
            return recents.recentsRequest();
        });
        it('should make xhr to get recents and call error callback', () => {
            recents.recentsSuccessHandler = sandbox.mock().never();
            recents.recentsErrorHandler = sandbox.mock().withArgs('error');
            recents.xhr = {
                get: sandbox
                    .mock()
                    .withArgs('https://api.box.com/2.0/recent_items', { fields: FIELDS_TO_FETCH })
                    .returns(Promise.reject('error'))
            };
            return recents.recentsRequest();
        });
    });

    describe('recentsErrorHandler()', () => {
        it('should not do anything if destroyed', () => {
            recents.isDestroyed = sandbox.mock().returns(true);
            recents.errorCallback = sandbox.mock().never();
            recents.recentsErrorHandler('foo');
        });
        it('should call error callback', () => {
            recents.errorCallback = sandbox.mock().withArgs('foo');
            recents.recentsErrorHandler('foo');
        });
    });

    describe('recentsSuccessHandler()', () => {
        it('should not do anything if destroyed', () => {
            recents.isDestroyed = sandbox.mock().returns(true);
            recents.finish = sandbox.mock().never();
            recents.recentsSuccessHandler('foo');
        });
        it('should parse the response, flatten the collection and call finish', () => {
            const item1 = {
                id: 'item1',
                type: 'file',
                path_collection: {
                    entries: [{ id: 'id0' }, { id: 'id1' }, { id: 'id2' }]
                }
            };
            const item2 = {
                id: 'item2',
                type: 'file',
                path_collection: {
                    entries: [{ id: 'id4' }, { id: 'id5' }, { id: 'id6' }]
                }
            };
            const item3 = {
                id: 'item3',
                type: 'file',
                path_collection: {
                    entries: [{ id: 'id0' }, { id: 'id2' }, { id: 'id3' }]
                }
            };
            const response = {
                order: {
                    by: 'by',
                    direction: 'direction'
                },
                entries: [
                    {
                        interacted_at: 'interacted_at1',
                        item: item1
                    },
                    {
                        interacted_at: 'interacted_at2',
                        item: item2
                    },
                    {
                        interacted_at: 'interacted_at3',
                        item: item3
                    }
                ]
            };

            recents.options = { cache };
            recents.id = 'id2'; // root folder
            recents.key = 'key';
            recents.finish = sandbox.mock();
            recents.getCache = sandbox.mock().returns(cache);
            recents.recentsSuccessHandler(response);

            expect(cache.get('key')).to.deep.equal({
                item_collection: {
                    isLoaded: true,
                    entries: ['file_item1', 'file_item3'],
                    order: [
                        {
                            by: 'by',
                            direction: 'direction'
                        }
                    ]
                }
            });
            expect(cache.get('file_item1')).to.deep.equal(
                Object.assign({}, item1, { interacted_at: 'interacted_at1' })
            );
            expect(cache.get('file_item3')).to.deep.equal(
                Object.assign({}, item3, { interacted_at: 'interacted_at3' })
            );
            expect(cache.get('file_item2')).to.be.equal(undefined);
        });
    });

    describe('finish()', () => {
        const item1 = {
            id: 'item1',
            name: 'item1',
            type: 'file',
            path_collection: {
                entries: [{ id: 'id0' }, { id: 'id1' }, { id: 'id2' }]
            }
        };
        const item2 = {
            id: 'item2',
            name: 'item2',
            type: 'file',
            path_collection: {
                entries: [{ id: 'id4' }, { id: 'id5' }, { id: 'id6' }]
            }
        };
        const item3 = {
            id: 'item3',
            name: 'item3',
            type: 'file',
            path_collection: {
                entries: [{ id: 'id0' }, { id: 'id2' }, { id: 'id3' }]
            }
        };
        const recent = {
            item_collection: {
                isLoaded: true,
                entries: ['file_item1', 'file_item2', 'file_item3'],
                order: [
                    {
                        by: 'by',
                        direction: 'direction'
                    }
                ]
            }
        };

        beforeEach(() => {
            cache.set('file_item1', item1);
            cache.set('file_item2', item2);
            cache.set('file_item3', item3);
            cache.set('key', recent);
        });

        it('should not do anything if destroyed', () => {
            recents.isDestroyed = sandbox.mock().returns(true);
            recents.finish();
        });

        it('should call success callback with proper collection', () => {
            recents.id = 'id';
            recents.key = 'key';
            recents.sortBy = 'name';
            recents.sortDirection = 'DESC';
            recents.getCache = sandbox.mock().returns(cache);
            recents.successCallback = sandbox.mock().withArgs({
                percentLoaded: 100,
                id: 'id',
                sortBy: 'name',
                sortDirection: 'DESC',
                items: [item3, item2, item1]
            });
            recents.finish();
        });

        it('should throw bad item error when item collection is missing', () => {
            Recents.__Rewire__('sort', sandbox.mock().withArgs(recent, 'name', 'DESC', cache).returns({}));
            recents.id = 'id';
            recents.key = 'key';
            recents.sortBy = 'name';
            recents.sortDirection = 'DESC';
            recents.getCache = sandbox.mock().returns(cache);
            recents.successCallback = sandbox.mock().never();
            expect(recents.finish.bind(recents)).to.throw(Error, /Bad box item/);
            Recents.__ResetDependency__('sort');
        });

        it('should throw bad item error when item collection is missing entries', () => {
            Recents.__Rewire__(
                'sort',
                sandbox.mock().withArgs(recent, 'name', 'DESC', cache).returns({ item_collection: {} })
            );
            recents.id = 'id';
            recents.key = 'key';
            recents.sortBy = 'name';
            recents.sortDirection = 'DESC';
            recents.getCache = sandbox.mock().returns(cache);
            recents.successCallback = sandbox.mock().never();
            expect(recents.finish.bind(recents)).to.throw(Error, /Bad box item/);
            Recents.__ResetDependency__('sort');
        });
    });
});
