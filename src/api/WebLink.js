/**
 * @flow
 * @file Helper for the box web link api
 * @author Box
 */

import Item from './Item';
import { CACHE_PREFIX_WEBLINK } from '../constants';

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
        return `${this.getBaseUrl()}/web_links${suffix}`;
    }
}

export default WebLink;
