import * as React from 'react';
import AnnotatorContext from './AnnotatorContext';
import { Action, Annotator, AnnotationActionEvent, AnnotatorState, Status } from './types';

export interface WithAnnotationsProps {
    onAnnotator: (annotator: Annotator) => void;
    onAnnotatorEvent: ({ event, data }: { event: string; data: unknown }) => void;
    onPreviewDestroy: () => void;
}

export interface ComponentWithAnnotations {
    emitActiveChangeEvent: (id: string | null) => void;
    getAction: (eventData: AnnotationActionEvent) => Action;
    handleActiveChange: (annotationId: string | null) => void;
    handleAnnotationChangeEvent: (id: string | null) => void;
    handleAnnotationCreate: (eventData: AnnotationActionEvent) => void;
    handleAnnotatorEvent: ({ event, data }: { event: string; data?: unknown }) => void;
    handleOnAnnotator: (annotator: Annotator) => void;
    handlePreviewDestroy: () => void;
}

export type WithAnnotationsComponent<P> = React.ComponentClass<P & WithAnnotationsProps>;

export default function withAnnotations<P extends object>(
    WrappedComponent: React.ComponentType<P>,
): WithAnnotationsComponent<P> {
    class ComponentWithAnnotations extends React.Component<P & WithAnnotationsProps, AnnotatorState> {
        static displayName: string;

        emitActiveChangeEvent = (id: string | null) => {
            const { annotator } = this.state;

            if (!annotator || !annotator.emit) {
                return;
            }

            annotator.emit('annotations_active_change', id);
        };

        defaultState: AnnotatorState = {
            activeAnnotationId: null,
            annotation: null,
            annotator: null,
            action: null,
            error: null,
            setActiveAnnotationId: this.emitActiveChangeEvent,
        };

        state = this.defaultState;

        getAction({ meta: { status }, error }: AnnotationActionEvent): Action {
            return status === Status.SUCCESS || error ? Action.CREATE_END : Action.CREATE_START;
        }

        handleAnnotationCreate = (eventData: AnnotationActionEvent): void => {
            const { annotation = null, error = null } = eventData;
            const action = this.getAction(eventData);
            this.setState({ ...this.state, annotation, action, error });
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

        handleOnAnnotator = (annotator: Annotator): void => {
            this.setState({ annotator });
        };

        handlePreviewDestroy = (): void => {
            this.setState(this.defaultState);
        };

        render(): JSX.Element {
            return (
                <AnnotatorContext.Provider value={this.state}>
                    <WrappedComponent
                        {...this.props}
                        onAnnotator={this.handleOnAnnotator}
                        onAnnotatorEvent={this.handleAnnotatorEvent}
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
