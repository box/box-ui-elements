import * as React from 'react';
import AnnotatorContext from './AnnotatorContext';
import { AnnotatorState } from './types';

export interface WithAnnotatorContextProps {
    annotatorState?: AnnotatorState;
    emitAnnotatorActiveChangeEvent?: (id: string) => void;
}

export default function withAnnotatorContext<P extends {}>(WrappedComponent: React.ComponentType<P>) {
    return React.forwardRef<React.RefForwardingComponent<React.ComponentType<P>>, P>((props, ref) => (
        <AnnotatorContext.Consumer>
            {({ emitActiveChangeEvent, state }) => (
                <WrappedComponent
                    ref={ref}
                    {...props}
                    annotatorState={state}
                    emitAnnotatorActiveChangeEvent={emitActiveChangeEvent}
                />
            )}
        </AnnotatorContext.Consumer>
    ));
}
