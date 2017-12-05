/**
 * @flow
 * @file Multiput upload base class
 * @author Box
 */
import Base from '../Base';
import type { MultiputConfig } from '../../flowTypes';

const DEFAULT_MULTIPUT_CONFIG: MultiputConfig = {
    console: false, // Whether to display informational messages to console
    digestReadahead: 5, // How many parts past those currently uploading to precompute digest for
    initialRetryDelayMs: 5000, // Base for exponential backoff on retries
    maxRetryDelayMs: 60000, // Upper bound for time between retries
    parallelism: 5, // Maximum number of parts to upload at a time
    requestTimeoutMS: 120000, // Idle timeout on part upload, overall request timeout on other requests
    // eslint-disable-next-line max-len
    retries: 5 // How many times to retry requests such as upload part or commit. Note that total number of attempts will be retries + 1 in worst case where all attempts fail.
};

class BaseMultiput extends Base {
    config: MultiputConfig;
    sessionEndpoints: Object;

    /**
     * [constructor]
     *
     * @param {Object} options
     * @param {Object} sessionEndpoints
     * @param {MultiputConfig} [config]
     * @return {void}
     */
    constructor(options: Object, sessionEndpoints: Object, config?: MultiputConfig): void {
        super(options);

        this.config = config || DEFAULT_MULTIPUT_CONFIG;
        this.sessionEndpoints = sessionEndpoints;
    }

    /**
     * If console logging is enabled in config, log a message to console
     * 
     * @private
     * @param {string} msg
     * @return {void}
     */
    consoleLog = (msg: string): void => {
        if (this.config.console && window.console) {
            // eslint-disable-next-line no-console
            console.log(`${new Date().toString()} ${msg}`);
        }
    };

    /**
     * If console logging is enabled in config, call passed in function to generate a message and log it
     * to console.
     * 
     * @private
     * @param {function} msgFunc
     * @return {void}
     */
    consoleLogFunc = (msgFunc: Function): void => {
        if (this.config.console && window.console) {
            this.consoleLog(msgFunc());
        }
    };

    /**
     * POST log event
     * 
     * @param {string} eventType
     * @param {string} [eventInfo]
     * @return {Promise}
     */
    logEvent = (eventType: string, eventInfo?: string) => {
        const data: {
            event_type: string,
            event_info?: string
        } = {
            event_type: eventType
        };

        if (eventInfo) {
            data.event_info = eventInfo;
        }

        return this.xhr.post({
            url: this.sessionEndpoints.logEvent,
            data
        });
    };
}

export default BaseMultiput;
