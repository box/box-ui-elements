/**
 * @flow
 * @file Helper for the box Groups API
 * @author Box
 */
import noop from 'lodash/noop';
import queryString from 'query-string';
import Base from './Base';
import { ERROR_CODE_FETCH_ENTERPRISE_GROUPS } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';

class Groups extends Base {
    /**
     * API URL to get group count
     *
     * @param {string} id a box group ID
     * @return {string} formatted URL for retrieving the membership information
     */
    getUrlForGroupCount(id: string): string {
        return `${this.getBaseApiUrl()}/groups/${id}/memberships`;
    }

    /**
     * API URL for fetching all groups in the current user's enterprise
     *
     * @param {string} [filterTerm] Optional filter for enterprise groups
     * @returns {string} URL for fetching enterprise groups
     */
    getGroupsInEnterpriseUrl(filterTerm: ?string): string {
        let url = `${this.getBaseApiUrl()}/groups`;

        if (filterTerm) {
            const enterpriseGroupsQuery = queryString.stringify({ filter_term: filterTerm });
            url = `${url}?${enterpriseGroupsQuery}`;
        }

        return url;
    }

    /**
     * API for creating a comment on a file
     *
     * @param {string} id a box group ID
     * @param {Function} [successCallback] callback for handling a valid server response
     * @param {Function} [errorCallback] handle errors raised by backend or connection errors
     * @return {Promise<{}>} Promise which resolves with the payload, including the total_count
     */
    getGroupCount({
        errorCallback = noop,
        successCallback = noop,
        group,
        file,
    }: {
        errorCallback?: ElementsErrorCallback,
        file: { id: string },
        group: { id: string },
        successCallback?: Function,
    }): Promise<{ total_count: number }> {
        return new Promise((resolve, reject) =>
            this.get({
                id: file.id,
                url: this.getUrlForGroupCount(group.id),
                successCallback: (...args) => {
                    successCallback(...args);
                    resolve(...args);
                },
                errorCallback: (...args) => {
                    errorCallback(...args);
                    reject();
                },
                requestData: { params: { limit: 1 } },
            }),
        );
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
        filterTerm: ?string,
        requestData: ?Object,
    ): void {
        this.errorCode = ERROR_CODE_FETCH_ENTERPRISE_GROUPS;
        this.get({
            id,
            successCallback,
            errorCallback,
            url: this.getGroupsInEnterpriseUrl(filterTerm),
            requestData,
        });
    }
}

export default Groups;
