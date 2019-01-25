import {
    convertToMs,
    convertDateToUnixMidnightTime,
    convertISOStringToUTCDate,
    isToday,
    isTomorrow,
    isYesterday,
    isCurrentYear,
    formatTime,
    addTime,
} from '../datetime';

describe('utils/datetime', () => {
    describe('convertToMs()', () => {
        test('should convert specified value to ms', () => {
            const value = 534;
            const res = convertToMs(value);
            expect(res).toEqual(value * 1000);
        });
    });

    describe('isToday()', () => {
        test('should return true when date value is today', () => {
            const now = Date.now();
            const res = isToday(now);
            expect(res).toBe(true);
        });

        test('should return false when date value is not today', () => {
            const res = isToday(1473186140000);
            expect(res).toBe(false);
        });

        test('should return true when date value is a Date and istoday', () => {
            expect(isToday(new Date())).toBeTruthy();
            expect(isYesterday(new Date())).toBeFalsy();
        });
    });

    describe('isYesterday()', () => {
        test('should return true when date value is yesterday', () => {
            const yesterday = Date.now() - 24 * 60 * 60 * 1000;
            const res = isYesterday(yesterday);
            expect(res).toBe(true);
        });

        test('should return false when date value is not yesterday', () => {
            const now = Date.now();
            const res = isYesterday(now);
            expect(res).toBe(false);
        });

        test('should return true when date value is a Date and is yesterday', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            expect(isToday(yesterday)).toBeFalsy();
            expect(isYesterday(yesterday)).toBeTruthy();
        });
    });

    describe('isCurrentYear()', () => {
        test('should return true when date value is the current year', () => {
            const currentYear = Date.now();
            const res = isCurrentYear(currentYear);
            expect(res).toBe(true);
        });

        test('should return false when date value is not the current year', () => {
            const previousYear = Date.now() - 365 * 24 * 60 * 60 * 1000;
            const res = isCurrentYear(previousYear);
            expect(res).toBe(false);
        });

        test('should return true when date value is a Date and is current year', () => {
            const currentYear = new Date();
            expect(isCurrentYear(currentYear)).toBeTruthy();
        });
    });

    describe('isTomorrow()', () => {
        test('should return true when date value is tomorrow', () => {
            const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
            const res = isTomorrow(tomorrow);
            expect(res).toBe(true);
        });

        test('should return false when date value is not tomorrow', () => {
            const now = Date.now();
            const res = isTomorrow(now);
            expect(res).toBe(false);
        });

        test('should return true when date value is a Date and is tomorrow', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            expect(isToday(tomorrow)).toBeFalsy();
            expect(isTomorrow(tomorrow)).toBeTruthy();
        });
    });

    describe('formatTime()', () => {
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

    describe('addTime()', () => {
        test('should correctly add time', () => {
            const TEN_MIN_IN_MS = 600000;
            const date = new Date('1995-12-17T03:24:00');
            const result = addTime(date, TEN_MIN_IN_MS);
            expect(result.getMinutes()).toBe(34);
        });

        test('should correctly add time if the date Value is a number', () => {
            const TEN_MIN_IN_MS = 600000;
            const date = new Date('1995-12-17T03:24:00').getTime();
            const result = addTime(date, TEN_MIN_IN_MS);
            expect(result).toBe(date + 600000);
        });
    });

    describe('convertISOStringToUTCDate()', () => {
        test('should correctly convert date', () => {
            const result = convertISOStringToUTCDate('2018-06-13T00:00:00.000Z');
            expect(result.toISOString()).toBe('2018-06-13T07:00:00.000Z');
        });
    });

    describe('convertDateToUnixMidnightTime()', () => {
        test('should correctly convert date', () => {
            const result = new Date(convertDateToUnixMidnightTime(new Date('2018-06-13T07:00:00.000Z')));
            expect(result.toISOString()).toBe('2018-06-13T00:00:00.000Z');
        });
    });
});
