import * as React from 'react';
import { AnnotatorState, GetMatchPath } from './types';
export interface WithAnnotatorContextProps {
    annotatorState?: AnnotatorState;
    emitActiveAnnotationChangeEvent?: (id: string) => void;
    emitAnnotationRemoveEvent?: (id: string, isStartEvent?: boolean) => void;
    emitAnnotationReplyCreateEvent?: (reply: Object, requestId: string, annotationId: string, isStartEvent?: boolean) => void;
    emitAnnotationReplyDeleteEvent?: (id: string, annotationId: string, isStartEvent?: boolean) => void;
    emitAnnotationReplyUpdateEvent?: (reply: Object, annotationId: string, isStartEvent?: boolean) => void;
    emitAnnotationUpdateEvent?: (annotation: Object, isStartEvent?: boolean) => void;
    getAnnotationsMatchPath?: GetMatchPath;
    getAnnotationsPath?: (fileVersionId?: string, annotationId?: string) => string;
}
export default function withAnnotatorContext<P extends {}>(WrappedComponent: React.ComponentType<P>): React.ForwardRefExoticComponent<React.PropsWithoutRef<P & {
    routerDisabled?: boolean;
    features?: FeatureConfig;
}> & React.RefAttributes<React.ComponentType<P>>>;
