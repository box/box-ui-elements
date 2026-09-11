import getFileSize from '../getFileSize';

describe('utils/getFileSize', () => {
    test('should return formatted file size', () => {
        const size = getFileSize(629644);
        expect(size).toBe('614.9 KB');
    });

    test('should return formatted file size in a specified locale', () => {
        let size = getFileSize(629644, 'ru');
        expect(size).toBe('614,9 КБ');

        size = getFileSize(629644, 'fr');
        expect(size).toBe('614,9 Ko');

        size = getFileSize(629644, 'de');
        expect(size).toBe('614,9 KB');

        size = getFileSize(629644, 'ja');
        expect(size).toBe('614.9 KB');
    });
});
