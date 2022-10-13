import { renderHook, act } from '@testing-library/react-hooks';
import useAnnotatorEvents from '../useAnnotatorEvents';
import { Status } from '../types';

describe('src/elements/common/annotator-context/useAnnotatorEvents', () => {
    const mockAddListener = jest.fn();
    const mockEmit = jest.fn();
    const mockRemoveListener = jest.fn();

    const getHook = (props: Object = {}) => {
        const mockEventEmitter = {
            addListener: mockAddListener,
            emit: mockEmit,
            eventNames: jest.fn(),
            getMaxListeners: jest.fn(),
            listenerCount: jest.fn(),
            listeners: jest.fn(),
            off: jest.fn(),
            on: jest.fn(),
            once: jest.fn(),
            prependListener: jest.fn(),
            prependOnceListener: jest.fn(),
            rawListeners: jest.fn(),
            removeAllListeners: jest.fn(),
            removeListener: mockRemoveListener,
            setMaxListeners: jest.fn(),
        };
        return renderHook(() => useAnnotatorEvents({ ...props, eventEmitter: mockEventEmitter }));
    };

    test('should call onAnnotationDeleteStart when proper event is emitted', () => {
        const mockAnnotationDeleteStart = jest.fn();
        const mockAnnotationId = '123';
        mockAddListener.mockImplementation((event: string, callback: (id: string) => void) => {
            if (event === 'annotations_remove_start') {
                callback(mockAnnotationId);
            }
        });
        getHook({ onAnnotationDeleteStart: mockAnnotationDeleteStart });
        expect(mockAddListener).toBeCalledWith('annotations_remove_start', mockAnnotationDeleteStart);
        expect(mockAnnotationDeleteStart).toBeCalledWith(mockAnnotationId);
    });

    test('should call onAnnotationDeleteEnd when proper event is emitted', () => {
        const mockAnnotationDeleteEnd = jest.fn();
        const mockAnnotationId = '123';
        mockAddListener.mockImplementation((event: string, callback: (id: string) => void) => {
            if (event === 'annotations_remove') {
                callback(mockAnnotationId);
            }
        });
        getHook({ onAnnotationDeleteEnd: mockAnnotationDeleteEnd });
        expect(mockAddListener).toBeCalledWith('annotations_remove', mockAnnotationDeleteEnd);
        expect(mockAnnotationDeleteEnd).toBeCalledWith(mockAnnotationId);
    });

    test('should call onAnnotationUpdateStart when proper event is emitted', () => {
        const mockAnnotationUpdateStart = jest.fn();
        const mockAnnotation = { id: '123', status: 'resolved' };
        mockAddListener.mockImplementation((event: string, callback: (annotation: Object) => void) => {
            if (event === 'sidebar.annotations_update_start') {
                callback(mockAnnotation);
            }
        });
        getHook({ onAnnotationUpdateStart: mockAnnotationUpdateStart });
        expect(mockAddListener).toBeCalledWith('sidebar.annotations_update_start', mockAnnotationUpdateStart);
        expect(mockAnnotationUpdateStart).toBeCalledWith(mockAnnotation);
    });

    test('should call onAnnotationUpdateEnd when proper event is emitted', () => {
        const mockAnnotationUpdateEnd = jest.fn();
        const mockAnnotation = { id: '123', status: 'resolved' };
        mockAddListener.mockImplementation((event: string, callback: (annotation: Object) => void) => {
            if (event === 'sidebar.annotations_update') {
                callback(mockAnnotation);
            }
        });
        getHook({ onAnnotationUpdateEnd: mockAnnotationUpdateEnd });
        expect(mockAddListener).toBeCalledWith('sidebar.annotations_update', mockAnnotationUpdateEnd);
        expect(mockAnnotationUpdateEnd).toBeCalledWith(mockAnnotation);
    });

    test('should call onSidebarAnnotationSelected when proper event is emitted', () => {
        const mockOnSidebarAnnotationSelected = jest.fn();
        const mockAnnotationId = '123';
        mockAddListener.mockImplementation((event: string, callback: (id: string) => void) => {
            if (event === 'annotations_active_set') {
                callback(mockAnnotationId);
            }
        });
        getHook({ onSidebarAnnotationSelected: mockOnSidebarAnnotationSelected });
        expect(mockAddListener).toBeCalledWith('annotations_active_set', mockOnSidebarAnnotationSelected);
        expect(mockOnSidebarAnnotationSelected).toBeCalledWith(mockAnnotationId);
    });

    test('should emit annotation active change event', () => {
        const annotationId = '123';
        const fileVersionId = '456';

        const { result } = getHook();

        act(() => {
            result.current.emitAnnotationActiveChangeEvent(annotationId, fileVersionId);
        });

        expect(mockEmit).toBeCalledWith('annotations_active_change', { annotationId, fileVersionId });
    });

    test('should emit annotation add start event', () => {
        const annotation = {
            description: {
                message: 'New Annotation',
            },
        };
        const requestId = 'annotation_123';

        const { result } = getHook();

        act(() => {
            result.current.emitAddAnnotationStartEvent(annotation, requestId);
        });

        const expectedAnnotationActionEvent = {
            annotation,
            meta: { requestId, status: Status.PENDING },
        };

        expect(mockEmit).toBeCalledWith('annotations_create', expectedAnnotationActionEvent);
    });

    test('should emit annotation add end event', () => {
        const annotation = {
            description: {
                message: 'New Annotation',
            },
            id: '1234',
            target: {
                location: {
                    value: 1,
                    type: 'page',
                },
                shape: {
                    height: 41.66666666666667,
                    type: 'rect',
                    width: 41.66666666666667,
                    x: 20.833333333333336,
                    y: 25,
                },
                type: 'region',
            },
        };
        const requestId = 'annotation_123';

        const { result } = getHook();

        act(() => {
            result.current.emitAddAnnotationEndEvent(annotation, requestId);
        });

        const expectedAnnotationActionEvent = {
            annotation,
            meta: { requestId, status: Status.SUCCESS },
        };

        expect(mockEmit).toBeCalledWith('annotations_create', expectedAnnotationActionEvent);
    });

    test('should emit annotation delete start event', () => {
        const { result } = getHook();

        act(() => {
            result.current.emitDeleteAnnotationStartEvent('123');
        });

        const expectedAnnotationActionEvent = {
            annotation: { id: '123' },
            meta: { status: Status.PENDING },
        };

        expect(mockEmit).toBeCalledWith('annotations_delete', expectedAnnotationActionEvent);
    });

    test('should emit annotation delete end event', () => {
        const { result } = getHook();

        act(() => {
            result.current.emitDeleteAnnotationEndEvent('123');
        });

        const expectedAnnotationActionEvent = {
            annotation: { id: '123' },
            meta: { status: Status.SUCCESS },
        };

        expect(mockEmit).toBeCalledWith('annotations_delete', expectedAnnotationActionEvent);
    });

    test('should emit annotation update start event', () => {
        const annotation = { id: '123', status: 'resolved' };

        const { result } = getHook();

        act(() => {
            result.current.emitUpdateAnnotationStartEvent(annotation);
        });

        const expectedAnnotationActionEvent = {
            annotation,
            meta: { status: Status.PENDING },
        };

        expect(mockEmit).toBeCalledWith('annotations_update', expectedAnnotationActionEvent);
    });

    test('should emit annotation update end event', () => {
        const annotation = { id: '123', status: 'resolved' };

        const { result } = getHook();

        act(() => {
            result.current.emitUpdateAnnotationEndEvent(annotation);
        });

        const expectedAnnotationActionEvent = {
            annotation,
            meta: { status: Status.SUCCESS },
        };

        expect(mockEmit).toBeCalledWith('annotations_update', expectedAnnotationActionEvent);
    });

    test('should remove all listeneres on cleanup', () => {
        const mockOnSidebarAnnotationSelected = jest.fn();
        const mockOnAnnotationDeleteEnd = jest.fn();
        const mockOnAnnotationDeleteStart = jest.fn();
        const mockOnAnnotationUpdateEnd = jest.fn();
        const mockOnAnnotationUpdateStart = jest.fn();

        const { unmount } = getHook({
            onSidebarAnnotationSelected: mockOnSidebarAnnotationSelected,
            onAnnotationDeleteEnd: mockOnAnnotationDeleteEnd,
            onAnnotationDeleteStart: mockOnAnnotationDeleteStart,
            onAnnotationUpdateEnd: mockOnAnnotationUpdateEnd,
            onAnnotationUpdateStart: mockOnAnnotationUpdateStart,
        });

        unmount();

        expect(mockRemoveListener).toHaveBeenNthCalledWith(
            1,
            'annotations_active_set',
            mockOnSidebarAnnotationSelected,
        );
        expect(mockRemoveListener).toHaveBeenNthCalledWith(2, 'annotations_remove', mockOnAnnotationDeleteEnd);
        expect(mockRemoveListener).toHaveBeenNthCalledWith(3, 'annotations_remove_start', mockOnAnnotationDeleteStart);
        expect(mockRemoveListener).toHaveBeenNthCalledWith(4, 'sidebar.annotations_update', mockOnAnnotationUpdateEnd);
        expect(mockRemoveListener).toHaveBeenNthCalledWith(
            5,
            'sidebar.annotations_update_start',
            mockOnAnnotationUpdateStart,
        );
    });
});
