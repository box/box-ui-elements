function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the box search api
 * @author Box
 */

import flatten from '../utils/flatten';
import { FOLDER_FIELDS_TO_FETCH } from '../utils/fields';
import { getBadItemError } from '../utils/error';
import Base from './Base';
import FileAPI from './File';
import FolderAPI from './Folder';
import WebLinkAPI from './WebLink';
import { CACHE_PREFIX_SEARCH, FIELD_RELEVANCE, FIELD_REPRESENTATIONS, X_REP_HINT_HEADER_DIMENSIONS_DEFAULT, SORT_DESC, ERROR_CODE_SEARCH } from '../constants';
class Search extends Base {
  constructor(...args) {
    super(...args);
    /**
     * Handles the folder search response
     *
     * @param {Object} response
     * @return {void}
     */
    _defineProperty(this, "searchSuccessHandler", ({
      data
    }) => {
      if (this.isDestroyed()) {
        return;
      }
      const {
        entries,
        total_count,
        limit,
        offset
      } = data;
      if (!Array.isArray(entries) || typeof total_count !== 'number' || typeof limit !== 'number' || typeof offset !== 'number') {
        throw getBadItemError();
      }
      const flattened = flatten(entries, new FolderAPI(this.options), new FileAPI(this.options), new WebLinkAPI(this.options));
      this.itemCache = (this.itemCache || []).concat(flattened);
      this.getCache().set(this.key, {
        item_collection: _objectSpread(_objectSpread({}, data), {}, {
          entries: this.itemCache
        })
      });
      this.finish();
    });
    /**
     * Handles the search error
     *
     * @param {Error} error fetch error
     * @return {void}
     */
    _defineProperty(this, "searchErrorHandler", error => {
      if (this.isDestroyed()) {
        return;
      }
      this.errorCallback(error, this.errorCode);
    });
  }
  /**
   * @property {number}
   */

  /**
   * @property {number}
   */

  /**
   * @property {string}
   */

  /**
   * @property {string}
   */

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
   * @property {Array}
   */

  /**
   * Creates a key for the cache
   *
   * @param {string} id folder id
   * @param {string} query search string
   * @return {string} key
   */
  getEncodedQuery(query) {
    return encodeURIComponent(query);
  }

  /**
   * Creates a key for the cache
   *
   * @param {string} id folder id
   * @param {string} query search string
   * @return {string} key
   */
  getCacheKey(id, query) {
    return `${CACHE_PREFIX_SEARCH}${id}|${query}`;
  }

  /**
   * URL for search api
   *
   * @param {string} [id] optional file id
   * @return {string} base url for files
   */
  getUrl() {
    return `${this.getBaseApiUrl()}/search`;
  }

  /**
   * Tells if a search results has its items all loaded
   *
   * @return {boolean} if items are loaded
   */
  isLoaded() {
    const cache = this.getCache();
    return cache.has(this.key);
  }

  /**
   * Returns the results
   *
   * @return {void}
   */
  finish() {
    if (this.isDestroyed()) {
      return;
    }
    const cache = this.getCache();
    const search = cache.get(this.key);
    const {
      item_collection
    } = search;
    if (!item_collection) {
      throw getBadItemError();
    }
    const {
      entries,
      total_count
    } = item_collection;
    if (!Array.isArray(entries) || typeof total_count !== 'number') {
      throw getBadItemError();
    }
    const collection = {
      id: this.id,
      items: entries.map(key => cache.get(key)),
      offset: this.offset,
      percentLoaded: 100,
      sortBy: FIELD_RELEVANCE,
      // Results are always sorted by relevance
      sortDirection: SORT_DESC,
      // Results are always sorted descending
      totalCount: total_count
    };
    this.successCallback(collection);
  }
  /**
   * Does the network request
   *
   * @param {RequestOptions} options - options for request
   * @return {void}
   */
  searchRequest(options = {}) {
    if (this.isDestroyed()) {
      return Promise.reject();
    }
    const {
      fields
    } = options;
    const requestFields = fields || FOLDER_FIELDS_TO_FETCH;
    this.errorCode = ERROR_CODE_SEARCH;
    return this.xhr.get({
      url: this.getUrl(),
      params: {
        offset: this.offset,
        query: this.query,
        ancestor_folder_ids: this.id,
        limit: this.limit,
        fields: requestFields.toString()
      },
      headers: requestFields.includes(FIELD_REPRESENTATIONS) ? {
        'X-Rep-Hints': X_REP_HINT_HEADER_DIMENSIONS_DEFAULT
      } : {}
    }).then(this.searchSuccessHandler).catch(this.searchErrorHandler);
  }

  /**
   * Gets search results
   *
   * @param {string} id - folder id
   * @param {string} query - search string
   * @param {number} limit - maximum number of items to retrieve
   * @param {number} offset - starting index from which to retrieve items
   * @param {Function} successCallback - Function to call with results
   * @param {Function} errorCallback - Function to call with errors
   * @param {boolean|void} [options.forceFetch] - Bypasses the cache
   * @return {void}
   */
  search(id, query, limit, offset, successCallback, errorCallback, options = {}) {
    if (this.isDestroyed()) {
      return;
    }

    // Save references
    this.limit = limit;
    this.offset = offset;
    this.query = query;
    this.id = id;
    this.key = this.getCacheKey(id, this.getEncodedQuery(this.query));
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
    this.searchRequest(options);
  }
}
export default Search;
//# sourceMappingURL=Search.js.map