/**
 * @flow
 * @file A simple in-memory cache
 * @author Box
 */

import merge from 'lodash/merge';
import type { StringAnyMap } from '../common/types/core';

class Cache {
    /**
     * @property {*}
     */
    cache: StringAnyMap;

    /**
     * [constructor]
     *
     * @return {Cache} Cache instance
     */
    constructor() {
        this.cache = {};
    }

    /**
     * Caches a simple object in memory.
     *
     * @param {string} key The cache key
     * @param {*} value The cache value
     * @return {void}
     */
    set(key: string, value: any): void {
        this.cache[key] = value;
    }

    /**
     * Merges cached values for objects.
     *
     * @param {string} key The cache key
     * @param {*} value The cache value
     * @return {void}
     */
    merge(key: string, value: any): void {
        if (this.has(key)) {
            this.set(key, merge({}, this.get(key), value));
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
        delete this.cache[key];
    }

    /**
     * Deletes all object from in-memory cache
     * that match the key as prefix.
     *
     * @param {string} prefix The cache key prefix
     * @return {void}
     */
    unsetAll(prefix: string): void {
        Object.keys(this.cache).forEach((key: string) => {
            if (key.startsWith(prefix)) {
                delete this.cache[key];
            }
        });
    }

    /**
     * Checks if cache has provided key.
     *
     * @param {string} key The cache key
     * @return {boolean} Whether the cache has key
     */
    has(key: string): boolean {
        return {}.hasOwnProperty.call(this.cache, key);
    }

    /**
     * Fetches a cached object from in-memory cache if available.
     *
     * @param {string} key Key of cached object
     * @return {*} Cached object
     */
    get(key: string): any {
        if (this.has(key)) {
            return this.cache[key];
        }

        return undefined;
    }
}

export default Cache;
