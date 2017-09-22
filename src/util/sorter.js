/**
 * @flow
 * @file Function to sort the item list
 * @author Box
 */

import comparator from './comparator';
import getBadItemError from './error';
import type { FlattenedBoxItem, Order, FlattenedBoxItemCollection, SortBy, SortDirection } from '../flowTypes';
import type Cache from './Cache';

function isSortingNeeded(order?: Order[], sortBy: SortBy, sortDirection: SortDirection): boolean {
    return !Array.isArray(order) || !order.some((entry) => entry.by === sortBy && entry.direction === sortDirection);
}

/**
 * Sorts items in place
 *
 * @param {Object} item box item object
 * @param {string} sortBy sort by field
 * @param {string} sortDirection the sort direction
 * @param {Cache} cache item cache
 * @return {void}
 */
export default function(
    item: FlattenedBoxItem,
    sortBy: SortBy,
    sortDirection: SortDirection,
    cache: Cache
): FlattenedBoxItem {
    const { item_collection }: FlattenedBoxItem = item;
    if (!item_collection) {
        throw getBadItemError();
    }

    const { entries, order }: FlattenedBoxItemCollection = item_collection;
    if (!Array.isArray(entries)) {
        throw getBadItemError();
    }

    if (isSortingNeeded(order, sortBy, sortDirection)) {
        entries.sort(comparator(sortBy, sortDirection, cache));
        item_collection.order = [
            {
                by: sortBy,
                direction: sortDirection
            }
        ];
    }
    return item;
}
