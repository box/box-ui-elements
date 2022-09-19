// @flow
import merge from 'lodash/merge';
import {
    ERROR_CODE_CREATE_ANNOTATION,
    ERROR_CODE_CREATE_REPLY,
    ERROR_CODE_DELETE_ANNOTATION,
    ERROR_CODE_EDIT_ANNOTATION,
    ERROR_CODE_FETCH_ANNOTATION,
    ERROR_CODE_FETCH_ANNOTATIONS,
    ERROR_CODE_FETCH_REPLIES,
    PERMISSION_CAN_CREATE_ANNOTATIONS,
    PERMISSION_CAN_DELETE,
    PERMISSION_CAN_EDIT,
    PERMISSION_CAN_VIEW_ANNOTATIONS,
    PERMISSION_CAN_RESOLVE,
} from '../constants';
import MarkerBasedApi from './MarkerBasedAPI';
import { formatComment } from './utils';

import type {
    Annotation,
    AnnotationPermission,
    Annotations as AnnotationsType,
    NewAnnotation,
} from '../common/types/annotations';
import type { BoxItemPermission } from '../common/types/core';
import type { ElementsXhrError } from '../common/types/api';
import type { Comment, FeedItemStatus, ThreadedComments as ThreadedCommentsType } from '../common/types/feed';

export default class Annotations extends MarkerBasedApi {
    /**
     * Formats annotation replies' comment data for use in components.
     *
     * @param {Annotation} annotation - An individual annotation entry from the API
     * @return {Annotation} Updated annotation
     */
    format(annotation: Annotation): Annotation {
        if (annotation.replies && annotation.replies.length) {
            return {
                ...annotation,
                replies: annotation.replies.map(formatComment),
            };
        }

        return annotation;
    }

    getUrl() {
        return `${this.getBaseApiUrl()}/undoc/annotations`;
    }

    getUrlForId(annotationId: string) {
        return `${this.getUrl()}/${annotationId}`;
    }

    getUrlWithRepliesForId(annotationId: string) {
        return `${this.getUrlForId(annotationId)}/replies`;
    }

    createAnnotation(
        fileId: string,
        fileVersionId: string,
        payload: NewAnnotation,
        permissions: BoxItemPermission,
        successCallback: (annotation: Annotation) => void,
        errorCallback: (e: ElementsXhrError, code: string) => void,
    ): void {
        this.errorCode = ERROR_CODE_CREATE_ANNOTATION;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_CREATE_ANNOTATIONS, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        const defaults = {
            description: {
                type: 'reply',
            },
            file_version: {
                id: fileVersionId,
                type: 'file_version',
            },
        };

        this.post({
            id: fileId,
            data: {
                data: merge(defaults, payload),
            },
            errorCallback,
            successCallback,
            url: this.getUrl(),
        });
    }

    updateAnnotation(
        fileId: string,
        annotationId: string,
        permissions: AnnotationPermission,
        payload: { message?: string, status?: FeedItemStatus },
        successCallback: (annotation: Annotation) => void,
        errorCallback: (e: ElementsXhrError, code: string) => void,
    ): void {
        this.errorCode = ERROR_CODE_EDIT_ANNOTATION;
        const { message, status } = payload;

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

        this.put({
            id: fileId,
            data: {
                data: {
                    description: message ? { message } : undefined,
                    status,
                },
            },
            errorCallback,
            successCallback: (annotation: Annotation) => {
                successCallback(this.format(annotation));
            },
            url: this.getUrlForId(annotationId),
        });
    }

    deleteAnnotation(
        fileId: string,
        annotationId: string,
        permissions: AnnotationPermission,
        successCallback: () => void,
        errorCallback: (e: ElementsXhrError, code: string) => void,
    ): void {
        this.errorCode = ERROR_CODE_DELETE_ANNOTATION;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_DELETE, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.delete({
            id: fileId,
            errorCallback,
            successCallback,
            url: this.getUrlForId(annotationId),
        });
    }

    getAnnotation(
        fileId: string,
        annotationId: string,
        permissions: BoxItemPermission,
        successCallback: (annotation: Annotation) => void,
        errorCallback: (e: ElementsXhrError, code: string) => void,
        shouldFetchReplies?: boolean,
    ): void {
        this.errorCode = ERROR_CODE_FETCH_ANNOTATION;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_VIEW_ANNOTATIONS, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        const requestData = shouldFetchReplies ? { params: { fields: 'replies' } } : undefined;

        this.get({
            id: fileId,
            errorCallback,
            successCallback: (annotation: Annotation) => {
                successCallback(this.format(annotation));
            },
            url: this.getUrlForId(annotationId),
            requestData,
        });
    }

    getAnnotations(
        fileId: string,
        fileVersionId?: string,
        permissions: BoxItemPermission,
        successCallback: (annotations: AnnotationsType) => void,
        errorCallback: (e: ElementsXhrError, code: string) => void,
        limit?: number,
        shouldFetchAll?: boolean,
        shouldFetchReplies?: boolean,
    ): void {
        this.errorCode = ERROR_CODE_FETCH_ANNOTATIONS;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_VIEW_ANNOTATIONS, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        const requestData = {
            file_id: fileId,
            file_version_id: fileVersionId,
            ...(shouldFetchReplies ? { fields: 'replies' } : null),
        };

        this.markerGet({
            id: fileId,
            errorCallback,
            limit,
            requestData,
            shouldFetchAll,
            successCallback: (annotations: AnnotationsType): AnnotationsType => ({
                ...annotations,
                entries: annotations.entries.map(this.format),
            }),
        });
    }

    getAnnotationReplies(
        fileId: string,
        annotationId: string,
        permissions: BoxItemPermission,
        successCallback: (comments: Array<Comment>) => void,
        errorCallback: (e: ElementsXhrError, code: string) => void,
    ): void {
        this.errorCode = ERROR_CODE_FETCH_REPLIES;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_VIEW_ANNOTATIONS, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.get({
            id: fileId,
            errorCallback,
            successCallback: ({ entries }: ThreadedCommentsType) => {
                successCallback(entries.map(formatComment));
            },
            url: this.getUrlWithRepliesForId(annotationId),
        });
    }

    createAnnotationReply(
        fileId: string,
        annotationId: string,
        permissions: BoxItemPermission,
        message: string,
        successCallback: (comment: Comment) => void,
        errorCallback: (e: ElementsXhrError, code: string) => void,
    ): void {
        this.errorCode = ERROR_CODE_CREATE_REPLY;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_CREATE_ANNOTATIONS, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.post({
            id: fileId,
            data: { data: { message } },
            errorCallback,
            successCallback: (comment: Comment) => {
                successCallback(formatComment(comment));
            },
            url: this.getUrlWithRepliesForId(annotationId),
        });
    }
}
