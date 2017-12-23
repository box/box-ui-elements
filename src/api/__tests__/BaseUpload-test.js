import BaseUpload from '../BaseUpload';

let upload;
let clock;
let file;

describe('api/BaseUpload', () => {
    beforeEach(() => {
        upload = new BaseUpload({});
        clock = jest.useFakeTimers();
        file = {
            name: 'foo'
        };
        upload.file = file;
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    describe('baseUploadErrorHandler()', () => {
        test('should overwrite file on 409 if overwrite property is true', () => {
            const fileId = '123';
            upload.overwrite = true;

            const retryUploadFunc = jest.fn();

            upload.baseUploadErrorHandler(
                {
                    status: 409,
                    context_info: {
                        conflicts: {
                            id: fileId
                        }
                    }
                },
                retryUploadFunc
            );

            expect(retryUploadFunc).toHaveBeenCalledWith({
                fileId,
                fileName: file.name
            });
        });

        test('should append timestamp and re-upload on 409 if overwrite property is false', () => {
            upload.file.name = 'foo.bar';
            upload.overwrite = false;
            Date.now = jest.fn().mockReturnValueOnce('1969-07-16');

            const retryUploadFunc = jest.fn();

            upload.baseUploadErrorHandler(
                {
                    status: 409
                },
                retryUploadFunc
            );

            expect(retryUploadFunc).toHaveBeenCalledWith({
                fileName: 'foo-1969-07-16.bar'
            });
        });

        test('should retry on 429 status after default retry interval', () => {
            const retryAfterMs = 3000;

            const retryUploadFunc = jest.fn();

            upload.baseUploadErrorHandler(
                {
                    status: 429
                },
                retryUploadFunc
            );
            clock.runTimersToTime(retryAfterMs + 1);

            expect(retryUploadFunc).toHaveBeenCalledWith({
                fileName: file.name
            });
        });

        test('should retry on too_many_requests code after default retry interval', () => {
            const retryAfterMs = 3000;

            const retryUploadFunc = jest.fn();

            upload.baseUploadErrorHandler(
                {
                    code: 'too_many_requests'
                },
                retryUploadFunc
            );
            clock.runTimersToTime(retryAfterMs + 1);

            expect(retryUploadFunc).toHaveBeenCalledWith({
                fileName: file.name
            });
        });

        test('should retry after interval defined in response header', () => {
            const retryAfterMs = 1000;

            const retryUploadFunc = jest.fn();
            const getMock = jest.fn().mockReturnValueOnce(`${retryAfterMs / 1000}`);

            upload.baseUploadErrorHandler(
                {
                    code: 'too_many_requests',
                    headers: {
                        get: getMock
                    }
                },
                retryUploadFunc
            );
            clock.runTimersToTime(retryAfterMs + 1);

            expect(retryUploadFunc).toHaveBeenCalledWith({
                fileName: file.name
            });

            expect(getMock).toHaveBeenCalledWith('Retry-After');
        });

        test('should call the error callback if error has a status that is not 409 or 429', () => {
            const error = new Error();
            error.status = 500;

            upload.errorCallback = jest.fn();
            upload.baseUploadErrorHandler(error, () => {});
            expect(upload.errorCallback).toHaveBeenCalledWith(error);
        });

        test('should call the error callback if error message is from CORS', () => {
            const error = new Error();
            error.message = 'Failed to fetch';

            upload.errorCallback = jest.fn();
            upload.baseUploadErrorHandler(error, () => {});
            expect(upload.errorCallback).toHaveBeenCalledWith(error);
        });

        test('should retry after default interval for other errors', () => {
            const retryAfterMs = 1000;
            const error = new Error('Some other error');
            const retryUploadFunc = jest.fn();

            upload.baseUploadErrorHandler(error, retryUploadFunc);
            clock.runTimersToTime(retryAfterMs + 1);

            expect(retryUploadFunc).toHaveBeenCalledWith({
                fileName: file.name
            });
        });

        test('should not retry before exponential backoff interval for other errors', () => {
            const MS_IN_S = 1000;
            const retryCount = 3;
            const error = new Error('Some other error');
            const retryUploadFunc = jest.fn();
            upload.retryCount = retryCount;

            upload.baseUploadErrorHandler(error, retryUploadFunc);
            clock.runTimersToTime(2 ** retryCount * MS_IN_S - 1);

            expect(upload.retryCount).toBe(retryCount + 1);

            expect(retryUploadFunc).not.toHaveBeenCalled();
        });
    });
});
