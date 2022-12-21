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
        emitAddAnnotationStartEvent: jest.fn(),
        emitDeleteAnnotationEndEvent: jest.fn(),
        emitDeleteAnnotationStartEvent: jest.fn(),
        emitUpdateAnnotationEndEvent: jest.fn(),
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
        handleReplyDelete: jest.fn(),
        handleReplyEdit: jest.fn(),
        handleReplyCreate: jest.fn(),
    };

    const filePermissions = { can_annotate: true, can_view_annotations: true };
    const errorCallback = jest.fn();

    const getHook = props =>
        renderHook(() =>
            useAnnotationThread({
                api: {},
                currentUser: {},
                file: {
                    id: 'fileId',
                    file_version: { id: '123' },
                    permissions: filePermissions,
                },
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

    test('should return correct values after fetch', () => {
        const { replies, ...normalizedAnnotation } = annotation;
        const mockHandleFetch = jest.fn().mockImplementation(({ successCallback }) => successCallback(annotation));
        useAnnotationAPI.mockImplementation(() => ({
            ...mockUseAnnotationAPIResult,
            handleFetch: mockHandleFetch,
        }));

        const { result } = getHook();

        expect(result.current.annotation).toEqual(normalizedAnnotation);
        expect(result.current.isLoading).toEqual(false);
        expect(result.current.error).toEqual(undefined);
        expect(result.current.replies).toEqual(replies);
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

        test('should call handleAnnotationCreate with correct params', () => {
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
        });

        test('should call handleAnnotationEdit with correct params', () => {
            const mockHandleEdit = jest.fn();
            useAnnotationAPI.mockImplementation(() => ({
                ...mockUseAnnotationAPIResult,
                handleEdit: mockHandleEdit,
            }));

            const { result } = getHook();
            act(() => {
                result.current.annotationActions.handleAnnotationEdit(annotation.id, 'new text', { can_edit: true });
            });

            expect(mockHandleEdit).toBeCalledWith({
                id: annotation.id,
                permissions: { can_edit: true },
                text: 'new text',
                successCallback: expect.any(Function),
            });
        });

        test('should call handleAnnotationDelete with correct params', () => {
            const mockHandleDelete = jest.fn();
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
        const mockFetchAnnotation = () => {
            const mockHandleFetch = jest.fn().mockImplementation(({ successCallback }) => successCallback(annotation));
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
            mockFetchAnnotation();

            useAnnotatorEvents.mockImplementation(({ onAnnotationUpdateStart }) => {
                setTimeout(() => {
                    onAnnotationUpdateStart(annotation.id);
                }, 100);
                return mockUseAnnotatorEventsResult;
            });

            const { result } = getHook();
            act(() => {
                jest.advanceTimersByTime(100);
            });

            expect(result.current.annotation.isPending).toEqual(true);
        });

        test('should handle onUpdateAnnotationEnd and update annotation values accordingly', () => {
            jest.useFakeTimers();
            const updatedAnnotation = {
                ...annotation,
                message: 'new message',
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

        test('should call emitAddAnnotationStartEvent and emitAddAnnotationEndEvent', () => {
            const target = {};
            const text = 'foo';

            const createdAnnotation = {
                description: { message: 'new annotation' },
                target,
            };
            const mockHandleCreate = jest
                .fn()
                .mockImplementation(({ successCallback }) => successCallback(createdAnnotation));
            useAnnotationAPI.mockImplementation(() => ({
                ...mockUseAnnotationAPIResult,
                handleCreate: mockHandleCreate,
            }));

            const { result } = getHook({ target });

            act(() => {
                result.current.annotationActions.handleAnnotationCreate(text);
            });

            const expectedPayload = {
                description: { message: text },
                target,
            };

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
});
