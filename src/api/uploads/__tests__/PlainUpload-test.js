import PlainUpload from '../PlainUpload';

let upload;
let file;

describe('api/uploads/PlainUpload', () => {
    beforeEach(() => {
        upload = new PlainUpload({
            token: '123'
        });
    });

    describe('uploadSuccessHandler()', () => {
        test('should not do anything if API is destroyed', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(true);
            upload.successCallback = jest.fn();
            upload.uploadSuccessHandler({
                data: { entries: {} }
            });
            expect(upload.successCallback).not.toHaveBeenCalled();
        });

        test('should call success callback with returned entries', () => {
            const entries = [{}, {}];

            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.successCallback = jest.fn();

            upload.uploadSuccessHandler({
                data: { entries }
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

            upload.fileId = '234';
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

            upload.makePreflightRequest();
            expect(upload.xhr.options).toHaveBeenCalledWith({
                url: `${baseUrl}/files/${upload.fileId}/content`,
                data: expect.any(Object),
                successHandler: expect.any(Function),
                errorHandler: expect.any(Function)
            });
        });
    });

    describe('preflightSuccessHandler', () => {
        test('should not do anything if API is destroyed', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(true);
            upload.xhr = {
                uploadFile: jest.fn()
            };
            upload.preflightSuccessHandler({ data: {} });
            expect(upload.xhr.uploadFile).not.toHaveBeenCalled();
        });

        test('should generate upload URL and make request if no URL is provided', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);

            upload.file = {
                name: 'warlock'
            };
            upload.folderId = '123';
            upload.xhr = {
                uploadFile: jest.fn()
            };

            upload.preflightSuccessHandler({ data: {} });
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

        test('should upload to new file version if file ID is provided', () => {
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

            upload.preflightSuccessHandler({ data: {} });
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
