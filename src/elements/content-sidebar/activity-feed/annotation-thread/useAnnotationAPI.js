// @flow
import API from '../../../../api/APIFactory';

import type { Annotation, AnnotationPermission, NewAnnotation } from '../../../../common/types/annotations';
import type { BoxItem } from '../../../../common/types/core';
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
    file: BoxItem,
};

type UseAnnotationAPI = {
    handleCreate: ({ payload: NewAnnotation, successCallback: (annotation: Annotation) => void }) => void,
    handleDelete: ({ id: string, permissions: AnnotationPermission, successCallback: () => void }) => void,
    handleEdit: ({
        id: string,
        permissions: AnnotationPermission,
        successCallback: (annotation: Annotation) => void,
        text: string,
    }) => void,
    handleFetch: ({ id: string, successCallback: (annotation: Annotation) => void }) => void,
    handleStatusChange: ({
        id: string,
        permissions: AnnotationPermission,
        status: FeedItemStatus,
        successCallback: (annotation: Annotation) => void,
    }) => void,
};

const useAnnotationAPI = ({
    api,
    errorCallback,
    file: { id: fileId, file_version: { id: fileVersionId } = {}, permissions: filePermissions = {} },
}: Props): UseAnnotationAPI => {
    const handleCreate = ({
        payload,
        successCallback,
    }: {
        payload: NewAnnotation,
        successCallback: (annotation: Annotation) => void,
    }): void => {
        api.getAnnotationsAPI(false).createAnnotation(
            fileId,
            fileVersionId,
            payload,
            filePermissions,
            successCallback,
            errorCallback,
        );
    };

    const handleFetch = ({
        id,
        successCallback,
    }: {
        id: string,
        successCallback: (annotation: Annotation) => void,
    }): void => {
        api.getAnnotationsAPI(false).getAnnotation(
            fileId,
            id,
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
        handleCreate,
        handleFetch,
        handleDelete,
        handleEdit,
        handleStatusChange,
    };
};

export default useAnnotationAPI;
