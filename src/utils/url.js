/**
 * @flow
 * @file Utility functions for urls
 * @author Box
 */
import Uri from 'jsuri';

const SAFE_URL_PROTOCOLS: { [string]: boolean } = {
    'http:': true,
    'https:': true,
    'mailto:': true,
    'tel:': true,
    'ftp:': true,
};

/**
 * Returns true when href is safe to assign to an anchor or window.open.
 * Blocks javascript:, data:, vbscript:, and other non-navigational schemes.
 *
 * @param {?string} href
 * @return {boolean}
 */
function isSafeHref(href: ?string): boolean {
    if (typeof href !== 'string') {
        return false;
    }

    const trimmed = href.trim();
    if (!trimmed) {
        return false;
    }

    try {
        // Dummy base lets relative paths and hashes parse without changing absolute URLs.
        // Protocol-relative `//…` resolving as https via this dummy base is intentional (CDN-style hrefs).
        const parsed = new URL(trimmed, 'https://box.invalid');
        return !!SAFE_URL_PROTOCOLS[parsed.protocol];
    } catch (error) {
        return false;
    }
}

/**
 * Opens a URL in a new tab without leaking window.opener (reverse tabnabbing).
 * No-ops for unsafe schemes such as javascript:.
 *
 * @param {?string} url
 * @return {void}
 */
function openUrlSafely(url: ?string): void {
    if (typeof url !== 'string' || !isSafeHref(url)) {
        return;
    }

    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) {
        newWindow.opener = null;
    }
}

/**
 * Update URL query parameters
 *
 * @param {string} url - the url that contains the potential query parameter string
 * @param {Object} queryParams
 * @return {string}
 */
function updateQueryParameters(url: string, queryParams: Object): string {
    if (!queryParams) {
        return url;
    }

    const uri = new Uri(url);

    Object.keys(queryParams).forEach(key => {
        const value = queryParams[key];

        if (!value) {
            return;
        }

        if (uri.hasQueryParam(key)) {
            uri.replaceQueryParam(key, value);
            return;
        }

        uri.addQueryParam(key, value);
    });

    return uri.toString();
}

export { isSafeHref, openUrlSafely, updateQueryParameters };
