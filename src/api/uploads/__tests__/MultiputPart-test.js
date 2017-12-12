/* eslint-disable no-unused-expressions, no-underscore-dangle */
import { withData } from 'leche';
import MultiputPart, { PART_STATE_UPLOADED } from '../MultiputPart';

const sandbox = sinon.sandbox.create();

describe('api/MultiputPart', () => {
    const options = {};
    const index = 0;
    const offset = 0;
    const size = 1;
    const sessionId = 1;
    const sessionEndpoints = {};
    const config = {};
    const getNumPartsUploading = sandbox.stub();
    let MultiputPartTest;
    beforeEach(() => {
        MultiputPartTest = new MultiputPart(
            options,
            index,
            offset,
            size,
            sessionId,
            sessionEndpoints,
            config,
            getNumPartsUploading
        );
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('upload()', () => {
        it('should throw error if sha256 is not available', () => {
            MultiputPartTest.destroyed = false;
            MultiputPartTest.blob = {};

            MultiputPartTest.xhr.uploadFile = sandbox.mock().never();

            assert.throws(() => {
                MultiputPartTest.upload();
            });
        });

        it('should throw error if blob is not available', () => {
            MultiputPartTest.destroyed = false;
            MultiputPartTest.sha256 = '123';

            MultiputPartTest.xhr.uploadFile = sandbox.mock().never();

            assert.throws(() => {
                MultiputPartTest.upload();
            });
        });

        it('should upload file properly', () => {
            MultiputPartTest.destroyed = false;
            MultiputPartTest.sha256 = '123';
            MultiputPartTest.blob = {};
            MultiputPartTest.xhr.uploadFile = sandbox.mock();

            MultiputPartTest.upload();
        });
    });

    describe('uploadSuccessHandler()', () => {
        it('should noop if destroyed', () => {
            MultiputPartTest.destroyed = true;

            MultiputPartTest.onSuccess = sandbox.mock().never();

            MultiputPartTest.uploadSuccessHandler();
        });

        it('should call onSuccess and update attributes properly', () => {
            const data = { hi: 1 };
            MultiputPartTest.destroyed = false;
            MultiputPartTest.onSuccess = sandbox.mock();

            MultiputPartTest.uploadSuccessHandler(data);

            assert.equal(MultiputPartTest.data, data);
            assert.isNull(MultiputPartTest.blob);
            assert.equal(MultiputPartTest.state, PART_STATE_UPLOADED);
        });
    });

    describe('uploadProgressHandler()', () => {
        it('should noop if destroyed', () => {
            MultiputPartTest.destroyed = true;

            MultiputPartTest.onSuccess = sandbox.mock().never();

            MultiputPartTest.uploadProgressHandler();
        });

        it('should call onProgress and update attributes properly', () => {
            const event = { loaded: 1 };
            MultiputPartTest.destroyed = false;
            MultiputPartTest.onProgress = sandbox.mock();

            MultiputPartTest.uploadProgressHandler(event);

            assert.equal(MultiputPartTest.uploadedBytes, 1);
        });
    });

    describe('uploadErrorHandler()', () => {
        beforeEach(() => {
            MultiputPartTest.xhr = {
                xhr: {
                    readyState: 'readyState',
                    statusText: 'statusText'
                }
            };
        });
        it('should noop if destroyed', () => {
            MultiputPartTest.destroyed = true;

            MultiputPartTest.onSuccess = sandbox.mock().never();

            MultiputPartTest.uploadErrorHandler();
        });

        it('should log error, and call onError when retry is exhausted', () => {
            const error = { message: 'no' };
            MultiputPartTest.destroyed = false;
            MultiputPartTest.numUploadRetriesPerformed = 100;
            MultiputPartTest.config.retries = 1;
            MultiputPartTest.logEvent = sandbox.mock();
            MultiputPartTest.onError = sandbox.mock();

            MultiputPartTest.uploadErrorHandler(error);
        });

        it('should retry upload after delay when retry is not exhausted', () => {
            MultiputPart.__Rewire__('getBoundedExpBackoffRetryDelay', sandbox.mock().returns(10));
            const error = { message: 'no' };
            MultiputPartTest.destroyed = false;
            MultiputPartTest.numUploadRetriesPerformed = 100;
            MultiputPartTest.config.retries = 1000;
            MultiputPartTest.logEvent = sandbox.mock();
            MultiputPartTest.onError = sandbox.mock().never();

            MultiputPartTest.uploadErrorHandler(error);
            setTimeout(() => {
                sandbox.mock(MultiputPartTest).expect('retryUpload');
                assert.equal(MultiputPartTest.numUploadRetriesPerformed, 101);
            }, 100);
            MultiputPart.__ResetDependency__('getBoundedExpBackoffRetryDelay');
        });
    });

    describe('retryUpload()', () => {
        it('should noop if destroyed', () => {
            MultiputPartTest.destroyed = true;

            MultiputPartTest.onSuccess = sandbox.mock().never();

            MultiputPartTest.retryUpload();
        });

        it('should call upload when upload is incomplete', async () => {
            MultiputPartTest.destroyed = false;
            MultiputPartTest.uploadedBytes = 1;
            MultiputPartTest.size = 100;
            MultiputPartTest.numUploadRetriesPerformed = 0;
            MultiputPartTest.upload = sandbox.mock();

            await MultiputPartTest.retryUpload();

            assert.equal(MultiputPartTest.numUploadRetriesPerformed, 1);
        });

        it('should call uploadSuccessHandler when upload is already available on the server', async () => {
            const part = {
                offset: 1,
                part_id: 1
            };
            const parts = [part];

            MultiputPartTest.destroyed = false;
            MultiputPartTest.uploadedBytes = 100;
            MultiputPartTest.size = 100;
            MultiputPartTest.offset = 1;
            MultiputPartTest.numUploadRetriesPerformed = 0;
            MultiputPartTest.upload = sandbox.mock().never();
            MultiputPartTest.uploadSuccessHandler = sandbox.mock().withArgs({
                part
            });
            MultiputPartTest.listParts = sandbox.mock().resolves(parts);

            await MultiputPartTest.retryUpload();
        });

        withData(
            [
                [
                    {
                        offset: 1,
                        part_id: 1
                    },
                    {
                        offset: 1,
                        part_id: 1
                    }
                ],
                [
                    {
                        offset: 1
                    }
                ],
                [
                    {
                        offset: 2,
                        part_id: 1
                    }
                ]
            ],
            (parts) => {
                it('should call upload when upload is not available on the server', async () => {
                    MultiputPartTest.destroyed = false;
                    MultiputPartTest.uploadedBytes = 100;
                    MultiputPartTest.size = 100;
                    MultiputPartTest.numUploadRetriesPerformed = 0;
                    MultiputPartTest.upload = sandbox.mock();
                    MultiputPartTest.uploadSuccessHandler = sandbox.mock().never();
                    MultiputPartTest.listParts = sandbox.mock().resolves(parts);

                    await MultiputPartTest.retryUpload();

                    assert.equal(MultiputPartTest.numUploadRetriesPerformed, 1);
                });
            }
        );
    });

    describe('cancel()', () => {
        it('should tear down properly', () => {
            MultiputPartTest.xhr = {
                abort: sandbox.mock()
            };
            MultiputPartTest.blob = new Blob();
            MultiputPartTest.data = { hi: 1 };
            MultiputPartTest.destroy = sandbox.mock();

            MultiputPartTest.cancel();

            assert.isNull(MultiputPartTest.blob);
            assert.deepEqual(MultiputPartTest.data, {});
        });
    });

    describe('listParts()', () => {
        it('should GET from correct endpoint and return entries', async () => {
            const endpoint = 'www.box.com';
            const entries = [1];
            MultiputPart.__Rewire__('updateQueryParameters', sandbox.mock().returns(endpoint));
            MultiputPartTest.xhr = {
                get: sandbox.mock().resolves({
                    entries
                })
            };

            const res = await MultiputPartTest.listParts(1, 1);

            assert.equal(res, entries);

            MultiputPart.__ResetDependency__('updateQueryParameters');
        });
    });
});
