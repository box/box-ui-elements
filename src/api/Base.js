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
import { getBadItemError, getBadPermissionsError } from '../util/error';
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
     *
     * @return {void}
     */
    isDestroyed(): boolean {
        return this.destroyed;
    }

    /**
     * Checks that our desired API call has sufficient permissions and an item ID
     *
     * @param {string} permissionToCheck - Permission to check
     * @param {Object} permissions - Permissions object
     * @param {string} id - Item id
     * @return {void}
     */
    checkApiCallValidity(permissionToCheck: string, permissions?: Object, id?: string): void {
        if (!id || !permissions) {
            throw getBadItemError();
        }

        const permission = permissions[permissionToCheck];
        if (!permission) {
            throw getBadPermissionsError();
        }
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
     * @param {Object} data - The response data
     */
    successHandler = (data: any): void => {
        if (!this.isDestroyed() && typeof this.successCallback === 'function') {
            this.successCallback(data);
        }
    };

    /**
     * Generic error handler
     *
     * @param {Object} data - The response data
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
     * Gets the URL for the API, meant to be overridden
     * @param {string} id - The item id
     */
    /* eslint-disable no-unused-vars */
    getUrl(id: string) {
        /* eslint-enable no-unused-vars */
        throw new Error('Implement me!');
    }

    /**
     * Generic API GET
     *
     * @param {string} id - The file id
     * @param {Function} successCallback - The success callback
     * @param {Function} errorCallback - The error callback
     * @param {Object} params request params
     */
    get(id: string, successCallback: Function, errorCallback: Function, params?: Object): void {
        const url = this.getUrl(id);
        this.makeRequest('GET', id, url, successCallback, errorCallback, params);
    }

    /**
     * Generic API POST
     *
     * @param {string} id - The file id
     * @param {string} url - The url to post to
     * @param {Object} data - The data to post
     * @param {Function} successCallback - The success callback
     * @param {Function} errorCallback - The error callback
     */
    post(id: string, url: string, data: Object, successCallback: Function, errorCallback: Function): void {
        this.makeRequest('POST', id, url, successCallback, errorCallback, data);
    }

    /**
     * Generic API PUT
     *
     * @param {string} id - The file id
     * @param {string} url - The url to put to
     * @param {Object} data - The data to put
     * @param {Function} successCallback - The success callback
     * @param {Function} errorCallback - The error callback
     */
    put(id: string, url: string, data: Object, successCallback: Function, errorCallback: Function): void {
        this.makeRequest('PUT', id, url, successCallback, errorCallback, data);
    }

    /**
     * Generic API DELETE
     *
     * @param {string} id - The file id
     * @param {string} url - The url of the item to delete
     * @param {Function} successCallback - The success callback
     * @param {Function} errorCallback - The error callback
     * @param {Object} data optional data to delete
     */
    delete(id: string, url: string, successCallback: Function, errorCallback: Function, data: Object = {}): void {
        this.makeRequest('DELETE', id, url, successCallback, errorCallback, data);
    }

    /**
     * Generic API CRUD operations
     *
     * @param {string} method - which REST method to execute (GET, POST, PUT, DELETE)
     * @param {string} id - The file id
     * @param {string} url - The url of the item to operate on
     * @param {Function} successCallback - The success callback
     * @param {Function} errorCallback - The error callback
     * @param {Object} requestData - Optional info to be added to the API call such as params or request body data
     */
    async makeRequest(
        method: string,
        id: string,
        url: string,
        successCallback: Function,
        errorCallback: Function,
        requestData: Object = {}
    ): Promise<void> {
        if (this.isDestroyed()) {
            return;
        }

        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        let xhrMethod: Function = noop;
        switch (method) {
            case 'GET':
                xhrMethod = this.xhr.get;
                break;
            case 'POST':
                xhrMethod = this.xhr.post;
                break;
            case 'PUT':
                xhrMethod = this.xhr.put;
                break;
            case 'DELETE':
                xhrMethod = this.xhr.delete;
                break;
            default:
            // no-op
        }

        xhrMethod = xhrMethod.bind(this.xhr);
        try {
            const { data } = await xhrMethod({ id: getTypedFileId(id), url, ...requestData });
            this.successHandler(data);
        } catch (error) {
            this.errorHandler(error);
        }
    }
}

export default Base;
