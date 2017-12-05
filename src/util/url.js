/**
 * @flow
 * @file Utility functions for urls
 * @author Box
 */

/**
 * Update a key and value in the URI query parameter string
 *
 * @param {string} uri - the uri that contains the potential query parameter string
 * @param {string} key - the parameter key to be updated/added
 * @param {mixed} value - the parameter value to be updated/added
 * @return {string}
 */
function updateQueryStringParameter(uri: string, key: string, value: any): string {
    const re = new RegExp(`([?&])${key}=.*?(&|$)`, 'i');
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    const isEmptyValue = !value && typeof value !== 'number'; // accept all numbers (including 0) and non-empty values
    const isExistingParam = uri.match(re);
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(value);

    if (isEmptyValue && isExistingParam) {
        // Remove the param entirely
        return uri.replace(re, '&');
    } else if (isEmptyValue) {
        // If value is empty, then we don't need to do anything to the url
        return uri;
    } else if (isExistingParam) {
        // If key exists already, we need to replace the value carefully
        return uri.replace(re, `$1${encodedKey}=${encodedValue}$2`);
    }

    // Otherwise, just add the new query param to the end of the uri
    return `${uri + separator + encodedKey}=${encodedValue}`;
}

/**
 * Update URI query parameter with multiple key-value pairs
 *
 * @param {string} uri - the uri that contains the potential query parameter string
 * @param {Object} params - the key-value pairs of parameters to be updated/added
 * @return {string}
 */
function updateQueryStringParameters(uri: string, params: Object): string {
    return Object.keys(params).reduce(
        (updatedUri, key) => updateQueryStringParameter(updatedUri, key, params[key]),
        uri
    );
}

export { updateQueryStringParameters, updateQueryStringParameter };
