/**
 * @flow
 * @file Helper for the box web link api
 * @author Box
 */

import Item from './Item';
import { CACHE_PREFIX_WEBLINK, X_REP_HINTS } from '../constants';

class WebLink extends Item {
    /**
     * Creates a key for the cache
     *
     * @param {string} id folder id
     * @return {string} key
     */
    getCacheKey(id: string): string {
        return `${CACHE_PREFIX_WEBLINK}${id}`;
    }

    /**
     * URL for weblink api
     *
     * @param {string} [id] optional file id
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        const suffix: string = id ? `/${id}` : '';
        return `${this.getBaseApiUrl()}/web_links${suffix}`;
    }

    /**
     * Gets a box weblink.
     *
     * @param {string} id - Weblink id
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @param {Array<String>} fields - Array of field strings
     * @returns {Promise}
     */
    async getWeblink(
        id: string,
        successCallback: Function,
        errorCallback: Function,
        { fields }: FetchOptions = {},
    ): Promise<void> {
        if (this.isDestroyed()) {
            return;
        }

        const cacheKey = this.getCacheKey(id);
        const params = { fields: fields.toString() };

        try {
            const { data } = await this.xhr.get({
                url: this.getUrl(id),
                params,
                headers: { 'X-Rep-Hints': X_REP_HINTS },
            });

            const cachedEntry = this.getCache().get(cacheKey);
            const updatedCacheEntry = { ...cachedEntry, ...data };
            this.getCache().set(cacheKey, updatedCacheEntry);
            successCallback(updatedCacheEntry);
        } catch (e) {
            errorCallback(e);
        }
    }
}

export default WebLink;
