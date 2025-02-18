import { isFileLargerThan } from '../utils/isFileLargerThan';

describe('isFileLargerThan', () => {
    test.each([
        [{ id: '123', type: 'file', size: 49 }, 50, false],
        [{ id: '456', type: 'file', size: 50 }, 50, false],
        [{ id: '789', type: 'file', size: 51 }, 50, true],
        [null, 50, false],
        [null, 50, false],
    ])('Should correctly check if file is larger than benchmark', (file, breakpoint, expected) => {
        const result = isFileLargerThan(file, breakpoint);

        expect(result).toEqual(expected);
    });
});
