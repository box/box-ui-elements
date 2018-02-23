/**
 * @flow
 * @file Network utilities
 * @author Box
 */

import axios from 'axios';
import { stringify } from 'querystring';
import TokenService from './TokenService';
import type { Method, StringMap, StringAnyMap, Options, Token } from '../flowTypes';

const HEADER_CLIENT_NAME = 'X-Box-Client-Name';
const HEADER_CLIENT_VERSION = 'X-Box-Client-Version';
const CONTENT_TYPE_HEADER = 'Content-Type';
const SUCCESS_RESPONSE_FILTER = ({ response }) => response;
const DEFAULT_UPLOAD_TIMEOUT_MS = 120000;

class Xhr {
    id: ?string;
    axios: axios;
    clientName: ?string;
    token: Token;
    version: ?string;
    sharedLink: ?string;
    sharedLinkPassword: ?string;
    xhr: XMLHttpRequest;
    responseFilter: Function;
    tokenService: TokenService;

    /**
     * [constructor]
     *
     * @param {Object} options
     * @param {string} options.id - item id
     * @param {string} options.clientName - Client Name
     * @param {string|function} options.token - Auth token
     * @param {string} [options.sharedLink] - Shared link
     * @param {string} [options.sharedLinkPassword] - Shared link password
     * @return {Xhr} Cache instance
     */
    constructor({ id, clientName, token, version, sharedLink, sharedLinkPassword, responseFilter }: Options = {}) {
        this.id = id;
        this.token = token;
        this.clientName = clientName;
        this.version = version;
        this.sharedLink = sharedLink;
        this.sharedLinkPassword = sharedLinkPassword;
        this.responseFilter = typeof responseFilter === 'function' ? responseFilter : SUCCESS_RESPONSE_FILTER;
        this.axios = axios.create();
    }

    /**
     * Function that applies filtering
     *
     * @param {Object} data - JS Object representation of JSON data to send
     * @return {string} - Stringifyed data
     */
    applyResponseFiltering(url: string, method: Method, body?: StringAnyMap): Function {
        const a = document.createElement('a');
        a.href = url;

        return ({ data }: StringAnyMap): Promise<StringAnyMap> => {
            const filteredResponse = this.responseFilter({
                request: {
                    method,
                    url,
                    body,
                    api: url.replace(`${a.origin}/2.0`, ''),
                    host: a.host,
                    hostname: a.hostname,
                    pathname: a.pathname,
                    origin: a.origin,
                    protocol: a.protocol,
                    search: a.search,
                    hash: a.hash,
                    port: a.port
                },
                response: data
            });
            return filteredResponse instanceof Promise ? filteredResponse : Promise.resolve(filteredResponse);
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
                [CONTENT_TYPE_HEADER]: 'application/json'
            },
            args
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
        const token = await TokenService.getToken(itemId, this.token);
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
        headers = {}
    }: {
        url: string,
        id?: string,
        params?: StringAnyMap,
        headers?: StringMap
    }): Promise<StringAnyMap> {
        const querystring = stringify(params);
        const fullUrl = querystring.length > 0 ? `${url}?${querystring}` : url;

        return this.getHeaders(id, headers).then((hdrs) =>
            this.axios.get(fullUrl, { headers: hdrs }).then(this.applyResponseFiltering(fullUrl, 'GET'))
        );
    }

    /**
     * HTTP POSTs a URL with JSON data
     *
     * @param {string} id - Box item id
     * @param {string} url - The URL to fetch
     * @param {Object} data - JS Object representation of JSON data to send
     * @param {Object} [headers] - Key-value map of headers
     * @param {string} [method] - xhr type
     * @return {Promise} - HTTP response
     */
    post({
        url,
        id,
        data = {},
        headers = {},
        method = 'POST'
    }: {
        url: string,
        id?: string,
        data?: StringAnyMap,
        headers?: StringMap,
        method?: Method
    }): Promise<StringAnyMap> {
        return this.getHeaders(id, headers).then((hdrs) =>
            this.axios({
                url,
                data,
                method,
                headers: hdrs
            }).then(this.applyResponseFiltering(url, method, data))
        );
    }

    /**
     * HTTP PUTs a URL with JSON data
     *
     * @param {string} id - Box item id
     * @param {string} url - The URL to fetch
     * @param {Object} data - JS Object representation of JSON data to send
     * @param {Object} [headers] - Key-value map of headers
     * @return {Promise} - HTTP response
     */
    put({
        url,
        id,
        data = {},
        headers = {}
    }: {
        url: string,
        id?: string,
        data?: StringAnyMap,
        headers?: StringMap
    }): Promise<StringAnyMap> {
        return this.post({ id, url, data, headers, method: 'PUT' });
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
        headers = {}
    }: {
        url: string,
        id?: string,
        data?: StringAnyMap,
        headers?: StringMap
    }): Promise<StringAnyMap> {
        return this.post({ id, url, data, headers, method: 'DELETE' });
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
        errorHandler
    }: {
        url: string,
        data: StringAnyMap,
        id?: string,
        headers?: StringMap,
        successHandler: Function,
        errorHandler: Function,
        progressHandler?: Function
    }): Promise<StringAnyMap> {
        return this.getHeaders(id, headers)
            .then((hdrs) =>
                this.axios({
                    url,
                    data,
                    method: 'options',
                    headers: hdrs
                })
                    .then(successHandler)
                    .catch((error: any) => {
                        errorHandler(error.response.data);
                    })
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
        method = 'POST',
        successHandler,
        errorHandler,
        progressHandler,
        withIdleTimeout = false,
        idleTimeoutDuration = DEFAULT_UPLOAD_TIMEOUT_MS,
        idleTimeoutHandler
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
        idleTimeoutHandler?: Function
    }): Promise<any> {
        let formData;
        if (data && !(data instanceof Blob) && data.attributes) {
            formData = new FormData();
            Object.keys(data).forEach((key) => {
                formData.append(key, data[key]);
            });
        }

        return this.getHeaders(id, headers)
            .then((hdrs) => {
                // Remove Accept/Content-Type added by getHeaders()
                delete hdrs.Accept;
                delete hdrs[CONTENT_TYPE_HEADER];

                if (headers[CONTENT_TYPE_HEADER]) {
                    hdrs[CONTENT_TYPE_HEADER] = headers[CONTENT_TYPE_HEADER];
                }

                this.xhr = new XMLHttpRequest();
                this.xhr.open(method, url, true);

                Object.keys(hdrs).forEach((header) => {
                    this.xhr.setRequestHeader(header, hdrs[header]);
                });

                this.xhr.addEventListener('load', () => {
                    const { readyState, status, responseText } = this.xhr;
                    if (readyState === XMLHttpRequest.DONE) {
                        const response = status === 204 ? responseText : JSON.parse(responseText);
                        if (status >= 200 && status < 300) {
                            successHandler(response);
                        } else {
                            errorHandler(response);
                        }
                    }
                });

                this.xhr.addEventListener('error', errorHandler);

                if (progressHandler && this.xhr.upload) {
                    this.xhr.upload.addEventListener('progress', progressHandler);
                }

                const dataSent = formData || data;
                if (withIdleTimeout) {
                    this.xhrSendWithIdleTimeout(dataSent, idleTimeoutDuration, idleTimeoutHandler);
                } else {
                    this.xhr.send(dataSent);
                }
            })
            .catch(errorHandler);
    }

    /**
     * Aborts a request made with native XHR. Currently, this only
     * works for aborting a file upload.
     *
     * @return {void}
     */
    abort(): void {
        if (!this.xhr) {
            return;
        }

        // readyState is set to UNSENT if request has already been aborted
        const { readyState } = this.xhr;
        if (readyState !== XMLHttpRequest.UNSENT && readyState !== XMLHttpRequest.DONE) {
            this.xhr.abort();
        }
    }

    /**
     * Returns a handler for setInterval used in xhrSendWithIdleTimeout()
     *
     * @private
     * @param {number} lastProgress
     * @param {number} timeoutMs
     * @param {function} clear
     * @param {?function} onTimeout
     * @return {function}
     */
    getXhrIdleIntervalHandler(
        lastProgress: number,
        timeoutMs: number,
        clear: Function,
        onTimeout?: Function
    ): Function {
        return () => {
            if (Date.now() - lastProgress <= timeoutMs) {
                return;
            }

            this.xhr.abort();
            clear();

            if (onTimeout) {
                onTimeout();
            }
        };
    }

    /**
     * Executes an upload via XMLHTTPRequest and aborts it if there is no progress event for at least timeoutMs.
     *
     * @private
     * @param {Object} data - Will be passed to xhr.send()
     * @param {number} [timeoutMs] - idle timeout, in milliseconds.
     * @param {function} [onTimeout] - callback invoked when request has timed out
     * @return {void}
     */
    xhrSendWithIdleTimeout(data: Object, timeoutMs?: number = DEFAULT_UPLOAD_TIMEOUT_MS, onTimeout?: Function): void {
        let interval;
        let lastLoaded = 0;
        let lastProgress = Date.now();

        this.xhr.upload.addEventListener('progress', (event: ProgressEvent) => {
            if (event.loaded > lastLoaded) {
                lastLoaded = event.loaded;
                lastProgress = Date.now();
            }
        });

        function clear(): void {
            if (!interval) {
                return;
            }

            clearInterval(interval);
            interval = null;
        }

        this.xhr.addEventListener('abort', clear);
        this.xhr.addEventListener('load', clear);
        this.xhr.addEventListener('error', clear);

        interval = setInterval(this.getXhrIdleIntervalHandler(lastProgress, timeoutMs, clear, onTimeout), 1000);
        this.xhr.send(data);
    }
}

export default Xhr;
