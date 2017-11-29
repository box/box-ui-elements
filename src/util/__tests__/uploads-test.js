import { withData } from 'leche';

import { toISOStringNoMS, getFileLastModifiedAsISONoMSIfPossible, tryParseJson } from '../uploads';

const sandbox = sinon.sandbox.create();

describe('util/uploads', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('toISOStringNoMS()', () => {
        it('should format the time string properly', () => {
            const d = new Date(1273912371111);

            expect(toISOStringNoMS(d)).to.equal('2010-05-15T08:32:51Z');
        });
    });

    describe('getFileLastModifiedAsISONoMSIfPossible()', () => {
        withData(
            {
                'file with valid lastModified': [
                    {
                        lastModified: 1483326245678
                    },
                    '2017-01-02T03:04:05Z'
                ],
                'file with non-numeric lastModified (string)': [
                    {
                        lastModified: 'not a number'
                    },
                    null
                ],
                // I don't know of a browser that has lastModified as a Date object, but I just added
                // these two test cases to confirm that our code does something reasonable (i.e. return
                // a string or null, but not crash).
                'file with non-numeric lastModified (valid Date)': [
                    {
                        lastModified: new Date('2017-01-02T03:04:05.678Z')
                    },
                    '2017-01-02T03:04:05Z'
                ],
                'file with non-numeric lastModified (invalid Date)': [
                    {
                        lastModified: new Date('not valid')
                    },
                    null
                ],
                'file no lastModified': [{}, null]
            },
            (file, expectedResult) => {
                it('should return the properly formatted date when possible and return null otherwise', () => {
                    expect(getFileLastModifiedAsISONoMSIfPossible(file)).to.equal(expectedResult);
                });
            }
        );
    });

    describe('tryParseJson()', () => {
        withData(
            [
                ['', null],
                ['a', null],
                ['{', null],
                ['1', 1],
                ['"a"', 'a'],
                ['{}', {}],
                ['[1,2,3]', [1, 2, 3]],
                ['{"a": 1}', { a: 1 }]
            ],
            (str, expectedResult) => {
                it('should return correct results', () => {
                    expect(tryParseJson(str)).to.deep.equal(expectedResult);
                });
            }
        );
    });
});
