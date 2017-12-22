/**
 * @flow
 * @file Base class with utility methods for API calls
 * @author Box
 */

import noop from 'lodash.noop';
import Xhr from '../util/Xhr';
import UploadsReachability from './uploads/UploadReachability';
import Cache from '../util/Cache';
import { DEFAULT_HOSTNAME_API, DEFAULT_HOSTNAME_UPLOAD } from '../constants';
import type { Options } from '../flowTypes';

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
    options: Options;

    /**
     * @property {Function}
     */
    consoleLog: Function;

    /**
     * @property {Function}
     */
    consoleError: Function;

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
    constructor(options: Options = {}) {
        this.cache = options.cache || new Cache();
        this.apiHost = options.apiHost || DEFAULT_HOSTNAME_API;
        this.uploadHost = options.uploadHost || DEFAULT_HOSTNAME_UPLOAD;
        this.options = Object.assign({}, options, {
            apiHost: this.apiHost,
            uploadHost: this.uploadHost,
            cache: this.cache
        });
        this.xhr = new Xhr(this.options);
        this.destroyed = false;
        this.uploadsReachability = new UploadsReachability(options.token, this.apiHost);
        this.consoleLog = !!options.consoleLog && !!window.console ? window.console.log || noop : noop;
        this.consoleError = !!options.consoleError && !!window.console ? window.console.error || noop : noop;
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
     * Update upload host with reachable url
     * 
     * @return {Promise<>}
     */
    async updateReachableUploadHost(): Promise<> {
        this.uploadHost = await this.uploadsReachability.getReachableUploadHost();
        this.options.uploadHost = this.uploadHost;
        this.xhr = new Xhr(this.options);
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
     * @return {Cache} cache instance
     */
    getCache(): Cache {
        return this.cache;
    }
}

export default Base;
