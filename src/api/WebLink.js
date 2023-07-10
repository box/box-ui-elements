/**
 * @flow
 * @file Helper for the box web link api
 * @author Box
 */

import Item from './Item';
import { CACHE_PREFIX_WEBLINK, ERROR_CODE_FETCH_WEBLINK } from '../constants';
import { findMissingProperties } from '../utils/fields';
import type { RequestOptions } from '../common/types/api';
import type APICache from '../utils/Cache';

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
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @param {Array<string>|void} fields - Optionally include specific fields
     * @returns {Promise}
     */
    async getWeblink(
        id: string,
        successCallback: Function,
        errorCallback: Function,
        { fields }: RequestOptions = {},
    ): Promise<void> {
        if (this.isDestroyed()) {
            return;
        }

        const cache: APICache = this.getCache();
        const key: string = this.getCacheKey(id);
        this.errorCode = ERROR_CODE_FETCH_WEBLINK;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        if (cache.has(key)) {
            const missingFields: Array<string> = findMissingProperties(cache.get(key), fields);
            if (missingFields.length === 0) {
                successCallback(cache.get(key));
                return;
            }
        }

        const xhrOptions: Object = {
            url: this.getUrl(id),
        };

        if (fields) {
            xhrOptions.params = {
                fields: fields.toString(),
            };
        }

        try {
            const { data } = await this.xhr.get(xhrOptions);

            if (this.isDestroyed()) {
                return;
            }

            // Cache check is again done since this code is executed async
            if (cache.has(key)) {
                cache.merge(key, data);
            } else {
                // If there was nothing in the cache
                cache.set(key, data);
            }

            this.successHandler(cache.get(key));
        } catch (e) {
            this.errorHandler(e);
        }
    }
}

export default WebLink;
