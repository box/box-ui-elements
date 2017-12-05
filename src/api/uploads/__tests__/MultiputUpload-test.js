/* eslint-disable no-unused-expressions, no-underscore-dangle */
import { withData } from 'leche';

import MultiputUpload from '../MultiputUpload';
import MultiputPart, {
    PART_STATE_UPLOADED,
    PART_STATE_COMPUTING_DIGEST,
    PART_STATE_DIGEST_READY
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
                new MultiputPart(config, 0, 0, 400000),
                new MultiputPart(config, 1, 400000, 400000),
                new MultiputPart(config, 2, 800000, 200000)
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
                new MultiputPart(config, 0, 0, 1024),
                new MultiputPart(config, 1, 1024, 1024),
                new MultiputPart(config, 2, 2048, 1024)
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
                new MultiputPart(config, 0, 0, 1024),
                new MultiputPart(config, 1, 1024, 1024),
                new MultiputPart(config, 2, 2048, 1024)
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
                new MultiputPart(config, 0, 0, 400000),
                new MultiputPart(config, 1, 400000, 400000),
                new MultiputPart(config, 2, 800000, 200000)
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
