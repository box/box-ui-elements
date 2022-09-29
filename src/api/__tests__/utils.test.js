import { formatComment } from '../utils';
import { threadedComments, threadedCommentsFormatted } from '../fixtures';

describe('api/utils', () => {
    describe('formatComment()', () => {
        test('should return a comment and its replies with tagged_message property equal to message', () => {
            expect(formatComment(threadedComments[0])).toMatchObject(threadedCommentsFormatted[0]);
            expect(formatComment(threadedComments[1])).toMatchObject(threadedCommentsFormatted[1]);
        });
    });
});
