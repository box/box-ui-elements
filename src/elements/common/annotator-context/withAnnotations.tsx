import * as React from 'react';
import AnnotatorContext from './AnnotatorContext';
import { Action, AnnotationActionEvent, AnnotatorState, Status } from './types';

export interface WithAnnotationsProps {
    onAnnotationCreate: Function;
}

export interface ComponentWithAnnotations {
    getAction: Function;
    handleAnnotationCreate: Function;
}

export type WithAnnotationsComponent<P> = React.ComponentClass<P & WithAnnotationsProps>;

export default function withAnnotations<P extends object>(
    WrappedComponent: React.ComponentType<P>,
): WithAnnotationsComponent<P> {
    class ComponentWithAnnotations extends React.Component<P & WithAnnotationsProps, AnnotatorState> {
        static displayName: string;

        state: AnnotatorState = {
            annotation: undefined,
            action: undefined,
            error: undefined,
        };

        getAction({ meta: { status }, error }: AnnotationActionEvent): Action {
            return status === Status.SUCCESS || error ? Action.CREATE_END : Action.CREATE_START;
        }

        handleAnnotationCreate = (eventData: AnnotationActionEvent): void => {
            const { annotation, error } = eventData;
            const action = this.getAction(eventData);
            this.setState({ ...this.state, annotation, action, error });
        };

        render(): JSX.Element {
            return (
                <AnnotatorContext.Provider value={this.state}>
                    <WrappedComponent {...this.props} onAnnotationCreate={this.handleAnnotationCreate} />
                </AnnotatorContext.Provider>
            );
        }
    }

    const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    ComponentWithAnnotations.displayName = `WithAnnotations(${displayName})`;

    return ComponentWithAnnotations;
}
