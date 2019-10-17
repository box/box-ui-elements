import { Set } from 'immutable';

import shiftSelect from '../shiftSelect';

describe('components/table/shiftSelect', () => {
    [
        // prevSelection, prevTarget, target, anchor, expected
        // [PrevTarget, Anchor, Target]
        [[1, 2], 0, 3, 1, [1, 2, 3]],
        [[0], 0, 2, 1, [1, 2]],
        // [PrevTarget, Target, Anchor]
        [[3, 4], 0, 1, 2, [1, 2, 3, 4]],
        [[0], 0, 1, 2, [1, 2]],
        // [Anchor, PrevTarget, Target]
        [[0, 1, 9], 1, 2, 0, [0, 1, 2, 9]],
        // [Anchor, Target, PrevTarget]
        [[0, 1, 2, 3, 4, 9], 4, 2, 0, [0, 1, 2, 9]],
        // [Target, Anchor, PrevTarget]
        [[0, 1, 2, 3, 4, 9], 4, 0, 2, [0, 1, 2, 9]],
        // [Target, PrevTarget, Anchor]
        [[2, 3, 4, 9], 2, 0, 4, [0, 1, 2, 3, 4, 9]],
    ].forEach(([prevSelection, prevTarget, target, anchor, expected], index) => {
        const expectedSet = new Set(expected);
        test(`should select the correct elements (data set #${index})`, () => {
            const ret = shiftSelect(new Set(prevSelection), prevTarget, target, anchor);
            expect(ret.equals(expectedSet)).toBeTruthy();
        });
    });

    test('should throw when params are invalid (very rare)', () => {
        const prevSelection = new Set([1, 2, 3, 4]);
        expect(() => {
            shiftSelect(prevSelection, undefined, undefined, undefined);
        }).toThrow();
    });
});
