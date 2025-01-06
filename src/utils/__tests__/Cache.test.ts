import Cache from '../Cache';

let cache: Cache;

describe('util/Cache', () => {
    beforeEach(() => {
        cache = new Cache();
    });

    test('should set, get and unset correctly', () => {
        cache.set<string>('foo', 'bar');
        expect(cache.has('foo')).toBeTruthy();
        expect(cache.get<string>('foo')).toBe('bar');

        cache.unset('foo');
        cache.unset('foo');
        expect(cache.has('foo')).toBeFalsy();
    });

    test('should set and get correctly with 0 value', () => {
        cache.set<number>('foo', 0);
        expect(cache.has('foo')).toBeTruthy();
        expect(cache.get<number>('foo')).toBe(0);
    });

    test('should return undefined when not set', () => {
        cache.set<string>('foo1', 'bar1');
        cache.set<string>('foo2', 'bar2');
        cache.set<string>('foo3', 'bar3');
        expect(cache.get<string>('foo1')).toBe('bar1');
        expect(cache.get<string>('foo2')).toBe('bar2');
        expect(cache.get<string>('foo3')).toBe('bar3');
        cache.unsetAll('foo');
        expect(cache.get<string>('foo1')).toBeUndefined();
        expect(cache.get<string>('foo2')).toBeUndefined();
        expect(cache.get<string>('foo3')).toBeUndefined();
    });

    test('should properly unset all', () => {
        expect(cache.get<string>('foobar')).toBeUndefined();
    });

    test('should merge correctly without mutating original object', () => {
        const origObj = { a: 1 };
        const newObj = { b: 2 };
        cache.set<typeof origObj>('foo', origObj);
        cache.merge('foo', newObj);
        const value = cache.get<typeof origObj & typeof newObj>('foo');
        expect(1).toBe(value?.a);
        expect(2).toBe(value?.b);
        expect(value).not.toBe(origObj);
    });

    test('should not merge non existant items', () => {
        try {
            cache.merge('foo', { b: 2 });
        } catch (e) {
            expect('Key foo not in cache!').toBe((e as Error).message);
        }
    });
});
