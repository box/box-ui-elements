import BaseUpload from '../BaseUpload';

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
            upload.xhr = {
                options: jest.fn(),
            };

            upload.makePreflightRequest();
            expect(upload.xhr.options).toHaveBeenCalledWith({
                url: `${baseUrl}/files/content`,
                data: {
                    name: upload.file.name,
                    parent: {
                        id: upload.folderId,
                    },
                    size: upload.file.size,
                },
                successHandler: upload.preflightSuccessHandler,
                errorHandler: upload.preflightErrorHandler,
            });
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

            upload.makePreflightRequest();
            expect(upload.xhr.options).toHaveBeenCalledWith({
                url: `${baseUrl}/files/${upload.fileId}/content`,
                data: expect.any(Object),
                successHandler: upload.preflightSuccessHandler,
                errorHandler: upload.preflightErrorHandler,
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

        test('should append timestamp and re-upload on 409 if overwrite property is false', () => {
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
            clock.runTimersToTime(retryAfterMs + 1);

            expect(upload.makePreflightRequest).toHaveBeenCalled();
        });

        test('should retry on too_many_requests code after default retry interval', () => {
            const retryAfterMs = 3000;

            upload.makePreflightRequest = jest.fn();

            upload.preflightErrorHandler({
                code: 'too_many_requests',
            });
            clock.runTimersToTime(retryAfterMs + 1);

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
            clock.runTimersToTime(retryAfterMs + 1);

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
            clock.runTimersToTime(retryAfterMs + 1);

            expect(upload.makePreflightRequest).toHaveBeenCalled();
        });

        test('should not retry before exponential backoff interval for other errors', () => {
            const MS_IN_S = 1000;
            const retryCount = 3;
            const error = new Error('Some other error');
            upload.makePreflightRequest = jest.fn();
            upload.retryCount = retryCount;

            upload.preflightErrorHandler(error);
            clock.runTimersToTime(2 ** retryCount * MS_IN_S - 1);

            expect(upload.retryCount).toBe(retryCount + 1);

            expect(upload.makePreflightRequest).not.toHaveBeenCalled();
        });
    });
});
