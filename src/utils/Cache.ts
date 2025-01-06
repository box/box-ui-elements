/**
 * @file A simple in-memory cache
 * @author Box
 */

import merge from 'lodash/merge';

class Cache {
    private cache: Map<string, unknown>;

    /**
     * [constructor]
     *
     * @return {Cache} Cache instance
     */
    constructor() {
        this.cache = new Map();
    }

    /**
     * Caches a simple object in memory.
     *
     * @param {string} key The cache key
     * @param {*} value The cache value
     * @return {void}
     */
    set<T>(key: string, value: T): void {
        this.cache.set(key, value);
    }

    /**
     * Merges cached values for objects.
     *
     * @param {string} key The cache key
     * @param {*} value The cache value
     * @return {void}
     */
    merge<T extends object>(key: string, value: T): void {
        if (this.has(key)) {
            const existing = this.cache.get(key) as T;
            this.cache.set(key, merge({}, existing, value));
        } else {
            throw new Error(`Key ${key} not in cache!`);
        }
    }

    /**
     * Deletes object from in-memory cache.
     *
     * @param {string} key The cache key
     * @return {void}
     */
    unset(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Deletes all object from in-memory cache
     * that match the key as prefix.
     *
     * @param {string} prefix The cache key prefix
     * @return {void}
     */
    unsetAll(prefix?: string): void {
        if (prefix) {
            Array.from(this.cache.keys()).forEach(key => {
                if (key.startsWith(prefix)) {
                    this.cache.delete(key);
                }
            });
        } else {
            this.cache.clear();
        }
    }

    /**
     * Checks if cache has provided key.
     *
     * @param {string} key The cache key
     * @return {boolean} Whether the cache has key
     */
    has(key: string): boolean {
        return this.cache.has(key);
    }

    /**
     * Fetches a cached object from in-memory cache if available.
     *
     * @param {string} key Key of cached object
     * @return {*} Cached object
     */
    get<T>(key: string): T | undefined {
        const value = this.cache.get(key);
        return value as T | undefined;
    }
}

export type { Cache };
export default Cache;
