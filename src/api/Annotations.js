// @flow
import merge from 'lodash/merge';
import MarkerBasedApi from './MarkerBasedAPI';
import type { Annotation, NewAnnotation } from '../common/types/annotations';
import type { ElementsXhrError } from '../common/types/api';

export default class Annotations extends MarkerBasedApi {
    getUrl() {
        return `${this.getBaseApiUrl()}/internal_annotations`;
    }

    getUrlForId(annotationId: string) {
        return `${this.getUrl()}/${annotationId}`;
    }

    createAnnotation(
        fileId: string,
        fileVersionId: string,
        payload: NewAnnotation,
        successCallback: (annotation: Annotation) => void,
        errorCallback: (e: ElementsXhrError, code: string) => void,
    ): Promise<void> {
        const defaults = {
            description: {
                type: 'reply',
            },
            file_version: {
                id: fileVersionId,
                type: 'version',
            },
            status: 'open',
            type: 'annotation',
        };

        return this.post({
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
        successCallback: () => void,
        errorCallback: (e: ElementsXhrError, code: string) => void,
    ): Promise<void> {
        return this.delete({
            id: fileId,
            errorCallback,
            successCallback,
            url: this.getUrlForId(annotationId),
        });
    }

    getAnnotation(
        fileId: string,
        annotationId: string,
        successCallback: (annotation: Annotation) => void,
        errorCallback: (e: ElementsXhrError, code: string) => void,
    ): Promise<void> {
        return this.get({
            id: fileId,
            errorCallback,
            successCallback,
            url: this.getUrlForId(annotationId),
        });
    }

    getAnnotations(
        fileId: string,
        fileVersionId?: string,
        successCallback: (annotations: Annotation[]) => void,
        errorCallback: (e: ElementsXhrError, code: string) => void,
        limit?: number,
        shouldFetchAll?: boolean,
    ): Promise<void> {
        return this.markerGet({
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
