import { withData } from 'leche';

import {
    toISOStringNoMS,
    getFileLastModifiedAsISONoMSIfPossible,
    tryParseJson,
    xhrSendWithIdleTimeout
} from '../uploads';

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
                'file with lastModifiedDate': [
                    {
                        lastModifiedDate: new Date('2017-01-02T03:04:05.678Z')
                    },
                    '2017-01-02T03:04:05Z'
                ],
                'file with lastModifiedDate and lastModified': [
                    {
                        lastModifiedDate: new Date('2017-01-02T03:04:05.678Z'),
                        lastModified: 12345 // should not get used
                    },
                    '2017-01-02T03:04:05Z'
                ],
                'file with lastModified but not lastModifiedDate': [
                    {
                        lastModified: 1483326245678
                    },
                    '2017-01-02T03:04:05Z'
                ],
                'file where lastModifiedDate is not a Date': [
                    {
                        lastModifiedDate: {}
                    },
                    null
                ],
                'file where lastModifiedDate is an invalid Date': [
                    {
                        lastModifiedDate: new Date('not valid')
                    },
                    null
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
                'file with neither lastModifiedDate nor lastModified': [{}, null]
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

    describe('xhrSendWithIdleTimeout()', () => {
        describe('xhrSendWithIdleTimeout()', () => {
            let xhr;

            beforeEach(() => {
                xhr = sandbox.useFakeXMLHttpRequest();
            });

            afterEach(() => {
                xhr.restore();
            });

            it('should call send() on underlying XHR', () => {
                const request = new XMLHttpRequest();
                const data = {};
                sandbox.mock(request).expects('send').withArgs(data);
                xhrSendWithIdleTimeout(request, data, 1000);
            });

            it('should call abort() and callback on underlying XHR after timeout', () => {
                const request = new XMLHttpRequest();
                const data = {};
                let calls = 0;

                function callback() {
                    calls += 1;
                }

                request.open('GET', 'fake', true);
                xhrSendWithIdleTimeout(request, data, 100, callback);

                setTimeout(() => {
                    sandbox.mock(request).expects('abort');
                    assert.equal(calls, 1, 'callback not called exactly once');
                }, 2000);
            });

            it('should call abort() if loaded has not changed', () => {
                const request = new XMLHttpRequest();
                const data = {};

                request.open('GET', 'fake', true);
                xhrSendWithIdleTimeout(request, data, 100);

                setTimeout(() => {
                    sandbox.mock(request).expects('abort');
                    request.upload.eventListeners.progress[0]({ loaded: 0 });
                }, 100);
            });

            it('should not call abort() if there has been progress', () => {
                const request = new XMLHttpRequest();
                const data = {};

                request.open('GET', 'fake', true);
                xhrSendWithIdleTimeout(request, data, 100);
                setTimeout(() => {
                    sandbox.mock(request).expects('abort').never();
                    request.upload.eventListeners.progress[0]({ loaded: 1 });
                }, 100);
            });
        });
    });
});
