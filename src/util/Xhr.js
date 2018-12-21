/**
 * @flow
 * @file Network utilities
 * @author Box
 */

import axios from 'axios';
import getProp from 'lodash/get';
import TokenService from './TokenService';
import {
    HEADER_ACCEPT,
    HEADER_CLIENT_NAME,
    HEADER_CLIENT_VERSION,
    HEADER_CONTENT_TYPE,
    HTTP_POST,
    HTTP_PUT,
    HTTP_DELETE,
    HTTP_OPTIONS,
    HTTP_STATUS_CODE_RATE_LIMIT,
} from '../constants';
import type { $AxiosXHR, $AxiosError } from 'axios'; //eslint-disable-line

type PayloadType = StringAnyMap | Array<StringAnyMap>;

const DEFAULT_UPLOAD_TIMEOUT_MS = 120000;
const MAX_NUM_RETRIES = 3;
const BASE_RETRY_INTERVAL = 2000;
// Retry intervals are between 50% and 150% of the exponentially increasing base amount
const RETRY_RANDOMIZATION_FACTOR = 0.5;

class Xhr {
    id: ?string;

    axios: Axios;

    axiosSource: CancelTokenSource;

    clientName: ?string;

    token: Token;

    version: ?string;

    sharedLink: ?string;

    sharedLinkPassword: ?string;

    xhr: XMLHttpRequest;

    responseInterceptor: Function;

    requestInterceptor: ?Function;

    tokenService: TokenService;

    retryCount: number;

    retryTimeout: ?TimeoutID;

    shouldRetry: boolean;

    /**
     * [constructor]
     *
     * @param {Object} options
     * @param {string} options.id - item id
     * @param {string} options.clientName - Client Name
     * @param {string|function} options.token - Auth token
     * @param {string} [options.sharedLink] - Shared link
     * @param {string} [options.sharedLinkPassword] - Shared link password
     * @param {string} [options.requestInterceptor] - Request interceptor
     * @param {string} [options.responseInterceptor] - Response interceptor
     * @return {Xhr} Cache instance
     */
    constructor({
        id,
        clientName,
        token,
        version,
        sharedLink,
        sharedLinkPassword,
        responseInterceptor,
        requestInterceptor,
        shouldRetry = true,
    }: Options = {}) {
        this.id = id;
        this.token = token;
        this.clientName = clientName;
        this.version = version;
        this.sharedLink = sharedLink;
        this.sharedLinkPassword = sharedLinkPassword;
        this.responseInterceptor = responseInterceptor || this.defaultResponseInterceptor;
        this.axios = axios.create();
        this.axiosSource = axios.CancelToken.source();
        this.retryCount = 0;
        this.shouldRetry = shouldRetry;

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

        const { response, request } = error;
        // Retry if there is a network error (e.g. ECONNRESET) or rate limited
        const isNetworkError = request && !response;
        const isRetryableStatusCode = isNetworkError || getProp(response, 'status') === HTTP_STATUS_CODE_RATE_LIMIT;
        return isRetryableStatusCode;
    }

    /**
     * Calculate the exponential backoff time with randomized jitter. Taken from box node SDK
     *
     * @param {number} numRetries Which retry number this one will be. Must be > 0
     * @returns {number} The number of milliseconds after which to retry
     */
    getExponentialRetryTimeoutInMs(numRetries: number): number {
        const minRandomization = 1 - RETRY_RANDOMIZATION_FACTOR;
        const maxRandomization = 1 + RETRY_RANDOMIZATION_FACTOR;
        const randomization = Math.random() * (maxRandomization - minRandomization) + minRandomization;
        const exponential = 2 ** (numRetries - 1);
        return Math.ceil(exponential * BASE_RETRY_INTERVAL * randomization);
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
        const headers: StringMap = Object.assign(
            {
                Accept: 'application/json',
                [HEADER_CONTENT_TYPE]: 'application/json',
            },
            args,
        );

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
        url: string,
        id?: string,
        params?: StringAnyMap,
        headers?: StringMap,
    }): Promise<StringAnyMap> {
        return this.getHeaders(id, headers).then(hdrs =>
            this.axios.get(url, {
                cancelToken: this.axiosSource.token,
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
        url: string,
        id?: string,
        data: PayloadType,
        params?: StringAnyMap,
        headers?: StringMap,
        method?: Method,
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
    put({
        url,
        id,
        data,
        params,
        headers = {},
    }: {
        url: string,
        id?: string,
        data: PayloadType,
        params?: StringAnyMap,
        headers?: StringMap,
    }): Promise<StringAnyMap> {
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
        url: string,
        id?: string,
        data?: StringAnyMap,
        headers?: StringMap,
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
        url: string,
        data: StringAnyMap,
        id?: string,
        headers?: StringMap,
        successHandler: Function,
        errorHandler: Function,
        progressHandler?: Function,
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
        url: string,
        id?: string,
        data?: ?Blob | ?StringAnyMap,
        headers?: StringMap,
        method?: Method,
        successHandler: Function,
        errorHandler: Function,
        progressHandler: Function,
        withIdleTimeout?: boolean,
        idleTimeoutDuration?: number,
        idleTimeoutHandler?: Function,
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
                    cancelToken: this.axiosSource.token,
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
    abort(): void {
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
        }
        if (this.axiosSource) {
            this.axiosSource.cancel();
        }
    }
}

export default Xhr;
export { RETRY_RANDOMIZATION_FACTOR, BASE_RETRY_INTERVAL };
