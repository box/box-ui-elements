// @flow

import React from 'react';
import type EventEmitter from 'events';
import type { MessageDescriptor } from 'react-intl';
import commonMessages from '../../../common/messages';
import { annotationErrors } from './errors';
import API from '../../../../api/APIFactory';
import useRepliesAPI from './useRepliesAPI';
import { useAnnotatorEvents } from '../../../common/annotator-context';
import useAnnotationAPI from './useAnnotationAPI';
import type { Annotation, AnnotationPermission } from '../../../../common/types/annotations';
import type { BoxItemPermission, User } from '../../../../common/types/core';
import type { FeedItemStatus, Comment, BoxCommentPermission } from '../../../../common/types/feed';
import type { ElementOrigin, ElementsXhrError } from '../../../../common/types/api';

const normalizeReplies = (repliesArray?: Array<Comment>): { [string]: Comment } => {
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
    eventEmitter: EventEmitter,
    fileId: string,
    filePermissions: BoxItemPermission,
};

type UseAnnotationThread = {
    annotation?: Annotation,
    annotationActions: {
        handleAnnotationDelete: ({ id: string, permissions: AnnotationPermission }) => any,
        handleAnnotationEdit: (id: string, text: string, permissions: AnnotationPermission) => void,
        handleAnnotationStatusChange: (id: string, status: FeedItemStatus, permissions: AnnotationPermission) => void,
    },
    error?: {
        message?: MessageDescriptor,
        title?: MessageDescriptor,
    },
    isLoading: boolean,
    replies: Array<Comment>,
    repliesActions: {
        handleReplyCreate: (message: string) => void,
        handleReplyDelete: ({ id: string, permissions: BoxCommentPermission }) => void,
        handleReplyEdit: (
            replyId: string,
            message: string,
            status?: FeedItemStatus,
            hasMention?: boolean,
            permissions: BoxCommentPermission,
        ) => void,
    },
};

const useAnnotationThread = ({
    annotationId,
    api,
    currentUser,
    fileId,
    filePermissions,
    errorCallback,
    eventEmitter,
}: Props): UseAnnotationThread => {
    const [annotation, setAnnotation] = React.useState<Annotation | typeof undefined>();
    const [replies, setReplies] = React.useState<{ [string]: Comment }>({});
    const [error, setError] = React.useState();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    // handling events from Sidebar
    const setAnnotationPending = (id: string) => {
        if (annotation !== undefined && id === annotationId) {
            setAnnotation(prevAnnotation => ({ ...prevAnnotation, isPending: true }));
        }
    };

    const onAnnotationUpdateEnd = (updatedAnnotation: Annotation) => {
        if (annotation !== undefined && updatedAnnotation.id === annotationId) {
            setAnnotation(prevAnnotation => ({ ...prevAnnotation, ...updatedAnnotation, isPending: false }));
        }
    };

    useAnnotatorEvents({
        eventEmitter,
        onAnnotationDeleteStart: setAnnotationPending,
        onAnnotationUpdateEnd,
        onAnnotationUpdateStart: setAnnotationPending,
    });

    const handleUpdateOrCreateReplyItem = (replyId: string, updatedReplyValues: Object) => {
        setReplies(prevReplies => ({
            ...prevReplies,
            [replyId]: {
                ...prevReplies[replyId],
                ...updatedReplyValues,
            },
        }));
    };

    const handleRemoveReplyItem = (replyId: string) => {
        setReplies(prevReplies => {
            const newReplies = { ...prevReplies };
            delete newReplies[replyId];
            return newReplies;
        });
    };

    const handleUpdateAnnotation = (updatedValues: Object) => {
        setAnnotation(prevAnnotation => ({ ...prevAnnotation, ...updatedValues }));
    };

    const handleFetchAnnotationSuccess = ({ replies: fetchedReplies, ...normalizedAnnotation }: Annotation) => {
        setAnnotation({ ...normalizedAnnotation });
        setReplies(normalizeReplies(fetchedReplies));
        setError(undefined);
        setIsLoading(false);
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

    const { handleDelete, handleEdit, handleStatusChange, handleFetch } = useAnnotationAPI({
        api,
        fileId,
        filePermissions,
        errorCallback: annotationErrorCallback,
    });

    React.useEffect(() => {
        if (!annotation || annotation.id !== annotationId) {
            handleFetch({ annotationId, successCallback: handleFetchAnnotationSuccess });
        }
    }, [annotation, annotationId, handleFetch]);

    const { handleReplyCreate, handleReplyEdit, handleReplyDelete } = useRepliesAPI({
        annotationId,
        api,
        currentUser,
        fileId,
        filePermissions,
        handleRemoveReplyItem,
        handleUpdateOrCreateReplyItem,
    });

    const handleAnnotationDelete = ({ id, permissions }: { id: string, permissions: AnnotationPermission }): void => {
        const annotationDeleteSuccessCallback = () => {
            // will emit event
        };

        setAnnotation(prevAnnotation => ({ ...prevAnnotation, isPending: true }));
        handleDelete({
            id,
            permissions,
            successCallback: annotationDeleteSuccessCallback,
        });
    };

    const onAnnotationEditSuccessCallback = (updatedAnnotation: Annotation): void => {
        handleUpdateAnnotation({
            ...updatedAnnotation,
            isPending: false,
        });
    };

    const handleAnnotationEdit = (id: string, text: string, permissions: AnnotationPermission): void => {
        setAnnotation(prevAnnotation => ({ ...prevAnnotation, isPending: true }));

        handleEdit({
            id,
            text,
            permissions,
            successCallback: onAnnotationEditSuccessCallback,
        });
    };

    const handleAnnotationStatusChange = (
        id: string,
        status: FeedItemStatus,
        permissions: AnnotationPermission,
    ): void => {
        setAnnotation(prevAnnotation => ({ ...prevAnnotation, isPending: true }));

        handleStatusChange({
            id,
            status,
            permissions,
            successCallback: onAnnotationEditSuccessCallback,
        });
    };

    return {
        annotation,
        error,
        isLoading,
        replies: denormalizeReplies(replies),
        annotationActions: {
            handleAnnotationDelete,
            handleAnnotationEdit,
            handleAnnotationStatusChange,
        },
        repliesActions: {
            handleReplyCreate,
            handleReplyEdit,
            handleReplyDelete,
        },
    };
};

export default useAnnotationThread;
