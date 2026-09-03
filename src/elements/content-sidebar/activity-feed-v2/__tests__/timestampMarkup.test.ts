import { buildTimestampMarkup, extractTimestampMarkup } from '../timestampMarkup';

describe('elements/content-sidebar/activity-feed-v2/timestampMarkup', () => {
    describe('extractTimestampMarkup()', () => {
        test('should return text unchanged when no timestamp markup is present', () => {
            expect(extractTimestampMarkup('regular comment')).toEqual({ cleanText: 'regular comment' });
        });

        test('should handle empty text', () => {
            expect(extractTimestampMarkup('')).toEqual({ cleanText: '' });
        });

        test('should extract timestamp markup with versionId and return a frame badge target', () => {
            const result = extractTimestampMarkup('#[timestamp:8055,versionId:2390295731268]  wowo');
            expect(result.cleanText).toBe('wowo');
            expect(result.target).toEqual({ timestamp: '0:08', type: 'frame' });
            expect(result.timestampMarkup).toBe('#[timestamp:8055,versionId:2390295731268]');
            expect(result.timestampMs).toBe(8055);
            expect(result.timestampEndMs).toBeUndefined();
        });

        test('should extract timestamp markup without versionId', () => {
            const result = extractTimestampMarkup('#[timestamp:65000] hello');
            expect(result.cleanText).toBe('hello');
            expect(result.timestampMs).toBe(65000);
            expect(result.timestampEndMs).toBeUndefined();
        });

        test('should extract the end timestamp of a range comment', () => {
            const result = extractTimestampMarkup('#[timestamp:8055,endTimestamp:12000,versionId:99] great take');
            expect(result.cleanText).toBe('great take');
            expect(result.target).toEqual({ timestamp: '0:08', type: 'frame' });
            expect(result.timestampMarkup).toBe('#[timestamp:8055,endTimestamp:12000,versionId:99]');
            expect(result.timestampMs).toBe(8055);
            expect(result.timestampEndMs).toBe(12000);
        });

        test('should tolerate arbitrary key order', () => {
            const result = extractTimestampMarkup('#[versionId:99,endTimestamp:12000,timestamp:8055] hello');
            expect(result.cleanText).toBe('hello');
            expect(result.timestampMs).toBe(8055);
            expect(result.timestampEndMs).toBe(12000);
        });

        test('should tolerate unknown keys without dropping the markup', () => {
            const result = extractTimestampMarkup('#[timestamp:8055,someFutureKey:7,versionId:99] hello');
            expect(result.cleanText).toBe('hello');
            expect(result.timestampMs).toBe(8055);
            expect(result.timestampMarkup).toBe('#[timestamp:8055,someFutureKey:7,versionId:99]');
        });

        test('should leave markup without a start timestamp untouched', () => {
            const result = extractTimestampMarkup('#[endTimestamp:12000,versionId:99] hello');
            expect(result.cleanText).toBe('#[endTimestamp:12000,versionId:99] hello');
            expect(result.timestampMs).toBeUndefined();
            expect(result.timestampEndMs).toBeUndefined();
        });

        test('should leave timestamp markup that does not anchor at the start of the message untouched', () => {
            const result = extractTimestampMarkup('see #[timestamp:8055,versionId:1] this');
            expect(result.cleanText).toBe('see #[timestamp:8055,versionId:1] this');
            expect(result.target).toBeUndefined();
        });

        test('should return empty cleanText when the message is only timestamp markup', () => {
            const result = extractTimestampMarkup('#[timestamp:8055,versionId:1]');
            expect(result.cleanText).toBe('');
            expect(result.target).toEqual({ timestamp: '0:08', type: 'frame' });
        });

        test('should leave malformed timestamp markup untouched', () => {
            const result = extractTimestampMarkup('#[timestamp:abc] hello');
            expect(result.cleanText).toBe('#[timestamp:abc] hello');
            expect(result.target).toBeUndefined();
        });

        test('should drop the badge when the timestamp value exceeds Number.MAX_SAFE_INTEGER', () => {
            const result = extractTimestampMarkup('#[timestamp:99999999999999999999] hello');
            expect(result.cleanText).toBe('hello');
            expect(result.target).toBeUndefined();
            expect(result.timestampMs).toBeUndefined();
        });

        test.each([
            ['an end before the start', '#[timestamp:12000,endTimestamp:8055,versionId:99] hello', 12000],
            ['an end equal to the start', '#[timestamp:8055,endTimestamp:8055,versionId:99] hello', 8055],
            [
                'an end beyond Number.MAX_SAFE_INTEGER',
                '#[timestamp:8055,endTimestamp:99999999999999999999] hello',
                8055,
            ],
        ])('should fall back to a single timestamp for %s', (_label, text, expectedStartMs) => {
            const result = extractTimestampMarkup(text);
            expect(result.cleanText).toBe('hello');
            expect(result.timestampMs).toBe(expectedStartMs);
            expect(result.timestampEndMs).toBeUndefined();
        });

        test('should keep the full markup so an edit can re-prepend a range verbatim', () => {
            const markup = '#[timestamp:8055,endTimestamp:12000,versionId:99]';
            expect(extractTimestampMarkup(`${markup} hello`).timestampMarkup).toBe(markup);
        });
    });

    describe('buildTimestampMarkup()', () => {
        test('should emit markup identical to the single-timestamp format when there is no range', () => {
            expect(buildTimestampMarkup({ startMs: 8055, versionId: '99' })).toBe('#[timestamp:8055,versionId:99]');
        });

        test('should emit the end timestamp for a range', () => {
            expect(buildTimestampMarkup({ endMs: 12000, startMs: 8055, versionId: '99' })).toBe(
                '#[timestamp:8055,endTimestamp:12000,versionId:99]',
            );
        });

        test.each([
            ['the end is before the start', 4000],
            ['the end equals the start', 8055],
            ['the end is not a safe integer', Number.MAX_SAFE_INTEGER + 2],
        ])('should omit the end timestamp when %s', (_label, endMs) => {
            expect(buildTimestampMarkup({ endMs, startMs: 8055, versionId: '99' })).toBe(
                '#[timestamp:8055,versionId:99]',
            );
        });

        test('should round-trip a range through the parser', () => {
            const markup = buildTimestampMarkup({ endMs: 12000, startMs: 8055, versionId: '99' });
            const result = extractTimestampMarkup(`${markup} great take`);
            expect(result.timestampMs).toBe(8055);
            expect(result.timestampEndMs).toBe(12000);
            expect(result.cleanText).toBe('great take');
        });
    });
});
