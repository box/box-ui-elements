// Converted from core.js Flow types to TypeScript interfaces

// Import constants for type definitions
import {
    VIEW_ERROR,
    VIEW_FOLDER,
    VIEW_METADATA,
    VIEW_RECENTS,
    VIEW_SEARCH,
    VIEW_SELECTED,
    VIEW_UPLOAD_EMPTY,
    VIEW_UPLOAD_IN_PROGRESS,
    VIEW_UPLOAD_SUCCESS,
    FIELD_DATE,
    FIELD_NAME,
    FIELD_RELEVANCE,
    FIELD_SIZE,
    SORT_ASC,
    SORT_DESC,
    ITEM_TYPE_FOLDER,
    ITEM_TYPE_FILE,
    ITEM_TYPE_WEBLINK,
    ITEM_TYPE_HUBS,
    ACCESS_NONE,
    ACCESS_OPEN,
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_PREVIEW,
    VERSION_RETENTION_DELETE_ACTION,
    VERSION_RETENTION_REMOVE_ACTION,
    VERSION_RETENTION_INDEFINITE,
} from '../../constants';

// Basic type definitions
type StringMap = { [key: string]: string };
type StringAnyMap = { [key: string]: unknown }; // Changed from any to unknown
type StringMixedMap = { [key: string]: unknown };
type StringBooleanMap = { [key: string]: boolean };
type NumberBooleanMap = { [key: number]: boolean };

// View and related types
export type View =
    | typeof VIEW_ERROR
    | typeof VIEW_FOLDER
    | typeof VIEW_METADATA
    | typeof VIEW_RECENTS
    | typeof VIEW_SEARCH
    | typeof VIEW_SELECTED
    | typeof VIEW_UPLOAD_EMPTY
    | typeof VIEW_UPLOAD_IN_PROGRESS
    | typeof VIEW_UPLOAD_SUCCESS;

export type SortBy = typeof FIELD_DATE | typeof FIELD_NAME | typeof FIELD_RELEVANCE | typeof FIELD_SIZE;
export type SortDirection = typeof SORT_ASC | typeof SORT_DESC;

// Token can be null, undefined, string or function
export type Token = null | undefined | string | (() => void);

// DOM types
export interface DOMStringList {
    contains: (strToSearch: string) => boolean;
    item: (index: number) => string | null;
    length: number;
}

export interface BoxItemClassification {
    name: string;
    definition?: string;
    color?: string;
}

export interface BoxItemPermission {
    can_download?: boolean;
    can_preview?: boolean;
    can_upload?: boolean;
    can_rename?: boolean;
    can_delete?: boolean;
    can_share?: boolean;
    can_invite_collaborator?: boolean;
    can_set_share_access?: boolean;
    can_comment?: boolean;
    can_annotate?: boolean;
    can_create_annotations?: boolean;
    can_view_annotations?: boolean;
    can_view_annotations_all?: boolean;
    can_view_annotations_self?: boolean;
}

export interface BoxItemVersionPermission {
    can_delete?: boolean;
    can_download?: boolean;
    can_preview?: boolean;
    can_upload?: boolean;
}

export interface BoxItemVersionRetentionPolicy {
    disposition_action: typeof VERSION_RETENTION_DELETE_ACTION | typeof VERSION_RETENTION_REMOVE_ACTION;
    id: string;
    policy_name: string;
    retention_length: typeof VERSION_RETENTION_INDEFINITE | string;
    type: 'retention_policy';
}

export interface BoxItemVersionRetention {
    applied_at: string;
    disposition_at: string;
    id: string;
    type: 'file_version_retention';
    winning_retention_policy: BoxItemVersionRetentionPolicy;
}

export interface User {
    avatar_url?: string;
    email?: string;
    enterprise?: {
        id: string;
        name: string;
        type: 'enterprise';
    };
    hostname?: string;
    id: string;
    login?: string;
    name: string;
    status?: string;
    type: 'user';
}

export interface BoxItemVersion {
    action_by?: User[];
    action_type?: string;
    authenticated_download_url?: string;
    collaborators?: Record<string, unknown>;
    created_at: string;
    extension?: string;
    id: string;
    is_download_available?: boolean;
    modified_at?: string;
    modified_by: User | null;
    name?: string;
    permissions?: BoxItemVersionPermission;
    promoted_by?: User | null;
    restored_at?: string;
    restored_by?: User | null;
    retention?: BoxItemVersionRetention;
    sha1?: string;
    size?: number;
    trashed_at: string | null;
    trashed_by?: User | null;
    type: 'file_version';
    uploader_display_name?: string;
    version_number: string;
    version_promoted?: string;
    versions?: BoxItemVersion[];
}

export interface FileRepresentation {
    content?: {
        url_template: string;
    };
    info?: {
        url: string;
    };
    properties?: {
        dimensions: string;
        paged: string;
        thumb: string;
    };
    representation?: string;
    status: {
        state: string | null;
    };
}

export interface FileRepresentationResponse {
    entries: Array<FileRepresentation>;
}

export interface BoxItem {
    id: string;
    name?: string;
    size?: number;
    type?: ItemType;
    parent?: BoxItem;
    extension?: string;
    description?: string;
    permissions?: BoxItemPermission;
    item_collection?: BoxItemCollection;
    path_collection?: BoxPathCollection;
    interacted_at?: string;
    modified_at?: string;
    created_at?: string;
    selected?: boolean;
    metadata?: StringAnyMap;
    enterprise_name?: string;
    is_externally_owned?: boolean;
    created_by?: User;
    modified_by?: User;
    owned_by?: User;
    shared_link?: SharedLink;
    file_version?: BoxItemVersion;
    authenticated_download_url?: string;
    is_download_available?: boolean;
    version_number?: string;
    thumbnailUrl?: string | null;
    has_collaborations?: boolean;
    archive_type?: 'archive' | 'folder_archive' | 'file' | 'web_link';
    representations?: FileRepresentationResponse;
}

export interface BoxItemCollection {
    total_count?: number;
    entries?: BoxItem[];
    order?: BoxItemOrder[];
    isLoaded?: boolean;
    limit?: number;
    offset?: number;
    next_marker?: string;
    previous_marker?: string;
}

export interface SharedLink {
    access: typeof ACCESS_NONE | typeof ACCESS_OPEN | typeof ACCESS_COLLAB | typeof ACCESS_COMPANY;
    download_count?: number;
    download_url?: string;
    effective_access?: typeof ACCESS_NONE | typeof ACCESS_OPEN | typeof ACCESS_COLLAB | typeof ACCESS_COMPANY;
    effective_permission?: typeof PERMISSION_CAN_DOWNLOAD | typeof PERMISSION_CAN_PREVIEW;
    is_password_enabled?: boolean;
    password?: string | null;
    permissions?: BoxItemPermission;
    preview_count?: number;
    unshared_at?: string | null;
    url: string;
    vanity_name?: string;
    vanity_url?: string;
}

export interface Collection {
    id?: string;
    name?: string;
    permissions?: BoxItemPermission;
    item_collection?: BoxItemCollection;
    path_collection?: BoxPathCollection;
    type?: string;
    boxItem?: BoxItem;
    breadcrumbs?: Array<Crumb>;
    items?: Array<BoxItem>;
    nextMarker?: string | null;
    offset?: number;
    percentLoaded?: number;
    sortBy?: string;
    sortDirection?: string;
    totalCount?: number;
}

export interface BoxPathCollection {
    total_count: number;
    entries: BoxItem[];
}

export interface BoxItemOrder {
    by: string;
    direction: string;
}

export interface Crumb {
    id?: string;
    name: string;
}

// Export ItemType
export type ItemType =
    | typeof ITEM_TYPE_FOLDER
    | typeof ITEM_TYPE_FILE
    | typeof ITEM_TYPE_WEBLINK
    | typeof ITEM_TYPE_HUBS;

// Export utility types
export type { StringMap, StringAnyMap, StringMixedMap, StringBooleanMap, NumberBooleanMap };
