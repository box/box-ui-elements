import type { AxiosError } from 'axios';
import type { ElementOrigin } from '../../elements/common/flowTypes';
import type { StringAnyMap, StringMap, Token } from './core';
import type APICache from '../../utils/Cache';

import { HTTP_GET, HTTP_POST, HTTP_PUT, HTTP_DELETE, HTTP_OPTIONS, HTTP_HEAD ,
    ITEM_TYPE_FOLDER,
    ITEM_TYPE_FILE,
    ITEM_TYPE_HUBS,
    ITEM_TYPE_WEBLINK,
    ACCESS_OPEN,
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    ACCESS_NONE,
} from '../../constants';
import { JSON_PATCH_OP_ADD, JSON_PATCH_OP_REMOVE, JSON_PATCH_OP_REPLACE, JSON_PATCH_OP_TEST } from '../constants';

export type ItemType =
    | typeof ITEM_TYPE_FOLDER
    | typeof ITEM_TYPE_FILE
    | typeof ITEM_TYPE_HUBS
    | typeof ITEM_TYPE_WEBLINK;
export type Access = typeof ACCESS_COLLAB | typeof ACCESS_COMPANY | typeof ACCESS_OPEN | typeof ACCESS_NONE;

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

export interface BoxItemVersionPermission {
    can_delete?: boolean;
    can_download?: boolean;
    can_preview?: boolean;
    can_upload?: boolean;
}

export interface BoxItemVersion {
    action_by?: User[];
    action_type?: string;
    authenticated_download_url?: string;
    collaborators?: Record<string, unknown>;
    created_at: string;
    id: string;
    modified_at?: string;
    modified_by: User | null;
    name?: string;
    permissions?: BoxItemVersionPermission;
    size?: number;
    trashed_at: string | null;
    trashed_by?: User | null;
    type: 'file_version';
    version_number: string;
}

export interface SharedLinkFeatures {
    download_url: boolean;
    password: boolean;
    vanity_name: boolean;
}

export interface SharedLink {
    access: Access;
    download_count?: number;
    download_url?: string;
    effective_access?: Access;
    effective_permission?: string;
    is_password_enabled?: boolean;
    password?: string | null;
    permissions?: BoxItemPermission;
    preview_count?: number;
    unshared_at?: string | null;
    url: string;
    vanity_name?: string;
    vanity_url?: string;
}

export interface BoxPathCollection {
    entries: Array<{
        id?: string;
        name: string;
    }>;
    total_count: number;
}

export interface BoxItemCollection {
    entries?: Array<BoxItem>;
    isLoaded?: boolean;
    limit?: number;
    next_marker?: string;
    offset?: number;
    order?: Array<{
        by: string;
        direction: string;
    }>;
    previous_marker?: string;
    total_count?: number;
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

// Using Record<string, unknown> for MetadataType as it's a complex type that needs investigation
export type MetadataType = Record<string, unknown>;

export type Method =
    | typeof HTTP_DELETE
    | typeof HTTP_GET
    | typeof HTTP_POST
    | typeof HTTP_OPTIONS
    | typeof HTTP_HEAD
    | typeof HTTP_PUT;

export interface JSONPatch {
    op:
        | typeof JSON_PATCH_OP_ADD
        | typeof JSON_PATCH_OP_REMOVE
        | typeof JSON_PATCH_OP_REPLACE
        | typeof JSON_PATCH_OP_TEST;
    path: string;
    value?: unknown;
}

export type JSONPatchOperations = Array<JSONPatch>;

export interface RequestOptions {
    fields?: Array<string>;
    forceFetch?: boolean;
    noPagination?: boolean;
    refreshCache?: boolean;
}

export type PayloadType = StringAnyMap | Array<StringAnyMap>;

export interface RequestData {
    data: PayloadType;
    headers?: StringMap;
    id?: string;
    params?: StringAnyMap;
    url: string;
}

export interface ErrorResponseData {
    code: string;
    context_info: Record<string, unknown>;
    help_url: string;
    message: string;
    request_id: string;
    status: number;
    type: 'error';
}

export type ElementsXhrError = AxiosError | ErrorResponseData;

export interface ElementsError {
    code: string;
    context_info: Record<string, unknown>;
    message: string;
    origin: ElementOrigin;
    type: 'error';
}

export interface ErrorContextProps {
    onError: (
        error: ElementsXhrError | Error,
        code: string,
        contextInfo?: Record<string, unknown>,
        origin?: ElementOrigin,
    ) => void;
}

export type ElementsErrorCallback = (e: ElementsXhrError, code: string, contextInfo?: Record<string, unknown>) => void;

export interface ElementsSuccess {
    code: string;
    showNotification: boolean;
}

export interface APIOptions {
    apiHost?: string;
    cache?: APICache;
    clientName?: string;
    consoleError?: boolean;
    consoleLog?: boolean;
    id?: string;
    language?: string;
    requestInterceptor?: Function;
    responseInterceptor?: Function;
    retryableStatusCodes?: Array<number>;
    sharedLink?: string;
    sharedLinkPassword?: string;
    shouldRetry?: boolean;
    token: Token;
    uploadHost?: string;
    version?: string;
}

// Logging types
export interface ElementsLoadMetricData {
    endMarkName: string;
    startMarkName?: string;
}

export interface LoggerProps {
    onPreviewMetric: (data: Record<string, unknown>) => void;
    onReadyMetric: (data: ElementsLoadMetricData) => void;
}

export interface WithLoggerProps {
    logger: LoggerProps;
}

// Core types
export type { Token, StringMap, StringAnyMap };

export interface FeatureOptions {
    [key: string]: unknown;
}

export interface FeatureConfig {
    [key: string]: FeatureOptions;
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

export interface BoxItem {
    id: string;
    name?: string;
    type?: ItemType;
    permissions?: BoxItemPermission;
    description?: string;
    created_at?: string;
    created_by?: User;
    modified_at?: string;
    modified_by?: User;
    owned_by?: User;
    shared_link?: SharedLink;
    parent?: BoxItem;
    size?: number;
    extension?: string;
    version_number?: string;
    file_version?: BoxItemVersion;
    item_collection?: BoxItemCollection;
    path_collection?: BoxPathCollection;
    interacted_at?: string;
    content_created_at?: string;
    content_modified_at?: string;
    download_url?: string;
    url?: string;
    is_externally_owned?: boolean;
    has_collaborations?: boolean;
    is_download_available?: boolean;
    authenticated_download_url?: string;
    representations?: FileRepresentationResponse;
    restored_from?: BoxItemVersion;
    selected?: boolean;
    metadata?: MetadataType;
    version_limit?: number | null;
    allowed_shared_link_access_levels?: Array<Access>;
    shared_link_features?: SharedLinkFeatures;
    thumbnailUrl?: string | null;
    archive_type?: 'archive' | 'folder_archive' | 'file' | 'web_link';
    bannerPolicy?: {
        body: string;
        colorID?: number;
        title?: string;
    };
    canUserSeeClassification?: boolean;
    classification?: string;
    grantedPermissions?: {
        itemShare: boolean;
    };
    hideCollaborators?: boolean;
    ownerEmail?: string;
    ownerID?: string;
    typedID?: string;
    uploader_display_name?: string;
}
