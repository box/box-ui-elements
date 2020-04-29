import Cache from '../Cache';
import sort, { sortFeedItems } from '../sorter';
import { SORT_ASC, SORT_DESC } from '../../constants';
import { annotation as mockAnnotation } from '../../__mocks__/annotations';

let cache;
let item;

describe('util/sorter', () => {
    beforeEach(() => {
        item = {
            item_collection: {},
        };

        cache = new Cache();
        cache.set('fo1', {
            name: 'a',
            modified_at: '1',
            interacted_at: '1',
            size: 10,
            type: 'folder',
        });
        cache.set('fo2', {
            name: 'b',
            modified_at: '2',
            interacted_at: '3',
            size: 20,
            type: 'folder',
        });
        cache.set('fo3', {
            name: 'c',
            modified_at: '3',
            interacted_at: '2',
            size: 5,
            type: 'folder',
        });
        cache.set('fo4', {
            name: 'a',
            modified_at: '1',
            interacted_at: '1',
            size: 50,
            type: 'folder',
        });
        cache.set('fo5', { name: 'd', modified_at: '4', type: 'folder' });
        cache.set('fo6', { name: 'e', modified_at: '2', type: 'folder' });
        cache.set('f1', {
            name: 'a',
            modified_at: '1',
            interacted_at: '1',
            size: 100,
            type: 'file',
        });
        cache.set('f2', {
            name: 'b',
            modified_at: '2',
            interacted_at: '3',
            size: 10,
            type: 'file',
        });
        cache.set('f3', {
            name: 'c',
            modified_at: '3',
            interacted_at: '2',
            size: 40,
            type: 'file',
        });
        cache.set('f4', { name: 'd', modified_at: '2' });
        cache.set('f5', { name: 'e', modified_at: '1' });
        cache.set('f6', {});
        cache.set('f7', {});
        cache.set('w1', {
            name: 'a',
            modified_at: '1',
            interacted_at: '4',
            size: 50,
            type: 'web_link',
        });
        cache.set('w2', {
            name: 'b',
            modified_at: '2',
            interacted_at: '2',
            size: 20,
            type: 'web_link',
        });
        cache.set('w3', {
            name: 'c',
            modified_at: '3',
            interacted_at: '1',
            size: 70,
            type: 'web_link',
        });
        cache.set('w4', {
            name: 'a',
            modified_at: '1',
            interacted_at: '3',
            size: 80,
            type: 'web_link',
        });
        cache.set('foo', {
            name: 'a',
            modified_at: '1',
            interacted_at: '1',
            size: 10,
            type: 'bar',
        });
    });

    test('should not sort when already sorted', () => {
        item.item_collection.entries = ['fo1', 'fo2', 'fo3', 'f1', 'f2', 'f3', 'w1', 'w2', 'w3'];
        item.item_collection.order = [{ by: 'name', direction: SORT_ASC }];
        const sorted = sort(item, 'name', SORT_ASC, cache);
        expect(sorted.item_collection.entries).toEqual(['fo1', 'fo2', 'fo3', 'f1', 'f2', 'f3', 'w1', 'w2', 'w3']);
    });

    test('should sort with name desc', () => {
        item.item_collection.entries = ['fo1', 'fo2', 'fo3', 'f1', 'f2', 'f3', 'w1', 'w2', 'w3'];
        item.item_collection.order = [{ by: 'name', direction: SORT_ASC }];
        const sorted = sort(item, 'name', SORT_DESC, cache);
        expect(sorted.item_collection.entries).toEqual(['fo3', 'fo2', 'fo1', 'f3', 'f2', 'f1', 'w3', 'w2', 'w1']);
    });

    test('should sort with date desc', () => {
        item.item_collection.entries = ['fo3', 'f1', 'f2', 'w1', 'w2', 'fo1', 'fo2', 'f3', 'w3'];
        item.item_collection.order = [{ by: 'name', direction: SORT_ASC }];
        const sorted = sort(item, 'modified_at', SORT_DESC, cache);
        expect(sorted.item_collection.entries).toEqual(['fo3', 'fo2', 'fo1', 'f3', 'f2', 'f1', 'w3', 'w2', 'w1']);
    });

    test('should sort with date asc', () => {
        item.item_collection.entries = ['fo1', 'fo4', 'f1', 'f3', 'w2', 'w1', 'fo2', 'fo3', 'f2', 'w3'];
        item.item_collection.order = [{ by: 'name', direction: SORT_ASC }];
        const sorted = sort(item, 'modified_at', SORT_ASC, cache);
        expect(sorted.item_collection.entries).toEqual([
            'fo1',
            'fo4',
            'fo2',
            'fo3',
            'f1',
            'f2',
            'f3',
            'w1',
            'w2',
            'w3',
        ]);
    });

    test('should sort with interacted date desc', () => {
        item.item_collection.entries = ['fo3', 'f1', 'f2', 'w1', 'w2', 'fo1', 'fo2', 'f3', 'w3'];
        item.item_collection.order = [{ by: 'name', direction: SORT_ASC }];
        const sorted = sort(item, 'interacted_at', SORT_DESC, cache);
        expect(sorted.item_collection.entries).toEqual(['fo2', 'fo3', 'fo1', 'f2', 'f3', 'f1', 'w1', 'w2', 'w3']);
    });

    test('should sort with interacted date asc', () => {
        item.item_collection.entries = ['fo1', 'fo4', 'f1', 'f3', 'w2', 'w1', 'fo2', 'fo3', 'f2', 'w3', 'w4'];
        item.item_collection.order = [{ by: 'name', direction: SORT_ASC }];
        const sorted = sort(item, 'interacted_at', SORT_ASC, cache);
        expect(sorted.item_collection.entries).toEqual([
            'fo1',
            'fo4',
            'fo3',
            'fo2',
            'f1',
            'f3',
            'f2',
            'w3',
            'w2',
            'w4',
            'w1',
        ]);
    });

    test('should sort with interacted date desc', () => {
        item.item_collection.entries = ['fo3', 'f1', 'f2', 'w1', 'w2', 'fo1', 'fo2', 'f3', 'w3'];
        item.item_collection.order = [{ by: 'name', direction: SORT_ASC }];
        const sorted = sort(item, 'size', SORT_DESC, cache);
        expect(sorted.item_collection.entries).toEqual(['fo2', 'fo1', 'fo3', 'f1', 'f3', 'f2', 'w3', 'w1', 'w2']);
    });

    test('should sort with size asc', () => {
        item.item_collection.entries = ['fo1', 'fo4', 'f1', 'f3', 'w2', 'w1', 'fo2', 'fo3', 'f2', 'w3', 'w4'];
        item.item_collection.order = [{ by: 'name', direction: SORT_ASC }];
        const sorted = sort(item, 'size', SORT_ASC, cache);
        expect(sorted.item_collection.entries).toEqual([
            'fo3',
            'fo1',
            'fo2',
            'fo4',
            'f2',
            'f3',
            'f1',
            'w2',
            'w1',
            'w3',
            'w4',
        ]);
    });

    test('should sort with default type file and modified date when interacted date and type is missing', () => {
        item.item_collection.entries = ['fo5', 'fo6', 'f4', 'f5'];
        item.item_collection.order = [{ by: 'name', direction: SORT_ASC }];
        const sorted = sort(item, 'interacted_at', SORT_ASC, cache);
        expect(sorted.item_collection.entries).toEqual(['fo6', 'fo5', 'f5', 'f4']);
    });

    test('should sort with default size 0 when size is missing', () => {
        item.item_collection.entries = ['fo5', 'fo6', 'f4', 'f5'];
        item.item_collection.order = [{ by: 'name', direction: SORT_ASC }];
        const sorted = sort(item, 'size', SORT_ASC, cache);
        expect(sorted.item_collection.entries).toEqual(['fo5', 'fo6', 'f4', 'f5']);
    });

    test('should sort with default name when name is missing', () => {
        item.item_collection.entries = ['f7', 'f6'];
        item.item_collection.order = [{ by: 'name', direction: SORT_ASC }];
        const sorted = sort(item, 'name', SORT_ASC, cache);
        expect(sorted.item_collection.entries).toEqual(['f7', 'f6']);
    });

    test('should sort with default name when name is missing', () => {
        item.item_collection.entries = ['f7', 'f6'];
        item.item_collection.order = [{ by: 'name', direction: SORT_ASC }];
        const sorted = sort(item, 'interacted_at', SORT_ASC, cache);
        expect(sorted.item_collection.entries).toEqual(['f7', 'f6']);
    });

    test('should sort with name asc', () => {
        item.item_collection.entries = ['w1', 'w3', 'fo1', 'fo4', 'f1', 'w2', 'w4', 'f3', 'f2', 'fo2', 'fo3'];
        item.item_collection.order = [{ by: 'name', direction: SORT_DESC }];
        const sorted = sort(item, 'name', SORT_ASC, cache);
        expect(sorted.item_collection.entries).toEqual([
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
            'w3',
        ]);
    });

    test('should throw with a bad sortBy', () => {
        item.item_collection.entries = ['w1', 'w3', 'fo1', 'fo4', 'f1', 'w2', 'w4', 'f3', 'f2', 'fo2', 'fo3'];
        item.item_collection.order = [{ by: 'name', direction: SORT_DESC }];
        expect(sort.bind(sort, item, 'foobar', SORT_ASC, cache)).toThrow(Error, /sort field/);
    });

    test('should throw with a bad type', () => {
        item.item_collection.entries = ['w1', 'w3', 'fo1', 'foo'];
        item.item_collection.order = [{ by: 'name', direction: SORT_DESC }];
        expect(sort.bind(sort, item, 'name', SORT_ASC, cache)).toThrow(Error, /sort comparator/);
    });

    test('should throw with a bad item when no item_collection', () => {
        item.item_collection = null;
        expect(sort.bind(sort, item, 'name', SORT_ASC, cache)).toThrow(Error, /Bad box item/);
    });

    test('should throw with a bad item when no entries', () => {
        item.item_collection.entries = null;
        expect(sort.bind(sort, item, 'name', SORT_ASC, cache)).toThrow(Error, /Bad box item/);
    });

    describe('sortFeedItems()', () => {
        const comments = {
            total_count: 1,
            entries: [
                {
                    type: 'comment',
                    id: '123',
                    created_at: 'Thu Sep 26 33658 19:46:39 GMT-0600 (CST)',
                    tagged_message: 'test @[123:Jeezy] @[10:Kanye West]',
                    created_by: { name: 'Akon', id: 11 },
                },
            ],
        };
        const tasks = {
            total_count: 1,
            entries: [
                {
                    type: 'task',
                    id: '1234',
                    created_at: 'Thu Sep 25 33658 19:45:39 GMT-0600 (CST)',
                    modified_at: 'Thu Sep 25 33658 19:46:39 GMT-0600 (CST)',
                    tagged_message: 'test',
                    modified_by: { name: 'Jay-Z', id: 10 },
                    dueAt: 1234567891,
                    task_assignment_collection: {
                        entries: [{ assigned_to: { name: 'Akon', id: 11 } }],
                        total_count: 1,
                    },
                },
            ],
        };
        const annotations = {
            entries: [mockAnnotation],
        };

        test('should sort items based on date', () => {
            const sorted = sortFeedItems(comments, tasks, annotations);
            expect(sorted[0].id).toEqual(annotations.entries[0].id);
            expect(sorted[1].id).toEqual(tasks.entries[0].id);
            expect(sorted[2].id).toEqual(comments.entries[0].id);
        });
    });
});
