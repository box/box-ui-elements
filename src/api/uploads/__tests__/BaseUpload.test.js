import BaseUpload from '../BaseUpload';
import { DEFAULT_HOSTNAME_UPLOAD, DEFAULT_HOSTNAME_UPLOAD_APP, DEFAULT_HOSTNAME_UPLOAD_GOV } from '../../../constants';

let upload;
let clock;
let file;

describe('api/uploads/BaseUpload', () => {
    beforeEach(() => {
        upload = new BaseUpload({
            token: '123',
        });
    });

    describe('makePreflightRequest()', () => {
        test('should not do anything if API is destroyed', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(true);
            upload.getBaseUploadUrl = jest.fn();
            upload.xhr = {
                options: jest.fn(),
            };
            upload.makePreflightRequest({
                fileId: '123',
                fileName: 'cayde',
            });
            expect(upload.getBaseUploadUrl).not.toHaveBeenCalled();
            expect(upload.xhr.options).not.toHaveBeenCalled();
        });

        test('should make preflight request with current file attributes', () => {
            const baseUrl = 'base';

            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.getBaseApiUrl = jest.fn().mockReturnValueOnce(baseUrl);
            upload.file = {
                size: 1,
                name: 'zavala',
            };
            upload.folderId = '123';
            upload.fileDescription = 'ronaldo';
            upload.xhr = {
                options: jest.fn(),
            };
            upload.isUploadFallbackLogicEnabled = jest.fn().mockReturnValueOnce(false);
            upload.preflightSuccessReachabilityHandler = jest.fn();

            upload.makePreflightRequest();
            expect(upload.xhr.options).toHaveBeenCalledWith({
                url: `${baseUrl}/files/content`,
                data: {
                    name: upload.file.name,
                    parent: {
                        id: upload.folderId,
                    },
                    size: upload.file.size,
                    description: upload.fileDescription,
                },
                successHandler: expect.any(Function),
                errorHandler: upload.preflightErrorHandler,
            });
            expect(upload.preflightSuccessReachabilityHandler).not.toHaveBeenCalled();
        });

        test('should make preflight request to upload file version url if fileId is given', () => {
            const baseUrl = 'base';

            upload.fileId = '234';
            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.getBaseApiUrl = jest.fn().mockReturnValueOnce(baseUrl);
            upload.file = {
                size: 1,
                name: 'zavala',
            };
            upload.folderId = '123';
            upload.xhr = {
                options: jest.fn(),
            };
            upload.isUploadFallbackLogicEnabled = jest.fn().mockReturnValueOnce(false);
            upload.preflightSuccessReachabilityHandler = jest.fn();

            upload.makePreflightRequest();
            expect(upload.xhr.options).toHaveBeenCalledWith({
                url: `${baseUrl}/files/${upload.fileId}/content`,
                data: expect.any(Object),
                successHandler: expect.any(Function),
                errorHandler: upload.preflightErrorHandler,
            });
            expect(upload.preflightSuccessReachabilityHandler).not.toHaveBeenCalled();
        });

        test(`should make a preflight request with unreachable_hosts query parameter when there are unreachable upload hosts`, () => {
            const baseUrl = 'base';

            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.getBaseApiUrl = jest.fn().mockReturnValueOnce(baseUrl);
            upload.file = {
                size: 1,
                name: 'zavala',
            };
            upload.folderId = '123';
            upload.fileDescription = 'ronaldo';
            upload.xhr = {
                options: jest.fn(),
            };
            upload.isUploadFallbackLogicEnabled = jest.fn().mockReturnValueOnce(true);
            upload.uploadsReachability = {
                getUnreachableHostsUrls: jest.fn().mockReturnValueOnce(['https://test-upload.box.com/']),
            };
            upload.preflightSuccessHandler = jest.fn();

            upload.makePreflightRequest();
            expect(upload.xhr.options).toHaveBeenCalledWith({
                url: `${baseUrl}/files/content?unreachable_hosts=https://test-upload.box.com/`,
                data: {
                    name: upload.file.name,
                    parent: {
                        id: upload.folderId,
                    },
                    size: upload.file.size,
                    description: upload.fileDescription,
                },
                successHandler: expect.any(Function),
                errorHandler: upload.preflightErrorHandler,
            });
            expect(upload.preflightSuccessHandler).not.toHaveBeenCalled();
        });
    });

    describe('preflightSuccessReachabilityHandler()', () => {
        beforeEach(() => {
            upload.isUploadFallbackLogicEnabled = jest.fn().mockReturnValueOnce(true);
            upload.makePreflightRequest = jest.fn();
            upload.preflightSuccessHandler = jest.fn();
        });

        test('should not do anything if API is destroyed', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(true);

            upload.preflightSuccessReachabilityHandler({ data: {} });

            expect(upload.makePreflightRequest).not.toHaveBeenCalled();
        });

        test('should call preflightSuccesshandler if no uploadUrl is provided', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.uploadsReachability = {
                isReachable: jest.fn(),
            };

            upload.preflightSuccessReachabilityHandler({ data: {} });

            expect(upload.preflightSuccessHandler).toHaveBeenCalledWith({ data: {} });
            expect(upload.uploadsReachability.isReachable).not.toHaveBeenCalled();
        });

        test('should call preflightSuccessHandler, without doing a reachability test if DEFAULT_HOSTNAME_UPLOAD is provided as uploadUrl', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.uploadsReachability = {
                isReachable: jest.fn(),
            };

            const preflightResponse = {
                data: {
                    upload_url: `${DEFAULT_HOSTNAME_UPLOAD}/api/2.0/files/1234/content?upload_session_id=123&protected_params=123`,
                    upload_token: null,
                    download_url: null,
                },
            };

            upload.preflightSuccessReachabilityHandler(preflightResponse);

            expect(upload.preflightSuccessHandler).toHaveBeenCalledWith(preflightResponse);
            expect(upload.uploadsReachability.isReachable).not.toHaveBeenCalled();
        });

        test('should call preflightSuccessHandler, without doing a reachability test if DEFAULT_HOSTNAME_UPLOAD_APP is provided as uploadUrl', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.uploadsReachability = {
                isReachable: jest.fn(),
            };

            const preflightResponse = {
                data: {
                    upload_url: `${DEFAULT_HOSTNAME_UPLOAD_APP}/api/2.0/files/1234/content?upload_session_id=123&protected_params=123`,
                    upload_token: null,
                    download_url: null,
                },
            };

            upload.preflightSuccessReachabilityHandler(preflightResponse);

            expect(upload.preflightSuccessHandler).toHaveBeenCalledWith(preflightResponse);
            expect(upload.uploadsReachability.isReachable).not.toHaveBeenCalled();
        });

        test('should call preflightSuccessHandler, without doing a reachability test if DEFAULT_HOSTNAME_UPLOAD_GOV is provided as uploadUrl', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.uploadsReachability = {
                isReachable: jest.fn(),
            };

            const preflightResponse = {
                data: {
                    upload_url: `${DEFAULT_HOSTNAME_UPLOAD_GOV}/api/2.0/files/1234/content?upload_session_id=123&protected_params=123`,
                    upload_token: null,
                    download_url: null,
                },
            };

            upload.preflightSuccessReachabilityHandler(preflightResponse);

            expect(upload.preflightSuccessHandler).toHaveBeenCalledWith(preflightResponse);
            expect(upload.uploadsReachability.isReachable).not.toHaveBeenCalled();
        });

        test('should check for reachability if upload host is not DEFAULT_HOSTNAME_UPLOAD and host is reachable', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.uploadsReachability = {
                isReachable: jest.fn().mockReturnValueOnce(Promise.resolve(true)),
            };

            const preflightResponse = {
                data: {
                    upload_url: `https://test-upload.box.com/api/2.0/files/1234/content?upload_session_id=123&protected_params=123`,
                    upload_token: null,
                    download_url: null,
                },
            };

            return upload.preflightSuccessReachabilityHandler(preflightResponse).then(() => {
                expect(upload.uploadsReachability.isReachable).toHaveBeenCalled();
                expect(upload.preflightSuccessHandler).toHaveBeenCalledWith(preflightResponse);
            });
        });

        test('should check for reachability if upload host is not DEFAULT_HOSTNAME_UPLOAD and host is not reachable', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.uploadsReachability = {
                isReachable: jest.fn().mockReturnValueOnce(Promise.resolve(false)),
            };

            const preflightResponse = {
                data: {
                    upload_url: `https://test-upload.box.com/api/2.0/files/1234/content?upload_session_id=123&protected_params=123`,
                    upload_token: null,
                    download_url: null,
                },
            };

            return upload.preflightSuccessReachabilityHandler(preflightResponse).then(() => {
                expect(upload.uploadsReachability.isReachable).toHaveBeenCalled();
                expect(upload.makePreflightRequest).toHaveBeenCalled();
            });
        });

        test('should not retry preflight check if reachabilityRetry count is greater then or equal to MAX_REACHABILITY_RETRY', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.uploadsReachability = {
                isReachable: jest.fn().mockReturnValueOnce(Promise.resolve(false)),
            };
            upload.reachabilityRetryCount = 10;

            const preflightResponse = {
                data: {
                    upload_url: `https://test-upload.box.com/api/2.0/files/1234/content?upload_session_id=123&protected_params=123`,
                    upload_token: null,
                    download_url: null,
                },
            };

            return upload.preflightSuccessReachabilityHandler(preflightResponse).then(() => {
                expect(upload.uploadsReachability.isReachable).toHaveBeenCalled();
                expect(upload.preflightSuccessHandler).toHaveBeenCalled();
                expect(upload.makePreflightRequest).not.toHaveBeenCalled();
            });
        });
    });

    describe('preflightErrorHandler()', () => {
        beforeEach(() => {
            clock = jest.useFakeTimers();
            file = {
                name: 'foo',
            };
            upload.file = file;
        });

        afterEach(() => {
            jest.clearAllTimers();
        });

        test('should not do anything if API is destroyed', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(true);
            upload.makePreflightRequest = jest.fn();
            upload.preflightErrorHandler(new Error());
            expect(upload.makePreflightRequest).not.toHaveBeenCalled();
        });

        test('should call error callback on file on 409 if overwrite property is "error"', () => {
            const error = new Error();
            error.status = 409;
            
            upload.fileId = '123';
            upload.overwrite = 'error';
            upload.makePreflightRequest = jest.fn();
            upload.errorCallback = jest.fn();

            upload.preflightErrorHandler(error, () => {});

            expect(upload.errorCallback).toHaveBeenCalledWith(error);
        });

        test('should overwrite file on 409 if overwrite property is true', () => {
            upload.fileId = '123';
            upload.overwrite = true;
            upload.makePreflightRequest = jest.fn();

            upload.preflightErrorHandler({
                status: 409,
                context_info: {
                    conflicts: {
                        id: upload.fileId,
                    },
                },
            });

            expect(upload.makePreflightRequest).toHaveBeenCalled();
        });

        test('should call callback on file on 409 if overwrite property is false and conflictCallback exists', () => {
            upload.fileId = '123';
            upload.overwrite = false;
            upload.makePreflightRequest = jest.fn();
            upload.conflictCallback = jest.fn().mockImplementation(name => `${name}_CONFLICT`);

            upload.preflightErrorHandler({
                status: 409,
                context_info: {
                    conflicts: {
                        id: upload.fileId,
                    },
                },
            });

            expect(upload.makePreflightRequest).toHaveBeenCalled();
            expect(upload.conflictCallback).toHaveBeenCalled();
            expect(upload.fileName).toEqual('foo_CONFLICT');
        });

        test('should append timestamp and re-upload on 409 if overwrite property is false and no conflictCallback', () => {
            upload.file.name = 'foo.bar';
            upload.overwrite = false;
            Date.now = jest.fn().mockReturnValueOnce('1969-07-16');

            upload.makePreflightRequest = jest.fn();

            upload.preflightErrorHandler({
                status: 409,
            });

            expect(upload.fileName).toEqual('foo-1969-07-16.bar');
            expect(upload.makePreflightRequest).toHaveBeenCalled();
        });

        test('should retry on 429 status after default retry interval', () => {
            const retryAfterMs = 3000;

            upload.makePreflightRequest = jest.fn();
            upload.preflightErrorHandler({
                status: 429,
            });
            clock.advanceTimersByTime(retryAfterMs + 1);

            expect(upload.makePreflightRequest).toHaveBeenCalled();
        });

        test('should retry on too_many_requests code after default retry interval', () => {
            const retryAfterMs = 3000;

            upload.makePreflightRequest = jest.fn();

            upload.preflightErrorHandler({
                code: 'too_many_requests',
            });
            clock.advanceTimersByTime(retryAfterMs + 1);

            expect(upload.makePreflightRequest).toHaveBeenCalled();
        });

        test('should retry after interval defined in response header', () => {
            const retryAfterMs = 1000;

            upload.makePreflightRequest = jest.fn();
            const getMock = jest.fn().mockReturnValueOnce(`${retryAfterMs / 1000}`);

            upload.preflightErrorHandler({
                code: 'too_many_requests',
                headers: {
                    get: getMock,
                },
            });
            clock.advanceTimersByTime(retryAfterMs + 1);

            expect(upload.makePreflightRequest).toHaveBeenCalled();
            expect(getMock).toHaveBeenCalledWith('Retry-After');
        });

        test('should call the error callback if error has a status that is not 409 or 429', () => {
            const error = new Error();
            error.status = 500;

            upload.errorCallback = jest.fn();
            upload.preflightErrorHandler(error, () => {});
            expect(upload.errorCallback).toHaveBeenCalledWith(error);
        });

        test('should call the error callback if error message is from CORS', () => {
            const error = new Error();
            error.message = 'Failed to fetch';

            upload.errorCallback = jest.fn();
            upload.preflightErrorHandler(error, () => {});
            expect(upload.errorCallback).toHaveBeenCalledWith(error);
        });

        test('should retry after default interval for other errors', () => {
            const retryAfterMs = 1000;
            const error = new Error('Some other error');
            upload.makePreflightRequest = jest.fn();

            upload.preflightErrorHandler(error);
            clock.advanceTimersByTime(retryAfterMs + 1);

            expect(upload.makePreflightRequest).toHaveBeenCalled();
        });

        test('should not retry before exponential backoff interval for other errors', () => {
            const MS_IN_S = 1000;
            const retryCount = 3;
            const error = new Error('Some other error');
            upload.makePreflightRequest = jest.fn();
            upload.retryCount = retryCount;

            upload.preflightErrorHandler(error);
            clock.advanceTimersByTime(2 ** retryCount * MS_IN_S - 1);

            expect(upload.retryCount).toBe(retryCount + 1);

            expect(upload.makePreflightRequest).not.toHaveBeenCalled();
        });
    });
});
