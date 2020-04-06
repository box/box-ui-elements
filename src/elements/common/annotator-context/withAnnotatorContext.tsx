import * as React from 'react';
import AnnotatorContext from './AnnotatorContext';

export default function withAnnotatorContext<P extends {}>(WrappedComponent: React.ComponentType<P>) {
    return React.forwardRef<React.RefForwardingComponent<React.ComponentType<P>>, P>((props, ref) => (
        <AnnotatorContext.Consumer>
            {annotatorState => <WrappedComponent ref={ref} {...props} annotatorState={annotatorState} />}
        </AnnotatorContext.Consumer>
    ));
}
