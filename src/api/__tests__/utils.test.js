import Xhr from '../../utils/Xhr';
import { getAbortError } from '../../utils/error';
import { formatComment, handleOnAbort } from '../utils';
import { threadedComments, threadedCommentsFormatted } from '../fixtures';

jest.mock('../../utils/Xhr', () => {
    return jest.fn().mockImplementation(() => ({
        abort: jest.fn(),
    }));
});

describe('api/utils', () => {
    describe('formatComment()', () => {
        test('should return a comment and its replies with tagged_message property equal to message', () => {
            expect(formatComment(threadedComments[0])).toMatchObject(threadedCommentsFormatted[0]);
            expect(formatComment(threadedComments[1])).toMatchObject(threadedCommentsFormatted[1]);
        });
    });

    describe('handleOnAbort()', () => {
        test('should abort and throw when called', async () => {
            const xhr = new Xhr();

            await expect(() => handleOnAbort(xhr)).toThrow(getAbortError());

            expect(xhr.abort).toHaveBeenCalled();
        });
    });
});
