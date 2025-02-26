import API from '../../../../api/APIFactory';
import { Annotation, AnnotationPermission, NewAnnotation } from '../../../../common/types/annotations';
import { BoxItem } from '../../../../common/types/core';
import { FeedItemStatus } from '../../../../common/types/feed';
import { ElementOrigin, ElementsXhrError } from '../../../../common/types/api';

interface Props {
    api: API;
    errorCallback: (
        error: ElementsXhrError | Error,
        code: string,
        contextInfo?: Record<string, unknown>,
        origin?: ElementOrigin,
    ) => void;
    file: BoxItem;
}

interface UseAnnotationAPI {
    handleCreate: (params: { payload: NewAnnotation; successCallback: (annotation: Annotation) => void }) => void;
    handleDelete: (params: { id: string; permissions: AnnotationPermission; successCallback: () => void }) => void;
    handleEdit: (params: {
        id: string;
        permissions: AnnotationPermission;
        successCallback: (annotation: Annotation) => void;
        text: string;
    }) => void;
    handleFetch: (params: { id: string; successCallback: (annotation: Annotation) => void }) => void;
    handleStatusChange: (params: {
        id: string;
        permissions: AnnotationPermission;
        status: FeedItemStatus;
        successCallback: (annotation: Annotation) => void;
    }) => void;
}

const useAnnotationAPI = ({ api, errorCallback, file }: Props): UseAnnotationAPI => {
    const { id: fileId, file_version = {}, permissions: filePermissions = {} } = file;
    const fileVersionId = file_version.id;

    const handleCreate = ({
        payload,
        successCallback,
    }: {
        payload: NewAnnotation;
        successCallback: (annotation: Annotation) => void;
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
        id: string;
        successCallback: (annotation: Annotation) => void;
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
        id: string;
        permissions: AnnotationPermission;
        successCallback: () => void;
    }): void => {
        api.getAnnotationsAPI(false).deleteAnnotation(fileId, id, permissions, successCallback, errorCallback);
    };

    const handleEdit = ({
        id,
        text,
        permissions,
        successCallback,
    }: {
        id: string;
        permissions: AnnotationPermission;
        successCallback: (annotation: Annotation) => void;
        text: string;
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
        id: string;
        permissions: AnnotationPermission;
        status: FeedItemStatus;
        successCallback: (annotation: Annotation) => void;
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
