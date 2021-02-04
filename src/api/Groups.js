/**
 * @flow
 * @file Helper for the box Groups API
 * @author Box
 */
import noop from 'lodash/noop';
import Base from './Base';
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
}

export default Groups;
