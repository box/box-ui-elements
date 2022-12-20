// @flow

import React from 'react';
import uniqueId from 'lodash/uniqueId';
import type EventEmitter from 'events';
import commonMessages from '../../../common/messages';
import { annotationErrors } from './errors';
import API from '../../../../api/APIFactory';
import useRepliesAPI from './useRepliesAPI';
import { useAnnotatorEvents } from '../../../common/annotator-context';
import useAnnotationAPI from './useAnnotationAPI';
import type { Annotation, AnnotationPermission, NewAnnotation, Target } from '../../../../common/types/annotations';
import type { BoxItem, User } from '../../../../common/types/core';
import type { BoxCommentPermission, Comment, FeedItemStatus } from '../../../../common/types/feed';
import type { ElementOrigin, ElementsXhrError } from '../../../../common/types/api';
import type { AnnotationThreadError } from './types';

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
    annotationId?: string,
    api: API,
    currentUser: User,
    errorCallback: (
        error: ElementsXhrError | Error,
        code: string,
        contextInfo?: Object,
        origin?: ElementOrigin,
    ) => void,
    eventEmitter: EventEmitter,
    file: BoxItem,
    onAnnotationCreate: (annotation: Annotation) => void,
    target: Target,
};

type UseAnnotationThread = {
    annotation?: Annotation,
    annotationActions: {
        handleAnnotationCreate: (text: string) => void,
        handleAnnotationDelete: ({ id: string, permissions: AnnotationPermission }) => void,
        handleAnnotationEdit: (id: string, text: string, permissions: AnnotationPermission) => void,
        handleAnnotationStatusChange: (id: string, status: FeedItemStatus, permissions: AnnotationPermission) => void,
    },
    error?: AnnotationThreadError,
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
    errorCallback,
    eventEmitter,
    file,
    onAnnotationCreate,
    target,
}: Props): UseAnnotationThread => {
    const [annotation, setAnnotation] = React.useState<Annotation | typeof undefined>();
    const [replies, setReplies] = React.useState<{ [string]: Comment }>({});
    const [error, setError] = React.useState<AnnotationThreadError | typeof undefined>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { id: fileId, permissions: filePermissions = {} } = file;

    const setAnnotationPending = () => {
        if (annotation) {
            setAnnotation(prevAnnotation => ({ ...prevAnnotation, isPending: true }));
        }
    };

    const handleAnnotationUpdateEnd = (updatedAnnotation: Annotation) => {
        if (annotation && updatedAnnotation.id === annotationId) {
            setAnnotation(prevAnnotation => ({ ...prevAnnotation, ...updatedAnnotation, isPending: false }));
        }
    };

    const { emitAddAnnotationEndEvent, emitAddAnnotationStartEvent } = useAnnotatorEvents({
        eventEmitter,
        onAnnotationDeleteStart: setAnnotationPending,
        onAnnotationUpdateEnd: handleAnnotationUpdateEnd,
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

    const { handleCreate, handleDelete, handleEdit, handleFetch, handleStatusChange } = useAnnotationAPI({
        api,
        file,
        errorCallback: annotationErrorCallback,
    });

    React.useEffect(() => {
        if (!annotationId || (annotation && annotation.id === annotationId)) {
            return;
        }
        setIsLoading(true);
        handleFetch({ id: annotationId, successCallback: handleFetchAnnotationSuccess });
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

    const handleAnnotationCreate = (text: string) => {
        setIsLoading(true);

        const requestId = uniqueId('annotation_');

        const successCallback = (newAnnotation: Annotation) => {
            setIsLoading(false);
            emitAddAnnotationEndEvent(newAnnotation, requestId);
            onAnnotationCreate(newAnnotation);
        };

        const payload: NewAnnotation = {
            description: { message: text },
            target,
        };

        emitAddAnnotationStartEvent(payload, requestId);

        handleCreate({ payload, successCallback });
    };

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
            handleAnnotationCreate,
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
