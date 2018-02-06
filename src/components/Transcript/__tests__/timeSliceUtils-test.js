import isValidStartTime from '../timeSliceUtils';

describe('components/Transcript/timeSliceUtils/isValidStartTime', () => {
    test('should return false when no time slices', () => {
        expect(isValidStartTime()).toBeFalsy();
    });

    test('should return false when empty time slices', () => {
        expect(isValidStartTime([])).toBeFalsy();
    });

    test('should return false when bad time slice', () => {
        expect(isValidStartTime([{}])).toBeFalsy();
    });

    test('should return false when bad time slice start', () => {
        expect(isValidStartTime([{ start: null }])).toBeFalsy();
    });

    test('should return true when good time slice start', () => {
        expect(isValidStartTime([{ start: 10 }])).toBeTruthy();
    });
});
