import {
    addTime,
    convertDateToUnixMidnightTime,
    convertISOStringToUTCDate,
    convertISOStringtoRFC3339String,
    convertToMs,
    formatTime,
    isCurrentYear,
    isToday,
    isTomorrow,
    isValidDate,
    isYesterday,
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

        // disabling as this does not play well with daylight saving time
        test.skip('should return true when date value is a Date and is yesterday', () => {
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

    describe('isValidDate()', () => {
        test.each([
            ['2019-01-01', true],
            ['2019-01-01T12:34:56', true],
            ['2019-01-01T09:41:56-07:00', true],
            ['some random string', false],
            ['', false],
        ])('should interpret %s as a %p date', (dateString, expected) => {
            const date = new Date(dateString);
            expect(isValidDate(date)).toBe(expected);
        });
    });

    describe('addTime()', () => {
        test('should correctly add time', () => {
            const TEN_MIN_IN_MS = 600000;
            const date = new Date('1995-12-17T03:24:00');
            const result = addTime(date, TEN_MIN_IN_MS) as Date;
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
        test.each([
            ['2018-06-13T00:00:00.000Z', '2018-06-13T00:00:00.000Z'],
            ['2018-06-13T01:00:00.000+01:00', '2018-06-13T00:00:00.000Z'],
            ['2018-06-12T23:00:00.000-0100', '2018-06-13T00:00:00.000Z'],
            ['2018-06-13T02:00:00.000+02', '2018-06-13T00:00:00.000Z'],
        ])('should correctly convert from %s to %s', (originDateTime, expectedDateTime) => {
            const result = convertISOStringToUTCDate(originDateTime);
            // Convert both dates to UTC for comparison
            const expected = new Date(expectedDateTime);
            expect(result.getTime()).toBe(expected.getTime());
        });
    });

    describe('convertDateToUnixMidnightTime()', () => {
        test('should correctly convert date', () => {
            const date = new Date('2018-06-13T07:00:00.000Z');
            const result = convertDateToUnixMidnightTime(date);
            expect(result).toBe(date.setHours(0, 0, 0, 0));
        });
    });

    describe('convertISOStringtoRFC3339String()', () => {
        test.each([
            // UTC
            ['2018-06-13T00:00:00.000Z', '2018-06-13T00:00:00.000Z'],
            // backward-looking timezone examples
            ['2018-06-13T00:00:00-05', '2018-06-13T00:00:00.000-05:00'],
            ['2018-06-13T00:00:00-0500', '2018-06-13T00:00:00.000-05:00'],
            ['2018-06-13T00:00:00.000-05', '2018-06-13T00:00:00.000-05:00'],
            ['2018-06-13T00:00:00.000-0500', '2018-06-13T00:00:00.000-05:00'],
            ['2018-06-13T00:00:00.000-05:00', '2018-06-13T00:00:00.000-05:00'],
            // forward-looking timezone examples
            ['2018-06-13T00:00:00.000+05', '2018-06-13T00:00:00.000+05:00'],
            ['2018-06-13T00:00:00.000+0600', '2018-06-13T00:00:00.000+06:00'],
            ['2018-06-13T00:00:00.000+07:00', '2018-06-13T00:00:00.000+07:00'],
            // Half hour examples
            ['2018-06-13T00:00:00.000-07:30', '2018-06-13T00:00:00.000-07:30'],
            ['2018-06-13T00:00:00.000-05:00', '2018-06-13T00:00:00.000-05:00'],
            ['2018-06-13T00:00:00.000-0630', '2018-06-13T00:00:00.000-06:30'],
            // Null-conversion examples
            ['2018-06-13T00:00:00.000-05:45', '2018-06-13T00:00:00.000-05:45'],
            ['2018-06-13T00:00:00.000+34', '2018-06-13T00:00:00.000+34'],
        ])('should convert %s to %s correctly', (from, to) => {
            const input = convertISOStringtoRFC3339String(from);
            expect(input).toEqual(to);
        });
    });
});
