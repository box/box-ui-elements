import clampPercentage from '../utils/clampPercentage';

describe('clampPercentage', () => {
    test.each([
        [50, 50],
        [0, 0],
        [100, 100],
        [-0.5, 0],
        [100.5, 100],
        [99.999, 99.999],
    ])('clampPercentage(%s) should return %s', (input, expected) => {
        expect(clampPercentage(input)).toBe(expected);
    });
});
