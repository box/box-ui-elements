import Cache from './Cache';
import type APICache from './Cache';

const KEY_PREFIX = 'localStore';
const SERVICE_VERSION = '0';

class LocalStore {
    memoryStore: APICache;

    localStorage: typeof localStorage;

    isLocalStorageAvailable: boolean;

    constructor() {
        this.memoryStore = new Cache();
        try {
            this.localStorage = window.localStorage;
            this.isLocalStorageAvailable = this.canUseLocalStorage();
        } catch (e) {
            this.isLocalStorageAvailable = false;
        }
    }

    /** Builds a key for the session store. */
    buildKey(key: string): string {
        return `${KEY_PREFIX}/${SERVICE_VERSION}/${key}`;
    }

    /**
     * Test to see browser can use local storage.
     * See http://stackoverflow.com/questions/14555347
     * Note that this will return false if we are actually hitting the maximum localStorage
     * size (5MB / 2.5M chars)
     *
     * @private
     */
    canUseLocalStorage(): boolean {
        if (!this.localStorage) {
            return false;
        }

        try {
            this.localStorage.setItem(this.buildKey('TestKey'), 'testValue');
            this.localStorage.removeItem(this.buildKey('TestKey'));
            return true;
        } catch (e) {
            return false;
        }
    }

    /** Set an item. */
    setItem(key: string, value: unknown): void {
        if (this.isLocalStorageAvailable) {
            try {
                this.localStorage.setItem(this.buildKey(key), JSON.stringify(value));
            } catch (e) {
                // no-op
            }
        } else {
            this.memoryStore.set(key, value);
        }
    }

    /** Get an item. */
    getItem(key: string): unknown {
        if (this.isLocalStorageAvailable) {
            try {
                const item = this.localStorage.getItem(this.buildKey(key));
                if (!item) {
                    return null;
                }

                return JSON.parse(item);
            } catch (e) {
                return null;
            }
        } else {
            return this.memoryStore.get(key);
        }
    }

    /** Remove an item. */
    removeItem(key: string): void {
        if (this.isLocalStorageAvailable) {
            try {
                this.localStorage.removeItem(this.buildKey(key));
            } catch (e) {
                // no-op
            }

            return;
        }

        this.memoryStore.unset(key);
    }
}

export default LocalStore;
