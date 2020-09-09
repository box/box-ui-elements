/**
 * @flow
 * @file Marker-based helper for the Box Users API
 * @author Box
 */

import MarkerBasedApi from './MarkerBasedAPI';
import { DEFAULT_MAX_CONTACTS, ERROR_CODE_FETCH_ENTERPRISE_USERS } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';

class MarkerBasedUsers extends MarkerBasedApi {
    /**
     * API URL for fetching all users who are visible to the current user
     *
     * @returns {string} URL for fetching users
     */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/users`;
    }

    /**
     * API for fetching all users in the current user's enterprise
     *
     * @param {string} id - Box item ID
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @param {Object} [requestData] - Opitional additional request data
     * @param {Object} [limit] - Max number of groups to return
     * @returns {void}
     */
    getUsersInEnterprise(
        id: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        requestData: ?Object,
        limit: number = DEFAULT_MAX_CONTACTS,
    ): void {
        this.errorCode = ERROR_CODE_FETCH_ENTERPRISE_USERS;
        this.markerGet({
            id,
            limit,
            successCallback,
            errorCallback,
            requestData: {
                usemarker: true,
                ...requestData,
            },
            shouldFetchAll: false,
        });
    }
}

export default MarkerBasedUsers;
