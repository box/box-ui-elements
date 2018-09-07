import { getBadItemError, getBadPermissionsError } from '../error';

describe('util/error/getBadItemError()', () => {
    test('should set and get correctly', () => {
        expect(getBadItemError().message).toBe('Bad box item!');
    });
});

describe('util/error/getBadPermissionsError()', () => {
    test('should set and get correctly', () => {
        expect(getBadPermissionsError().message).toBe(
            'Insufficient Permissions!',
        );
    });
});
