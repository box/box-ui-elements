import { digest, getRandomValues } from '../webcrypto';

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

                const expectedError = new Error('lol');

                digest(algorithm, buffer).catch(error => {
                    expect(error).toBe(expectedError);
                });

                cryptoOperation.onerror(expectedError);
            });
        });
    });
});
