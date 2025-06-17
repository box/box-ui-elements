import * as React from 'react';
import AnnotatorContext from './AnnotatorContext';
import { isFeatureEnabled, type FeatureConfig } from '../feature-checking';
import { AnnotatorState, GetMatchPath } from './types';

export interface WithAnnotatorContextProps {
    annotatorState?: AnnotatorState;
    emitActiveAnnotationChangeEvent?: (id: string) => void;
    emitAnnotationRemoveEvent?: (id: string, isStartEvent?: boolean) => void;
    emitAnnotationReplyCreateEvent?: (
        reply: Object,
        requestId: string,
        annotationId: string,
        isStartEvent?: boolean,
    ) => void;
    emitAnnotationReplyDeleteEvent?: (id: string, annotationId: string, isStartEvent?: boolean) => void;
    emitAnnotationReplyUpdateEvent?: (reply: Object, annotationId: string, isStartEvent?: boolean) => void;
    emitAnnotationUpdateEvent?: (annotation: Object, isStartEvent?: boolean) => void;
    getAnnotationsMatchPath?: GetMatchPath;
    getAnnotationsPath?: (fileVersionId?: string, annotationId?: string) => string;
}

export default function withAnnotatorContext<P extends {}>(WrappedComponent: React.ComponentType<P>) {
    return React.forwardRef<React.ComponentType<P>, P & { routerDisabled?: boolean; features?: FeatureConfig }>(
        (props, ref) => {
            if (props?.routerDisabled === true || isFeatureEnabled(props?.features, 'routerDisabled.value')) {
                return (
                    <AnnotatorContext.Consumer>
                        {({
                            emitActiveAnnotationChangeEvent,
                            emitAnnotationRemoveEvent,
                            emitAnnotationReplyCreateEvent,
                            emitAnnotationReplyDeleteEvent,
                            emitAnnotationReplyUpdateEvent,
                            emitAnnotationUpdateEvent,
                            state,
                        }) => (
                            <WrappedComponent
                                ref={ref}
                                {...props}
                                annotatorState={state}
                                emitActiveAnnotationChangeEvent={emitActiveAnnotationChangeEvent}
                                emitAnnotationRemoveEvent={emitAnnotationRemoveEvent}
                                emitAnnotationReplyCreateEvent={emitAnnotationReplyCreateEvent}
                                emitAnnotationReplyDeleteEvent={emitAnnotationReplyDeleteEvent}
                                emitAnnotationReplyUpdateEvent={emitAnnotationReplyUpdateEvent}
                                emitAnnotationUpdateEvent={emitAnnotationUpdateEvent}
                            />
                        )}
                    </AnnotatorContext.Consumer>
                );
            }
            return (
                <AnnotatorContext.Consumer>
                    {({
                        emitActiveAnnotationChangeEvent,
                        emitAnnotationRemoveEvent,
                        emitAnnotationReplyCreateEvent,
                        emitAnnotationReplyDeleteEvent,
                        emitAnnotationReplyUpdateEvent,
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
                            emitAnnotationRemoveEvent={emitAnnotationRemoveEvent}
                            emitAnnotationReplyCreateEvent={emitAnnotationReplyCreateEvent}
                            emitAnnotationReplyDeleteEvent={emitAnnotationReplyDeleteEvent}
                            emitAnnotationReplyUpdateEvent={emitAnnotationReplyUpdateEvent}
                            emitAnnotationUpdateEvent={emitAnnotationUpdateEvent}
                            getAnnotationsMatchPath={getAnnotationsMatchPath}
                            getAnnotationsPath={getAnnotationsPath}
                        />
                    )}
                </AnnotatorContext.Consumer>
            );
        },
    );
}
