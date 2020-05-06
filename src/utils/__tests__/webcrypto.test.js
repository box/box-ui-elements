import sha1 from 'js-sha1';
import { digest, getRandomValues } from '../webcrypto';

jest.mock('js-sha1');

describe('util/webcrypto', () => {
    describe('getRandomValues()', () => {
        test('should call getRandomValues() to get an array of random values', () => {
            const getRandomValuesMock = jest.fn();
            window.crypto = {
                getRandomValues: getRandomValuesMock,
            };

            getRandomValues();
            expect(getRandomValuesMock).toHaveBeenCalled();
        });
    });

    describe('digest()', () => {
        const algorithm = 'a';
        const buffer = new Uint8Array([1, 2]);
        const digestVal = 'd';

        test('should return the return value of digest() when the crypto lib is not msCrypto', () => {
            const digestMock = jest.fn().mockReturnValueOnce(digestVal);
            window.crypto = {
                subtle: {
                    digest: digestMock,
                },
            };

            expect(digest(algorithm, buffer)).toBe(digestVal);
            expect(digestMock).toHaveBeenCalledWith(algorithm, buffer);
        });
        describe('msCrypto', () => {
            test('should return a promise which resolves properly when the crypto lib is msCrypto', () => {
                sha1.arrayBuffer = jest.fn().mockImplementation(() => new ArrayBuffer());
                const cryptoOperation = {};
                const digestMock = jest.fn().mockReturnValueOnce(cryptoOperation);

                window.crypto = undefined;
                window.msCrypto = {
                    subtle: {
                        digest: digestMock,
                    },
                };

                digest(algorithm, buffer);

                cryptoOperation.oncomplete({
                    target: {
                        result: 'digest',
                    },
                });

                expect(digestMock).toHaveBeenCalledWith({ name: algorithm }, buffer);
                expect(sha1.arrayBuffer).not.toHaveBeenCalled();
            });

            test('should return a promise which rejects properly when the crypto lib is msCrypto', () => {
                const cryptoOperation = {};
                const digestMock = jest.fn().mockReturnValueOnce(cryptoOperation);

                window.crypto = undefined;
                window.msCrypto = {
                    subtle: {
                        digest: digestMock,
                    },
                };

                const expectedError = new Error('ERROR');

                digest(algorithm, buffer).catch(error => {
                    expect(error).toBe(expectedError);
                });

                cryptoOperation.onerror(expectedError);
                expect.assertions(1);
            });
        });
        describe('js-sha1', () => {
            test('should use js-sha1 for calculating hash in IE-11 SHA-1 digest scenarios', async () => {
                // ie11 does not support sha-1, so we use a library
                sha1.arrayBuffer = jest.fn().mockImplementation(() => new ArrayBuffer());
                const digestMock = jest.fn().mockReturnValueOnce({});
                window.crypto = undefined;

                window.msCrypto = {
                    subtle: {
                        digest: digestMock,
                    },
                };

                const hash = await digest('SHA-1', buffer);
                expect(hash).toBeDefined();
                expect(digestMock).not.toHaveBeenCalled();
                expect(sha1.arrayBuffer).toHaveBeenCalledWith(buffer);
            });
            test('should return a promise which rejects properly when js-sha1 fails', () => {
                const expectedError = new Error('ERROR');
                // ie11 does not support sha-1, so we use a library
                sha1.arrayBuffer = jest.fn().mockRejectedValue(expectedError);
                const digestMock = jest.fn().mockReturnValueOnce({});
                window.crypto = undefined;

                window.msCrypto = {
                    subtle: {
                        digest: digestMock,
                    },
                };

                digest('SHA-1', buffer).catch(error => {
                    expect(error).toBe(expectedError);
                });

                expect.assertions(1);
            });
        });
    });
});
