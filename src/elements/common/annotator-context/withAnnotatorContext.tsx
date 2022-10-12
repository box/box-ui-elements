import * as React from 'react';
import AnnotatorContext from './AnnotatorContext';
import { AnnotatorState, GetMatchPath } from './types';

export interface WithAnnotatorContextProps {
    annotatorState?: AnnotatorState;
    emitActiveAnnotationChangeEvent?: (id: string) => void;
    emitActivitySidebarFilterChangeEvent?: (status: string) => void;
    emitAnnotationRemoveEvent?: (id: string, isStartEvent?: boolean) => void;
    emitAnnotationUpdateEvent?: (annotation: Object, isStartEvent?: boolean) => void;
    getAnnotationsMatchPath?: GetMatchPath;
    getAnnotationsPath?: (fileVersionId?: string, annotationId?: string) => string;
}

export default function withAnnotatorContext<P extends {}>(WrappedComponent: React.ComponentType<P>) {
    return React.forwardRef<React.RefForwardingComponent<React.ComponentType<P>>, P>((props, ref) => (
        <AnnotatorContext.Consumer>
            {({
                emitActiveAnnotationChangeEvent,
                emitActivitySidebarFilterChangeEvent,
                emitAnnotationRemoveEvent,
                emitAnnotationUpdateEvent,
                getAnnotationsMatchPath,
                getAnnotationsPath,
                state,
            }) => (
                <WrappedComponent
                    ref={ref}
                    {...props}
                    annotatorState={state}
                    emitActiveAnnotationChangeEvent={emitActiveAnnotationChangeEvent}
                    emitActivitySidebarFilterChangeEvent={emitActivitySidebarFilterChangeEvent}
                    emitAnnotationRemoveEvent={emitAnnotationRemoveEvent}
                    emitAnnotationUpdateEvent={emitAnnotationUpdateEvent}
                    getAnnotationsMatchPath={getAnnotationsMatchPath}
                    getAnnotationsPath={getAnnotationsPath}
                />
            )}
        </AnnotatorContext.Consumer>
    ));
}
