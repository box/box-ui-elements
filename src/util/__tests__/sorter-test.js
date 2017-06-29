import Cache from '../Cache';
import sort from '../sorter';
import { SORT_ASC, SORT_DESC } from '../../constants';

let cache;
let item;
const sandbox = sinon.sandbox.create();

describe('Sorter', () => {
    beforeEach(() => {
        item = {
            item_collection: {}
        };

        cache = new Cache();
        cache.set('fo1', { name: 'a', modified_at: '1', type: 'folder' });
        cache.set('fo2', { name: 'b', modified_at: '2', type: 'folder' });
        cache.set('fo3', { name: 'c', modified_at: '3', type: 'folder' });
        cache.set('fo4', { name: 'a', modified_at: '1', type: 'folder' });
        cache.set('f1', { name: 'a', modified_at: '1', type: 'file' });
        cache.set('f2', { name: 'b', modified_at: '2', type: 'file' });
        cache.set('f3', { name: 'c', modified_at: '3', type: 'file' });
        cache.set('w1', { name: 'a', modified_at: '1', type: 'web_link' });
        cache.set('w2', { name: 'b', modified_at: '2', type: 'web_link' });
        cache.set('w3', { name: 'c', modified_at: '3', type: 'web_link' });
        cache.set('w4', { name: 'a', modified_at: '1', type: 'web_link' });
        cache.set('foo', { name: 'a', modified_at: '1', type: 'bar' });
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    it('should not sort when already sorted', () => {
        item.item_collection.entries = ['fo1', 'fo2', 'fo3', 'f1', 'f2', 'f3', 'w1', 'w2', 'w3'];
        item.item_collection.order = [{ by: 'name', direction: SORT_ASC }];
        const sorted = sort(item, 'name', SORT_ASC, cache);
        expect(sorted.item_collection.entries).to.deep.equal(['fo1', 'fo2', 'fo3', 'f1', 'f2', 'f3', 'w1', 'w2', 'w3']);
    });

    it('should sort with name desc', () => {
        item.item_collection.entries = ['fo1', 'fo2', 'fo3', 'f1', 'f2', 'f3', 'w1', 'w2', 'w3'];
        item.item_collection.order = [{ by: 'name', direction: SORT_ASC }];
        const sorted = sort(item, 'name', SORT_DESC, cache);
        expect(sorted.item_collection.entries).to.deep.equal(['fo3', 'fo2', 'fo1', 'f3', 'f2', 'f1', 'w3', 'w2', 'w1']);
    });

    it('should sort with date desc', () => {
        item.item_collection.entries = ['fo3', 'f1', 'f2', 'w1', 'w2', 'fo1', 'fo2', 'f3', 'w3'];
        item.item_collection.order = [{ by: 'name', direction: SORT_ASC }];
        const sorted = sort(item, 'modified_at', SORT_DESC, cache);
        expect(sorted.item_collection.entries).to.deep.equal(['fo3', 'fo2', 'fo1', 'f3', 'f2', 'f1', 'w3', 'w2', 'w1']);
    });

    it('should sort with date asc', () => {
        item.item_collection.entries = ['fo1', 'fo4', 'f1', 'f3', 'w2', 'w1', 'fo2', 'fo3', 'f2', 'w3'];
        item.item_collection.order = [{ by: 'name', direction: SORT_ASC }];
        const sorted = sort(item, 'modified_at', SORT_ASC, cache);
        expect(sorted.item_collection.entries).to.deep.equal([
            'fo1',
            'fo4',
            'fo2',
            'fo3',
            'f1',
            'f2',
            'f3',
            'w1',
            'w2',
            'w3'
        ]);
    });

    it('should sort with name asc', () => {
        item.item_collection.entries = ['w1', 'w3', 'fo1', 'fo4', 'f1', 'w2', 'w4', 'f3', 'f2', 'fo2', 'fo3'];
        item.item_collection.order = [{ by: 'name', direction: SORT_DESC }];
        const sorted = sort(item, 'name', SORT_ASC, cache);
        expect(sorted.item_collection.entries).to.deep.equal([
            'fo1',
            'fo4',
            'fo2',
            'fo3',
            'f1',
            'f2',
            'f3',
            'w1',
            'w4',
            'w2',
            'w3'
        ]);
    });

    it('should throw with a bad sortBy', () => {
        item.item_collection.entries = ['w1', 'w3', 'fo1', 'fo4', 'f1', 'w2', 'w4', 'f3', 'f2', 'fo2', 'fo3'];
        item.item_collection.order = [{ by: 'name', direction: SORT_DESC }];
        expect(sort.bind(sort, item, 'foobar', SORT_ASC, cache)).to.throw(Error, /sort field/);
    });

    it('should throw with a bad type', () => {
        item.item_collection.entries = ['w1', 'w3', 'fo1', 'foo'];
        item.item_collection.order = [{ by: 'name', direction: SORT_DESC }];
        expect(sort.bind(sort, item, 'name', SORT_ASC, cache)).to.throw(Error, /sort comparator/);
    });
});
