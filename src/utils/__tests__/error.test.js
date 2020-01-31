import { getBadItemError, getBadPermissionsError, isUserCorrectableError } from '../error';

describe('util/error', () => {
    describe('getBadItemError()', () => {
        test('should set and get correctly', () => {
            expect(getBadItemError().message).toBe('Bad box item!');
        });
    });

    describe('getBadPermissionsError()', () => {
        test('should set and get correctly', () => {
            expect(getBadPermissionsError().message).toBe('Insufficient Permissions!');
        });
    });

    describe('isUserCorrectableError', () => {
        test('should return true if status is 401', () => {
            expect(isUserCorrectableError(401)).toBe(true);
        });

        test('should return true if status is 409', () => {
            expect(isUserCorrectableError(409)).toBe(true);
        });

        test('should return true if status is >= 500', () => {
            expect(isUserCorrectableError(500)).toBe(true);
            expect(isUserCorrectableError(502)).toBe(true);
        });

        test('should return true if status is 429', () => {
            expect(isUserCorrectableError(429)).toBe(true);
        });

        test('should return false if status is not 401, 409, 429, or >= 500', () => {
            expect(isUserCorrectableError(404)).toBe(false);
        });
    });
});
