/* eslint-disable no-unused-expressions */

import APIFactory from '../APIFactory';
import Cache from '../../util/Cache';
import ChunkedUploadAPI from '../ChunkedUpload';
import PlainUploadAPI from '../PlainUpload';
import FolderAPI from '../Folder';
import FileAPI from '../File';
import WebLinkAPI from '../WebLink';
import SearchAPI from '../Search';
import { DEFAULT_HOSTNAME_API, DEFAULT_HOSTNAME_UPLOAD } from '../../constants';

let factory;
const sandbox = sinon.sandbox.create();

describe('api/APIFactory', () => {
    beforeEach(() => {
        factory = new APIFactory();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('destroy()', () => {
        it('should destroy all APIs', () => {
            factory.fileAPI = { destroy: sandbox.mock() };
            factory.folderAPI = { destroy: sandbox.mock() };
            factory.weblinkAPI = { destroy: sandbox.mock() };
            factory.searchAPI = { destroy: sandbox.mock() };
            factory.plainUploadAPI = { destroy: sandbox.mock() };
            factory.chunkedUploadAPI = { destroy: sandbox.mock() };
            factory.destroy();
            expect(factory.fileAPI).to.equal(undefined);
            expect(factory.folderAPI).to.equal(undefined);
            expect(factory.weblinkAPI).to.equal(undefined);
            expect(factory.searchAPI).to.equal(undefined);
            expect(factory.plainUploadAPI).to.equal(undefined);
            expect(factory.chunkedUploadAPI).to.equal(undefined);
        });
        it('should not destroy cache by default', () => {
            const cache = factory.options.cache;
            cache.set('foo', 'bar');
            factory.destroy();
            expect(factory.options.cache).to.equal(cache);
            expect(factory.options.cache.get('foo')).to.equal('bar');
        });
        it('should destroy cache by asked', () => {
            const cache = factory.options.cache;
            cache.set('foo', 'bar');
            factory.destroy(true);
            expect(factory.options.cache).to.not.equal(cache);
            expect(factory.options.cache.get('foo')).to.equal(undefined);
        });
    });

    describe('getFileAPI()', () => {
        it('should call destroy and return file API', () => {
            const spy = sandbox.spy(factory, 'destroy');
            const fileAPI = factory.getFileAPI();
            expect(spy).to.be.called;
            expect(fileAPI instanceof FileAPI).to.be.true;
            expect(fileAPI.options.cache instanceof Cache).to.be.true;
            expect(fileAPI.options.apiHost).to.equal(DEFAULT_HOSTNAME_API);
            expect(fileAPI.options.uploadHost).to.equal(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getWebLinkAPI()', () => {
        it('should call destroy and return web link API', () => {
            const spy = sandbox.spy(factory, 'destroy');
            const webLinkAPI = factory.getWebLinkAPI();
            expect(spy).to.be.called;
            expect(webLinkAPI instanceof WebLinkAPI).to.be.true;
            expect(webLinkAPI.options.cache instanceof Cache).to.be.true;
            expect(webLinkAPI.options.apiHost).to.equal(DEFAULT_HOSTNAME_API);
            expect(webLinkAPI.options.uploadHost).to.equal(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getPlainUploadAPI()', () => {
        it('should call destroy and return plain upload API', () => {
            const spy = sandbox.spy(factory, 'destroy');
            const plainUploadAPI = factory.getPlainUploadAPI();
            expect(spy).to.be.called;
            expect(plainUploadAPI instanceof PlainUploadAPI).to.be.true;
            expect(plainUploadAPI.options.cache instanceof Cache).to.be.true;
            expect(plainUploadAPI.options.apiHost).to.equal(DEFAULT_HOSTNAME_API);
            expect(plainUploadAPI.options.uploadHost).to.equal(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getChunkedUploadAPI()', () => {
        it('should call destroy and return chunked upload API', () => {
            const spy = sandbox.spy(factory, 'destroy');
            const chunkedUploadAPI = factory.getChunkedUploadAPI();
            expect(spy).to.be.called;
            expect(chunkedUploadAPI instanceof ChunkedUploadAPI).to.be.true;
            expect(chunkedUploadAPI.options.cache instanceof Cache).to.be.true;
            expect(chunkedUploadAPI.options.apiHost).to.equal(DEFAULT_HOSTNAME_API);
            expect(chunkedUploadAPI.options.uploadHost).to.equal(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getFolderAPI()', () => {
        it('should call destroy and return folder API', () => {
            const spy = sandbox.spy(factory, 'destroy');
            const folderAPI = factory.getFolderAPI();
            expect(spy).to.be.called;
            expect(folderAPI instanceof FolderAPI).to.be.true;
            expect(folderAPI.options.cache instanceof Cache).to.be.true;
            expect(folderAPI.options.apiHost).to.equal(DEFAULT_HOSTNAME_API);
            expect(folderAPI.options.uploadHost).to.equal(DEFAULT_HOSTNAME_UPLOAD);
        });
    });

    describe('getSearchAPI()', () => {
        it('should call destroy and return search API', () => {
            const spy = sandbox.spy(factory, 'destroy');
            const searchAPI = factory.getSearchAPI();
            expect(spy).to.be.called;
            expect(searchAPI instanceof SearchAPI).to.be.true;
            expect(searchAPI.options.cache instanceof Cache).to.be.true;
            expect(searchAPI.options.apiHost).to.equal(DEFAULT_HOSTNAME_API);
            expect(searchAPI.options.uploadHost).to.equal(DEFAULT_HOSTNAME_UPLOAD);
        });
    });
});
