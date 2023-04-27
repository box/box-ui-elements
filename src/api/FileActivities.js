/**
 * @flow
 * @file Helper for the box UAA API
 * @author Box
 */

import Base from './Base';
import { PERMISSION_CAN_COMMENT, PERMISSION_CAN_VIEW_ANNOTATIONS, ERROR_CODE_FETCH_ACTIVITY } from '../constants';
import { getUAAQueryParams } from './utils';
import type { UAAFileActivity } from '../common/types/feed';

class FileActivities extends Base {
    /**
     * API URL for file activities
     *
     * @param {string} [id] - a box file id
     * @return {string} base url for files
     */
    getUrl(id?: string, activityTypes: string[]): string {
        if (!id) {
            throw new Error('Missing file id!');
        }

        return `${this.getBaseApiUrl()}${getUAAQueryParams(id, activityTypes, true)}`;
    }

    /**
     * API for fetching file activities
     *
     * @param {string} fileId - the file id
     * @param {BoxItemPermission} permissions - the permissions for the file
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @param {array} fields - the fields to fetch
     * @param {string} marker the marker from the start to start fetching at
     * @param {number} limit - the number of items to fetch
     * @param {boolean} shouldFetchAll - true if should get all the pages before calling the sucessCallback
     * @param {number} repliesCount - number of replies to return, by deafult all replies all returned
     *  @returns {void}
     */
    getActivities({
        activityTypes,
        errorCallback,
        fileId,
        permissions,
        repliesCount,
        successCallback,
    }: {
        activityTypes: UAAActivityTypes[],
        errorCallback: (e: ElementsXhrError, code: string) => void,
        fileId: string,
        permissions: BoxItemPermission,
        repliesCount?: number,
        successCallback: (activity: UAAFileActivity) => void,
    }): void {
        this.errorCode = ERROR_CODE_FETCH_ACTIVITY;
        try {
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, fileId);
            this.checkApiCallValidity(PERMISSION_CAN_VIEW_ANNOTATIONS, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.get({
            id: fileId,
            successCallback,
            errorCallback,
            requestData: {
                ...(repliesCount ? { replies_count: repliesCount } : null),
            },
            url: this.getUrl(fileId, activityTypes),
        });
    }
}

export default FileActivities;
