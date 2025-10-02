/**
 * @flow
 * @file Helper for Box uploads reachability test
 * @author Box
 */

import axios from 'axios';
import LocalStore from '../../utils/LocalStore';
import { DEFAULT_HOSTNAME_UPLOAD, DEFAULT_HOSTNAME_UPLOAD_APP, HEADER_CONTENT_TYPE } from '../../constants';
import type { StringAnyMap, StringMixedMap } from '../../common/types/core';

const CACHED_RESULTS_LOCAL_STORE_KEY = 'bcu-uploads-reachability-cached-results';

type CachedResult = {
    expirationTimestampMS: number,
    isReachable: boolean,
};

class UploadsReachability {
    localStore: LocalStore;

    cachedResults: { string: CachedResult };

    /**
     * [constructor]
     */
    constructor() {
        this.localStore = new LocalStore();
        this.cachedResults = {};

        // Populate cachedResults with valid values from the local store, and then save the new
        // cachedResults back to local store.
        // This cleanup of invalid entries is not strictly necessary to maintain correctness,
        // but if we don't do this cleanup results may accumulate in local storage forever.
        this.populateCachedResultsWithValidLocalStoreValues();
        this.saveCachedResultsToLocalStore();
    }

    /**
     * Returns existing reachability results from local store
     *
     * @private
     * @return {?Object} The results, or null if there was a problem reading the value from local store
     */
    getCachedResultsFromLocalStore() {
        return this.localStore.getItem(CACHED_RESULTS_LOCAL_STORE_KEY);
    }

    /**
     * Saves the cachedResults variable as a JSON string in local store.
     *
     * @private
     * @return {void}
     */
    saveCachedResultsToLocalStore() {
        this.localStore.setItem(CACHED_RESULTS_LOCAL_STORE_KEY, this.cachedResults);
    }

    /**
     * Returns true if the given cached result is still valid (i.e. it has not expired yet)
     *
     * @private
     * @param {StringAnyMap} result - A result object for one host
     * @return {boolean} Whether or not the result is valid
     */
    isCachedHostValid(result: StringAnyMap) {
        return result.expirationTimestampMS > Date.now();
    }

    /**
     * Returns the cached result for the given uploadHost
     *
     * @private
     * @param {string} uploadHost - The host URL
     * @return {null|StringAnyMap} The result object or null if there isn't one
     */
    getCachedResult(uploadHost: string) {
        if (uploadHost in this.cachedResults) {
            const result = this.cachedResults[uploadHost];
            if (this.isCachedHostValid(result)) {
                return result;
            }
        }

        return null;
    }

    /**
     * Updates a cached result. Changes both the in-memory cachedResult variable and what's stored in local store
     *
     * @private
     * @param {string} uploadHost - The host URL that was tested
     * @param {boolean} isHostReachable - Whether or not the host was reachable
     * @return {void}
     */
    updateCachedResult(uploadHost: string, isHostReachable: boolean) {
        this.cachedResults[uploadHost] = {
            isReachable: isHostReachable,
            expirationTimestampMS: Date.now() + 1000 * 86400,
        };
        this.saveCachedResultsToLocalStore();
    }

    /**
     * Adds to the cachedResults object with valid entries from local storage
     *
     * @private
     * @return {void}
     */
    populateCachedResultsWithValidLocalStoreValues() {
        const localStoreResults = this.getCachedResultsFromLocalStore();
        if (!localStoreResults) {
            return;
        }

        Object.keys(localStoreResults).forEach(uploadHost => {
            const result = localStoreResults[uploadHost];
            if (this.isCachedHostValid(result)) {
                this.cachedResults[uploadHost] = result;
            }
        });
    }

    /**
     * Returns the host URLs that, according to the cached reachability test results, are unreachable
     *
     * @return {Array} The unreachable host URLs
     */
    getUnreachableHostsUrls() {
        const unreachableHosts = [];
        if (!this.cachedResults) {
            return unreachableHosts;
        }

        Object.keys(this.cachedResults).forEach(uploadHost => {
            const value = this.cachedResults[uploadHost];
            if (this.isCachedHostValid(value) && !value.isReachable) {
                unreachableHosts.push(uploadHost);
            }
        });

        return unreachableHosts;
    }

    /**
     * Determines whether the given host is reachable by either making a test request to the uploadHost
     * or returning the result of the last reachability test it did
     *
     * @param {string} uploadHost - The upload host URL that will be stored in the cached test result and returned in
     * getUnreachableHostsUrls() if test fails (this is usually a prefix of the uploadUrl)
     * @return {Promise<boolean>} Promise that resolved to true if the host is reachable, false if it is not
     */
    async isReachable(uploadHost: string) {
        // The default upload host should always reachable
        if (uploadHost === `${DEFAULT_HOSTNAME_UPLOAD}/` || uploadHost === `${DEFAULT_HOSTNAME_UPLOAD_APP}/`) {
            return true;
        }

        const cachedResult = this.getCachedResult(uploadHost);
        if (cachedResult) {
            return cachedResult.isReachable;
        }

        const isHostReachable = await this.makeReachabilityRequest(uploadHost);
        this.updateCachedResult(uploadHost, isHostReachable);
        return isHostReachable;
    }

    /**
     * Determines if the given uploadHost is reachable by making a test upload request to it.
     * Does not read or modify any cached results.
     *
     * @param {string} uploadHost - The upload host url to make a test request against
     * @return {Promise<boolean>}
     */
    async makeReachabilityRequest(uploadHost: string) {
        const url = `${uploadHost}html5?reachability_test=run`;
        const headers: StringMixedMap = {
            [HEADER_CONTENT_TYPE]: 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-File-Name': 'reachability_pseudofile.txt',
            'X-File-Size': '1234',
        };
        const data = 'reachability_file=test_file_data';

        try {
            await axios.post(url, data, { headers });
        } catch (error) {
            return false;
        }

        return true;
    }
}

export default UploadsReachability;
