import {
    ACCESS_OPEN,
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    ACCESS_NONE,
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
import { ITEM_TYPE_FOLDER, ITEM_TYPE_FILE, ITEM_TYPE_HUBS, ITEM_TYPE_WEBLINK } from '../constants';

type Token = null | undefined | string | Function;
type TokenReadWrite = { read: string; write?: string };
type TokenLiteral = null | undefined | string | TokenReadWrite;

type ClassComponent<P, S> = new (props: P, context?: unknown) => React.Component<P, S>;

type StringMap = { [key: string]: string };
type StringAnyMap = { [key: string]: unknown };
type StringMixedMap = { [key: string]: unknown };
type StringBooleanMap = { [key: string]: boolean };
type NumberBooleanMap = { [key: number]: boolean };

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

interface Order {
    by: SortBy;
    direction: SortDirection;
}

type Access = typeof ACCESS_COLLAB | typeof ACCESS_COMPANY | typeof ACCESS_OPEN | typeof ACCESS_NONE;

type NoticeType = 'info' | 'error';

type InlineNoticeType = NoticeType | 'warning' | 'success' | 'generic';

type NotificationType = NoticeType | 'default' | 'warn';

type ItemType = typeof ITEM_TYPE_FOLDER | typeof ITEM_TYPE_FILE | typeof ITEM_TYPE_HUBS | typeof ITEM_TYPE_WEBLINK;

interface Crumb {
    id?: string;
    name: string;
}

interface Collection {
    id: string;
    name?: string;
    breadcrumbs?: Crumb[];
    sortBy?: SortBy;
    sortDirection?: SortDirection;
    items?: { id: string; [key: string]: unknown }[];
}

export type {
    Token,
    TokenLiteral,
    ClassComponent,
    StringMap,
    StringAnyMap,
    StringMixedMap,
    StringBooleanMap,
    NumberBooleanMap,
    Access,
    DefaultView,
    View,
    SortBy,
    SortDirection,
    Order,
    InlineNoticeType,
    ItemType,
    Delimiter,
    Size,
    NotificationType,
    Collection,
    Crumb,
};
