import {
    convertMillisecondsToFrames,
    convertMillisecondsToHMMSS,
    convertMillisecondsToTimecode,
    convertMillisecondsToTimestamp,
    convertSecondsToHMMSS,
    convertTimestampToSeconds,
} from '../timestamp';

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

    describe('convertMillisecondsToTimestamp', () => {
        test('should format sub-hour durations as M:SS', () => {
            expect(convertMillisecondsToTimestamp(0)).toBe('0:00');
            expect(convertMillisecondsToTimestamp(1000)).toBe('0:01');
            expect(convertMillisecondsToTimestamp(4623)).toBe('0:04');
            expect(convertMillisecondsToTimestamp(60000)).toBe('1:00');
            expect(convertMillisecondsToTimestamp(3599999)).toBe('59:59');
        });

        test('should format hour-or-longer durations as H:MM:SS', () => {
            expect(convertMillisecondsToTimestamp(3600000)).toBe('1:00:00');
            expect(convertMillisecondsToTimestamp(3661000)).toBe('1:01:01');
            expect(convertMillisecondsToTimestamp(90061000)).toBe('25:01:01');
        });

        test('should handle invalid input', () => {
            expect(convertMillisecondsToTimestamp(NaN)).toBe('0:00');
            expect(convertMillisecondsToTimestamp(-1)).toBe('0:00');
        });
    });

    describe('convertMillisecondsToTimecode', () => {
        test('should format zero as 00:00:00:00', () => {
            expect(convertMillisecondsToTimecode(0, 24)).toBe('00:00:00:00');
        });

        test('should format milliseconds into HH:MM:SS:FF at 24fps', () => {
            expect(convertMillisecondsToTimecode(1000, 24)).toBe('00:00:01:00');
            expect(convertMillisecondsToTimecode(60000, 24)).toBe('00:01:00:00');
            expect(convertMillisecondsToTimecode(3600000, 24)).toBe('01:00:00:00');
        });

        test('should calculate frame remainder correctly', () => {
            // 1500ms at 24fps = 36 frames total → 1 sec + 12 frames
            expect(convertMillisecondsToTimecode(1500, 24)).toBe('00:00:01:12');
            // 41.666ms per frame at 24fps, so 42ms ≈ 1 frame
            expect(convertMillisecondsToTimecode(42, 24)).toBe('00:00:00:01');
        });

        test('should work with different fps values', () => {
            // 1000ms at 30fps = 30 frames → exactly 1 second
            expect(convertMillisecondsToTimecode(1000, 30)).toBe('00:00:01:00');
            // 500ms at 30fps = 15 frames
            expect(convertMillisecondsToTimecode(500, 30)).toBe('00:00:00:15');
        });

        test('should handle complex values', () => {
            // 61500ms at 30fps = 1845 frames → 1min 1sec 15frames
            expect(convertMillisecondsToTimecode(61500, 30)).toBe('00:01:01:15');
        });

        test('should handle invalid input', () => {
            expect(convertMillisecondsToTimecode(-1, 24)).toBe('00:00:00:00');
            expect(convertMillisecondsToTimecode(NaN, 24)).toBe('00:00:00:00');
        });
    });

    describe('convertMillisecondsToFrames', () => {
        test('should return 0 for zero milliseconds', () => {
            expect(convertMillisecondsToFrames(0, 24)).toBe(0);
        });

        test('should convert milliseconds to frame count at 24fps', () => {
            expect(convertMillisecondsToFrames(1000, 24)).toBe(24);
            expect(convertMillisecondsToFrames(2000, 24)).toBe(48);
            expect(convertMillisecondsToFrames(10000, 24)).toBe(240);
        });

        test('should convert milliseconds to frame count at 30fps', () => {
            expect(convertMillisecondsToFrames(1000, 30)).toBe(30);
            expect(convertMillisecondsToFrames(500, 30)).toBe(15);
        });

        test('should floor partial frames', () => {
            // 100ms at 24fps = 2.4 frames → floor to 2
            expect(convertMillisecondsToFrames(100, 24)).toBe(2);
        });

        test('should handle invalid input', () => {
            expect(convertMillisecondsToFrames(-1, 24)).toBe(0);
            expect(convertMillisecondsToFrames(NaN, 24)).toBe(0);
            expect(convertMillisecondsToFrames(0, 24)).toBe(0);
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
