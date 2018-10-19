/**
 * @flow
 * @file Multiput upload base class
 * @author Box
 */
import BaseUpload from './BaseUpload';

const DEFAULT_MULTIPUT_CONFIG: MultiputConfig = {
    digestReadahead: 5, // How many parts past those currently uploading to precompute digest for
    initialRetryDelayMs: 5000, // Base for exponential backoff on retries
    maxRetryDelayMs: 60000, // Upper bound for time between retries
    parallelism: 5, // Maximum number of parts to upload at a time
    requestTimeoutMs: 120000, // Idle timeout on part upload, overall request timeout on other requests
    // eslint-disable-next-line max-len
    retries: 5, // How many times to retry requests such as upload part or commit. Note that total number of attempts will be retries + 1 in worst case where all attempts fail.
};

class BaseMultiput extends BaseUpload {
    config: MultiputConfig;

    sessionEndpoints: Object;

    /**
     * [constructor]
     *
     * @param {Options} options
     * @param {Object} sessionEndpoints
     * @param {MultiputConfig} [config]
     * @return {void}
     */
    constructor(
        options: Options,
        sessionEndpoints: Object,
        config?: MultiputConfig,
    ): void {
        super(options);

        this.config = config || DEFAULT_MULTIPUT_CONFIG;
        this.sessionEndpoints = sessionEndpoints;
    }

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
            event_info?: string,
        } = {
            event_type: eventType,
        };

        if (eventInfo) {
            data.event_info = eventInfo;
        }

        return this.xhr.post({
            url: this.sessionEndpoints.logEvent,
            data,
        });
    };
}

export default BaseMultiput;
