// @flow
import { ITEM_TYPE_FOLDER, ITEM_TYPE_FILE, ITEM_TYPE_WEBLINK } from '../constants';
import {
    ACCESS_OPEN,
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    VIEW_SEARCH,
    VIEW_FOLDER,
    VIEW_ERROR,
    VIEW_SELECTED,
    VIEW_RECENTS,
    VIEW_UPLOAD_EMPTY,
    VIEW_UPLOAD_IN_PROGRESS,
    VIEW_UPLOAD_SUCCESS,
    VIEW_METADATA,
    SORT_ASC,
    SORT_DESC,
    DELIMITER_SLASH,
    DELIMITER_CARET,
    SIZE_SMALL,
    SIZE_MEDIUM,
    SIZE_LARGE,
    SIZE_VERY_LARGE,
    FIELD_DATE,
    FIELD_NAME,
    FIELD_SIZE,
    FIELD_RELEVANCE,
    DEFAULT_VIEW_RECENTS,
    DEFAULT_VIEW_FILES,
} from '../../constants';

type Token = null | typeof undefined | string | Function;
type TokenReadWrite = { read: string, write?: string };
type TokenLiteral = null | typeof undefined | string | TokenReadWrite;

type ClassComponent<P, S> = Class<React$Component<P, S>>;

type StringMap = { [string]: string };
type StringAnyMap = { [string]: any };
type StringBooleanMap = { [string]: boolean };
type NumberBooleanMap = { [number]: boolean };

type Access = typeof ACCESS_COLLAB | typeof ACCESS_COMPANY | typeof ACCESS_OPEN;

type DefaultView = typeof DEFAULT_VIEW_RECENTS | typeof DEFAULT_VIEW_FILES;
type View =
    | typeof VIEW_ERROR
    | typeof VIEW_SELECTED
    | typeof VIEW_RECENTS
    | typeof VIEW_FOLDER
    | typeof VIEW_SEARCH
    | typeof VIEW_UPLOAD_EMPTY
    | typeof VIEW_UPLOAD_IN_PROGRESS
    | typeof VIEW_UPLOAD_SUCCESS
    | typeof VIEW_METADATA;

type SortBy = typeof FIELD_DATE | typeof FIELD_NAME | typeof FIELD_RELEVANCE | typeof FIELD_SIZE;
type SortDirection = typeof SORT_ASC | typeof SORT_DESC;
type Delimiter = typeof DELIMITER_SLASH | typeof DELIMITER_CARET;
type Size = typeof SIZE_SMALL | typeof SIZE_MEDIUM | typeof SIZE_LARGE | typeof SIZE_VERY_LARGE;

type Order = {
    by: SortBy,
    direction: SortDirection,
};

type SharedLink = {
    access: Access,
    url: string,
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
    Token,
    TokenLiteral,
    ClassComponent,
    StringMap,
    StringAnyMap,
    StringBooleanMap,
    NumberBooleanMap,
    Access,
    DefaultView,
    View,
    SortBy,
    SortDirection,
    Order,
    SharedLink,
    InlineNoticeType,
    ItemType,
    Delimiter,
    Size,
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
