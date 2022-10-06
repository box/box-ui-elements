import * as React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import useAnnotatorEvents, { UseAnnotatorEventsProps } from '../useAnnotatorEvents';
import AnnotatorContext from '../AnnotatorContext';
import { Action, AnnotatorState } from '../types';

describe('src/elements/common/annotator-context/useAnnotatorEvents', () => {
    const mockPublishActiveAnnotationChange = jest.fn();
    const mockPublishAnnotationUpdateEnd = jest.fn();
    const mockPublishAnnotationUpdateStart = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    const getHookOrigin = () => 'hookUser';

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

    const getHook = (annotatorState: AnnotatorState = {}, props: UseAnnotatorEventsProps = {}) => {
        const wrapper = ({ children }: { children?: React.ReactNode }) => (
            <AnnotatorContext.Provider value={getProviderValues(annotatorState)}>{children}</AnnotatorContext.Provider>
        );
        return renderHook(() => useAnnotatorEvents({ ...props, origin: getHookOrigin() }), { wrapper });
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

    test('should call onAnnotationDeleteEnd', () => {
        const annotationDeleteEndHandler = jest.fn();
        const annotatorState = {
            action: Action.DELETE_END,
            annotation: { id: '123' },
        };
        getHook(annotatorState, { onAnnotationDeleteEnd: annotationDeleteEndHandler });

        expect(annotationDeleteEndHandler).toBeCalledWith('123');
    });

    test('should call onAnnotationUpdateStart', () => {
        const annotationUpdateStartHandler = jest.fn();
        const annotation = { id: '123', status: 'resolved' };
        const annotatorState = {
            action: Action.UPDATE_START,
            annotation,
        };
        getHook(annotatorState, { onAnnotationUpdateStart: annotationUpdateStartHandler });

        expect(annotationUpdateStartHandler).toBeCalledWith(annotation);
    });

    test('should call onAnnotationUpdateEnd', () => {
        const annotationUpdateEndHandler = jest.fn();
        const annotation = { id: '123', status: 'resolved' };
        const annotatorState = {
            action: Action.UPDATE_END,
            annotation,
        };
        getHook(annotatorState, { onAnnotationUpdateEnd: annotationUpdateEndHandler });

        expect(annotationUpdateEndHandler).toBeCalledWith(annotation);
    });

    test('should call onSidebarAnnotationSelected', () => {
        const onSidebarAnnotationSelectedHandler = jest.fn();
        const annotatorState = {
            action: Action.SET_ACTIVE,
            activeAnnotationId: '123',
            origin: 'sidebar',
        };
        getHook(annotatorState, { onSidebarAnnotationSelected: onSidebarAnnotationSelectedHandler });

        expect(onSidebarAnnotationSelectedHandler).toBeCalledWith('123');
    });

    test.each`
        action
        ${Action.DELETE_START}
        ${Action.DELETE_END}
        ${Action.UPDATE_START}
        ${Action.UPDATE_END}
    `(
        'should not call update and delete handlers if change originated from hook user given action = $action',
        ({ action }) => {
            const annotationDeleteEndHandler = jest.fn();
            const annotationDeleteStartHandler = jest.fn();
            const annotationUpdateEndHandler = jest.fn();
            const annotationUpdateStartHandler = jest.fn();
            const annotatorState = {
                action,
                annotation: { id: '123' },
                origin: getHookOrigin(),
            };

            getHook(annotatorState, {
                onAnnotationDeleteEnd: annotationDeleteEndHandler,
                onAnnotationDeleteStart: annotationDeleteStartHandler,
                onAnnotationUpdateEnd: annotationUpdateEndHandler,
                onAnnotationUpdateStart: annotationUpdateStartHandler,
            });

            expect(annotationDeleteEndHandler).not.toBeCalled();
            expect(annotationDeleteStartHandler).not.toBeCalled();
            expect(annotationUpdateEndHandler).not.toBeCalled();
            expect(annotationUpdateStartHandler).not.toBeCalled();
        },
    );

    test('should publish active annotation change to the context', () => {
        const annotationId = '123';
        const fileVersionId = '456';

        const { result } = getHook();

        act(() => {
            result.current.publishActiveAnnotationChange(annotationId, fileVersionId);
        });

        expect(mockPublishActiveAnnotationChange).toBeCalledWith({
            annotationId,
            fileVersionId,
            origin: getHookOrigin(),
        });
    });

    test('should publish annotation update start to the context', () => {
        const annotation = { id: '123', status: 'resolved' };

        const { result } = getHook();

        act(() => {
            result.current.publishAnnotationUpdateStart(annotation);
        });

        expect(mockPublishAnnotationUpdateStart).toBeCalledWith(annotation, getHookOrigin());
    });

    test('should publish annotation update end to the context', () => {
        const annotation = { id: '123', status: 'resolved' };

        const { result } = getHook();

        act(() => {
            result.current.publishAnnotationUpdateEnd(annotation);
        });

        expect(mockPublishAnnotationUpdateEnd).toBeCalledWith(annotation, getHookOrigin());
    });
});
