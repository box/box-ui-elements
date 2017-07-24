/**
 * @flow
 * @file Network utilities
 * @author Box
 */

import 'whatwg-fetch';
import { stringify } from 'querystring';
import type { StringMap, StringAnyMap, Options, Token } from '../flowTypes';

const HEADER_CLIENT_NAME = 'X-Box-Client-Name';
const HEADER_CLIENT_VERSION = 'X-Box-Client-Version';
const CONTENT_TYPE_HEADER = 'Content-Type';

type Method = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT';

type XHROptions = {
    url: string,
    data: StringAnyMap,
    headers?: StringMap,
    successHandler: Function,
    errorHandler: Function,
    progressHandler?: Function
};

class Xhr {
    id: string;
    clientName: ?string;
    token: Token;
    version: ?string;
    sharedLink: ?string;
    sharedLinkPassword: ?string;
    xhr: XMLHttpRequest;

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
    constructor({ id, clientName, token, version, sharedLink, sharedLinkPassword }: Options = {}) {
        this.id = id || '';
        this.token = token || '';
        this.clientName = clientName;
        this.version = version;
        this.sharedLink = sharedLink;
        this.sharedLinkPassword = sharedLinkPassword;
    }

    /**
     * Helper function to convert HTTP status codes into throwable errors
     *
     * @param {Response} response - fetch's Response object
     * @throws {Error} - Throws when the HTTP status is not 2XX
     * @return {Response} - Pass-thru the response if ther are no errors
     */
    static checkStatus(response: Response): Response {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }

        const error: any = new Error(response.statusText);
        error.response = response;
        throw error;
    }

    /**
     * Gets the JSON from a response if the response is not 204
     *
     * @param {Response} response - fetch's Response object
     * @return {Object} JS Object representation of the JSON response or the response
     */
    static parseJSON(response: Response): Response | Promise<any> {
        // Return plain response if it is 202 or 204 since they don't have a body
        if (response.status === 202 || response.status === 204) {
            return response;
        }
        return response.json();
    }

    /**
     * Helper function to convert HTTP status codes into throwable errors
     *
     * @param {Object} data - JS Object representation of JSON data to send
     * @return {string} - Stringifyed data
     */
    static stringifyData(data: StringAnyMap): string {
        return JSON.stringify(data).replace(/"\s+|\s+"/g, '"');
    }

    /**
     * The token can either be a simple string or a function that returns
     * a promise which resolves to a key value map where key is the file
     * id and value is the token. The function accepts either a simple id
     * or an array of file ids
     *
     * @param
     * @param {string|Array} id - box file id(s)
     * @param {string|Function} token
     * @return {Promise} that resolves to a token
     */
    getToken(): Promise<string> {
        const error = new Error('Bad auth token!');
        return new Promise((resolve: Function, reject: Function) => {
            if (typeof this.token === 'string') {
                // Token is a simple string
                resolve(this.token);
            } else if (typeof this.token === 'function') {
                // Token is a function which returns a promise
                // that on resolution returns an id to token map.
                this.token(this.id)
                    .then((token) => {
                        if (typeof token === 'string') {
                            resolve(token);
                        } else if (typeof token === 'object') {
                            resolve(token[this.id]);
                        } else {
                            reject(error);
                        }
                    })
                    .catch(reject);
            } else {
                reject(error);
            }
        });
    }

    /**
     * Builds a list of required XHR headers.
     *
     * @param {Object} [args] - Optional existing headers
     * @return {Object} Headers
     */
    getHeaders(args: StringMap = {}) {
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

        return this.getToken().then((token) => {
            headers.Authorization = `Bearer ${token}`;
            return headers;
        });
    }

    /**
     * HTTP GETs a URL
     *
     * @param {string} url - The URL to fetch
     * @param {Object} [headers] - Key-value map of headers
     * @param {Object} [params] - Key-value map of querystring params
     * @return {Promise} - HTTP response
     */
    get(url: string, params: any = {}, headers: any = {}) {
        const querystring = stringify(params);
        const fullUrl = querystring.length > 0 ? `${url}?${querystring}` : url;

        return this.getHeaders(headers).then((hdrs) =>
            fetch(fullUrl, { headers: hdrs, mode: 'cors' }).then(Xhr.checkStatus).then(Xhr.parseJSON)
        );
    }

    /**
     * HTTP POSTs a URL with JSON data
     *
     * @param {string} url - The URL to fetch
     * @param {Object} data - JS Object representation of JSON data to send
     * @param {Object} [headers] - Key-value map of headers
     * @param {string} [method] - xhr type
     * @return {Promise} - HTTP response
     */
    post(url: string, data: StringAnyMap = {}, headers: StringMap = {}, method: Method = 'POST'): Promise<any> {
        return this.getHeaders(headers).then((hdrs) =>
            fetch(url, {
                method,
                headers: hdrs,
                body: Xhr.stringifyData(data)
            })
                .then(Xhr.checkStatus)
                .then(Xhr.parseJSON)
        );
    }

    /**
     * HTTP PUTs a URL with JSON data
     *
     * @param {string} url - The URL to fetch
     * @param {Object} data - JS Object representation of JSON data to send
     * @param {Object} [headers] - Key-value map of headers
     * @return {Promise} - HTTP response
     */
    put(url: string, data: StringAnyMap = {}, headers: StringMap = {}): Promise<any> {
        return this.post(url, data, headers, 'PUT');
    }

    /**
     * HTTP DELETEs a URL with JSON data
     *
     * @param {string} url - The URL to fetch
     * @param {Object} data - JS Object representation of JSON data to send
     * @param {Object} [headers] - Key-value map of headers
     * @return {Promise} - HTTP response
     */
    delete(url: string, data: StringAnyMap = {}, headers: StringMap = {}): Promise<any> {
        return this.post(url, data, headers, 'DELETE');
    }

    /**
     * HTTP OPTIONs a URL with JSON data.
     *
     * @param {string} url - The URL to post to
     * @param {Object} data - The non-file post data that should accompany the post
     * @param {Object} [headers] - Key-value map of headers
     * @param {Function} successHandler - Load success handler
     * @param {Function} errorHandler - Error handler
     * @returns {void}
     */
    options({ url, data, headers = {}, successHandler, errorHandler }: XHROptions): Promise<any> {
        return this.getHeaders(headers).then((hdrs) =>
            fetch(url, {
                method: 'OPTIONS',
                headers: hdrs,
                body: Xhr.stringifyData(data)
            })
                .then(Xhr.parseJSON)
                .then((response: StringAnyMap) => {
                    if (response.type === 'error') {
                        errorHandler(response);
                    } else {
                        successHandler(response);
                    }
                })
                .catch(errorHandler)
        );
    }

    /**
     * HTTP POST or PUT a URL with File data. Uses native XHR for progress event.
     *
     * @param {string} url - The URL to post to
     * @param {Object} [data] - File data and attributes
     * @param {Object} [headers] - Key-value map of headers
     * @param {string} [method] - XHR method, supports 'POST' and 'PUT'
     * @param {Function} successHandler - Load success handler
     * @param {Function} errorHandler - Error handler
     * @param {Function} progressHandler - Progress handler
     * @return {void}
     */
    uploadFile({
        url,
        data,
        headers = {},
        method = 'POST',
        successHandler,
        errorHandler,
        progressHandler
    }: {
        url: string,
        data: ?Object,
        headers?: StringMap,
        method?: Method,
        successHandler: Function,
        errorHandler: Function,
        progressHandler: Function
    }): Promise<any> {
        let formData;
        if (data && data.attributes) {
            formData = new FormData();
            Object.keys(data).forEach((key) => {
                if (data) {
                    formData.append(key, data[key]);
                }
            });
        }

        return this.getHeaders(headers)
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

                if (formData) {
                    this.xhr.send(formData);
                } else {
                    this.xhr.send(data);
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
}

export default Xhr;
