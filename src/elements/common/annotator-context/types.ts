import { Location } from 'history';
import { match } from 'react-router-dom';
import { ActiveChangeEventHandler } from './withAnnotations';

export const CREATE = 'create';

export enum Action {
    CREATE_START = 'create_start',
    CREATE_END = 'create_end',
    DELETE_START = 'delete_start',
    DELETE_END = 'delete_end',
    SET_ACTIVE = 'set_active',
    UPDATE_START = 'update_start',
    UPDATE_END = 'update_end',
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Annotator {
    addListener: (event: string | symbol, listener: (...args: any[]) => void) => void;
    emit: (event: string | symbol, ...args: any[]) => void;
    removeAllListeners: () => void;
    removeListener: (event: string | symbol, listener: (...args: any[]) => void) => void;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface AnnotatorState {
    activeAnnotationFileVersionId?: string | null;
    activeAnnotationId?: string | null;
    annotation?: { id?: string } | null;
    action?: Action | null;
    error?: Error | null;
    meta?: Metadata | null;
    origin?: string;
}

export type GetMatchPath = (location?: Location) => match<MatchParams> | null;

export interface AnnotatorContext {
    getAnnotationsMatchPath: GetMatchPath;
    getAnnotationsPath: (fileVersionId?: string, annotationId?: string) => string;
    publishActiveAnnotationChange: ActiveChangeEventHandler;
    publishActiveAnnotationChangeInSidebar: (id: string | null) => void;
    publishAnnotationDeleteEnd: (id: string, origin?: string) => void;
    publishAnnotationDeleteStart: (id: string, origin?: string) => void;
    publishAnnotationUpdateEnd: (annotation: Object, origin?: string) => void;
    publishAnnotationUpdateStart: (annotation: Object, origin?: string) => void;
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
    requestId: string;
    status: Status;
}

export interface AnnotationActionEvent {
    annotation?: object;
    error?: Error;
    meta: Metadata;
    origin?: string;
}
