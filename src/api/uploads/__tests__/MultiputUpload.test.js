import * as func from '../../../utils/function';
import * as webcrypto from '../../../utils/webcrypto';
import * as uploadUtil from '../../../utils/uploads';
import MultiputUpload from '../MultiputUpload';
import MultiputPart, {
    PART_STATE_UPLOADED,
    PART_STATE_UPLOADING,
    PART_STATE_DIGEST_READY,
    PART_STATE_NOT_STARTED,
} from '../MultiputPart';

import { ERROR_CODE_UPLOAD_STORAGE_LIMIT_EXCEEDED } from '../../../constants';

const config = {
    a: 1,
};
let file;
const createSessionUrl = 'https://test.box.com/createSession';
const partSize = 9;

describe('api/uploads/MultiputUpload', () => {
    let multiputUploadTest;
    beforeEach(() => {
        file = {
            size: 1000000,
            name: 'test.txt',
            slice() {},
        };
        multiputUploadTest = new MultiputUpload(config);
        multiputUploadTest.file = file;
        multiputUploadTest.partSize = partSize;
        multiputUploadTest.sessionEndpoints = {};
    });

    describe('getBaseUploadUrlFromPreflightResponse()', () => {
        test('should not change upload host when preflight response is empty', () => {
            // Setup
            multiputUploadTest.getBaseUploadUrl = jest.fn();
            multiputUploadTest.uploadHost = 'random';

            // Execute
            multiputUploadTest.getBaseUploadUrlFromPreflightResponse({
                data: {},
            });

            // Verify
            expect(multiputUploadTest.getBaseUploadUrl).toHaveBeenCalled();
            expect(multiputUploadTest.uploadHost).toEqual('random');
        });

        test('should set upload host when preflight response is not empty', () => {
            const upload_url = 'https://upload.box.com/api/2.0/files/content?upload_session_id=123';
            const expected = 'https://upload.box.com';

            // Setup
            multiputUploadTest.getBaseUploadUrl = jest.fn();
            multiputUploadTest.uploadHost = 'random';

            // Execute
            multiputUploadTest.getBaseUploadUrlFromPreflightResponse({
                data: { upload_url },
            });

            // Verify
            expect(multiputUploadTest.getBaseUploadUrl).toHaveBeenCalled();
            expect(multiputUploadTest.uploadHost).toEqual(expected);
        });
    });

    describe('uploadNextPart()', () => {
        beforeEach(() => {
            multiputUploadTest.firstUnuploadedPartIndex = 0;
            multiputUploadTest.numPartsUploading = 0;
            multiputUploadTest.parts = [
                new MultiputPart(config, 0, 0, 1024, 1, {
                    upload_part: 'www.box.com',
                }),
                new MultiputPart(config, 1, 1024, 1024, 1, {
                    upload_part: 'www.box.com',
                }),
                new MultiputPart(config, 2, 2048, 1024, 1, {
                    upload_part: 'www.box.com',
                }),
            ];
        });

        test('should process first not started part by uploading it if sha-1 ready', () => {
            // Setup
            multiputUploadTest.parts[0].state = PART_STATE_UPLOADED;
            multiputUploadTest.parts[1].state = PART_STATE_DIGEST_READY;
            multiputUploadTest.numPartsDigestReady = 1;

            // Expectations
            multiputUploadTest.parts[1].upload = jest.fn();

            // Execute
            multiputUploadTest.uploadNextPart();

            // Verify
            expect(multiputUploadTest.numPartsDigestReady).toBe(0);
            expect(multiputUploadTest.numPartsUploading).toBe(1);
            expect(multiputUploadTest.parts[1].upload).toHaveBeenCalled();
        });

        test('should upload only one part', () => {
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

        test('should call unpause when part is paused and in digest ready state', () => {
            // Setup
            multiputUploadTest.parts[0].isPaused = true;
            multiputUploadTest.parts[1].isPaused = true;
            multiputUploadTest.parts[0].state = PART_STATE_UPLOADING;
            multiputUploadTest.parts[1].state = PART_STATE_DIGEST_READY;
            multiputUploadTest.numPartsDigestReady = 1;

            // Expectations
            multiputUploadTest.parts[0].unpause = jest.fn();
            multiputUploadTest.parts[1].unpause = jest.fn();

            // Execute
            multiputUploadTest.uploadNextPart();

            // Verify
            expect(multiputUploadTest.parts[0].unpause).not.toBeCalled();
            expect(multiputUploadTest.parts[1].unpause).toBeCalled();
        });

        test('should call upload when part is not paused and in digest ready state', () => {
            // Setup
            multiputUploadTest.parts[0].isPaused = false;
            multiputUploadTest.parts[1].isPaused = false;
            multiputUploadTest.parts[0].state = PART_STATE_UPLOADING;
            multiputUploadTest.parts[1].state = PART_STATE_DIGEST_READY;
            multiputUploadTest.numPartsDigestReady = 1;

            // Expectations
            multiputUploadTest.parts[0].upload = jest.fn();
            multiputUploadTest.parts[1].upload = jest.fn();

            // Execute
            multiputUploadTest.uploadNextPart();

            // Verify
            expect(multiputUploadTest.parts[0].upload).not.toBeCalled();
            expect(multiputUploadTest.parts[1].upload).toBeCalled();
        });
    });

    describe('canStartMorePartUploads()', () => {
        beforeEach(() => {
            multiputUploadTest.config.parallelism = 2;
        });

        // Test Cases In order:
        // Ended is true
        // upload pipeline full
        // upload pipeline not full and not ended
        // upload pipeline not full and not ended but no digest is ready
        test.each`
            expected | ended    | numPartsUploading | numPartsDigestReady
            ${false} | ${true}  | ${1}              | ${undefined}
            ${false} | ${false} | ${2}              | ${1}
            ${true}  | ${false} | ${1}              | ${1}
            ${false} | ${false} | ${1}              | ${0}
        `('should return correct value:', ({ expected, ended, numPartsUploading, numPartsDigestReady }) => {
            // Setup
            multiputUploadTest.destroyed = ended;
            multiputUploadTest.numPartsUploading = numPartsUploading;
            multiputUploadTest.numPartsDigestReady = numPartsDigestReady;
            // Execute
            const result = multiputUploadTest.canStartMorePartUploads();
            // Verify
            expect(result).toBe(expected);
        });
    });

    describe('updateFirstUnuploadedPartIndex()', () => {
        beforeEach(() => {
            multiputUploadTest.firstUnuploadedPartIndex = 0;
            multiputUploadTest.parts = [
                new MultiputPart(config, 0, 0, 1024, 1, {
                    upload_part: 'www.box.com',
                }),
                new MultiputPart(config, 1, 1024, 1024, 1, {
                    upload_part: 'www.box.com',
                }),
                new MultiputPart(config, 2, 2048, 1024, 1, {
                    upload_part: 'www.box.com',
                }),
            ];
        });

        test('should update firstUnuploadedPartIndex correctly when first part not done', () => {
            // Setup
            multiputUploadTest.parts[0].state = PART_STATE_DIGEST_READY;
            multiputUploadTest.parts[1].state = PART_STATE_UPLOADED;

            // Execute
            multiputUploadTest.updateFirstUnuploadedPartIndex();

            // Verify
            expect(multiputUploadTest.firstUnuploadedPartIndex).toBe(0);
        });

        // Test cases in order
        // firstUnuploadedPartIndex is 0
        // firstUnuploadedPartIndex is 1
        // firstUnuploadedPartIndex is 2
        test.each`
            firstUnuploadedPart
            ${0}
            ${1}
            ${2}
        `('should update firstUnuploadedPartIndex correctly when some parts done', ({ firstUnuploadedPart }) => {
            // Setup
            multiputUploadTest.parts[0].state = PART_STATE_UPLOADED;
            multiputUploadTest.parts[1].state = PART_STATE_UPLOADED;
            multiputUploadTest.parts[2].state = PART_STATE_DIGEST_READY;
            multiputUploadTest.firstUnuploadedPartIndex = firstUnuploadedPart;
            // Execute
            multiputUploadTest.updateFirstUnuploadedPartIndex();

            // Verify
            expect(multiputUploadTest.firstUnuploadedPartIndex).toBe(2);
        });

        // Test cases in order
        // firstUnuploadedPartIndex is 0
        // firstUnuploadedPartIndex is 1
        // firstUnuploadedPartIndex is 2
        test.each`
            firstUnuploadedPart
            ${0}
            ${1}
            ${2}
        `('should update firstUnuploadedPartIndex correctly when some parts done', ({ firstUnuploadedPart }) => {
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
    });

    describe('populateParts()', () => {
        test('should create correct parts array', () => {
            // Setup
            multiputUploadTest.partSize = 400000;

            // Expectations
            const expectedParts = [
                new MultiputPart(config, 0, 0, 400000, 1, {
                    upload_part: 'www.box.com',
                }),
                new MultiputPart(config, 1, 400000, 400000, 1, {
                    upload_part: 'www.box.com',
                }),
                new MultiputPart(config, 2, 800000, 200000, 1, {
                    upload_part: 'www.box.com',
                }),
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
                log_event: 'log_event',
            },
        };

        test('should noop when destroyed', () => {
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

        test('should update attributes properly, populate parts and process parts when not destroyed', () => {
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
                logEvent: 'log_event',
            });
            expect(multiputUploadTest.populateParts).toHaveBeenCalled();
            expect(multiputUploadTest.processNextParts).toHaveBeenCalled();
        });
    });

    describe('preflightSuccessHandler()', () => {
        const preflightResponse = { data: 1 };
        const uploadHost = 'upload.xyz.box.com';

        test('should noop when is destroyed', async () => {
            multiputUploadTest.xhr.post = jest.fn();
            multiputUploadTest.destroyed = true;

            await multiputUploadTest.preflightSuccessHandler();
            expect(multiputUploadTest.xhr.post).not.toHaveBeenCalled();
        });

        test('should set parallelism to 1 for Zones', async () => {
            multiputUploadTest.getBaseUploadUrlFromPreflightResponse = jest
                .fn()
                .mockReturnValueOnce('fupload-ec2usw1.app.box.com');
            multiputUploadTest.xhr.post = jest.fn().mockReturnValueOnce({ data: {} });
            multiputUploadTest.createSessionSuccessHandler = jest.fn();

            await multiputUploadTest.preflightSuccessHandler();
            expect(multiputUploadTest.config.parallelism).toBe(1);
            expect(multiputUploadTest.createSessionSuccessHandler).toBeCalledTimes(1);
        });

        test('should call createSessionSuccessHandler when the session is created successfully', async () => {
            const data = { a: 2 };

            multiputUploadTest.destroyed = false;
            multiputUploadTest.xhr.post = jest.fn().mockReturnValueOnce({ data });
            multiputUploadTest.createSessionSuccessHandler = jest.fn();
            multiputUploadTest.getBaseUploadUrlFromPreflightResponse = jest.fn().mockReturnValueOnce(uploadHost);

            await multiputUploadTest.preflightSuccessHandler(preflightResponse);
            expect(multiputUploadTest.createSessionSuccessHandler).toHaveBeenCalledWith(data);
        });

        test('should call createSessionErrorHandler when the session creation failed', async () => {
            const error = {
                response: {
                    data: {
                        status: 500,
                    },
                },
            };

            multiputUploadTest.destroyed = false;
            multiputUploadTest.getErrorResponse = jest.fn().mockReturnValueOnce(error.response.data);
            multiputUploadTest.xhr.post = jest.fn().mockReturnValueOnce(Promise.reject(error));
            multiputUploadTest.createSessionErrorHandler = jest.fn();
            multiputUploadTest.getBaseUploadUrlFromPreflightResponse = jest.fn().mockReturnValueOnce(uploadHost);

            await multiputUploadTest.preflightSuccessHandler(preflightResponse);
            expect(multiputUploadTest.createSessionErrorHandler).toHaveBeenCalledWith(error);
        });

        // Test cases in order
        // storage limit exceeded
        // insuffficient permissions
        test.each`
            data
            ${{ code: ERROR_CODE_UPLOAD_STORAGE_LIMIT_EXCEEDED, status: 403 }}
            ${{ code: 'access_denied_insufficient_permissions', status: 403 }}
        `('should invoke errorCallback but not sessionErrorHandler on expected failure', async ({ data }) => {
            // Setup
            const error = {
                response: {
                    data,
                },
            };

            multiputUploadTest.errorCallback = jest.fn();
            multiputUploadTest.getErrorResponse = jest.fn().mockReturnValueOnce(data);
            multiputUploadTest.createSessionErrorHandler = jest.fn();
            multiputUploadTest.xhr.post = jest.fn().mockReturnValueOnce(Promise.reject(error));
            multiputUploadTest.getBaseUploadUrlFromPreflightResponse = jest.fn().mockReturnValueOnce(uploadHost);

            await multiputUploadTest.preflightSuccessHandler(preflightResponse);
            expect(multiputUploadTest.createSessionErrorHandler).not.toHaveBeenCalledWith();
            expect(multiputUploadTest.errorCallback).toHaveBeenCalledWith(data);
        });

        // Test cases in order
        // maybe response null
        // no code
        // 403 with code that is not storage limit exceeded
        test.each`
            data
            ${{ status: 403 }}
            ${{ status: 403, a: 1 }}
            ${{ status: '403', code: 'foo' }}
        `('should invoke sessionErrorHandler on other non-201 status code', async ({ data }) => {
            const error = {
                response: {
                    data,
                },
            };

            multiputUploadTest.getErrorResponse = jest.fn().mockReturnValueOnce(data);
            multiputUploadTest.sessionErrorHandler = jest.fn();
            multiputUploadTest.xhr.post = jest.fn().mockReturnValueOnce(Promise.reject(error));
            multiputUploadTest.getBaseUploadUrlFromPreflightResponse = jest.fn().mockReturnValueOnce(uploadHost);

            await multiputUploadTest.preflightSuccessHandler(preflightResponse);

            expect(multiputUploadTest.sessionErrorHandler).toHaveBeenCalledWith(
                error,
                'create_session_misc_error',
                JSON.stringify(error),
            );
        });

        describe('resolveConflict', () => {
            test('should overwrite if overwrite is set to true and has context_info', async () => {
                const data = { status: 409, context_info: { conflicts: { id: '30' } } };
                const error = {
                    response: {
                        data,
                    },
                };

                multiputUploadTest.getErrorResponse = jest.fn().mockReturnValueOnce(data);
                multiputUploadTest.sessionErrorHandler = jest.fn();
                multiputUploadTest.xhr.post = jest.fn().mockReturnValueOnce(Promise.reject(error));
                multiputUploadTest.getBaseUploadUrlFromPreflightResponse = jest.fn().mockReturnValueOnce(uploadHost);
                multiputUploadTest.overwrite = true;
                multiputUploadTest.conflictCallback = jest.fn();
                multiputUploadTest.createSessionRetry = jest.fn();

                await multiputUploadTest.preflightSuccessHandler(preflightResponse);

                expect(multiputUploadTest.sessionErrorHandler).not.toHaveBeenCalled();
                expect(multiputUploadTest.conflictCallback).not.toHaveBeenCalled();
                expect(multiputUploadTest.createSessionRetry).toHaveBeenCalled();
            });
            test('should invoke conflictCallback if exists', async () => {
                const data = { status: 409 };
                const error = {
                    response: {
                        data,
                    },
                };

                multiputUploadTest.getErrorResponse = jest.fn().mockReturnValueOnce(data);
                multiputUploadTest.sessionErrorHandler = jest.fn();
                multiputUploadTest.xhr.post = jest.fn().mockReturnValueOnce(Promise.reject(error));
                multiputUploadTest.getBaseUploadUrlFromPreflightResponse = jest.fn().mockReturnValueOnce(uploadHost);
                multiputUploadTest.conflictCallback = jest.fn();
                multiputUploadTest.createSessionRetry = jest.fn();

                await multiputUploadTest.preflightSuccessHandler(preflightResponse);

                expect(multiputUploadTest.sessionErrorHandler).not.toHaveBeenCalled();
                expect(multiputUploadTest.conflictCallback).toHaveBeenCalled();
                expect(multiputUploadTest.createSessionRetry).toHaveBeenCalled();
            });
        });
    });

    describe('getSessionSuccessHandler()', () => {
        let response;
        beforeEach(() => {
            response = {
                data: {
                    total_parts: 25,
                    part_size: multiputUploadTest.partSize,
                    session_endpoints: {
                        uploadPart: 'https://upload.box.com/api/2.0/files/content?upload_session_id=123',
                        listParts: 'https://upload.box.com/api/2.0/files/content?upload_session_id=123/parts',
                        commit: 'https://upload.box.com/api/2.0/files/content?upload_session_id=123/commit',
                        abort: 'https://upload.box.com/api/2.0/files/content?upload_session_id=123',
                        logEvent: 'https://upload.box.com/api/2.0/files/content?upload_session_id=123/log',
                    },
                },
            };
        });

        test('should call processNextParts if some parts are not uploaded', () => {
            // Setup
            multiputUploadTest.numPartsUploaded = 20;
            multiputUploadTest.processNextParts = jest.fn();

            // Execute
            multiputUploadTest.getSessionSuccessHandler(response.data);
            expect(multiputUploadTest.processNextParts).toHaveBeenCalled();
        });
    });

    describe('getSessionErrorHandler()', () => {
        test('should noop when isDestroyed', () => {
            multiputUploadTest.destroyed = true;
            multiputUploadTest.getErrorResponse = jest.fn();
            multiputUploadTest.abortSession = jest.fn();
            multiputUploadTest.upload = jest.fn();

            multiputUploadTest.getSessionErrorHandler();
            expect(multiputUploadTest.getErrorResponse).not.toHaveBeenCalled();
            expect(multiputUploadTest.abortSession).not.toHaveBeenCalled();
            expect(multiputUploadTest.upload).not.toHaveBeenCalled();
        });

        test('should retry on network error', () => {
            multiputUploadTest.numResumeRetries = 1;
            multiputUploadTest.getErrorResponse = jest.fn(error => error.response);
            multiputUploadTest.abortSession = jest.fn();
            multiputUploadTest.upload = jest.fn();
            multiputUploadTest.getSessionInfo = jest.fn();

            const error = { response: { status: 500 } };

            multiputUploadTest.getSessionErrorHandler(error);
            expect(multiputUploadTest.getErrorResponse).toHaveBeenCalledWith(error);
            expect(multiputUploadTest.abortSession).not.toHaveBeenCalled();
            expect(multiputUploadTest.upload).not.toHaveBeenCalled();
            expect(multiputUploadTest.numResumeRetries).toBe(2);
        });

        test('should restart upload process on error due to invalid session ID', () => {
            multiputUploadTest.numResumeRetries = 0;
            multiputUploadTest.getErrorResponse = jest.fn(error => error.response);
            multiputUploadTest.abortSession = jest.fn();
            multiputUploadTest.upload = jest.fn();

            const goneError = { response: { status: 410 } };

            multiputUploadTest.getSessionErrorHandler(goneError);
            expect(multiputUploadTest.getErrorResponse).toHaveBeenCalledWith(goneError);
            expect(multiputUploadTest.abortSession).toHaveBeenCalled();
            expect(multiputUploadTest.upload).toHaveBeenCalled();
            expect(multiputUploadTest.numResumeRetries).toBe(0);
        });

        test('should retry on network disconnect', () => {
            multiputUploadTest.numResumeRetries = 1;
            multiputUploadTest.getErrorResponse = jest.fn(error => error.response);
            multiputUploadTest.abortSession = jest.fn();
            multiputUploadTest.upload = jest.fn();

            let networkDisconnectError = { request: {} }; // No response

            multiputUploadTest.getSessionErrorHandler(networkDisconnectError);
            expect(multiputUploadTest.getErrorResponse).toHaveBeenCalledWith(networkDisconnectError);
            expect(multiputUploadTest.abortSession).not.toHaveBeenCalled();
            expect(multiputUploadTest.upload).not.toHaveBeenCalled();
            expect(multiputUploadTest.numResumeRetries).toBe(2);

            networkDisconnectError = {}; // No request or response
            multiputUploadTest.numResumeRetries = 1;

            multiputUploadTest.getSessionErrorHandler(networkDisconnectError);
            expect(multiputUploadTest.getErrorResponse).toHaveBeenCalledWith(networkDisconnectError);
            expect(multiputUploadTest.abortSession).not.toHaveBeenCalled();
            expect(multiputUploadTest.upload).not.toHaveBeenCalled();
            expect(multiputUploadTest.numResumeRetries).toBe(2);
        });
    });

    describe('createSessionErrorHandler()', () => {
        test('should should noop when isDestroyed', () => {
            multiputUploadTest.destroyed = true;
            multiputUploadTest.createSessionRetry = jest.fn();
            multiputUploadTest.sessionErrorHandler = jest.fn();

            multiputUploadTest.createSessionErrorHandler();
            expect(multiputUploadTest.createSessionRetry).not.toHaveBeenCalled();
            expect(multiputUploadTest.sessionErrorHandler).not.toHaveBeenCalled();
        });

        test('should retry if retries not exhausted', () => {
            // Expectations
            multiputUploadTest.createSessionRetry = jest.fn();
            // Execute
            multiputUploadTest.createSessionErrorHandler();
            expect(multiputUploadTest.createSessionRetry).toHaveBeenCalled();
        });

        test('should fail if retries exhausted', () => {
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
                JSON.stringify(response),
            );
        });
    });

    describe('createSessionRetry()', () => {
        test('should call createSession again after exponential backoff based on retry count', () => {
            // Setup
            const clock = jest.useFakeTimers();
            uploadUtil.getBoundedExpBackoffRetryDelay = jest.fn().mockReturnValueOnce(10);
            multiputUploadTest.createSessionNumRetriesPerformed = 5;
            multiputUploadTest.makePreflightRequest = jest.fn();

            // Execute
            multiputUploadTest.createSessionRetry();

            clock.runTimersToTime(11);
            expect(uploadUtil.getBoundedExpBackoffRetryDelay).toHaveBeenCalledWith(5000, 60000, 5);
            expect(multiputUploadTest.makePreflightRequest).toHaveBeenCalled();
            expect(multiputUploadTest.createSessionNumRetriesPerformed).toBe(6);

            jest.clearAllTimers();
        });
    });

    describe('sessionErrorHandler()', () => {
        test('should destroy, log and call error handler properly', async () => {
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
        test('should terminate the worker and abort session', () => {
            multiputUploadTest.sha1Worker = {
                terminate: jest.fn(),
            };
            multiputUploadTest.xhr.delete = jest.fn().mockResolvedValue();
            multiputUploadTest.sessionEndpoints.abort = 'foo';
            multiputUploadTest.sessionId = '123';

            multiputUploadTest.abortSession(null, '123', '123');
            expect(multiputUploadTest.xhr.delete).toHaveBeenCalled();
            expect(multiputUploadTest.sha1Worker.terminate).toHaveBeenCalled();
        });
    });

    describe('partUploadSuccessHandler()', () => {
        test('should update the part uploading progress and upload next parts', () => {
            const part = {
                uploadedBytes: 1,
                size: 1,
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

    describe('partUploadErrorHandler', () => {
        const error = {
            response: {
                data: {
                    status: 500,
                },
            },
        };

        beforeEach(() => {
            // Setup
            multiputUploadTest.isResumableUploadsEnabled = true;
            multiputUploadTest.numPartsUploaded = 20;
            multiputUploadTest.numPartsUploading = 2;
            multiputUploadTest.numPartsDigestReady = 0;
            multiputUploadTest.firstUnuploadedPartIndex = 0;
            multiputUploadTest.parts = [
                {
                    state: PART_STATE_UPLOADING,
                    numUploadRetriesPerformed: 2,
                    uploadedBytes: 5,
                    reset: jest.fn(),
                    pause: jest.fn(),
                },
                {
                    state: PART_STATE_UPLOADED,
                    numUploadRetriesPerformed: 2,
                    uploadedBytes: 5,
                    reset: jest.fn(),
                    pause: jest.fn(),
                },
                {
                    state: PART_STATE_UPLOADING,
                    numUploadRetriesPerformed: 2,
                    uploadedBytes: 5,
                    reset: jest.fn(),
                    pause: jest.fn(),
                },
            ];

            multiputUploadTest.sessionErrorHandler = jest.fn();
        });

        test('should update numPartsUploading and numPartsDigestReady properly', () => {
            // Execute
            multiputUploadTest.partUploadErrorHandler(error);

            // Verify
            expect(multiputUploadTest.numPartsUploading).toBe(0);
            expect(multiputUploadTest.numPartsDigestReady).toBe(2);
        });

        test('should reset all parts in uploading state when part errors', () => {
            // Execute
            multiputUploadTest.partUploadErrorHandler(error);

            // Verify
            expect(multiputUploadTest.parts[0].reset).toBeCalled();
            expect(multiputUploadTest.parts[1].reset).not.toBeCalled();
            expect(multiputUploadTest.parts[2].reset).toBeCalled();
        });

        test('should pause all parts in uploading state when part errors', () => {
            // Execute
            multiputUploadTest.partUploadErrorHandler(error);

            // Verify
            expect(multiputUploadTest.parts[0].pause).toBeCalled();
            expect(multiputUploadTest.parts[1].pause).not.toBeCalled();
            expect(multiputUploadTest.parts[2].pause).toBeCalled();
        });
    });

    describe('updateProgress()', () => {
        test('should call progressCallback() properly', () => {
            const prevUploadedBytes = 10;
            const newUploadedBytes = 20;

            multiputUploadTest.totalUploadedBytes = 100;
            multiputUploadTest.progressCallback = jest.fn();

            multiputUploadTest.updateProgress(prevUploadedBytes, newUploadedBytes);
            expect(multiputUploadTest.progressCallback).toHaveBeenCalledWith({
                loaded: 110,
                total: file.size,
            });
        });
    });

    describe('shouldComputeDigestForNextPart()', () => {
        beforeEach(() => {
            multiputUploadTest.config.digestReadahead = 2;
        });

        // Test cases in order
        // ended is true
        // a part is already computing
        // all parts started
        // readahead is full
        // no part computing, there is a part not started and readahead not full
        test.each`
            expected | ended    | numPartsDigestComputing | numPartsNotStarted | numPartsDigestReady
            ${false} | ${true}  | ${undefined}            | ${undefined}       | ${undefined}
            ${false} | ${false} | ${1}                    | ${undefined}       | ${undefined}
            ${false} | ${false} | ${0}                    | ${0}               | ${undefined}
            ${false} | ${false} | ${0}                    | ${1}               | ${2}
            ${true}  | ${false} | ${0}                    | ${1}               | ${1}
        `(
            'should return correct value',
            ({ expected, ended, numPartsDigestComputing, numPartsNotStarted, numPartsDigestReady }) => {
                // Setup
                multiputUploadTest.ended = ended;
                multiputUploadTest.numPartsDigestComputing = numPartsDigestComputing;
                multiputUploadTest.numPartsNotStarted = numPartsNotStarted;
                multiputUploadTest.numPartsDigestReady = numPartsDigestReady;

                // Execute
                const result = multiputUploadTest.shouldComputeDigestForNextPart();
                // Verify
                expect(result).toBe(expected);
            },
        );
    });

    describe('computeDigestForNextPart()', () => {
        beforeEach(() => {
            multiputUploadTest.firstUnuploadedPartIndex = 0;
            multiputUploadTest.numPartsDigestComputing = 0;
            multiputUploadTest.parts = [
                new MultiputPart({}, 0, 0, 1024, 1, {
                    upload_part: 'www.box.com',
                }),
                new MultiputPart({}, 1, 1024, 1024, 1, {
                    upload_part: 'www.box.com',
                }),
                new MultiputPart({}, 2, 2048, 1024, 1, {
                    upload_part: 'www.box.com',
                }),
            ];
        });

        test('should process first not started part by calling computeDigestForPart', () => {
            multiputUploadTest.parts[0].state = PART_STATE_UPLOADED;
            multiputUploadTest.parts[1].state = PART_STATE_NOT_STARTED;
            multiputUploadTest.numPartsNotStarted = 1;
            multiputUploadTest.computeDigestForPart = jest.fn();

            // Execute
            multiputUploadTest.computeDigestForNextPart();

            // Verify
            expect(multiputUploadTest.numPartsNotStarted).toBe(0);
            expect(multiputUploadTest.numPartsDigestComputing).toBe(1);
            expect(multiputUploadTest.computeDigestForPart).toHaveBeenCalledWith(multiputUploadTest.parts[1]);
        });

        test('should process only one part', () => {
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
        test('should read, compute digest, then send part to worker', async () => {
            webcrypto.digest = jest.fn().mockReturnValueOnce(Promise.resolve());
            multiputUploadTest.sendPartToWorker = jest.fn();
            multiputUploadTest.readFile = jest.fn().mockReturnValueOnce({
                buffer: new ArrayBuffer(),
                readCompleteTimestamp: 123,
            });
            multiputUploadTest.processNextParts = jest.fn();

            await multiputUploadTest.computeDigestForPart({
                offset: 1,
                size: 2,
            });
            expect(multiputUploadTest.sendPartToWorker).toHaveBeenCalled();
            expect(multiputUploadTest.processNextParts).toHaveBeenCalled();
            expect(multiputUploadTest.readFile).toHaveBeenCalled();
        });
    });

    describe('processNextParts()', () => {
        beforeEach(() => {
            multiputUploadTest.parts = ['part1'];
            multiputUploadTest.commitSession = jest.fn();
        });

        test('should call failSessionIfFileChangeDetected and return when it returns true', () => {
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

        test('should call failSessionIfFileChangeDetected and return when it returns true, even when everything is ready for commit otherwise', () => {
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

        test('should try to upload parts and send them to worker otherwise', () => {
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

        test('should commit the session if all parts have been uploaded', () => {
            multiputUploadTest.failSessionIfFileChangeDetected = jest.fn().mockReturnValueOnce(false);
            multiputUploadTest.commitSession = jest.fn();
            multiputUploadTest.updateFirstUnuploadedPartIndex = jest.fn();
            multiputUploadTest.uploadNextPart = jest.fn();
            multiputUploadTest.numPartsUploaded = 1;
            multiputUploadTest.fileSha1 = 'abc';

            // Execute
            multiputUploadTest.processNextParts();
            expect(multiputUploadTest.failSessionIfFileChangeDetected).toHaveBeenCalled();
            expect(multiputUploadTest.commitSession).toHaveBeenCalled();
            expect(multiputUploadTest.updateFirstUnuploadedPartIndex).not.toHaveBeenCalled();
            expect(multiputUploadTest.uploadNextPart).not.toHaveBeenCalled();
        });
    });

    describe('commitSession()', () => {
        beforeEach(() => {
            multiputUploadTest.xhr.post = jest.fn().mockResolvedValue();
            multiputUploadTest.sessionEndpoints.commit =
                'https://upload.box.com/api/2.0/files/content?upload_session_id=123/commit';
        });

        test('should noop when isDestroyed', () => {
            multiputUploadTest.destroyed = true;

            multiputUploadTest.commitSession();

            expect(multiputUploadTest.xhr.post).not.toHaveBeenCalled();
        });

        test('should commit session with file sha1 included in header', () => {
            multiputUploadTest.parts = [];
            multiputUploadTest.fileSha1 = '123456789';
            const postData = {
                url: multiputUploadTest.sessionEndpoints.commit,
                data: { parts: [], attributes: {} },
                headers: {
                    Digest: `sha=${multiputUploadTest.fileSha1}`,
                    'X-Box-Client-Event-Info':
                        '{"avg_part_read_time":null,"avg_part_digest_time":null,"avg_file_digest_time":null,"avg_part_upload_time":null}',
                },
            };

            multiputUploadTest.commitSession();

            expect(multiputUploadTest.xhr.post).toHaveBeenCalledWith(postData);
        });
    });

    describe('onWorkerMessage()', () => {
        beforeEach(() => {
            multiputUploadTest.isDestroyed = jest.fn();
            multiputUploadTest.processNextParts = jest.fn();
            multiputUploadTest.sha1Worker = { terminate: jest.fn() };
            multiputUploadTest.sessionErrorHandler = jest.fn();
        });

        test('should return if destroyed', () => {
            multiputUploadTest.isDestroyed.mockReturnValueOnce(true);

            multiputUploadTest.onWorkerMessage();

            expect(multiputUploadTest.processNextParts).not.toHaveBeenCalled();
            expect(multiputUploadTest.sha1Worker.terminate).not.toHaveBeenCalled();
            expect(multiputUploadTest.sessionErrorHandler).not.toHaveBeenCalled();
        });

        test('should call sessionErrorHandler if event type is error', () => {
            multiputUploadTest.isDestroyed.mockReturnValueOnce(false);

            multiputUploadTest.onWorkerMessage({ data: { type: 'error' } });

            expect(multiputUploadTest.processNextParts).not.toHaveBeenCalled();
            expect(multiputUploadTest.sha1Worker.terminate).not.toHaveBeenCalled();
            expect(multiputUploadTest.sessionErrorHandler).toHaveBeenCalled();
        });

        test('should update the related variables after a part is done computing', () => {
            multiputUploadTest.isDestroyed.mockReturnValueOnce(false);
            multiputUploadTest.numPartsDigestComputing = 1;
            multiputUploadTest.parts = [{ timing: { fileDigestTime: 0 } }];

            multiputUploadTest.onWorkerMessage({ data: { type: 'partDone', duration: 10, part: { index: 0 } } });

            expect(multiputUploadTest.processNextParts).toHaveBeenCalled();
            expect(multiputUploadTest.sha1Worker.terminate).not.toHaveBeenCalled();
            expect(multiputUploadTest.sessionErrorHandler).not.toHaveBeenCalled();
            expect(multiputUploadTest.numPartsDigestComputing).toEqual(0);
            expect(multiputUploadTest.parts[0]).toEqual({ timing: { fileDigestTime: 10 } });
        });

        test('should terminate the sha1Worker if the event type is done', () => {
            multiputUploadTest.isDestroyed.mockReturnValueOnce(false);

            multiputUploadTest.onWorkerMessage({ data: { type: 'done', sha1: 'abc' } });

            expect(multiputUploadTest.processNextParts).toHaveBeenCalled();
            expect(multiputUploadTest.sha1Worker.terminate).toHaveBeenCalled();
            expect(multiputUploadTest.sessionErrorHandler).not.toHaveBeenCalled();
        });
    });
});
