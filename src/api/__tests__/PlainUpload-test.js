import PlainUpload from '../PlainUpload';

let upload;

describe('api/PlainUpload', () => {
    beforeEach(() => {
        upload = new PlainUpload({
            token: '123'
        });
        upload.updateReachableUploadHost = () => Promise.resolve();
    });

    describe('uploadPreflightSuccessHandler()', () => {
        test('should not do anything if API is destroyed', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(true);
            upload.makeRequest = jest.fn();
            upload
                .uploadPreflightSuccessHandler({
                    upload_url: 'test'
                })
                .then(() => {
                    expect(upload.makeRequest).not.toHaveBeenCalled();
                });
        });

        test('should make an upload request with the returned url', () => {
            const uploadUrl = 'someUrl';

            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.makeRequest = jest.fn();

            upload
                .uploadPreflightSuccessHandler({
                    upload_url: uploadUrl
                })
                .then(() => {
                    expect(upload.makeRequest).toHaveBeenCalledWith({
                        url: uploadUrl
                    });
                });
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

    describe('uploadErrorHandler', () => {
        test('should not do anything if API is destroyed', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(true);
            upload.baseUploadErrorHandler = jest.fn();
            upload.uploadErrorHandler(new Error());
            expect(upload.baseUploadErrorHandler).not.toHaveBeenCalled();
        });

        test('should call base upload error handler with error', () => {
            const error = new Error();

            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.baseUploadErrorHandler = jest.fn();

            upload.uploadErrorHandler(error);
            expect(upload.baseUploadErrorHandler).toHaveBeenCalledWith(error, expect.any(Function));
        });
    });

    describe('makePreflightRequest()', () => {
        test('should not do anything if API is destroyed', () => {
            upload.isDestroyed = jest.fn().mockReturnValueOnce(true);
            upload.getBaseUrl = jest.fn();
            upload.xhr = {
                options: jest.fn()
            };
            upload.makePreflightRequest({
                fileId: '123',
                fileName: 'cayde'
            });
            expect(upload.getBaseUrl).not.toHaveBeenCalled();
            expect(upload.xhr.options).not.toHaveBeenCalled();
        });

        test('should make preflight request with current file attributes', () => {
            const baseUrl = 'base';

            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.getBaseUrl = jest.fn().mockReturnValueOnce(baseUrl);
            upload.file = {
                size: 1,
                name: 'zavala'
            };
            upload.id = '123';

            upload.xhr = {
                options: jest.fn()
            };

            upload.makePreflightRequest({});
            expect(upload.xhr.options).toHaveBeenCalledWith({
                url: `${baseUrl}/files/content`,
                data: {
                    name: upload.file.name,
                    parent: {
                        id: upload.id
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
            upload.getBaseUrl = jest.fn().mockReturnValueOnce(baseUrl);
            upload.file = {
                size: 1,
                name: 'zavala'
            };
            upload.id = '123';

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
            upload.id = '123';
            upload.xhr = {
                uploadFile: jest.fn()
            };

            await upload.makeRequest({});
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
            upload.id = '123';
            upload.xhr = {
                uploadFile: jest.fn()
            };

            await upload.makeRequest({
                fileId
            });
            expect(upload.xhr.uploadFile).toHaveBeenCalledWith({
                url: `${upload.uploadHost}/api/2.0/files/${fileId}/content`,
                data: expect.any(Object),
                successHandler: expect.any(Function),
                errorHandler: expect.any(Function),
                progressHandler: expect.any(Function)
            });
        });

        test('should stringify name and parent for upload data', async () => {
            const name = 'titan';
            const parentId = '123';
            JSON.stringify = jest.fn();

            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.id = parentId;
            upload.xhr = {
                uploadFile: jest.fn()
            };

            await upload.makeRequest({
                fileName: name
            });
            expect(JSON.stringify).toHaveBeenCalledWith({
                name,
                parent: {
                    id: parentId
                }
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
            const id = '123';
            const file = {};
            const successCallback = () => {};
            const errorCallback = () => {};
            const progressCallback = () => {};
            const overwrite = true;

            upload.isDestroyed = jest.fn().mockReturnValueOnce(false);
            upload.makePreflightRequest = jest.fn();
            upload.upload({
                id,
                file,
                successCallback,
                errorCallback,
                progressCallback,
                overwrite
            });

            expect(upload.id).toBe(id);
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
