// @flow
import LocalStore from '../../utils/LocalStore';
import Channel from './Channel';
import { get as getCookie, set as setCookie } from './cookies';

const GET = 'GET';
const POST = 'POST';
const YEAR_MS = 31536000000;
const DEFAULT_PRIMARY_PORT = 17223;
const DEFAULT_FALLBACK_PORT = 17224;
const CONTENT_TYPE_HEADER = 'Content-Type';
const CONTENT_TYPE_VALUE = 'text/plain; charset=UTF-8';
const STATUS_NOT_RUNNING = 'notrunning';

const localStore = new LocalStore();

function shouldUseFallbackFirst() {
    return !!localStore.getItem('comUseFallback');
}

function saveFallbackPortPreference() {
    localStore.setItem('comUseFallback', 1);
}

function clearFallbackPortPreference() {
    localStore.removeItem('comUseFallback');
}

function getPreferredPortOrdering() {
    if (shouldUseFallbackFirst()) {
        return {
            primary: DEFAULT_FALLBACK_PORT,
            fallback: DEFAULT_PRIMARY_PORT,
        };
    }

    return {
        primary: DEFAULT_PRIMARY_PORT,
        fallback: DEFAULT_FALLBACK_PORT,
    };
}

class HTTPChannel extends Channel {
    url: string;

    channelName: string;

    comChannelName: string;

    comServerInstallationPromise: ?Promise<any>;

    retryCounter: number;

    sendCount: number;

    currentPort: number;

    comServerInstallationPromiseRejected: boolean;

    window: any;

    constructor(appName: string, url: string, channelName: string) {
        super(appName);
        this.url = url;
        this.comChannelName = this.setComChannel(appName);
        this.channelName = channelName;
        this.comServerInstallationPromise = null;
        this.comServerInstallationPromiseRejected = false;
        this.retryCounter = 0;
        this.sendCount = 0;
        this.currentPort = getPreferredPortOrdering().primary;
        this.window = window;
    }

    createCORSRequest = (method: string, url: string): XMLHttpRequest => {
        let xhr;
        try {
            const { XMLHttpRequest } = this.window;
            xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            return xhr;
        } catch (ex) {
            if (this.retryCounter < 3) {
                this.retryCounter += 1;
                return this.createCORSRequest(method, url);
            }
            throw new Error('could not create xhr');
        }
    };

    getComServerStatusInstallationPromise = (timeoutMS: number): Promise<any> => {
        let resolve;
        let reject;
        const comServerInstallationPromise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });

        const resolveWithValidPort = (port, res) => {
            this.currentPort = port;

            if (port === DEFAULT_PRIMARY_PORT) {
                clearFallbackPortPreference();
            } else {
                saveFallbackPortPreference();
            }

            this.comServerInstallationPromiseRejected = false;
            resolve(res);
        };

        const portPreferences = getPreferredPortOrdering();
        const primaryPort = portPreferences.primary;
        const fallbackPort = portPreferences.fallback;

        // Try primary port first
        this.checkInstallStatus(primaryPort, timeoutMS)
            .then(resolveWithValidPort.bind(this, primaryPort))
            .catch(err => {
                // If com server returned that the port is available but the app is not running, reject
                if (err === STATUS_NOT_RUNNING) {
                    this.comServerInstallationPromiseRejected = true;
                    reject();
                    return;
                }

                // Only check secondary, if necessary, otherwise this throws a browser error in console
                this.checkInstallStatus(fallbackPort, timeoutMS)
                    .then(resolveWithValidPort.bind(this, fallbackPort))
                    .catch(() => {
                        this.comServerInstallationPromiseRejected = true;
                        reject();
                    });
            });

        return comServerInstallationPromise;
    };

    sendComServerRequest = (method: string, url: string, data: ?Object | string, timeoutMS: number): Promise<any> => {
        return new Promise((resolve, reject) => {
            try {
                const request = this.createCORSRequest(method, url);

                request.setRequestHeader(CONTENT_TYPE_HEADER, CONTENT_TYPE_VALUE);
                request.onload = () => {
                    resolve(request);
                };
                request.onerror = () => {
                    reject(request);
                };

                if (timeoutMS > 0) {
                    request.timeout = timeoutMS;
                    request.ontimeout = () => {
                        reject(request);
                    };
                }
                setTimeout(() => {
                    request.send(data);
                }, 0);
            } catch (err) {
                reject();
            }
        });
    };

    checkInstallStatus = (port: number, timeoutMS: number): Promise<any> => {
        return this.sendComServerRequest(GET, `${this.url}${port}/status`, null, timeoutMS).then(request => {
            const response = JSON.parse(request.responseText);
            if (response.running) {
                return response;
            }
            this.comServerInstallationPromiseRejected = true;
            throw new Error(STATUS_NOT_RUNNING);
        });
    };

    getComChannel = (appName: string) => getCookie(`${appName}-bgp-id`);

    setComChannel = (appName: string) => {
        const bgpId = this.getComChannel(appName) || this.generateId();
        const comChannelName = `bgp-${bgpId}`;
        const aYearFromNow = new Date().getTime() + YEAR_MS;
        setCookie(`${appName}-bgp-id`, bgpId, aYearFromNow);
        setCookie(`bgp-${bgpId}`, 'generic', aYearFromNow);
        return comChannelName;
    };

    getComServerStatus = (timeoutMS: number) => {
        if (!this.comServerInstallationPromise || this.comServerInstallationPromiseRejected) {
            // Null out the promise and fetch status again (handles the case where user installed box edit within the same page load)
            this.comServerInstallationPromise = null;
            this.comServerInstallationPromise = this.getComServerStatusInstallationPromise(timeoutMS);
            return this.comServerInstallationPromise;
        }
        return this.comServerInstallationPromise;
    };

    sendRequest = (
        data: Object | string,
        browserToComServerTimeoutMS: number,
        comServerToApplicationTimeoutSec: number,
    ): Promise<any> => {
        const url = `${this.url}${this.currentPort}/application_request?application=${this.appName}&com=${this.comChannelName}&timeout=${comServerToApplicationTimeoutSec}`;
        return this.sendComServerRequest(POST, url, data, browserToComServerTimeoutMS).then(results => {
            // TODO: does the error object need to be richer?
            const response = JSON.parse(results.responseText);
            if (response.response_type && response.response_type === 'error') {
                throw new Error(`Communication error: ${response.message}`);
            }
            return response;
        });
    };

    sendCommand = (
        data: Object | string,
        browserToComServerTimeoutMS: number,
        comServerToApplicationTimeoutSec: number,
    ): Promise<any> => {
        const url = `${this.url}${this.currentPort}/application_command?application=${this.appName}&com=${this.comChannelName}&timeout=${comServerToApplicationTimeoutSec}`;
        return this.sendComServerRequest(POST, url, data, browserToComServerTimeoutMS).then(results => {
            return JSON.parse(results.responseText);
        });
    };

    generateId = () => {
        const time = new Date().getTime();
        return 'xxxxxxxx'.replace(/x/g, () => {
            // Generate random number between 1 and 16.
            // Using time for added entropy.
            const rand = Math.floor((time + Math.random() * 16) % 16);
            // Convert number to a HEX
            return rand.toString(16);
        });
    };
}

export default HTTPChannel;
