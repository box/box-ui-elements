import { isFileLargerThan } from '../utils/isFileLargerThan';

describe('isFileLargerThan', () => {
    test.each([
        [{ size: 49 }, 50, false],
        [{ size: 50 }, 50, false],
        [{ size: 51 }, 50, true],
        [{}, 50, false],
        [null, 50, false],
    ])('Should correctly check if file is larger than benchmark', (file, breakpoint, expected) => {
        const result = isFileLargerThan(file, breakpoint);

        expect(result).toEqual(expected);
    });
});
