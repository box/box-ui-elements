/**
 * @flow
 * @file Helper to get mobile
 * @author Box
 */

/**
  * Returns whether browser is mobile.
  *
  * @return {boolean} Whether browser is mobile
  */
export function isMobile(): boolean {
    // Relying on the user agent to avoid desktop browsers on machines with touch screens.
    return /iphone|ipad|ipod|android|blackberry|bb10|mini|windows\sce|palm/i.test(navigator.userAgent);
}

/**
 * Returns whether browser is IE.
 *
 * @return {boolena} Whether browser is IE
 */
export function isIE() {
    return /Trident/i.test(navigator.userAgent);
}
