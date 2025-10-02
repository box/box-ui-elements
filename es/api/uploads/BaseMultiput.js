function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Multiput upload base class
 * @author Box
 */
import BaseUpload from './BaseUpload';
const DEFAULT_MULTIPUT_CONFIG = {
  digestReadahead: 5,
  // How many parts past those currently uploading to precompute digest for
  initialRetryDelayMs: 5000,
  // Base for exponential backoff on retries
  maxRetryDelayMs: 60000,
  // Upper bound for time between retries
  parallelism: 4,
  // Maximum number of parts to upload at a time
  requestTimeoutMs: 120000,
  // Idle timeout on part upload, overall request timeout on other requests
  retries: 5 // How many times to retry requests such as upload part or commit. Note that total number of attempts will be retries + 1 in worst case where all attempts fail.
};
class BaseMultiput extends BaseUpload {
  /**
   * [constructor]
   *
   * @param {Options} options
   * @param {Object} sessionEndpoints
   * @param {MultiputConfig} [config]
   * @return {void}
   */
  constructor(options, sessionEndpoints, config) {
    super(_objectSpread(_objectSpread({}, options), {}, {
      shouldRetry: false // disable XHR retries as there is already retry logic
    }));
    /**
     * POST log event
     *
     * @param {string} eventType
     * @param {string} [eventInfo]
     * @return {Promise}
     */
    _defineProperty(this, "logEvent", (eventType, eventInfo) => {
      const data = {
        event_type: eventType
      };
      if (eventInfo) {
        data.event_info = eventInfo;
      }
      return this.xhr.post({
        url: this.sessionEndpoints.logEvent,
        data
      });
    });
    this.config = config || DEFAULT_MULTIPUT_CONFIG;
    this.sessionEndpoints = sessionEndpoints;
  }
}
export default BaseMultiput;
//# sourceMappingURL=BaseMultiput.js.map