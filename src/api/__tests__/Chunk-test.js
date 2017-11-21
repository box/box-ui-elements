import Chunk from '../Chunk';

let chunk;

describe('api/Chunk', () => {
    beforeEach(() => {
        chunk = new Chunk();
    });

    describe('getPart()', () => {
        test('should return the part associated with this chunk', () => {
            chunk.data = {
                part: new ArrayBuffer()
            };

            expect(chunk.getPart()).toBe(chunk.data.part);
        });
    });

    describe('setup()', () => {
        test('should set chunk properties', () => {
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

            expect(chunk.uploadUrl).toBe(`${uploadHost}/api/2.0/files/upload_sessions/${sessionId}`);
            expect(chunk.uploadHeaders).toEqual(uploadHeaders);
            expect(chunk.chunk).toBe(part);
            expect(chunk.successCallback).toBe(successCallback);
            expect(chunk.errorCallback).toBe(errorCallback);
            expect(chunk.progressCallback).toBe(progressCallback);
        });
    });

    describe('upload()', () => {
        test('should not do anything if API is destroyed', () => {
            chunk.isDestroyed = jest.fn().mockReturnValueOnce(true);
            chunk.xhr = {
                uploadFile: jest.fn()
            };
            chunk.upload();

            expect(chunk.chunk).toBe(null);
            expect(chunk.xhr.uploadFile).not.toHaveBeenCalled();
        });

        test('should upload chunk', () => {
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
                uploadFile: jest.fn()
            };

            chunk.upload();
            expect(chunk.xhr.uploadFile).toHaveBeenCalledWith({
                url: uploadUrl,
                data: chunkData,
                headers: uploadHeaders,
                method: 'PUT',
                successHandler: expect.any(Function),
                errorHandler: expect.any(Function),
                progressHandler: expect.any(Function)
            });
        });
    });

    describe('cancel()', () => {
        test('should abort xhr, clear data, and destroy API', () => {
            chunk.chunk = new Blob();
            chunk.data = {
                someStuff: {}
            };
            chunk.xhr = {
                abort: jest.fn()
            };
            chunk.destroy = jest.fn();

            chunk.cancel();

            expect(chunk.chunk).toBe(null);
            expect(chunk.data).not.toHaveProperty('someStuff');
        });
    });

    describe('getProgress()', () => {
        test('should return internal progress and default to 0', () => {
            chunk.progress = 10;
            expect(chunk.getProgress()).toBe(10);

            chunk.progress = 45;
            expect(chunk.getProgress()).toBe(45);

            chunk.progress = null;
            expect(chunk.getProgress()).toBe(0);
        });
    });

    describe('setProgress()', () => {
        test('should set internal progress', () => {
            chunk.setProgress(10);
            expect(chunk.progress).toBe(10);

            chunk.setProgress(67);
            expect(chunk.progress).toBe(67);
        });
    });
});
