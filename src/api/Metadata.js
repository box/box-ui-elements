/**
 * @flow
 * @file Helper for the box metadata api
 * @author Box
 */

import uniqueid from 'lodash.uniqueid';
import Item from './Item';
import { CACHE_PREFIX_METADATA } from '../constants';
import Cache from '../util/Cache';
import type { Cards } from '../flowTypes';

class Metadata extends Item {
    /**
     * Creates a key for the cache
     *
     * @param {string} id file id
     * @return {string} key
     */
    getCacheKey(id: string): string {
        return `${CACHE_PREFIX_METADATA}${id}`;
    }

    /**
     * Gets a box file metadata
     *
     * @param {string} id File id
     * @param {Function} successCallback Function to call with results
     * @param {Function} errorCallback Function to call with errors
     * @param {boolean} forceFetch Bypasses the cache
     * @return {Promise}
     */
    metadata(
        id: string,
        successCallback: Function,
        errorCallback: Function,
        forceFetch: boolean = false
    ): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        const cache: Cache = this.getCache();
        const key = this.getCacheKey(id);

        // Clear the cache if needed
        if (forceFetch) {
            cache.unset(key);
        }

        // Return the Cache value if it exists
        if (cache.has(key)) {
            successCallback(cache.get(key));
            return Promise.resolve();
        }

        /* eslint-disable max-len */
        const metadata: Cards = [
            {
                id: uniqueid('card_'),
                type: 'card',
                card_type: 'keyword',
                item: {
                    type: 'file',
                    id: '3456'
                },
                title: 'Keywords',
                duration: 3600,
                entries: [
                    {
                        id: uniqueid('cardentry_'),
                        type: 'text',
                        text: 'Storage Limit',
                        appears: [
                            {
                                id: uniqueid('time_'),
                                start: 20,
                                end: 30
                            },
                            {
                                id: uniqueid('time_'),
                                start: 1200,
                                end: 1310
                            }
                        ]
                    },
                    {
                        id: uniqueid('cardentry_'),
                        type: 'text',
                        text: 'Streaming',
                        appears: [
                            {
                                id: uniqueid('time_'),
                                start: 20,
                                end: 30
                            },
                            {
                                id: uniqueid('time_'),
                                start: 1200,
                                end: 1310
                            },
                            {
                                id: uniqueid('time_'),
                                start: 2530,
                                end: 2560
                            }
                        ]
                    },
                    {
                        id: uniqueid('cardentry_'),
                        type: 'text',
                        text: 'Foo',
                        appears: [
                            {
                                id: uniqueid('time_'),
                                start: 2530,
                                end: 2560
                            }
                        ]
                    },
                    {
                        id: uniqueid('cardentry_'),
                        type: 'text',
                        text: 'bar',
                        appears: [
                            {
                                id: uniqueid('time_'),
                                start: 2530,
                                end: 2560
                            }
                        ]
                    },
                    {
                        id: uniqueid('cardentry_'),
                        type: 'text',
                        text: 'baz',
                        appears: [
                            {
                                id: uniqueid('time_'),
                                start: 2530,
                                end: 2560
                            }
                        ]
                    }
                ]
            },
            {
                id: uniqueid('card_'),
                type: 'card',
                card_type: 'timeline',
                item: {
                    type: 'file',
                    id: '3456'
                },
                title: 'Products',
                duration: 3600,
                entries: [
                    {
                        id: uniqueid('cardentry_'),
                        type: 'text',
                        text: 'Router',
                        appears: [
                            {
                                id: uniqueid('time_'),
                                start: 20,
                                end: 30
                            },
                            {
                                id: uniqueid('time_'),
                                start: 100,
                                end: 310
                            },
                            {
                                id: uniqueid('time_'),
                                start: 500,
                                end: 800
                            },
                            {
                                id: uniqueid('time_'),
                                start: 1200,
                                end: 1310
                            }
                        ]
                    },
                    {
                        id: uniqueid('cardentry_'),
                        type: 'image',
                        url: 'http://www.globalo.com/content/uploads/2015/12/darth-vader.jpg',
                        appears: [
                            {
                                id: uniqueid('time_'),
                                start: 2530,
                                end: 2560
                            }
                        ]
                    }
                ]
            },
            {
                id: uniqueid('card_'),
                type: 'card',
                card_type: 'transcript',
                item: {
                    type: 'file',
                    id: '3456'
                },
                title: 'Transcript',
                duration: 3600,
                entries: [
                    {
                        id: uniqueid('cardentry_'),
                        type: 'text',
                        text: 'Whether we have seen eye-to-eye or agreed at all, ...',
                        appears: [
                            {
                                id: uniqueid('time_'),
                                start: 20,
                                end: 30
                            }
                        ]
                    },
                    {
                        id: uniqueid('cardentry_'),
                        type: 'text',
                        text: 'those conversations are what have kept me honest, ...',
                        appears: [
                            {
                                id: uniqueid('time_'),
                                start: 2530,
                                end: 2560
                            }
                        ]
                    }
                ]
            }
        ];
        /* eslint-enable max-len */

        cache.set(key, metadata);
        successCallback(metadata);
        return Promise.resolve();
    }
}

export default Metadata;
