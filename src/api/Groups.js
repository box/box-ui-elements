/**
 * @flow
 * @file Helper for the box Groups API
 * @author Box
 */

import OffsetBasedAPI from './OffsetBasedAPI';
import type { ElementsErrorCallback } from '../common/types/api';

class Groups extends OffsetBasedAPI {
    /**
     * API URL to get group count
     *
     * @param {string} id - a box group id
     * @return {number} total count of group
     */
    getUrlForGroupCount(id: string): string {
        return `${this.getBaseApiUrl()}/groups/${id}/memberships`;
    }

    /**
     * API for creating a comment on a file
     *
     * @param {string} id - Group id
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */

    getGroupCount({
        errorCallback,
        successCallback,
        group,
        file,
    }: {
        errorCallback: ElementsErrorCallback,
        file: { id: string },
        group: { id: string },
        successCallback: Function,
    }): Promise<{ total_count: number }> {
        const requestData = {
            data: { limit: 1 },
        };
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
                data: { ...requestData },
            }),
        );
    }
}

export default Groups;
