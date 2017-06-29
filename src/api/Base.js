/**
 * @flow
 * @file Base class with utility methods for API calls
 * @author Box
 */

import Xhr from '../util/Xhr';
import Cache from '../util/Cache';

class Base {
    /**
     * @property {Cache}
     */
    cache: Cache;

    /**
     * @property {boolean}
     */
    destroyed: boolean;

    /**
     * @property {Xhr}
     */
    xhr: Xhr;

    /**
     * @property {string}
     */
    apiHost: string;

    /**
     * @property {string}
     */
    uploadHost: string;

    /**
     * @property {*}
     */
    options: any;

    /**
     * [constructor]
     *
     * @param {Object} [options]
     * @param {string} [options.token] - Auth token
     * @param {string} [options.sharedLink] - Shared link
     * @param {string} [options.sharedLinkPassword] - Shared link password
     * @param {string} [options.apiHost] - Api host
     * @param {string} [options.uploadHost] - Upload host name
     * @return {Base} Base instance
     */
    constructor(options: any = {}) {
        this.options = options;
        this.cache = options.cache;
        this.apiHost = options.apiHost;
        this.uploadHost = options.uploadHost;
        this.xhr = new Xhr(options);
        this.destroyed = false;
    }

    /**
     * [destructor]
     *
     * @return {void}
     */
    destroy(): void {
        this.destroyed = true;
    }

    /**
     * Asks the API if its destructor has been called
     * @return {void}
     */
    isDestroyed(): boolean {
        return this.destroyed;
    }

    /**
     * Base URL for api
     *
     * @return {string} base url
     */
    getBaseUrl(): string {
        const suffix: string = this.apiHost.endsWith('/') ? '2.0' : '/2.0';
        return `${this.apiHost}${suffix}`;
    }

    /**
     * Gets the cache instance
     *
     * @param {string} key map key
     * @return {Cache} cache instance
     */
    getCache(): Cache {
        return this.cache;
    }
}

export default Base;
