import fuzzySearch from '../fuzzySearch';

describe('util/fuzzySearch', () => {
    test('should return true when search is equal to content', () => {
        expect(fuzzySearch('foo', 'foo')).toBe(true);
    });

    test('should return true when doing a basic search', () => {
        expect(fuzzySearch('foo', 'foo bar')).toBe(true);
    });

    test('should do fuzzy searching', () => {
        expect(fuzzySearch('ar', 'foo bar')).toBe(true);
    });

    test('should return false when content is empty', () => {
        expect(fuzzySearch('foo', '')).toBe(false);
    });

    test('should return false when seach is empty', () => {
        expect(fuzzySearch('', 'foo bar')).toBe(false);
    });
});
