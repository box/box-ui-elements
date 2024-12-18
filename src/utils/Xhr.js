/**
 * @flow
 * @file Network utilities
 * @author Box
 */

import axios from 'axios';
import type { $AxiosError, $AxiosXHR } from 'axios';
import getProp from 'lodash/get';
import includes from 'lodash/includes';
import lowerCase from 'lodash/lowerCase';
import TokenService from './TokenService';
import {
    HEADER_ACCEPT,
    HEADER_ACCEPT_LANGUAGE,
    HEADER_CLIENT_NAME,
    HEADER_CLIENT_VERSION,
    HEADER_CONTENT_TYPE,
    HTTP_GET,
    HTTP_POST,
    HTTP_PUT,
    HTTP_DELETE,
    HTTP_OPTIONS,
    HTTP_HEAD,
    HTTP_STATUS_CODE_RATE_LIMIT,
} from '../constants';
import type { APIOptions, Method, PayloadType, RequestData } from '../common/types/api';
import type { StringAnyMap, StringMap, Token } from '../common/types/core';

const DEFAULT_UPLOAD_TIMEOUT_MS = 120000;
const MAX_NUM_RETRIES = 3;
const RETRYABLE_HTTP_METHODS = [HTTP_GET, HTTP_OPTIONS, HTTP_HEAD].map(lowerCase);

class Xhr {
    id: ?string;

    axios: Axios;

    axiosAbortController: AbortController;

    clientName: ?string;

    language: ?string;

    token: Token;

    version: ?string;

    sharedLink: ?string;

    sharedLinkPassword: ?string;

    xhr: XMLHttpRequest;

    responseInterceptor: Function;

    requestInterceptor: ?Function;

    tokenService: TokenService;

    retryCount: number = 0;

    retryableStatusCodes: Array<number>;

    retryTimeout: ?TimeoutID;

    shouldRetry: boolean;

    /**
     * [constructor]
     *
     * @param {Object} options
     * @param {string} options.id - item id
     * @param {string} options.clientName - Client Name
     * @param {string|function} options.token - Auth token
     * @param {string} [options.language] - Accept-Language header value
     * @param {string} [options.sharedLink] - Shared link
     * @param {string} [options.sharedLinkPassword] - Shared link password
     * @param {string} [options.requestInterceptor] - Request interceptor
     * @param {string} [options.responseInterceptor] - Response interceptor
     * @param {number[]} [options.retryableStatusCodes] - Response codes to retry
     * @param {boolean} [options.shouldRetry] - Should retry failed requests
     * @return {Xhr} Cache instance
     */
    constructor({
        id,
        clientName,
        language,
        token,
        version,
        sharedLink,
        sharedLinkPassword,
        responseInterceptor,
        requestInterceptor,
        retryableStatusCodes = [HTTP_STATUS_CODE_RATE_LIMIT],
        shouldRetry = true,
    }: APIOptions = {}) {
        this.clientName = clientName;
        this.id = id;
        this.language = language;
        this.responseInterceptor = responseInterceptor || this.defaultResponseInterceptor;
        this.retryableStatusCodes = retryableStatusCodes;
        this.sharedLink = sharedLink;
        this.sharedLinkPassword = sharedLinkPassword;
        this.shouldRetry = shouldRetry;
        this.token = token;
        this.version = version;

        this.axios = axios.create();
        this.axiosAbortController = new AbortController();
        this.axios.interceptors.response.use(this.responseInterceptor, this.errorInterceptor);

        if (typeof requestInterceptor === 'function') {
            this.axios.interceptors.request.use(requestInterceptor);
        }
    }

    /**
     * Default response interceptor which just returns the response
     *
     * @param {Object} response - the axios response
     * @return the response
     */
    defaultResponseInterceptor(response: $AxiosXHR<any>) {
        return response;
    }

    /**
     * Determines if a request should be retried
     *
     * @param {Object} error - Error object from axios
     * @return {boolean} true if the request should be retried
     */
    shouldRetryRequest(error: $AxiosError<any>): boolean {
        if (!this.shouldRetry || this.retryCount >= MAX_NUM_RETRIES) {
            return false;
        }

        const { response, request, config } = error;
        // Retry if there is a network error (e.g. ECONNRESET) or rate limited
        const status = getProp(response, 'status');
        const method = getProp(config, 'method');
        const isNetworkError = request && !response;
        const isRateLimitError = status === HTTP_STATUS_CODE_RATE_LIMIT;
        const isOtherRetryableError =
            includes(this.retryableStatusCodes, status) && includes(RETRYABLE_HTTP_METHODS, method);
        return isNetworkError || isRateLimitError || isOtherRetryableError;
    }

    /**
     * Calculate the exponential backoff time with randomized jitter.
     *
     * @param {number} numRetries Which retry number this one will be. Must be > 0
     * @returns {number} The number of milliseconds after which to retry
     */
    getExponentialRetryTimeoutInMs(numRetries: number): number {
        const randomizationMs = Math.ceil(Math.random() * 1000);
        const exponentialMs = 2 ** (numRetries - 1) * 1000;
        return exponentialMs + randomizationMs;
    }

    /**
     * Error interceptor that wraps the passed in responseInterceptor
     *
     * @param {Object} error - Error object from axios
     * @return {Promise} rejected promise with error info
     */
    errorInterceptor = (error: $AxiosError<any>): Promise<any> => {
        const shouldRetry = this.shouldRetryRequest(error);
        if (shouldRetry) {
            this.retryCount += 1;
            const delay = this.getExponentialRetryTimeoutInMs(this.retryCount);
            return new Promise((resolve, reject) => {
                this.retryTimeout = setTimeout(() => {
                    this.axios(error.config).then(resolve, reject);
                }, delay);
            });
        }

        const errorObject = getProp(error, 'response.data') || error; // In the case of 401, response.data is empty so fall back to error
        this.responseInterceptor(errorObject);

        return Promise.reject(error);
    };

    /**
     * Utility to parse a URL.
     *
     * @param {string} url - Url to parse
     * @return {Object} parsed url
     */
    getParsedUrl(url: string) {
        const a = document.createElement('a');
        a.href = url;
        return {
            api: url.replace(`${a.origin}/2.0`, ''),
            host: a.host,
            hostname: a.hostname,
            pathname: a.pathname,
            origin: a.origin,
            protocol: a.protocol,
            hash: a.hash,
            port: a.port,
        };
    }

    /**
     * Builds a list of required XHR headers.
     *
     * @param {string} [id] - Optional box item id
     * @param {Object} [args] - Optional existing headers
     * @return {Object} Headers
     */
    async getHeaders(id?: string, args: StringMap = {}) {
        const headers: StringMap = {
            Accept: 'application/json',
            [HEADER_CONTENT_TYPE]: 'application/json',
            ...args,
        };

        if (this.language && !headers[HEADER_ACCEPT_LANGUAGE]) {
            headers[HEADER_ACCEPT_LANGUAGE] = this.language;
        }

        if (this.sharedLink) {
            headers.BoxApi = `shared_link=${this.sharedLink}`;

            if (this.sharedLinkPassword) {
                headers.BoxApi = `${headers.BoxApi}&shared_link_password=${this.sharedLinkPassword}`;
            }
        }

        if (this.clientName) {
            headers[HEADER_CLIENT_NAME] = this.clientName;
        }

        if (this.version) {
            headers[HEADER_CLIENT_VERSION] = this.version;
        }

        // If id is passed in, use that, otherwise default to this.id
        const itemId = id || this.id || '';
        const token = await TokenService.getWriteToken(itemId, this.token);
        if (token) {
            // Only add a token when there was one found
            headers.Authorization = `Bearer ${token}`;
        }

        return headers;
    }

    /**
     * HTTP GETs a URL
     *
     * @param {string} id - Box item id
     * @param {string} url - The URL to fetch
     * @param {Object} [headers] - Key-value map of headers
     * @param {Object} [params] - Key-value map of querystring params
     * @return {Promise} - HTTP response
     */
    get({
        url,
        id,
        params = {},
        headers = {},
    }: {
        headers?: StringMap,
        id?: string,
        params?: StringAnyMap,
        url: string,
    }): Promise<StringAnyMap> {
        return this.getHeaders(id, headers).then(hdrs =>
            this.axios.get(url, {
                signal: this.axiosAbortController.signal,
                params,
                headers: hdrs,
                parsedUrl: this.getParsedUrl(url),
            }),
        );
    }

    /**
     * HTTP POSTs a URL with JSON data
     *
     * @param {string} id - Box item id
     * @param {string} url - The URL to fetch
     * @param {Object} data - JS Object representation of JSON data to send
     * @param {Object} params - Optional query params for the request
     * @param {Object} [headers] - Key-value map of headers
     * @param {string} [method] - xhr type
     * @return {Promise} - HTTP response
     */
    post({
        url,
        id,
        data,
        params,
        headers = {},
        method = HTTP_POST,
    }: {
        data: PayloadType,
        headers?: StringMap,
        id?: string,
        method?: Method,
        params?: StringAnyMap,
        url: string,
    }): Promise<StringAnyMap> {
        return this.getHeaders(id, headers).then(hdrs =>
            this.axios({
                url,
                data,
                params,
                method,
                parsedUrl: this.getParsedUrl(url),
                headers: hdrs,
            }),
        );
    }

    /**
     * HTTP PUTs a URL with JSON data
     *
     * @param {string} id - Box item id
     * @param {string} url - The URL to fetch
     * @param {Object} data - JS Object representation of JSON data to send
     * @param {Object} params - Optional query params for the request
     * @param {Object} [headers] - Key-value map of headers
     * @return {Promise} - HTTP response
     */
    put({ url, id, data, params, headers = {} }: RequestData): Promise<StringAnyMap> {
        return this.post({ id, url, data, params, headers, method: HTTP_PUT });
    }

    /**
     * HTTP DELETEs a URL with JSON data
     *
     * @param {string} id - Box item id
     * @param {string} url - The URL to fetch
     * @param {Object} data - JS Object representation of JSON data to send
     * @param {Object} [headers] - Key-value map of headers
     * @return {Promise} - HTTP response
     */
    delete({
        url,
        id,
        data = {},
        headers = {},
    }: {
        data?: StringAnyMap,
        headers?: StringMap,
        id?: string,
        url: string,
    }): Promise<StringAnyMap> {
        return this.post({ id, url, data, headers, method: HTTP_DELETE });
    }

    /**
     * HTTP OPTIONs a URL with JSON data.
     *
     * @param {string} id - Box item id
     * @param {string} url - The URL to post to
     * @param {Object} data - The non-file post data that should accompany the post
     * @param {Object} [headers] - Key-value map of headers
     * @param {Function} successHandler - Load success handler
     * @param {Function} errorHandler - Error handler
     * @return {void}
     */
    options({
        id,
        url,
        data,
        headers = {},
        successHandler,
        errorHandler,
    }: {
        data: StringAnyMap,
        errorHandler: Function,
        headers?: StringMap,
        id?: string,
        progressHandler?: Function,
        successHandler: Function,
        url: string,
    }): Promise<StringAnyMap> {
        return this.getHeaders(id, headers)
            .then(hdrs =>
                this.axios({
                    url,
                    data,
                    method: HTTP_OPTIONS,
                    headers: hdrs,
                })
                    .then(successHandler)
                    .catch(errorHandler),
            )
            .catch(errorHandler);
    }

    /**
     * HTTP POST or PUT a URL with File data. Uses native XHR for progress event.
     *
     * @param {string} id - Box item id
     * @param {string} url - The URL to post to
     * @param {Object} [data] - File data and attributes
     * @param {Object} [headers] - Key-value map of headers
     * @param {string} [method] - XHR method, supports 'POST' and 'PUT'
     * @param {Function} successHandler - Load success handler
     * @param {Function} errorHandler - Error handler
     * @param {Function} progressHandler - Progress handler
     * @param {boolean} [withIdleTimeout] - enable idle timeout
     * @param {number} [idleTimeoutDuration] - idle timeout duration
     * @param {Function} [idleTimeoutHandler]
     * @return {void}
     */
    uploadFile({
        id,
        url,
        data,
        headers = {},
        method = HTTP_POST,
        successHandler,
        errorHandler,
        progressHandler,
        withIdleTimeout = false,
        idleTimeoutDuration = DEFAULT_UPLOAD_TIMEOUT_MS,
        idleTimeoutHandler,
    }: {
        data?: ?Blob | ?StringAnyMap,
        errorHandler: Function,
        headers?: StringMap,
        id?: string,
        idleTimeoutDuration?: number,
        idleTimeoutHandler?: Function,
        method?: Method,
        progressHandler: Function,
        successHandler: Function,
        url: string,
        withIdleTimeout?: boolean,
    }): Promise<any> {
        return this.getHeaders(id, headers)
            .then(hdrs => {
                let idleTimeout;
                let progressHandlerToUse = progressHandler;

                if (withIdleTimeout) {
                    // Func that aborts upload and executes timeout callback
                    const idleTimeoutFunc = () => {
                        this.abort();

                        if (idleTimeoutHandler) {
                            idleTimeoutHandler();
                        }
                    };

                    idleTimeout = setTimeout(idleTimeoutFunc, idleTimeoutDuration);

                    // Progress handler that aborts upload if there has been no progress for >= timeoutMs
                    progressHandlerToUse = event => {
                        clearTimeout(idleTimeout);
                        idleTimeout = setTimeout(idleTimeoutFunc, idleTimeoutDuration);
                        progressHandler(event);
                    };
                }
                this.axios({
                    url,
                    data,
                    transformRequest: (reqData, reqHeaders) => {
                        // Remove Accept & Content-Type added by getHeaders()
                        delete reqHeaders[HEADER_ACCEPT];
                        delete reqHeaders[HEADER_CONTENT_TYPE];

                        if (headers[HEADER_CONTENT_TYPE]) {
                            reqHeaders[HEADER_CONTENT_TYPE] = headers[HEADER_CONTENT_TYPE];
                        }

                        // Convert to FormData if needed
                        if (reqData && !(reqData instanceof Blob) && reqData.attributes) {
                            const formData = new FormData();
                            Object.keys(reqData).forEach(key => {
                                formData.append(key, reqData[key]);
                            });

                            return formData;
                        }

                        return reqData;
                    },
                    method,
                    headers: hdrs,
                    onUploadProgress: progressHandlerToUse,
                    signal: this.axiosAbortController.signal,
                })
                    .then(response => {
                        clearTimeout(idleTimeout);
                        successHandler(response);
                    })
                    .catch(error => {
                        clearTimeout(idleTimeout);
                        errorHandler(error);
                    });
            })
            .catch(errorHandler);
    }

    /**
     * Aborts an axios request.
     *
     * @return {void}
     */
    abort(reason: string): void {
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
        }

        if (this.axiosAbortController) {
            this.axiosAbortController.abort(reason);
        }
    }
}

export default Xhr;
