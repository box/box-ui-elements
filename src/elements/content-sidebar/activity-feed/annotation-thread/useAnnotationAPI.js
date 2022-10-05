// @flow

import React from 'react';
import type { MessageDescriptor } from 'react-intl';
import API from '../../../../api/APIFactory';
import { annotationErrors } from './errors';

import type { Annotation, AnnotationPermission } from '../../../../common/types/annotations';
import type { BoxItemPermission, User } from '../../../../common/types/core';
import type { FeedItemStatus, Comment, BoxCommentPermission } from '../../../../common/types/feed';
import type { ElementOrigin, ElementsXhrError } from '../../../../common/types/api';
import useRepliesAPI from './useRepliesAPI';

import commonMessages from '../../../common/messages';

type Props = {
    annotationId: string,
    api: API,
    currentUser: User,
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
    handleCreateReply: (message: string) => void,
    handleDelete: ({ id: string, permissions: AnnotationPermission }) => any,
    handleDeleteReply: ({ id: string, permissions: BoxCommentPermission }) => void,
    handleEdit: (id: string, text: string, permissions: AnnotationPermission) => void,
    handleEditReply: (
        replyId: string,
        message: string,
        status?: FeedItemStatus,
        hasMention: boolean,
        permissions: BoxCommentPermission,
    ) => void,
    handleStatusChange: (id: string, status: FeedItemStatus, permissions: AnnotationPermission) => void,
    isLoading: boolean,
    replies: Array<Comment>,
};

const useAnnotationAPI = ({
    annotationId,
    api,
    currentUser,
    fileId,
    filePermissions,
    errorCallback,
}: Props): UseAnnotationAPI => {
    const [annotation, setAnnotation] = React.useState();
    const [replies, setReplies] = React.useState<{ [string]: Comment }>({});
    const [error, setError] = React.useState();
    const [isLoading, setIsLoading] = React.useState(true);

    const normalizeReplies = (repliesArray: Array<Comment>): { [string]: Comment } => {
        if (!repliesArray) {
            return {};
        }
        return repliesArray.reduce((prevValues, reply) => {
            return {
                ...prevValues,
                [reply.id]: reply,
            };
        }, {});
    };

    const denormalizeReplies = (repliesMap: { [string]: Comment }): Array<Comment> => {
        return Object.keys(repliesMap).map(key => repliesMap[key]);
    };

    const { handleCreateReply, handleEditReply, handleDeleteReply } = useRepliesAPI({
        annotationId,
        api,
        currentUser,
        fileId,
        filePermissions,
        setReplies,
    });

    const annotationSuccessCallback = (updatedAnnotation: Annotation): void => {
        setAnnotation({
            ...updatedAnnotation,
            isPending: false,
        });
    };

    const annotationDeleteSuccessCallback = () => {
        // will emit delete event
    };

    const annotationErrorCallback = React.useCallback(
        (e: ElementsXhrError, code: string): void => {
            setIsLoading(false);
            setError({
                title: commonMessages.errorOccured,
                message: annotationErrors[code] || annotationErrors.default,
            });

            errorCallback(e, code, {
                error: e,
            });
        },
        [errorCallback],
    );

    React.useEffect(() => {
        const getAnnotationSuccess = (fetchedAnnotation: Annotation) => {
            const { replies: fetchedReplies, ...normalizedAnnotation } = fetchedAnnotation;
            setAnnotation({ ...normalizedAnnotation });
            if (fetchedReplies) {
                setReplies(normalizeReplies(fetchedReplies));
            }
            setError(undefined);
            setIsLoading(false);
        };

        setIsLoading(true);
        api.getAnnotationsAPI(false).getAnnotation(
            fileId,
            annotationId,
            filePermissions,
            getAnnotationSuccess,
            annotationErrorCallback,
            true, // to fetch aanotation with its replies
        );
    }, [fileId, annotationId, filePermissions, api, annotationErrorCallback]);

    const handleDelete = ({ id, permissions }: { id: string, permissions: AnnotationPermission }): void => {
        setAnnotation(prevAnnotation => ({ ...prevAnnotation, isPending: true }));
        api.getAnnotationsAPI(false).deleteAnnotation(
            fileId,
            id,
            permissions,
            annotationDeleteSuccessCallback,
            errorCallback,
        );
    };

    const handleEdit = (id: string, text: string, permissions: AnnotationPermission): void => {
        setAnnotation(prevAnnotation => ({ ...prevAnnotation, isPending: true }));
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
        setAnnotation(prevAnnotation => ({ ...prevAnnotation, isPending: true }));
        api.getAnnotationsAPI(false).updateAnnotation(
            fileId,
            id,
            permissions,
            { status },
            annotationSuccessCallback,
            annotationErrorCallback,
        );
    };

    return {
        annotation,
        replies: denormalizeReplies(replies),
        error,
        isLoading,
        handleDelete,
        handleEdit,
        handleStatusChange,
        handleCreateReply,
        handleEditReply,
        handleDeleteReply,
    };
};

export default useAnnotationAPI;
