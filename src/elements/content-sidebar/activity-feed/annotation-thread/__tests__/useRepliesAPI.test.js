import { renderHook, act } from '@testing-library/react-hooks';
import { annotation, user } from '../../../../../__mocks__/annotations';
import { threadedCommentsFormatted as replies } from '../../../../../api/fixtures';
import useRepliesAPI from '../useRepliesAPI';

describe('src/elements/content-sidebar/activity-feed/annotation-thread/useRepliesAPI', () => {
    let mockCreateAnnotationReply = jest.fn();
    let mockDeleteComment = jest.fn();
    let mockUpdateComment = jest.fn();

    const getAnnotationsAPI = () => ({
        createAnnotationReply: mockCreateAnnotationReply,
    });

    const getThreadedCommentsAPI = () => ({
        deleteComment: mockDeleteComment,
        updateComment: mockUpdateComment,
    });

    const getApi = () => ({
        getAnnotationsAPI,
        getThreadedCommentsAPI,
    });

    const getHook = props =>
        renderHook(() =>
            useRepliesAPI({
                annotationId: annotation.id,
                api: getApi(),
                currentUser: user,
                fileId: 'fileId',
                filePermissions: { can_comment: true },
                initialReplies: replies,
                ...props,
            }),
        );

    beforeEach(() => {
        mockCreateAnnotationReply = jest.fn();
        mockDeleteComment = jest.fn();
        mockUpdateComment = jest.fn();
    });

    test('Should return correct replies based on initialValues', () => {
        const { result } = getHook({ initialReplies: [] });

        expect(result.current.replies).toEqual([]);
    });

    test('Should return correct replies based on initialValues', () => {
        const { result } = getHook();
        expect(result.current.replies).toEqual(replies);
    });

    test('should call api function on handleDeleteReply with correct arguments and set pending state', () => {
        const { result } = getHook();
        const { id, permissions } = replies[0];

        act(() => {
            result.current.handleDeleteReply({ id, permissions });
        });

        expect(mockDeleteComment).toBeCalledWith({
            fileId: 'fileId',
            commentId: id,
            permissions,
            successCallback: expect.any(Function),
            errorCallback: expect.any(Function),
        });
        expect(result.current.replies[0].isPending).toEqual(true);
    });

    test('should call api function on handleEditReply with correct arguments and set pending state', () => {
        const { result } = getHook();
        const { id, permissions } = replies[0];
        const message = 'Text';

        act(() => {
            result.current.handleEditReply(id, message, undefined, false, permissions);
        });

        expect(mockUpdateComment).toBeCalledWith({
            fileId: 'fileId',
            commentId: id,
            message,
            permissions,
            successCallback: expect.any(Function),
            errorCallback: expect.any(Function),
        });
        expect(result.current.replies[0].isPending).toEqual(true);
    });

    test('should call api function on handleCreateReply with correct arguments and set pending state', () => {
        const { result } = getHook();
        const message = 'Text';

        act(() => {
            result.current.handleCreateReply(message);
        });

        expect(mockCreateAnnotationReply).toBeCalledWith(
            'fileId',
            annotation.id,
            { can_comment: true },
            message,
            expect.any(Function),
            expect.any(Function),
        );
        const createdReply = result.current.replies[2];
        expect(createdReply.isPending).toEqual(true);
        expect(createdReply.created_by).toEqual(user);
    });

    test('should call api function on handleDeleteReply and set correct values on successCallback', () => {
        mockDeleteComment = jest.fn(({ successCallback }) => {
            successCallback();
        });
        const { result } = getHook();
        const { id, permissions } = replies[0];

        act(() => {
            result.current.handleDeleteReply({ id, permissions });
        });
        expect(result.current.replies.length).toEqual(1);
    });

    test('should call api function on handleEditReply and set correct values on successCallback', () => {
        const message = 'New message';
        const updatedReply = { ...replies[0], message };
        mockUpdateComment = jest.fn(({ successCallback }) => {
            successCallback(updatedReply);
        });

        const { result } = getHook();
        const { id, permissions } = replies[0];

        act(() => {
            result.current.handleEditReply(id, message, undefined, false, permissions);
        });

        expect(result.current.replies[0].isPending).toEqual(false);
        expect(result.current.replies[0].message).toEqual(message);
    });
});
