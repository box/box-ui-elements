/* eslint-disable no-script-url -- javascript:/data:/vbscript: payloads assert iframe URL sanitization */
import openUrlInsideIframe from '../iframe';
import { isSafeHref } from '../url';

describe('openUrlInsideIframe', () => {
    test('should create new iframe', () => {
        const url = 'http://box.com/foobar';
        const firstIframe = openUrlInsideIframe(url);
        expect(firstIframe).toEqual(document.querySelector('#boxdownloadiframe'));
        expect(firstIframe.src).toEqual(url);

        const url2 = 'http://box.com/foobar2';
        const secondIframe = openUrlInsideIframe(url2);
        expect(secondIframe).toEqual(document.querySelector('#boxdownloadiframe'));
        expect(secondIframe.src).toEqual(url2);

        expect(secondIframe).toEqual(firstIframe);
    });

    test.each(['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>', 'vbscript:msgbox(1)'])(
        'should not assign unsafe URL %s to the iframe',
        unsafeUrl => {
            expect(isSafeHref(unsafeUrl)).toBe(false);

            const safeUrl = 'http://box.com/safe';
            const iframe = openUrlInsideIframe(safeUrl);
            expect(iframe.src).toEqual(safeUrl);

            openUrlInsideIframe(unsafeUrl);
            expect(iframe.src).toEqual('about:blank');
        },
    );
});
