import * as React from 'react';
import AnnotatorContext from './AnnotatorContext';
import { isFeatureEnabled, type FeatureConfig } from '../feature-checking';
import { AnnotatorState, GetMatchPath, TimelineMarker, TimelineMarkerClickHandler } from './types';

export interface WithAnnotatorContextProps {
    addTimelineMarkerClickListener?: (handler: TimelineMarkerClickHandler) => () => void;
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
    setTimelineMarkers?: (markers: TimelineMarker[]) => void;
}

export default function withAnnotatorContext<P extends {}>(WrappedComponent: React.ComponentType<P>) {
    return React.forwardRef<React.ComponentType<P>, P & { routerDisabled?: boolean; features?: FeatureConfig }>(
        (props, ref) => {
            if (props?.routerDisabled === true || isFeatureEnabled(props?.features, 'routerDisabled.value')) {
                return (
                    <AnnotatorContext.Consumer>
                        {({
                            addTimelineMarkerClickListener,
                            emitActiveAnnotationChangeEvent,
                            emitAnnotationRemoveEvent,
                            emitAnnotationReplyCreateEvent,
                            emitAnnotationReplyDeleteEvent,
                            emitAnnotationReplyUpdateEvent,
                            emitAnnotationUpdateEvent,
                            setTimelineMarkers,
                            state,
                        }) => (
                            <WrappedComponent
                                ref={ref}
                                {...props}
                                addTimelineMarkerClickListener={addTimelineMarkerClickListener}
                                annotatorState={state}
                                emitActiveAnnotationChangeEvent={emitActiveAnnotationChangeEvent}
                                emitAnnotationRemoveEvent={emitAnnotationRemoveEvent}
                                emitAnnotationReplyCreateEvent={emitAnnotationReplyCreateEvent}
                                emitAnnotationReplyDeleteEvent={emitAnnotationReplyDeleteEvent}
                                emitAnnotationReplyUpdateEvent={emitAnnotationReplyUpdateEvent}
                                emitAnnotationUpdateEvent={emitAnnotationUpdateEvent}
                                setTimelineMarkers={setTimelineMarkers}
                            />
                        )}
                    </AnnotatorContext.Consumer>
                );
            }
            return (
                <AnnotatorContext.Consumer>
                    {({
                        addTimelineMarkerClickListener,
                        emitActiveAnnotationChangeEvent,
                        emitAnnotationRemoveEvent,
                        emitAnnotationReplyCreateEvent,
                        emitAnnotationReplyDeleteEvent,
                        emitAnnotationReplyUpdateEvent,
                        emitAnnotationUpdateEvent,
                        getAnnotationsMatchPath,
                        getAnnotationsPath,
                        setTimelineMarkers,
                        state,
                    }) => (
                        <WrappedComponent
                            ref={ref}
                            {...props}
                            addTimelineMarkerClickListener={addTimelineMarkerClickListener}
                            annotatorState={state}
                            emitActiveAnnotationChangeEvent={emitActiveAnnotationChangeEvent}
                            emitAnnotationRemoveEvent={emitAnnotationRemoveEvent}
                            emitAnnotationReplyCreateEvent={emitAnnotationReplyCreateEvent}
                            emitAnnotationReplyDeleteEvent={emitAnnotationReplyDeleteEvent}
                            emitAnnotationReplyUpdateEvent={emitAnnotationReplyUpdateEvent}
                            emitAnnotationUpdateEvent={emitAnnotationUpdateEvent}
                            getAnnotationsMatchPath={getAnnotationsMatchPath}
                            getAnnotationsPath={getAnnotationsPath}
                            setTimelineMarkers={setTimelineMarkers}
                        />
                    )}
                </AnnotatorContext.Consumer>
            );
        },
    );
}
