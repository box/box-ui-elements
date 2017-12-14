import { isToday, isYesterday, formatTime } from '../datetime';

describe('util/datetime/isToday()', () => {
    test('should return true for today', () => {
        expect(isToday(new Date())).toBeTruthy();
        expect(isYesterday(new Date())).toBeFalsy();
    });
});

describe('util/datetime/isYesterday()', () => {
    test('should return true for yesterday', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        expect(isToday(yesterday)).toBeFalsy();
        expect(isYesterday(yesterday)).toBeTruthy();
    });
});

describe('util/datetime/formatTime()', () => {
    test('should correctly format 3 hours', () => {
        const result = formatTime(10800);
        expect(result).toBe('3:00:00');
    });

    test('should correctly format the time', () => {
        const result = formatTime(11211);
        expect(result).toBe('3:06:51');
    });

    test('should correctly format when double-digit minutes', () => {
        const result = formatTime(705);
        expect(result).toBe('11:45');
    });

    test('should correctly format when single-digit minutes', () => {
        const result = formatTime(105);
        expect(result).toBe('1:45');
    });

    test('should correctly format when 0 minutes', () => {
        const result = formatTime(9);
        expect(result).toBe('0:09');
    });

    test('should correctly format 0 seconds', () => {
        const result = formatTime(0);
        expect(result).toBe('0:00');
    });
});
