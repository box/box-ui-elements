/**
 * @flow
 * @file Helper for the box comments API
 * @author Box
 */

import OffsetBasedAPI from './OffsetBasedAPI';
import type { BoxItem, Comment } from '../flowTypes';
import { getTypedFileId } from '../util/file';
import { PERMISSION_CAN_COMMENT, PERMISSION_CAN_EDIT_COMMENT, PERMISSION_CAN_DELETE_COMMENT } from '../constants';

class Comments extends OffsetBasedAPI {
    /**
     * API URL for comments on a file
     *
     * @param {string} [id] - A box file id
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }
        return `${this.getBaseApiUrl()}/files/${id}/comments`;
    }

    /**
     * Formats the comments api response to usable data
     * @param {Object} data the api response data
     */
    successHandler = (data: any): void => {
        if (this.isDestroyed() || typeof this.successCallback !== 'function') {
            return;
        }

        // There is no response data when deleting a comment
        if (!data) {
            return;
        }

        // Manually create the entries array if creating/updating a comment
        const entries = data.entries ? data.entries : [data];

        const comments = entries.map((comment: Comment) => {
            const { tagged_message, message } = comment;
            return {
                ...comment,
                tagged_message: tagged_message !== '' ? tagged_message : message
            };
        });

        this.successCallback({ ...data, entries: comments });
    };

    /**
     * API URL for comments endpoint
     *
     * @param {string} [id] - A box comment file id
     * @return {string} base url for comments
     */
    getCommentsUrl(id?: string): string {
        const suffix: string = id ? `/${id}` : '';
        return `${this.getBaseApiUrl()}/comments${suffix}`;
    }

    /**
     * API for creating a comment on a file
     *
     * @param {BoxItem} file - File object for which we are creating a comment
     * @param {string} message - Comment message
     * @param {string} taggedMessage - Comment message with @mentions
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {Promise}
     */
    createComment({
        file,
        message,
        taggedMessage,
        successCallback,
        errorCallback
    }: {
        file: BoxItem,
        message: string,
        taggedMessage?: string,
        successCallback: Function,
        errorCallback: Function
    }): Promise<void> {
        const { id = '', permissions } = file;

        try {
            this.checkItem(id, permissions);
            this.checkPermission(permissions, PERMISSION_CAN_COMMENT);
        } catch (e) {
            errorCallback(e);
            return Promise.reject();
        }

        return this.post(
            getTypedFileId(id),
            this.getCommentsUrl(),
            {
                item: {
                    id,
                    type: 'file'
                },
                message,
                tagged_message: taggedMessage
            },
            successCallback,
            errorCallback
        );
    }

    /**
     * API for updating a comment on a file
     *
     * @param {BoxItem} file - File object for which we are creating a comment
     * @param {string} commentId - Comment to be edited
     * @param {string} message - Comment message
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {Promise}
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
    }): Promise<void> {
        const { id = '', permissions } = file;

        try {
            this.checkItem(id, permissions);
            this.checkPermission(permissions, PERMISSION_CAN_EDIT_COMMENT);
        } catch (e) {
            errorCallback(e);
            return Promise.reject();
        }

        return this.put(
            getTypedFileId(id),
            this.getCommentsUrl(commentId),
            {
                message
            },
            successCallback,
            errorCallback
        );
    }

    /**
     * API for creating a comment on a file
     *
     * @param {BoxItem} file - File object for which we are deleting a comment
     * @param {string} commentId - Id of the comment we are deleting
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {Promise}
     */
    deleteComment({
        file,
        commentId,
        successCallback,
        errorCallback
    }: {
        file: BoxItem,
        commentId: string,
        successCallback: Function,
        errorCallback: Function
    }): Promise<void> {
        const { id = '', permissions } = file;

        try {
            this.checkItem(id, permissions);
            this.checkPermission(permissions, PERMISSION_CAN_DELETE_COMMENT);
        } catch (e) {
            errorCallback(e);
            return Promise.reject();
        }

        return this.delete(getTypedFileId(id), this.getCommentsUrl(commentId), successCallback, errorCallback);
    }
}

export default Comments;
