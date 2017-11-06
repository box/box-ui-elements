/* eslint-disable no-unused-expressions */
import PlainUpload from '../PlainUpload';

let upload;
const sandbox = sinon.sandbox.create();

describe('api/PlainUpload', () => {
    beforeEach(() => {
        upload = new PlainUpload();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('uploadPreflightSuccessHandler()', () => {
        it('should not do anything if API is destroyed', () => {
            upload.isDestroyed = sandbox.mock().returns(true);
            upload.makeRequest = sandbox.mock().never();
            upload.uploadPreflightSuccessHandler({
                upload_url: 'test'
            });
        });

        it('should make an upload request with the returned url', () => {
            const uploadUrl = 'someUrl';

            upload.isDestroyed = sandbox.mock().returns(false);
            upload.makeRequest = sandbox.mock().withArgs({
                url: uploadUrl
            });

            upload.uploadPreflightSuccessHandler({
                upload_url: uploadUrl
            });
        });
    });

    describe('uploadSuccessHandler()', () => {
        it('should not do anything if API is destroyed', () => {
            upload.isDestroyed = sandbox.mock().returns(true);
            upload.successCallback = sandbox.mock().never();
            upload.uploadSuccessHandler({
                entries: {}
            });
        });

        it('should call success callback with returned entries', () => {
            const entries = [{}, {}];

            upload.isDestroyed = sandbox.mock().returns(false);
            upload.successCallback = sandbox.mock().withArgs(entries);

            upload.uploadSuccessHandler({ entries });
        });
    });

    describe('uploadProgressHandler', () => {
        it('should not do anything if API is destroyed', () => {
            upload.isDestroyed = sandbox.mock().returns(true);
            upload.progressCallback = sandbox.mock().never();
            upload.uploadProgressHandler(new ProgressEvent());
        });

        it('should call progress callback with progress event', () => {
            const event = new ProgressEvent();

            upload.isDestroyed = sandbox.mock().returns(false);
            upload.progressCallback = sandbox.mock().withArgs(event);

            upload.uploadProgressHandler(event);
        });
    });

    describe('uploadErrorHandler', () => {
        it('should not do anything if API is destroyed', () => {
            upload.isDestroyed = sandbox.mock().returns(true);
            upload.baseUploadErrorHandler = sandbox.mock().never();
            upload.uploadErrorHandler(new Error());
        });

        it('should call base upload error handler with error', () => {
            const error = new Error();

            upload.isDestroyed = sandbox.mock().returns(false);
            upload.baseUploadErrorHandler = sandbox.mock().withArgs(error);

            upload.uploadErrorHandler(error);
        });
    });

    describe('makePreflightRequest()', () => {
        it('should not do anything if API is destroyed', () => {
            upload.isDestroyed = sandbox.mock().returns(true);
            upload.getBaseUrl = sandbox.mock().never();
            upload.xhr = {
                options: sandbox.mock().never()
            };
            upload.makePreflightRequest({
                fileId: '123',
                fileName: 'cayde'
            });
        });

        it('should make preflight request with current file attributes', () => {
            const baseUrl = 'base';

            upload.isDestroyed = sandbox.mock().returns(false);
            upload.getBaseUrl = sandbox.mock().returns(baseUrl);
            upload.file = {
                size: 1,
                name: 'zavala'
            };
            upload.id = '123';

            upload.xhr = {
                options: sandbox.mock().withArgs({
                    url: `${baseUrl}/files/content`,
                    data: {
                        name: upload.file.name,
                        parent: {
                            id: upload.id
                        },
                        size: upload.file.size
                    },
                    successHandler: sinon.match.func,
                    errorHandler: sinon.match.func
                })
            };

            upload.makePreflightRequest({});
        });

        it('should make preflight request to upload file version url if fileId is given', () => {
            const baseUrl = 'base';
            const fileId = '234';

            upload.isDestroyed = sandbox.mock().returns(false);
            upload.getBaseUrl = sandbox.mock().returns(baseUrl);
            upload.file = {
                size: 1,
                name: 'zavala'
            };
            upload.id = '123';

            upload.xhr = {
                options: sandbox.mock().withArgs({
                    url: `${baseUrl}/files/${fileId}/content`,
                    data: sinon.match.object,
                    successHandler: sinon.match.func,
                    errorHandler: sinon.match.func
                })
            };

            upload.makePreflightRequest({
                fileId
            });
        });
    });

    describe('makeRequest', () => {
        it('should not do anything if API is destroyed', () => {
            upload.isDestroyed = sandbox.mock().returns(true);
            upload.xhr = {
                uploadFile: sandbox.mock().never()
            };
            upload.makeRequest({
                fileId: '123',
                fileName: 'hunter'
            });
        });

        it('should generate upload URL and make request if no URL is provided', () => {
            upload.isDestroyed = sandbox.mock().returns(false);

            upload.file = {
                name: 'warlock'
            };
            upload.id = '123';
            upload.xhr = {
                uploadFile: sinon.mock().withArgs({
                    url: `${upload.uploadHost}/api/2.0/files/content`,
                    data: {
                        attributes: sinon.match.string,
                        file: upload.file
                    },
                    successHandler: sinon.match.func,
                    errorHandler: sinon.match.func,
                    progressHandler: sinon.match.func
                })
            };

            upload.makeRequest({});
        });

        it('should upload to new file version if file ID is provided', () => {
            const fileId = '123';

            upload.isDestroyed = sandbox.mock().returns(false);
            upload.file = {
                name: 'warlock'
            };
            upload.id = '123';
            upload.xhr = {
                uploadFile: sinon.mock().withArgs({
                    url: `${upload.uploadHost}/api/2.0/files/${fileId}/content`,
                    data: sinon.match.any,
                    successHandler: sinon.match.func,
                    errorHandler: sinon.match.func,
                    progressHandler: sinon.match.func
                })
            };

            upload.makeRequest({
                fileId
            });
        });

        it('should stringify name and parent for upload data', () => {
            const name = 'titan';
            const parentId = '123';

            upload.isDestroyed = sandbox.mock().returns(false);
            upload.id = parentId;
            upload.xhr = {
                uploadFile: sandbox.stub()
            };

            sandbox.mock(JSON).expects('stringify').withArgs({
                name,
                parent: {
                    id: parentId
                }
            });

            upload.makeRequest({
                fileName: name
            });
        });
    });

    describe('upload()', () => {
        it('should not do anything if API is destroyed', () => {
            upload.isDestroyed = sandbox.mock().returns(true);
            upload.makePreflightRequest = sandbox.mock().never();
            upload.upload({});
        });

        it('should set properties and make preflight request', () => {
            const id = '123';
            const file = {};
            const successCallback = () => {};
            const errorCallback = () => {};
            const progressCallback = () => {};
            const overwrite = true;

            upload.isDestroyed = sandbox.mock().returns(false);
            upload.makePreflightRequest = sandbox.mock();
            upload.upload({
                id,
                file,
                successCallback,
                errorCallback,
                progressCallback,
                overwrite
            });

            expect(upload.id).to.equal(id);
            expect(upload.file).to.equal(file);
            expect(upload.successCallback).to.equal(successCallback);
            expect(upload.errorCallback).to.equal(errorCallback);
            expect(upload.progressCallback).to.equal(progressCallback);
            expect(upload.overwrite).to.equal(overwrite);
        });
    });

    describe('cancel()', () => {
        it('should not do anything if API is destroyed', () => {
            upload.isDestroyed = sandbox.mock().returns(true);
            upload.xhr = {
                abort: sandbox.mock().never()
            };
            upload.cancel();
        });

        it('should abort xhr', () => {
            upload.isDestroyed = sandbox.mock().returns(false);
            upload.xhr = {
                abort: sandbox.mock()
            };
            upload.cancel();
        });
    });
});
