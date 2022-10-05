import { renderHook, act } from '@testing-library/react-hooks';
import useAnnotationAPI from '../useAnnotationAPI';
import { annotationsWithFormattedReplies as annotations } from '../../../../../api/fixtures';

describe('src/elements/content-sidebar/activity-feed/useAnnotattionAPI', () => {
    const annotation = annotations[0];

    const getApi = ({
        getAnnotation = jest.fn(),
        updateAnnotation = jest.fn(),
        deleteAnnotation = jest.fn(),
        createAnnotationReply = jest.fn,
        deleteComment = jest.fn(),
        updateComment = jest.fn(),
    }) => {
        const getAnnotationsAPI = () => ({
            createAnnotationReply,
            getAnnotation,
            updateAnnotation,
            deleteAnnotation,
        });

        const getThreadedCommentsAPI = () => ({
            deleteComment,
            updateComment,
        });

        return {
            getAnnotationsAPI,
            getThreadedCommentsAPI,
        };
    };

    const filePermissions = { can_annotate: true, can_view_annotations: true };
    const errorCallback = jest.fn();

    const getHook = props =>
        renderHook(() =>
            useAnnotationAPI({
                api: getApi({}),
                currentUser: {},
                fileId: 'fileId',
                filePermissions,
                annotationId: annotation.id,
                errorCallback,
                ...props,
            }),
        );

    test('Should return correct default values', () => {
        const { result } = getHook();

        expect(result.current.annotation).toEqual(undefined);
        expect(result.current.isLoading).toEqual(true);
        expect(result.current.error).toEqual(undefined);
        expect(result.current.replies).toEqual([]);
    });

    test('Should call fetch annotation on mount', () => {
        const { replies, ...normalizedAnnotation } = annotation;
        const mockGetAnnotation = jest.fn((fileId, annotationId, permissions, successCallback) => {
            successCallback(annotation);
        });
        const api = getApi({ getAnnotation: mockGetAnnotation });

        const { result } = getHook({ api });

        expect(mockGetAnnotation).toBeCalledWith(
            'fileId',
            annotation.id,
            { can_annotate: true, can_view_annotations: true },
            expect.any(Function),
            expect.any(Function),
            true,
        );

        expect(result.current.isLoading).toEqual(false);
        expect(result.current.error).toEqual(undefined);
        expect(result.current.annotation).toEqual(normalizedAnnotation);
        expect(result.current.replies).toEqual(replies);
    });

    test('should call api function on handleEdit with correct arguments and set pending state', () => {
        const mockUpdateAnnotation = jest.fn();
        const api = getApi({ updateAnnotation: mockUpdateAnnotation });
        const { result } = getHook({ api });

        act(() => {
            result.current.handleEdit(annotation.id, 'new text', { can_edit: true });
        });

        expect(mockUpdateAnnotation).toBeCalledWith(
            'fileId',
            annotation.id,
            { can_edit: true },
            { message: 'new text' },
            expect.any(Function),
            expect.any(Function),
        );
        expect(result.current.annotation.isPending).toEqual(true);
    });

    test('should call api function on handleStatusChange with correct arguments', () => {
        const mockUpdateAnnotation = jest.fn();
        const api = getApi({ updateAnnotation: mockUpdateAnnotation });
        const { result } = getHook({ api });

        act(() => {
            result.current.handleStatusChange(annotation.id, 'resolved', { can_resolve: true });
        });

        expect(mockUpdateAnnotation).toBeCalledWith(
            'fileId',
            annotation.id,
            { can_resolve: true },
            { status: 'resolved' },
            expect.any(Function),
            expect.any(Function),
        );
        expect(result.current.annotation.isPending).toEqual(true);
    });

    test('should call api function on handleDelete with correct arguments', () => {
        const mockDeleteAnnotation = jest.fn();
        const api = getApi({ deleteAnnotation: mockDeleteAnnotation });
        const { result } = getHook({ api });

        act(() => {
            result.current.handleDelete({
                id: annotation.id,
                permissions: { can_delete: true },
            });
        });

        expect(mockDeleteAnnotation).toBeCalledWith(
            'fileId',
            annotation.id,
            { can_delete: true },
            expect.any(Function),
            expect.any(Function),
        );
        expect(result.current.annotation.isPending).toEqual(true);
    });

    test('should call api function on handleDeleteReply and set correct values on successCallback', () => {
        const mockDeleteComment = jest.fn(({ successCallback }) => {
            successCallback();
        });
        const api = getApi({ deleteComment: mockDeleteComment });
        const { id, permissions } = annotation.replies[0];
        const { result } = getHook({ api });

        act(() => {
            result.current.handleDeleteReply({ id, permissions });
        });
        expect(result.current.replies.length).toEqual(0);
    });

    test('should call api function on handleEditReply and set correct values on successCallback', () => {
        const message = 'New message';
        const updatedReply = { ...annotation.replies[0], message };
        const mockUpdateComment = jest.fn(({ successCallback }) => {
            successCallback(updatedReply);
        });
        const mockGetAnnotation = jest.fn((fileId, annotationId, permissions, successCallback) => {
            successCallback(annotation);
        });
        const api = getApi({ updateComment: mockUpdateComment, getAnnotation: mockGetAnnotation });
        const { id, permissions } = annotation.replies[0];

        const { result } = getHook({ api });

        act(() => {
            result.current.handleEditReply(id, message, undefined, false, permissions);
        });

        expect(result.current.replies[0].isPending).toEqual(false);
        expect(result.current.replies[0].message).toEqual(message);
    });

    test('should call api function on handleCreateReply and set correct values on successCallback', () => {
        const message = 'New message';
        const newReply = { ...annotation.replies[0], message, id: 'reply_new' };
        const mockCreateAnnotationReply = jest.fn((fileId, annotationId, permissions, newMessage, successCallback) => {
            successCallback(newReply);
        });
        const mockGetAnnotation = jest.fn((fileId, annotationId, permissions, successCallback) => {
            successCallback(annotation);
        });
        const api = getApi({ createAnnotationReply: mockCreateAnnotationReply, getAnnotation: mockGetAnnotation });

        const { result } = getHook({ api });

        act(() => {
            result.current.handleCreateReply(message);
        });

        const createdReply = result.current.replies[1];
        expect(createdReply.isPending).toEqual(false);
        expect(createdReply.message).toEqual(message);
    });
});
