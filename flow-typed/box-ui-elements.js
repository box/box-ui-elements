/**
 * @flow
 * @file Flow types
 * @author Box
 */
/* eslint-disable no-use-before-define, no-unused-vars */
// NOTE: all of these imports resolve to `any`
// see https://github.com/facebook/flow/issues/7574
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor, InjectIntlProvidedProps } from 'react-intl';
import type { $AxiosXHR, $AxiosError, Axios, CancelTokenSource } from 'axios';
import type FolderAPI from '../src/api/Folder';
import type FileAPI from '../src/api/File';
import type WebLinkAPI from '../src/api/WebLink';
import type MultiputUploadAPI from '../src/api/uploads/MultiputUpload';
import type PlainUploadAPI from '../src/api/uploads/PlainUpload';
import type APICache from '../src/utils/Cache';
import type { ContentSidebarProps } from '../src/elements/content-sidebar';
import type { ContentOpenWithProps } from '../src/elements/content-open-with';
import type { ContentPreviewProps } from '../src/elements/content-preview';
import type { FeatureConfig } from '../src/elements/common/feature-checking';
import type { User, Order } from '../src/common/types/core';
import type { MetadataType } from '../src/common/types/metadata';
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
    SORT_ASC,
    SORT_DESC,
    TYPE_FILE,
    TYPE_FOLDER,
    TYPE_WEBLINK,
    DELIMITER_SLASH,
    DELIMITER_CARET,
    SIZE_SMALL,
    SIZE_LARGE,
    FIELD_DATE,
    FIELD_NAME,
    FIELD_SIZE,
    FIELD_RELEVANCE,
    DEFAULT_VIEW_RECENTS,
    DEFAULT_VIEW_FILES,
    SIZE_MEDIUM,
    HTTP_GET,
    HTTP_POST,
    HTTP_PUT,
    HTTP_DELETE,
    HTTP_OPTIONS,
    HTTP_HEAD,
    VERSION_RETENTION_DELETE_ACTION,
    VERSION_RETENTION_REMOVE_ACTION,
    VERSION_RETENTION_INDEFINITE,
} from '../src/constants';

import {
    JSON_PATCH_OP_ADD,
    JSON_PATCH_OP_REMOVE,
    JSON_PATCH_OP_REPLACE,
    JSON_PATCH_OP_TEST,
} from '../src/features/metadata-instance-editor/constants';

type Method =
    | typeof HTTP_DELETE
    | typeof HTTP_GET
    | typeof HTTP_POST
    | typeof HTTP_OPTIONS
    | typeof HTTP_HEAD
    | typeof HTTP_PUT;
type Token = null | typeof undefined | string | Function;
type TokenReadWrite = { read: string, write?: string };
type TokenLiteral = null | typeof undefined | string | TokenReadWrite;
type ClassComponent<P, S> = Class<React$Component<P, S>>;
type StringMap = { [string]: string };
type StringAnyMap = { [string]: any };
type StringBooleanMap = { [string]: boolean };
type NumberBooleanMap = { [number]: boolean };
type ItemAPI = FolderAPI | FileAPI | WebLinkAPI;
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
    | typeof VIEW_UPLOAD_SUCCESS;
type SortBy = typeof FIELD_DATE | typeof FIELD_NAME | typeof FIELD_RELEVANCE | typeof FIELD_SIZE;
type SortDirection = typeof SORT_ASC | typeof SORT_DESC;
type ItemType = typeof TYPE_FILE | typeof TYPE_FOLDER | typeof TYPE_WEBLINK;
type Delimiter = typeof DELIMITER_SLASH | typeof DELIMITER_CARET;
type Size = typeof SIZE_SMALL | typeof SIZE_LARGE | typeof SIZE_MEDIUM;

type SharedLink = {
    access: Access,
    url: string,
};

type BoxItemPermission = {
    can_comment?: boolean,
    can_delete?: boolean,
    can_download?: boolean,
    can_edit?: boolean,
    can_preview?: boolean,
    can_rename?: boolean,
    can_set_share_access?: boolean,
    can_share?: boolean,
    can_upload?: boolean,
};

type BoxItemVersionPermission = {
    can_delete?: boolean,
    can_download?: boolean,
    can_preview?: boolean,
    can_upload?: boolean,
};

type BoxItemVersionRetention = {
    applied_at: string,
    disposition_at: string,
    id: string,
    type: 'file_version_retention',
    winning_retention_policy: BoxItemVersionRetentionPolicy,
};

type BoxItemVersionRetentionPolicy = {
    disposition_action: typeof VERSION_RETENTION_DELETE_ACTION | typeof VERSION_RETENTION_REMOVE_ACTION,
    id: string,
    policy_name: string,
    retention_length: typeof VERSION_RETENTION_INDEFINITE | string, // length in days
    type: 'retention_policy',
};

type ActionItemError = {
    action?: {
        onAction: Function,
        text: MessageDescriptor,
    },
    message: MessageDescriptor,
    title: MessageDescriptor,
};

type OptionItem = {
    text: string,
    value: number | string,
};

type OptionItems = Array<OptionItem>;

type JSONPatch = {
    op:
        | typeof JSON_PATCH_OP_ADD
        | typeof JSON_PATCH_OP_REMOVE
        | typeof JSON_PATCH_OP_REPLACE
        | typeof JSON_PATCH_OP_TEST,
    path: string,
    value?: any,
};

type JSONPatchOperations = Array<JSONPatch>;

type BoxItemVersion = {
    authenticated_download_url?: string,
    collaborators?: Object,
    created_at: string,
    extension?: string,
    id: string,
    is_download_available?: boolean,
    modified_at?: string,
    modified_by: ?User,
    name?: string,
    permissions?: BoxItemVersionPermission,
    restored_at?: string,
    restored_by?: ?User,
    retention?: BoxItemVersionRetention,
    sha1?: string,
    size?: number,
    trashed_at: ?string,
    trashed_by?: ?User,
    type: 'file_version',
    version_end?: number,
    version_number: string,
    version_promoted?: string,
    version_start?: number,
    versions?: Array<BoxItemVersion>,
};

type BoxItem = {
    allowed_shared_link_access_levels?: Array<Access>,
    authenticated_download_url?: string,
    content_created_at?: string,
    content_modified_at?: string,
    created_at?: string,
    created_by?: User,
    description?: string,
    download_url?: string,
    extension?: string,
    file_version?: BoxItemVersion,
    has_collaborations?: boolean,
    id: string,
    interacted_at?: string,
    is_download_available?: boolean,
    is_externally_owned?: boolean,
    item_collection?: BoxItemCollection,
    metadata?: MetadataType,
    modified_at?: string,
    modified_by?: User,
    name?: string,
    owned_by?: User,
    parent?: BoxItem,
    path_collection?: BoxPathCollection,
    permissions?: BoxItemPermission,
    representations?: FileRepresentationResponse,
    restored_from?: BoxItemVersion,
    selected?: boolean,
    shared_link?: SharedLink,
    size?: number,
    thumbnailUrl?: ?string,
    type?: ItemType,
    url?: string,
    version_limit?: ?number,
    version_number?: string,
};

type BoxItemCollection = {
    entries?: Array<BoxItem>,
    isLoaded?: boolean,
    limit?: number,
    next_marker?: string,
    offset?: number,
    order?: Array<Order>,
    previous_marker?: string,
    total_count?: number,
};

type FlattenedBoxItem = {
    allowed_shared_link_access_levels?: Array<Access>,
    created_at?: string,
    created_by?: User,
    description?: string,
    download_url?: string,
    extension?: string,
    file_version?: BoxItemVersion,
    has_collaborations?: boolean,
    id?: string,
    interacted_at?: string,
    is_externally_owned?: boolean,
    item_collection?: FlattenedBoxItemCollection,
    metadata?: MetadataType,
    modified_at?: string,
    modified_by?: User,
    name?: string,
    owned_by?: User,
    parent?: BoxItem,
    path_collection?: BoxPathCollection,
    permissions?: BoxItemPermission,
    selected?: boolean,
    shared_link?: SharedLink,
    size?: number,
    type?: ItemType,
    url?: string,
};

type FlattenedBoxItemCollection = {
    entries?: Array<string>,
    isLoaded?: boolean,
    limit?: number,
    next_marker?: string,
    offset?: number,
    order?: Array<Order>,
    previous_marker?: string,
    total_count?: number,
};

type BoxPathCollection = {
    entries: Array<Crumb>,
    total_count: number,
};

type Collection = {
    boxItem?: FlattenedBoxItem,
    breadcrumbs?: Array<Crumb>,
    id?: string,
    items?: Array<BoxItem>,
    name?: string,
    nextMarker?: ?string,
    offset?: number,
    percentLoaded?: number,
    permissions?: BoxItemPermission,
    sortBy?: SortBy,
    sortDirection?: SortDirection,
    totalCount?: number,
};

type FileRepresentationResponse = {
    entries: Array<FileRepresentation>,
};

type FileRepresentation = {
    content?: {
        url_template: string,
    },
    properties?: {
        dimensions: string,
        paged: string,
        thumb: string,
    },
    representation?: string,
    status: {
        state: string,
    },
};

type ModalOptions = {
    buttonClassName: string,
    buttonLabel: string,
    modalClassName: string,
    overlayClassName: string,
};

type IconType = {
    className?: string,
    color?: string,
    height?: number,
    secondaryColor?: string,
    width?: number,
};

type Crumb = {
    id?: string,
    name: string,
};

type Options = {
    apiHost?: string,
    cache?: APICache,
    clientName?: string,
    consoleError?: boolean,
    consoleLog?: boolean,
    id?: string,
    language?: string,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    retryableStatusCodes?: Array<number>,
    sharedLink?: string,
    sharedLinkPassword?: string,
    shouldRetry?: boolean,
    token: Token,
    uploadHost?: string,
    version?: string,
};

type Recent = {
    interacted_at: string,
    item: BoxItem,
};

type RecentCollection = {
    entries: Array<Recent>,
    order: Order,
};

type FileVersions = {
    entries: Array<BoxItemVersion>,
    total_count: number,
};

type MaskError = {
    errorHeader: MessageDescriptor,
    errorSubHeader?: MessageDescriptor,
};

type InlineError = {
    content: MessageDescriptor,
    title: MessageDescriptor,
};

type Errors = {
    error?: MessageDescriptor,
    inlineError?: InlineError,
    maskError?: MaskError,
};

type FileAccessStats = {
    comment_count?: number,
    download_count?: number,
    edit_count?: number,
    has_count_overflowed: boolean,
    preview_count?: number,
};
