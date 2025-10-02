/// <reference types="node" />
import { EventEmitter } from 'events';
export interface UseAnnotatorEventsProps {
    eventEmitter: EventEmitter;
    onAnnotationDeleteEnd?: (annotationId: string) => void;
    onAnnotationDeleteStart?: (annotationId: string) => void;
    onAnnotationReplyAddEnd?: (eventData: {
        annotationId: string;
        reply: Object;
        requestId: string;
    }) => void;
    onAnnotationReplyAddStart?: (eventData: {
        annotationId: string;
        reply: Object;
        requestId: string;
    }) => void;
    onAnnotationReplyDeleteEnd?: (eventData: {
        annotationId: string;
        id: string;
    }) => void;
    onAnnotationReplyDeleteStart?: (eventData: {
        annotationId: string;
        id: string;
    }) => void;
    onAnnotationReplyUpdateEnd?: (eventData: {
        annotationId: string;
        reply: Object;
    }) => void;
    onAnnotationReplyUpdateStart?: (eventData: {
        annotationId: string;
        reply: Object;
    }) => void;
    onAnnotationUpdateEnd?: (annotation: Object) => void;
    onAnnotationUpdateStart?: (annotation: Object) => void;
    onSidebarAnnotationSelected?: (annotationId: string) => void;
}
declare function useAnnotatorEvents({ eventEmitter, onAnnotationDeleteEnd, onAnnotationDeleteStart, onAnnotationReplyAddEnd, onAnnotationReplyAddStart, onAnnotationReplyDeleteEnd, onAnnotationReplyDeleteStart, onAnnotationReplyUpdateEnd, onAnnotationReplyUpdateStart, onAnnotationUpdateEnd, onAnnotationUpdateStart, onSidebarAnnotationSelected, }: UseAnnotatorEventsProps): {
    emitAddAnnotationEndEvent: (annotation: Object, requestId: string) => void;
    emitAddAnnotationReplyEndEvent: (reply: Object, annotationId: string, requestId: string) => void;
    emitAddAnnotationReplyStartEvent: (reply: Object, annotationId: string, requestId: string) => void;
    emitAddAnnotationStartEvent: (annotation: Object, requestId: string) => void;
    emitAnnotationActiveChangeEvent: (annotationId: string | null, fileVersionId: string) => void;
    emitDeleteAnnotationEndEvent: (id: string) => void;
    emitDeleteAnnotationReplyEndEvent: (id: string, annotationId: string) => void;
    emitDeleteAnnotationReplyStartEvent: (id: string, annotationId: string) => void;
    emitDeleteAnnotationStartEvent: (id: string) => void;
    emitUpdateAnnotationEndEvent: (annotation: Object) => void;
    emitUpdateAnnotationReplyEndEvent: (reply: Object, annotationId: string) => void;
    emitUpdateAnnotationReplyStartEvent: (reply: Object, annotationId: string) => void;
    emitUpdateAnnotationStartEvent: (annotation: Object) => void;
};
export default useAnnotatorEvents;
