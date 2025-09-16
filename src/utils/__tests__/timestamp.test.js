/* eslint-disable jsx-a11y/media-has-caption */
import { convertTimestampToSeconds, convertMillisecondsToHMMSS, convertSecondsToHMMSS } from '../timestamp';

describe('utils/timestamp', () => {
    describe('convertMillisecondsToHMMSS', () => {
        test('should convert milliseconds to HH:MM:SS format correctly', () => {
            expect(convertMillisecondsToHMMSS(0)).toBe('0:00:00');
            expect(convertMillisecondsToHMMSS(1000)).toBe('0:00:01');
            expect(convertMillisecondsToHMMSS(60000)).toBe('0:01:00');
            expect(convertMillisecondsToHMMSS(3600000)).toBe('1:00:00');
        });

        test('should handle complex time values correctly', () => {
            expect(convertMillisecondsToHMMSS(3661000)).toBe('1:01:01');
            expect(convertMillisecondsToHMMSS(7325000)).toBe('2:02:05');
            expect(convertMillisecondsToHMMSS(90061000)).toBe('25:01:01');
        });

        test('should properly pad single digits with zeros', () => {
            expect(convertMillisecondsToHMMSS(5000)).toBe('0:00:05');
            expect(convertMillisecondsToHMMSS(65000)).toBe('0:01:05');
            expect(convertMillisecondsToHMMSS(3665000)).toBe('1:01:05');
        });

        test('should handle edge cases', () => {
            expect(convertMillisecondsToHMMSS(999)).toBe('0:00:00');
            expect(convertMillisecondsToHMMSS(59999)).toBe('0:00:59');
            expect(convertMillisecondsToHMMSS(3599999)).toBe('0:59:59');
        });

        test('should handle large values correctly', () => {
            expect(convertMillisecondsToHMMSS(86400000)).toBe('24:00:00');
            expect(convertMillisecondsToHMMSS(90000000)).toBe('25:00:00');
            expect(convertMillisecondsToHMMSS(3661000000)).toBe('1016:56:40');
        });

        test('should handle fractional milliseconds by truncating', () => {
            expect(convertMillisecondsToHMMSS(1500.7)).toBe('0:00:01');
            expect(convertMillisecondsToHMMSS(65000.9)).toBe('0:01:05');
        });

        test('should handle invalid input', () => {
            expect(convertMillisecondsToHMMSS(NaN)).toBe('0:00:00');
            expect(convertMillisecondsToHMMSS(-1)).toBe('0:00:00');
        });
    });

    describe('convertTimestampToSeconds', () => {
        test('should convert timestamp string to seconds correctly', () => {
            expect(convertTimestampToSeconds(123000)).toBe(123);
            expect(convertTimestampToSeconds(60000)).toBe(60);
            expect(convertTimestampToSeconds(3600000)).toBe(3600);
            expect(convertTimestampToSeconds(2334423)).toBe(2334.423);
            expect(convertTimestampToSeconds(333.3)).toBe(0.3333);
        });

        test('should return 0 if the timestamp is not a number', () => {
            expect(convertTimestampToSeconds('abc123def')).toBe(0);
            expect(convertTimestampToSeconds('456xyz789')).toBe(0);
            expect(convertTimestampToSeconds('')).toBe(0);
            expect(convertTimestampToSeconds('abc')).toBe(0);
            expect(convertTimestampToSeconds(undefined)).toBe(0);
        });
    });

    describe('convertSecondsToHHMMSS', () => {
        test('should convert seconds to HH:MM:SS format correctly', () => {
            expect(convertSecondsToHMMSS(0)).toBe('0:00:00');
            expect(convertSecondsToHMMSS(1)).toBe('0:00:01');
            expect(convertSecondsToHMMSS(60)).toBe('0:01:00');
            expect(convertSecondsToHMMSS(3600)).toBe('1:00:00');
        });

        test('should handle complex time values correctly', () => {
            expect(convertSecondsToHMMSS(3661)).toBe('1:01:01');
            expect(convertSecondsToHMMSS(7325)).toBe('2:02:05');
            expect(convertSecondsToHMMSS(90061)).toBe('25:01:01');
        });

        test('should properly pad single minutes with zeros', () => {
            expect(convertSecondsToHMMSS(5)).toBe('0:00:05');
            expect(convertSecondsToHMMSS(65)).toBe('0:01:05');
            expect(convertSecondsToHMMSS(3665)).toBe('1:01:05');
        });

        test('should handle large values correctly', () => {
            expect(convertSecondsToHMMSS(86400)).toBe('24:00:00');
            expect(convertSecondsToHMMSS(90000)).toBe('25:00:00');
        });
    });
});
