import { renderHook, act } from '@testing-library/react-hooks';
import { annotation, user } from '../../../../../__mocks__/annotations';
import { threadedCommentsFormatted as replies } from '../../../../../api/fixtures';
import useRepliesAPI from '../useRepliesAPI';

describe('src/elements/content-sidebar/activity-feed/annotation-thread/useRepliesAPI', () => {
    const getApi = ({ createAnnotationReply = jest.fn, deleteComment = jest.fn(), updateComment = jest.fn() }) => {
        const getAnnotationsAPI = () => ({
            createAnnotationReply,
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

    const getHook = (props, mockedApiFunctions = {}) =>
        renderHook(() =>
            useRepliesAPI({
                annotationId: annotation.id,
                api: getApi(mockedApiFunctions),
                currentUser: user,
                fileId: 'fileId',
                filePermissions: { can_comment: true },
                handleUpdateOrCreateReplyItem: jest.fn(),
                handleRemoveReplyItem: jest.fn(),
                ...props,
            }),
        );

    test('should call api function on handleDeleteReply with correct arguments', () => {
        const mockDeleteComment = jest.fn();
        const api = getApi({ deleteComment: mockDeleteComment });

        const { result } = getHook({ api });
        const { id, permissions } = replies[0];

        act(() => {
            result.current.handleReplyDelete({ id, permissions });
        });

        expect(mockDeleteComment).toBeCalledWith({
            fileId: 'fileId',
            commentId: id,
            permissions,
            successCallback: expect.any(Function),
            errorCallback: expect.any(Function),
        });
    });

    test('should call api function on handleEditReply with correct arguments', () => {
        const mockUpdateComment = jest.fn();
        const api = getApi({ updateComment: mockUpdateComment });
        const { id, permissions } = replies[0];
        const message = 'Text';

        const { result } = getHook({ api });

        act(() => {
            result.current.handleReplyEdit(id, message, false, permissions);
        });

        expect(mockUpdateComment).toBeCalledWith({
            fileId: 'fileId',
            commentId: id,
            message,
            permissions,
            successCallback: expect.any(Function),
            errorCallback: expect.any(Function),
        });
    });

    test('should call api function on handleCreateReply with correct arguments', () => {
        const mockCreateAnnotationReply = jest.fn();
        const api = getApi({ createAnnotationReply: mockCreateAnnotationReply });
        const message = 'Text';

        const { result } = getHook({ api });

        act(() => {
            result.current.handleReplyCreate(message);
        });

        expect(mockCreateAnnotationReply).toBeCalledWith(
            'fileId',
            annotation.id,
            { can_comment: true },
            message,
            expect.any(Function),
            expect.any(Function),
        );
    });
});
