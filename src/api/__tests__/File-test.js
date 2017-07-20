import File from '../File';

let file;
const sandbox = sinon.sandbox.create();

describe('api/File', () => {
    beforeEach(() => {
        file = new File();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('getCacheKey()', () => {
        it('should return correct key', () => {
            expect(file.getCacheKey('foo')).to.equal('file_foo');
        });
    });

    describe('getUrl()', () => {
        it('should return correct file api url without id', () => {
            expect(file.getUrl()).to.equal('https://api.box.com/2.0/files');
        });
        it('should return correct file api url with id', () => {
            expect(file.getUrl('foo')).to.equal('https://api.box.com/2.0/files/foo');
        });
    });

    describe('getDownloadUrl()', () => {
        it('should make xhr to get download url and call success callback', () => {
            const success = sandbox.mock().withArgs('bar');
            const get = sandbox
                .mock()
                .withArgs('https://api.box.com/2.0/files/foo', { fields: 'download_url' })
                .returns(Promise.resolve({ download_url: 'bar' }));
            file.xhr = { get };
            return file.getDownloadUrl('foo', success);
        });
        it('should make xhr to get download url and call error callback', () => {
            const success = sandbox.mock().never();
            const error = sandbox.mock().withArgs('error');
            const get = sandbox
                .mock()
                .withArgs('https://api.box.com/2.0/files/foo', { fields: 'download_url' })
                .returns(Promise.reject('error'));
            file.xhr = { get };
            return file.getDownloadUrl('foo', success, error);
        });
    });
});
