import File from '../File';
import Cache from '../../util/Cache';
import getFields from '../../util/fields';
import { X_REP_HINTS } from '../../constants';

let file;
let cache;
const sandbox = sinon.sandbox.create();

describe('api/File', () => {
    beforeEach(() => {
        file = new File();
        cache = new Cache();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('getCacheKey()', () => {
        it('should return correct key', () => {
            expect(file.getCacheKey('foo')).to.equal('file_foo');
        });
    });

    describe('getTypedFileId()', () => {
        it('should return correct typed id', () => {
            expect(file.getTypedFileId('foo')).to.equal('file_foo');
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
                .withArgs({ url: 'https://api.box.com/2.0/files/foo', params: { fields: 'download_url' } })
                .returns(Promise.resolve({ download_url: 'bar' }));
            file.xhr = { get };
            return file.getDownloadUrl('foo', success);
        });

        it('should make xhr to get download url and call error callback', () => {
            const success = sandbox.mock().never();
            const error = sandbox.mock().withArgs('error');
            const get = sandbox
                .mock()
                .withArgs({ url: 'https://api.box.com/2.0/files/foo', params: { fields: 'download_url' } })
                .returns(Promise.reject('error'));
            file.xhr = { get };
            return file.getDownloadUrl('foo', success, error);
        });
    });

    describe('file()', () => {
        it('should not do anything if destroyed', () => {
            file.isDestroyed = sandbox.mock().returns(true);
            file.getCache = sandbox.mock().never();
            file.getCacheKey = sandbox.mock().never();
            file.xhr = null;
            return file.file('id', 'success', 'fail').should.be.rejected;
        });

        it('should return cached file', () => {
            cache.set('key', 'file');
            file.xhr = null;
            file.options = { cache };
            file.getCache = sandbox.mock().returns(cache);
            file.getCacheKey = sandbox.mock().withArgs('id').returns('key');
            return file.file('id', sandbox.mock().withArgs('file'));
        });

        it('should make xhr to get file and call success callback', () => {
            file.xhr = {
                get: sandbox
                    .mock()
                    .withArgs({
                        id: 'file_id',
                        url: 'https://api.box.com/2.0/files/id',
                        params: {
                            fields: getFields(true)
                        },
                        headers: {
                            'X-Rep-Hints': X_REP_HINTS
                        }
                    })
                    .returns(Promise.resolve('new file'))
            };
            return file.file('id', sandbox.mock().withArgs('new file'));
        });

        it('should call error callback when xhr fails', () => {
            file.xhr = {
                get: sandbox
                    .mock()
                    .withArgs({
                        id: 'file_id',
                        url: 'https://api.box.com/2.0/files/id',
                        params: {
                            fields: getFields(true, true)
                        },
                        headers: {
                            'X-Rep-Hints': X_REP_HINTS
                        }
                    })
                    .returns(Promise.reject('error'))
            };
            return file.file('id', sandbox.mock().never(), sandbox.mock().withArgs('error'), false, true);
        });

        it('should make xhr to get file when forced to clear cache', () => {
            cache.set('key', 'file');
            file.xhr = null;
            file.options = { cache };
            file.getCache = sandbox.mock().returns(cache);
            file.getCacheKey = sandbox.mock().withArgs('id').returns('key');
            file.xhr = {
                get: sandbox
                    .mock()
                    .withArgs({
                        id: 'file_id',
                        url: 'https://api.box.com/2.0/files/id',
                        params: {
                            fields: getFields(true)
                        },
                        headers: {
                            'X-Rep-Hints': X_REP_HINTS
                        }
                    })
                    .returns(Promise.resolve('new file'))
            };
            return file.file('id', sandbox.mock().withArgs('new file'), 'error', true);
        });
    });
});
