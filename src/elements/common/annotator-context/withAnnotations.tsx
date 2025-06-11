import * as React from 'react';
import getProp from 'lodash/get';
import { generatePath, match as matchType, matchPath } from 'react-router-dom';
import { Location } from 'history';
import AnnotatorContext from './AnnotatorContext';
import { Action, Annotator, AnnotationActionEvent, AnnotatorState, GetMatchPath, MatchParams, Status } from './types';
import { FeedEntryType, SidebarNavigation } from '../types/SidebarNavigation';

export type ActiveChangeEvent = {
    annotationId: string | null;
    fileVersionId: string;
};

export type ActiveChangeEventHandler = (event: ActiveChangeEvent) => void;

export type ComponentWithAnnotations = {
    emitActiveAnnotationChangeEvent: (id: string | null) => void;
    emitAnnotationRemoveEvent: (id: string, isStartEvent?: boolean) => void;
    emitAnnotationReplyCreateEvent: (
        reply: Object,
        requestId: string,
        annotationId: string,
        isStartEvent?: boolean,
    ) => void;
    emitAnnotationReplyDeleteEvent: (id: string, annotationId: string, isStartEvent?: boolean) => void;
    emitAnnotationReplyUpdateEvent: (reply: Object, annotationId: string, isStartEvent?: boolean) => void;
    emitAnnotationUpdateEvent: (annotation: Object, isStartEvent?: boolean) => void;
    getAction: (eventData: AnnotationActionEvent) => Action;
    getAnnotationsPath: (fileVersionId?: string, annotationId?: string | null) => string;
    getMatchPath: GetMatchPath;
    handleActiveChange: ActiveChangeEventHandler;
    handleAnnotationChangeEvent: (id: string | null) => void;
    handleAnnotationCreate: (eventData: AnnotationActionEvent) => void;
    handleAnnotationDelete: (eventData: AnnotationActionEvent) => void;
    handleAnnotationFetchError: ({ error }: { error: Error }) => void;
    handleAnnotationReplyCreate: (eventData: AnnotationActionEvent) => void;
    handleAnnotationReplyDelete: (eventData: AnnotationActionEvent) => void;
    handleAnnotationReplyUpdate: (eventData: AnnotationActionEvent) => void;
    handleAnnotationUpdate: (eventData: AnnotationActionEvent) => void;
    handleAnnotator: (annotator: Annotator) => void;
    handlePreviewDestroy: (shouldReset?: boolean) => void;
};

export type WithAnnotationsProps = {
    location?: Location;
    onAnnotator: (annotator: Annotator) => void;
    onError?: (error: Error, code: string, contextInfo?: Record<string, unknown>) => void;
    onPreviewDestroy: (shouldReset?: boolean) => void;
    routerDisabled?: boolean;
    sidebarNavigation?: SidebarNavigation;
};

export type WithAnnotationsComponent<P> = React.ComponentClass<P & WithAnnotationsProps>;

const ANNOTATIONS_PATH = '/:sidebar/annotations/:fileVersionId/:annotationId?';
const defaultState: AnnotatorState = {
    action: null,
    activeAnnotationFileVersionId: null,
    activeAnnotationId: null,
    annotation: null,
    annotationReply: null,
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

            const { routerDisabled, sidebarNavigation } = props;
            let activeAnnotationId = null;

            if (
                routerDisabled &&
                'activeFeedEntryType' in sidebarNavigation &&
                sidebarNavigation.activeFeedEntryType === FeedEntryType.ANNOTATIONS &&
                'activeFeedEntryId' in sidebarNavigation
            ) {
                activeAnnotationId = sidebarNavigation.activeFeedEntryId;
            } else {
                // Determine by url if there is already a deeply linked annotation
                const { location } = props;
                const match = this.getMatchPath(location);
                activeAnnotationId = getProp(match, 'params.annotationId', null);
            }

            // Seed the initial state with the activeAnnotationId if any from the location path
            this.state = { ...defaultState, activeAnnotationId };
        }

        emitActiveAnnotationChangeEvent = (id: string | null) => {
            const { annotator } = this;

            if (!annotator) {
                return;
            }

            annotator.emit('annotations_active_set', id);
        };

        emitAnnotationRemoveEvent = (id: string, isStartEvent = false) => {
            const { annotator } = this;

            if (!annotator) {
                return;
            }

            // Event name does not include "sidebar" namespace because of backwards compatibility with Preview
            const event = isStartEvent ? 'annotations_remove_start' : 'annotations_remove';

            annotator.emit(event, id);
        };

        emitAnnotationUpdateEvent = (annotation: Object, isStartEvent = false) => {
            const { annotator } = this;

            if (!annotator) {
                return;
            }

            const event = isStartEvent ? 'sidebar.annotations_update_start' : 'sidebar.annotations_update';

            annotator.emit(event, annotation);
        };

        emitAnnotationReplyCreateEvent = (
            reply: Object,
            requestId: string,
            annotationId: string,
            isStartEvent = false,
        ) => {
            const { annotator } = this;

            if (!annotator) {
                return;
            }

            const event = isStartEvent ? 'sidebar.annotations_reply_create_start' : 'sidebar.annotations_reply_create';

            annotator.emit(event, { annotationId, reply, requestId });
        };

        emitAnnotationReplyDeleteEvent = (id: string, annotationId: string, isStartEvent = false) => {
            const { annotator } = this;

            if (!annotator) {
                return;
            }

            const event = isStartEvent ? 'sidebar.annotations_reply_delete_start' : 'sidebar.annotations_reply_delete';

            annotator.emit(event, { annotationId, id });
        };

        emitAnnotationReplyUpdateEvent = (reply: Object, annotationId: string, isStartEvent = false) => {
            const { annotator } = this;

            if (!annotator) {
                return;
            }

            const event = isStartEvent ? 'sidebar.annotations_reply_update_start' : 'sidebar.annotations_reply_update';

            annotator.emit(event, { annotationId, reply });
        };

        getAction({ meta: { status }, error }: AnnotationActionEvent): Action {
            return status === Status.SUCCESS || error ? Action.CREATE_END : Action.CREATE_START;
        }

        getDeleteAction({ meta: { status }, error }: AnnotationActionEvent): Action {
            return status === Status.SUCCESS || error ? Action.DELETE_END : Action.DELETE_START;
        }

        getUpdateAction({ meta: { status }, error }: AnnotationActionEvent): Action {
            return status === Status.SUCCESS || error ? Action.UPDATE_END : Action.UPDATE_START;
        }

        getReplyCreateAction({ meta: { status }, error }: AnnotationActionEvent): Action {
            return status === Status.SUCCESS || error ? Action.REPLY_CREATE_END : Action.REPLY_CREATE_START;
        }

        getReplyDeleteAction({ meta: { status }, error }: AnnotationActionEvent): Action {
            return status === Status.SUCCESS || error ? Action.REPLY_DELETE_END : Action.REPLY_DELETE_START;
        }

        getReplyUpdateAction({ meta: { status }, error }: AnnotationActionEvent): Action {
            return status === Status.SUCCESS || error ? Action.REPLY_UPDATE_END : Action.REPLY_UPDATE_START;
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

        // remove this method with routerDisabled swith
        getMatchPath(location?: Location): matchType<MatchParams> | null {
            const pathname = getProp(location, 'pathname', '');
            return matchPath<MatchParams>(pathname, {
                path: ANNOTATIONS_PATH,
                exact: true,
            });
        }

        handleAnnotationCreate = (eventData: AnnotationActionEvent): void => {
            const { annotation = null, error = null, meta = null } = eventData;
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
            });
        };

        handleAnnotationDelete = (eventData: AnnotationActionEvent) => {
            const { annotation = null, error = null, meta = null } = eventData;

            this.setState({
                action: this.getDeleteAction(eventData),
                annotation,
                error,
                meta,
            });
        };

        handleAnnotationUpdate = (eventData: AnnotationActionEvent) => {
            const { annotation = null, error = null, meta = null } = eventData;

            this.setState({
                action: this.getUpdateAction(eventData),
                annotation,
                error,
                meta,
            });
        };

        handleAnnotationReplyCreate = (eventData: AnnotationActionEvent) => {
            const { annotation = null, annotationReply = null, error = null, meta = null } = eventData;

            this.setState({
                action: this.getReplyCreateAction(eventData),
                annotation,
                annotationReply,
                error,
                meta,
            });
        };

        handleAnnotationReplyDelete = (eventData: AnnotationActionEvent) => {
            const { annotation = null, annotationReply = null, error = null, meta = null } = eventData;

            this.setState({
                action: this.getReplyDeleteAction(eventData),
                annotation,
                annotationReply,
                error,
                meta,
            });
        };

        handleAnnotationReplyUpdate = (eventData: AnnotationActionEvent) => {
            const { annotation = null, annotationReply = null, error = null, meta = null } = eventData;

            this.setState({
                action: this.getReplyUpdateAction(eventData),
                annotation,
                annotationReply,
                error,
                meta,
            });
        };

        handleActiveChange: ActiveChangeEventHandler = ({ annotationId, fileVersionId }): void => {
            this.setState({ activeAnnotationFileVersionId: fileVersionId, activeAnnotationId: annotationId });
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
            this.annotator.addListener('annotations_delete', this.handleAnnotationDelete);
            this.annotator.addListener('annotations_fetch_error', this.handleAnnotationFetchError);
            this.annotator.addListener('annotations_update', this.handleAnnotationUpdate);
            this.annotator.addListener('annotations_reply_create', this.handleAnnotationReplyCreate);
            this.annotator.addListener('annotations_reply_delete', this.handleAnnotationReplyDelete);
            this.annotator.addListener('annotations_reply_update', this.handleAnnotationReplyUpdate);
        };

        handlePreviewDestroy = (shouldReset = true): void => {
            if (shouldReset) {
                this.setState(defaultState);
            }

            if (this.annotator) {
                this.annotator.removeListener('annotations_active_change', this.handleActiveChange);
                this.annotator.removeListener('annotations_create', this.handleAnnotationCreate);
                this.annotator.removeListener('annotations_delete', this.handleAnnotationDelete);
                this.annotator.removeListener('annotations_fetch_error', this.handleAnnotationFetchError);
                this.annotator.removeListener('annotations_update', this.handleAnnotationUpdate);
                this.annotator.removeListener('annotations_reply_create', this.handleAnnotationReplyCreate);
                this.annotator.removeListener('annotations_reply_delete', this.handleAnnotationReplyDelete);
                this.annotator.removeListener('annotations_reply_update', this.handleAnnotationReplyUpdate);
            }

            this.annotator = null;
        };

        render(): JSX.Element {
            return (
                <AnnotatorContext.Provider
                    value={{
                        ...{
                            emitActiveAnnotationChangeEvent: this.emitActiveAnnotationChangeEvent,
                            emitAnnotationRemoveEvent: this.emitAnnotationRemoveEvent,
                            emitAnnotationReplyCreateEvent: this.emitAnnotationReplyCreateEvent,
                            emitAnnotationReplyDeleteEvent: this.emitAnnotationReplyDeleteEvent,
                            emitAnnotationReplyUpdateEvent: this.emitAnnotationReplyUpdateEvent,
                            emitAnnotationUpdateEvent: this.emitAnnotationUpdateEvent,
                        },
                        ...(this.props?.routerDisabled
                            ? {}
                            : {
                                  getAnnotationsMatchPath: this.getMatchPath,
                                  getAnnotationsPath: this.getAnnotationsPath,
                              }),
                        ...{ state: this.state },
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
