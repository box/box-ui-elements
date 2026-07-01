import { Location } from 'history';
import { match } from 'react-router-dom';

export const CREATE = 'create';

export enum Action {
    CREATE_START = 'create_start',
    CREATE_END = 'create_end',
    DELETE_START = 'delete_start',
    DELETE_END = 'delete_end',
    SET_ACTIVE = 'set_active',
    UPDATE_START = 'update_start',
    UPDATE_END = 'update_end',
    REPLY_CREATE_START = 'reply_create_start',
    REPLY_CREATE_END = 'reply_create_end',
    REPLY_DELETE_START = 'reply_delete_start',
    REPLY_DELETE_END = 'reply_delete_end',
    REPLY_UPDATE_START = 'reply_update_start',
    REPLY_UPDATE_END = 'reply_update_end',
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Annotator {
    addListener: (event: string | symbol, listener: (...args: any[]) => void) => void;
    emit: (event: string | symbol, ...args: any[]) => void;
    removeAllListeners: () => void;
    removeListener: (event: string | symbol, listener: (...args: any[]) => void) => void;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface TimelineMarker {
    id: string;
    timestampMs: number;
    type: 'comment' | 'annotation';
}

export interface TimelineMarkerClickPayload {
    id: string;
    timestampMs?: number;
    type?: string;
}

export type TimelineMarkerClickHandler = (payload: TimelineMarkerClickPayload) => void;

export interface AnnotatorState {
    activeAnnotationFileVersionId?: string | null;
    activeAnnotationId?: string | null;
    annotation?: { id?: string } | null;
    annotationReply?: { id?: string } | null;
    action?: Action | null;
    error?: Error | null;
    meta?: Metadata | null;
    origin?: string;
}

export type GetMatchPath = (location?: Location) => match<MatchParams> | null;

// Bridges the imperative box-annotations Annotator into the React tree below.
// Also exposes timeline-marker hooks (setTimelineMarkers /
// addTimelineMarkerClickListener) which talk to the box-content-preview viewer
// through window-level CustomEvents — no direct viewer reference is held by
// the host. Both surfaces share this single provider since they share
// ContentPreview's lifecycle.
export interface AnnotatorContext {
    addTimelineMarkerClickListener?: (handler: TimelineMarkerClickHandler) => () => void;
    emitActiveAnnotationChangeEvent?: (id: string) => void;
    emitAnnotationRemoveEvent?: (id: string, isStartEvent?: boolean) => void;
    emitAnnotationReplyCreateEvent?: (
        reply: Object,
        requestId: string,
        annotationId: string,
        isStartEvent?: boolean,
    ) => void;
    emitAnnotationReplyDeleteEvent?: (id: string, annotationId: string, isStartEvent?: boolean) => void;
    emitAnnotationReplyUpdateEvent?: (reply: Object, annotationId: string, isStartEvent?: boolean) => void;
    emitAnnotationUpdateEvent?: (annotation: Object, isStartEvent?: boolean) => void;
    getAnnotationsMatchPath?: GetMatchPath;
    getAnnotationsPath?: (fileVersionId?: string, annotationId?: string) => string;
    setTimelineMarkers?: (markers: TimelineMarker[]) => void;
    state: AnnotatorState;
}

export enum Status {
    ERROR = 'error',
    PENDING = 'pending',
    SUCCESS = 'success',
}

export type MatchParams = {
    annotationId?: string;
    fileVersionId?: string;
};

export interface Metadata {
    requestId?: string;
    status: Status;
}

export interface AnnotationActionEvent {
    annotation?: Object;
    annotationReply?: Object;
    error?: Error;
    meta: Metadata;
}
