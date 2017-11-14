import { withData } from 'leche';

import LocalStore from '../LocalStore';

describe('util/localStore', () => {
    let localStore;
    const key = 'randomKey';
    const value = '{"hi": 1}';
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        localStore = new LocalStore();
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('setItem()', () => {
        it('should call setItem on localStorage properly when localStorage is available', () => {
            localStore.isLocalStorageAvailable = true;
            localStore.buildKey = sandbox.mock().returns(key);
            localStore.localStorage.setItem = sandbox.mock(key, JSON.stringify(value));

            localStore.setItem(key, value);
        });

        it('should set value in memory when localStorage is not available', () => {
            localStore.isLocalStorageAvailable = false;
            localStore.memoryStore.set = sandbox.mock().withArgs(key, value);

            localStore.setItem(key, value);
        });
    });

    describe('getItem()', () => {
        withData([[value, JSON.parse(value)], [null, null]], (rawValue, expected) => {
            it('should call getItem on localStorage properly when localStorage is available', () => {
                localStore.isLocalStorageAvailable = true;
                localStore.buildKey = sandbox.mock().returns(key);
                localStore.localStorage.getItem = sandbox.mock().withArgs(key).returns(rawValue);

                assert.deepEqual(localStore.getItem(key, value), expected);
            });
        });

        it('should set value from memory when localStorage is not available', () => {
            localStore.isLocalStorageAvailable = false;
            localStore.memoryStore.get = sandbox.mock().withArgs(key).returns(value);

            assert.equal(localStore.getItem(key, value), value);
        });
    });

    describe('removeItem()', () => {
        it('should call removeItem on localStorage properly when localStorage is available', () => {
            localStore.isLocalStorageAvailable = true;
            localStore.buildKey = sandbox.mock().returns(key);
            localStore.localStorage.removeItem = sandbox.mock().withArgs(key);

            localStore.removeItem(key);
        });

        it('should delete value from memory when localStorage is not available and key exists in memory', () => {
            localStore.isLocalStorageAvailable = false;
            localStore.memoryStore.set(key, value);
            localStore.localStorage.removeItem = sandbox.mock().never();

            localStore.removeItem(key);

            assert.isFalse(localStore.memoryStore.has(key));
        });

        it('should noop when localStorage is not available and key does not exists in memory', () => {
            localStore.isLocalStorageAvailable = false;
            localStore.memoryStore.set(key, value);
            localStore.localStorage.removeItem = sandbox.mock().never();

            localStore.removeItem(key);
        });
    });
});
