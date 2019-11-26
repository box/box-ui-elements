// @flow
import { ITEM_TYPE_FOLDER, ITEM_TYPE_FILE, ITEM_TYPE_WEBLINK } from '../constants';

type Order = {
    by: SortBy,
    direction: SortDirection,
};

type InlineNoticeType = 'warning' | 'error' | 'success' | 'info' | 'generic';

type ItemType = typeof ITEM_TYPE_FOLDER | typeof ITEM_TYPE_FILE | typeof ITEM_TYPE_WEBLINK;

type FileMini = {
    id: string,
    name: string,
    type: typeof ITEM_TYPE_FILE,
};

type FolderMini = {
    id: string,
    name: string,
    type: typeof ITEM_TYPE_FOLDER,
};

type UserMini = {
    avatar_url?: string,
    email?: string,
    id: string,
    login?: string,
    name: string,
    type: 'user',
};

type User = {
    avatar_url?: string,
    email?: string,
    id: string,
    login?: string,
    name: string,
    type: 'user',
};

type UserCollection = {
    entries?: Array<User>,
    isLoaded?: boolean,
    limit?: number,
    next_marker?: string,
    offset?: number,
    order?: Array<Order>,
    previous_marker?: string,
    total_count?: number,
};

type ISODate = string;

type MarkerPaginatedCollection<T> = {
    entries: T[],
    limit: number,
    next_marker: ?string,
};

type SelectorItem = {
    id: string,
    item: Object,
    name: string,
    value?: any,
};

type SelectorItems = Array<SelectorItem>;

export type {
    Order,
    InlineNoticeType,
    ItemType,
    FileMini,
    FolderMini,
    UserMini,
    User,
    UserCollection,
    ISODate,
    MarkerPaginatedCollection,
    SelectorItem,
    SelectorItems,
};
