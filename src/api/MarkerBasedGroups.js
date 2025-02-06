/**
 * @flow
 * @file Marker-based helper for the Box Groups API
 * @author Box
 */
import MarkerBasedAPI from './MarkerBasedAPI';
import { DEFAULT_MAX_CONTACTS, ERROR_CODE_FETCH_ENTERPRISE_GROUPS } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';

class MarkerBasedGroups extends MarkerBasedAPI {
    /**
     * API URL for fetching all groups that are visible to the current user
     *
     * @returns {string} URL for fetching groups
     */
    getUrl(): string {
        return `/api/groups`;
    }

    /**
     * API for fetching all groups in the current user's enterprise
     *
     * @param {string} id - Box item ID
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @param {Object} [requestData] - Opitional additional request data
     * @param {Object} [limit] - Max number of groups to return
     * @returns {void}
     */
    getGroupsInEnterprise(
        id: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        requestData: ?Object,
        limit: number = DEFAULT_MAX_CONTACTS,
    ): void {
        this.errorCode = ERROR_CODE_FETCH_ENTERPRISE_GROUPS;

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

export default MarkerBasedGroups;
