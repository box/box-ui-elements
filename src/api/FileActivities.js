/**
 * @flow
 * @file Helper for the box File Activity API
 * @author Box
 */

import Base from './Base';
import {
    ERROR_CODE_FETCH_ACTIVITY,
    FILE_ACTIVITY_TYPE_ANNOTATION,
    FILE_ACTIVITY_TYPE_COMMENT,
    PERMISSION_CAN_COMMENT,
    PERMISSION_CAN_VIEW_ANNOTATIONS,
} from '../constants';
import type { BoxItemPermission } from '../common/types/core';
import type { ElementsXhrError } from '../common/types/api';
import type { FileActivity, FileActivityTypes } from '../common/types/feed';

// We only show the latest reply in the UI
const REPLY_LIMIT = 1;

const getFileActivityQueryParams = (
    fileID: string,
    activityTypes?: FileActivityTypes[] = [],
    shouldShowReplies?: boolean = false,
) => {
    const baseEndpoint = `/file_activities?file_id=${fileID}`;
    const hasActivityTypes = !!activityTypes && !!activityTypes.length;
    const enableReplies = shouldShowReplies ? 'true' : 'false';
    const enabledRepliesQueryParam = `&enable_replies=${enableReplies}&reply_limit=${REPLY_LIMIT}`;
    const activityTypeQueryParam = hasActivityTypes ? `&activity_types=${activityTypes.join()}` : '';

    return `${baseEndpoint}${activityTypeQueryParam}${enabledRepliesQueryParam}`;
};

class FileActivities extends Base {
    /**
     * API URL for filtered file activities
     *
     * @param {string} [id] - a box file id
     * @param {Array<FileActivityTypes>} activityTypes - optional. Array of File Activity types to filter by, returns all Activity Types if omitted.
     * @param {boolean} shouldShowReplies - optional. Specify if replies should be included in the response
     * @return {string} base url for files
     */
    getFilteredUrl(id: string, activityTypes?: FileActivityTypes[], shouldShowReplies?: boolean): string {
        return `${this.getBaseApiUrl()}${getFileActivityQueryParams(id, activityTypes, shouldShowReplies)}`;
    }

    /**
     * API for fetching file activities
     *
     * @param {Array<FileActivityTypes>} activityTypes - optional. Array of File Activity types to filter by, returns all Activity Types if omitted.
     * @param {Function} errorCallback - the error callback
     * @param {string} fileId - the file id
     * @param {BoxItemPermission} permissions - the permissions for the file
     * @param {number} repliesCount - number of replies to return, by default all replies are returned
     * @param {boolean} shouldShowReplies - specify if replies should be included in the response
     * @param {Function} successCallback - the success callback
     * @returns {void}
     */
    getActivities({
        activityTypes,
        errorCallback,
        fileID,
        permissions,
        repliesCount,
        shouldShowReplies,
        successCallback,
    }: {
        activityTypes: FileActivityTypes[],
        errorCallback: (e: ElementsXhrError, code: string) => void,
        fileID: string,
        permissions: BoxItemPermission,
        repliesCount?: number,
        shouldShowReplies?: boolean,
        successCallback: (activity: FileActivity) => void,
    }): void {
        this.errorCode = ERROR_CODE_FETCH_ACTIVITY;
        try {
            if (!fileID) {
                throw new Error('Missing file id!');
            }

            if (activityTypes.includes(FILE_ACTIVITY_TYPE_COMMENT)) {
                this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, fileID);
            }
            if (activityTypes.includes(FILE_ACTIVITY_TYPE_ANNOTATION)) {
                this.checkApiCallValidity(PERMISSION_CAN_VIEW_ANNOTATIONS, permissions, fileID);
            }
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
            url: this.getFilteredUrl(fileID, activityTypes, shouldShowReplies),
        });
    }
}

export default FileActivities;
