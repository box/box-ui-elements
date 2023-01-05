import { renderHook, act } from '@testing-library/react-hooks';
import { annotationsWithFormattedReplies as annotations } from '../../../../../api/fixtures';
import { useAnnotatorEvents } from '../../../../common/annotator-context';
import useAnnotationThread from '../useAnnotationThread';
import useAnnotationAPI from '../useAnnotationAPI';
import useRepliesAPI from '../useRepliesAPI';

jest.mock('lodash/uniqueId', () => () => 'uniqueId');
jest.mock('../../../../common/annotator-context', () => ({
    useAnnotatorEvents: jest.fn(),
}));
jest.mock('../useAnnotationAPI', () => jest.fn());
jest.mock('../useRepliesAPI', () => jest.fn());

describe('src/elements/content-sidebar/activity-feed/useAnnotationThread', () => {
    const annotation = annotations[0];

    const mockUseAnnotatorEventsResult = {
        emitAddAnnotationEndEvent: jest.fn(),
        emitAddAnnotationReplyEndEvent: jest.fn(),
        emitAddAnnotationReplyStartEvent: jest.fn(),
        emitAddAnnotationStartEvent: jest.fn(),
        emitAnnotationActiveChangeEvent: jest.fn(),
        emitDeleteAnnotationEndEvent: jest.fn(),
        emitDeleteAnnotationReplyEndEvent: jest.fn(),
        emitDeleteAnnotationReplyStartEvent: jest.fn(),
        emitDeleteAnnotationStartEvent: jest.fn(),
        emitUpdateAnnotationEndEvent: jest.fn(),
        emitUpdateAnnotationReplyEndEvent: jest.fn(),
        emitUpdateAnnotationReplyStartEvent: jest.fn(),
        emitUpdateAnnotationStartEvent: jest.fn(),
    };
    const mockUseAnnotationAPIResult = {
        handleCreate: jest.fn(),
        handleFetch: jest.fn(),
        handleDelete: jest.fn(),
        handleEdit: jest.fn(),
        handleStatusChange: jest.fn(),
    };

    const mockUseRepliesAPIResult = {
        createReply: jest.fn(),
        deleteReply: jest.fn(),
        editReply: jest.fn(),
    };

    const filePermissions = { can_annotate: true, can_view_annotations: true };
    const errorCallback = jest.fn();

    const getFileProps = props => ({
        id: 'fileId',
        file_version: { id: '123' },
        permissions: filePermissions,
        ...props,
    });

    const getHook = props =>
        renderHook(() =>
            useAnnotationThread({
                api: {},
                currentUser: {},
                file: getFileProps(),
                annotationId: annotation.id,
                errorCallback,
                eventEmitter: {},
                onAnnotationCreate: jest.fn(),
                ...props,
            }),
        );

    beforeEach(() => {
        useAnnotatorEvents.mockImplementation(() => mockUseAnnotatorEventsResult);
        useAnnotationAPI.mockImplementation(() => mockUseAnnotationAPIResult);
        useRepliesAPI.mockImplementation(() => mockUseRepliesAPIResult);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return correct values on mount', () => {
        const { result } = getHook();

        expect(result.current.annotation).toEqual(undefined);
        expect(result.current.isLoading).toEqual(true);
        expect(result.current.error).toEqual(undefined);
        expect(result.current.replies).toEqual([]);
    });

    test('should return correct values after fetch and call emitAnnotationActiveChangeEvent', () => {
        const { replies, ...normalizedAnnotation } = annotation;
        const mockHandleFetch = jest.fn().mockImplementation(({ successCallback }) => successCallback(annotation));
        useAnnotationAPI.mockImplementation(() => ({
            ...mockUseAnnotationAPIResult,
            handleFetch: mockHandleFetch,
        }));
        const fileVersionId = '456';
        const file = getFileProps({ file_version: { id: fileVersionId } });

        const { result } = getHook({ file });

        expect(result.current.annotation).toEqual(normalizedAnnotation);
        expect(result.current.isLoading).toEqual(false);
        expect(result.current.error).toEqual(undefined);
        expect(result.current.replies).toEqual(replies);
        expect(mockUseAnnotatorEventsResult.emitAnnotationActiveChangeEvent).toBeCalledWith(
            annotation.id,
            fileVersionId,
        );
    });

    describe('handleAnnotationCreate', () => {
        test('should call handleCreate from useAnnotationAPI and call emitAddAnnotationStartEvent + emitAddAnnotationEndEvent', () => {
            const mockOnAnnotationCreate = jest.fn();
            const createdAnnotation = {
                description: { message: 'new annotation' },
                target: {},
            };
            const mockHandleCreate = jest
                .fn()
                .mockImplementation(({ successCallback }) => successCallback(createdAnnotation));
            useAnnotationAPI.mockImplementation(() => ({
                ...mockUseAnnotationAPIResult,
                handleCreate: mockHandleCreate,
            }));

            const target = {};
            const text = 'foo';

            const { result } = getHook({ target, onAnnotationCreate: mockOnAnnotationCreate });
            act(() => {
                result.current.annotationActions.handleAnnotationCreate(text);
            });

            const expectedPayload = {
                description: { message: text },
                target,
            };

            expect(mockHandleCreate).toBeCalledWith({
                payload: expectedPayload,
                successCallback: expect.any(Function),
            });
            expect(mockOnAnnotationCreate).toBeCalledWith(createdAnnotation);
            expect(mockUseAnnotatorEventsResult.emitAddAnnotationStartEvent).toBeCalledWith(
                expectedPayload,
                'uniqueId',
            );
            expect(mockUseAnnotatorEventsResult.emitAddAnnotationEndEvent).toBeCalledWith(
                createdAnnotation,
                'uniqueId',
            );
        });
    });

    describe('handleAnnotationEdit', () => {
        test('should call handleEdit from useAnnotationAPI and call emitUpdateAnnotationStartEvent + emitUpdateAnnotationEndEvent', () => {
            const updatedText = 'new text';
            const updatedAnnotation = {
                id: annotation.id,
                description: { message: updatedText },
            };
            const mockHandleEdit = jest.fn().mockImplementation(({ successCallback }) => {
                successCallback(updatedAnnotation);
            });
            useAnnotationAPI.mockImplementation(() => ({
                ...mockUseAnnotationAPIResult,
                handleEdit: mockHandleEdit,
            }));

            const { result } = getHook();
            act(() => {
                result.current.annotationActions.handleAnnotationEdit(annotation.id, updatedText, { can_edit: true });
            });

            expect(mockHandleEdit).toBeCalledWith({
                id: annotation.id,
                permissions: { can_edit: true },
                text: updatedText,
                successCallback: expect.any(Function),
            });
            expect(mockUseAnnotatorEventsResult.emitUpdateAnnotationStartEvent).toBeCalledWith(updatedAnnotation);
            expect(mockUseAnnotatorEventsResult.emitUpdateAnnotationEndEvent).toBeCalledWith(updatedAnnotation);
        });
    });

    describe('handleAnnotationDelete', () => {
        test('should call handleDelete from useAnnotationAPI and call emitDeleteAnnotationStartEvent + emitDeleteAnnotationEndEvent', () => {
            const mockHandleDelete = jest.fn().mockImplementation(({ successCallback }) => {
                successCallback();
            });
            useAnnotationAPI.mockImplementation(() => ({
                ...mockUseAnnotationAPIResult,
                handleDelete: mockHandleDelete,
            }));

            const { result } = getHook();
            act(() => {
                result.current.annotationActions.handleAnnotationDelete({
                    id: annotation.id,
                    permissions: { can_delete: true },
                });
            });

            expect(mockHandleDelete).toBeCalledWith({
                id: annotation.id,
                permissions: { can_delete: true },
                successCallback: expect.any(Function),
            });
            expect(mockUseAnnotatorEventsResult.emitDeleteAnnotationStartEvent).toBeCalledWith(annotation.id);
            expect(mockUseAnnotatorEventsResult.emitDeleteAnnotationEndEvent).toBeCalledWith(annotation.id);
        });
    });

    describe('handleReplyCreate', () => {
        test('should call createReply from useRepliesAPI and call emitAddAnnotationReplyStartEvent + emitAddAnnotationReplyEndEvent', () => {
            const message = 'new comment';
            const createdReply = {
                id: '123',
                tagged_message: message,
            };
            const mockCreateReply = jest
                .fn()
                .mockImplementation(({ successCallback }) => successCallback(createdReply));
            useRepliesAPI.mockImplementation(() => ({
                ...mockUseRepliesAPIResult,
                createReply: mockCreateReply,
            }));

            const { result } = getHook();
            act(() => {
                result.current.repliesActions.handleReplyCreate(message);
            });

            const expectedPayload = {
                tagged_message: message,
                type: 'comment',
            };

            expect(mockCreateReply).toBeCalledWith({
                message,
                requestId: 'uniqueId',
                successCallback: expect.any(Function),
            });
            expect(mockUseAnnotatorEventsResult.emitAddAnnotationReplyStartEvent).toBeCalledWith(
                expectedPayload,
                annotation.id,
                'uniqueId',
            );
            expect(mockUseAnnotatorEventsResult.emitAddAnnotationReplyEndEvent).toBeCalledWith(
                createdReply,
                annotation.id,
                'uniqueId',
            );
        });
    });

    describe('handleReplyEdit', () => {
        test('should call editReply from useRepliesAPI and call emitUpdateAnnotationReplyStartEvent + emitUpdateAnnotationReplyEndEvent', () => {
            const id = '123';
            const message = 'updated comment';
            const permissions = { can_edit: true };
            const updatedReply = {
                id,
                tagged_message: message,
            };
            const mockEditReply = jest.fn().mockImplementation(({ successCallback }) => successCallback(updatedReply));
            useRepliesAPI.mockImplementation(() => ({
                ...mockUseRepliesAPIResult,
                editReply: mockEditReply,
            }));

            const { result } = getHook();
            act(() => {
                result.current.repliesActions.handleReplyEdit(id, message, false, undefined, permissions);
            });

            const expectedPayload = {
                id,
                tagged_message: message,
            };

            expect(mockEditReply).toBeCalledWith({
                id,
                message,
                permissions,
                successCallback: expect.any(Function),
            });
            expect(mockUseAnnotatorEventsResult.emitUpdateAnnotationReplyStartEvent).toBeCalledWith(
                expectedPayload,
                annotation.id,
            );
            expect(mockUseAnnotatorEventsResult.emitUpdateAnnotationReplyEndEvent).toBeCalledWith(
                updatedReply,
                annotation.id,
            );
        });
    });

    describe('handleReplyDelete', () => {
        test('should call deleteReply from useRepliesAPI and call emitDeleteAnnotationReplyStartEvent + emitDeleteAnnotationReplyEndEvent', () => {
            const id = '123';
            const permissions = { can_edit: true };
            const mockDeleteReply = jest.fn().mockImplementation(({ successCallback }) => successCallback());
            useRepliesAPI.mockImplementation(() => ({
                ...mockUseRepliesAPIResult,
                deleteReply: mockDeleteReply,
            }));

            const { result } = getHook();
            act(() => {
                result.current.repliesActions.handleReplyDelete({ id, permissions });
            });

            expect(mockDeleteReply).toBeCalledWith({
                id,
                permissions,
                successCallback: expect.any(Function),
            });
            expect(mockUseAnnotatorEventsResult.emitDeleteAnnotationReplyStartEvent).toBeCalledWith(id, annotation.id);
            expect(mockUseAnnotatorEventsResult.emitDeleteAnnotationReplyEndEvent).toBeCalledWith(id, annotation.id);
        });
    });

    describe('useAnnotationAPI', () => {
        test('shoud call handleFetchAnnotation on mount', () => {
            const mockHandleFetch = jest.fn();
            useAnnotationAPI.mockImplementation(() => ({
                ...mockUseAnnotationAPIResult,
                handleFetch: mockHandleFetch,
            }));

            getHook();

            expect(mockHandleFetch).toBeCalledWith({
                id: annotation.id,
                successCallback: expect.any(Function),
            });
        });

        test('should call handleAnnotationStatusChange with correct params and set annotation state to pending', () => {
            const mockHandleStatusChange = jest.fn();
            useAnnotationAPI.mockImplementation(() => ({
                ...mockUseAnnotationAPIResult,
                handleStatusChange: mockHandleStatusChange,
            }));

            const { result } = getHook();
            act(() => {
                result.current.annotationActions.handleAnnotationStatusChange(annotation.id, 'resolved', {
                    can_resolve: true,
                });
            });

            expect(mockHandleStatusChange).toBeCalledWith({
                id: annotation.id,
                permissions: { can_resolve: true },
                status: 'resolved',
                successCallback: expect.any(Function),
            });
            expect(result.current.annotation.isPending).toEqual(true);
        });
    });

    describe('useAnnotatorEvents', () => {
        const mockFetchAnnotation = (replies = annotation.replies) => {
            const mockHandleFetch = jest
                .fn()
                .mockImplementation(({ successCallback }) => successCallback({ ...annotation, replies }));
            useAnnotationAPI.mockImplementation(() => ({
                ...mockUseAnnotationAPIResult,
                handleFetch: mockHandleFetch,
            }));
        };

        test('should handle onAnnotationDeleteStart and update annotation state to pending', () => {
            jest.useFakeTimers();
            mockFetchAnnotation();

            useAnnotatorEvents.mockImplementation(({ onAnnotationDeleteStart }) => {
                setTimeout(() => {
                    onAnnotationDeleteStart(annotation.id);
                }, 100);
                return mockUseAnnotatorEventsResult;
            });

            const { result } = getHook();
            act(() => {
                jest.advanceTimersByTime(100);
            });

            expect(result.current.annotation.isPending).toEqual(true);
        });

        test('should handle onUpdateAnnotationStart and update annotation state to pending', () => {
            jest.useFakeTimers();
            const updatedAnnotation = {
                ...annotation,
                description: { message: 'new message' },
            };
            mockFetchAnnotation();

            useAnnotatorEvents.mockImplementation(({ onAnnotationUpdateStart }) => {
                setTimeout(() => {
                    onAnnotationUpdateStart(updatedAnnotation);
                }, 100);
                return mockUseAnnotatorEventsResult;
            });

            const { result } = getHook();
            act(() => {
                jest.advanceTimersByTime(100);
            });

            expect(result.current.annotation).toEqual({ ...updatedAnnotation, isPending: true });
        });

        test('should handle onUpdateAnnotationEnd and update annotation values accordingly', () => {
            jest.useFakeTimers();
            const updatedAnnotation = {
                ...annotation,
                description: { message: 'new message' },
            };
            mockFetchAnnotation();
            useAnnotatorEvents.mockImplementation(({ onAnnotationUpdateEnd }) => {
                setTimeout(() => {
                    onAnnotationUpdateEnd(updatedAnnotation);
                }, 100);
                return mockUseAnnotatorEventsResult;
            });

            const { result } = getHook();
            act(() => {
                jest.advanceTimersByTime(100);
            });

            expect(result.current.annotation).toEqual({ ...updatedAnnotation, isPending: false });
        });

        test('should handle onAnnotationReplyAddStart and update reply values accordingly', () => {
            jest.useFakeTimers();
            const isoString = 'isoDateString';
            global.Date.prototype.toISOString = jest.fn().mockImplementation(() => isoString);
            const message = 'new message';
            const newReply = {
                tagged_message: message,
            };
            const requestId = 'reply_123';
            useAnnotatorEvents.mockImplementation(({ onAnnotationReplyAddStart }) => {
                setTimeout(() => {
                    onAnnotationReplyAddStart({ annotationId: annotation.id, reply: newReply, requestId });
                }, 100);
                return mockUseAnnotatorEventsResult;
            });
            const currentUser = {
                id: '1234567',
            };

            const { result } = getHook({ currentUser });

            act(() => {
                jest.advanceTimersByTime(100);
            });

            const expectedReplies = [
                {
                    created_at: isoString,
                    created_by: currentUser,
                    id: requestId,
                    isPending: true,
                    modified_at: isoString,
                    tagged_message: message,
                },
            ];

            expect(result.current.replies).toEqual(expectedReplies);
        });

        test('should handle onAnnotationReplyAddEnd and update reply values accordingly', () => {
            jest.useFakeTimers();

            const message = 'new message';
            const newReply = {
                id: '123',
                tagged_message: message,
            };
            const requestId = 'reply_123';

            const initialReplies = [
                {
                    id: requestId,
                    isPending: true,
                    tagged_message: message,
                },
            ];
            mockFetchAnnotation(initialReplies);

            useAnnotatorEvents.mockImplementation(({ onAnnotationReplyAddEnd }) => {
                setTimeout(() => {
                    onAnnotationReplyAddEnd({ annotationId: annotation.id, reply: newReply, requestId });
                }, 100);
                return mockUseAnnotatorEventsResult;
            });

            const { result } = getHook();

            act(() => {
                jest.advanceTimersByTime(100);
            });

            const expectedReplies = [{ ...newReply, isPending: false }];

            expect(result.current.replies).toEqual(expectedReplies);
        });

        test('should handle onAnnotationReplyUpdateStart and update reply values accordingly', () => {
            jest.useFakeTimers();
            const message = 'updated message';
            const id = '123';
            const updatedReply = {
                id,
                tagged_message: message,
            };

            const initialReplies = [
                {
                    id,
                    tagged_message: 'old message',
                },
            ];
            mockFetchAnnotation(initialReplies);

            useAnnotatorEvents.mockImplementation(({ onAnnotationReplyUpdateStart }) => {
                setTimeout(() => {
                    onAnnotationReplyUpdateStart({ annotationId: annotation.id, reply: updatedReply });
                }, 100);
                return mockUseAnnotatorEventsResult;
            });

            const { result } = getHook();

            act(() => {
                jest.advanceTimersByTime(100);
            });

            const expectedReplies = [{ ...updatedReply, isPending: true }];

            expect(result.current.replies).toEqual(expectedReplies);
        });

        test('should handle onAnnotationReplyUpdateEnd and update reply values accordingly', () => {
            jest.useFakeTimers();
            const message = 'updated message';
            const id = '123';
            const updatedReply = {
                id,
                tagged_message: message,
            };

            const initialReplies = [
                {
                    id,
                    isPending: true,
                    tagged_message: message,
                },
            ];
            mockFetchAnnotation(initialReplies);

            useAnnotatorEvents.mockImplementation(({ onAnnotationReplyUpdateEnd }) => {
                setTimeout(() => {
                    onAnnotationReplyUpdateEnd({ annotationId: annotation.id, reply: updatedReply });
                }, 100);
                return mockUseAnnotatorEventsResult;
            });

            const { result } = getHook();

            act(() => {
                jest.advanceTimersByTime(100);
            });

            const expectedReplies = [{ ...updatedReply, isPending: false }];

            expect(result.current.replies).toEqual(expectedReplies);
        });

        test('should handle onAnnotationReplyDeleteStart and update reply values accordingly', () => {
            jest.useFakeTimers();
            const id = '123';

            const initialReply = {
                id,
                tagged_message: 'message',
            };
            mockFetchAnnotation([initialReply]);

            useAnnotatorEvents.mockImplementation(({ onAnnotationReplyDeleteStart }) => {
                setTimeout(() => {
                    onAnnotationReplyDeleteStart({ annotationId: annotation.id, id });
                }, 100);
                return mockUseAnnotatorEventsResult;
            });

            const { result } = getHook();

            act(() => {
                jest.advanceTimersByTime(100);
            });

            const expectedReplies = [{ ...initialReply, isPending: true }];

            expect(result.current.replies).toEqual(expectedReplies);
        });

        test('should handle onAnnotationReplyDeleteEnd and update reply values accordingly', () => {
            jest.useFakeTimers();
            const id = '123';

            const initialReply = {
                id,
                tagged_message: 'message',
            };
            mockFetchAnnotation([initialReply]);

            useAnnotatorEvents.mockImplementation(({ onAnnotationReplyDeleteEnd }) => {
                setTimeout(() => {
                    onAnnotationReplyDeleteEnd({ annotationId: annotation.id, id });
                }, 100);
                return mockUseAnnotatorEventsResult;
            });

            const { result } = getHook();

            act(() => {
                jest.advanceTimersByTime(100);
            });

            const expectedReplies = [];

            expect(result.current.replies).toEqual(expectedReplies);
        });
    });
});
