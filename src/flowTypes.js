/**
 * @flow
 * @file Flow types
 * @author Box
 */
/* eslint-disable no-use-before-define */
import type { MessageDescriptor } from 'react-intl';
import FolderAPI from './api/Folder';
import FileAPI from './api/File';
import WebLinkAPI from './api/WebLink';
import MultiputUploadAPI from './api/uploads/MultiputUpload';
import PlainUploadAPI from './api/PlainUpload';
import Cache from './util/Cache';
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
    FIELD_INTERACTED_AT,
    FIELD_SIZE,
    DEFAULT_VIEW_RECENTS,
    DEFAULT_VIEW_FILES,
    SKILL_KEYWORD,
    SKILL_TIMELINE,
    SKILL_TRANSCRIPT,
    SKILL_KEYVALUE,
    SIZE_MEDIUM,
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA
} from './constants';

export type Method = 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT';
export type Token = null | typeof undefined | string | Function;
export type TokenReadWrite = { read: string, write?: string };
export type TokenLiteral = null | typeof undefined | string | TokenReadWrite;
export type ClassComponent<P, S> = Class<React$Component<P, S>>;
export type StringMap = { [string]: string };
export type StringAnyMap = { [string]: any };
export type StringBooleanMap = { [string]: boolean };
export type ItemAPI = FolderAPI | FileAPI | WebLinkAPI;
export type Access = typeof ACCESS_COLLAB | typeof ACCESS_COMPANY | typeof ACCESS_OPEN;
export type DefaultView = typeof DEFAULT_VIEW_RECENTS | typeof DEFAULT_VIEW_FILES;
export type View =
    | typeof VIEW_ERROR
    | typeof VIEW_SELECTED
    | typeof VIEW_RECENTS
    | typeof VIEW_FOLDER
    | typeof VIEW_SEARCH
    | typeof VIEW_UPLOAD_EMPTY
    | typeof VIEW_UPLOAD_IN_PROGRESS
    | typeof VIEW_UPLOAD_SUCCESS;
export type SortDirection = typeof SORT_ASC | typeof SORT_DESC;
export type SortableOptions = typeof SORT_NAME | typeof SORT_DATE | typeof SORT_SIZE;
export type SortBy = typeof FIELD_NAME | typeof FIELD_MODIFIED_AT | typeof FIELD_INTERACTED_AT | typeof FIELD_SIZE;
export type ItemType = typeof TYPE_FILE | typeof TYPE_FOLDER | typeof TYPE_WEBLINK;
export type UploadStatus =
    | typeof STATUS_PENDING
    | typeof STATUS_IN_PROGRESS
    | typeof STATUS_COMPLETE
    | typeof STATUS_ERROR;
export type Delimiter = typeof DELIMITER_SLASH | typeof DELIMITER_CARET;
export type Size = typeof SIZE_SMALL | typeof SIZE_LARGE | typeof SIZE_MEDIUM;

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

export type User = {
    avatarUrl: string,
    email: string,
    id: string,
    login: string,
    name: string,
    type: 'user'
};

export type SelectorItem = {
    id?: string | number,
    name: string,
    item: Object,
    value: any
};

export type SelectorItems = Array<SelectorItem>;

export type ActionItemError = {
    title: string,
    message: string,
    action: {
        text: string,
        onAction: Function
    }
};

export type OptionItem = {
    text: string,
    value: number | string
};

export type OptionItems = Array<OptionItem>;

export type SkillCardType =
    | typeof SKILL_KEYWORD
    | typeof SKILL_TIMELINE
    | typeof SKILL_TRANSCRIPT
    | typeof SKILL_KEYVALUE;
export type SkillCardEntryType = 'text' | 'image';

export type SkillCardEntryTimeSlice = {
    start: number,
    end?: number
};

export type SkillCardEntry = {
    type?: SkillCardEntryType,
    text?: string,
    label?: string,
    image_url?: string,
    appears?: Array<SkillCardEntryTimeSlice>
};

export type SkillCard = {
    type: 'skill_card',
    id: string,
    skill_card_type: SkillCardType,
    title?: string,
    duration?: number,
    entries: SkillCardEntry[],
    error?: string
};

export type SkillCards = {
    cards: Array<SkillCard>
};

export type MetadataTemplate = {
    boxSkillsCards?: SkillCards
};

export type MetadataType = {
    global?: MetadataTemplate
};

export type BoxItemVersion = {
    id: string,
    type: string,
    sha1: string,
    name?: string,
    size?: number,
    created_at?: string,
    modified_at?: string,
    modified_by?: User,
    trashed_at: ?string
};

export type BoxItem = {
    id?: string,
    name?: string,
    size?: number,
    type?: ItemType,
    parent?: BoxItem,
    extension?: string,
    description?: string,
    permissions?: BoxItemPermission,
    item_collection?: BoxItemCollection,
    path_collection?: BoxPathCollection,
    interacted_at?: string,
    modified_at?: string,
    created_at?: string,
    shared_link?: SharedLink,
    allowed_shared_link_access_levels?: Access[],
    has_collaborations?: boolean,
    is_externally_owned?: boolean,
    download_url?: string,
    url?: string,
    owned_by?: User,
    modified_by?: User,
    created_by?: User,
    selected?: boolean,
    metadata?: MetadataType,
    file_version?: BoxItemVersion,
    is_download_available: boolean,
    version_number?: string
};

export type BoxItemCollection = {
    total_count?: number,
    entries?: BoxItem[],
    order?: Order[],
    isLoaded?: boolean,
    limit?: number,
    offset?: number
};

export type FlattenedBoxItem = {
    id?: string,
    name?: string,
    size?: number,
    type?: ItemType,
    parent?: BoxItem,
    extension?: string,
    description?: string,
    permissions?: BoxItemPermission,
    item_collection?: FlattenedBoxItemCollection,
    path_collection?: BoxPathCollection,
    interacted_at?: string,
    modified_at?: string,
    created_at?: string,
    shared_link?: SharedLink,
    allowed_shared_link_access_levels?: Access[],
    has_collaborations?: boolean,
    is_externally_owned?: boolean,
    download_url?: string,
    url?: string,
    owned_by?: User,
    modified_by?: User,
    created_by?: User,
    selected?: boolean,
    metadata?: MetadataType,
    file_version?: BoxItemVersion
};

export type FlattenedBoxItemCollection = {
    total_count?: number,
    entries?: string[],
    order?: Order[],
    isLoaded?: boolean,
    limit?: number,
    offset?: number
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
    api: PlainUploadAPI | MultiputUploadAPI,
    boxFile?: BoxItem,
    error?: Object,
    extension: string,
    file: File,
    name: string,
    progress: number,
    size: number,
    status: UploadStatus,
    options?: UploadItemAPIOptions
};

export type UploadItemAPIOptions = {
    apiHost?: string,
    fileId?: string,
    folderId?: string,
    token?: Token,
    uploadHost?: string,
    uploadInitTimestamp?: number
};

export type UploadFileWithAPIOptions = {
    file: File,
    options?: UploadItemAPIOptions
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

export type Options = {
    id?: string,
    token: Token,
    clientName?: string,
    version?: string,
    sharedLink?: string,
    sharedLinkPassword?: string,
    cache?: Cache,
    apiHost?: string,
    uploadHost?: string,
    responseInterceptor?: Function,
    requestInterceptor?: Function,
    consoleLog?: boolean,
    consoleError?: boolean
};

export type Recent = {
    interacted_at: string,
    item: BoxItem
};

export type RecentCollection = {
    order: Order,
    entries: Recent[]
};

export type MultiputConfig = {
    digestReadahead: number,
    initialRetryDelayMs: number,
    maxRetryDelayMs: number,
    parallelism: number,
    requestTimeoutMs: number,
    retries: number
};

export type MultiputPart = {
    offset: number,
    part_id: string,
    sha1: string,
    size: number
};

export type MultiputData = {
    part?: MultiputPart
};

export type FileVersions = {
    total_count: number,
    entries: Array<BoxItemVersion>
};

export type MaskError = {
    errorHeader: MessageDescriptor,
    errorSubHeader?: MessageDescriptor
};

export type InlineError = {
    title: MessageDescriptor,
    content: MessageDescriptor
};

export type Errors = {
    maskError?: MaskError,
    inlineError?: InlineError
};

export type FileAccessStats = {
    preview_count: number,
    download_count: number,
    comment_count: number,
    edit_count: number,
    has_count_overflowed: boolean
};

export type Task = {
    type: 'task',
    id: string,
    item: {
        type: string,
        id: string,
        sequence_id: string,
        etag: string,
        sha1: string,
        name: string
    },
    createdAt: string,
    dueAt: string,
    taggedMessage: string,
    assignees: Array<User>
};

export type Tasks = {
    total_count: number,
    entries: Array<Task>
};

export type Comment = {
    type: 'comment',
    id: string,
    isReplyComment: boolean,
    taggedMessage: string,
    createdBy: User,
    createdAt: string,
    item: {
        id: string,
        type: string
    },
    modifiedAt: string
};

export type Comments = {
    total_count: number,
    entries: Array<Comment>
};

export type FileVersion = {
    type: 'file_version',
    id: string,
    action: string,
    modifiedBy: User,
    modifiedAt?: string,
    createdAt?: string,
    trashedAt?: string,
    purgedAt?: string,
    versions?: Array<FileVersion>,
    versionNumber: number,
    versionStart?: number,
    versionEnd?: number,
    collaborators?: Object
};

export type Versions = {
    total_count: number,
    entries: Array<FileVersion>
};

export type JsonPatch = {
    op: 'add' | 'remove' | 'replace' | 'test',
    path: string,
    value?: Object
};

export type JsonPatchData = Array<JsonPatch>;

export type SidebarView =
    | typeof SIDEBAR_VIEW_SKILLS
    | typeof SIDEBAR_VIEW_DETAILS
    | typeof SIDEBAR_VIEW_METADATA
    | typeof SIDEBAR_VIEW_ACTIVITY;
