import * as React from 'react';
import { EventEmitter } from 'events';
import { AnnotationActionEvent, Status } from './types';

export interface UseAnnotatorEventsProps {
    eventEmitter: EventEmitter;
    onAnnotationDeleteEnd?: (annotationId: string) => void;
    onAnnotationDeleteStart?: (annotationId: string) => void;
    onAnnotationUpdateEnd?: (annotation: Object) => void;
    onAnnotationUpdateStart?: (annotation: Object) => void;
    onSidebarAnnotationSelected?: (annotationId: string) => void;
}

const emitUpdateAnnotationEvent = (eventEmitter: EventEmitter, annotation: Object, status: Status) => {
    const actionEvent: AnnotationActionEvent = {
        annotation,
        meta: { status },
    };
    eventEmitter.emit('annotations_update', actionEvent);
};

function useAnnotatorEvents({
    eventEmitter,
    onAnnotationDeleteEnd,
    onAnnotationDeleteStart,
    onAnnotationUpdateEnd,
    onAnnotationUpdateStart,
    onSidebarAnnotationSelected,
}: UseAnnotatorEventsProps) {
    const emitAnnotationActiveChangeEvent = (annotationId: string | null, fileVersionId: string) => {
        eventEmitter.emit('annotations_active_change', { annotationId, fileVersionId });
    };

    const emitUpdateAnnotationStartEvent = (annotation: Object) => {
        emitUpdateAnnotationEvent(eventEmitter, annotation, Status.PENDING);
    };
    const emitUpdateAnnotationEndEvent = (annotation: Object) => {
        emitUpdateAnnotationEvent(eventEmitter, annotation, Status.SUCCESS);
    };

    const annotationSidebarSelectedListener = (annotationId: string) => {
        if (onSidebarAnnotationSelected) {
            onSidebarAnnotationSelected(annotationId);
        }
    };

    const annotationDeleteStartListener = (annotationId: string) => {
        if (onAnnotationDeleteStart) {
            onAnnotationDeleteStart(annotationId);
        }
    };
    const annotationDeleteEndListener = (annotationId: string) => {
        if (onAnnotationDeleteEnd) {
            onAnnotationDeleteEnd(annotationId);
        }
    };

    const annotationUpdateStartListener = (annotation: Object) => {
        if (onAnnotationUpdateStart) {
            onAnnotationUpdateStart(annotation);
        }
    };
    const annotationUpdateEndListener = (annotation: Object) => {
        if (onAnnotationUpdateEnd) {
            onAnnotationUpdateEnd(annotation);
        }
    };

    React.useEffect(() => {
        eventEmitter.addListener('annotations_active_set', annotationSidebarSelectedListener);
        eventEmitter.addListener('annotations_remove', annotationDeleteEndListener);
        eventEmitter.addListener('annotations_remove_start', annotationDeleteStartListener);
        eventEmitter.addListener('sidebar.annotations_update', annotationUpdateEndListener);
        eventEmitter.addListener('sidebar.annotations_update_start', annotationUpdateStartListener);
        return () => {
            eventEmitter.removeListener('annotations_active_set', annotationSidebarSelectedListener);
            eventEmitter.removeListener('annotations_remove', annotationDeleteEndListener);
            eventEmitter.removeListener('annotations_remove_start', annotationDeleteStartListener);
            eventEmitter.removeListener('sidebar.annotations_update', annotationUpdateEndListener);
            eventEmitter.removeListener('sidebar.annotations_update_start', annotationUpdateStartListener);
        };
    });

    return {
        emitAnnotationActiveChangeEvent,
        emitUpdateAnnotationEndEvent,
        emitUpdateAnnotationStartEvent,
    };
}

export default useAnnotatorEvents;
