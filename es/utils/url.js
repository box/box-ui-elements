/**
 * 
 * @file Utility functions for urls
 * @author Box
 */
import Uri from 'jsuri';

/**
 * Update URL query parameters
 *
 * @param {string} url - the url that contains the potential query parameter string
 * @param {Object} queryParams
 * @return {string}
 */
function updateQueryParameters(url, queryParams) {
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

// eslint-disable-next-line import/prefer-default-export
export { updateQueryParameters };
//# sourceMappingURL=url.js.map