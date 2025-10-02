/**
 * @flow
 * @file Function to flatten an item list
 * @author Box
 */

import { getBadItemError } from './error';
import { TYPE_FOLDER, TYPE_FILE, TYPE_WEBLINK } from '../constants';
import type { BoxItem } from '../common/types/core';
import type APICache from './Cache';

/**
 * Takes an item list and flattens it by moving
 * all item entries into the cache and replacing the list
 * entries with references to those items in the cache.
 * Web links are trated as files.
 *
 * @param {Array} list to flatten
 * @param {Folder} folderAPI api for files
 * @param {File} fileAPI api for files
 * @param {WebLink} weblinkAPI api for web links
 * @return {Array} list with items replaced with reference keys
 */
export default function flatten(
    list: BoxItem[],
    folderAPI: FolderAPI,
    fileAPI: FileAPI,
    weblinkAPI: WebLinkAPI,
): string[] {
    const items: string[] = [];
    list.forEach((item: BoxItem) => {
        const { id, type }: BoxItem = item;
        if (!id || !type) {
            throw getBadItemError();
        }

        let api;
        switch (type) {
            case TYPE_FOLDER:
                api = folderAPI;
                break;
            case TYPE_FILE:
                api = fileAPI;
                break;
            case TYPE_WEBLINK:
                api = weblinkAPI;
                break;
            default:
                throw new Error('Unknown Type!');
        }

        const cache: APICache = api.getCache();
        const key: string = api.getCacheKey(id);

        if (cache.has(key)) {
            cache.merge(key, item);
        } else {
            cache.set(key, item);
        }

        items.push(key);
    });
    return items;
}
