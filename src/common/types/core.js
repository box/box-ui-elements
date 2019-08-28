// @flow
import { ITEM_TYPE_FOLDER, ITEM_TYPE_FILE, ITEM_TYPE_WEBLINK } from '../constants';

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

type ISODate = string;

type MarkerPaginatedCollection<T> = {
    entries: T[],
    limit: number,
    next_marker: ?string,
};

export type { InlineNoticeType, ItemType, FileMini, FolderMini, UserMini, ISODate, MarkerPaginatedCollection };
