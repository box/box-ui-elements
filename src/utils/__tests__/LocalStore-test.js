import LocalStore from '../LocalStore';

const localStorageMock = (() => {
    const store = {};
    return {
        getItem(key) {
            return store[key];
        },
        setItem(key, value) {
            store[key] = value.toString();
        },
        removeItem(key) {
            delete store[key];
        },
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('util/LocalStore', () => {
    let localStore;
    const key = 'randomKey';
    const value = '{"hi": 1}';

    beforeEach(() => {
        localStore = new LocalStore();
    });

    describe('setItem()', () => {
        test('should call setItem on localStorage properly when localStorage is available', () => {
            localStore.isLocalStorageAvailable = true;
            localStore.buildKey = jest.fn().mockReturnValueOnce(key);
            localStore.localStorage.setItem = jest.fn();
            localStore.setItem(key, value);
            expect(localStore.localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
        });

        test('should set value in memory when localStorage is not available', () => {
            localStore.isLocalStorageAvailable = false;
            localStore.memoryStore.set = jest.fn();
            localStore.setItem(key, value);
            expect(localStore.memoryStore.set).toHaveBeenCalledWith(key, value);
        });
    });

    describe('getItem()', () => {
        test.each`
            rawValue | expected
            ${value} | ${JSON.parse(value)}
            ${null}  | ${null}
        `('should call getItem on localStorage properly when localStorage is available', ({ rawValue, expected }) => {
            localStore.isLocalStorageAvailable = true;
            localStore.buildKey = jest.fn().mockReturnValueOnce(key);
            localStore.localStorage.getItem = jest.fn().mockReturnValueOnce(rawValue);
            expect(localStore.getItem(key, value)).toEqual(expected);
            expect(localStore.localStorage.getItem).toHaveBeenCalledWith(key);
        });

        test('should set value from memory when localStorage is not available', () => {
            localStore.isLocalStorageAvailable = false;
            localStore.memoryStore.get = jest.fn().mockReturnValueOnce(value);
            expect(localStore.getItem(key, value)).toBe(value);
            expect(localStore.memoryStore.get).toHaveBeenCalledWith(key);
        });
    });

    describe('removeItem()', () => {
        test('should call removeItem on localStorage properly when localStorage is available', () => {
            localStore.isLocalStorageAvailable = true;
            localStore.buildKey = jest.fn().mockReturnValueOnce(key);
            localStore.localStorage.removeItem = jest.fn();
            localStore.removeItem(key);
            expect(localStore.localStorage.removeItem).toHaveBeenCalledWith(key);
        });

        test('should delete value from memory when localStorage is not available and key exists in memory', () => {
            localStore.isLocalStorageAvailable = false;
            localStore.memoryStore.set(key, value);
            localStore.localStorage.removeItem = jest.fn();
            localStore.removeItem(key);
            expect(localStore.memoryStore.has(key)).toBeFalsy();
            expect(localStore.localStorage.removeItem).not.toHaveBeenCalled();
        });

        test('should noop when localStorage is not available and key does not exists in memory', () => {
            localStore.isLocalStorageAvailable = false;
            localStore.memoryStore.set(key, value);
            localStore.localStorage.removeItem = jest.fn();
            localStore.removeItem(key);
            expect(localStore.localStorage.removeItem).not.toHaveBeenCalled();
        });
    });
});
