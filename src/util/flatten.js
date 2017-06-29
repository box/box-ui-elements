/**
 * @flow
 * @file Function to flatten an item list
 * @author Box
 */

import File from '../api/File';
import Folder from '../api/Folder';
import WebLink from '../api/WebLink';
import Cache from './Cache';
import { TYPE_FOLDER, TYPE_FILE, TYPE_WEBLINK } from '../constants';
import type { BoxItem } from '../flowTypes';

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
export default function(list: BoxItem[], folderAPI: Folder, fileAPI: File, weblinkAPI: WebLink): string[] {
    const items: string[] = [];
    list.forEach((item: BoxItem) => {
        const { id, type }: BoxItem = item;
        if (!id || !type) {
            throw new Error('Invalid box item!');
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

        const cache: Cache = api.getCache();
        const key: string = api.getCacheKey(id);

        if (cache.has(key)) {
            cache.merge(key, item);
        } else {
            cache.set(key, item);
        }
        items.push(api.getCacheKey(id));
    });
    return items;
}
