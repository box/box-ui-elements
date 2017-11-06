/* eslint-disable no-unused-expressions */
import Chunk from '../Chunk';

let chunk;
const sandbox = sinon.sandbox.create();

describe('api/Chunk', () => {
    beforeEach(() => {
        chunk = new Chunk();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('getPart()', () => {
        it('should return the part associated with this chunk', () => {
            chunk.data = {
                part: new ArrayBuffer()
            };

            expect(chunk.getPart()).to.equal(chunk.data.part);
        });
    });

    describe('setup()', () => {
        it('should set chunk properties', () => {
            const uploadHost = 'someHost';
            const sessionId = 'session';
            const sha1 = 'someSha1';
            const offset = 10;
            const part = new Blob(['somedata']);
            const size = part.size;
            const totalSize = 50;
            const successCallback = () => {};
            const errorCallback = () => {};
            const progressCallback = () => {};
            const uploadHeaders = {
                'Content-Type': 'application/octet-stream',
                Digest: `sha=${sha1}`,
                'Content-Range': `bytes 10-${10 + size - 1}/50`
            };

            chunk.uploadHost = uploadHost;
            chunk.setup({
                sessionId,
                part,
                offset,
                sha1,
                totalSize,
                successCallback,
                errorCallback,
                progressCallback
            });

            expect(chunk.uploadUrl).to.equal(`${uploadHost}/api/2.0/files/upload_sessions/${sessionId}`);
            expect(chunk.uploadHeaders).to.deep.equal(uploadHeaders);
            expect(chunk.chunk).to.equal(part);
            expect(chunk.successCallback).to.equal(successCallback);
            expect(chunk.errorCallback).to.equal(errorCallback);
            expect(chunk.progressCallback).to.equal(progressCallback);
        });
    });

    describe('upload()', () => {
        it('should not do anything if API is destroyed', () => {
            chunk.isDestroyed = sandbox.mock().returns(true);
            chunk.xhr = {
                uploadFile: sandbox.mock().never()
            };
            chunk.upload();

            expect(chunk.chunk).to.equal(null);
        });

        it('should upload chunk', () => {
            const uploadUrl = 'someUrl';
            const chunkData = new Blob();
            const uploadHeaders = {
                header: 'blah'
            };

            chunk.uploadUrl = uploadUrl;
            chunk.chunk = chunkData;
            chunk.uploadHeaders = uploadHeaders;
            chunk.progressCallback = () => {};

            chunk.xhr = {
                uploadFile: sandbox.mock().withArgs({
                    url: uploadUrl,
                    data: chunkData,
                    headers: uploadHeaders,
                    method: 'PUT',
                    successHandler: sinon.match.func,
                    errorHandler: sinon.match.func,
                    progressHandler: sinon.match.func
                })
            };

            chunk.upload();
        });
    });

    describe('cancel()', () => {
        it('should abort xhr, clear data, and destroy API', () => {
            chunk.chunk = new Blob();
            chunk.data = {
                someStuff: {}
            };
            chunk.xhr = {
                abort: sandbox.mock()
            };
            chunk.destroy = sandbox.mock();

            chunk.cancel();

            expect(chunk.chunk).to.equal(null);
            expect(chunk.data).to.not.have.property('someStuff');
        });
    });

    describe('getProgress()', () => {
        it('should return internal progress and default to 0', () => {
            chunk.progress = 10;
            expect(chunk.getProgress()).to.equal(10);

            chunk.progress = 45;
            expect(chunk.getProgress()).to.equal(45);

            chunk.progress = null;
            expect(chunk.getProgress()).to.equal(0);
        });
    });

    describe('setProgress()', () => {
        it('should set internal progress', () => {
            chunk.setProgress(10);
            expect(chunk.progress).to.equal(10);

            chunk.setProgress(67);
            expect(chunk.progress).to.equal(67);
        });
    });
});
