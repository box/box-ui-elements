/* eslint-disable jsx-a11y/media-has-caption */
import {
    convertTimestampToSeconds,
    convertMillisecondsToHHMMSS,
    convertSecondsToHHMMSS,
    formatTimestamp,
} from '../timestampUtils.tsx';

describe('elements/content-sidebar/ActivityFeed/utils/timestampUtils', () => {
    describe('convertMillisecondsToHHMMSS', () => {
        test('should convert milliseconds to HH:MM:SS format correctly', () => {
            expect(convertMillisecondsToHHMMSS(0)).toBe('00:00:00');
            expect(convertMillisecondsToHHMMSS(1000)).toBe('00:00:01');
            expect(convertMillisecondsToHHMMSS(60000)).toBe('00:01:00');
            expect(convertMillisecondsToHHMMSS(3600000)).toBe('01:00:00');
        });

        test('should handle complex time values correctly', () => {
            expect(convertMillisecondsToHHMMSS(3661000)).toBe('01:01:01');
            expect(convertMillisecondsToHHMMSS(7325000)).toBe('02:02:05');
            expect(convertMillisecondsToHHMMSS(90061000)).toBe('25:01:01');
        });

        test('should properly pad single digits with zeros', () => {
            expect(convertMillisecondsToHHMMSS(5000)).toBe('00:00:05');
            expect(convertMillisecondsToHHMMSS(65000)).toBe('00:01:05');
            expect(convertMillisecondsToHHMMSS(3665000)).toBe('01:01:05');
        });

        test('should handle edge cases', () => {
            expect(convertMillisecondsToHHMMSS(999)).toBe('00:00:00');
            expect(convertMillisecondsToHHMMSS(59999)).toBe('00:00:59');
            expect(convertMillisecondsToHHMMSS(3599999)).toBe('00:59:59');
        });

        test('should handle large values correctly', () => {
            expect(convertMillisecondsToHHMMSS(86400000)).toBe('24:00:00');
            expect(convertMillisecondsToHHMMSS(90000000)).toBe('25:00:00');
            expect(convertMillisecondsToHHMMSS(3661000000)).toBe('1016:56:40');
        });

        test('should handle fractional milliseconds by truncating', () => {
            expect(convertMillisecondsToHHMMSS(1500.7)).toBe('00:00:01');
            expect(convertMillisecondsToHHMMSS(65000.9)).toBe('00:01:05');
        });

        test('should handle invalid input', () => {
            expect(convertMillisecondsToHHMMSS(NaN)).toBe('00:00:00');
            expect(convertMillisecondsToHHMMSS(-1)).toBe('00:00:00');
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
            expect(convertSecondsToHHMMSS(0)).toBe('00:00:00');
            expect(convertSecondsToHHMMSS(1)).toBe('00:00:01');
            expect(convertSecondsToHHMMSS(60)).toBe('00:01:00');
            expect(convertSecondsToHHMMSS(3600)).toBe('01:00:00');
        });

        test('should handle complex time values correctly', () => {
            expect(convertSecondsToHHMMSS(3661)).toBe('01:01:01');
            expect(convertSecondsToHHMMSS(7325)).toBe('02:02:05');
            expect(convertSecondsToHHMMSS(90061)).toBe('25:01:01');
        });

        test('should properly pad single digits with zeros', () => {
            expect(convertSecondsToHHMMSS(5)).toBe('00:00:05');
            expect(convertSecondsToHHMMSS(65)).toBe('00:01:05');
            expect(convertSecondsToHHMMSS(3665)).toBe('01:01:05');
        });

        test('should handle large values correctly', () => {
            expect(convertSecondsToHHMMSS(86400)).toBe('24:00:00');
            expect(convertSecondsToHHMMSS(90000)).toBe('25:00:00');
        });
    });

    describe('formatTimestamp', () => {
        let mockVideo;
        let mockPause;
        beforeEach(() => {
            mockPause = jest.fn();
            mockVideo = { currentTime: 0, pause: mockPause };

            const mockMediaDashContainer = { querySelector: () => mockVideo };

            jest.spyOn(document, 'querySelector').mockImplementation(query => {
                if (query === '.bp-media-dash') {
                    return mockMediaDashContainer;
                }

                return null;
            });
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        test('should format timestamp correctly', () => {
            const commentText = '#[timestamp:123000,versionId:123] with some text';
            const timestamp = '#[timestamp:123000,versionId:123]';
            const contentKey = 'test-key';
            const result = formatTimestamp(commentText, timestamp, contentKey);
            expect(result).toBeDefined();
            const [button, text] = result.props.children;
            expect(button.type).toBe('div');
            const link = button.props.children;
            expect(link.type).toBe('a');
            expect(link.props.href).toBe('#');
            expect(link.props.onClick).toBeDefined();
            expect(link.props.children).toBe('00:02:03');
            expect(text).toBe(' with some text');
        });

        test('should handle click event to set the video current time and pause the video', () => {
            const commentText = ' #[timestamp:123000,versionId:123] with some text';
            const timestamp = '#[timestamp:123000,versionId:123]';
            const result = formatTimestamp(commentText, timestamp);
            const [button] = result.props.children;
            const link = button.props.children;
            const { onClick } = link.props;
            onClick({ preventDefault: jest.fn() });
            expect(mockVideo.currentTime).toBe(123);
            expect(mockPause).toHaveBeenCalled();
        });
        test('should handle empty text', () => {
            const result = formatTimestamp('', '#[timestamp:123000,versionId:123]');
            expect(result).toBeDefined();
            const [button, text] = result.props.children;
            expect(button.type).toBe('div');
            expect(text).toBe('');
            const link = button.props.children;
            expect(link.props.children).toBe('00:02:03');
        });

        test('should handle empty timestamp match', () => {
            const text = 'Check this out';
            const timestampMatch = '';
            const result = formatTimestamp(text, timestampMatch);
            expect(result).toBe('Check this out');
        });
    });
});
