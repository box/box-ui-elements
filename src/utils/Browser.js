/**
 * @flow
 * @file Helper for some browser utilities
 * @author Box
 */

let isDashSupported;

class Browser {
    /**
     * Returns the user agent.
     * Helps in mocking out.
     *
     * @return {String} navigator userAgent
     */
    static getUserAgent(): string {
        return global.navigator.userAgent;
    }

    /**
     * Returns whether browser is mobile.
     *
     * @return {boolean} Whether browser is mobile
     */
    static isMobile(): boolean {
        // Relying on the user agent to avoid desktop browsers on machines with touch screens.
        return /iphone|ipad|ipod|android|blackberry|bb10|mini|windows\sce|palm/i.test(Browser.getUserAgent());
    }

    /**
     * Returns whether browser is IE.
     *
     * @return {boolena} Whether browser is IE
     */
    static isIE() {
        return /Trident/i.test(Browser.getUserAgent());
    }

    /**
     * Checks the browser for Dash support using H264 high.
     * Dash requires MediaSource extensions to exist and be applicable
     * to the H264 container (since we use H264 and not webm)
     *
     * @public
     * @param {boolean} recheck - recheck support
     * @return {boolean} true if dash is usable
     */
    static canPlayDash(recheck: boolean = false) {
        if (typeof isDashSupported === 'undefined' || recheck) {
            const mse = global.MediaSource;
            isDashSupported =
                !!mse &&
                typeof mse.isTypeSupported === 'function' &&
                mse.isTypeSupported('video/mp4; codecs="avc1.64001E"');
        }

        return isDashSupported;
    }

    /**
     * Checks whether the browser has support for the Clipboard API. This new API supercedes
     * the `execCommand`-based API and uses Promises for detecting whether it works or not.
     *
     * This check determines if the browser can support writing to the clipboard.
     * @see https://www.w3.org/TR/clipboard-apis/#async-clipboard-api
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard
     *
     * @return {boolean} whether writing to the clipboard is possible
     */
    static canWriteToClipboard() {
        return !!(global.navigator.clipboard && global.navigator.clipboard.writeText);
    }

    /**
     * Checks whether the browser has support for the Clipboard API. This new API supercedes
     * the `execCommand`-based API and uses Promises for detecting whether it works or not.
     *
     * This check determines if the browser can support reading from the clipboard.
     * @see https://www.w3.org/TR/clipboard-apis/#async-clipboard-api
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard
     *
     * @return {boolean} whether reading from the clipboard is possible
     */
    static canReadFromClipboard() {
        return !!(global.navigator.clipboard && global.navigator.clipboard.readText);
    }
}

export default Browser;
