import * as React from 'react';
import { EventEmitter } from 'events';
import noop from 'lodash/noop';
import { AnnotationActionEvent, Status } from './types';

export interface UseAnnotatorEventsProps {
    eventEmitter: EventEmitter;
    onAnnotationDeleteEnd?: (annotationId: string) => void;
    onAnnotationDeleteStart?: (annotationId: string) => void;
    onAnnotationReplyAddEnd?: (eventData: { annotationId: string; reply: Object; requestId: string }) => void;
    onAnnotationReplyAddStart?: (eventData: { annotationId: string; reply: Object; requestId: string }) => void;
    onAnnotationReplyDeleteEnd?: (eventData: { annotationId: string; id: string }) => void;
    onAnnotationReplyDeleteStart?: (eventData: { annotationId: string; id: string }) => void;
    onAnnotationReplyUpdateEnd?: (eventData: { annotationId: string; reply: Object }) => void;
    onAnnotationReplyUpdateStart?: (eventData: { annotationId: string; reply: Object }) => void;
    onAnnotationUpdateEnd?: (annotation: Object) => void;
    onAnnotationUpdateStart?: (annotation: Object) => void;
    onSidebarAnnotationSelected?: (annotationId: string) => void;
}

function useAnnotatorEvents({
    eventEmitter,
    onAnnotationDeleteEnd = noop,
    onAnnotationDeleteStart = noop,
    onAnnotationReplyAddEnd = noop,
    onAnnotationReplyAddStart = noop,
    onAnnotationReplyDeleteEnd = noop,
    onAnnotationReplyDeleteStart = noop,
    onAnnotationReplyUpdateEnd = noop,
    onAnnotationReplyUpdateStart = noop,
    onAnnotationUpdateEnd = noop,
    onAnnotationUpdateStart = noop,
    onSidebarAnnotationSelected = noop,
}: UseAnnotatorEventsProps) {
    const emitAnnotationActiveChangeEvent = (annotationId: string | null, fileVersionId: string) => {
        eventEmitter.emit('annotations_active_change', { annotationId, fileVersionId });
    };

    const emitAddAnnotationEvent = (annotation: Object, requestId: string, status: Status) => {
        const actionEvent: AnnotationActionEvent = {
            annotation,
            meta: { status, requestId },
        };
        eventEmitter.emit('annotations_create', actionEvent);
    };

    const emitAddAnnotationStartEvent = (annotation: Object, requestId: string) => {
        emitAddAnnotationEvent(annotation, requestId, Status.PENDING);
    };
    const emitAddAnnotationEndEvent = (annotation: Object, requestId: string) => {
        emitAddAnnotationEvent(annotation, requestId, Status.SUCCESS);
    };

    const emitDeleteAnnotationEvent = (id: string, status: Status) => {
        const actionEvent: AnnotationActionEvent = {
            annotation: { id },
            meta: { status },
        };
        eventEmitter.emit('annotations_delete', actionEvent);
    };

    const emitDeleteAnnotationStartEvent = (id: string) => {
        emitDeleteAnnotationEvent(id, Status.PENDING);
    };
    const emitDeleteAnnotationEndEvent = (id: string) => {
        emitDeleteAnnotationEvent(id, Status.SUCCESS);
        eventEmitter.emit('annotations_remove', id);
    };

    const emitUpdateAnnotationEvent = (annotation: Object, status: Status) => {
        const actionEvent: AnnotationActionEvent = {
            annotation,
            meta: { status },
        };
        eventEmitter.emit('annotations_update', actionEvent);
    };

    const emitUpdateAnnotationStartEvent = (annotation: Object) => {
        emitUpdateAnnotationEvent(annotation, Status.PENDING);
    };
    const emitUpdateAnnotationEndEvent = (annotation: Object) => {
        emitUpdateAnnotationEvent(annotation, Status.SUCCESS);
    };

    const emitUpdateAnnotationReplyEvent = (reply: Object, annotationId: string, status: Status) => {
        const actionEvent: AnnotationActionEvent = {
            annotation: { id: annotationId },
            annotationReply: reply,
            meta: { status },
        };
        eventEmitter.emit('annotations_reply_update', actionEvent);
    };

    const emitUpdateAnnotationReplyStartEvent = (reply: Object, annotationId: string) => {
        emitUpdateAnnotationReplyEvent(reply, annotationId, Status.PENDING);
    };
    const emitUpdateAnnotationReplyEndEvent = (reply: Object, annotationId: string) => {
        emitUpdateAnnotationReplyEvent(reply, annotationId, Status.SUCCESS);
    };

    const emitDeleteAnnotationReplyEvent = (id: string, annotationId: string, status: Status) => {
        const actionEvent: AnnotationActionEvent = {
            annotation: { id: annotationId },
            annotationReply: { id },
            meta: { status },
        };
        eventEmitter.emit('annotations_reply_delete', actionEvent);
    };

    const emitDeleteAnnotationReplyStartEvent = (id: string, annotationId: string) => {
        emitDeleteAnnotationReplyEvent(id, annotationId, Status.PENDING);
    };
    const emitDeleteAnnotationReplyEndEvent = (id: string, annotationId: string) => {
        emitDeleteAnnotationReplyEvent(id, annotationId, Status.SUCCESS);
    };

    const emitAddAnnotationReplyEvent = (reply: Object, annotationId: string, requestId: string, status: Status) => {
        const actionEvent: AnnotationActionEvent = {
            annotation: { id: annotationId },
            annotationReply: reply,
            meta: { status, requestId },
        };
        eventEmitter.emit('annotations_reply_create', actionEvent);
    };

    const emitAddAnnotationReplyStartEvent = (reply: Object, annotationId: string, requestId: string) => {
        emitAddAnnotationReplyEvent(reply, annotationId, requestId, Status.PENDING);
    };
    const emitAddAnnotationReplyEndEvent = (reply: Object, annotationId: string, requestId: string) => {
        emitAddAnnotationReplyEvent(reply, annotationId, requestId, Status.SUCCESS);
    };

    React.useEffect(() => {
        eventEmitter.addListener('annotations_active_set', onSidebarAnnotationSelected);
        eventEmitter.addListener('annotations_remove', onAnnotationDeleteEnd);
        eventEmitter.addListener('annotations_remove_start', onAnnotationDeleteStart);
        eventEmitter.addListener('sidebar.annotations_update', onAnnotationUpdateEnd);
        eventEmitter.addListener('sidebar.annotations_update_start', onAnnotationUpdateStart);
        eventEmitter.addListener('sidebar.annotations_reply_create', onAnnotationReplyAddEnd);
        eventEmitter.addListener('sidebar.annotations_reply_create_start', onAnnotationReplyAddStart);
        eventEmitter.addListener('sidebar.annotations_reply_delete', onAnnotationReplyDeleteEnd);
        eventEmitter.addListener('sidebar.annotations_reply_delete_start', onAnnotationReplyDeleteStart);
        eventEmitter.addListener('sidebar.annotations_reply_update', onAnnotationReplyUpdateEnd);
        eventEmitter.addListener('sidebar.annotations_reply_update_start', onAnnotationReplyUpdateStart);
        return () => {
            eventEmitter.removeListener('annotations_active_set', onSidebarAnnotationSelected);
            eventEmitter.removeListener('annotations_remove', onAnnotationDeleteEnd);
            eventEmitter.removeListener('annotations_remove_start', onAnnotationDeleteStart);
            eventEmitter.removeListener('sidebar.annotations_update', onAnnotationUpdateEnd);
            eventEmitter.removeListener('sidebar.annotations_update_start', onAnnotationUpdateStart);
            eventEmitter.removeListener('sidebar.annotations_reply_create', onAnnotationReplyAddEnd);
            eventEmitter.removeListener('sidebar.annotations_reply_create_start', onAnnotationReplyAddStart);
            eventEmitter.removeListener('sidebar.annotations_reply_delete', onAnnotationReplyDeleteEnd);
            eventEmitter.removeListener('sidebar.annotations_reply_delete_start', onAnnotationReplyDeleteStart);
            eventEmitter.removeListener('sidebar.annotations_reply_update', onAnnotationReplyUpdateEnd);
            eventEmitter.removeListener('sidebar.annotations_reply_update_start', onAnnotationReplyUpdateStart);
        };
    }, [
        eventEmitter,
        onAnnotationDeleteEnd,
        onAnnotationDeleteStart,
        onAnnotationReplyAddEnd,
        onAnnotationReplyAddStart,
        onAnnotationReplyDeleteEnd,
        onAnnotationReplyDeleteStart,
        onAnnotationReplyUpdateEnd,
        onAnnotationReplyUpdateStart,
        onAnnotationUpdateEnd,
        onAnnotationUpdateStart,
        onSidebarAnnotationSelected,
    ]);

    return {
        emitAddAnnotationEndEvent,
        emitAddAnnotationReplyEndEvent,
        emitAddAnnotationReplyStartEvent,
        emitAddAnnotationStartEvent,
        emitAnnotationActiveChangeEvent,
        emitDeleteAnnotationEndEvent,
        emitDeleteAnnotationReplyEndEvent,
        emitDeleteAnnotationReplyStartEvent,
        emitDeleteAnnotationStartEvent,
        emitUpdateAnnotationEndEvent,
        emitUpdateAnnotationReplyEndEvent,
        emitUpdateAnnotationReplyStartEvent,
        emitUpdateAnnotationStartEvent,
    };
}

export default useAnnotatorEvents;
