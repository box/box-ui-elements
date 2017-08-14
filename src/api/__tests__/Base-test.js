/* eslint-disable no-unused-expressions */

import Base from '../Base';
import Xhr from '../../util/Xhr';
import Cache from '../../util/Cache';

let base;
const sandbox = sinon.sandbox.create();

describe('api/Base', () => {
    beforeEach(() => {
        base = new Base();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    it('should should have correct defaults on construct', () => {
        expect(base.options.apiHost).to.equal('https://api.box.com');
        expect(base.options.uploadHost).to.equal('https://upload.box.com');
        expect(base.cache instanceof Cache).to.be.true;
        expect(base.apiHost).to.equal('https://api.box.com');
        expect(base.uploadHost).to.equal('https://upload.box.com');
        expect(base.xhr instanceof Xhr).to.be.true;
        expect(base.destroyed).to.be.false;
    });

    it('should should have correct values on construct', () => {
        const options = {
            cache: 'cache',
            apiHost: 'apiHost',
            uploadHost: 'uploadHost'
        };
        base = new Base(options);
        expect(base.options).to.deep.equal(options);
        expect(base.cache).to.equal('cache');
        expect(base.apiHost).to.equal('apiHost');
        expect(base.uploadHost).to.equal('uploadHost');
        expect(base.xhr instanceof Xhr).to.be.true;
        expect(base.destroyed).to.be.false;
    });

    describe('destroy()', () => {
        it('should return false when no destroyed', () => {
            expect(base.isDestroyed()).to.be.false;
        });
        it('should return true when destroyed', () => {
            base.destroy();
            expect(base.isDestroyed()).to.be.true;
        });
    });

    describe('getBaseUrl()', () => {
        it('should return correct api url', () => {
            base = new Base({
                apiHost: 'apiHost'
            });
            expect(base.getBaseUrl()).to.equal('apiHost/2.0');
        });
        it('should return correct api url with trailing /', () => {
            base = new Base({
                apiHost: 'apiHost/'
            });
            expect(base.getBaseUrl()).to.equal('apiHost/2.0');
        });
    });

    describe('getCache()', () => {
        it('should return correct cache', () => {
            base.cache = 'foo';
            expect(base.getCache()).to.equal('foo');
        });
    });
});
