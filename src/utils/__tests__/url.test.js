/* eslint-disable no-script-url -- javascript: payloads assert URL sanitization */
import { isSafeHref, openUrlSafely, updateQueryParameters } from '../url';

describe('utils/url', () => {
    describe('isSafeHref()', () => {
        test.each([
            ['https://example.com', true],
            ['http://example.com/path?q=1', true],
            ['HTTPS://EXAMPLE.COM', true],
            ['mailto:user@example.com', true],
            ['tel:+15555555555', true],
            ['ftp://files.example.com/file', true],
            ['/relative/path', true],
            ['foo', true],
            ['#section', true],
            ['//cdn.example.com/lib.js', true],
            ['javascript:alert(1)', false],
            ['JAVASCRIPT:alert(1)', false],
            [' javascript:alert(1)', false],
            ['data:text/html,<script>alert(1)</script>', false],
            ['vbscript:msgbox(1)', false],
            ['file:///etc/passwd', false],
            ['', false],
            ['   ', false],
        ])('isSafeHref(%j) is %s', (href, expected) => {
            expect(isSafeHref(href)).toBe(expected);
        });

        test('returns false for non-strings', () => {
            expect(isSafeHref(null)).toBe(false);
            expect(isSafeHref(undefined)).toBe(false);
        });
    });

    describe('openUrlSafely()', () => {
        const originalOpen = window.open;

        beforeEach(() => {
            window.open = jest.fn(() => ({ opener: 'set' }));
        });

        afterEach(() => {
            window.open = originalOpen;
        });

        test('opens http(s) URLs with noopener,noreferrer and clears opener', () => {
            const opened = { opener: 'set' };
            window.open = jest.fn(() => opened);

            openUrlSafely('https://example.com/path');

            expect(window.open).toHaveBeenCalledWith('https://example.com/path', '_blank', 'noopener,noreferrer');
            expect(opened.opener).toBeNull();
        });

        test('does not open javascript: URLs', () => {
            openUrlSafely('javascript:alert(1)');
            expect(window.open).not.toHaveBeenCalled();
        });

        test('does not open when url is missing', () => {
            openUrlSafely(undefined);
            expect(window.open).not.toHaveBeenCalled();
        });

        test('does not throw when window.open returns null', () => {
            window.open = jest.fn(() => null);
            expect(() => openUrlSafely('https://example.com')).not.toThrow();
        });
    });

    describe('updateQueryParameters()', () => {
        test('adds query parameters to a url', () => {
            expect(updateQueryParameters('https://example.com/path', { foo: 'bar' })).toBe(
                'https://example.com/path?foo=bar',
            );
        });
    });
});
