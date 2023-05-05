/**
 * @flow
 * @file Helper for the box File Activity API
 * @author Box
 */

import isString from 'lodash/isString';
import Base from './Base';
import {
    PERMISSION_CAN_COMMENT,
    PERMISSION_CAN_VIEW_ANNOTATIONS,
    ERROR_CODE_FETCH_ACTIVITY,
    FILE_ACTIVITY_TYPE_TASK,
    FILE_ACTIVITY_TYPE_COMMENT,
} from '../constants';
import type { BoxItemPermission } from '../common/types/core';
import type { ElementsXhrError } from '../common/types/api';
import type { FileActivity, FileActivityTypes } from '../common/types/feed';

export const parseFileActivitiesResponseForFeed = (data?: FileActivity[]) => {
    if (!data || !data.length) {
        return [];
    }

    const parsedData = [];

    data.map(item => {
        if (item.source) {
            // UAA follows a lowercased enum naming convention, convert to uppercase to align with task api
            const taskItem = item.source[FILE_ACTIVITY_TYPE_TASK];
            const commentItem = item.source[FILE_ACTIVITY_TYPE_COMMENT];
            if (taskItem) {
                if (!!taskItem.assigned_to && !!taskItem.assigned_to.entries) {
                    taskItem.assigned_to.entries.map(entry => {
                        entry.role = entry.role.toUpperCase();
                        entry.status = entry.status.toUpperCase();

                        return entry;
                    });
                }
                if (taskItem.completion_rule && isString(taskItem.completion_rule)) {
                    taskItem.completion_rule = taskItem.completion_rule.toUpperCase();
                }
                if (taskItem.status && isString(taskItem.status)) {
                    taskItem.status = taskItem.status.toUpperCase();
                }
                if (taskItem.task_type && isString(taskItem.task_type)) {
                    taskItem.task_type = taskItem.task_type.toUpperCase();
                }

                taskItem.created_by = {
                    target: taskItem.created_by,
                };
            } else if (commentItem) {
                commentItem.tagged_message = commentItem.tagged_message || commentItem.message;

                if (commentItem.replies) {
                    commentItem.replies.map(reply => {
                        reply.tagged_message = reply.tagged_message || reply.message || '';

                        return reply;
                    });
                }
            }

            parsedData.push(...Object.values(item.source));
        }

        return item;
    });

    return { entries: parsedData };
};

const getFileActivityQueryParams = (
    fileID: string,
    activityTypes?: FileActivityTypes[],
    enableReplies?: boolean = true,
) => {
    const baseEndpoint = `/file_activities?file_id=${fileID}`;

    return `${baseEndpoint}${
        !!activityTypes && !!activityTypes.length ? `&activity_types=${activityTypes.join()}` : ''
    }${enableReplies ? '&enable_replies=true&reply_limit=1' : ''}`;
};

class FileActivities extends Base {
    /**
     * API URL for file activities
     *
     * @param {string} [id] - a box file id
     * @return {string} base url for files
     */
    getUrl(id?: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }

        return `${this.getBaseApiUrl()}${getFileActivityQueryParams(id, undefined, true)}`;
    }

    /**
     * API URL for filtered file activities
     *
     * @param {string} [id] - a box file id
     * @return {string} base url for files
     */
    getFilteredUrl(id?: string, activityTypes?: FileActivityTypes[]): string {
        if (!id) {
            throw new Error('Missing file id!');
        }

        return `${this.getBaseApiUrl()}${getFileActivityQueryParams(id, activityTypes, true)}`;
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
        activityTypes: FileActivityTypes[],
        errorCallback: (e: ElementsXhrError, code: string) => void,
        fileId: string,
        permissions: BoxItemPermission,
        repliesCount?: number,
        successCallback: (activity: FileActivity) => void,
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
            url: this.getFilteredUrl(fileId, activityTypes),
        });
    }
}

export default FileActivities;
