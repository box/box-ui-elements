function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file class for Box offset based API's to inherit common functionality from
 * @author Box
 */
import { getTypedFileId } from '../utils/file';
import Base from './Base';
import { DEFAULT_FETCH_START, DEFAULT_FETCH_END } from '../constants';
class OffsetBasedApi extends Base {
  /**
   * @property {Data}
   */

  /**
   * Gets query params for the API
   *
   * @param {number} offset the offset from the start to start fetching at
   * @param {number} limit the number of items to fetch
   * @param {array} fields the fields to fetch
   * @return the query params object
   */
  getQueryParameters(offset, limit, fields) {
    const queryParams = {
      offset,
      limit
    };
    if (fields && fields.length > 0) {
      queryParams.fields = fields.toString();
    }
    return queryParams;
  }

  /**
   * Determines if the API has more items to fetch
   *
   * @param {number} offset the offset from the start to start fetching at
   * @param {number} totalCount the total number of items
   * @return {boolean} true if there are more items
   */
  hasMoreItems(offset, totalCount) {
    return totalCount === undefined || offset < totalCount;
  }

  /**
   * Helper for get
   *
   * @param {string} id the file id
   * @param {number} offset the offset from the start to start fetching at
   * @param {number} limit the number of items to fetch
   * @param {array} fields the fields to fetch
   * @param {boolean} shouldFetchAll true if should get all the pages before calling the sucessCallback
   * @private
   */
  async offsetGetRequest(id, offset, limit, shouldFetchAll, fields) {
    if (this.isDestroyed()) {
      return;
    }

    // Make the XHR request
    try {
      const params = this.getQueryParameters(offset, limit, fields);
      const url = this.getUrl(id);
      const {
        data
      } = await this.xhr.get({
        url,
        id: getTypedFileId(id),
        params
      });
      const entries = this.data ? this.data.entries : [];
      this.data = _objectSpread(_objectSpread({}, data), {}, {
        entries: entries.concat(data.entries)
      });
      const totalCount = data.total_count;
      const nextOffset = offset + limit;
      if (shouldFetchAll && this.hasMoreItems(nextOffset, totalCount)) {
        this.offsetGetRequest(id, nextOffset, limit, shouldFetchAll, fields);
        return;
      }
      this.successHandler(this.data);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  /**
   * Offset based API get
   *
   * @param {string} id the file id
   * @param {Function} successCallback the success callback
   * @param {Function} errorCallback the error callback
   * @param {number} offset the offset from the start to start fetching at
   * @param {number} limit the number of items to fetch
   * @param {array} fields the fields to fetch
   * @param {boolean} shouldFetchAll true if should get all the pages before calling the sucessCallback
   */
  async offsetGet(id, successCallback, errorCallback, offset = DEFAULT_FETCH_START, limit = DEFAULT_FETCH_END, fields, shouldFetchAll = true) {
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    return this.offsetGetRequest(id, offset, limit, shouldFetchAll, fields);
  }
}
export default OffsetBasedApi;
//# sourceMappingURL=OffsetBasedAPI.js.map