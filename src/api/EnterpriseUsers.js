/**
 * @flow
 * @file Helper for the Box Enterprise Users API
 * @author Box
 */

import MarkerBasedApi from './MarkerBasedAPI';
import { DEFAULT_MAX_COLLABORATORS, ERROR_CODE_FETCH_ENTERPRISE_USERS } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';

class EnterpriseUsers extends MarkerBasedApi {
    /**
     * API URL for fetching all users in the current user's enterprise
     *
     * @param {string} [filterTerm] Optional filter for enterprise users
     * @returns {string} URL for fetching enterprise users
     */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/users`;
    }

    // ({ entries: Array<Collaboration>, next_marker: ?string }) => void
    /**
     * API for fetching all users in the current user's enterprise
     *
     * @param {string} id - Box item ID
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @param {string} [filterTerm] - Optional filter for the users
     * @returns {void}
     */
    getUsersInEnterprise(
        id: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        requestData: ?Object,
        limit: number = DEFAULT_MAX_COLLABORATORS,
    ): void {
        this.errorCode = ERROR_CODE_FETCH_ENTERPRISE_USERS;
        this.markerGet({
            id,
            limit,
            successCallback,
            errorCallback,
            requestData,
            shouldFetchAll: false,
        });
    }
}

export default EnterpriseUsers;
