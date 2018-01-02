import Base from '../Base';
import Xhr from '../../util/Xhr';
import Cache from '../../util/Cache';

let base;

describe('api/Base', () => {
    beforeEach(() => {
        base = new Base({});
    });

    test('should should have correct defaults on construct', () => {
        expect(base.options.apiHost).toBe('https://api.box.com');
        expect(base.options.uploadHost).toBe('https://upload.box.com');
        expect(base.cache).toBeInstanceOf(Cache);
        expect(base.apiHost).toBe('https://api.box.com');
        expect(base.uploadHost).toBe('https://upload.box.com');
        expect(base.xhr).toBeInstanceOf(Xhr);
        expect(base.destroyed).toBeFalsy();
    });

    test('should should have correct values on construct', () => {
        const options = {
            cache: 'cache',
            apiHost: 'apiHost',
            uploadHost: 'uploadHost'
        };
        base = new Base(options);
        expect(base.options).toEqual(options);
        expect(base.cache).toBe('cache');
        expect(base.apiHost).toBe('apiHost');
        expect(base.uploadHost).toBe('uploadHost');
        expect(base.xhr).toBeInstanceOf(Xhr);
        expect(base.destroyed).toBeFalsy();
    });

    describe('destroy()', () => {
        test('should return false when no destroyed', () => {
            expect(base.isDestroyed()).toBeFalsy();
        });
        test('should return true when destroyed', () => {
            base.destroy();
            expect(base.isDestroyed()).toBeTruthy();
        });
    });

    describe('getBaseUrl()', () => {
        test('should return correct api url', () => {
            base = new Base({
                apiHost: 'apiHost'
            });
            expect(base.getBaseUrl()).toBe('apiHost/2.0');
        });
        test('should return correct api url with trailing /', () => {
            base = new Base({
                apiHost: 'apiHost/'
            });
            expect(base.getBaseUrl()).toBe('apiHost/2.0');
        });
    });

    describe('getCache()', () => {
        test('should return correct cache', () => {
            base.cache = 'foo';
            expect(base.getCache()).toBe('foo');
        });
    });
});
