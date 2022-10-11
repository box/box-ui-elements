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
        emitAnnotationActiveChangeEvent,
        emitUpdateAnnotationEndEvent,
        emitUpdateAnnotationStartEvent,
    };
}

export default useAnnotatorEvents;
