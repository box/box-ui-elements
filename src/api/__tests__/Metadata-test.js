import Metadata from '../Metadata';

let metadata;

describe('api/Metadata', () => {
    beforeEach(() => {
        metadata = new Metadata({});
    });

    describe('getMetadataUrl()', () => {
        test('should throw with a bad metadata field', () => {
            expect(() => {
                metadata.getMetadataUrl('foo', 'bar');
            }).toThrow(Error, /Metadata field should start with metadata/);
        });
        test('should return correct version api url with id', () => {
            expect(metadata.getMetadataUrl('foo', 'metadata.baz.buz')).toBe(
                'https://api.box.com/2.0/files/foo/metadata/baz/buz'
            );
        });
    });

    describe('patch()', () => {
        test('should throw with a bad item error when no id', () => {
            expect(() => {
                metadata.getMetadataUrl({});
            }).toThrow(Error, /Bad box item/);
        });
        test('should throw with a bad item error when no permissions', () => {
            expect(() => {
                metadata.getMetadataUrl({ id: 'foo' });
            }).toThrow(Error, /Bad box item/);
        });
        test('should throw with a permissions error when no upload permission', () => {
            expect(() => {
                metadata.getMetadataUrl({ id: 'foo', permissions: {} });
            }).toThrow(Error, /Insufficient Permissions/);
        });
        test('should make request and call merge and success handler', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true
                }
            };
            const ops = [{ op: 'add' }, { op: 'test' }];
            const field = 'box.skills';

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.put = jest.fn().mockReturnValueOnce({ data: 'metadata' });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.patch(file, field, ops, success, error);

            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, field);
            expect(metadata.xhr.put).toHaveBeenCalledWith({
                url: 'url',
                headers: { 'Content-Type': 'application/json-patch+json' },
                id: 'file_id',
                data: ops
            });
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.getCacheKey).toHaveBeenCalledWith(file.id);
            expect(metadata.merge).toHaveBeenCalledWith('cache_id', field, 'metadata');
            expect(metadata.successHandler).toHaveBeenCalledWith('file');
            expect(metadata.errorHandler).not.toHaveBeenCalled();
        });
        test('should make request but not merge or call success handler when destroyed', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true
                }
            };
            const ops = [{ op: 'add' }, { op: 'test' }];
            const field = 'box.skills';

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.put = jest.fn().mockReturnValueOnce({ data: 'metadata' });
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(true);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.patch(file, field, ops, success, error);

            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, field);
            expect(metadata.xhr.put).toHaveBeenCalledWith({
                url: 'url',
                headers: { 'Content-Type': 'application/json-patch+json' },
                id: 'file_id',
                data: ops
            });
            expect(metadata.isDestroyed).toHaveBeenCalled();
            expect(metadata.getCacheKey).not.toHaveBeenCalled();
            expect(metadata.merge).not.toHaveBeenCalled();
            expect(metadata.successHandler).not.toHaveBeenCalled();
            expect(metadata.errorHandler).not.toHaveBeenCalled();
        });
        test('should make request and call error handler for error', async () => {
            const success = jest.fn();
            const error = jest.fn();
            const file = {
                id: 'id',
                permissions: {
                    can_upload: true
                }
            };
            const ops = [{ op: 'add' }, { op: 'test' }];
            const field = 'box.skills';
            const xhrError = new Error('error');

            metadata.getMetadataUrl = jest.fn().mockReturnValueOnce('url');
            metadata.xhr.put = jest.fn().mockReturnValueOnce(Promise.reject(xhrError));
            metadata.isDestroyed = jest.fn().mockReturnValueOnce(false);
            metadata.getCacheKey = jest.fn().mockReturnValueOnce('cache_id');
            metadata.merge = jest.fn().mockReturnValueOnce('file');
            metadata.successHandler = jest.fn();
            metadata.errorHandler = jest.fn();

            await metadata.patch(file, field, ops, success, error);

            expect(metadata.getMetadataUrl).toHaveBeenCalledWith(file.id, field);
            expect(metadata.xhr.put).toHaveBeenCalledWith({
                url: 'url',
                headers: { 'Content-Type': 'application/json-patch+json' },
                id: 'file_id',
                data: ops
            });
            expect(metadata.isDestroyed).not.toHaveBeenCalled();
            expect(metadata.getCacheKey).not.toHaveBeenCalled();
            expect(metadata.merge).not.toHaveBeenCalled();
            expect(metadata.successHandler).not.toHaveBeenCalled();
            expect(metadata.errorHandler).toHaveBeenCalledWith(xhrError);
        });
    });
});
