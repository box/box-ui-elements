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

    test('should remove all listeneres on cleanup', () => {
        const mockOnSidebarAnnotationSelected = jest.fn();
        const mockOnAnnotationDeleteEnd = jest.fn();
        const mockOnAnnotationDeleteStart = jest.fn();
        const mockOnAnnotationUpdateEnd = jest.fn();
        const mockOnAnnotationUpdateStart = jest.fn();
        const mockOnAnnotationReplyAddEnd = jest.fn();
        const mockOnAnnotationReplyAddStart = jest.fn();
        const mockOnAnnotationReplyDeleteEnd = jest.fn();
        const mockOnAnnotationReplyDeleteStart = jest.fn();
        const mockOnAnnotationReplyUpdateEnd = jest.fn();
        const mockOnAnnotationReplyUpdateStart = jest.fn();

        const { unmount } = getHook({
            onSidebarAnnotationSelected: mockOnSidebarAnnotationSelected,
            onAnnotationDeleteEnd: mockOnAnnotationDeleteEnd,
            onAnnotationDeleteStart: mockOnAnnotationDeleteStart,
            onAnnotationUpdateEnd: mockOnAnnotationUpdateEnd,
            onAnnotationUpdateStart: mockOnAnnotationUpdateStart,
            onAnnotationReplyAddEnd: mockOnAnnotationReplyAddEnd,
            onAnnotationReplyAddStart: mockOnAnnotationReplyAddStart,
            onAnnotationReplyDeleteEnd: mockOnAnnotationReplyDeleteEnd,
            onAnnotationReplyDeleteStart: mockOnAnnotationReplyDeleteStart,
            onAnnotationReplyUpdateEnd: mockOnAnnotationReplyUpdateEnd,
            onAnnotationReplyUpdateStart: mockOnAnnotationReplyUpdateStart,
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
        expect(mockRemoveListener).toHaveBeenNthCalledWith(
            6,
            'sidebar.annotations_reply_create',
            mockOnAnnotationReplyAddEnd,
        );
        expect(mockRemoveListener).toHaveBeenNthCalledWith(
            7,
            'sidebar.annotations_reply_create_start',
            mockOnAnnotationReplyAddStart,
        );
        expect(mockRemoveListener).toHaveBeenNthCalledWith(
            8,
            'sidebar.annotations_reply_delete',
            mockOnAnnotationReplyDeleteEnd,
        );
        expect(mockRemoveListener).toHaveBeenNthCalledWith(
            9,
            'sidebar.annotations_reply_delete_start',
            mockOnAnnotationReplyDeleteStart,
        );
        expect(mockRemoveListener).toHaveBeenNthCalledWith(
            10,
            'sidebar.annotations_reply_update',
            mockOnAnnotationReplyUpdateEnd,
        );
        expect(mockRemoveListener).toHaveBeenNthCalledWith(
            11,
            'sidebar.annotations_reply_update_start',
            mockOnAnnotationReplyUpdateStart,
        );
    });

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

    test('should call onAnnotationReplyAddStart when proper event is emitted', () => {
        const mockAnnotationReplyAddStart = jest.fn();
        const mockEventData = { annotationId: '123', reply: { tagged_message: 'abc' }, requestId: 'comment_456' };
        mockAddListener.mockImplementation((event: string, callback: (eventData: Object) => void) => {
            if (event === 'sidebar.annotations_reply_create_start') {
                callback(mockEventData);
            }
        });
        getHook({ onAnnotationReplyAddStart: mockAnnotationReplyAddStart });
        expect(mockAddListener).toBeCalledWith('sidebar.annotations_reply_create_start', mockAnnotationReplyAddStart);
        expect(mockAnnotationReplyAddStart).toBeCalledWith(mockEventData);
    });

    test('should call onAnnotationReplyAddEnd when proper event is emitted', () => {
        const mockAnnotationReplyAddEnd = jest.fn();
        const mockEventData = {
            annotationId: '123',
            reply: { id: '456', tagged_message: 'abc' },
            requestId: 'comment_456',
        };
        mockAddListener.mockImplementation((event: string, callback: (eventData: Object) => void) => {
            if (event === 'sidebar.annotations_reply_create') {
                callback(mockEventData);
            }
        });
        getHook({ onAnnotationReplyAddEnd: mockAnnotationReplyAddEnd });
        expect(mockAddListener).toBeCalledWith('sidebar.annotations_reply_create', mockAnnotationReplyAddEnd);
        expect(mockAnnotationReplyAddEnd).toBeCalledWith(mockEventData);
    });

    test('should call onAnnotationReplyDeleteStart when proper event is emitted', () => {
        const mockAnnotationReplyDeleteStart = jest.fn();
        const mockEventData = { annotationId: '123', id: '456' };
        mockAddListener.mockImplementation((event: string, callback: (eventData: Object) => void) => {
            if (event === 'sidebar.annotations_reply_delete_start') {
                callback(mockEventData);
            }
        });
        getHook({ onAnnotationReplyDeleteStart: mockAnnotationReplyDeleteStart });
        expect(mockAddListener).toBeCalledWith(
            'sidebar.annotations_reply_delete_start',
            mockAnnotationReplyDeleteStart,
        );
        expect(mockAnnotationReplyDeleteStart).toBeCalledWith(mockEventData);
    });

    test('should call onAnnotationReplyDeleteEnd when proper event is emitted', () => {
        const mockAnnotationReplyDeleteEnd = jest.fn();
        const mockEventData = { annotationId: '123', id: '456' };
        mockAddListener.mockImplementation((event: string, callback: (eventData: Object) => void) => {
            if (event === 'sidebar.annotations_reply_delete') {
                callback(mockEventData);
            }
        });
        getHook({ onAnnotationReplyDeleteEnd: mockAnnotationReplyDeleteEnd });
        expect(mockAddListener).toBeCalledWith('sidebar.annotations_reply_delete', mockAnnotationReplyDeleteEnd);
        expect(mockAnnotationReplyDeleteEnd).toBeCalledWith(mockEventData);
    });

    test('should call onAnnotationReplyUpdateStart when proper event is emitted', () => {
        const mockAnnotationReplyUpdateStart = jest.fn();
        const mockEventData = { annotationId: '123', reply: { id: '123', tagged_message: 'abc' } };
        mockAddListener.mockImplementation((event: string, callback: (eventData: Object) => void) => {
            if (event === 'sidebar.annotations_reply_update_start') {
                callback(mockEventData);
            }
        });
        getHook({ onAnnotationReplyUpdateStart: mockAnnotationReplyUpdateStart });
        expect(mockAddListener).toBeCalledWith(
            'sidebar.annotations_reply_update_start',
            mockAnnotationReplyUpdateStart,
        );
        expect(mockAnnotationReplyUpdateStart).toBeCalledWith(mockEventData);
    });

    test('should call onAnnotationReplyUpdateEnd when proper event is emitted', () => {
        const mockAnnotationReplyUpdateEnd = jest.fn();
        const mockEventData = { annotationId: '123', reply: { id: '123', tagged_message: 'abc' } };
        mockAddListener.mockImplementation((event: string, callback: (eventData: Object) => void) => {
            if (event === 'sidebar.annotations_reply_update') {
                callback(mockEventData);
            }
        });
        getHook({ onAnnotationReplyUpdateEnd: mockAnnotationReplyUpdateEnd });
        expect(mockAddListener).toBeCalledWith('sidebar.annotations_reply_update', mockAnnotationReplyUpdateEnd);
        expect(mockAnnotationReplyUpdateEnd).toBeCalledWith(mockEventData);
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

    test('should emit annotation reply create start event', () => {
        const annotationId = '123';
        const reply = { tagged_message: 'abc' };
        const requestId = 'comment_456';

        const { result } = getHook();

        act(() => {
            result.current.emitAddAnnotationReplyStartEvent(reply, annotationId, requestId);
        });

        const expectedAnnotationActionEvent = {
            annotation: { id: annotationId },
            annotationReply: reply,
            meta: { status: Status.PENDING, requestId },
        };

        expect(mockEmit).toBeCalledWith('annotations_reply_create', expectedAnnotationActionEvent);
    });

    test('should emit annotation reply create end event', () => {
        const annotationId = '123';
        const reply = { id: '456', tagged_message: 'abc' };
        const requestId = 'comment_456';

        const { result } = getHook();

        act(() => {
            result.current.emitAddAnnotationReplyEndEvent(reply, annotationId, requestId);
        });

        const expectedAnnotationActionEvent = {
            annotation: { id: annotationId },
            annotationReply: reply,
            meta: { status: Status.SUCCESS, requestId },
        };

        expect(mockEmit).toBeCalledWith('annotations_reply_create', expectedAnnotationActionEvent);
    });

    test('should emit annotation reply delete start event', () => {
        const annotationId = '123';
        const replyId = '456';

        const { result } = getHook();

        act(() => {
            result.current.emitDeleteAnnotationReplyStartEvent(replyId, annotationId);
        });

        const expectedAnnotationActionEvent = {
            annotation: { id: annotationId },
            annotationReply: { id: replyId },
            meta: { status: Status.PENDING },
        };

        expect(mockEmit).toBeCalledWith('annotations_reply_delete', expectedAnnotationActionEvent);
    });

    test('should emit annotation reply delete end event', () => {
        const annotationId = '123';
        const replyId = '456';

        const { result } = getHook();

        act(() => {
            result.current.emitDeleteAnnotationReplyEndEvent(replyId, annotationId);
        });

        const expectedAnnotationActionEvent = {
            annotation: { id: annotationId },
            annotationReply: { id: replyId },
            meta: { status: Status.SUCCESS },
        };

        expect(mockEmit).toBeCalledWith('annotations_reply_delete', expectedAnnotationActionEvent);
    });

    test('should emit annotation reply update start event', () => {
        const annotationId = '123';
        const reply = { id: '456', tagged_message: 'abc' };

        const { result } = getHook();

        act(() => {
            result.current.emitUpdateAnnotationReplyStartEvent(reply, annotationId);
        });

        const expectedAnnotationActionEvent = {
            annotation: { id: annotationId },
            annotationReply: reply,
            meta: { status: Status.PENDING },
        };

        expect(mockEmit).toBeCalledWith('annotations_reply_update', expectedAnnotationActionEvent);
    });

    test('should emit annotation reply update end event', () => {
        const annotationId = '123';
        const reply = { id: '456', tagged_message: 'abc' };

        const { result } = getHook();

        act(() => {
            result.current.emitUpdateAnnotationReplyEndEvent(reply, annotationId);
        });

        const expectedAnnotationActionEvent = {
            annotation: { id: annotationId },
            annotationReply: reply,
            meta: { status: Status.SUCCESS },
        };

        expect(mockEmit).toBeCalledWith('annotations_reply_update', expectedAnnotationActionEvent);
    });
});
