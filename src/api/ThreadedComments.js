/**
 * @flow
 * @file Helper for the box threadedComments API
 * @author Box
 */

import MarkerBasedApi from './MarkerBasedAPI';
import {
    PERMISSION_CAN_COMMENT,
    PERMISSION_CAN_DELETE,
    PERMISSION_CAN_EDIT,
    ERROR_CODE_CREATE_COMMENT,
    ERROR_CODE_UPDATE_COMMENT,
    ERROR_CODE_DELETE_COMMENT,
    ERROR_CODE_FETCH_COMMENT,
    ERROR_CODE_FETCH_COMMENTS,
    PERMISSION_CAN_RESOLVE,
    ERROR_CODE_FETCH_REPLIES,
    ERROR_CODE_CREATE_REPLY,
} from '../constants';
import { formatComment } from './utils';

import type { ElementsXhrError, ElementsErrorCallback } from '../common/types/api';
import type { BoxItem, BoxItemPermission } from '../common/types/core';
import type {
    BoxCommentPermission,
    Comment,
    FeedItemStatus,
    ThreadedComments as ThreadedCommentsType,
} from '../common/types/feed';

class ThreadedComments extends MarkerBasedApi {
    /**
     * API URL for comments
     *
     * @param {string} [fileId]
     * @return {string} base url for comments
     */
    getUrl(fileId?: string): string {
        return `${this.getBaseApiUrl()}/undoc/comments${fileId ? `?file_id=${fileId}` : ''}`;
    }

    /**
     * API URL for specific comment
     *
     * @param {string} [commentId]
     * @return {string} base url for specific comment
     */
    getUrlForId(commentId: string): string {
        return `${this.getUrl()}/${commentId}`;
    }

    /**
     * API URL for specific comment
     *
     * @param {string} commentId
     * @param {string} [fileId]
     * @return {string}  base url for specific comment replies
     */
    getUrlWithRepliesForId(commentId: string, fileId?: string): string {
        return `${this.getUrlForId(commentId)}/replies${fileId ? `?file_id=${fileId}` : ''}`;
    }

    /**
     * Formats the threaded comments api response to usable data
     * @param {Object} data the api response data
     */
    successHandler = (data: Object): void => {
        if (this.isDestroyed() || typeof this.successCallback !== 'function') {
            return;
        }

        // There is no response data when deleting a comment
        if (!data) {
            this.successCallback();
            return;
        }

        // We don't have entries when updating/creating a comment
        if (!data.entries) {
            this.successCallback(formatComment(data));
            return;
        }

        const comments = data.entries.map(formatComment);
        this.successCallback({ ...data, entries: comments });
    };

    /**
     * API for creating a comment on a file
     *
     * @param {BoxItem} file - File object for which we are creating a comment
     * @param {string} message - Comment message
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    createComment({
        file,
        message,
        successCallback,
        errorCallback,
    }: {
        errorCallback: ElementsErrorCallback,
        file: BoxItem,
        message?: string,
        successCallback: (comment: Comment) => void,
    }): void {
        this.errorCode = ERROR_CODE_CREATE_COMMENT;
        const { id, permissions } = file;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, id);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.post({
            id,
            url: this.getUrl(id),
            data: {
                data: { message },
            },
            successCallback,
            errorCallback,
        });
    }

    /**
     * API for updating a comment
     *
     * @param {string} fileId - File id for which we are updating a comment
     * @param {string} commentId - Comment to be edited
     * @param {FeedItemStatus} status - Comment status
     * @param {string} message - Comment message
     * @param {BoxCommentPermission} permissions - The known permissions of the comment we're updating
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    updateComment({
        fileId,
        commentId,
        status,
        message,
        permissions,
        successCallback,
        errorCallback,
    }: {
        commentId: string,
        errorCallback: ElementsErrorCallback,
        fileId: string,
        message?: string,
        permissions: BoxCommentPermission,
        status?: FeedItemStatus,
        successCallback: (comment: Comment) => void,
    }): void {
        this.errorCode = ERROR_CODE_UPDATE_COMMENT;

        if (message) {
            try {
                this.checkApiCallValidity(PERMISSION_CAN_EDIT, permissions, fileId);
            } catch (e) {
                errorCallback(e, this.errorCode);
                return;
            }
        }

        if (status) {
            try {
                this.checkApiCallValidity(PERMISSION_CAN_RESOLVE, permissions, fileId);
            } catch (e) {
                errorCallback(e, this.errorCode);
                return;
            }
        }

        const requestData = {
            data: { status, message },
        };

        this.put({
            id: fileId,
            url: this.getUrlForId(commentId),
            data: requestData,
            successCallback,
            errorCallback,
        });
    }

    /**
     * API for deleting a comment or reply
     *
     * @param {string} fileId - Id of an object for which we are deleting a comment
     * @param {string} commentId - Id of the comment we are deleting
     * @param {BoxCommentPermission} permissions - The known permissions of the comment we're deleting
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    deleteComment({
        fileId,
        commentId,
        permissions,
        successCallback,
        errorCallback,
    }: {
        commentId: string,
        errorCallback: ElementsErrorCallback,
        fileId: string,
        permissions: BoxCommentPermission,
        successCallback: Function,
    }): void {
        this.errorCode = ERROR_CODE_DELETE_COMMENT;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_DELETE, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.delete({
            id: fileId,
            url: this.getUrlForId(commentId),
            successCallback,
            errorCallback,
        });
    }

    /**
     * API for fetching comment
     *
     * @param {string} commentId - comment id
     * @param {string} fileId - the file id
     * @param {BoxItemPermission} permissions - the permissions for the file
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @returns {void}
     */
    getComment({
        commentId,
        errorCallback,
        fileId,
        permissions,
        successCallback,
    }: {
        commentId: string,
        errorCallback: (e: ElementsXhrError, code: string) => void,
        fileId: string,
        permissions: BoxItemPermission,
        successCallback: (comment: Comment) => void,
    }): void {
        this.errorCode = ERROR_CODE_FETCH_COMMENT;
        try {
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.get({
            id: fileId,
            errorCallback,
            successCallback,
            url: this.getUrlForId(commentId),
        });
    }

    /**
     * API for fetching comments
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
    getComments({
        fileId,
        permissions,
        successCallback,
        errorCallback,
        marker,
        limit,
        shouldFetchAll,
        repliesCount,
    }: {
        errorCallback: (e: ElementsXhrError, code: string) => void,
        fileId: string,
        limit?: number,
        marker?: string,
        permissions: BoxItemPermission,
        repliesCount?: number,
        shouldFetchAll?: boolean,
        successCallback: (threadedComments: ThreadedCommentsType) => void,
    }): void {
        this.errorCode = ERROR_CODE_FETCH_COMMENTS;
        try {
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.markerGet({
            id: fileId,
            successCallback,
            errorCallback,
            marker,
            limit,
            requestData: {
                ...(repliesCount ? { replies_count: repliesCount } : null),
            },
            shouldFetchAll,
        });
    }

    /**
     * @param {string} fileId - the file id
     * @param {string} commentId - id of a Comment
     * @param {BoxItemPermission} permissions - The known permissions of the comment
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     */
    getCommentReplies({
        fileId,
        commentId,
        permissions,
        successCallback,
        errorCallback,
    }: {
        commentId: string,
        errorCallback: (e: ElementsXhrError, code: string) => void,
        fileId: string,
        permissions: BoxItemPermission,
        successCallback: (comments: ThreadedCommentsType) => void,
    }): void {
        this.errorCode = ERROR_CODE_FETCH_REPLIES;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.get({
            id: fileId,
            errorCallback,
            successCallback,
            url: this.getUrlWithRepliesForId(commentId),
        });
    }

    /**
     * @param {string} fileId - the file id
     * @param {string} commentId - id of a Comment for which we createing Reply
     * @param {BoxItemPermission} permissions - The known permissions of the comment
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @param {string} message - message of the Reply
     */
    createCommentReply({
        fileId,
        commentId,
        permissions,
        successCallback,
        errorCallback,
        message,
    }: {
        commentId: string,
        errorCallback: (e: ElementsXhrError, code: string) => void,
        fileId: string,
        message: string,
        permissions: BoxItemPermission,
        successCallback: (comment: Comment) => void,
    }): void {
        this.errorCode = ERROR_CODE_CREATE_REPLY;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.post({
            id: fileId,
            data: { data: { message } },
            errorCallback,
            successCallback,
            url: this.getUrlWithRepliesForId(commentId, fileId),
        });
    }
}

export default ThreadedComments;
