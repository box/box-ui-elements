// @flow
import merge from 'lodash/merge';
import {
    ERROR_CODE_CREATE_ANNOTATION,
    ERROR_CODE_DELETE_ANNOTATION,
    ERROR_CODE_FETCH_ANNOTATION,
    ERROR_CODE_FETCH_ANNOTATIONS,
    PERMISSION_CAN_CREATE_ANNOTATIONS,
    PERMISSION_CAN_DELETE,
    PERMISSION_CAN_VIEW_ANNOTATIONS,
} from '../constants';
import MarkerBasedApi from './MarkerBasedAPI';
import type {
    Annotation,
    AnnotationPermission,
    Annotations as AnnotationsType,
    NewAnnotation,
} from '../common/types/annotations';
import type { BoxItemPermission } from '../common/types/core';
import type { ElementsXhrError } from '../common/types/api';

export default class Annotations extends MarkerBasedApi {
    getUrl() {
        return `${this.getBaseApiUrl()}/undoc/annotations`;
    }

    getUrlForId(annotationId: string) {
        return `${this.getUrl()}/${annotationId}`;
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
            status: 'open',
            type: 'annotation',
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
    ): void {
        this.errorCode = ERROR_CODE_FETCH_ANNOTATION;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_VIEW_ANNOTATIONS, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.get({
            id: fileId,
            errorCallback,
            successCallback,
            url: this.getUrlForId(annotationId),
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
    ): void {
        this.errorCode = ERROR_CODE_FETCH_ANNOTATIONS;

        try {
            this.checkApiCallValidity(PERMISSION_CAN_VIEW_ANNOTATIONS, permissions, fileId);
        } catch (e) {
            errorCallback(e, this.errorCode);
            return;
        }

        this.markerGet({
            id: fileId,
            errorCallback,
            limit,
            requestData: {
                file_id: fileId,
                file_version_id: fileVersionId,
            },
            shouldFetchAll,
            successCallback,
        });
    }
}
