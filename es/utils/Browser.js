/**
 * 
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
  static getUserAgent() {
    return global.navigator.userAgent;
  }

  /**
   * Returns whether browser is mobile, including tablets.
   *
   * We rely on user agent (UA) to avoid matching desktops with touchscreens.
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent#mobile_tablet_or_desktop
   *
   * @return {boolean} Whether browser is mobile
   */
  static isMobile() {
    const userAgent = Browser.getUserAgent();
    return /iphone|ipad|ipod|android|blackberry|bb10|mini|windows\sce|palm/i.test(userAgent) || /Mobi/i.test(userAgent);
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
   * Returns whether browser is Firefox.
   *
   * @return {boolean} Whether browser is Firefox
   */
  static isFirefox() {
    const userAgent = Browser.getUserAgent();
    return /Firefox/i.test(userAgent) && !/Seamonkey\//i.test(userAgent);
  }

  /**
   * Returns whether browser is Safari.
   *
   * @return {boolean} Whether browser is Safari
   */
  static isSafari() {
    const userAgent = Browser.getUserAgent();
    return /AppleWebKit/i.test(userAgent) && !/Chrome\//i.test(userAgent);
  }

  /**
   * Returns whether browser is Mobile Safari.
   *
   * @see https://developer.chrome.com/docs/multidevice/user-agent/
   * @return {boolean} Whether browser is Mobile Safari
   */
  static isMobileSafari() {
    return Browser.isMobile() && Browser.isSafari() && !Browser.isMobileChromeOniOS();
  }

  /**
   * Returns whether browser is Mobile Chrome on iOS.
   *
   * @see https://developer.chrome.com/docs/multidevice/user-agent/
   * @return {boolean} Whether browser is Mobile Chrome on iOS
   */
  static isMobileChromeOniOS() {
    const userAgent = Browser.getUserAgent();
    return Browser.isMobile() && /AppleWebKit/i.test(userAgent) && /CriOS\//i.test(userAgent);
  }

  /**
   * Returns whether browser can download via HTML5.
   *
   * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/a/download.js
   * @return {boolean} Whether browser supports downloading
   */
  static canDownload() {
    return !Browser.isMobile() || !window.externalHost && 'download' in document.createElement('a');
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
  static canPlayDash(recheck = false) {
    if (typeof isDashSupported === 'undefined' || recheck) {
      const mse = global.MediaSource;
      isDashSupported = !!mse && typeof mse.isTypeSupported === 'function' && mse.isTypeSupported('video/mp4; codecs="avc1.64001E"');
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
//# sourceMappingURL=Browser.js.map