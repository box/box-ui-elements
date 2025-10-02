/**
 * 
 * @file Local storage wrapper that falls back to an in memory store
 * @author Box
 */

import Cache from './Cache';
const KEY_PREFIX = 'localStore';
const SERVICE_VERSION = '0';
class LocalStore {
  /**
   * [constructor]
   *
   * @return {void}
   */
  constructor() {
    this.memoryStore = new Cache();
    try {
      this.localStorage = window.localStorage;
      this.isLocalStorageAvailable = this.canUseLocalStorage();
    } catch (e) {
      this.isLocalStorageAvailable = false;
    }
  }

  /**
   * Builds a key for the session store
   * @private
   * @param  {string} key
   *
   * @return {string}
   */
  buildKey(key) {
    return `${KEY_PREFIX}/${SERVICE_VERSION}/${key}`;
  }

  /**
   * Test to see browser can use local storage.
   * See http://stackoverflow.com/questions/14555347
   * Note that this will return false if we are actually hitting the maximum localStorage
   * size (5MB / 2.5M chars)
   *
   * @private
   * @return {boolean} True if browser can use localStore
   */
  canUseLocalStorage() {
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

  /**
   * Set an item
   *
   * @param {string} key
   * @param {*} value
   *
   * @return {void}
   */
  setItem(key, value) {
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

  /**
   * Get an item
   *
   * @param  {string} key
   *
   * @return {*}
   */
  getItem(key) {
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

  /**
   * Remove an item
   *
   * @param  {string} key
   *
   * @return {void}
   */
  removeItem(key) {
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
//# sourceMappingURL=LocalStore.js.map