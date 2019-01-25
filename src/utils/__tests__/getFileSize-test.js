import getFileSize from '../getFileSize';

describe('utils/getFileSize', () => {
    test('should return formatted file size', () => {
        const size = getFileSize(629644);
        expect(size).toBe('614.9 KB');
    });

    test('should return formatted file size in a specified locale', () => {
        const size = getFileSize(629644, 'ru');
        expect(size).toBe('614.9 КБ');
    });
});
