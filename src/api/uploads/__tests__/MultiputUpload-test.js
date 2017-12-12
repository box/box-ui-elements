/* eslint-disable no-unused-expressions, no-underscore-dangle */
import { withData } from 'leche';

import MultiputUpload from '../MultiputUpload';
import MultiputPart, {
    PART_STATE_UPLOADED,
    PART_STATE_COMPUTING_DIGEST,
    PART_STATE_DIGEST_READY,
    PART_STATE_NOT_STARTED
} from '../MultiputPart';

const sandbox = sinon.sandbox.create();
const config = {
    a: 1
};
let file;
const createSessionUrl = 'https://test.box.com/createSession';
const destinationFolderId = '123';

describe('api/MultiputUpload', () => {
    let multiputUploadTest;
    beforeEach(() => {
        file = {
            size: 1000000,
            name: 'test.txt',
            slice() {}
        };
        multiputUploadTest = new MultiputUpload(config, file, createSessionUrl, destinationFolderId, null);
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
        MultiputUpload.__ResetDependency__('getFileLastModifiedAsISONoMSIfPossible');
    });

    describe('populateParts()', () => {
        it('should create correct parts array', () => {
            // Setup
            multiputUploadTest.partSize = 400000;

            // Expectations
            const expectedParts = [
                new MultiputPart(config, 0, 0, 400000, 1, { upload_part: 'www.box.com' }),
                new MultiputPart(config, 1, 400000, 400000, 1, { upload_part: 'www.box.com' }),
                new MultiputPart(config, 2, 800000, 200000, 1, { upload_part: 'www.box.com' })
            ];

            // Execute
            multiputUploadTest.populateParts();

            // Verify
            assert.equal(multiputUploadTest.numPartsNotStarted, 3, 'numPartsNotStarted should be set to 3');
            for (let i = 0; i < 3; i += 1) {
                assert.equal(multiputUploadTest.parts[i].offset, expectedParts[i].offset);
                assert.equal(multiputUploadTest.parts[i].size, expectedParts[i].size);
                assert.equal(multiputUploadTest.parts[i].index, expectedParts[i].index);
            }
        });
    });

    describe('uploadNextPart()', () => {
        beforeEach(() => {
            multiputUploadTest.firstUnuploadedPartIndex = 0;
            multiputUploadTest.numPartsUploading = 0;
            multiputUploadTest.parts = [
                new MultiputPart(config, 0, 0, 1024, 1, { upload_part: 'www.box.com' }),
                new MultiputPart(config, 1, 1024, 1024, 1, { upload_part: 'www.box.com' }),
                new MultiputPart(config, 2, 2048, 1024, 1, { upload_part: 'www.box.com' })
            ];
        });

        it('should process first not started part by uploading it if sha-1 ready', () => {
            // Setup
            multiputUploadTest.parts[0].state = PART_STATE_UPLOADED;
            multiputUploadTest.parts[1].state = PART_STATE_COMPUTING_DIGEST;
            multiputUploadTest.parts[2].state = PART_STATE_DIGEST_READY;
            multiputUploadTest.numPartsDigestReady = 1;

            // Expectations
            sandbox.mock(multiputUploadTest.parts[2]).expects('upload');

            // Execute
            multiputUploadTest.uploadNextPart();

            // Verify
            assert.equal(multiputUploadTest.numPartsDigestReady, 0);
            assert.equal(multiputUploadTest.numPartsUploading, 1);
        });

        it('should upload only one part', () => {
            // Setup
            multiputUploadTest.parts[0].state = PART_STATE_DIGEST_READY;
            multiputUploadTest.parts[1].state = PART_STATE_DIGEST_READY;
            multiputUploadTest.parts[2].state = PART_STATE_DIGEST_READY;
            multiputUploadTest.numPartsDigestReady = 3;

            // Expectations
            sandbox.mock(multiputUploadTest.parts[0]).expects('upload');

            // Execute
            multiputUploadTest.uploadNextPart();

            // Verify
            assert.equal(multiputUploadTest.numPartsDigestReady, 2);
            assert.equal(multiputUploadTest.numPartsUploading, 1);
        });
    });

    describe('canStartMorePartUploads()', () => {
        beforeEach(() => {
            multiputUploadTest.config.parallelism = 2;
        });

        withData(
            {
                'ended is true': [false, true],
                'upload pipeline full': [false, false, 2],
                'upload pipeline not full and not ended': [true, false, 1]
            },
            (expected, ended, numPartsUploading) => {
                it('should return correct value:', () => {
                    // Setup
                    multiputUploadTest.destroyed = ended;
                    multiputUploadTest.numPartsUploading = numPartsUploading;
                    // Execute
                    const result = multiputUploadTest.canStartMorePartUploads();
                    // Verify
                    assert.equal(result, expected);
                });
            }
        );
    });

    describe('updateFirstUnuploadedPartIndex()', () => {
        beforeEach(() => {
            multiputUploadTest.firstUnuploadedPartIndex = 0;
            multiputUploadTest.parts = [
                new MultiputPart(config, 0, 0, 1024, 1, { upload_part: 'www.box.com' }),
                new MultiputPart(config, 1, 1024, 1024, 1, { upload_part: 'www.box.com' }),
                new MultiputPart(config, 2, 2048, 1024, 1, { upload_part: 'www.box.com' })
            ];
        });

        it('should update firstUnuploadedPartIndex correctly when first part not done', () => {
            // Setup
            multiputUploadTest.parts[0].state = PART_STATE_COMPUTING_DIGEST;
            multiputUploadTest.parts[1].state = PART_STATE_UPLOADED;

            // Execute
            multiputUploadTest.updateFirstUnuploadedPartIndex();
            // Verify
            assert.equal(multiputUploadTest.firstUnuploadedPartIndex, 0);
        });

        withData(
            {
                'firstUnuploadedPartIndex is 0': [0],
                'firstUnuploadedPartIndex is 1': [1],
                'firstUnuploadedPartIndex is 2': [2]
            },
            (firstUnuploadedPart) => {
                it('should update firstUnuploadedPartIndex correctly when some parts done', () => {
                    // Setup
                    multiputUploadTest.parts[0].state = PART_STATE_UPLOADED;
                    multiputUploadTest.parts[1].state = PART_STATE_UPLOADED;
                    multiputUploadTest.parts[2].state = PART_STATE_COMPUTING_DIGEST;
                    multiputUploadTest.firstUnuploadedPartIndex = firstUnuploadedPart;

                    // Execute
                    multiputUploadTest.updateFirstUnuploadedPartIndex();
                    // Verify
                    assert.equal(multiputUploadTest.firstUnuploadedPartIndex, 2);
                });
            }
        );

        withData(
            {
                'firstUnuploadedPartIndex is 0': [0],
                'firstUnuploadedPartIndex is 1': [1],
                'firstUnuploadedPartIndex is 2': [2]
            },
            (firstUnuploadedPart) => {
                it('should update firstUnuploadedPartIndex correctly when all parts done', () => {
                    // Setup
                    multiputUploadTest.parts[0].state = PART_STATE_UPLOADED;
                    multiputUploadTest.parts[1].state = PART_STATE_UPLOADED;
                    multiputUploadTest.parts[2].state = PART_STATE_UPLOADED;
                    multiputUploadTest.firstUnuploadedPartIndex = firstUnuploadedPart;

                    // Execute
                    multiputUploadTest.updateFirstUnuploadedPartIndex();
                    // Verify
                    assert.equal(multiputUploadTest.firstUnuploadedPartIndex, 3);
                });
            }
        );
    });

    describe('populateParts()', () => {
        it('should create correct parts array', () => {
            // Setup
            multiputUploadTest.partSize = 400000;

            // Expectations
            const expectedParts = [
                new MultiputPart(config, 0, 0, 400000, 1, { upload_part: 'www.box.com' }),
                new MultiputPart(config, 1, 400000, 400000, 1, { upload_part: 'www.box.com' }),
                new MultiputPart(config, 2, 800000, 200000, 1, { upload_part: 'www.box.com' })
            ];

            // Execute
            multiputUploadTest.populateParts();

            // Verify
            assert.equal(multiputUploadTest.numPartsNotStarted, 3, 'numPartsNotStarted should be set to 3');
            for (let i = 0; i < 3; i += 1) {
                assert.equal(multiputUploadTest.parts[i].offset, expectedParts[i].offset);
                assert.equal(multiputUploadTest.parts[i].size, expectedParts[i].size);
                assert.equal(multiputUploadTest.parts[i].index, expectedParts[i].index);
            }
        });
    });

    describe('createUploadSessionSuccessHandler()', () => {
        const data = {
            id: 1,
            part_size: 1,
            session_endpoints: {
                upload_part: 'upload_part',
                list_parts: 'list_parts',
                commit: 'commit',
                abort: 'abort',
                log_event: 'log_event'
            }
        };

        it('should noop when destroyed', () => {
            // Setup
            multiputUploadTest.destroyed = true;

            // Expectations
            sandbox.mock(multiputUploadTest).expects('populateParts').never();
            sandbox.mock(multiputUploadTest).expects('processNextParts').never();

            // Execute
            multiputUploadTest.createUploadSessionSuccessHandler(data);
        });

        it('should update attributes properly, populate parts and process parts when not destroyed', () => {
            // Setup
            multiputUploadTest.destroyed = false;
            multiputUploadTest.sessionId = 0;
            multiputUploadTest.partSize = 0;

            // Expectations
            sandbox.mock(multiputUploadTest).expects('populateParts');
            sandbox.mock(multiputUploadTest).expects('processNextParts');

            // Execute
            multiputUploadTest.createUploadSessionSuccessHandler(data);

            // Verify
            assert.equal(multiputUploadTest.sessionId, data.id);
            assert.equal(multiputUploadTest.partSize, data.part_size);
            assert.deepEqual(multiputUploadTest.sessionEndpoints, {
                createSession: createSessionUrl,
                uploadPart: 'upload_part',
                listParts: 'list_parts',
                commit: 'commit',
                abort: 'abort',
                logEvent: 'log_event'
            });
        });
    });

    describe('createUploadSession()', () => {
        it('should noop when is destroyed', async () => {
            multiputUploadTest.xhr.post = sandbox.mock().never();
            multiputUploadTest.destroyed = true;

            await multiputUploadTest.createUploadSession();
        });

        it('should call createUploadSessionSuccessHandler when the session is created successfully', async () => {
            const data = { a: 2 };

            multiputUploadTest.destroyed = false;
            multiputUploadTest.xhr.post = sandbox.mock().resolves(data);
            multiputUploadTest.createUploadSessionSuccessHandler = sandbox.mock().withArgs(data);

            await multiputUploadTest.createUploadSession();
        });

        it('should call createUploadSessionErrorHandler when the session creation failed', async () => {
            const error = {
                response: {
                    status: 500
                }
            };

            multiputUploadTest.destroyed = false;
            multiputUploadTest.xhr.post = sandbox.mock().rejects(error);
            multiputUploadTest.createUploadSessionErrorHandler = sandbox.mock().withArgs(error.response);

            await multiputUploadTest.createUploadSession();
        });

        it('should invoke createUploadSessionSuccessHandler on 409 session_conflict', async () => {
            // Setup
            const response = {
                status: 409,
                code: 'session_conflict',
                context_info: {
                    session: {
                        part_size: 1234,
                        session_endpoints: {
                            upload_part: 'testUploadPartUrl',
                            commit: 'testCommitUrl',
                            abort: 'testAbortUrl'
                        }
                    }
                }
            };

            // Expectations
            sandbox
                .mock(multiputUploadTest)
                .expects('createUploadSessionSuccessHandler')
                .withExactArgs(response.context_info.session);

            // Execute
            multiputUploadTest.xhr.post = sandbox.mock().rejects({
                response
            });

            await multiputUploadTest.createUploadSession();
        });

        withData(
            {
                'file name conflict': [{ code: 'item_name_in_use', status: 409 }],
                'storage limit exceeded': [{ code: 'storage_limit_exceeded', status: 403 }],
                'insufficient permissions': [{ code: 'access_denied_insufficient_permissions', status: 403 }]
            },
            (response) => {
                it('should invoke onError but not sessionErrorHandler on expected failure', async () => {
                    // Setup

                    multiputUploadTest.onError = sandbox.mock().withArgs(response);

                    // Expectations
                    sandbox.mock(multiputUploadTest).expects('sessionErrorHandler').never();

                    // Execute
                    multiputUploadTest.xhr.post = sandbox.mock().rejects({
                        response
                    });
                    await multiputUploadTest.createUploadSession();
                });
            }
        );

        withData(
            {
                'maybeResponse null': [{ status: 403 }],
                'no code': [{ status: 403, a: 1 }],
                '403 with code that is not storage_limit_exceeded': [{ status: '403', code: 'foo' }],
                '409 with code that is not item_name_in_use': [{ status: 409, code: 'foo' }]
            },
            (response) => {
                it('should invoke sessionErrorHandler on other non-201 status code', async () => {
                    // Expectations
                    sandbox
                        .mock(multiputUploadTest)
                        .expects('sessionErrorHandler')
                        .withExactArgs(response, 'create_session_misc_error', JSON.stringify(response));
                    // Execute
                    multiputUploadTest.xhr.post = sandbox.mock().rejects({
                        response
                    });
                    await multiputUploadTest.createUploadSession();
                });
            }
        );
    });

    describe('createUploadSessionErrorHandler()', () => {
        it('should should noop when isDestroyed', () => {
            // Expectations
            sandbox.mock(multiputUploadTest).expects('isDestroyed').returns(true);

            sandbox.mock(multiputUploadTest).expects('createUploadSessionRetry').never();
            sandbox.mock(multiputUploadTest).expects('sessionErrorHandler').never();

            multiputUploadTest.createUploadSessionErrorHandler();
        });

        it('should retry if retries not exhausted', () => {
            // Expectations
            sandbox.mock(multiputUploadTest).expects('createUploadSessionRetry');
            // Execute
            multiputUploadTest.createUploadSessionErrorHandler();
        });

        it('should fail if retries exhausted', () => {
            // Setup
            multiputUploadTest.config.retries = 3;
            multiputUploadTest.createSessionNumRetriesPerformed = 100;
            const response = { test: 1 };
            // Expectations
            sandbox
                .mock(multiputUploadTest)
                .expects('sessionErrorHandler')
                .withArgs(response, 'create_session_retries_exceeded', JSON.stringify(response));
            // Execute
            multiputUploadTest.createUploadSessionErrorHandler(response);
        });
    });

    describe('createUploadSessionRetry()', () => {
        it('should call createSession again after exponential backoff based on retry count', () => {
            // Setup
            multiputUploadTest.createSessionNumRetriesPerformed = 5;
            const mock = sandbox.mock(multiputUploadTest);
            // Expectations
            MultiputUpload.__Rewire__(
                'getBoundedExpBackoffRetryDelay',
                sandbox
                    .mock()
                    .withExactArgs(
                        multiputUploadTest.config.initialRetryDelayMs,
                        multiputUploadTest.config.maxRetryDelayMs,
                        multiputUploadTest.createSessionNumRetriesPerformed
                    )
                    .returns(10)
            );

            // Execute
            multiputUploadTest.createUploadSessionRetry();
            // Verify
            setTimeout(() => {
                mock.expects('createUploadSession');
                assert.equal(
                    multiputUploadTest.createSessionNumRetriesPerformed,
                    6,
                    'createSessionNumRetriesPerformed was not incremented'
                );
            }, 100);

            MultiputUpload.__ResetDependency__('getBoundedExpBackoffRetryDelay');
        });
    });

    describe('sessionErrorHandler()', () => {
        it('should destroy, log and call error handler properly', async () => {
            MultiputUpload.__Rewire__('retryNumOfTimes', sandbox.mock().resolves());
            multiputUploadTest.destroy = sandbox.mock();
            multiputUploadTest.onError = sandbox.mock();
            multiputUploadTest.abortSession = sandbox.mock();

            await multiputUploadTest.sessionErrorHandler(null, '123', '123');
            MultiputUpload.__ResetDependency__('retryNumOfTimes');
        });
    });

    describe('abortSession()', () => {
        it('should terminate the worker and abort session', () => {
            multiputUploadTest.worker = {
                terminate: sandbox.mock()
            };
            multiputUploadTest.xhr.delete = sandbox.mock();
            multiputUploadTest.sessionEndpoints.abort = 'foo';

            multiputUploadTest.abortSession(null, '123', '123');
        });
    });

    describe('partUploadSuccessHandler()', () => {
        it('should update the part uploading progress and upload next parts', () => {
            const part = {
                uploadedBytes: 1,
                size: 1
            };
            multiputUploadTest.numPartsUploading = 10;
            multiputUploadTest.numPartsUploaded = 10;
            multiputUploadTest.updateProgress = sandbox.mock().withArgs(part.uploadedBytes, part.size);
            multiputUploadTest.processNextParts = sandbox.mock();

            multiputUploadTest.partUploadSuccessHandler(part);
        });
    });

    describe('updateProgress()', () => {
        it('should call onProgress() properly', () => {
            const prevUploadedBytes = 10;
            const newUploadedBytes = 20;

            multiputUploadTest.totalUploadedBytes = 100;
            multiputUploadTest.onProgress = sandbox.mock().withArgs(110);

            multiputUploadTest.updateProgress(prevUploadedBytes, newUploadedBytes);
        });
    });

    describe('updateProgress()', () => {
        it('should call onProgress() properly', () => {
            const prevUploadedBytes = 10;
            const newUploadedBytes = 20;

            multiputUploadTest.totalUploadedBytes = 100;
            multiputUploadTest.onProgress = sandbox.mock().withArgs(110);

            multiputUploadTest.updateProgress(prevUploadedBytes, newUploadedBytes);
        });
    });

    describe('shouldComputeDigestForNextPart()', () => {
        beforeEach(() => {
            multiputUploadTest.config.digestReadahead = 2;
        });

        withData(
            {
                'ended is true': [false, true],
                'a part is already computing': [false, false, 1],
                'all parts started': [false, false, 0, 0],
                'readahead is full': [false, false, 0, 1, 2],
                'no part computing, there is a part not started, and readahead not full': [true, false, 0, 1, 1]
            },
            (expected, ended, numPartsDigestComputing, numPartsNotStarted, numPartsDigestReady) => {
                it('should return correct value', () => {
                    // Setup
                    multiputUploadTest.ended = ended;
                    multiputUploadTest.numPartsDigestComputing = numPartsDigestComputing;
                    multiputUploadTest.numPartsNotStarted = numPartsNotStarted;
                    multiputUploadTest.numPartsDigestReady = numPartsDigestReady;

                    // Execute
                    const result = multiputUploadTest.shouldComputeDigestForNextPart();

                    // Verify
                    assert.equal(result, expected);
                });
            }
        );
    });

    describe('computeDigestForNextPart()', () => {
        beforeEach(() => {
            multiputUploadTest.firstUnuploadedPartIndex = 0;
            multiputUploadTest.numPartsDigestComputing = 0;
            multiputUploadTest.parts = [
                new MultiputPart({}, 0, 0, 1024, 1, { upload_part: 'www.box.com' }),
                new MultiputPart({}, 1, 1024, 1024, 1, { upload_part: 'www.box.com' }),
                new MultiputPart({}, 2, 2048, 1024, 1, { upload_part: 'www.box.com' })
            ];
        });

        it('should process first not started part by calling computeDigestForPart', () => {
            multiputUploadTest.parts[0].state = PART_STATE_UPLOADED;
            multiputUploadTest.parts[1].state = PART_STATE_COMPUTING_DIGEST;
            multiputUploadTest.parts[2].state = PART_STATE_NOT_STARTED;
            multiputUploadTest.numPartsNotStarted = 1;

            // Expectations
            sandbox
                .mock(multiputUploadTest)
                .expects('computeDigestForPart')
                .once()
                .withArgs(multiputUploadTest.parts[2]);

            // Execute
            multiputUploadTest.computeDigestForNextPart();

            // Verify
            assert.equal(multiputUploadTest.numPartsNotStarted, 0);
            assert.equal(multiputUploadTest.numPartsDigestComputing, 1);
        });

        it('should process only one part', () => {
            // Setup
            multiputUploadTest.parts[0].state = PART_STATE_NOT_STARTED;
            multiputUploadTest.parts[1].state = PART_STATE_NOT_STARTED;
            multiputUploadTest.parts[2].state = PART_STATE_NOT_STARTED;
            multiputUploadTest.numPartsNotStarted = 3;

            // Expectations
            sandbox
                .mock(multiputUploadTest)
                .expects('computeDigestForPart')
                .once()
                .withArgs(multiputUploadTest.parts[0]);

            // Execute
            multiputUploadTest.computeDigestForNextPart();

            // Verify
            assert.equal(multiputUploadTest.numPartsNotStarted, 2);
            assert.equal(multiputUploadTest.numPartsDigestComputing, 1);
        });
    });

    describe('computeDigestForPart()', () => {
        it('should read, compute digest, then send part to worker', async () => {
            MultiputUpload.__Rewire__('digest', sandbox.mock().resolves());
            multiputUploadTest.sendPartToWorker = sandbox.mock();
            multiputUploadTest.readFile = sandbox.mock().resolves({
                buffer: new ArrayBuffer(),
                readCompleteTimestamp: 123
            });
            multiputUploadTest.processNextParts = sandbox.mock();

            await multiputUploadTest.computeDigestForPart({
                offset: 1,
                size: 2
            });

            MultiputUpload.__ResetDependency__('digest');
        });
    });

    describe('processNextParts()', () => {
        beforeEach(() => {
            multiputUploadTest.parts = ['part1'];
        });

        it('should call failSessionIfFileChangeDetected and return when it returns true', () => {
            // Expectations
            sandbox.mock(multiputUploadTest).expects('failSessionIfFileChangeDetected').returns(true);

            sandbox.mock(multiputUploadTest).expects('commitSession').never();
            sandbox.mock(multiputUploadTest).expects('updateFirstUnuploadedPartIndex').never();
            sandbox.mock(multiputUploadTest).expects('uploadNextPart').never();

            // Execute
            multiputUploadTest.processNextParts();
        });

        // eslint-disable-next-line
        it('should call failSessionIfFileChangeDetected and return when it returns true, even when everything is ready for commit otherwise', () => {
            // Setup
            multiputUploadTest.numPartsUploaded = 1;
            multiputUploadTest.fileSha1 = 'test';

            // Expectations
            sandbox.mock(multiputUploadTest).expects('failSessionIfFileChangeDetected').returns(true);

            sandbox.mock(multiputUploadTest).expects('commitSession').never();
            sandbox.mock(multiputUploadTest).expects('updateFirstUnuploadedPartIndex').never();
            sandbox.mock(multiputUploadTest).expects('uploadNextPart').never();

            // Execute
            multiputUploadTest.processNextParts();
        });

        it('should only invoke commitSession if all parts are uploaded and SHA-1 done', () => {
            // Setup
            multiputUploadTest.numPartsUploaded = 1;
            multiputUploadTest.fileSha1 = 'test';
            sandbox.stub(multiputUploadTest, 'failSessionIfFileChangeDetected').returns(false);

            // Expectations
            sandbox.mock(multiputUploadTest).expects('commitSession');
            sandbox.mock(multiputUploadTest).expects('updateFirstUnuploadedPartIndex').never();
            sandbox.mock(multiputUploadTest).expects('uploadNextPart').never();

            // Execute
            multiputUploadTest.processNextParts();
        });

        it('should not invoke commitSession when all parts are uploaded but SHA-1 not done', () => {
            // Setup
            multiputUploadTest.numPartsUploaded = 1;
            multiputUploadTest.fileSha1 = undefined;
            sandbox.stub(multiputUploadTest, 'failSessionIfFileChangeDetected').returns(false);
            sandbox.stub(multiputUploadTest, 'canStartMorePartUploads').returns(false);

            // Expectations
            sandbox.mock(multiputUploadTest).expects('commitSession').never();
            sandbox.mock(multiputUploadTest).expects('updateFirstUnuploadedPartIndex');

            // Execute
            multiputUploadTest.processNextParts();
        });

        it('should try to upload parts and send them to worker otherwise', () => {
            // Setup - couldn't figure out how to do multiple return values in Sinon, so this is my hack
            let ctr = 0;
            const returnValues = [true, true, false];
            multiputUploadTest.canStartMorePartUploads = () => {
                const val = returnValues[ctr];
                ctr += 1;
                return val;
            };
            sandbox.stub(multiputUploadTest, 'failSessionIfFileChangeDetected').returns(false);

            // Expectations
            sandbox.mock(multiputUploadTest).expects('updateFirstUnuploadedPartIndex');
            sandbox.mock(multiputUploadTest).expects('uploadNextPart').twice();

            // Execute
            multiputUploadTest.processNextParts();
        });
    });
});
