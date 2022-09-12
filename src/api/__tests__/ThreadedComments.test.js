import ThreadedComments from '../ThreadedComments';
import {
    ERROR_CODE_CREATE_COMMENT,
    ERROR_CODE_UPDATE_COMMENT,
    ERROR_CODE_DELETE_COMMENT,
    ERROR_CODE_FETCH_COMMENTS,
    ERROR_CODE_FETCH_REPLIES,
    ERROR_CODE_CREATE_REPLY,
} from '../../constants';

describe('api/ThreadedComments', () => {
    let threadedComments;

    beforeEach(() => {
        threadedComments = new ThreadedComments({});
        threadedComments.delete = jest.fn();
        threadedComments.get = jest.fn();
        threadedComments.markerGet = jest.fn();
        threadedComments.post = jest.fn();
        threadedComments.put = jest.fn();
    });

    afterEach(() => {
        threadedComments.destroy();
        threadedComments = null;
    });

    describe('getUrl()', () => {
        test('should return correct url for threaded comments', () => {
            expect(threadedComments.getUrl()).toBe('https://api.box.com/2.0/undoc/comments');
        });
    });

    describe('getUrlForId()', () => {
        test('should return the correct url for a given threaded comment id', () => {
            expect(threadedComments.getUrlForId('test')).toBe('https://api.box.com/2.0/undoc/comments/test');
        });
    });

    describe('getUrlWithRepliesForId()', () => {
        test('should return the correct replies url for a given threaded comment id', () => {
            expect(threadedComments.getUrlWithRepliesForId('test')).toBe(
                'https://api.box.com/2.0/undoc/comments/test/replies',
            );
        });
    });

    describe('createComment()', () => {
        const file = {
            id: 'foo',
            permissions: {},
            type: 'file',
        };
        const message = 'Test message';
        const errorCallback = jest.fn();
        const successCallback = jest.fn();

        test('should format its parameters and call the post method', () => {
            const permissions = {
                can_comment: true,
            };

            threadedComments.createComment({
                file: { ...file, permissions },
                message,
                errorCallback,
                successCallback,
            });

            expect(threadedComments.post).toBeCalledWith({
                id: 'foo',
                data: {
                    data: {
                        item: {
                            id: 'foo',
                            type: 'file',
                        },
                        message,
                    },
                },
                errorCallback,
                successCallback: expect.any(Function),
                url: 'https://api.box.com/2.0/undoc/comments',
            });
        });

        test('should reject with an error code for calls with invalid permission ', () => {
            threadedComments.createComment({
                file: { ...file, can_comment: false },
                message,
                errorCallback,
                successCallback,
            });

            expect(errorCallback).toBeCalledWith(expect.any(Error), ERROR_CODE_CREATE_COMMENT);
            expect(threadedComments.post).not.toBeCalled();
        });
    });

    describe('updateComment()', () => {
        const status = 'resolved';
        const message = 'hello';
        test('should format its parameters and call the update method for a given id', () => {
            const errorCallback = jest.fn();
            const successCallback = jest.fn();
            threadedComments.updateComment({
                fileId: '12345',
                commentId: 'abc',
                permissions: {
                    can_resolve: true,
                    can_edit: true,
                },
                status,
                message,
                successCallback,
                errorCallback,
            });

            expect(threadedComments.put).toBeCalledWith({
                id: '12345',
                data: { data: { status, message } },
                errorCallback,
                successCallback: expect.any(Function),
                url: 'https://api.box.com/2.0/undoc/comments/abc',
            });
        });

        test.each([
            { can_edit: true, can_resolve: false },
            { can_edit: false, can_resolve: true },
            { can_edit: false, can_resolve: false },
        ])('should reject with an error code for calls with invalid permissions %s', permissions => {
            const errorCallback = jest.fn();
            const successCallback = jest.fn();
            threadedComments.updateComment({
                fileId: '12345',
                commentId: 'abc',
                permissions,
                status,
                message,
                successCallback,
                errorCallback,
            });

            expect(errorCallback).toBeCalledWith(expect.any(Error), ERROR_CODE_UPDATE_COMMENT);
            expect(threadedComments.put).not.toBeCalled();
        });
    });

    describe('deleteComment()', () => {
        const errorCallback = jest.fn();
        const successCallback = jest.fn();

        test('should format its parameters and call the delete method for a given id', () => {
            threadedComments.deleteComment({
                fileId: '12345',
                commentId: 'abc',
                permissions: { can_delete: true },
                successCallback,
                errorCallback,
            });

            expect(threadedComments.delete).toBeCalledWith({
                id: '12345',
                errorCallback,
                successCallback,
                url: 'https://api.box.com/2.0/undoc/comments/abc',
            });
        });

        test('should reject with an error code for calls with invalid permissions', () => {
            threadedComments.deleteComment({
                fileId: '12345',
                commentId: '67890',
                permissions: { can_delete: false },
                successCallback,
                errorCallback,
            });

            expect(errorCallback).toBeCalledWith(expect.any(Error), ERROR_CODE_DELETE_COMMENT);
            expect(threadedComments.delete).not.toBeCalled();
        });
    });

    describe('getComments()', () => {
        const errorCallback = jest.fn();
        const successCallback = jest.fn();

        test('should format its parameters and call the get method', () => {
            const permissions = {
                can_comment: true,
            };

            threadedComments.getComments({
                fileId: '12345',
                permissions,
                successCallback,
                errorCallback,
                repliesCount: 1,
            });

            expect(threadedComments.markerGet).toBeCalledWith({
                id: '12345',
                errorCallback,
                requestData: {
                    file_id: '12345',
                    replies_count: 1,
                },
                successCallback: expect.any(Function),
            });
        });

        test('should reject with an error code for calls with invalid permissions', () => {
            const permissions = {
                can_comment: false,
            };
            threadedComments.getComments({
                fileId: '12345',
                permissions,
                successCallback,
                errorCallback,
            });

            expect(errorCallback).toBeCalledWith(expect.any(Error), ERROR_CODE_FETCH_COMMENTS);
            expect(threadedComments.get).not.toBeCalled();
        });
    });

    describe('getCommentReplies()', () => {
        const errorCallback = jest.fn();
        const successCallback = jest.fn();

        test('should format its parameters and call get method', () => {
            const permissions = {
                can_comment: true,
            };

            threadedComments.getCommentReplies({
                fileId: '12345',
                commentId: '67890',
                permissions,
                successCallback,
                errorCallback,
            });

            expect(threadedComments.get).toBeCalledWith({
                id: '12345',
                errorCallback,
                url: 'https://api.box.com/2.0/undoc/comments/67890/replies',
                successCallback,
            });
        });

        test('should reject with an error code for calls with invalid permissions', () => {
            const permissions = {
                can_comment: false,
            };

            threadedComments.getCommentReplies({
                fileId: '12345',
                commentId: '67890',
                permissions,
                successCallback,
                errorCallback,
            });

            expect(errorCallback).toBeCalledWith(expect.any(Error), ERROR_CODE_FETCH_REPLIES);
            expect(threadedComments.get).not.toBeCalled();
        });
    });

    describe('createCommentReply()', () => {
        const errorCallback = jest.fn();
        const successCallback = jest.fn();
        const message = 'Hello';

        test('should format its parameters and call post method', () => {
            const permissions = {
                can_comment: true,
            };

            threadedComments.createCommentReply({
                fileId: '12345',
                commentId: '67890',
                permissions,
                successCallback,
                errorCallback,
                message,
            });

            expect(threadedComments.post).toBeCalledWith({
                id: '12345',
                errorCallback,
                url: 'https://api.box.com/2.0/undoc/comments/67890/replies',
                data: { data: { message } },
                successCallback,
            });
        });

        test('should reject with an error code for calls with invalid permissions', () => {
            const permissions = {
                can_comment: false,
            };

            threadedComments.createCommentReply({
                fileId: '12345',
                commentId: '67890',
                permissions,
                successCallback,
                errorCallback,
                message,
            });

            expect(errorCallback).toBeCalledWith(expect.any(Error), ERROR_CODE_CREATE_REPLY);
            expect(threadedComments.get).not.toBeCalled();
        });
    });
});
