import Comments from '../Comments';

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

    describe('successHandler()', () => {
        test('should return API response with properly formatted data', () => {
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

            const response = {
                total_count: 1,
                entries: [comment, taggedComment]
            };

            comments.successCallback = jest.fn();

            const formattedResponse = {
                ...response,
                entries: [
                    {
                        ...comment,
                        tagged_message: comment.message
                    },
                    taggedComment
                ]
            };

            comments.successHandler(response);
            expect(comments.successCallback).toBeCalledWith(formattedResponse);
        });
    });
});
