/**
 * @flow
 * @file Helper for the box comments API
 * @author Box
 */

import OffsetBasedAPI from './OffsetBasedAPI';
import { PERMISSION_CAN_COMMENT, PERMISSION_CAN_DELETE, PERMISSION_CAN_EDIT } from '../constants';

class Comments extends OffsetBasedAPI {
    /**
     * API URL for comments on a file
     *
     * @param {string} id - A box file id
     * @return {string} base url for files
     */
    getUrl(id?: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }
        return `${this.getBaseApiUrl()}/files/${id}/comments`;
    }

    /**
     * API URL for comments endpoint
     *
     * @param {string} [id] - A box comment id
     * @return {string} base url for comments
     */
    commentsUrl(id?: string): string {
        const baseUrl = `${this.getBaseApiUrl()}/comments`;
        return id ? `${baseUrl}/${id}` : baseUrl;
    }

    /**
     * Formats comment data for use in components.
     *
     * @param {string} [id] - An individual comment entry from the API
     * @return {Task} A task
     */
    format(comment: Object): Comment {
        return {
            ...comment,
            tagged_message: comment.tagged_message !== '' ? comment.tagged_message : comment.message
        };
    }

    /**
     * Formats the comments api response to usable data
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
            this.successCallback(this.format(data));
            return;
        }

        const comments = data.entries.map(this.format);
        this.successCallback({ ...data, entries: comments });
    };

    /**
     * API for creating a comment on a file
     *
     * @param {BoxItem} file - File object for which we are creating a comment
     * @param {string} message - Comment message
     * @param {string} taggedMessage - Comment message with @mentions
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    createComment({
        file,
        message,
        taggedMessage,
        successCallback,
        errorCallback
    }: {
        file: BoxItem,
        message?: string,
        taggedMessage?: string,
        successCallback: Function,
        errorCallback: Function
    }): void {
        const { id = '', permissions } = file;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, id);
        } catch (e) {
            errorCallback(e);
            return;
        }

        const requestData = {
            data: {
                item: {
                    id,
                    type: 'file'
                },
                message,
                tagged_message: taggedMessage
            }
        };

        this.post(id, this.commentsUrl(), requestData, successCallback, errorCallback);
    }

    /**
     * API for updating a comment on a file
     *
     * @param {BoxItem} file - File object for which we are updating a comment
     * @param {string} commentId - Comment to be edited
     * @param {string} message - Comment message
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    updateComment({
        file,
        commentId,
        message,
        successCallback,
        errorCallback
    }: {
        file: BoxItem,
        commentId: string,
        message: string,
        successCallback: Function,
        errorCallback: Function
    }): void {
        const { id = '' } = file;

        // TODO: grab this from the comment once implemented in API
        const permissions = {
            [PERMISSION_CAN_EDIT]: true
        };

        try {
            this.checkApiCallValidity(PERMISSION_CAN_EDIT, permissions, id);
        } catch (e) {
            errorCallback(e);
            return;
        }

        const requestData = {
            data: { message }
        };

        this.put(id, this.commentsUrl(commentId), requestData, successCallback, errorCallback);
    }

    /**
     * API for deleting a comment on a file
     *
     * @param {BoxItem} file - File object for which we are deleting a comment
     * @param {string} commentId - Id of the comment we are deleting
     * @param {Object} permissions - The known permissions of the comment we're deleting
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    deleteComment({
        file,
        commentId,
        permissions,
        successCallback,
        errorCallback
    }: {
        file: BoxItem,
        commentId: string,
        permissions: Object,
        successCallback: Function,
        errorCallback: Function
    }): void {
        const { id = '' } = file;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_DELETE, permissions, id);
        } catch (e) {
            errorCallback(e);
            return;
        }

        this.delete(id, this.commentsUrl(commentId), successCallback, errorCallback);
    }
}

export default Comments;
