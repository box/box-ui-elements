/**
 * @flow
 * @file Helper for Box uploads reachability test
 * @author Box
 */

import Base from '../Base';
import LocalStore from '../../util/LocalStore';
import { DEFAULT_HOSTNAME_UPLOAD } from '../../constants';
import '../../util/regenerator-runtime';

const CACHED_RESULTS_LOCAL_STORE_KEY = 'uploads-reachability-cached-results';

class UploadsReachability extends Base {
    localStore: LocalStore;

    /**
     * [constructor]
     *
     * @param {Object} [options]
     * @param {string} [options.token] - Auth token
     * @param {string} [options.uploadHost] - Upload host name
     * @return {void}
     */
    constructor(options: Object) {
        super(options);
        this.localStore = new LocalStore();
    }

    /**
     * Gets a reachable host for upload
     */
    async getReachableUploadHost() {
        const cachedResults = this.localStore.getItem(CACHED_RESULTS_LOCAL_STORE_KEY) || {};
        // Check if reachability for host is cached in local storage
        if (this.uploadHost in cachedResults) {
            return cachedResults[this.uploadHost] ? this.uploadHost : DEFAULT_HOSTNAME_UPLOAD;
        }
        const isReachable = await this.isUploadHostReachable();
        cachedResults[this.uploadHost] = isReachable;
        this.localStore.setItem(CACHED_RESULTS_LOCAL_STORE_KEY, cachedResults);
        // If the custom host is not reachable, return default upload host
        return isReachable ? this.uploadHost : DEFAULT_HOSTNAME_UPLOAD;
    }

    /**
     * Checks if a host is reachable
     */
    async isUploadHostReachable() {
        const customUploadHost = await this.getUploadHost();
        // the default upload host is always reachable
        if (customUploadHost === DEFAULT_HOSTNAME_UPLOAD) {
            return true;
        }

        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${customUploadHost}/reachability-test-foo`, false);
        try {
            xhr.send();
        } catch (error) {
            return false;
        }
        // as long as no exceptions were thrown when making the request, the host is reachable
        return true;
    }

    /**
     * Get upload host name from the preflight request response
     */
    async getUploadHost() {
        if (this.uploadHost === DEFAULT_HOSTNAME_UPLOAD) {
            return DEFAULT_HOSTNAME_UPLOAD;
        }

        const preflightResponse = await this.xhr.options({
            url: `${this.getBaseUrl()}/files/content`,
            data: {
                name: 'test_name',
                parent: { id: '0' },
                size: '10'
            },
            successHandler: () => {},
            errorHandler: () => {}
        });

        if (preflightResponse) {
            const { upload_url: uploadUrl } = preflightResponse;

            const splitUrl = uploadUrl.split('/');
            return `${splitUrl[0]}//${splitUrl[2]}`;
        }

        return DEFAULT_HOSTNAME_UPLOAD;
    }
}

export default UploadsReachability;
