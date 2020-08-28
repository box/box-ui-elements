/**
 * @flow
 * @file Helper for the Box Enterprise Groups API
 * @author Box
 */
import MarkerBasedAPI from './MarkerBasedAPI';
import { DEFAULT_MAX_COLLABORATORS, ERROR_CODE_FETCH_ENTERPRISE_GROUPS } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';

class Groups extends MarkerBasedAPI {
    /**
     * API URL for fetching all groups in the current user's enterprise
     *
     * @param {string} [filterTerm] Optional filter for enterprise groups
     * @returns {string} URL for fetching enterprise groups
     */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/groups`;
    }

    /**
     * API for fetching all groups in the current user's enterprise
     *
     * @param {string} id - Box item ID
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @param {string} [filterTerm] - Optional filter for the groups
     * @param {Object} [requestData] - Opitional additional request data
     * @returns {void}
     */
    getGroupsInEnterprise(
        id: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        requestData: ?Object,
        limit: number = DEFAULT_MAX_COLLABORATORS,
    ): void {
        this.errorCode = ERROR_CODE_FETCH_ENTERPRISE_GROUPS;

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

export default Groups;
