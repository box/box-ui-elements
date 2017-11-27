/* eslint-disable no-unused-expressions, no-underscore-dangle */
import { withData } from 'leche';

import UploadsReachability from '../UploadReachability';
import { DEFAULT_HOSTNAME_UPLOAD } from '../../../constants';

const sandbox = sinon.sandbox.create();

describe('api/UploadsReachability', () => {
    let uploadsReachabilityTest;
    beforeEach(() => {
        uploadsReachabilityTest = new UploadsReachability();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('isUploadHostReachable()', () => {
        it('should return true when the upload host is default upload host', async () => {
            const res = await uploadsReachabilityTest.isUploadHostReachable(DEFAULT_HOSTNAME_UPLOAD);

            expect(res).to.be.true;
        });

        it('should return false when there is an error when making the GET request', async () => {
            window.fetch = sandbox.mock().rejects();

            const res = await uploadsReachabilityTest.isUploadHostReachable('random_url');

            expect(res).to.be.false;
        });

        it('should return true when there is no error when making the GET request', async () => {
            window.fetch = sandbox.mock().resolves();

            const res = await uploadsReachabilityTest.isUploadHostReachable('random_url');

            expect(res).to.be.true;
        });
    });

    describe('getUploadHost()', () => {
        it('should call handlePreflightResponse()', async () => {
            uploadsReachabilityTest.xhr.options = sandbox.mock().resolves();
            uploadsReachabilityTest.handlePreflightResponse = sandbox.mock();

            await uploadsReachabilityTest.getUploadHost();
        });
    });

    describe('handlePreflightResponse()', () => {
        withData(
            [
                [undefined, DEFAULT_HOSTNAME_UPLOAD],
                [null, DEFAULT_HOSTNAME_UPLOAD],
                [{ upload_url: 'http://random.com/hello123' }, 'http://random.com']
            ],
            (response, host) => {
                it('should resolve preflight response to upload host properly', async () => {
                    const res = await uploadsReachabilityTest.handlePreflightResponse(response);

                    expect(res).to.equal(host);
                });
            },
        );
    });

    describe('getReachableUploadHost()', () => {
        it('should return the upload host when it is the default upload host', async () => {
            uploadsReachabilityTest.getUploadHost = sandbox.mock().resolves(DEFAULT_HOSTNAME_UPLOAD);

            const res = await uploadsReachabilityTest.getReachableUploadHost();

            expect(res).to.equal(DEFAULT_HOSTNAME_UPLOAD);
        });

        withData(
            [[{ randomHost: true }, 'randomHost'], [{ randomHost: false }, DEFAULT_HOSTNAME_UPLOAD]],
            (cache, result) => {
                it('should return a reachable host with reference to the cached results', async () => {
                    uploadsReachabilityTest.getUploadHost = sandbox.stub().resolves('randomHost');
                    uploadsReachabilityTest.localStore.getItem = sandbox.mock().returns(cache);

                    const res = await uploadsReachabilityTest.getReachableUploadHost();

                    expect(res).to.equal(result);
                });
            },
        );

        withData([[true, 'randomHost'], [false, DEFAULT_HOSTNAME_UPLOAD]], (isReachable, result) => {
            it('should return a reachable host when host is not cached', async () => {
                const cache = { stuff: true };
                uploadsReachabilityTest.getUploadHost = sandbox.stub().resolves('randomHost');
                uploadsReachabilityTest.isUploadHostReachable = sandbox.stub().resolves(isReachable);
                uploadsReachabilityTest.localStore.getItem = sandbox.mock().returns(cache);
                uploadsReachabilityTest.localStore.setItem = sandbox.mock();

                const res = await uploadsReachabilityTest.getReachableUploadHost();

                expect(res).to.equal(result);
            });
        });
    });
});
