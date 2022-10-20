// @flow
import API from '../../../../api/APIFactory';

import type { Annotation, AnnotationPermission } from '../../../../common/types/annotations';
import type { BoxItemPermission } from '../../../../common/types/core';
import type { FeedItemStatus } from '../../../../common/types/feed';
import type { ElementOrigin, ElementsXhrError } from '../../../../common/types/api';

type Props = {
    api: API,
    errorCallback: (
        error: ElementsXhrError | Error,
        code: string,
        contextInfo?: Object,
        origin?: ElementOrigin,
    ) => void,
    fileId: string,
    filePermissions: BoxItemPermission,
};

type UseAnnotationAPI = {
    handleDelete: ({ id: string, permissions: AnnotationPermission, successCallback: () => void }) => any,
    handleEdit: ({
        id: string,
        permissions: AnnotationPermission,
        successCallback: (annotation: Annotation) => void,
        text: string,
    }) => void,
    handleFetch: ({ annotationId: string, successCallback: (annotation: Annotation) => void }) => void,
    handleStatusChange: ({
        id: string,
        permissions: AnnotationPermission,
        status: FeedItemStatus,
        successCallback: (annotation: Annotation) => void,
    }) => void,
};

const useAnnotationAPI = ({ api, fileId, filePermissions, errorCallback }: Props): UseAnnotationAPI => {
    const handleFetch = ({
        annotationId,
        successCallback,
    }: {
        annotationId: string,
        successCallback: (annotation: Annotation) => void,
    }): void => {
        api.getAnnotationsAPI(false).getAnnotation(
            fileId,
            annotationId,
            filePermissions,
            successCallback,
            errorCallback,
            true, // to fetch aanotation with its replies
        );
    };

    const handleDelete = ({
        id,
        permissions,
        successCallback,
    }: {
        id: string,
        permissions: AnnotationPermission,
        successCallback: () => void,
    }): void => {
        api.getAnnotationsAPI(false).deleteAnnotation(fileId, id, permissions, successCallback, errorCallback);
    };

    const handleEdit = ({
        id,
        text,
        permissions,
        successCallback,
    }: {
        id: string,
        permissions: AnnotationPermission,
        successCallback: (annotation: Annotation) => void,
        text: string,
    }): void => {
        api.getAnnotationsAPI(false).updateAnnotation(
            fileId,
            id,
            permissions,
            { message: text },
            successCallback,
            errorCallback,
        );
    };

    const handleStatusChange = ({
        id,
        status,
        permissions,
        successCallback,
    }: {
        id: string,
        permissions: AnnotationPermission,
        status: FeedItemStatus,
        successCallback: (annotation: Annotation) => void,
    }): void => {
        api.getAnnotationsAPI(false).updateAnnotation(
            fileId,
            id,
            permissions,
            { status },
            successCallback,
            errorCallback,
        );
    };

    return {
        handleFetch,
        handleDelete,
        handleEdit,
        handleStatusChange,
    };
};

export default useAnnotationAPI;
