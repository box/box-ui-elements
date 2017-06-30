/**
 * @flow
 * @file Helper to get mobile
 * @author Box
 */

export default function isMobile() {
    // Relying on the user agent to avoid desktop browsers on machines with touch screens.
    return /iphone|ipad|ipod|android|blackberry|bb10|mini|windows\sce|palm/i.test(navigator.userAgent);
}
