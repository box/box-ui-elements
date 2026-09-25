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

const isSortingNeeded = (order: Order[] | null | undefined, sortBy: SortBy, sortDirection: SortDirection): boolean =>
    !Array.isArray(order) || !order.some(entry => entry.by === sortBy && entry.direction === sortDirection);

/** Sorts items in place */
const sorter = (
    item: FlattenedBoxItem,
    sortBy: SortBy,
    sortDirection: SortDirection,
    cache: APICache,
): FlattenedBoxItem => {
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
};

/** Sort valid feed items, descending by created_at time. */
export const sortFeedItems = (
    ...args: Array<
        Comments | ThreadedComments | Tasks | FileVersions | AppActivityItems | Annotations | null | undefined
    >
): FeedItems => {
    const feedItems: FeedItems = args
        .reduce((items, itemContainer) => {
            if (itemContainer) {
                return items.concat(itemContainer.entries);
            }

            return items;
        }, [])
        .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));

    return feedItems;
};

export default sorter;
