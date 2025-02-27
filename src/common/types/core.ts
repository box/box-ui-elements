/**
 * TypeScript definitions for core types
 */

// reflects an IE11 specific object to support drag
// and drop for file uploads
export interface DOMStringList {
    contains: (strToSearch: string) => boolean;
    item: (index: number) => string | null;
    length: number;
}

export type View =
    | 'error'
    | 'selected'
    | 'recents'
    | 'folder'
    | 'search'
    | 'upload-empty'
    | 'upload-in-progress'
    | 'upload-success'
    | 'metadata';

export type BoxItem = {
    id?: string;
    name?: string;
    type?: ItemType;
    [key: string]: unknown;
};

export type ItemType = 'file' | 'folder' | 'hubs' | 'web_link';

export type StringMap = { [key: string]: string };
export type StringAnyMap = { [key: string]: unknown };
export type Token = null | undefined | string | ((arg: unknown) => unknown);

export type Collection = {
    boxItem?: BoxItem;
    items?: Array<BoxItem>;
    name?: string;
    [key: string]: unknown;
};

export type SortBy = 'date' | 'name' | 'relevance' | 'size';
export type SortDirection = 'ASC' | 'DESC';

export type Order = {
    by: SortBy;
    direction: SortDirection;
};
