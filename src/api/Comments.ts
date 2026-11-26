import { COMMENTS_FIELDS_TO_FETCH } from '../utils/fields';
import OffsetBasedAPI from './OffsetBasedAPI';
import {
    PERMISSION_CAN_COMMENT,
    PERMISSION_CAN_DELETE,
    PERMISSION_CAN_EDIT,
    ERROR_CODE_CREATE_COMMENT,
    ERROR_CODE_UPDATE_COMMENT,
    ERROR_CODE_DELETE_COMMENT,
    ERROR_CODE_FETCH_COMMENTS,
} from '../constants';
import type { ElementsXhrError, ElementsErrorCallback } from '../common/types/api';
import type { BoxItem, BoxItemPermission } from '../common/types/core';
import type { BoxCommentPermission, Comment } from '../common/types/feed';

class Comments extends OffsetBasedAPI {
    /** Base URL for the comments of file `id`. Throws when `id` is missing. */
    getUrl(id?: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }

        return `${this.getBaseApiUrl()}/files/${id}/comments`;
    }

    /** URL for the comments endpoint, or for comment `id` when provided. */
    commentsUrl(id?: string): string {
        const baseUrl = `${this.getBaseApiUrl()}/comments`;
        return id ? `${baseUrl}/${id}` : baseUrl;
    }

    /** Formats an API comment for use in components, falling back to `message` when `tagged_message` is empty. */
    format(comment: Comment): Comment {
        return {
            ...comment,
            tagged_message: comment.tagged_message !== '' ? comment.tagged_message : comment.message,
        };
    }

    /**
     * Calls `successCallback` with the formatted comment or comment collection when the instance is not destroyed.
     * Calls it with no arguments when there is no response data, as when deleting a comment.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Responses are a comment, a comment collection, or empty.
    successHandler = (data: any): void => {
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
     * Creates a comment with `message` and `taggedMessage` (the message with @mentions) on `file`.
     * Calls `errorCallback` without a request unless `can_comment` is set.
     */
    createComment({
        file,
        message,
        taggedMessage,
        successCallback,
        errorCallback,
    }: {
        errorCallback: ElementsErrorCallback;
        file: BoxItem;
        message?: string;
        successCallback: Function;
        taggedMessage?: string;
    }): void {
        this.errorCode = ERROR_CODE_CREATE_COMMENT;
        const { id = '', permissions } = file;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, id);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        const requestData = {
            data: {
                item: {
                    id,
                    type: 'file',
                },
                message,
                tagged_message: taggedMessage,
            },
            params: {
                fields: COMMENTS_FIELDS_TO_FETCH.toString(),
            },
        };

        this.post({
            id,
            url: this.commentsUrl(),
            data: requestData,
            successCallback,
            errorCallback,
        });
    }

    /**
     * Updates comment `commentId` on `file` with `message` and `tagged_message`.
     * Calls `errorCallback` without a request unless the comment's `permissions` include `can_edit`.
     */
    updateComment({
        file,
        commentId,
        message,
        tagged_message,
        permissions,
        successCallback,
        errorCallback,
    }: {
        commentId: string;
        errorCallback: ElementsErrorCallback;
        file: BoxItem;
        message: string;
        permissions: BoxCommentPermission;
        successCallback: Function;
        tagged_message?: string;
    }): void {
        this.errorCode = ERROR_CODE_UPDATE_COMMENT;
        const { id = '' } = file;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_EDIT, permissions, id);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        const requestData = {
            data: { message, tagged_message },
        };

        this.put({
            id,
            url: this.commentsUrl(commentId),
            data: requestData,
            successCallback,
            errorCallback,
        });
    }

    /**
     * Deletes comment `commentId` on `file`.
     * Calls `errorCallback` without a request unless the comment's `permissions` include `can_delete`.
     */
    deleteComment({
        file,
        commentId,
        permissions,
        successCallback,
        errorCallback,
    }: {
        commentId: string;
        errorCallback: ElementsErrorCallback;
        file: BoxItem;
        permissions: BoxCommentPermission;
        successCallback: Function;
    }): void {
        this.errorCode = ERROR_CODE_DELETE_COMMENT;
        const { id = '' } = file;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_DELETE, permissions, id);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.delete({
            id,
            url: this.commentsUrl(commentId),
            successCallback,
            errorCallback,
        });
    }

    /**
     * Fetches `fields` of the comments on file `fileId` starting at `offset`. When `shouldFetchAll` is true,
     * keeps fetching pages of `limit` comments before calling `successCallback`.
     * Calls `errorCallback` without a request unless the file's `permissions` include `can_comment`.
     */
    getComments(
        fileId: string,
        permissions: BoxItemPermission,
        successCallback: Function,
        errorCallback: (e: ElementsXhrError, code: string) => void,
        fields: Array<string> = COMMENTS_FIELDS_TO_FETCH,
        offset?: number,
        limit?: number,
        shouldFetchAll?: boolean,
    ): void {
        this.errorCode = ERROR_CODE_FETCH_COMMENTS;
        try {
            this.checkApiCallValidity(PERMISSION_CAN_COMMENT, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.offsetGet(fileId, successCallback, errorCallback, offset, limit, fields, shouldFetchAll);
    }
}

export default Comments;
