/**
 * @flow
 * @file Helper for Box uploads reachability test
 * @author Box
 */

import 'regenerator-runtime/runtime';

import Base from '../Base';
import LocalStore from '../../util/LocalStore';
import { DEFAULT_HOSTNAME_UPLOAD } from '../../constants';

const CACHED_RESULTS_LOCAL_STORE_KEY = 'uploads-reachability-cached-results';

class UploadsReachability extends Base {
    localStore: LocalStore;

    /**
     * [constructor]
     *
     * @param {Object} [options]
     * @param {string} [options.token] - Auth token
     * @param {string} [options.apiHost] - Api host
     * @return {void}
     */
    constructor(options: Object) {
        super({
            id: 'folder_0',
            ...options
        });
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
            await fetch(`${uploadHost}/reachability-test-foo`);
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
            url: `${this.getBaseUrl()}/files/content`,
            data: {
                name: 'test_name',
                parent: { id: '0' },
                size: '10'
            },
            successHandler: (response) => {
                preflightResponse = response;
            },
            errorHandler: () => {}
        });

        if (preflightResponse) {
            const { upload_url } = preflightResponse;

            const splitUrl = upload_url.split('/');
            return `${splitUrl[0]}//${splitUrl[2]}`;
        }

        return DEFAULT_HOSTNAME_UPLOAD;
    }
}

export default UploadsReachability;
