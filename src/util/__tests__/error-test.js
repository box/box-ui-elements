import getBadItemError from '../error';

describe('util/error/getBadItemError()', () => {
    test('should set and get correctly', () => {
        expect(getBadItemError().message).toBe('Bad box item!');
    });
});
