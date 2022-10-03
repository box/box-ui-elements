// @flow

import React from 'react';
import type { MessageDescriptor } from 'react-intl';
import API from '../../../../api/APIFactory';
import { annotationErrors } from './errors';

import type { Annotation, AnnotationPermission } from '../../../../common/types/annotations';
import type { BoxItemPermission } from '../../../../common/types/core';
import type { Comment, FeedItemStatus } from '../../../../common/types/feed';
import type { ElementOrigin, ElementsXhrError } from '../../../../common/types/api';

import commonMessages from '../../../common/messages';

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

type UseAnnotationAPI = {
    annotation?: Annotation,
    error?: {
        message?: MessageDescriptor,
        title?: MessageDescriptor,
    },
    handleDelete: ({ id: string, permissions: AnnotationPermission }) => any,
    handleEdit: (id: string, text: string, permissions: AnnotationPermission) => void,
    handleStatusChange: (id: string, status: FeedItemStatus, permissions: AnnotationPermission) => void,
    initialReplies: Array<Comment>,
    isLoading: boolean,
};

const useAnnotationAPI = ({ annotationId, api, fileId, filePermissions, errorCallback }: Props): UseAnnotationAPI => {
    const [annotation, setAnnotation] = React.useState();
    const [initialReplies, setInitialReplies] = React.useState([]);
    const [error, setError] = React.useState();
    const [isLoading, setIsLoading] = React.useState(true);

    const getAnnotationSuccess = (fetchedAnnotation: Annotation): void => {
        setAnnotation(fetchedAnnotation);
        if (fetchedAnnotation.replies) {
            setInitialReplies(fetchedAnnotation.replies);
        }
        setError(undefined);
        setIsLoading(false);
    };

    const annotationSuccessCallback = (updatedAnnotation: Annotation): void => {
        setAnnotation({
            ...updatedAnnotation,
            isPending: false,
        });
    };

    const annotationDeleteSuccessCallback = () => {
        // will emit delete event
    };

    const createAnnotationErrorCallback = (code: string) => {
        setError({
            title: commonMessages.errorOccured,
            message: annotationErrors[code] || annotationErrors.default,
        });
    };

    const annotationErrorCallback = React.useCallback(
        (e: ElementsXhrError, code: string): void => {
            setIsLoading(false);
            createAnnotationErrorCallback(code);

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
            true, // to fetch aanotation with its replies
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

    const handleStatusChange = (id: string, status: FeedItemStatus, permissions: AnnotationPermission): void => {
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

    return { annotation, initialReplies, error, isLoading, handleDelete, handleEdit, handleStatusChange };
};

export default useAnnotationAPI;
