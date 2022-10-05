import * as React from 'react';
import AnnotatorContext from './AnnotatorContext';
import { Action } from './types';

export interface UseAnnotatorEventsProps {
    onAnnotationDeleteEnd?: (annotationId: string) => void;
    onAnnotationDeleteStart?: (annotationId: string) => void;
    onAnnotationUpdateEnd?: (annotation: Object) => void;
    onAnnotationUpdateStart?: (annotation: Object) => void;
    onSidebarAnnotationSelected?: (annotationId: string | null) => void;
    origin?: string;
}

function useAnnotatorEvents({
    onAnnotationDeleteEnd,
    onAnnotationDeleteStart,
    onAnnotationUpdateEnd,
    onAnnotationUpdateStart,
    onSidebarAnnotationSelected,
    origin: originProp,
}: UseAnnotatorEventsProps) {
    const {
        publishActiveAnnotationChange: publishActiveAnnotationChangeToContext,
        publishAnnotationUpdateEnd: publishAnnotationUpdateEndToContext,
        publishAnnotationUpdateStart: publishAnnotationUpdateStartToContext,
        state: { action, activeAnnotationId = null, annotation, origin },
    } = React.useContext(AnnotatorContext);

    const publishActiveAnnotationChange = (annotationId: string | null, fileVersionId: string) => {
        publishActiveAnnotationChangeToContext({ annotationId, fileVersionId, origin: originProp });
    };

    const publishAnnotationUpdateStart = (annotationData: Object) => {
        publishAnnotationUpdateStartToContext(annotationData, originProp);
    };
    const publishAnnotationUpdateEnd = (annotationData: Object) => {
        publishAnnotationUpdateEndToContext(annotationData, originProp);
    };

    // Take action only if change has not originated from the hook user
    if (origin !== originProp) {
        if (action === Action.DELETE_START && annotation?.id && onAnnotationDeleteStart) {
            onAnnotationDeleteStart(annotation.id);
        } else if (action === Action.DELETE_END && annotation?.id && onAnnotationDeleteEnd) {
            onAnnotationDeleteEnd(annotation.id);
        } else if (action === Action.UPDATE_START && annotation && onAnnotationUpdateStart) {
            onAnnotationUpdateStart(annotation);
        } else if (action === Action.UPDATE_END && annotation && onAnnotationUpdateEnd) {
            onAnnotationUpdateEnd(annotation);
        }
    }

    // Take action only if annotation became active in Sidebar
    if (origin === 'sidebar' && action === Action.SET_ACTIVE && onSidebarAnnotationSelected) {
        onSidebarAnnotationSelected(activeAnnotationId);
    }

    return {
        onAnnotationDeleteEnd,
        onAnnotationDeleteStart,
        onSidebarAnnotationSelected,
        publishActiveAnnotationChange,
        publishAnnotationUpdateEnd,
        publishAnnotationUpdateStart,
    };
}

export default useAnnotatorEvents;
