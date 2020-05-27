import * as React from 'react';
import getProp from 'lodash/get';
import { match as matchType, matchPath } from 'react-router-dom';
import AnnotatorContext from './AnnotatorContext';
import { Action, Annotator, AnnotationActionEvent, AnnotatorState, GetMatchPath, MatchParams, Status } from './types';

export interface WithAnnotationsProps {
    onAnnotator: (annotator: Annotator) => void;
    onPreviewDestroy: () => void;
}

export interface ComponentWithAnnotations {
    emitActiveChangeEvent: (id: string | null) => void;
    emitRemoveEvent: (id: string) => void;
    getAction: (eventData: AnnotationActionEvent) => Action;
    getMatchPath: GetMatchPath;
    handleActiveChange: (annotationId: string | null) => void;
    handleAnnotationChangeEvent: (id: string | null) => void;
    handleAnnotationCreate: (eventData: AnnotationActionEvent) => void;
    handleAnnotator: (annotator: Annotator) => void;
    handleAnnotatorEvent: ({ event, data }: { event: string; data?: unknown }) => void;
    handlePreviewDestroy: () => void;
}

export type WithAnnotationsComponent<P> = React.ComponentClass<P & WithAnnotationsProps>;

const defaultState: AnnotatorState = {
    action: null,
    activeAnnotationId: null,
    annotation: null,
    error: null,
    meta: null,
};

type WithHistoryProps = {
    history?: History;
};

type ResultProps<P> = P & WithAnnotationsProps & WithHistoryProps;

export default function withAnnotations<P extends object>(
    WrappedComponent: React.ComponentType<P>,
): WithAnnotationsComponent<P> {
    class ComponentWithAnnotations extends React.Component<ResultProps<P>, AnnotatorState> {
        static displayName: string;

        annotator: Annotator | null = null;

        constructor(props: ResultProps<P>) {
            super(props);

            // Determine by url if there is already a deeply linked annotation
            const { history } = props;
            const match = this.getMatchPath(history);
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

        getMatchPath(history?: History): matchType<MatchParams> | null {
            const pathname = getProp(history, 'location.pathname');
            return matchPath<MatchParams>(pathname, {
                path: '/:sidebar/annotations/:fileVersionId/:annotationId?',
                exact: true,
            });
        }

        handleAnnotationCreate = (eventData: AnnotationActionEvent): void => {
            const { annotation = null, error = null, meta = null } = eventData;

            const action = this.getAction(eventData);

            this.setState({ ...this.state, annotation, action, error, meta });
        };

        handleActiveChange = (annotationId: string | null): void => {
            this.setState({ activeAnnotationId: annotationId });
        };

        handleAnnotatorEvent = ({ event, data }: { event: string; data: unknown }): void => {
            switch (event) {
                case 'annotations_create':
                    this.handleAnnotationCreate(data as AnnotationActionEvent);
                    break;
                case 'annotations_active_change':
                    this.handleActiveChange(data as string | null);
                    break;
                default:
                    break;
            }
        };

        handleAnnotator = (annotator: Annotator): void => {
            this.annotator = annotator;
            this.annotator.addListener('annotatorevent', this.handleAnnotatorEvent);
        };

        handlePreviewDestroy = (): void => {
            this.setState(defaultState);

            if (this.annotator) {
                this.annotator.removeListener('annotatorevent', this.handleAnnotatorEvent);
            }

            this.annotator = null;
        };

        render(): JSX.Element {
            return (
                <AnnotatorContext.Provider
                    value={{
                        emitActiveChangeEvent: this.emitActiveChangeEvent,
                        emitRemoveEvent: this.emitRemoveEvent,
                        getAnnotationsMatchPath: this.getMatchPath,
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
