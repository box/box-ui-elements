function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file class for Box marker based API's to inherit common functionality from
 * @author Box
 */
import { getTypedFileId } from '../utils/file';
import Base from './Base';
class MarkerBasedApi extends Base {
  /**
   * @property {Data}
   */

  /**
   * Determines if the API has more items to fetch
   *
   * @param {string} marker the marker from the start to start fetching at
   * @return {boolean} true if there are more items
   */
  hasMoreItems(marker) {
    return marker !== null && marker !== '';
  }

  /**
   * Helper for get
   *
   * @param {string} id the file id
   * @param {string} marker the marker from the start to start fetching at
   * @param {number} limit the number of items to fetch
   * @param {Object} requestData the request query params
   * @param {boolean} shouldFetchAll true if should get all the pages before calling
   * @private
   */
  async markerGetRequest(id, marker, limit, shouldFetchAll, requestData = {}) {
    if (this.isDestroyed()) {
      return;
    }

    // Make the XHR request
    try {
      const url = this.getUrl(id);
      const queryParams = _objectSpread(_objectSpread({}, requestData), {}, {
        marker,
        limit
      });
      const {
        data
      } = await this.xhr.get({
        url,
        id: getTypedFileId(id),
        params: queryParams
      });
      const entries = this.data ? this.data.entries : [];
      this.data = _objectSpread(_objectSpread({}, data), {}, {
        entries: entries.concat(data.entries)
      });
      const nextMarker = data.next_marker;
      if (shouldFetchAll && this.hasMoreItems(nextMarker)) {
        this.markerGetRequest(id, nextMarker, limit, shouldFetchAll, requestData);
        return;
      }
      this.successHandler(this.data);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  /**
   * Marker based API get
   * @param {Object} options
   * @param {string} options.id the file id
   * @param {Function} options.successCallback the success callback
   * @param {Function} options.errorCallback the error callback
   * @param {string} [options.marker] the marker from the start to start fetching at
   * @param {number} [options.limit] the number of items to fetch
   * @param {Object} options.requestData the request query params
   * @param {boolean} [options.shouldFetchAll] true if should get all the pages before calling the sucessCallback
   */
  async markerGet({
    id,
    successCallback,
    errorCallback,
    marker = '',
    limit = 1000,
    requestData,
    shouldFetchAll = true
  }) {
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    return this.markerGetRequest(id, marker, limit, shouldFetchAll, requestData);
  }
}
export default MarkerBasedApi;
//# sourceMappingURL=MarkerBasedAPI.js.map