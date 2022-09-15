// @flow

import React from 'react';
import API from '../../../../api/APIFactory';

import type { Annotation, AnnotationPermission } from '../../../../common/types/annotations';
import type { BoxItemPermission } from '../../../../common/types/core';
import type { FeedItemStatus } from '../../../../common/types/feed';
import type { ElementOrigin, ElementsXhrError } from '../../../../common/types/api';

type Props = {
    annotationId: string,
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

type returnValues = {
    annotation?: Annotation,
    handleDelete: ({ id: string, permissions: AnnotationPermission }) => any,
    handleEdit: (id: string, text: string, permissions: AnnotationPermission) => void,
    handleResolve: (id: string, status: FeedItemStatus, permissions: AnnotationPermission) => void,
    isError: boolean,
    isLoading: boolean,
};

const useAnnotationAPI = ({ annotationId, api, fileId, filePermissions, errorCallback }: Props): returnValues => {
    const [annotation, setAnnotation] = React.useState();
    const [isError, setIsError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const getAnnotationSuccess = (fetchedAnnotation: Annotation): void => {
        setAnnotation(fetchedAnnotation);
        setIsError(false);
        setIsLoading(false);
    };

    const annotationSuccessCallback = (updatedAnnotation: Annotation): void => {
        setAnnotation(prevAnnotation => ({
            ...updatedAnnotation,
            replies: prevAnnotation ? prevAnnotation.replies : [],
            isPending: false,
        }));
    };

    const annotationDeleteSuccessCallback = () => {
        // will emit delete event
    };

    const annotationErrorCallback = React.useCallback(
        (e: ElementsXhrError, code: string): void => {
            setIsLoading(false);
            setIsError(true);

            errorCallback(e, code, {
                error: e,
            });
        },
        [errorCallback],
    );

    const handleFetch = React.useCallback(() => {
        setIsLoading(true);
        api.getAnnotationsAPI(false).getAnnotation(
            fileId,
            annotationId,
            filePermissions,
            getAnnotationSuccess,
            annotationErrorCallback,
            true,
        );
    }, [api, fileId, annotationId, filePermissions, annotationErrorCallback]);

    React.useEffect(() => {
        handleFetch();
    }, [handleFetch]);

    const handleDelete = ({ id, permissions }: { id: string, permissions: AnnotationPermission }): void => {
        setAnnotation({ ...annotation, isPending: true });
        api.getAnnotationsAPI(false).deleteAnnotation(
            fileId,
            id,
            permissions,
            annotationDeleteSuccessCallback,
            errorCallback,
        );
    };

    const handleEdit = (id: string, text: string, permissions: AnnotationPermission): void => {
        setAnnotation({ ...annotation, isPending: true });
        api.getAnnotationsAPI(false).updateAnnotation(
            fileId,
            id,
            permissions,
            { message: text },
            annotationSuccessCallback,
            annotationErrorCallback,
        );
    };

    const handleResolve = (id: string, status: FeedItemStatus, permissions: AnnotationPermission): void => {
        setAnnotation({ ...annotation, isPending: true });
        api.getAnnotationsAPI(false).updateAnnotation(
            fileId,
            id,
            permissions,
            { status },
            annotationSuccessCallback,
            annotationErrorCallback,
        );
    };

    return { annotation, isError, isLoading, handleDelete, handleEdit, handleResolve };
};

export default useAnnotationAPI;
