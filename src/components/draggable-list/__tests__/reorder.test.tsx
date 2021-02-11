import reorder from '../draggable-list-utils/reorder';

describe('components/draggable-list/draggable-list-utils/reorder', () => {
    describe('reorder()', () => {
        test('should reorder an array', () => {
            const list = [
                {
                    id: 'item_0',
                    label: 'item 0',
                },
                {
                    id: 'item_1',
                    label: 'item 1',
                },
                {
                    id: 'item_2',
                    label: 'item 2',
                },
            ];

            const result = [
                {
                    id: 'item_1',
                    label: 'item 1',
                },
                {
                    id: 'item_2',
                    label: 'item 2',
                },
                {
                    id: 'item_0',
                    label: 'item 0',
                },
            ];

            const startIndex = 0;
            const destinationIndex = 2;
            expect(reorder(list, startIndex, destinationIndex)).toEqual(result);
        });
    });
});
