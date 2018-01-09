/**
 * @flow
 * @file Helper for Box uploads reachability test
 * @author Box
 */

import LocalStore from '../../util/LocalStore';
import { DEFAULT_HOSTNAME_UPLOAD } from '../../constants';
import Xhr from '../../util/Xhr';
import type { Token } from '../../flowTypes';

const CACHED_RESULTS_LOCAL_STORE_KEY = 'bcu-uploads-reachability-cached-results';

class UploadsReachability {
    apiHost: string;
    baseUrl: string;
    localStore: LocalStore;
    xhr: Xhr;

    /**
     * [constructor]
     *
     * @param {Token} token - Auth token
     * @param {string} apiHost - Api host
     * @return {void}
     */
    constructor(token: Token, apiHost: string) {
        this.xhr = new Xhr({
            // `id` is required for the preflight request, here it's set to `folder_0` because
            // the preflight request is for checking the availability of a host, not about a specific
            // upload attempt
            id: 'folder_0',
            token
        });

        const suffix: string = apiHost.endsWith('/') ? '2.0' : '/2.0';
        this.baseUrl = `${apiHost}${suffix}`;
        this.localStore = new LocalStore();
    }

    /**
     * Gets a reachable host for upload
     *
     * @return {Promise}
     */
    async getReachableUploadHost() {
        const uploadHost = await this.getUploadHost();
        // The default upload host is always reachable
        if (uploadHost === DEFAULT_HOSTNAME_UPLOAD) {
            return uploadHost;
        }

        const cachedHostReachability = this.localStore.getItem(CACHED_RESULTS_LOCAL_STORE_KEY) || {};
        // Check if reachability for host is cached in local storage
        if (uploadHost in cachedHostReachability) {
            return cachedHostReachability[uploadHost] ? uploadHost : DEFAULT_HOSTNAME_UPLOAD;
        }

        const isReachable = await this.isUploadHostReachable(uploadHost);

        // Update the host reachability in local store
        cachedHostReachability[uploadHost] = isReachable;
        this.localStore.setItem(CACHED_RESULTS_LOCAL_STORE_KEY, cachedHostReachability);

        // If the custom host is not reachable, return default upload host
        return isReachable ? uploadHost : DEFAULT_HOSTNAME_UPLOAD;
    }

    /**
     * Checks if a host is reachable
     *
     * @private
     * @param {string} uploadHost
     * @return {Promise}
     */
    async isUploadHostReachable(uploadHost: string) {
        // The default upload host is always reachable
        if (uploadHost === DEFAULT_HOSTNAME_UPLOAD) {
            return true;
        }

        try {
            await window.fetch(`${uploadHost}/api/2.0/files/upload_sessions/0`);
        } catch (error) {
            return false;
        }

        // As long as no exceptions were thrown when making the request, the host is reachable
        return true;
    }

    /**
     * Get upload host name from the preflight request response
     *
     * @private
     * @return {Promise}
     */
    async getUploadHost() {
        let preflightResponse;

        await this.xhr.options({
            url: `${this.baseUrl}/files/content`,
            // Random data for preflight check
            data: {
                name: 'test_name',
                parent: {
                    id: '0'
                },
                size: '10'
            },
            successHandler: (response) => {
                preflightResponse = response;
            },
            errorHandler: () => {}
        });

        return this.handlePreflightResponse(preflightResponse);
    }

    /**
     * Resolves preflight response to a reachable upload host
     *
     * @private
     * @param {?Object} response
     * @return {string}
     */
    handlePreflightResponse(response?: Object) {
        if (!response) {
            return DEFAULT_HOSTNAME_UPLOAD;
        }

        const { upload_url } = response;

        const splitUrl = upload_url.split('/');
        return `${splitUrl[0]}//${splitUrl[2]}`;
    }
}

export default UploadsReachability;
