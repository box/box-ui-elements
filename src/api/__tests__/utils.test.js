import Xhr from '../../utils/Xhr';
import { getAbortError } from '../../utils/error';
import {
    extractDetailedFieldValue,
    formatComment,
    formatMetadataFieldValue,
    handleOnAbort,
    isDetailedFieldValue,
    mapDetailedFieldToConfidenceScore,
    parseTargetLocation,
} from '../utils';
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

    describe('isDetailedFieldValue()', () => {
        test('should return true for a valid detailed field value object', () => {
            expect(isDetailedFieldValue({ values: 'California', details: {} })).toBe(true);
        });

        test('should return true when values is an array', () => {
            expect(isDetailedFieldValue({ values: ['a', 'b'], details: {} })).toBe(true);
        });

        test('should return false for null', () => {
            expect(isDetailedFieldValue(null)).toBe(false);
        });

        test('should return false for undefined', () => {
            expect(isDetailedFieldValue(undefined)).toBe(false);
        });

        test('should return false for a plain string', () => {
            expect(isDetailedFieldValue('California')).toBe(false);
        });

        test('should return false for a number', () => {
            expect(isDetailedFieldValue(42)).toBe(false);
        });

        test('should return false for an array', () => {
            expect(isDetailedFieldValue(['a', 'b'])).toBe(false);
        });

        test('should return false for an object without "values" key', () => {
            expect(isDetailedFieldValue({ data: 'something' })).toBe(false);
        });
    });

    describe('extractDetailedFieldValue()', () => {
        test('should return the values property from a detailed field value', () => {
            expect(extractDetailedFieldValue({ values: 'California', details: {} })).toBe('California');
        });

        test('should return array values from a detailed field value', () => {
            expect(extractDetailedFieldValue({ values: ['CA', 'NY'], details: {} })).toEqual(['CA', 'NY']);
        });

        test('should return the value as-is when it is not a detailed field value', () => {
            expect(extractDetailedFieldValue('California')).toBe('California');
        });

        test('should return null as-is', () => {
            expect(extractDetailedFieldValue(null)).toBeNull();
        });

        test('should return undefined as-is', () => {
            expect(extractDetailedFieldValue(undefined)).toBeUndefined();
        });

        test('should return number as-is', () => {
            expect(extractDetailedFieldValue(42)).toBe(42);
        });
    });

    describe('mapDetailedFieldToConfidenceScore()', () => {
        test('should return confidence score data for a valid detailed field value', () => {
            const fieldValue = {
                values: 'California',
                details: {
                    confidenceScore: 0.95,
                    confidenceLevel: 'high',
                    process: 'AI_ACCEPTED',
                },
            };
            expect(mapDetailedFieldToConfidenceScore(fieldValue)).toEqual({
                value: 0.95,
                level: 'high',
                isAccepted: true,
            });
        });

        test('should set isAccepted to false when process is not AI_ACCEPTED', () => {
            const fieldValue = {
                values: 'California',
                details: {
                    confidenceScore: 0.6,
                    confidenceLevel: 'medium',
                },
            };
            expect(mapDetailedFieldToConfidenceScore(fieldValue)).toEqual({
                value: 0.6,
                level: 'medium',
                isAccepted: false,
            });
        });

        test('should return undefined when fieldValue is not a detailed field value', () => {
            expect(mapDetailedFieldToConfidenceScore('California')).toBeUndefined();
        });

        test('should return undefined when details is missing', () => {
            expect(mapDetailedFieldToConfidenceScore({ values: 2809.3 })).toBeUndefined();
        });

        test('should return undefined when confidenceScore is null', () => {
            const fieldValue = {
                values: 'California',
                details: { confidenceScore: null, confidenceLevel: 'high', process: 'AI_ACCEPTED' },
            };
            expect(mapDetailedFieldToConfidenceScore(fieldValue)).toBeUndefined();
        });

        test('should return undefined when confidenceScore is undefined', () => {
            const fieldValue = {
                values: 'California',
                details: { confidenceLevel: 'high', process: 'AI_ACCEPTED' },
            };
            expect(mapDetailedFieldToConfidenceScore(fieldValue)).toBeUndefined();
        });

        test('should return undefined when confidenceLevel is missing', () => {
            const fieldValue = {
                values: 'California',
                details: { confidenceScore: 0.9, confidenceLevel: '', process: 'AI_ACCEPTED' },
            };
            expect(mapDetailedFieldToConfidenceScore(fieldValue)).toBeUndefined();
        });

        test('should return confidence score with value 0', () => {
            const fieldValue = {
                values: 'California',
                details: { confidenceScore: 0, confidenceLevel: 'low', process: 'AI_ACCEPTED' },
            };
            expect(mapDetailedFieldToConfidenceScore(fieldValue)).toEqual({
                value: 0,
                level: 'low',
                isAccepted: true,
            });
        });
    });

    describe('parseTargetLocation()', () => {
        test('should return parsed JSON from targetLocation', () => {
            const fieldValue = {
                values: 'California',
                details: {
                    targetLocation:
                        '[{"itemId":"123","page":1,"text":"California","boundingBox":{"left":0.1,"top":0.2,"right":0.3,"bottom":0.4}}]',
                },
            };
            expect(parseTargetLocation(fieldValue)).toEqual([
                {
                    itemId: '123',
                    page: 1,
                    text: 'California',
                    boundingBox: { left: 0.1, top: 0.2, right: 0.3, bottom: 0.4 },
                },
            ]);
        });

        test('should return undefined when fieldValue is not a detailed field value', () => {
            expect(parseTargetLocation('California')).toBeUndefined();
        });

        test('should return undefined when details is missing', () => {
            expect(parseTargetLocation({ values: 2809.3 })).toBeUndefined();
        });

        test('should return undefined when targetLocation is missing', () => {
            const fieldValue = { values: 'California', details: { confidenceScore: 0.9 } };
            expect(parseTargetLocation(fieldValue)).toBeUndefined();
        });

        test('should return undefined when targetLocation is invalid JSON', () => {
            const fieldValue = {
                values: 'California',
                details: { targetLocation: 'not valid json {{{' },
            };
            expect(parseTargetLocation(fieldValue)).toBeUndefined();
        });

        test('should return undefined when targetLocation parses to a non-array value', () => {
            const fieldValue = { values: 'California', details: { targetLocation: '{"key":"value"}' } };
            expect(parseTargetLocation(fieldValue)).toBeUndefined();
        });

        test('should return an empty array when targetLocation is an empty array', () => {
            const fieldValue = { values: 'California', details: { targetLocation: '[]' } };
            expect(parseTargetLocation(fieldValue)).toEqual([]);
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
