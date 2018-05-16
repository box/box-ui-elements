import BaseUpload from '../BaseUpload';

let upload;

describe('api/uploads/BaseUpload', () => {
    beforeEach(() => {
        upload = new BaseUpload({
            token: '123'
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
            const file = {
                size: 1,
                name: 'zavala'
            };
            const folderId = '123';

            upload.xhr = {
                options: jest.fn()
            };

            upload.makePreflightRequest({
                file,
                folderId,
                successHandler: jest.fn(),
                errorHandler: jest.fn()
            });
            expect(upload.xhr.options).toHaveBeenCalledWith({
                url: `${baseUrl}/files/content`,
                data: {
                    name: file.name,
                    parent: {
                        id: folderId
                    },
                    size: file.size
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
            const file = {
                size: 1,
                name: 'zavala'
            };
            const folderId = '123';

            upload.xhr = {
                options: jest.fn()
            };

            upload.makePreflightRequest({
                file,
                fileId,
                successHandler: jest.fn(),
                errorHandler: jest.fn()
            });
            expect(upload.xhr.options).toHaveBeenCalledWith({
                url: `${baseUrl}/files/${fileId}/content`,
                data: expect.any(Object),
                successHandler: expect.any(Function),
                errorHandler: expect.any(Function)
            });
        });
    });
});
