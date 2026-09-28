import { isFileLargerThan } from '../utils/isFileLargerThan';

describe('isFileLargerThan', () => {
    test.each([
        [{ id: 'file-49', size: 49 }, 50, false],
        [{ id: 'file-50', size: 50 }, 50, false],
        [{ id: 'file-51', size: 51 }, 50, true],
        [{ id: 'file-without-size' }, 50, false],
        [null, 50, false],
    ])('Should correctly check if file is larger than benchmark', (file, breakpoint, expected) => {
        const result = isFileLargerThan(file, breakpoint);

        expect(result).toEqual(expected);
    });
});
