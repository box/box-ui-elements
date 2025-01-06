import {
    ITEM_TYPE_FOLDER,
    ITEM_TYPE_FILE,
    ITEM_TYPE_HUBS,
    ITEM_TYPE_WEBLINK,
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
    FIELD_DATE,
    FIELD_NAME,
    FIELD_SIZE,
    FIELD_RELEVANCE,
    DEFAULT_VIEW_RECENTS,
    DEFAULT_VIEW_FILES,
    SORT_ASC,
    SORT_DESC,
    PERMISSION_CAN_DOWNLOAD,
    PERMISSION_CAN_PREVIEW,
} from '../constants';

export type StringMap = { [key: string]: string };
export type StringAnyMap = { [key: string]: unknown };
export type StringMixedMap = { [key: string]: unknown };
export type StringBooleanMap = { [key: string]: boolean };
export type NumberBooleanMap = { [key: number]: boolean };

export type Token = null | undefined | string | Function;
export type TokenReadWrite = { read: string; write?: string };
export type TokenLiteral = null | undefined | string | TokenReadWrite;

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

export type DefaultView = typeof DEFAULT_VIEW_RECENTS | typeof DEFAULT_VIEW_FILES;

export type SortBy = typeof FIELD_DATE | typeof FIELD_NAME | typeof FIELD_RELEVANCE | typeof FIELD_SIZE;
export type SortDirection = typeof SORT_ASC | typeof SORT_DESC;

export type Order = {
    by: SortBy;
    direction: SortDirection;
};

export type Access = typeof ACCESS_COLLAB | typeof ACCESS_COMPANY | typeof ACCESS_OPEN | typeof ACCESS_NONE;

export type ItemType =
    | typeof ITEM_TYPE_FOLDER
    | typeof ITEM_TYPE_FILE
    | typeof ITEM_TYPE_HUBS
    | typeof ITEM_TYPE_WEBLINK;

export type BoxItem = {
    allowed_shared_link_access_levels?: Array<Access>;
    authenticated_download_url?: string;
    content_created_at?: string;
    content_modified_at?: string;
    created_at?: string;
    created_by?: User;
    description?: string;
    download_url?: string;
    extension?: string;
    has_collaborations?: boolean;
    id: string;
    interacted_at?: string;
    is_download_available?: boolean;
    is_externally_owned?: boolean;
    metadata?: unknown;
    modified_at?: string;
    modified_by?: User;
    name?: string;
    owned_by?: User;
    permissions?: BoxItemPermission;
    selected?: boolean;
    shared_link?: SharedLink;
    size?: number;
    type?: ItemType;
    url?: string;
    version_number?: string;
};

export type BoxItemPermission = {
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
};

export type SharedLink = {
    access: Access;
    download_count?: number;
    download_url?: string;
    effective_access?: Access;
    effective_permission?: typeof PERMISSION_CAN_DOWNLOAD | typeof PERMISSION_CAN_PREVIEW;
    is_password_enabled?: boolean;
    password?: string | null;
    permissions?: BoxItemPermission;
    preview_count?: number;
    unshared_at?: string | null;
    url: string;
    vanity_name?: string;
    vanity_url?: string;
};

export type User = {
    avatar_url?: string;
    email?: string;
    id: string;
    login?: string;
    name: string;
    type: 'user';
};

export type Collection = {
    entries?: Array<BoxItem>;
    isLoaded?: boolean;
    limit?: number;
    next_marker?: string;
    offset?: number;
    order?: Array<Order>;
    previous_marker?: string;
    total_count?: number;
    id?: string;
    items?: BoxItem[];
    sortBy?: string;
    sortDirection?: string;
};

export type DOMStringList = {
    contains: (string: string) => boolean;
    item: (index: number) => string | null;
    length: number;
    [index: number]: string;
};

export type BoxItemCollection = {
    entries?: Array<BoxItem>;
    isLoaded?: boolean;
    limit?: number;
    next_marker?: string;
    offset?: number;
    order?: Array<Order>;
    previous_marker?: string;
    total_count?: number;
};

export type FlattenedBoxItemCollection = {
    entries?: Array<string>;
    isLoaded?: boolean;
    limit?: number;
    next_marker?: string;
    offset?: number;
    order?: Array<Order>;
    previous_marker?: string;
    total_count?: number;
};

export type Recent = {
    interacted_at: string;
    item: BoxItem;
};

export type RecentCollection = {
    entries: Array<Recent>;
    order: Order;
};

export type FileVersions = {
    entries: Array<BoxItemVersion>;
    total_count: number;
};

export type BoxItemVersion = {
    action_by?: User[];
    action_type?: string;
    authenticated_download_url?: string;
    created_at: string;
    id: string;
    is_download_available?: boolean;
    modified_at?: string;
    modified_by: User | null;
    name?: string;
    permissions?: BoxItemVersionPermission;
    sha1?: string;
    size?: number;
    type: 'file_version';
    version_number: string;
};

export type BoxItemVersionPermission = {
    can_delete?: boolean;
    can_download?: boolean;
    can_preview?: boolean;
    can_upload?: boolean;
};

export type Reply = {
    created_at: string;
    created_by: User;
    id: string;
    message: string;
    parent: {
        id: string;
        type: string;
    };
    type: 'reply';
};

export type GroupMini = {
    id: string;
    name: string;
    permissions?: {
        can_invite_as_collaborator: boolean;
    };
    type: 'group';
};

export type UserMini = {
    avatar_url?: string;
    email?: string;
    id: string;
    login?: string;
    name: string;
    type: 'user';
};

export type Collaborators = {
    entries: Array<GroupMini | UserMini>;
    next_marker?: string | null;
};

export type AccessibleByUserOrGroup = {
    id: number | string;
    login: string;
    name: string;
    type: 'user' | 'group';
};

export type CollaborationOptions = {
    expires_at: string | null;
    id: number | string;
    role: string;
    status?: string;
};

export type Collaboration = CollaborationOptions & {
    accessible_by: AccessibleByUserOrGroup;
};

export type NewCollaboration = CollaborationOptions & {
    accessible_by: Partial<AccessibleByUserOrGroup>;
};

export type Collaborations = {
    entries: Array<Collaboration>;
    next_marker: string | null;
};
