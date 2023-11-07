/**
 * @flow
 * @file Function to sort item list
 * @author Box
 */

import {
    TYPE_FILE,
    TYPE_FOLDER,
    SORT_DESC,
    FIELD_MODIFIED_AT,
    FIELD_INTERACTED_AT,
    FIELD_NAME,
    FIELD_SIZE,
} from '../constants';
import type { SortBy, SortDirection, ItemType, BoxItem } from '../common/types/core';
import type APICache from './Cache';

/**
 * Comparator function for sorting files and folders
 *
 * @param {string} sortBy field to sort by
 * @param {string} sortDirection desc or asc
 * @return {Function} comparator function
 */
export default function comparator(sortBy: SortBy, sortDirection: SortDirection, cache: APICache): Function {
    const invert: number = sortDirection === SORT_DESC ? 1 : -1;
    return (a: string, b: string): number => {
        const itemA: BoxItem = cache.get(a);
        const itemB: BoxItem = cache.get(b);

        const itemAType: ItemType = itemA.type || TYPE_FILE;
        const itemBType: ItemType = itemB.type || TYPE_FILE;
        const itemAName: string = itemA.name || '';
        const itemBName: string = itemB.name || '';
        const itemADate: number = Date.parse(itemA.modified_at || '0');
        const itemBDate: number = Date.parse(itemB.modified_at || '0');
        const itemAInteractedDate: number = Date.parse(itemA.interacted_at || itemA.modified_at || '0');
        const itemBInteractedDate: number = Date.parse(itemB.interacted_at || itemB.modified_at || '0');
        const itemASize: number = itemA.size || 0;
        const itemBSize: number = itemB.size || 0;

        // If a and b are of the same type, then use sortBy
        if (itemAType === itemBType) {
            if (sortBy === FIELD_NAME) {
                if (itemAName.toLowerCase() > itemBName.toLowerCase()) return -1 * invert;
                if (itemAName.toLowerCase() < itemBName.toLowerCase()) return 1 * invert;
            } else if (sortBy === FIELD_MODIFIED_AT) {
                if (itemADate > itemBDate) return -1 * invert;
                if (itemADate < itemBDate) return 1 * invert;
            } else if (sortBy === FIELD_INTERACTED_AT) {
                if (itemAInteractedDate > itemBInteractedDate) return -1 * invert;
                if (itemAInteractedDate < itemBInteractedDate) return 1 * invert;
            } else if (sortBy === FIELD_SIZE) {
                if (itemASize > itemBSize) return -1 * invert;
                if (itemASize < itemBSize) return 1 * invert;
            } else {
                // Should never reach here
                throw new Error('Unsupported sort field!');
            }

            return 0;
        }

        // If a and b are of different types, then use type to sort
        // Folder > File > WebLink
        if (itemAType === TYPE_FOLDER) return -1;
        if (itemBType === TYPE_FOLDER) return 1;
        if (itemAType === TYPE_FILE) return -1;
        if (itemBType === TYPE_FILE) return 1;

        // Should never reach here
        throw new Error('Error in sort comparator!');
    };
}
