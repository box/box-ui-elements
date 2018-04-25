import Comments from '../Comments';

let comments;
const commentsResponse = { total_count: 0, entries: [] };

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

    describe('comments()', () => {
        test('should not do anything if destroyed', () => {
            comments.isDestroyed = jest.fn().mockReturnValueOnce(true);
            comments.xhr = null;

            const successCb = jest.fn();
            const errorCb = jest.fn();

            return comments.comments('id', successCb, errorCb).catch(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
            });
        });

        test('should make xhr to get comments and call success callback', () => {
            comments.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: commentsResponse }))
            };

            const successCb = jest.fn();

            comments.isDestroyed = jest.fn();

            return comments.comments('id', successCb).then(() => {
                expect(successCb).toHaveBeenCalledWith(commentsResponse);
                expect(comments.isDestroyed).toHaveBeenCalled();
                expect(comments.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url: 'https://api.box.com/2.0/files/id/comments',
                    params: {
                        limit: 100,
                        offset: 0
                    }
                });
            });
        });

        test('should increment offset by limit on each call', () => {
            const pagedCommentsResponse = {
                total_count: 200,
                entries: []
            };
            comments.xhr = {
                get: jest.fn().mockReturnValue(
                    Promise.resolve({
                        data: pagedCommentsResponse
                    })
                )
            };

            const successCb = jest.fn();

            comments.comments('id');

            return comments.comments('id', successCb).then(() => {
                expect(successCb).toHaveBeenCalledWith(pagedCommentsResponse);
                expect(comments.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url: 'https://api.box.com/2.0/files/id/comments',
                    params: {
                        limit: 100,
                        offset: 100
                    }
                });
                expect(comments.offset).toBe(200);
            });
        });

        test('should immediately reject if offset >= total_count', () => {
            const pagedCommentsResponse = {
                total_count: 50,
                entries: []
            };
            comments.xhr = {
                get: jest.fn().mockReturnValue(
                    Promise.resolve({
                        data: pagedCommentsResponse
                    })
                )
            };

            const successCb = jest.fn();
            const errorCb = jest.fn();

            comments.totalCount = 50;
            comments.offset = 50;

            return comments.comments('id', successCb, errorCb).catch(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(errorCb).not.toHaveBeenCalled();
                expect(comments.xhr.get).not.toHaveBeenCalled();
            });
        });

        test('should call error callback when xhr fails', () => {
            const error = new Error('error');
            comments.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.reject(error))
            };

            const successCb = jest.fn();
            const errorCb = jest.fn();

            comments.isDestroyed = jest.fn();

            return comments.comments('id', successCb, errorCb).then(() => {
                expect(successCb).not.toHaveBeenCalled();
                expect(comments.isDestroyed).toHaveBeenCalled();
                expect(errorCb).toHaveBeenCalledWith(error);
                expect(comments.xhr.get).toHaveBeenCalledWith({
                    id: 'file_id',
                    url: 'https://api.box.com/2.0/files/id/comments',
                    params: {
                        limit: 100,
                        offset: 0
                    }
                });
            });
        });
    });
});
