/**
 * @flow
 * @file Base class with utility methods for API calls
 * @author Box
 */

import noop from 'lodash/noop';
import type { $AxiosError } from 'axios';
import Xhr from '../util/Xhr';
import Cache from '../util/Cache';
import { getTypedFileId } from '../util/file';
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
     * @property {Function}
     */
    successCallback: (data: Object) => void;

    /**
     * @property {Function}
     */
    errorCallback: (error: Object) => void;

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
    constructor(options: Options) {
        this.cache = options.cache || new Cache();
        this.apiHost = options.apiHost || DEFAULT_HOSTNAME_API;
        this.uploadHost = options.uploadHost || DEFAULT_HOSTNAME_UPLOAD;
        // @TODO: avoid keeping another copy of data in this.options
        this.options = Object.assign({}, options, {
            apiHost: this.apiHost,
            uploadHost: this.uploadHost,
            cache: this.cache
        });
        this.xhr = new Xhr(this.options);
        this.destroyed = false;
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
    getBaseApiUrl(): string {
        const suffix: string = this.apiHost.endsWith('/') ? '2.0' : '/2.0';
        return `${this.apiHost}${suffix}`;
    }

    /**
     * Base URL for api uploads
     *
     * @return {string} base url
     */
    getBaseUploadUrl(): string {
        const suffix: string = this.uploadHost.endsWith('/') ? 'api/2.0' : '/api/2.0';
        return `${this.uploadHost}${suffix}`;
    }

    /**
     * Gets the cache instance
     *
     * @return {Cache} cache instance
     */
    getCache(): Cache {
        return this.cache;
    }

    /**
     * Generic success handler
     *
     * @param {Object} data the response data
     * @param {Function} successCallback the success callback
     */
    successHandler = (data: Object): void => {
        if (!this.isDestroyed() && typeof this.successCallback === 'function') {
            this.successCallback(data);
        }
    };

    /**
     * Generic error handler
     *
     * @param {Object} data the response data
     * @param {Function} errorCallback the error callback
     */
    errorHandler = (error: $AxiosError<any>): void => {
        if (!this.isDestroyed() && typeof this.errorCallback === 'function') {
            const { response } = error;

            if (response) {
                this.errorCallback(response.data);
            } else {
                this.errorCallback(error);
            }
        }
    };

    /**
     * Generic GET request
     *
     * @param {string} id the file id
     * @param {Object} params the query params
     */
    getData(id: string, params?: Object): Promise<Object> {
        return this.xhr.get({
            id: getTypedFileId(id),
            url: this.getUrl(id),
            params
        });
    }

    /**
     * Gets the URL for the API, meant to be overridden
     * @param {string} id the file id
     */
    /* eslint-disable no-unused-vars */
    getUrl(id: string) {
        /* eslint-enable no-unused-vars */
        throw new Error('Implement me!');
    }

    /**
     * Generic API get
     *
     * @param {string} id the file id
     * @param {Function} successCallback the success callback
     * @param {Function} errorCallback the error callback
     */
    async get(id: string, successCallback: Function, errorCallback: Function): Promise<void> {
        if (this.isDestroyed()) {
            return;
        }

        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        // Make the XHR request
        try {
            const { data } = await this.getData(id);
            this.successHandler(data);
        } catch (error) {
            this.errorHandler(error);
        }
    }
}

export default Base;
