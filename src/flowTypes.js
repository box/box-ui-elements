/**
 * @flow
 * @file Flow types
 * @author Box
 */
/* eslint-disable no-use-before-define */

import API from './api';
import FolderAPI from './api/Folder';
import FileAPI from './api/File';
import WebLinkAPI from './api/WebLink';
import {
    ACCESS_OPEN,
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    VIEW_SEARCH,
    VIEW_FOLDER,
    VIEW_ERROR,
    VIEW_SELECTED,
    VIEW_UPLOAD_EMPTY,
    VIEW_UPLOAD_IN_PROGRESS,
    VIEW_UPLOAD_SUCCESS,
    SORT_ASC,
    SORT_DESC,
    SORT_NAME,
    SORT_SIZE,
    SORT_DATE,
    TYPE_FILE,
    TYPE_FOLDER,
    TYPE_WEBLINK,
    STATUS_PENDING,
    STATUS_IN_PROGRESS,
    STATUS_COMPLETE,
    STATUS_ERROR,
    DELIMITER_SLASH,
    DELIMITER_CARET,
    SIZE_SMALL,
    SIZE_LARGE,
    FIELD_NAME,
    FIELD_MODIFIED_AT,
    FIELD_SIZE
} from './constants';

export type ClassComponent<D, P, S> = Class<React$Component<D, P, S>>;
export type StringMap = { [string]: string };
export type StringAnyMap = { [string]: any };
export type ItemAPI = FolderAPI | FileAPI | WebLinkAPI;
export type Access = typeof ACCESS_COLLAB | typeof ACCESS_COMPANY | typeof ACCESS_OPEN;
export type View =
    | typeof VIEW_ERROR
    | typeof VIEW_SELECTED
    | typeof VIEW_FOLDER
    | typeof VIEW_SEARCH
    | typeof VIEW_UPLOAD_EMPTY
    | typeof VIEW_UPLOAD_IN_PROGRESS
    | typeof VIEW_UPLOAD_SUCCESS;
export type SortDirection = typeof SORT_ASC | typeof SORT_DESC;
export type SortBy = typeof SORT_NAME | typeof SORT_DATE | typeof SORT_SIZE;
export type SortableFields = typeof FIELD_NAME | typeof FIELD_MODIFIED_AT | typeof FIELD_SIZE;
export type ItemType = typeof TYPE_FILE | typeof TYPE_FOLDER | typeof TYPE_WEBLINK;
export type UploadStatus =
    | typeof STATUS_PENDING
    | typeof STATUS_IN_PROGRESS
    | typeof STATUS_COMPLETE
    | typeof STATUS_ERROR;
export type Delimiter = typeof DELIMITER_SLASH | typeof DELIMITER_CARET;
export type Size = typeof SIZE_SMALL | typeof SIZE_LARGE;

export type SharedLink = {
    url: string,
    access: Access
};

export type Order = {
    by: SortBy,
    direction: SortDirection
};

export type BoxItemPermission = {
    can_preview?: boolean,
    can_rename?: boolean,
    can_download?: boolean,
    can_delete?: boolean,
    can_upload?: boolean,
    can_share?: boolean,
    can_set_share_access?: boolean
};

export type BoxItem = {
    id?: string,
    name?: string,
    size?: number,
    type?: ItemType,
    parent?: BoxItem,
    extension?: string,
    permissions?: BoxItemPermission,
    item_collection?: BoxItemCollection,
    path_collection?: BoxPathCollection,
    modified_at?: string,
    shared_link?: SharedLink,
    allowed_shared_link_access_levels?: Access[],
    has_collaborations?: boolean,
    is_externally_owned?: boolean,
    download_url?: string,
    url?: string,
    selected?: boolean
};

export type BoxItemCollection = {
    total_count?: number,
    entries?: BoxItem[],
    order?: Order[],
    isLoaded?: boolean
};

export type FlattenedBoxItem = {
    id?: string,
    name?: string,
    size?: number,
    type?: ItemType,
    parent?: BoxItem,
    extension?: string,
    permissions?: BoxItemPermission,
    item_collection?: FlattenedBoxItemCollection,
    path_collection?: BoxPathCollection,
    modified_at?: string,
    shared_link?: SharedLink,
    allowed_shared_link_access_levels?: Access[],
    has_collaborations?: boolean,
    is_externally_owned?: boolean,
    download_url?: string,
    url?: string,
    selected?: boolean
};

export type FlattenedBoxItemCollection = {
    total_count?: number,
    entries?: string[],
    order?: Order[],
    isLoaded?: boolean
};

export type BoxPathCollection = {
    total_count: number,
    entries: Crumb[]
};

export type Collection = {
    id?: string,
    name?: string,
    permissions?: BoxItemPermission,
    breadcrumbs?: Crumb[],
    percentLoaded?: number,
    sortBy?: SortBy,
    sortDirection?: SortDirection,
    items?: BoxItem[],
    boxItem?: FlattenedBoxItem
};

export type UploadItem = {
    api: API,
    boxFile?: BoxItem,
    extension: string,
    file: File,
    name: string,
    progress: number,
    size: number,
    status: UploadStatus
};

export type ModalOptions = {
    buttonLabel: string,
    buttonClassName: string,
    modalClassName: string,
    overlayClassName: string
};

export type IconType = {
    color?: string,
    secondaryColor?: string,
    className?: string,
    width?: number,
    height?: number
};

export type Crumb = {
    id?: string,
    name: string
};
