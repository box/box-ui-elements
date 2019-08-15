/**
 * @flow
 * @file Helper for the box web link api
 * @author Box
 */

import Item from './Item';
import { CACHE_PREFIX_WEBLINK } from '../constants';
import { findMissingProperties } from '../utils/fields';

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
     * Gets a Box weblink
     *
     * @param {string} id - Weblink id
     * @param {(newItem: BoxItem) => void} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @param {Array<String>} fields - Array of field strings
     * @returns {Promise}
     */
    async getWeblink(
        id: string,
        successCallback: (newItem: BoxItem) => void,
        errorCallback: Function,
        { fields }: FetchOptions = {},
    ): Promise<void> {
        if (this.isDestroyed()) {
            return;
        }

        const cache: APICache = this.getCache();
        const key: string = this.getCacheKey(id);

        if (cache.has(key)) {
            const missingFields: Array<string> = findMissingProperties(cache.get(key), fields);
            if (missingFields.length === 0) {
                successCallback(cache.get(key));
                return;
            }
        }

        const params = { fields: fields ? fields.toString() : '' };

        try {
            const { data } = await this.xhr.get({
                url: this.getUrl(id),
                params,
            });

            // Cache check is again done since this code is executed async
            if (cache.has(key)) {
                cache.merge(key, data);
            } else {
                // If there was nothing in the cache
                cache.set(key, data);
            }

            successCallback(cache.get(key));
        } catch (e) {
            errorCallback(e);
        }
    }
}

export default WebLink;
