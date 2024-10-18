import Xhr from '../../utils/Xhr';
import { getAbortError } from '../../utils/error';
import { formatComment, formatMetadataFieldValue, handleOnAbort } from '../utils';
import { threadedComments, threadedCommentsFormatted } from '../fixtures';
import { FIELD_TYPE_STRING, FIELD_TYPE_TAXONOMY } from '../../features/metadata-instance-fields/constants';

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

    describe('formatMetadataFieldValue()', () => {
        test('should format string field value', async () => {
            const stringField = {
                displayName: 'State',
                id: '1',
                key: 'stateField',
                type: FIELD_TYPE_STRING,
            };
            const value = 'California';

            expect(formatMetadataFieldValue(stringField, value)).toEqual(value);
        });

        test('should format taxonomy field value', async () => {
            const taxonomyField = {
                displayName: 'State',
                id: '1',
                key: 'stateField',
                type: FIELD_TYPE_TAXONOMY,
            };
            const id = '123-456';
            const displayName = 'California';
            const expectedValue = [{ value: id, displayValue: displayName }];

            expect(formatMetadataFieldValue(taxonomyField, [{ id, displayName }])).toEqual(expectedValue);
        });
    });
});
