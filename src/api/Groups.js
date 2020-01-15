/**
 * @flow
 * @file Helper for the box Groups API
 * @author Box
 */

import OffsetBasedAPI from './OffsetBasedAPI';
import { ERROR_CODE_GROUP_COUNT } from '../constants';
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
    }): Promise<any> {
        this.errorCode = ERROR_CODE_GROUP_COUNT;
        const requestData = {
            data: { limit: 1 },
        };
        return this.get({
            id: file.id,
            url: this.getUrlForGroupCount(group.id),
            successCallback,
            errorCallback,
            data: { ...requestData },
        });
    }
}

export default Groups;
