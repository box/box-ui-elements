/* eslint-disable no-underscore-dangle */
import webcrypto, { digest, getRandomValues } from '../webcrypto';

const sandbox = sinon.sandbox.create();

describe('util/webcrypto', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('getRandomValues()', () => {
        it('should call getRandomValues() to get an array of random values', () => {
            webcrypto.__Rewire__(
                'getCrypto',
                sandbox.mock().returns({
                    getRandomValues: sandbox.mock()
                })
            );

            getRandomValues();
        });
    });

    describe('digest()', () => {
        const algorithm = 'a';
        const buffer = new Uint8Array([1, 2]);
        const digestVal = 'd';

        it('should return the return value of digest() when the crypto lib is not msCrypto', () => {
            webcrypto.__Rewire__(
                'getCrypto',
                sandbox.mock().returns({
                    subtle: {
                        digest: sandbox.mock().withArgs(algorithm, buffer).returns(digestVal)
                    }
                })
            );

            expect(digest(algorithm, buffer)).to.equal(digestVal);
        });

        describe('msCrypto', () => {
            it('should return a promise which resolves properly when the crypto lib is msCrypto', () => {
                const cryptoOperation = {};
                const cryptoRef = {
                    subtle: {
                        digest: sandbox.mock().withArgs({ name: algorithm }, buffer).returns(cryptoOperation)
                    }
                };
                const msCrypto = window.msCrypto;
                window.msCrypto = cryptoRef;

                webcrypto.__Rewire__('getCrypto', sandbox.mock().returns(cryptoRef));

                digest(algorithm, buffer);

                cryptoOperation.oncomplete({
                    target: {
                        result: 'digest'
                    }
                });

                window.msCrypto = msCrypto;
            });

            it('should return a promise which rejects properly when the crypto lib is msCrypto', () => {
                const cryptoOperation = {};
                const cryptoRef = {
                    subtle: {
                        digest: sandbox.mock().withArgs({ name: algorithm }, buffer).returns(cryptoOperation)
                    }
                };
                const expectedError = new Error('lol');
                const msCrypto = window.msCrypto;
                window.msCrypto = cryptoRef;

                webcrypto.__Rewire__('getCrypto', sandbox.mock().returns(cryptoRef));

                digest(algorithm, buffer).catch((error) => {
                    expect(error).to.equal(expectedError);
                });

                cryptoOperation.onerror(expectedError);

                window.msCrypto = msCrypto;
            });
        });
    });
});
