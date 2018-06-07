import Comments from '../Comments';
import { PERMISSION_CAN_COMMENT, PERMISSION_CAN_DELETE, PERMISSION_CAN_EDIT } from '../../constants';
import { COMMENTS_FIELDS_TO_FETCH } from '../../util/fields';

let comments;

describe('api/Comments', () => {
    beforeEach(() => {
        comments = new Comments({});
    });

    describe('getUrl()', () => {
        test('should throw when version api url without id', () => {
            expect(() => {
                comments.getUrl();
            }).toThrow();
        });
        test('should return correct version api url with id', () => {
            expect(comments.getUrl('foo')).toBe('https://api.box.com/2.0/files/foo/comments');
        });
    });

    describe('commentsUrl()', () => {
        test('should add an id if provided', () => {
            expect(comments.commentsUrl('foo')).toBe('https://api.box.com/2.0/comments/foo');
        });
    });

    describe('successHandler()', () => {
        const comment = {
            type: 'comment',
            id: '123',
            created_at: 1234567890,
            message: 'NOT A TAGGED MESSAGE',
            tagged_message: '',
            created_by: { name: 'Akon', id: 11 },
            modified_at: 1234567890,
            is_reply_comment: false
        };

        const taggedComment = {
            type: 'comment',
            id: '456',
            created_at: 1234567890,
            tagged_message: 'test @[123:Jeezy] @[10:Kanye West]',
            created_by: { name: 'Akon', id: 11 },
            modified_at: 1234567890,
            is_reply_comment: true
        };

        beforeEach(() => {
            comments.format = jest.fn();
            comments.successCallback = jest.fn();
        });

        test('should call the success callback with no data if none provided from API', () => {
            comments.successHandler();
            expect(comments.successCallback).toBeCalledWith();
        });

        test('should return API response with properly formatted data', () => {
            const response = {
                total_count: 2,
                entries: [comment, taggedComment]
            };
            comments.successHandler(response);
            expect(comments.successCallback).toBeCalled();
            expect(comments.format.mock.calls.length).toBe(2);
        });

        test('should return properly formatted data if only one comment is returned from API', () => {
            comments.successHandler(comment);
            expect(comments.successCallback).toBeCalled();
            expect(comments.format).toBeCalledWith(comment);
        });
    });

    describe('CRUD operations', () => {
        const file = {
            id: 'foo',
            permissions: {}
        };

        const commentId = '123';
        const message = 'hello world';
        const successCb = jest.fn();
        const errorCb = jest.fn();

        beforeEach(() => {
            comments.get = jest.fn();
            comments.post = jest.fn();
            comments.put = jest.fn();
            comments.delete = jest.fn();
            comments.checkApiCallValidity = jest.fn(() => true);

            const url = 'https://www.foo.com/comments';
            comments.commentsUrl = jest.fn(() => url);
        });

        describe('createComment()', () => {
            test('should check for valid comment permissions', () => {
                comments.createComment({ file, message, successCb, errorCb });
                expect(comments.checkApiCallValidity).toBeCalledWith(PERMISSION_CAN_COMMENT, file.permissions, file.id);
            });

            test('should post a well formed comment to the comments endpoint', () => {
                const requestData = {
                    data: {
                        item: {
                            id: file.id,
                            type: 'file'
                        },
                        message,
                        taggedMessage: undefined
                    },
                    params: {
                        fields: COMMENTS_FIELDS_TO_FETCH.toString()
                    }
                };

                comments.createComment({ file, message, successCallback: successCb, errorCallback: errorCb });
                expect(comments.post).toBeCalledWith('foo', comments.commentsUrl(), requestData, successCb, errorCb);
            });
        });

        describe('updateComment()', () => {
            test('should check for valid comment edit permissions', () => {
                comments.updateComment({ file, commentId, message, successCb, errorCb });
                expect(comments.checkApiCallValidity).toBeCalledWith(
                    PERMISSION_CAN_EDIT,
                    {
                        [PERMISSION_CAN_EDIT]: true
                    },
                    file.id
                );
            });

            test('should put a well formed comment update to the comments endpoint', () => {
                const requestData = {
                    data: { message }
                };

                comments.updateComment({
                    file,
                    commentId,
                    message,
                    successCallback: successCb,
                    errorCallback: errorCb
                });
                expect(comments.put).toBeCalledWith(
                    'foo',
                    comments.commentsUrl(commentId),
                    requestData,
                    successCb,
                    errorCb
                );
            });
        });

        describe('deleteComment()', () => {
            test('should check for valid comment delete permissions', () => {
                comments.deleteComment({ file, commentId, successCb, errorCb });
                expect(comments.checkApiCallValidity).toBeCalledWith(
                    PERMISSION_CAN_DELETE,
                    {
                        [PERMISSION_CAN_DELETE]: true
                    },
                    file.id
                );
            });

            test('should delete a comment from the comments endpoint', () => {
                comments.deleteComment({ file, commentId, successCallback: successCb, errorCallback: errorCb });
                expect(comments.delete).toBeCalledWith('foo', comments.commentsUrl(commentId), successCb, errorCb);
            });
        });
    });
});
