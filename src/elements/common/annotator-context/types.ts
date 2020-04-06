export const CREATE: 'create' = 'create';

export enum Action {
    CREATE_START = 'create_start',
    CREATE_END = 'create_end',
    // Can extend to other actions: update_start, update_end, delete_start, delete_end
}

export interface AnnotatorState {
    activeAnnotationId?: string;
    annotation?: object | null;
    action: Action | null;
    error: Error | null;
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
    annotation: object | null;
    error: Error | null;
    meta: Metadata;
}
