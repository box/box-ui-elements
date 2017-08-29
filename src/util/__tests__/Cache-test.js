import Cache from '../Cache';

let cache;
const sandbox = sinon.sandbox.create();

describe('util/Cache', () => {
    beforeEach(() => {
        cache = new Cache();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    it('should set, get and unset correctly', () => {
        cache.set('foo', 'bar');
        assert.ok(cache.has('foo'));
        assert.equal(cache.get('foo'), 'bar');

        cache.unset('foo');
        cache.unset('foo');
        assert.notOk(cache.has('foo'));
    });

    it('should set and get correctly with 0 value', () => {
        cache.set('foo', 0);
        assert.ok(cache.has('foo'));
        assert.equal(cache.get('foo'), 0);
    });

    it('should return undefined when not set', () => {
        cache.set('foo1', 'bar1');
        cache.set('foo2', 'bar2');
        cache.set('foo3', 'bar3');
        assert.equal(cache.get('foo1'), 'bar1');
        assert.equal(cache.get('foo2'), 'bar2');
        assert.equal(cache.get('foo3'), 'bar3');
        cache.unsetAll('foo');
        assert.equal(cache.get('foo1'), undefined);
        assert.equal(cache.get('foo2'), undefined);
        assert.equal(cache.get('foo3'), undefined);
    });

    it('should properly unset all', () => {
        assert.equal(cache.get('foobar'), undefined);
    });

    it('should merge correctly', () => {
        cache.set('foo', { a: 1 });
        cache.merge('foo', { b: 2 });
        const value = cache.get('foo');
        assert.equal(1, value.a);
        assert.equal(2, value.b);
    });

    it('should not merge non existant items', () => {
        try {
            cache.merge('foo', { b: 2 });
        } catch (e) {
            assert.equal('Key foo not in cache!', e.message);
        }
    });
});
