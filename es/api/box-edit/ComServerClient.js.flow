// @flow

import Browser, { BROWSER_CONSTANTS } from './BrowserUtils';

import promiseOne from './promise';
import ActiveXChannel from './ActiveXChannel';
import Channel from './Channel';
import HTTPChannel from './HTTPChannel';
import SafariChannel from './SafariChannel';
import CONSTANTS from './constants';

const MIN_FIREFOX_VERSION_FOR_MIXED_CONTENT = 55;
const MIN_EDGE_16_VERSION_FOR_MIXED_CONTENT = '16.16299';
const MIN_EDGE_VERSION_FOR_MIXED_CONTENT = '17.17134';
const REQUEST_TIMEOUT_MS = 5000;

let boxToolsLogData: {
    activex_channel_status: string,
    box_tools_version: ?string,
    browser_name: string,
    browser_version: string,
    error_message: ?string,
    http_channel_status: string,
    https_channel_status: string,
    installation_type: ?string,
    safari_channel_status: string,
};

function createHTTPChannel(appName: string): HTTPChannel {
    const { BOX_UNSECURE_LOCAL_BASE_URL, CREATED_STATUS, HTTP_CHANNEL_NAME } = CONSTANTS;

    boxToolsLogData.http_channel_status = CREATED_STATUS;

    return new HTTPChannel(appName, BOX_UNSECURE_LOCAL_BASE_URL, HTTP_CHANNEL_NAME);
}

function createSafariChannel(appName: string): SafariChannel {
    const { CREATED_STATUS } = CONSTANTS;

    boxToolsLogData.safari_channel_status = CREATED_STATUS;

    return new SafariChannel(appName);
}

function createActiveXChannel(appName: string): ActiveXChannel {
    const { CREATED_STATUS } = CONSTANTS;

    boxToolsLogData.activex_channel_status = CREATED_STATUS;

    return new ActiveXChannel(appName, false);
}

/**
 * Returns an instance of the ActiveX Channel that runs commands in the ActiveX process synchronously.
 * This is required for running in certain embedded IE-based webviews.
 */
function createSynchronousActiveXChannel(appName): ActiveXChannel {
    const { CREATED_STATUS } = CONSTANTS;

    boxToolsLogData.activex_channel_status = CREATED_STATUS;
    return new ActiveXChannel(appName, true);
}

/**
 * Returns TRUE for MS Edge versions 17.17692+ OR
 * Returns TRUE for MS Edge version 16 greater than 16.16299
 * @returns {boolean}
 */
function isSupportedMSEdgeVersion() {
    const { EDGE } = BROWSER_CONSTANTS;
    return (
        Browser.isMinBrowser(EDGE, MIN_EDGE_VERSION_FOR_MIXED_CONTENT) ||
        (Browser.isMinBrowser(EDGE, MIN_EDGE_16_VERSION_FOR_MIXED_CONTENT) && Browser.getVersion().startsWith('16.'))
    );
}

function isUnsupportedMSEdgeVersion() {
    return Browser.isEdge() && !isSupportedMSEdgeVersion();
}

function isMixedContentAllowedOnLocalhost() {
    const { CHROME, FIREFOX } = BROWSER_CONSTANTS;
    // TODO can we do this with feature detection rather than sniffing?
    return (
        Browser.isMinBrowser(CHROME, 53) ||
        Browser.isMinBrowser(FIREFOX, MIN_FIREFOX_VERSION_FOR_MIXED_CONTENT) ||
        isSupportedMSEdgeVersion()
    );
}

function isSupportedSafariVersion() {
    return Browser.isMinBrowser(BROWSER_CONSTANTS.SAFARI, 10);
}

function isUnsupportedSafariVersion() {
    return Browser.isSafari() && !isSupportedSafariVersion();
}

/**
 * @TODO: (2018-07-24) Rename this to isFirefoxWithoutMixedContentCapability
 * since we do not have an Extension planned for the Firefox versions below 55.
 */
function isFirefoxWithExtensionsCapability() {
    return (
        Browser.isFirefox() && !Browser.isMinBrowser(BROWSER_CONSTANTS.FIREFOX, MIN_FIREFOX_VERSION_FOR_MIXED_CONTENT)
    );
}

/**
 * Checks if the IE version is supported
 * @returns {boolean}
 */
function isSupportedIEVersion() {
    return Browser.isMinBrowser(BROWSER_CONSTANTS.IE, 11);
}

/**
 * Checks if the user is on IE 11 and has a specific ActiveXObject plugin loaded on the page
 */
function isSupportedIEAndBoxToolsPluginAvailable() {
    // Browser Plugins Support is the check for ActiveX-like plugins
    return isSupportedIEVersion() && Browser.isIEAndSpecificBrowserPluginSupported(CONSTANTS.BOX_TOOLS_PLUGIN_NAME);
}

/**
 * Analyze the cause of Channel failure and return a rejected Promise with an error message
 */
function comServerErrorGenerator(reject) {
    const {
        BOX_EDIT_NOT_SUPPORTED_ERROR,
        BOX_EDIT_SAFARI_ERROR,
        BOX_EDIT_UNINSTALLED_ERROR,
        BOX_EDIT_UPGRADE_BROWSER_ERROR,
    } = CONSTANTS;
    let errorMessageID = BOX_EDIT_NOT_SUPPORTED_ERROR;

    if (isMixedContentAllowedOnLocalhost()) {
        errorMessageID = BOX_EDIT_UNINSTALLED_ERROR;
    } else if (isSupportedIEVersion()) {
        errorMessageID = BOX_EDIT_UNINSTALLED_ERROR;
    } else if (
        Browser.isFirefox() ||
        Browser.isChrome() ||
        isUnsupportedSafariVersion() ||
        isUnsupportedMSEdgeVersion()
        // Show UPGRADE message when MS Edge support has been enabled
    ) {
        errorMessageID = BOX_EDIT_UPGRADE_BROWSER_ERROR;
    } else if (isSupportedSafariVersion()) {
        errorMessageID = BOX_EDIT_SAFARI_ERROR;
    }

    boxToolsLogData.error_message = errorMessageID;
    return reject(new Error(errorMessageID));
}

/**
 * Default returns the timeout value of 5000ms, if a timeout is not passed.
 * When passed validates it to be a number and parse it to the lower integer value
 *
 * @param {number} [customTimeoutMS] optional field to override the timeout value passed in miliseconds
 * @returns {number}
 */
function validateAndReturnBrowserToComServerTimeout(customTimeoutMS) {
    let timeoutMS = REQUEST_TIMEOUT_MS;

    // validate timeout is a positive number
    if (typeof customTimeoutMS === 'number' && customTimeoutMS >= 0) {
        timeoutMS = Math.floor(customTimeoutMS);
    }

    return timeoutMS;
}

/**
 * Returns reduced timeout converted to seconds
 * We need to use a shortened timeout for the connection between local com server and application,
 * so that we will receive a message that that connection has timed out,
 * before the connection between the browser and the local com server itself times out.
 */
function shortenAndReturnComServerToApplicationTimeout(browserToComServerTimeoutMS) {
    let timeoutSec = +(browserToComServerTimeoutMS / 1000).toFixed(2);

    if (browserToComServerTimeoutMS < 2) {
        timeoutSec /= 2;
    } else {
        timeoutSec -= 1;
    }

    return timeoutSec;
}

function initBoxToolsLogData() {
    const browserName = Browser.getName();
    const browserVersion = Browser.getVersion();
    const { UNCREATED_STATUS } = CONSTANTS;

    boxToolsLogData = {
        box_tools_version: null,
        browser_name: browserName,
        browser_version: browserVersion,
        error_message: null,
        installation_type: null,
        http_channel_status: UNCREATED_STATUS,
        https_channel_status: UNCREATED_STATUS,
        activex_channel_status: UNCREATED_STATUS,
        safari_channel_status: UNCREATED_STATUS,
    };
}

class ComServerClient {
    activeChannel: Channel;

    channels: Array<Channel>;

    isInitialized: boolean = false;

    browser: string;

    constructor(appName: string) {
        this.channels = [];

        this.isInitialized = true;
        initBoxToolsLogData();

        if (isMixedContentAllowedOnLocalhost()) {
            this.channels.push(createHTTPChannel(appName));
        } else if (isSupportedSafariVersion()) {
            this.channels.push(createSafariChannel(appName));
        } else if (isSupportedIEAndBoxToolsPluginAvailable()) {
            this.channels.push(createActiveXChannel(appName));
        } else if (isFirefoxWithExtensionsCapability() || isUnsupportedMSEdgeVersion()) {
            // @NOTE (2018-07-24) No Action - Trying all channels is not an option in this case
            // @TODO (2018-07-24) Remove this empty case from here?
        } else {
            // @NOTE: (2018-01-16) Trying all channels in case of custom useragent
            this.channels = this.channels.concat([
                createHTTPChannel(appName),
                createSafariChannel(appName),
                createSynchronousActiveXChannel(appName),
            ]);
        }
    }

    getComServerStatus(customTimeoutMS: ?number): Promise<any> {
        const { ACTIVE_STATUS } = CONSTANTS;

        const browserToComServerTimeoutMS = validateAndReturnBrowserToComServerTimeout(customTimeoutMS);
        const comServerToApplicationTimeoutSec = shortenAndReturnComServerToApplicationTimeout(
            browserToComServerTimeoutMS,
        );

        const shouldRejectPromiseDueToUnSupportedMSEdgeOrVersion = isUnsupportedMSEdgeVersion();

        return new Promise((resolve, reject) => {
            if (shouldRejectPromiseDueToUnSupportedMSEdgeOrVersion) {
                return comServerErrorGenerator.call(null, reject);
            }

            if (!this.channels.length) {
                return comServerErrorGenerator.call(null, reject);
            }

            return promiseOne(
                this.channels.map(channel => {
                    return channel
                        .getComServerStatus(browserToComServerTimeoutMS, comServerToApplicationTimeoutSec)
                        .then(res => {
                            this.activeChannel = channel;

                            if (res) {
                                boxToolsLogData.installation_type = res.installation_type;
                                boxToolsLogData.box_tools_version = res.version;
                            }

                            boxToolsLogData[`${channel.channelName}_status`] = ACTIVE_STATUS;
                            return resolve(res);
                        });
                }),
            ).catch(comServerErrorGenerator.bind(null, reject));
        });
    }

    // TODO isSynchronous? do we need it?
    sendRequest(requestData: string, isSynchronous: ?boolean, customTimeoutMS: ?number): Object {
        const browserToComServerTimeoutMS = validateAndReturnBrowserToComServerTimeout(customTimeoutMS);
        const comServerToApplicationTimeoutSec = shortenAndReturnComServerToApplicationTimeout(
            browserToComServerTimeoutMS,
        );

        if (this.activeChannel) {
            return this.activeChannel.sendRequest(
                requestData,
                browserToComServerTimeoutMS,
                comServerToApplicationTimeoutSec,
            );
        }

        return this.getComServerStatus().then(() => {
            return this.activeChannel.sendRequest(
                requestData,
                browserToComServerTimeoutMS,
                comServerToApplicationTimeoutSec,
            );
        });
    }

    sendCommand(data: string, customTimeoutMS: number): Promise<any> {
        const browserToComServerTimeoutMS = validateAndReturnBrowserToComServerTimeout(customTimeoutMS);
        const comServerToApplicationTimeoutSec = shortenAndReturnComServerToApplicationTimeout(
            browserToComServerTimeoutMS,
        );

        if (this.activeChannel) {
            return this.activeChannel.sendCommand(data, browserToComServerTimeoutMS, comServerToApplicationTimeoutSec);
        }

        return this.getComServerStatus().then(() => {
            return this.activeChannel.sendCommand(data, browserToComServerTimeoutMS, comServerToApplicationTimeoutSec);
        });
    }
}

export default ComServerClient;
