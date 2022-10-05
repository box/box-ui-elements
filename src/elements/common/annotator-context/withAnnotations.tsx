import * as React from 'react';
import getProp from 'lodash/get';
import { generatePath, match as matchType, matchPath } from 'react-router-dom';
import { Location } from 'history';
import AnnotatorContext from './AnnotatorContext';
import { Action, Annotator, AnnotationActionEvent, AnnotatorState, GetMatchPath, MatchParams, Status } from './types';

export type ActiveChangeEvent = {
    annotationId: string | null;
    fileVersionId: string;
    origin?: string;
};

export type ActiveChangeEventHandler = (event: ActiveChangeEvent) => void;

// TODO: Check and update this type:
export type ComponentWithAnnotations = {
    emitActiveChangeEvent: (id: string | null) => void;
    emitRemoveEvent: (id: string) => void;
    getAction: (eventData: AnnotationActionEvent) => Action;
    getAnnotationsPath: (fileVersionId?: string, annotationId?: string | null) => string;
    getMatchPath: GetMatchPath;
    handleActiveChange: ActiveChangeEventHandler;
    handleAnnotationChangeEvent: (id: string | null) => void;
    handleAnnotationCreate: (eventData: AnnotationActionEvent) => void;
    handleAnnotationFetchError: ({ error }: { error: Error }) => void;
    handleAnnotator: (annotator: Annotator) => void;
    handlePreviewDestroy: (shouldReset?: boolean) => void;
    publishActiveAnnotationChangeInSidebar: (id: string | null) => void;
    publishAnnotationDelete: (id: string, action: Action.DELETE_START | Action.DELETE_END, origin: string) => void;
    publishAnnotationDeleteEnd: (id: string, origin?: string) => void;
    publishAnnotationDeleteStart: (id: string, origin?: string) => void;
    publishAnnotationUpdate: (annotation: Object, action: Action, origin: string) => void;
    publishAnnotationUpdateEnd: (annotation: Object, origin?: string) => void;
    publishAnnotationUpdateStart: (annotation: Object, origin?: string) => void;
};

export type WithAnnotationsProps = {
    location?: Location;
    onAnnotator: (annotator: Annotator) => void;
    onError?: (error: Error, code: string, contextInfo?: Record<string, unknown>) => void;
    onPreviewDestroy: (shouldReset?: boolean) => void;
};

export type WithAnnotationsComponent<P> = React.ComponentClass<P & WithAnnotationsProps>;

const ANNOTATIONS_PATH = '/:sidebar/annotations/:fileVersionId/:annotationId?';
const defaultState: AnnotatorState = {
    action: null,
    activeAnnotationFileVersionId: null,
    activeAnnotationId: null,
    annotation: null,
    error: null,
    meta: null,
};

export default function withAnnotations<P extends object>(
    WrappedComponent: React.ComponentType<P>,
): WithAnnotationsComponent<P> {
    class ComponentWithAnnotations extends React.Component<P & WithAnnotationsProps, AnnotatorState> {
        static displayName: string;

        annotator: Annotator | null = null;

        constructor(props: P & WithAnnotationsProps) {
            super(props);

            // Determine by url if there is already a deeply linked annotation
            const { location } = props;
            const match = this.getMatchPath(location);
            const activeAnnotationId = getProp(match, 'params.annotationId', null);

            // Seed the initial state with the activeAnnotationId if any from the location path
            this.state = { ...defaultState, activeAnnotationId };
        }

        emitActiveChangeEvent = (id: string | null) => {
            const { annotator } = this;

            if (!annotator) {
                return;
            }

            annotator.emit('annotations_active_set', id);
        };

        emitRemoveEvent = (id: string) => {
            const { annotator } = this;

            if (!annotator) {
                return;
            }

            annotator.emit('annotations_remove', id);
        };

        getAction({ meta: { status }, error }: AnnotationActionEvent): Action {
            return status === Status.SUCCESS || error ? Action.CREATE_END : Action.CREATE_START;
        }

        getAnnotationsPath(fileVersionId?: string, annotationId?: string | null): string {
            if (!fileVersionId) {
                return '/activity';
            }

            return generatePath(ANNOTATIONS_PATH, {
                sidebar: 'activity',
                annotationId: annotationId || undefined,
                fileVersionId,
            });
        }

        getMatchPath(location?: Location): matchType<MatchParams> | null {
            const pathname = getProp(location, 'pathname', '');
            return matchPath<MatchParams>(pathname, {
                path: ANNOTATIONS_PATH,
                exact: true,
            });
        }

        handleAnnotationCreate = (eventData: AnnotationActionEvent): void => {
            const { annotation = null, error = null, meta = null, origin } = eventData;
            const { onError } = this.props;

            if (onError && error) {
                onError(error, 'create_annotation_error', { showNotification: true });
            }

            this.setState({
                ...this.state,
                action: this.getAction(eventData),
                annotation,
                error,
                meta,
                origin,
            });
        };

        // Handle active annotation change done outside of Sidebar
        handleActiveChange: ActiveChangeEventHandler = ({ annotationId, fileVersionId, origin }): void => {
            this.setState({
                action: Action.SET_ACTIVE,
                activeAnnotationFileVersionId: fileVersionId,
                activeAnnotationId: annotationId,
                origin,
            });
        };

        handleAnnotationFetchError = ({ error }: { error: Error }): void => {
            const { onError } = this.props;

            if (onError && error) {
                onError(error, 'fetch_annotations_error', { showNotification: true });
            }
        };

        handleAnnotator = (annotator: Annotator): void => {
            this.annotator = annotator;
            this.annotator.addListener('annotations_active_change', this.handleActiveChange);
            this.annotator.addListener('annotations_create', this.handleAnnotationCreate);
            this.annotator.addListener('annotations_fetch_error', this.handleAnnotationFetchError);
        };

        handlePreviewDestroy = (shouldReset = true): void => {
            if (shouldReset) {
                this.setState(defaultState);
            }

            if (this.annotator) {
                this.annotator.removeListener('annotations_active_change', this.handleActiveChange);
                this.annotator.removeListener('annotations_create', this.handleAnnotationCreate);
                this.annotator.removeListener('annotations_fetch_error', this.handleAnnotationFetchError);
            }

            this.annotator = null;
        };

        // Publish active annotation change done in Sidebar
        publishActiveAnnotationChangeInSidebar = (id: string | null) => {
            this.setState({
                ...this.state,
                action: Action.SET_ACTIVE,
                activeAnnotationId: id,
                origin: 'sidebar',
            });
            this.emitActiveChangeEvent(id);
        };

        publishAnnotationDelete = (id: string, action: Action.DELETE_START | Action.DELETE_END, origin: string) => {
            this.setState({
                ...this.state,
                action,
                annotation: { id },
                origin,
            });
        };

        publishAnnotationDeleteStart = (id: string, origin = 'sidebar') => {
            this.publishAnnotationDelete(id, Action.DELETE_START, origin);
        };

        publishAnnotationDeleteEnd = (id: string, origin = 'sidebar') => {
            this.publishAnnotationDelete(id, Action.DELETE_END, origin);
            this.emitRemoveEvent(id);
        };

        publishAnnotationUpdate = (annotation: Object, action: Action, origin: string) => {
            this.setState({
                ...this.state,
                action,
                annotation,
                origin,
            });
        };

        publishAnnotationUpdateStart = (annotation: Object, origin = 'sidebar') => {
            this.publishAnnotationUpdate(annotation, Action.UPDATE_START, origin);
        };

        publishAnnotationUpdateEnd = (annotation: Object, origin = 'sidebar') => {
            this.publishAnnotationUpdate(annotation, Action.UPDATE_END, origin);
        };

        render(): JSX.Element {
            return (
                <AnnotatorContext.Provider
                    value={{
                        getAnnotationsMatchPath: this.getMatchPath,
                        getAnnotationsPath: this.getAnnotationsPath,
                        publishActiveAnnotationChange: this.handleActiveChange,
                        publishActiveAnnotationChangeInSidebar: this.publishActiveAnnotationChangeInSidebar,
                        publishAnnotationDeleteEnd: this.publishAnnotationDeleteEnd,
                        publishAnnotationDeleteStart: this.publishAnnotationDeleteStart,
                        publishAnnotationUpdateEnd: this.publishAnnotationUpdateEnd,
                        publishAnnotationUpdateStart: this.publishAnnotationUpdateStart,
                        state: this.state,
                    }}
                >
                    <WrappedComponent
                        {...this.props}
                        onAnnotator={this.handleAnnotator}
                        onPreviewDestroy={this.handlePreviewDestroy}
                    />
                </AnnotatorContext.Provider>
            );
        }
    }

    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    ComponentWithAnnotations.displayName = `WithAnnotations(${displayName})`;

    return ComponentWithAnnotations;
}
