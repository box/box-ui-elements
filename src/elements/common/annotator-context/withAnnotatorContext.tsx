import * as React from 'react';
import AnnotatorContext from './AnnotatorContext';
import { AnnotatorState } from './types';

export interface WithAnnotatorContextProps {
    annotatorState?: AnnotatorState;
}

export default function withAnnotatorContext<P extends {}>(WrappedComponent: React.ComponentType<P>) {
    return React.forwardRef<React.RefForwardingComponent<React.ComponentType<P>>, P>((props, ref) => (
        <AnnotatorContext.Consumer>
            {({ activeAnnotationId, ...rest }) => (
                <WrappedComponent ref={ref} {...props} activeAnnotationId={activeAnnotationId} annotatorState={rest} />
            )}
        </AnnotatorContext.Consumer>
    ));
}
