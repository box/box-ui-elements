import * as React from 'react';
import AnnotatorContext from './AnnotatorContext';
import { AnnotatorState, GetMatchPath } from './types';

export interface WithAnnotatorContextProps {
    annotatorState?: AnnotatorState;
    emitAnnotatorActiveChangeEvent?: (id: string) => void;
    emitRemoveEvent?: (id: string) => void;
    getAnnotationsMatchPath?: GetMatchPath;
    getAnnotationsPath?: (fileVersionId?: string, annotationId?: string) => string;
}

export default function withAnnotatorContext<P extends {}>(WrappedComponent: React.ComponentType<P>) {
    return React.forwardRef<React.RefForwardingComponent<React.ComponentType<P>>, P>((props, ref) => (
        <AnnotatorContext.Consumer>
            {({ emitActiveChangeEvent, emitRemoveEvent, getAnnotationsMatchPath, getAnnotationsPath, state }) => (
                <WrappedComponent
                    ref={ref}
                    {...props}
                    annotatorState={state}
                    emitAnnotatorActiveChangeEvent={emitActiveChangeEvent}
                    emitRemoveEvent={emitRemoveEvent}
                    getAnnotationsMatchPath={getAnnotationsMatchPath}
                    getAnnotationsPath={getAnnotationsPath}
                />
            )}
        </AnnotatorContext.Consumer>
    ));
}
