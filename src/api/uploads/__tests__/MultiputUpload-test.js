/* eslint-disable no-unused-expressions, no-underscore-dangle */
import { withData } from 'leche';
import * as func from '../../../util/function';
import * as webcrypto from '../../../util/webcrypto';
import * as uploadUtil from '../../../util/uploads';
import MultiputUpload from '../MultiputUpload';
import MultiputPart, {
    PART_STATE_UPLOADED,
    PART_STATE_COMPUTING_DIGEST,
    PART_STATE_DIGEST_READY,
    PART_STATE_NOT_STARTED
} from '../MultiputPart';

const config = {
    a: 1
};
let file;
const createSessionUrl = 'https://test.box.com/createSession';
const partSize = 9;

describe.only('api/MultiputUpload', () => {
    let multiputUploadTest;
    beforeEach(() => {
        file = {
            size: 1000000,
            name: 'test.txt',
            slice() {}
        };
        multiputUploadTest = new MultiputUpload(config);
        multiputUploadTest.file = file;
        multiputUploadTest.partSize = partSize;
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
            multiputUploadTest.parts[2].upload = jest.fn();

            // Execute
            multiputUploadTest.uploadNextPart();

            // Verify
            expect(multiputUploadTest.numPartsDigestReady).toBe(0);
            expect(multiputUploadTest.numPartsUploading).toBe(1);
            expect(multiputUploadTest.parts[2].upload).toHaveBeenCalled();
        });

        it('should upload only one part', () => {
            // Setup
            multiputUploadTest.parts[0].state = PART_STATE_DIGEST_READY;
            multiputUploadTest.parts[1].state = PART_STATE_DIGEST_READY;
            multiputUploadTest.parts[2].state = PART_STATE_DIGEST_READY;
            multiputUploadTest.numPartsDigestReady = 3;

            // Expectations
            multiputUploadTest.parts[0].upload = jest.fn();

            // Execute
            multiputUploadTest.uploadNextPart();

            // Verify
            expect(multiputUploadTest.numPartsDigestReady).toBe(2);
            expect(multiputUploadTest.numPartsUploading).toBe(1);
            expect(multiputUploadTest.parts[0].upload).toHaveBeenCalled();
        });
    });

    describe('canStartMorePartUploads()', () => {
        beforeEach(() => {
            multiputUploadTest.config.parallelism = 2;
        });

        withData(
            {
                'ended is true': [false, true, 1],
                'upload pipeline full': [false, false, 2, 1],
                'upload pipeline not full and not ended': [true, false, 1, 1],
                'upload pipeline not full and not ended but no digest is ready': [false, false, 1, 0]
            },
            (expected, ended, numPartsUploading, numPartsDigestReady) => {
                it('should return correct value:', () => {
                    // Setup
                    multiputUploadTest.destroyed = ended;
                    multiputUploadTest.numPartsUploading = numPartsUploading;
                    multiputUploadTest.numPartsDigestReady = numPartsDigestReady;
                    // Execute
                    const result = multiputUploadTest.canStartMorePartUploads();
                    // Verify
                    expect(result).toBe(expected);
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
            expect(multiputUploadTest.firstUnuploadedPartIndex).toBe(0);
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
                    expect(multiputUploadTest.firstUnuploadedPartIndex).toBe(2);
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
                    expect(multiputUploadTest.firstUnuploadedPartIndex).toBe(3);
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
            expect(multiputUploadTest.numPartsNotStarted).toBe(3);
            for (let i = 0; i < 3; i += 1) {
                expect(multiputUploadTest.parts[i].offset).toBe(expectedParts[i].offset);
                expect(multiputUploadTest.parts[i].size).toBe(expectedParts[i].size);
                expect(multiputUploadTest.parts[i].index).toBe(expectedParts[i].index);
            }
        });
    });

    describe('createSessionSuccessHandler()', () => {
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
            multiputUploadTest.populateParts = jest.fn();
            multiputUploadTest.processNextParts = jest.fn();

            // Execute
            multiputUploadTest.createSessionSuccessHandler(data);

            // Expectations
            expect(multiputUploadTest.populateParts).not.toHaveBeenCalled();
            expect(multiputUploadTest.processNextParts).not.toHaveBeenCalled();
        });

        it('should update attributes properly, populate parts and process parts when not destroyed', () => {
            // Setup
            multiputUploadTest.sessionId = 0;
            multiputUploadTest.partSize = 0;
            multiputUploadTest.sessionEndpoints.createSession = createSessionUrl;
            multiputUploadTest.populateParts = jest.fn();
            multiputUploadTest.processNextParts = jest.fn();

            // Execute
            multiputUploadTest.createSessionSuccessHandler(data);

            // Verify
            expect(multiputUploadTest.sessionId).toBe(data.id);
            expect(multiputUploadTest.partSize).toBe(data.part_size);
            expect(multiputUploadTest.sessionEndpoints).toEqual({
                createSession: createSessionUrl,
                uploadPart: 'upload_part',
                listParts: 'list_parts',
                commit: 'commit',
                abort: 'abort',
                logEvent: 'log_event'
            });
            expect(multiputUploadTest.populateParts).toHaveBeenCalled();
            expect(multiputUploadTest.processNextParts).toHaveBeenCalled();
        });
    });

    describe('createSession()', () => {
        it('should noop when is destroyed', async () => {
            multiputUploadTest.xhr.post = jest.fn();
            multiputUploadTest.destroyed = true;

            await multiputUploadTest.createSession();
            expect(multiputUploadTest.xhr.post).not.toHaveBeenCalled();
        });

        it('should call createSessionSuccessHandler when the session is created successfully', async () => {
            const data = { a: 2 };

            multiputUploadTest.destroyed = false;
            multiputUploadTest.xhr.post = jest.fn().mockReturnValueOnce({ data });
            multiputUploadTest.createSessionSuccessHandler = jest.fn();

            await multiputUploadTest.createSession();
            expect(multiputUploadTest.createSessionSuccessHandler).toHaveBeenCalledWith(data);
        });

        it('should call createSessionErrorHandler when the session creation failed', async () => {
            const error = {
                response: {
                    data: {
                        status: 500
                    }
                }
            };

            multiputUploadTest.destroyed = false;
            multiputUploadTest.getErrorResponse = jest.fn().mockReturnValueOnce(error.response.data);
            multiputUploadTest.xhr.post = jest.fn().mockReturnValueOnce(Promise.reject(error));
            multiputUploadTest.createSessionErrorHandler = jest.fn();

            await multiputUploadTest.createSession();
            expect(multiputUploadTest.createSessionErrorHandler).toHaveBeenCalledWith(error);
        });

        withData(
            {
                'storage limit exceeded': [{ code: 'storage_limit_exceeded', status: 403 }],
                'insufficient permissions': [{ code: 'access_denied_insufficient_permissions', status: 403 }]
            },
            (data) => {
                it('should invoke errorCallback but not sessionErrorHandler on expected failure', async () => {
                    // Setup
                    const error = {
                        response: {
                            data
                        }
                    };

                    multiputUploadTest.errorCallback = jest.fn();
                    multiputUploadTest.getErrorResponse = jest.fn().mockReturnValueOnce(data);
                    multiputUploadTest.createSessionErrorHandler = jest.fn();
                    multiputUploadTest.xhr.post = jest.fn().mockReturnValueOnce(Promise.reject(error));

                    // Execute
                    await multiputUploadTest.createSession();
                    expect(multiputUploadTest.createSessionErrorHandler).not.toHaveBeenCalledWith();
                    expect(multiputUploadTest.errorCallback).toHaveBeenCalledWith(data);
                });
            }
        );

        withData(
            {
                'maybeResponse null': [{ status: 403 }],
                'no code': [{ status: 403, a: 1 }],
                '403 with code that is not storage_limit_exceeded': [{ status: '403', code: 'foo' }]
            },
            (data) => {
                it('should invoke sessionErrorHandler on other non-201 status code', async () => {
                    const error = {
                        response: {
                            data
                        }
                    };

                    multiputUploadTest.getErrorResponse = jest.fn().mockReturnValueOnce(data);
                    multiputUploadTest.sessionErrorHandler = jest.fn();
                    multiputUploadTest.xhr.post = jest.fn().mockReturnValueOnce(Promise.reject(error));

                    // Execute
                    await multiputUploadTest.createSession();

                    expect(multiputUploadTest.sessionErrorHandler).toHaveBeenCalledWith(
                        error,
                        'create_session_misc_error',
                        JSON.stringify(error)
                    );
                });
            }
        );
    });

    describe('createSessionErrorHandler()', () => {
        it('should should noop when isDestroyed', () => {
            multiputUploadTest.destroyed = true;
            multiputUploadTest.createSessionRetry = jest.fn();
            multiputUploadTest.sessionErrorHandler = jest.fn();

            multiputUploadTest.createSessionErrorHandler();
            expect(multiputUploadTest.createSessionRetry).not.toHaveBeenCalled();
            expect(multiputUploadTest.sessionErrorHandler).not.toHaveBeenCalled();
        });

        it('should retry if retries not exhausted', () => {
            // Expectations
            multiputUploadTest.createSessionRetry = jest.fn();
            // Execute
            multiputUploadTest.createSessionErrorHandler();
            expect(multiputUploadTest.createSessionRetry).toHaveBeenCalled();
        });

        it('should fail if retries exhausted', () => {
            // Setup
            const response = { data: { test: 1 } };

            multiputUploadTest.config.retries = 3;
            multiputUploadTest.createSessionNumRetriesPerformed = 100;
            multiputUploadTest.createSessionRetry = jest.fn();
            multiputUploadTest.sessionErrorHandler = jest.fn();

            // Execute
            multiputUploadTest.createSessionErrorHandler(response);
            expect(multiputUploadTest.sessionErrorHandler).toHaveBeenCalledWith(
                response,
                'create_session_retries_exceeded',
                JSON.stringify(response)
            );
        });
    });

    describe('createSessionRetry()', () => {
        it('should call createSession again after exponential backoff based on retry count', () => {
            // Setup
            const clock = jest.useFakeTimers();
            uploadUtil.getBoundedExpBackoffRetryDelay = jest.fn().mockReturnValueOnce(10);
            multiputUploadTest.createSessionNumRetriesPerformed = 5;
            multiputUploadTest.createSession = jest.fn();

            // Execute
            multiputUploadTest.createSessionRetry();

            clock.runTimersToTime(11);
            expect(uploadUtil.getBoundedExpBackoffRetryDelay).toHaveBeenCalledWith(5000, 60000, 5);
            expect(multiputUploadTest.createSession).toHaveBeenCalled();
            expect(multiputUploadTest.createSessionNumRetriesPerformed).toBe(6);

            jest.clearAllTimers();
        });
    });

    describe('sessionErrorHandler()', () => {
        it('should destroy, log and call error handler properly', async () => {
            func.retryNumOfTimes = jest.fn().mockReturnValueOnce(Promise.resolve());
            multiputUploadTest.destroy = jest.fn();
            multiputUploadTest.sessionEndpoints.logEvent = 'logEvent';
            multiputUploadTest.errorCallback = jest.fn();
            multiputUploadTest.abortSession = jest.fn();

            await multiputUploadTest.sessionErrorHandler(null, '123', '123');
            expect(multiputUploadTest.errorCallback).toHaveBeenCalled();
            expect(multiputUploadTest.abortSession).toHaveBeenCalled();
            expect(multiputUploadTest.destroy).toHaveBeenCalled();
        });
    });

    describe('abortSession()', () => {
        it('should terminate the worker and abort session', () => {
            multiputUploadTest.sha1Worker = {
                terminate: jest.fn()
            };
            multiputUploadTest.xhr.delete = jest.fn();
            multiputUploadTest.sessionEndpoints.abort = 'foo';

            multiputUploadTest.abortSession(null, '123', '123');
            expect(multiputUploadTest.xhr.delete).toHaveBeenCalled();
            expect(multiputUploadTest.sha1Worker.terminate).toHaveBeenCalled();
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
            multiputUploadTest.updateProgress = jest.fn();
            multiputUploadTest.processNextParts = jest.fn();

            multiputUploadTest.partUploadSuccessHandler(part);
            expect(multiputUploadTest.updateProgress).toHaveBeenCalledWith(part.uploadedBytes, partSize);
            expect(multiputUploadTest.processNextParts).toHaveBeenCalled();
        });
    });

    describe('updateProgress()', () => {
        it('should call progressCallback() properly', () => {
            const prevUploadedBytes = 10;
            const newUploadedBytes = 20;

            multiputUploadTest.totalUploadedBytes = 100;
            multiputUploadTest.progressCallback = jest.fn();

            multiputUploadTest.updateProgress(prevUploadedBytes, newUploadedBytes);
            expect(multiputUploadTest.progressCallback).toHaveBeenCalledWith({
                loaded: 110,
                total: file.size
            });
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
                    expect(result).toBe(expected);
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
            multiputUploadTest.computeDigestForPart = jest.fn();

            // Execute
            multiputUploadTest.computeDigestForNextPart();

            // Verify
            expect(multiputUploadTest.numPartsNotStarted).toBe(0);
            expect(multiputUploadTest.numPartsDigestComputing).toBe(1);
            expect(multiputUploadTest.computeDigestForPart).toHaveBeenCalledWith(multiputUploadTest.parts[2]);
        });

        it('should process only one part', () => {
            // Setup
            multiputUploadTest.parts[0].state = PART_STATE_NOT_STARTED;
            multiputUploadTest.parts[1].state = PART_STATE_NOT_STARTED;
            multiputUploadTest.parts[2].state = PART_STATE_NOT_STARTED;
            multiputUploadTest.numPartsNotStarted = 3;
            multiputUploadTest.computeDigestForPart = jest.fn();

            // Execute
            multiputUploadTest.computeDigestForNextPart();

            // Verify
            expect(multiputUploadTest.numPartsNotStarted).toBe(2);
            expect(multiputUploadTest.numPartsDigestComputing).toBe(1);
            expect(multiputUploadTest.computeDigestForPart).toHaveBeenCalledWith(multiputUploadTest.parts[0]);
        });
    });

    describe('computeDigestForPart()', () => {
        it('should read, compute digest, then send part to worker', async () => {
            webcrypto.digest = jest.fn().mockReturnValueOnce(Promise.resolve());
            multiputUploadTest.sendPartToWorker = jest.fn();
            multiputUploadTest.readFile = jest.fn().mockReturnValueOnce({
                buffer: new ArrayBuffer(),
                readCompleteTimestamp: 123
            });
            multiputUploadTest.processNextParts = jest.fn();

            await multiputUploadTest.computeDigestForPart({
                offset: 1,
                size: 2
            });
            expect(multiputUploadTest.sendPartToWorker).toHaveBeenCalled();
            expect(multiputUploadTest.processNextParts).toHaveBeenCalled();
            expect(multiputUploadTest.readFile).toHaveBeenCalled();
        });
    });

    describe('processNextParts()', () => {
        beforeEach(() => {
            multiputUploadTest.parts = ['part1'];
        });

        it('should call failSessionIfFileChangeDetected and return when it returns true', () => {
            multiputUploadTest.failSessionIfFileChangeDetected = jest.fn().mockReturnValueOnce(true);
            multiputUploadTest.commitSession = jest.fn();
            multiputUploadTest.updateFirstUnuploadedPartIndex = jest.fn();
            multiputUploadTest.uploadNextPart = jest.fn();

            // Execute
            multiputUploadTest.processNextParts();
            expect(multiputUploadTest.failSessionIfFileChangeDetected).toHaveBeenCalled();
            expect(multiputUploadTest.commitSession).not.toHaveBeenCalled();
            expect(multiputUploadTest.updateFirstUnuploadedPartIndex).not.toHaveBeenCalled();
            expect(multiputUploadTest.uploadNextPart).not.toHaveBeenCalled();
        });

        // eslint-disable-next-line
        it('should call failSessionIfFileChangeDetected and return when it returns true, even when everything is ready for commit otherwise', () => {
            // Setup
            multiputUploadTest.numPartsUploaded = 1;
            multiputUploadTest.failSessionIfFileChangeDetected = jest.fn().mockReturnValueOnce(true);
            multiputUploadTest.commitSession = jest.fn();
            multiputUploadTest.updateFirstUnuploadedPartIndex = jest.fn();
            multiputUploadTest.uploadNextPart = jest.fn();

            // Execute
            multiputUploadTest.processNextParts();
            expect(multiputUploadTest.failSessionIfFileChangeDetected).toHaveBeenCalled();
            expect(multiputUploadTest.commitSession).not.toHaveBeenCalled();
            expect(multiputUploadTest.updateFirstUnuploadedPartIndex).not.toHaveBeenCalled();
            expect(multiputUploadTest.uploadNextPart).not.toHaveBeenCalled();
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

            multiputUploadTest.failSessionIfFileChangeDetected = jest.fn().mockReturnValueOnce(false);
            multiputUploadTest.updateFirstUnuploadedPartIndex = jest.fn();
            multiputUploadTest.uploadNextPart = jest.fn();

            // Execute
            multiputUploadTest.processNextParts();
            expect(multiputUploadTest.updateFirstUnuploadedPartIndex).toHaveBeenCalled();
            expect(multiputUploadTest.uploadNextPart).toHaveBeenCalledTimes(2);
        });
    });
});
