import cloneDeep from 'lodash/cloneDeep';
import ThreadedComments from '../ThreadedComments';
import {
    ERROR_CODE_CREATE_COMMENT,
    ERROR_CODE_UPDATE_COMMENT,
    ERROR_CODE_DELETE_COMMENT,
    ERROR_CODE_FETCH_COMMENT,
    ERROR_CODE_FETCH_COMMENTS,
    ERROR_CODE_FETCH_REPLIES,
    ERROR_CODE_CREATE_REPLY,
} from '../../constants';
import { formatComment } from '../utils';
import { threadedComments as mockThreadedComments } from '../fixtures';

jest.mock('../utils', () => ({ formatComment: jest.fn() }));

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

        test('should return correct url for threaded comments if fileId is given', () => {
            expect(threadedComments.getUrl('123')).toBe('https://api.box.com/2.0/undoc/comments?file_id=123');
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

        test('should return the correct replies url for a given threaded comment id if fileId is given', () => {
            expect(threadedComments.getUrlWithRepliesForId('test', '123')).toBe(
                'https://api.box.com/2.0/undoc/comments/test/replies?file_id=123',
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
                    data: { message },
                },
                errorCallback,
                successCallback,
                url: 'https://api.box.com/2.0/undoc/comments?file_id=foo',
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
                successCallback,
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

    describe('getComment()', () => {
        const errorCallback = jest.fn();
        const successCallback = jest.fn();

        test('should format its parameters and call the get method', () => {
            const permissions = {
                can_comment: true,
            };
            const url = 'http://test-url.com';

            threadedComments.getUrlForId = jest.fn().mockImplementationOnce(() => url);

            threadedComments.getComment({
                commentId: '123',
                fileId: '12345',
                permissions,
                successCallback,
                errorCallback,
            });

            expect(threadedComments.get).toBeCalledWith({
                id: '12345',
                errorCallback,
                successCallback,
                url,
            });
        });

        test('should reject with an error code for calls with invalid permissions', () => {
            const permissions = {
                can_comment: false,
            };
            threadedComments.getComment({
                commentId: '123',
                fileId: '12345',
                permissions,
                successCallback,
                errorCallback,
            });

            expect(errorCallback).toBeCalledWith(expect.any(Error), ERROR_CODE_FETCH_COMMENT);
            expect(threadedComments.get).not.toBeCalled();
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
                    replies_count: 1,
                },
                successCallback,
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
                url: 'https://api.box.com/2.0/undoc/comments/67890/replies?file_id=12345',
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

    describe('successHandler()', () => {
        beforeEach(() => {
            threadedComments.successCallback = jest.fn();
        });

        test('should call the success callback with no data if none provided from API', () => {
            threadedComments.successHandler();
            expect(threadedComments.successCallback).toBeCalledWith();
        });

        test('should call formatReplies method and call the success callback if the response does not contain entries property', () => {
            const response = cloneDeep(mockThreadedComments[0]);
            threadedComments.successHandler(response);
            expect(formatComment).toBeCalledWith(response);
            expect(threadedComments.successCallback).toBeCalled();
        });

        test('should call formatReplies method and call the success callback if the response contains entries (comments)', () => {
            const response = {
                entries: cloneDeep(mockThreadedComments),
                limit: 1000,
                next_marker: null,
            };
            threadedComments.successHandler(response);
            expect(formatComment).toBeCalled();
            expect(threadedComments.successCallback).toBeCalled();
        });
    });
});
