import * as React from 'react';
import AnnotatorContext from './AnnotatorContext';
import { AnnotatorState, GetMatchPath } from './types';

export interface WithAnnotatorContextProps {
    annotatorState?: AnnotatorState;
    getAnnotationsMatchPath?: GetMatchPath;
    getAnnotationsPath?: (fileVersionId?: string, annotationId?: string) => string;
    publishActiveAnnotationChangeInSidebar?: (id: string | null) => void;
    publishAnnotationDeleteEnd?: (id: string) => void;
    publishAnnotationDeleteStart?: (id: string) => void;
    publishAnnotationUpdateEnd?: (id: string) => void;
    publishAnnotationUpdateStart?: (annotation: Object) => void;
}

export default function withAnnotatorContext<P extends {}>(WrappedComponent: React.ComponentType<P>) {
    return React.forwardRef<React.RefForwardingComponent<React.ComponentType<P>>, P>((props, ref) => (
        <AnnotatorContext.Consumer>
            {({
                publishActiveAnnotationChangeInSidebar,
                publishAnnotationUpdateEnd,
                publishAnnotationUpdateStart,
                publishAnnotationDeleteEnd,
                publishAnnotationDeleteStart,
                getAnnotationsMatchPath,
                getAnnotationsPath,
                state,
            }) => (
                <WrappedComponent
                    ref={ref}
                    {...props}
                    annotatorState={state}
                    getAnnotationsMatchPath={getAnnotationsMatchPath}
                    getAnnotationsPath={getAnnotationsPath}
                    publishActiveAnnotationChangeInSidebar={publishActiveAnnotationChangeInSidebar}
                    publishAnnotationDeleteEnd={publishAnnotationDeleteEnd}
                    publishAnnotationDeleteStart={publishAnnotationDeleteStart}
                    publishAnnotationUpdateEnd={publishAnnotationUpdateEnd}
                    publishAnnotationUpdateStart={publishAnnotationUpdateStart}
                />
            )}
        </AnnotatorContext.Consumer>
    ));
}
