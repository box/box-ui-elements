import * as React from 'react';
import { EventEmitter } from 'events';
import noop from 'lodash/noop';
import { AnnotationActionEvent, Status } from './types';

export interface UseAnnotatorEventsProps {
    eventEmitter: EventEmitter;
    onAnnotationDeleteEnd?: (annotationId: string) => void;
    onAnnotationDeleteStart?: (annotationId: string) => void;
    onAnnotationUpdateEnd?: (annotation: Object) => void;
    onAnnotationUpdateStart?: (annotation: Object) => void;
    onSidebarAnnotationSelected?: (annotationId: string) => void;
}

function useAnnotatorEvents({
    eventEmitter,
    onAnnotationDeleteEnd = noop,
    onAnnotationDeleteStart = noop,
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

    React.useEffect(() => {
        eventEmitter.addListener('annotations_active_set', onSidebarAnnotationSelected);
        eventEmitter.addListener('annotations_remove', onAnnotationDeleteEnd);
        eventEmitter.addListener('annotations_remove_start', onAnnotationDeleteStart);
        eventEmitter.addListener('sidebar.annotations_update', onAnnotationUpdateEnd);
        eventEmitter.addListener('sidebar.annotations_update_start', onAnnotationUpdateStart);
        return () => {
            eventEmitter.removeListener('annotations_active_set', onSidebarAnnotationSelected);
            eventEmitter.removeListener('annotations_remove', onAnnotationDeleteEnd);
            eventEmitter.removeListener('annotations_remove_start', onAnnotationDeleteStart);
            eventEmitter.removeListener('sidebar.annotations_update', onAnnotationUpdateEnd);
            eventEmitter.removeListener('sidebar.annotations_update_start', onAnnotationUpdateStart);
        };
    });

    return {
        emitAddAnnotationEndEvent,
        emitAddAnnotationStartEvent,
        emitAnnotationActiveChangeEvent,
        emitDeleteAnnotationEndEvent,
        emitDeleteAnnotationStartEvent,
        emitUpdateAnnotationEndEvent,
        emitUpdateAnnotationStartEvent,
    };
}

export default useAnnotatorEvents;
