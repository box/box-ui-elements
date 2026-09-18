import sha1 from 'js-sha1';
import { digest, getRandomValues } from '../webcrypto';

jest.mock('js-sha1');

type WindowWithMsCrypto = Omit<Window, 'crypto'> & { crypto?: Crypto; msCrypto?: Crypto };
type Sha1WithArrayBuffer = typeof sha1 & { arrayBuffer: jest.Mock };
type CryptoOperation = {
    oncomplete?: (event: { target: { result: ArrayBuffer } }) => void;
    onerror?: (reason?: unknown) => void;
};

const sha1Mock = sha1 as Sha1WithArrayBuffer;

describe('util/webcrypto', () => {
    beforeEach(() => {
        Object.defineProperty(globalThis, 'window', {
            value: {
                ...window,
            },
            writable: true,
        });
    });

    describe('getRandomValues()', () => {
        test('should call getRandomValues() to get an array of random values', () => {
            const getRandomValuesMock = jest.fn();
            (window as WindowWithMsCrypto).crypto = {
                getRandomValues: getRandomValuesMock,
            } as unknown as Crypto;

            getRandomValues(new Uint8Array());
            expect(getRandomValuesMock).toHaveBeenCalled();
        });
    });

    describe('digest()', () => {
        const algorithm = 'a';
        const { buffer } = new Uint8Array([1, 2]);
        const digestVal = 'd';

        test('should return the return value of digest() when the crypto lib is not msCrypto', () => {
            const digestMock = jest.fn().mockReturnValueOnce(digestVal);
            (window as WindowWithMsCrypto).crypto = {
                subtle: {
                    digest: digestMock,
                },
            } as unknown as Crypto;

            expect(digest(algorithm, buffer)).toBe(digestVal);
            expect(digestMock).toHaveBeenCalledWith(algorithm, buffer);
        });
        describe('msCrypto', () => {
            test('should return a promise which resolves properly when the crypto lib is msCrypto', async () => {
                sha1Mock.arrayBuffer = jest.fn().mockImplementation(() => new ArrayBuffer(0));
                const cryptoOperation: CryptoOperation = {};
                const digestMock = jest.fn().mockReturnValueOnce(cryptoOperation);
                const expectedDigest = new ArrayBuffer(0);

                (window as WindowWithMsCrypto).crypto = undefined;
                (window as WindowWithMsCrypto).msCrypto = {
                    subtle: {
                        digest: digestMock,
                    },
                } as unknown as Crypto;

                const digestPromise = digest(algorithm, buffer);

                expect(cryptoOperation.oncomplete).toEqual(expect.any(Function));
                cryptoOperation.oncomplete!({
                    target: {
                        result: expectedDigest,
                    },
                });

                await expect(digestPromise).resolves.toBe(expectedDigest);
                expect(digestMock).toHaveBeenCalledWith({ name: algorithm }, buffer);
                expect(sha1Mock.arrayBuffer).not.toHaveBeenCalled();
            });

            test('should return a promise which rejects properly when the crypto lib is msCrypto', async () => {
                const cryptoOperation: CryptoOperation = {};
                const digestMock = jest.fn().mockReturnValueOnce(cryptoOperation);

                (window as WindowWithMsCrypto).crypto = undefined;
                (window as WindowWithMsCrypto).msCrypto = {
                    subtle: {
                        digest: digestMock,
                    },
                } as unknown as Crypto;

                const expectedError = new Error('ERROR');
                const digestPromise = digest(algorithm, buffer);

                expect(cryptoOperation.onerror).toEqual(expect.any(Function));
                cryptoOperation.onerror!(expectedError);
                await expect(digestPromise).rejects.toBe(expectedError);
            });
        });
        describe('js-sha1', () => {
            test('should use js-sha1 for calculating hash in IE-11 SHA-1 digest scenarios', async () => {
                // ie11 does not support sha-1, so we use a library
                sha1Mock.arrayBuffer = jest.fn().mockImplementation(() => new ArrayBuffer(0));
                const digestMock = jest.fn().mockReturnValueOnce({});
                (window as WindowWithMsCrypto).crypto = undefined;

                (window as WindowWithMsCrypto).msCrypto = {
                    subtle: {
                        digest: digestMock,
                    },
                } as unknown as Crypto;

                const hash = await digest('SHA-1', buffer);
                expect(hash).toBeDefined();
                expect(digestMock).not.toHaveBeenCalled();
                expect(sha1Mock.arrayBuffer).toHaveBeenCalledWith(buffer);
            });
            test('should return a promise which rejects properly when js-sha1 fails', () => {
                const expectedError = new Error('ERROR');
                // ie11 does not support sha-1, so we use a library
                sha1Mock.arrayBuffer = jest.fn().mockRejectedValue(expectedError);
                const digestMock = jest.fn().mockReturnValueOnce({});
                (window as WindowWithMsCrypto).crypto = undefined;

                (window as WindowWithMsCrypto).msCrypto = {
                    subtle: {
                        digest: digestMock,
                    },
                } as unknown as Crypto;

                digest('SHA-1', buffer).catch(error => {
                    expect(error).toBe(expectedError);
                });

                expect.assertions(1);
            });
        });
    });
});
