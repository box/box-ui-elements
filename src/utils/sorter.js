/**
 * @flow
 * @file Function to sort the item list
 * @author Box
 */

import comparator from './comparator';
import { getBadItemError } from './error';
import type { Annotations, AppActivityItems, Comments, FeedItems, Tasks, ThreadedComments } from '../common/types/feed';
import type {
    SortBy,
    SortDirection,
    Order,
    FlattenedBoxItem,
    FlattenedBoxItemCollection,
    FileVersions,
} from '../common/types/core';
import type APICache from './Cache';

function isSortingNeeded(order?: Order[], sortBy: SortBy, sortDirection: SortDirection): boolean {
    return !Array.isArray(order) || !order.some(entry => entry.by === sortBy && entry.direction === sortDirection);
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
export default function sorter(
    item: FlattenedBoxItem,
    sortBy: SortBy,
    sortDirection: SortDirection,
    cache: APICache,
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
                direction: sortDirection,
            },
        ];
    }

    return item;
}

/**
 * Sort valid feed items, descending by created_at time.
 *
 * @param {Array<?Comments | ?Tasks | ?FileVersions>} args - Arguments list of each item container
 * type that is allowed in the feed.
 * @return {Array<?Comments | ?Tasks | ?FileVersions>} the sorted feed items
 */
export function sortFeedItems(
    ...args: Array<?Comments | ?ThreadedComments | ?Tasks | ?FileVersions | ?AppActivityItems | ?Annotations>
): FeedItems {
    const feedItems: FeedItems = args
        .reduce((items, itemContainer) => {
            if (itemContainer) {
                return items.concat(itemContainer.entries);
            }

            return items;
        }, [])
        .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));

    return feedItems;
}
