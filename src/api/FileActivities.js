/**
 * @flow
 * @file Helper for the box File Activity API
 * @author Box
 */

import Base from './Base';
import { PERMISSION_CAN_COMMENT, PERMISSION_CAN_VIEW_ANNOTATIONS, ERROR_CODE_FETCH_ACTIVITY } from '../constants';
import type { BoxItemPermission } from '../common/types/core';
import type { ElementsXhrError } from '../common/types/api';
import type { FileActivity, FileActivityTypes } from '../common/types/feed';

// We only show the latest reply in the UI
const REPLY_LIMIT = 1;

const getFileActivityQueryParams = (fileID: string, activityTypes?: FileActivityTypes[] = []) => {
    const baseEndpoint = `/file_activities?file_id=${fileID}`;
    const hasActivityTypes = !!activityTypes && !!activityTypes.length;
    const enabledRepliesQueryParam = `&enable_replies=true&reply_limit=${REPLY_LIMIT}`;
    const activityTypeQueryParam = hasActivityTypes ? `&activity_types=${activityTypes.join()}` : '';

    return `${baseEndpoint}${activityTypeQueryParam}${enabledRepliesQueryParam}`;
};

class FileActivities extends Base {
    /**
     * API URL for filtered file activities
     *
     * @param {string} [id] - a box file id
     * @param {Array<FileActivityTypes>} activityTypes - optional. Array of File Activity types to filter by, returns all Activity Types if omitted.
     * @return {string} base url for files
     */
    getFilteredUrl(id: string, activityTypes?: FileActivityTypes[]): string {
        return `${this.getBaseApiUrl()}${getFileActivityQueryParams(id, activityTypes)}`;
    }

    /**
     * API for fetching file activities
     *
     * @param {Array<FileActivityTypes>} activityTypes - optional. Array of File Activity types to filter by, returns all Activity Types if omitted.
     * @param {Function} errorCallback - the error callback
     * @param {string} fileId - the file id
     * @param {BoxItemPermission} permissions - the permissions for the file
     * @param {number} repliesCount - number of replies to return, by default all replies are returned
     * @param {Function} successCallback - the success callback
     * @returns {void}
     */
    getActivities({
        activityTypes,
        errorCallback,
        fileID,
        permissions,
        repliesCount,
        successCallback,
    }: {
        activityTypes: FileActivityTypes[],
        errorCallback: (e: ElementsXhrError, code: string) => void,
        fileID: string,
        permissions: BoxItemPermission,
        repliesCount?: number,
        successCallback: (activity: FileActivity) => void,
    }): void {
        this.errorCode = ERROR_CODE_FETCH_ACTIVITY;
        try {
            if (!fileID) {
                throw new Error('Missing file id!');
            }

            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, fileID);
            this.checkApiCallValidity(PERMISSION_CAN_VIEW_ANNOTATIONS, permissions, fileID);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.get({
            id: fileID,
            successCallback,
            errorCallback,
            requestData: {
                ...(repliesCount ? { replies_count: repliesCount } : null),
            },
            url: this.getFilteredUrl(fileID, activityTypes),
        });
    }
}

export default FileActivities;
