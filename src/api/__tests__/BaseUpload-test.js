/* eslint-disable no-unused-expressions */
import BaseUpload from '../BaseUpload';

let upload;
let clock;
let file;
const sandbox = sinon.sandbox.create();

describe('api/BaseUpload', () => {
    beforeEach(() => {
        upload = new BaseUpload();
        clock = sinon.useFakeTimers();
        file = {
            name: 'foo'
        };
        upload.file = file;
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
        clock.restore();
    });

    describe('baseUploadErrorHandler()', () => {
        it('should overwrite file on 409 if overwrite property is true', () => {
            const fileId = '123';
            upload.overwrite = true;

            const retryUploadFunc = sandbox.mock().withArgs({
                fileId,
                fileName: file.name
            });

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
        });

        it('should append timestamp and re-upload on 409 if overwrite property is false', () => {
            upload.file.name = 'foo.bar';
            upload.overwrite = false;
            sandbox.stub(Date, 'now').returns('1969-07-16');

            const retryUploadFunc = sandbox.mock().withArgs({
                fileName: 'foo-1969-07-16.bar'
            });

            upload.baseUploadErrorHandler(
                {
                    status: 409
                },
                retryUploadFunc
            );
        });

        it('should retry on 429 status after default retry interval', () => {
            const retryAfterMs = 3000;

            const retryUploadFunc = sandbox.mock().withArgs({
                fileName: file.name
            });

            upload.baseUploadErrorHandler(
                {
                    status: 429
                },
                retryUploadFunc
            );
            clock.tick(retryAfterMs + 1);
        });

        it('should retry on too_many_requests code after default retry interval', () => {
            const retryAfterMs = 3000;

            const retryUploadFunc = sandbox.mock().withArgs({
                fileName: file.name
            });

            upload.baseUploadErrorHandler(
                {
                    code: 'too_many_requests'
                },
                retryUploadFunc
            );
            clock.tick(retryAfterMs + 1);
        });

        it('should retry after interval defined in response header', () => {
            const retryAfterMs = 1000;

            const retryUploadFunc = sandbox.mock().withArgs({
                fileName: file.name
            });

            upload.baseUploadErrorHandler(
                {
                    code: 'too_many_requests',
                    headers: {
                        get: sandbox.mock().withArgs('Retry-After').returns(`${retryAfterMs / 1000}`)
                    }
                },
                retryUploadFunc
            );
            clock.tick(retryAfterMs + 1);
        });

        it('should call the error callback if error has a status that is not 409 or 429', () => {
            const error = new Error();
            error.status = 500;

            upload.errorCallback = sandbox.mock().withArgs(error);
            upload.baseUploadErrorHandler(error, () => {});
        });

        it('should call the error callback if error message is from CORS', () => {
            const error = new Error();
            error.message = 'Failed to fetch';

            upload.errorCallback = sandbox.mock().withArgs(error);
            upload.baseUploadErrorHandler(error, () => {});
        });

        it('should retry after default interval for other errors', () => {
            const retryAfterMs = 1000;
            const error = new Error('Some other error');
            const retryUploadFunc = sandbox.mock().withArgs({
                fileName: file.name
            });

            upload.baseUploadErrorHandler(error, retryUploadFunc);
            clock.tick(retryAfterMs + 1);
        });

        it('should not retry before exponential backoff interval for other errors', () => {
            const MS_IN_S = 1000;
            const retryCount = 3;
            const error = new Error('Some other error');
            const retryUploadFunc = sandbox.mock().never();
            upload.retryCount = retryCount;

            upload.baseUploadErrorHandler(error, retryUploadFunc);
            clock.tick(2 ** retryCount * MS_IN_S - 1);

            expect(upload.retryCount).to.equal(retryCount + 1);
        });
    });
});
