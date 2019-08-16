import fuzzySearch from '../fuzzySearch';

describe('util/fuzzySearch', () => {
    test('should return true when search is equal to content', () => {
        expect(fuzzySearch('foo', 'foo')).toBe(true);
    });

    test('should return false when search is larger than the content', () => {
        expect(fuzzySearch('fooo', 'foo')).toBe(false);
    });

    test('should return true when doing a basic search', () => {
        expect(fuzzySearch('foo', 'foo bar')).toBe(true);
    });

    test('should enforce a default character limit', () => {
        expect(fuzzySearch('fo', 'foo bar')).toBe(false);
    });

    test('should allow character limit to be configured', () => {
        expect(fuzzySearch('fo', 'foo bar', 2)).toBe(true);
    });

    test('should return false when search is too broken up in content', () => {
        expect(fuzzySearch('fbr', 'foo barazaz')).toBe(false);
    });

    test('should return false when search is too broken up in longer content', () => {
        // 3 gaps
        expect(fuzzySearch('fooimuartles', 'footimus bartocles')).toBe(false);
    });

    test('should allow approximate number of gaps to be configured', () => {
        // 3 gaps
        expect(fuzzySearch('fooimuartles', 'footimus bartocles', 3, 3)).toBe(true);
    });

    test('should return true when search has more gaps than allowed, but has a large streak', () => {
        // 4 gaps
        expect(fuzzySearch('footimusatce', 'footimus bartocles')).toBe(true);
    });

    test('should handle gap numbers larger than the search term', () => {
        expect(fuzzySearch('foo', 'footimus bartocles', 3, 99999)).toBe(true);
    });

    test('should ignore whitespace in the search', () => {
        expect(fuzzySearch('f o o', 'foo bar')).toBe(true);
    });

    test('should match strings that appear continiously later', () => {
        expect(fuzzySearch('baz', 'foobar bazbat')).toBe(true);
    });

    test('should match strings that appear continiously later', () => {
        expect(fuzzySearch('baz', 'bufoobar bazbat')).toBe(true);
    });

    test('should ignore whitespace in the content', () => {
        expect(fuzzySearch('foo', 'f o o b a r')).toBe(true);
    });

    test('should do fuzzy searching', () => {
        expect(fuzzySearch('ooar', 'foo bar')).toBe(true);
    });

    test('should return false when content is empty', () => {
        expect(fuzzySearch('foo', '')).toBe(false);
    });

    test('should return false when search is empty', () => {
        expect(fuzzySearch('', 'foo bar')).toBe(false);
    });
});
