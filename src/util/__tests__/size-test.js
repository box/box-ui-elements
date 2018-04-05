import size from '../size';

describe('util/size', () => {
    test('should return 0 bytes when undefined', () => {
        expect(size()).toBe('0 Byte');
    });
    test('should return 0 bytes when 0', () => {
        expect(size(0)).toBe('0 Byte');
    });
    test('should return 1 Bytes', () => {
        expect(size(1)).toBe('1 Bytes');
    });
    test('should return 1 KB', () => {
        expect(size(1024)).toBe('1 KB');
    });
    test('should return 1 MB', () => {
        expect(size(1024 * 1024)).toBe('1 MB');
    });
    test('should return 1 GB', () => {
        expect(size(1024 * 1024 * 1024)).toBe('1 GB');
    });
    test('should return 1 TB', () => {
        expect(size(1024 * 1024 * 1024 * 1024)).toBe('1 TB');
    });
    test('should return 1 PB', () => {
        expect(size(1024 * 1024 * 1024 * 1024 * 1024)).toBe('1 PB');
    });
});
