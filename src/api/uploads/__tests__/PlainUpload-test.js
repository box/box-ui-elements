import PlainUpload from '../PlainUpload';

let upload;
let clock;
let file;

describe('api/uploads/PlainUpload', () => {
    beforeEach(() => {
        upload = new PlainUpload({
            token: '123'
        });
    });

    describe('uploadErrorHandler()', () => {
        beforeEach(() => {
            clock = jest.useFakeTimers();
            file = {
                name: 'foo'
            };
            upload.file = file;
        });

        afterEach(() => {
            jest.clearAllTimers();
        });

        test('should not do anything if API is destroyed', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(true);
            upload.makePreflightRequest = jest.fn();
            upload.uploadErrorHandler(new Error());
            expect(upload.makePreflightRequest).not.toHaveBeenCalled();
        });

        test('should overwrite file on 409 if overwrite property is true', () => {
            const fileId = '123';
            upload.overwrite = true;
            upload.makePreflightRequest = jest.fn();

            upload.uploadErrorHandler({
                status: 409,
                context_info: {
                    conflicts: {
                        id: fileId
                    }
                }
            });

            expect(upload.makePreflightRequest).toHaveBeenCalledWith({
                fileId,
                fileName: file.name
            });
        });

        test('should append timestamp and re-upload on 409 if overwrite property is false', () => {
            upload.file.name = 'foo.bar';
            upload.overwrite = false;
            Date.now = jest.fn().mockReturnValueOnce('1969-07-16');

            upload.makePreflightRequest = jest.fn();

            upload.uploadErrorHandler({
                status: 409
            });

            expect(upload.makePreflightRequest).toHaveBeenCalledWith({
                fileName: 'foo-1969-07-16.bar'
            });
        });

        test('should retry on 429 status after default retry interval', () => {
            const retryAfterMs = 3000;

            upload.makePreflightRequest = jest.fn();

            upload.uploadErrorHandler({
                status: 429
            });
            clock.runTimersToTime(retryAfterMs + 1);

            expect(upload.makePreflightRequest).toHaveBeenCalledWith({
                fileName: file.name
            });
        });

        test('should retry on too_many_requests code after default retry interval', () => {
            const retryAfterMs = 3000;

            upload.makePreflightRequest = jest.fn();

            upload.uploadErrorHandler({
                code: 'too_many_requests'
            });
            clock.runTimersToTime(retryAfterMs + 1);

            expect(upload.makePreflightRequest).toHaveBeenCalledWith({
                fileName: file.name
            });
        });

        test('should retry after interval defined in response header', () => {
            const retryAfterMs = 1000;

            upload.makePreflightRequest = jest.fn();
            const getMock = jest.fn().mockReturnValueOnce(`${retryAfterMs / 1000}`);

            upload.uploadErrorHandler({
                code: 'too_many_requests',
                headers: {
                    get: getMock
                }
            });
            clock.runTimersToTime(retryAfterMs + 1);

            expect(upload.makePreflightRequest).toHaveBeenCalledWith({
                fileName: file.name
            });

            expect(getMock).toHaveBeenCalledWith('Retry-After');
        });

        test('should call the error callback if error has a status that is not 409 or 429', () => {
            const error = new Error();
            error.status = 500;

            upload.errorCallback = jest.fn();
            upload.uploadErrorHandler(error, () => {});
            expect(upload.errorCallback).toHaveBeenCalledWith(error);
        });

        test('should call the error callback if error message is from CORS', () => {
            const error = new Error();
            error.message = 'Failed to fetch';

            upload.errorCallback = jest.fn();
            upload.uploadErrorHandler(error, () => {});
            expect(upload.errorCallback).toHaveBeenCalledWith(error);
        });

        test('should retry after default interval for other errors', () => {
            const retryAfterMs = 1000;
            const error = new Error('Some other error');
            upload.makePreflightRequest = jest.fn();

            upload.uploadErrorHandler(error);
            clock.runTimersToTime(retryAfterMs + 1);

            expect(upload.makePreflightRequest).toHaveBeenCalledWith({
                fileName: file.name
            });
        });

        test('should not retry before exponential backoff interval for other errors', () => {
            const MS_IN_S = 1000;
            const retryCount = 3;
            const error = new Error('Some other error');
            upload.makePreflightRequest = jest.fn();
            upload.retryCount = retryCount;

            upload.uploadErrorHandler(error);
            clock.runTimersToTime(2 ** retryCount * MS_IN_S - 1);

            expect(upload.retryCount).toBe(retryCount + 1);

            expect(upload.makePreflightRequest).not.toHaveBeenCalled();
        });
    });

    describe('uploadSuccessHandler()', () => {
        test('should not do anything if API is destroyed', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(true);
            upload.successCallback = jest.fn();
            upload.uploadSuccessHandler({
                entries: {}
            });
            expect(upload.successCallback).not.toHaveBeenCalled();
        });

        test('should call success callback with returned entries', () => {
            const entries = [{}, {}];

            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.successCallback = jest.fn();

            upload.uploadSuccessHandler({
                entries
            });
            expect(upload.successCallback).toHaveBeenCalledWith(entries);
        });
    });

    describe('uploadProgressHandler', () => {
        test('should not do anything if API is destroyed', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(true);
            upload.progressCallback = jest.fn();
            upload.uploadProgressHandler(new ProgressEvent('null'));
            expect(upload.progressCallback).not.toHaveBeenCalled();
        });

        test('should call progress callback with progress event', () => {
            const event = new ProgressEvent('null');

            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.progressCallback = jest.fn();

            upload.uploadProgressHandler(event);
            expect(upload.progressCallback).toHaveBeenCalledWith(event);
        });
    });

    describe('makePreflightRequest()', () => {
        test('should not do anything if API is destroyed', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(true);
            upload.getBaseUploadUrl = jest.fn();
            upload.xhr = {
                options: jest.fn()
            };
            upload.makePreflightRequest({
                fileId: '123',
                fileName: 'cayde'
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
                name: 'zavala'
            };
            upload.folderId = '123';

            upload.xhr = {
                options: jest.fn()
            };

            upload.makePreflightRequest({});
            expect(upload.xhr.options).toHaveBeenCalledWith({
                url: `${baseUrl}/files/content`,
                data: {
                    name: upload.file.name,
                    parent: {
                        id: upload.folderId
                    },
                    size: upload.file.size
                },
                successHandler: expect.any(Function),
                errorHandler: expect.any(Function)
            });
        });

        test('should make preflight request to upload file version url if fileId is given', () => {
            const baseUrl = 'base';
            const fileId = '234';

            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.getBaseApiUrl = jest.fn().mockReturnValueOnce(baseUrl);
            upload.file = {
                size: 1,
                name: 'zavala'
            };
            upload.folderId = '123';

            upload.xhr = {
                options: jest.fn()
            };

            upload.makePreflightRequest({
                fileId
            });
            expect(upload.xhr.options).toHaveBeenCalledWith({
                url: `${baseUrl}/files/${fileId}/content`,
                data: expect.any(Object),
                successHandler: expect.any(Function),
                errorHandler: expect.any(Function)
            });
        });
    });

    describe('makeRequest', () => {
        test('should not do anything if API is destroyed', async () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(true);
            upload.xhr = {
                uploadFile: jest.fn()
            };
            await upload.makeRequest({
                fileId: '123',
                fileName: 'hunter'
            });
            expect(upload.xhr.uploadFile).not.toHaveBeenCalled();
        });

        test('should generate upload URL and make request if no URL is provided', async () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);

            upload.file = {
                name: 'warlock'
            };
            upload.folderId = '123';
            upload.xhr = {
                uploadFile: jest.fn()
            };

            upload.makeRequest({ data: {} });
            expect(upload.xhr.uploadFile).toHaveBeenCalledWith({
                url: `${upload.uploadHost}/api/2.0/files/content`,
                data: {
                    attributes: expect.any(String),
                    file: upload.file
                },
                successHandler: expect.any(Function),
                errorHandler: expect.any(Function),
                progressHandler: expect.any(Function)
            });
        });

        test('should upload to new file version if file ID is provided', async () => {
            const fileId = '123';

            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.file = {
                name: 'warlock'
            };
            upload.fileId = fileId;
            upload.folderId = '123';
            upload.xhr = {
                uploadFile: jest.fn()
            };

            upload.makeRequest({ data: {} });
            expect(upload.xhr.uploadFile).toHaveBeenCalledWith({
                url: `${upload.uploadHost}/api/2.0/files/${fileId}/content`,
                data: expect.any(Object),
                successHandler: expect.any(Function),
                errorHandler: expect.any(Function),
                progressHandler: expect.any(Function)
            });
        });
    });

    describe('upload()', () => {
        test('should not do anything if API is destroyed', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(true);
            upload.makePreflightRequest = jest.fn();
            upload.upload({});
            expect(upload.makePreflightRequest).not.toHaveBeenCalled();
        });

        test('should set properties and make preflight request', () => {
            const folderId = '123';
            file = {};
            const successCallback = () => {};
            const errorCallback = () => {};
            const progressCallback = () => {};
            const overwrite = true;

            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.makePreflightRequest = jest.fn();
            upload.upload({
                folderId,
                file,
                successCallback,
                errorCallback,
                progressCallback,
                overwrite
            });

            expect(upload.folderId).toBe(folderId);
            expect(upload.file).toBe(file);
            expect(upload.successCallback).toBe(successCallback);
            expect(upload.errorCallback).toBe(errorCallback);
            expect(upload.progressCallback).toBe(progressCallback);
            expect(upload.overwrite).toBe(overwrite);
        });
    });

    describe('cancel()', () => {
        test('should not do anything if API is destroyed', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(true);
            upload.xhr = {
                abort: jest.fn()
            };
            upload.cancel();
            expect(upload.xhr.abort).not.toHaveBeenCalled();
        });

        test('should abort xhr', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.xhr = {
                abort: jest.fn()
            };
            upload.cancel();
            expect(upload.xhr.abort).toHaveBeenCalled();
        });
    });
});
