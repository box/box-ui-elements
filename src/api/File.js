/**
 * @flow
 * @file Helper for the box file api
 * @author Box
 */

import Item from './Item';
import { FIELD_DOWNLOAD_URL, CACHE_PREFIX_FILE } from '../constants';
import type { BoxItem } from '../flowTypes';

class File extends Item {
    /**
     * Creates a key for the cache
     *
     * @param {string} id folder id
     * @return {string} key
     */
    getCacheKey(id: string): string {
        return `${CACHE_PREFIX_FILE}${id}`;
    }

    /**
     * API URL for files
     *
     * @param {string} [id] optional file id
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        const suffix: string = id ? `/${id}` : '';
        return `${this.getBaseUrl()}/files${suffix}`;
    }

    /**
     * API for getting download URL for files
     *
     * @param {string} [id] optional file id
     * @return {void}
     */
    getDownloadUrl(id: string, successCallback: Function, errorCallback: Function): Promise<void> {
        return this.xhr
            .get(this.getUrl(id), {
                fields: FIELD_DOWNLOAD_URL
            })
            .then((data: BoxItem) => {
                successCallback(data[FIELD_DOWNLOAD_URL]);
            })
            .catch(errorCallback);
    }
}

export default File;
