// @flow
import { ITEM_TYPE_FOLDER, ITEM_TYPE_FILE, ITEM_TYPE_HUBS, ITEM_TYPE_WEBLINK } from '../constants';
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
    VERSION_RETENTION_DELETE_ACTION,
    VERSION_RETENTION_REMOVE_ACTION,
    VERSION_RETENTION_INDEFINITE,
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_PREVIEW,
} from '../../constants';
import type { MetadataType } from './metadata';

type Token = null | typeof undefined | string | Function;
type TokenReadWrite = { read: string, write?: string };
type TokenLiteral = null | typeof undefined | string | TokenReadWrite;

type ClassComponent<P, S> = Class<React$Component<P, S>>;

// TODO: Investigate some better types for these different maps, perhaps make use
// of generic types like:
// type GenericMap<K, V> = {
//    [K]: V,
// }
type StringMap = { [string]: string };
type StringAnyMap = { [string]: any };
type StringMixedMap = { [string]: mixed };
type StringBooleanMap = { [string]: boolean };
type NumberBooleanMap = { [number]: boolean };

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

type Access = typeof ACCESS_COLLAB | typeof ACCESS_COMPANY | typeof ACCESS_OPEN | typeof ACCESS_NONE;

type NoticeType = 'info' | 'error';

type InlineNoticeType = NoticeType | 'warning' | 'success' | 'generic';

type NotificationType = NoticeType | 'default' | 'warn';

type ItemType = typeof ITEM_TYPE_FOLDER | typeof ITEM_TYPE_FILE | typeof ITEM_TYPE_HUBS | typeof ITEM_TYPE_WEBLINK;

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
    enterprise?: {
        id: string,
        name: string,
        type: 'enterprise',
    },
    hostname?: string,
    id: string,
    login?: string,
    name: string,
    status?: string,
    type: 'user',
};

type ContactCollection = {
    isLoaded?: boolean,
    limit?: number,
    next_marker?: string,
    offset?: number,
    order?: Array<Order>,
    previous_marker?: string,
    total_count?: number,
};

type User = UserMini;

type UserCollection = ContactCollection & {
    entries?: Array<User>,
};

type GroupMini = {
    id: string,
    name: string,
    permissions?: {
        can_invite_as_collaborator: boolean,
    },
    type: 'group',
};

type GroupCollection = ContactCollection & {
    entries?: Array<GroupMini>,
};

type ISODate = string;

type MarkerPaginatedCollection<T> = {
    entries: T[],
    limit: number,
    next_marker: ?string,
};

// Used for things like collaborator search
// NOTE: PillSelectorDropdown requires an additional "text" or "displayText" field
type SelectorItem<T: any = any> = {
    id: string,
    item?: T, // ie UserMini or GroupMini
    name: string,
    value?: any,
};

type SelectorItems<T: any = any> = Array<SelectorItem<T>>;

type Crumb = {
    id?: string,
    name: string,
};

type BoxItemClassification = {
    color: string,
    definition: string,
    name: string,
};

type BoxItemPermission = {
    can_annotate?: boolean,
    can_comment?: boolean,
    can_create_annotations?: boolean,
    can_delete?: boolean,
    can_download?: boolean,
    can_edit?: boolean,
    can_invite_collaborator?: boolean,
    can_preview?: boolean,
    can_rename?: boolean,
    can_set_share_access?: boolean,
    can_share?: boolean,
    can_upload?: boolean,
    can_view_annotations?: boolean,
    can_view_annotations_all?: boolean,
    can_view_annotations_self?: boolean,
};

type BoxItemVersionPermission = {
    can_delete?: boolean,
    can_download?: boolean,
    can_preview?: boolean,
    can_upload?: boolean,
};

type BoxItemVersionRetentionPolicy = {
    disposition_action: typeof VERSION_RETENTION_DELETE_ACTION | typeof VERSION_RETENTION_REMOVE_ACTION,
    id: string,
    policy_name: string,
    retention_length: typeof VERSION_RETENTION_INDEFINITE | string, // length in days
    type: 'retention_policy',
};

type BoxItemVersionRetention = {
    applied_at: string,
    disposition_at: string,
    id: string,
    type: 'file_version_retention',
    winning_retention_policy: BoxItemVersionRetentionPolicy,
};

type BoxItemVersion = {
    action_by?: User[],
    action_type?: string,
    authenticated_download_url?: string,
    collaborators?: Object,
    created_at: string,
    end?: Object,
    extension?: string,
    id: string,
    is_download_available?: boolean,
    modified_at?: string,
    modified_by: ?User,
    name?: string,
    permissions?: BoxItemVersionPermission,
    promoted_by?: ?User,
    restored_at?: string,
    restored_by?: ?User,
    retention?: BoxItemVersionRetention,
    sha1?: string,
    size?: number,
    start?: Object,
    trashed_at: ?string,
    trashed_by?: ?User,
    type: 'file_version',
    uploader_display_name?: string,
    version_end?: number,
    version_number: string,
    version_promoted?: string,
    version_start?: number,
    versions?: Array<BoxItemVersion>,
};

type BoxItemVersionMini = {
    id: string,
    type: 'version',
    version_number: string,
};

type BoxPathCollection = {
    entries: Array<Crumb>,
    total_count: number,
};

type FileRepresentation = {
    content?: {
        url_template: string,
    },
    info?: {
        url: string,
    },
    properties?: {
        dimensions: string,
        paged: string,
        thumb: string,
    },
    representation?: string,
    status: {
        state: ?string,
    },
};

type FileRepresentationResponse = {
    entries: Array<FileRepresentation>,
};

type SharedLink = {
    access: Access,
    download_count?: number,
    download_url?: string,
    effective_access?: Access,
    effective_permission?: typeof PERMISSION_CAN_DOWNLOAD | typeof PERMISSION_CAN_PREVIEW,
    is_password_enabled?: boolean,
    password?: string | null, // the API requires a null value to remove a password
    permissions?: BoxItemPermission,
    preview_count?: number,
    unshared_at?: string | null,
    url: string,
    vanity_name?: string,
    vanity_url?: string,
};

type SharedLinkFeatures = {
    download_url: boolean,
    password: boolean,
    vanity_name: boolean,
};

type BoxItem = {
    allowed_shared_link_access_levels?: Array<Access>,
    archive_type?: 'archive' | 'folder_archive' | 'file' | 'web_link',
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
    item_collection?: BoxItemCollection, // eslint-disable-line no-use-before-define
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
    shared_link_features?: SharedLinkFeatures,
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

type Reply = {
    created_at: string,
    created_by: User,
    id: string,
    message: string,
    parent: {
        id: string,
        type: string,
    },
    type: 'reply',
};

type Collaborators = {
    entries: Array<GroupMini | UserMini>,
    next_marker: ?string,
};

type AccessibleByUserOrGroup = {
    id: number | string,
    login: string,
    name: string,
    type: 'user' | 'group',
};

type CollaborationOptions = {
    expires_at: string | null,
    id: number | string,
    role: string,
    status?: string,
};

type Collaboration = CollaborationOptions & {
    accessible_by: AccessibleByUserOrGroup,
};

type NewCollaboration = CollaborationOptions & {
    accessible_by: $Shape<AccessibleByUserOrGroup>,
};

type Collaborations = {
    entries: Array<Collaboration>,
    next_marker: ?string,
};

// reflects an IE11 specific object to support drag
// and drop for file uploads
type DOMStringList = {
    contains: (strToSearch: string) => boolean,
    item: (index: number) => string | null,
    length: number,
};

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
    GroupMini,
    GroupCollection,
    ISODate,
    MarkerPaginatedCollection,
    SelectorItem,
    SelectorItems,
    Crumb,
    BoxItemClassification,
    BoxItemPermission,
    BoxItemVersionPermission,
    BoxItemVersionRetention,
    BoxItemVersion,
    BoxItemVersionMini,
    BoxItem,
    BoxItemCollection,
    FlattenedBoxItemCollection,
    FlattenedBoxItem,
    Collection,
    Recent,
    RecentCollection,
    FileVersions,
    FileRepresentation,
    Reply,
    NotificationType,
    Collaborators,
    Collaboration,
    Collaborations,
    NewCollaboration,
    DOMStringList,
};
