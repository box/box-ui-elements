import * as React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useAnnotatorEvents, { UseAnnotatorEventsProps } from '../useAnnotatorEvents';
import AnnotatorContext from '../AnnotatorContext';
import { Action, AnnotatorState } from '../types';

describe('src/elements/common/annotator-context/useAnnotatorEvents', () => {
    const mockPublishActiveAnnotationChange = jest.fn();
    const mockPublishAnnotationUpdateEnd = jest.fn();
    const mockPublishAnnotationUpdateStart = jest.fn();

    const getProviderValues = (state: AnnotatorState) => ({
        getAnnotationsMatchPath: jest.fn(),
        getAnnotationsPath: jest.fn(),
        publishActiveAnnotationChange: mockPublishActiveAnnotationChange,
        publishActiveAnnotationChangeInSidebar: jest.fn(),
        publishAnnotationDeleteEnd: jest.fn(),
        publishAnnotationDeleteStart: jest.fn(),
        publishAnnotationUpdateEnd: mockPublishAnnotationUpdateEnd,
        publishAnnotationUpdateStart: mockPublishAnnotationUpdateStart,
        state,
    });

    const getHook = (annotatorState: AnnotatorState, props: UseAnnotatorEventsProps) => {
        const wrapper = ({ children }: { children?: React.ReactNode }) => (
            <AnnotatorContext.Provider value={getProviderValues(annotatorState)}>{children}</AnnotatorContext.Provider>
        );
        return renderHook(() => useAnnotatorEvents({ ...props, origin: 'hookUser' }), { wrapper });
    };

    test('should call onAnnotationDeleteStart', () => {
        const annotationDeleteStartHandler = jest.fn();
        const annotatorState = {
            action: Action.DELETE_START,
            annotation: { id: '123' },
        };
        getHook(annotatorState, { onAnnotationDeleteStart: annotationDeleteStartHandler });

        expect(annotationDeleteStartHandler).toBeCalledWith('123');
    });
});
