/* eslint-disable @typescript-eslint/no-explicit-any -- Preserve explicit Flow `any` contracts. */
import type { AxiosError } from 'axios';
import noop from 'lodash/noop';
import Xhr from '../utils/Xhr';
import Cache from '../utils/Cache';
import UploadsReachability from './uploads/UploadsReachability';
import { getTypedFileId } from '../utils/file';
import { getBadItemError, getBadPermissionsError } from '../utils/error';
import {
    DEFAULT_HOSTNAME_API,
    DEFAULT_HOSTNAME_UPLOAD,
    HTTP_GET,
    HTTP_POST,
    HTTP_PUT,
    HTTP_DELETE,
} from '../constants';
import type { ElementsErrorCallback, APIOptions } from '../common/types/api';
import type APICache from '../utils/Cache';

type SuccessCallback = (data?: object) => void;

interface DeleteRequest {
    /** Optional request body sent with the DELETE call. */
    data?: object;
    /** Invoked when the request fails. */
    errorCallback: ElementsErrorCallback;
    /** Box item id passed through to the XHR layer for auth and typing. */
    id: string;
    /** Invoked with the response payload when the request succeeds. */
    successCallback: Function;
    /** Full URL of the resource to delete. */
    url: string;
}

interface GetRequest {
    /** Invoked when the request fails. */
    errorCallback: ElementsErrorCallback;
    /** Box item id; used for auth and to resolve the URL when `url` is omitted. */
    id: string;
    /** Extra fields merged into the XHR request (e.g. query params); GET uses `requestData`, not `data`. */
    requestData?: object;
    /** Invoked with the response payload when the request succeeds. */
    successCallback: Function;
    /** API URL; when omitted, `getUrl(id)` is used. */
    url?: string;
}

interface WriteRequest {
    /** JSON request body for POST or PUT. */
    data: object;
    /** Invoked when the request fails. */
    errorCallback: ElementsErrorCallback;
    /** Box item id passed through to the XHR layer for auth and typing. */
    id: string;
    /** Invoked with the response payload when the request succeeds. */
    successCallback: Function;
    /** Full URL to post or put to. */
    url: string;
}

class Base {
    /** In-memory cache for API responses, shared via `options.cache`. */
    cache: APICache;

    /** True after `destroy()` has aborted in-flight requests. */
    destroyed: boolean;

    /** HTTP client used for GET/POST/PUT/DELETE against Box APIs. */
    xhr: Xhr;

    /** API hostname used to build `/2.0` URLs (default global Box API host). */
    apiHost: string;

    /**
     * Optional regional metadata host.
     *
     * When set and distinct from `apiHost`, subclasses (currently `Metadata`)
     * route metadata *instance* and *template* endpoints to this host while
     * keeping taxonomies, suggestions, options, and queries on `apiHost`.
     * Empty values, or values equal to `apiHost`, are treated as "not set"
     * and resolve to the same URLs as `apiHost` alone.
     *
     * Transitional: this field exists to support the `metadataApiHost`
     * option while the global `apiHost` is not yet regionalized end-to-end.
     * It is expected to be retired in a future major version.
     */
    metadataApiHost: string | null | undefined;

    /** Upload API hostname used to build upload `/api/2.0` URLs. */
    uploadHost: string;

    /** Normalized constructor options (hosts, cache, token, etc.) passed to `Xhr`. */
    options: APIOptions;

    /** `console.log` when `consoleLog` is enabled in options; otherwise `noop`. */
    consoleLog: Function;

    /** `console.error` when `consoleError` is enabled in options; otherwise `noop`. */
    consoleError: Function;

    /** Elements error code; subclasses set this before requests for `errorHandler`. */
    errorCode: string;

    /** Success handler for the in-flight `makeRequest` call; set per request. */
    successCallback: SuccessCallback;

    /** Error handler for the in-flight `makeRequest` call; set per request. */
    errorCallback: ElementsErrorCallback;

    /** Helper for probing upload endpoint reachability. */
    uploadsReachability: UploadsReachability;

    /**
     * [constructor]
     *
     * @param {Object} options
     * @param {string} [options.token] - Auth token
     * @param {string} [options.sharedLink] - Shared link
     * @param {string} [options.sharedLinkPassword] - Shared link password
     * @param {string} [options.apiHost] - Api host
     * @param {string} [options.metadataApiHost] - Regional metadata API host
     *   used for metadata *instance* and *template* endpoints when configured.
     *   Taxonomies, suggestions, options, and queries continue to use
     *   `apiHost`. Falls back to `apiHost` when undefined, empty, or equal to
     *   `apiHost`.
     * @param {string} [options.uploadHost] - Upload host name
     * @return {Base} Base instance
     */
    constructor(options: APIOptions) {
        this.cache = options.cache || new Cache();
        this.apiHost = options.apiHost || DEFAULT_HOSTNAME_API;
        this.metadataApiHost = options.metadataApiHost;
        this.uploadHost = options.uploadHost || DEFAULT_HOSTNAME_UPLOAD;
        // @TODO: avoid keeping another copy of data in this.options
        this.options = {
            ...options,
            apiHost: this.apiHost,
            metadataApiHost: this.metadataApiHost,
            uploadHost: this.uploadHost,
            cache: this.cache,
        };
        this.xhr = new Xhr(this.options);
        this.destroyed = false;
        this.consoleLog = !!options.consoleLog && !!window.console ? window.console.log || noop : noop;
        this.consoleError = !!options.consoleError && !!window.console ? window.console.error || noop : noop;
        this.uploadsReachability = new UploadsReachability();
    }

    /** Aborts in-flight XHR and marks this instance destroyed. */
    destroy(): void {
        this.xhr.abort();
        this.destroyed = true;
    }

    /** Whether `destroy()` has been called on this instance. */
    isDestroyed(): boolean {
        return this.destroyed;
    }

    /** Throws if `id` or `permissions` is missing, or if `permissions[permissionToCheck]` is falsy. */
    checkApiCallValidity(permissionToCheck: string, permissions?: Record<string, unknown>, id?: string): void {
        if (!id || !permissions) {
            throw getBadItemError();
        }

        const permission = permissions[permissionToCheck];
        if (!permission) {
            throw getBadPermissionsError();
        }
    }

    /**
     * Builds an API base URL for an arbitrary host, appending the API
     * version suffix (`/2.0`) and tolerating a trailing slash on the host.
     *
     * Shared helper used by `getBaseApiUrl()` and by subclasses that need
     * to derive a `/2.0` URL from a host other than `this.apiHost` (e.g.
     * `Metadata` when `metadataApiHost` is configured).
     */
    buildApiUrl(host: string): string {
        const suffix: string = host.endsWith('/') ? '2.0' : '/2.0';
        return `${host}${suffix}`;
    }

    /** Base URL for the configured `apiHost` (`…/2.0`). */
    getBaseApiUrl(): string {
        return this.buildApiUrl(this.apiHost);
    }

    /** Base URL for the configured `uploadHost` (`…/api/2.0`). */
    getBaseUploadUrl(): string {
        const suffix: string = this.uploadHost.endsWith('/') ? 'api/2.0' : '/api/2.0';
        return `${this.uploadHost}${suffix}`;
    }

    /** Returns the in-memory cache used by this API instance. */
    getCache(): APICache {
        return this.cache;
    }

    /** Invokes the current `successCallback` with response data when the instance is not destroyed. */
    successHandler = (data: any): void => {
        if (!this.isDestroyed() && typeof this.successCallback === 'function') {
            this.successCallback(data);
        }
    };

    /** Invokes the current `errorCallback` with response data or the raw error when not destroyed. */
    errorHandler = (error: AxiosError<any>): void => {
        if (!this.isDestroyed() && typeof this.errorCallback === 'function') {
            const { response } = error;

            if (response?.data) {
                this.errorCallback(response.data, this.errorCode);
            } else {
                this.errorCallback(error, this.errorCode);
            }
        }
    };

    /** Gets the URL for the API, meant to be overridden by subclasses. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Subclasses implement this method using the item ID.
    getUrl(id: string): string {
        // TODO: Implement this method
        throw new Error('Implement me!');
    }

    /** Formats an API entry for use in components, meant to be overridden by subclasses. */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Subclasses implement this method using the API entry.
    format(entry: object): any {
        // TODO: Implement this method
        throw new Error('Implement me!');
    }

    /** Issues a GET; uses `requestData` (not `data`) for extra XHR fields. */
    get({
        id,
        successCallback,
        errorCallback,
        requestData, // Note: this is inconsistent, other methods use `data`
        url,
    }: GetRequest): Promise<any> {
        const apiUrl = url || this.getUrl(id);
        return this.makeRequest(HTTP_GET, id, apiUrl, successCallback, errorCallback, requestData);
    }

    /** Issues a POST with a JSON body. */
    post({ id, url, data, successCallback, errorCallback }: WriteRequest): Promise<any> {
        return this.makeRequest(HTTP_POST, id, url, successCallback, errorCallback, data);
    }

    /** Issues a PUT with a JSON body. */
    put({ id, url, data, successCallback, errorCallback }: WriteRequest): Promise<any> {
        return this.makeRequest(HTTP_PUT, id, url, successCallback, errorCallback, data);
    }

    /** Issues a DELETE, optionally with a request body. */
    delete({ id, url, data, successCallback, errorCallback }: DeleteRequest): Promise<any> {
        return this.makeRequest(HTTP_DELETE, id, url, successCallback, errorCallback, data);
    }

    /**
     * Runs an XHR verb against `url`, merges `requestData` into the request payload,
     * and routes success or failure through the instance handlers.
     */
    async makeRequest(
        method: string,
        id: string,
        url: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        requestData: object = {},
    ): Promise<void> {
        if (this.isDestroyed()) {
            return;
        }

        this.successCallback = successCallback as SuccessCallback;
        this.errorCallback = errorCallback;

        const xhrMethod: (request: object) => Promise<{ data: any }> = this.xhr[method.toLowerCase()].bind(this.xhr);
        try {
            const { data } = await xhrMethod({
                id: getTypedFileId(id),
                url,
                ...requestData,
            });
            this.successHandler(data);
        } catch (error) {
            this.errorHandler(error);
        }
    }
}

export default Base;
