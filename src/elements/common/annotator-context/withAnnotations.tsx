import * as React from 'react';
import AnnotatorContext from './AnnotatorContext';
import { Action, AnnotationActionEvent, AnnotatorState, Status } from './types';

type WrapperProps = {
    showAnnotationControls: boolean;
};

type WrapperReturn<P> = React.ComponentClass<P & WrapperProps>;

export default function withAnnotations<P extends object>(
    WrappedComponent: React.ComponentType<P & WrapperProps>,
): WrapperReturn<P> {
    class ComponentWithAnnotations extends React.Component<P & WrapperProps, AnnotatorState> {
        static displayName: string;

        state: AnnotatorState = {
            annotation: null,
            action: null,
            error: null,
        };

        getActionSuffix(status: Status) {
            return status === Status.SUCCESS || status === Status.ERROR ? 'end' : 'start';
        }

        handleAnnotationCreate = ({ annotation, error, meta }: AnnotationActionEvent): void => {
            const { status } = meta;
            const actionSuffix = this.getActionSuffix(status);
            const action = `create_${actionSuffix}` as Action;
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
