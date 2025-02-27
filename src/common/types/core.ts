// This file contains TypeScript definitions converted from Flow types in core.js
import {
    DELIMITER_SLASH,
    DELIMITER_CARET,
    FIELD_DATE,
    FIELD_NAME,
    FIELD_RELEVANCE,
    FIELD_SIZE,
    SORT_ASC,
    SORT_DESC,
    VIEW_ERROR,
    VIEW_SELECTED,
    VIEW_RECENTS,
    VIEW_FOLDER,
    VIEW_SEARCH,
    VIEW_UPLOAD_EMPTY,
    VIEW_UPLOAD_IN_PROGRESS,
    VIEW_UPLOAD_SUCCESS,
    VIEW_METADATA,
    ITEM_TYPE_FOLDER,
    ITEM_TYPE_FILE,
    ITEM_TYPE_WEBLINK,
    ITEM_TYPE_HUBS,
} from '../../constants';

export type Delimiter = typeof DELIMITER_SLASH | typeof DELIMITER_CARET;

export type SortBy = typeof FIELD_DATE | typeof FIELD_NAME | typeof FIELD_RELEVANCE | typeof FIELD_SIZE;
export type SortDirection = typeof SORT_ASC | typeof SORT_DESC;
export type View =
    | typeof VIEW_ERROR
    | typeof VIEW_SELECTED
    | typeof VIEW_RECENTS
    | typeof VIEW_FOLDER
    | typeof VIEW_SEARCH
    | typeof VIEW_UPLOAD_EMPTY
    | typeof VIEW_UPLOAD_IN_PROGRESS
    | typeof VIEW_UPLOAD_SUCCESS
    | typeof VIEW_METADATA;

export type ItemType =
    | typeof ITEM_TYPE_FOLDER
    | typeof ITEM_TYPE_FILE
    | typeof ITEM_TYPE_HUBS
    | typeof ITEM_TYPE_WEBLINK;

export type StringMap = { [key: string]: string };
export type Token = null | undefined | string | ((options?: Record<string, unknown>) => string);

export interface DOMStringList {
    contains: (strToSearch: string) => boolean;
    item: (index: number) => string | null;
    length: number;
}

export interface Order {
    by: SortBy;
    direction: SortDirection;
}

export interface Collection {
    boxItem?: BoxItem;
    breadcrumbs?: Crumb[];
    id?: string;
    items?: BoxItem[];
    name?: string;
    nextMarker?: string | null;
    offset?: number;
    percentLoaded?: number;
    permissions?: BoxItemPermission;
    sortBy?: SortBy;
    sortDirection?: SortDirection;
    totalCount?: number;
}

export interface Crumb {
    id?: string;
    name: string;
}

export interface BoxPathCollection {
    entries: Crumb[];
    total_count: number;
}

export interface BoxItemPermission {
    can_annotate?: boolean;
    can_comment?: boolean;
    can_create_annotations?: boolean;
    can_delete?: boolean;
    can_download?: boolean;
    can_edit?: boolean;
    can_invite_collaborator?: boolean;
    can_preview?: boolean;
    can_rename?: boolean;
    can_set_share_access?: boolean;
    can_share?: boolean;
    can_upload?: boolean;
    can_view_annotations?: boolean;
    can_view_annotations_all?: boolean;
    can_view_annotations_self?: boolean;
}

export interface User {
    id: string;
    login: string;
    name: string;
    type: string;
}

export interface BoxItem {
    id: string;
    name?: string;
    path_collection?: BoxPathCollection;
    permissions?: BoxItemPermission;
    created_at?: string;
    created_by?: User;
    modified_at?: string;
    modified_by?: User;
    owned_by?: User;
    description?: string;
    size?: number;
    type?: string;
    extension?: string;
    url?: string;
}
