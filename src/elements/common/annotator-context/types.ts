export const CREATE: 'create' = 'create';

export enum Action {
    CREATE_START = 'create_start',
    CREATE_END = 'create_end',
    // Can extend to other actions: update_start, update_end, delete_start, delete_end
}

export interface Annotator {
    addListener: (event: string | symbol, listener: (...args: any[]) => void) => void;
    emit: (event: string | symbol, ...args: any[]) => void;
    removeListener: (event: string | symbol, listener: (...args: any[]) => void) => void;
}

export interface AnnotatorState {
    activeAnnotationId?: string | null;
    annotation?: object | null;
    action?: Action | null;
    error?: Error | null;
}

export interface AnnotatorContext {
    state: AnnotatorState;
    emitActiveChangeEvent: (id: string) => void;
}

export enum Status {
    ERROR = 'error',
    PENDING = 'pending',
    SUCCESS = 'success',
}

export interface Metadata {
    status: Status;
}

export interface AnnotationActionEvent {
    annotation?: object;
    error?: Error;
    meta: Metadata;
}
