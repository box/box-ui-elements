import { isValidTimeSlice } from '../timeSliceUtils';

describe('elements/Transcript/timeSliceUtils/isValidTimeSlice', () => {
    test('should return false when no time slices', () => {
        expect(isValidTimeSlice()).toBeFalsy();
    });

    test('should return false when empty time slices', () => {
        expect(isValidTimeSlice([])).toBeFalsy();
    });

    test('should return false when bad time slice', () => {
        expect(isValidTimeSlice([{}])).toBeFalsy();
    });

    test('should return false when bad time slice start', () => {
        expect(isValidTimeSlice([{ start: null }])).toBeFalsy();
    });

    test('should return true when good time slice start', () => {
        expect(isValidTimeSlice([{ start: 10 }])).toBeTruthy();
    });
});
