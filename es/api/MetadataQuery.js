function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the box metadata query API
 * @author Box
 */

import Base from './Base';
import { CACHE_PREFIX_METADATA_QUERY, ERROR_CODE_METADATA_QUERY } from '../constants';
class MetadataQuery extends Base {
  constructor(...args) {
    super(...args);
    /**
     * @param {Object} response
     */
    _defineProperty(this, "queryMetadataSuccessHandler", ({
      data
    }) => {
      const cache = this.getCache();
      cache.set(this.key, data);
      this.finish();
    });
  }
  /**
   * @property {string}
   */

  /**
   * @property {Function}
   */

  /**
   * @property {Function}
   */

  /**
   * Creates a key for the metadata cache
   *
   * @param {string} id - metadata template
   * @return {string} key
   */
  getCacheKey(id) {
    return `${CACHE_PREFIX_METADATA_QUERY}${id}`;
  }

  /**
   * API URL for metadata query
   * @return {string} base url for files
   */
  getUrl() {
    return `${this.getBaseApiUrl()}/metadata_queries/execute_read`;
  }

  /**
   * Returns true for cache hit for metadata query results
   *
   * @return {boolean} if query results are loaded
   */
  isLoaded() {
    const cache = this.getCache();
    return cache.has(this.key);
  }

  /**
   * Returns the results using successCallback
   *
   * @return {void}
   */
  finish() {
    if (this.isDestroyed()) {
      return;
    }
    const cache = this.getCache();
    const metadataQueryData = cache.get(this.key);
    this.successCallback(metadataQueryData);
  }
  /**
   * Does the network request to metadata query API
   * @param {Object} query query object with SQL Clauses like properties
   * @return {void}
   */
  queryMetadataRequest(query) {
    if (this.isDestroyed()) {
      return;
    }
    this.errorCode = ERROR_CODE_METADATA_QUERY;
    this.xhr.post({
      url: this.getUrl(),
      data: query
    }).then(this.queryMetadataSuccessHandler).catch(this.errorHandler);
  }

  /**
   * API for querying enterprise metadata
   * @param {Object} query - metadata query object
   * @param {Function} successCallback - Function to call with results
   * @param {Function} errorCallback - Function to call with errors
   * @param {boolean|void} [options.forceFetch] - Bypasses the cache
   * @return {void}
   */
  queryMetadata(query, successCallback, errorCallback, options = {}) {
    if (this.isDestroyed()) {
      return;
    }
    const {
      context = {}
    } = options;
    this.key = this.getCacheKey(context.id);
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;

    // Clear the cache if needed
    if (options.forceFetch) {
      this.getCache().unset(this.key);
    }

    // Return the Cache value if it exists
    if (this.isLoaded()) {
      this.finish();
      return;
    }

    // Make the XHR request
    this.queryMetadataRequest(query);
  }
}
export default MetadataQuery;
//# sourceMappingURL=MetadataQuery.js.map