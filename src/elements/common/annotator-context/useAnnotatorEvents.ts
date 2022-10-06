import * as React from 'react';
import AnnotatorContext from './AnnotatorContext';
import { AnnotationActionEvent, Annotator, Status } from './types';

interface useAnnotatorEvents {
    onAnnotationDeleted: (annotationId: string) => void;
    onAnnotationSelected: (annotationId: string) => void;
    onAnnotationUpdated: (annotation: Object) => void;
}

const annotatorNotDefinedError = new Error('Annotator not defined');

const updateAnnotation = (annotator: Annotator | null, annotation: Object, status: Status) => {
    if (!annotator) {
        throw annotatorNotDefinedError;
    }
    const actionEvent: AnnotationActionEvent = {
        annotation,
        meta: {
            // TODO: Potentialy make requestId optional - not needed for all actions except Creation
            requestId: '',
            status,
        },
    };
    annotator.emit('annotations_update', actionEvent);
};

function useAnnotatorEvents({ onAnnotationDeleted, onAnnotationSelected, onAnnotationUpdated }: useAnnotatorEvents) {
    const { annotator } = React.useContext(AnnotatorContext);

    const setActiveAnnotation = (annotationId: string | null, fileVersionId: string) => {
        if (!annotator) {
            throw annotatorNotDefinedError;
        }
        annotator.emit('annotations_active_change', { annotationId, fileVersionId });
    };

    const updateAnnotationStart = (annotation: Object) => {
        updateAnnotation(annotator, annotation, Status.PENDING);
    };
    const updateAnnotationEnd = (annotation: Object) => {
        updateAnnotation(annotator, annotation, Status.SUCCESS);
    };

    const annotationSelectedListener = (annotationId: string) => {
        if (onAnnotationSelected) {
            onAnnotationSelected(annotationId);
        }
    };
    const annotationDeletedListener = (annotationId: string) => {
        if (onAnnotationDeleted) {
            onAnnotationDeleted(annotationId);
        }
    };
    const annotationUpdateListener = (annotation: Object) => {
        if (onAnnotationUpdated) {
            onAnnotationUpdated(annotation);
        }
    };

    React.useEffect(() => {
        if (annotator) {
            annotator.addListener('annotations_active_set', annotationSelectedListener);
            annotator.addListener('annotations_remove', annotationDeletedListener);
            annotator.addListener('annotations_update_sidebar', annotationUpdateListener);
        }
        return () => {
            if (annotator) {
                annotator.removeListener('annotations_active_set', annotationSelectedListener);
                annotator.removeListener('annotations_remove', annotationDeletedListener);
                annotator.removeListener('annotations_update_sidebar', annotationUpdateListener);
            }
        };
    });

    return {
        setActiveAnnotation,
        updateAnnotationEnd,
        updateAnnotationStart,
    };
}

export default useAnnotatorEvents;
