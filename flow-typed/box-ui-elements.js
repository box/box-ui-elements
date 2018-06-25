/**
 * @flow
 * @file Flow types
 * @author Box
 */
/* eslint-disable no-use-before-define */
import type { MessageDescriptor, InjectIntlProvidedProps } from 'react-intl';
import type { $AxiosError, Axios, CancelTokenSource } from 'axios';
import type FolderAPI from '../src/api/Folder';
import type FileAPI from '../src/api/File';
import type WebLinkAPI from '../src/api/WebLink';
import type MultiputUploadAPI from '../src/api/uploads/MultiputUpload';
import type PlainUploadAPI from '../src/api/uploads/PlainUpload';
import type APICache from '../src/util/Cache';
import type { ContentSidebarProps } from '../src/components/ContentSidebar';
import type { ContentPreviewProps } from '../src/components/ContentPreview';
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
    SIDEBAR_VIEW_METADATA,
    HTTP_GET,
    HTTP_POST,
    HTTP_PUT,
    HTTP_DELETE,
    HTTP_OPTIONS,
    HTTP_HEAD,
    SKILL_FACE,
    SKILL_STATUS
} from '../src/constants';

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
type SortDirection = typeof SORT_ASC | typeof SORT_DESC;
type SortableOptions = typeof SORT_NAME | typeof SORT_DATE | typeof SORT_SIZE;
type SortBy = typeof FIELD_NAME | typeof FIELD_MODIFIED_AT | typeof FIELD_INTERACTED_AT | typeof FIELD_SIZE;
type ItemType = typeof TYPE_FILE | typeof TYPE_FOLDER | typeof TYPE_WEBLINK;
type UploadStatus =
    | typeof STATUS_PENDING
    | typeof STATUS_IN_PROGRESS
    | typeof STATUS_COMPLETE
    | typeof STATUS_ERROR;
type Delimiter = typeof DELIMITER_SLASH | typeof DELIMITER_CARET;
type Size = typeof SIZE_SMALL | typeof SIZE_LARGE | typeof SIZE_MEDIUM;

type SharedLink = {
    url: string,
    access: Access
};

type Order = {
    by: SortBy,
    direction: SortDirection
};

type BoxItemPermission = {
    can_comment?: boolean,
    can_edit_comment?: boolean,
    can_delete_comment?: boolean,
    can_preview?: boolean,
    can_rename?: boolean,
    can_download?: boolean,
    can_delete?: boolean,
    can_upload?: boolean,
    can_share?: boolean,
    can_set_share_access?: boolean
};

type User = {
    type: 'user',
    id: string,
    name: string,
    login: string,
    email?: string,
    avatar_url?: string
};

type UserCollection = {
    total_count?: number,
    entries?: Array<User>,
    order?: Array<Order>,
    isLoaded?: boolean,
    limit?: number,
    offset?: number,
    previous_marker?: string,
    next_marker?: string
};

type SelectorItem = {
    id?: string | number,
    name: string,
    item: Object,
    value?: any
};

type SelectorItems = Array<SelectorItem>;

type ActionItemError = {
    title: MessageDescriptor,
    message: MessageDescriptor,
    action?: {
        text: MessageDescriptor,
        onAction: Function
    }
};

type OptionItem = {
    text: string,
    value: number | string
};

type OptionItems = Array<OptionItem>;

type SkillCardType =
    | typeof SKILL_KEYWORD
    | typeof SKILL_TIMELINE
    | typeof SKILL_TRANSCRIPT
    | typeof SKILL_FACE
    | typeof SKILL_STATUS;

type SkillCardEntryType = 'text' | 'image';

type SkillCardLocalizableType = {
    code?: string,
    message?: string
};

type SkillCardEntryTimeSlice = {
    start: number,
    end?: number
};

type SkillCardEntry = {
    type?: SkillCardEntryType,
    text?: string,
    label?: string,
    image_url?: string,
    appears?: Array<SkillCardEntryTimeSlice>
};

type SkillCard = {
    type: 'skill_card',
    id?: string,
    file_version: BoxItemVersion,
    status?: SkillCardLocalizableType,
    skill_card_title: SkillCardLocalizableType,
    skill_card_type: SkillCardType,
    title?: string,
    duration?: number,
    entries: Array<SkillCardEntry>,
    error?: string
};

type SkillCards = {
    cards: Array<SkillCard>
};

type MetadataTemplate = {
    boxSkillsCards?: SkillCards
};

type MetadataType = {
    global?: MetadataTemplate
};

type BoxItemVersion = {
    id: string,
    type: string,
    sha1?: string,
    name?: string,
    size?: number,
    created_at: string,
    modified_at?: string,
    modified_by: User,
    trashed_at: ?string,
    action: 'upload' | 'delete' | 'restore',
    versions?: Array<BoxItemVersion>,
    version_number: number,
    version_start?: number,
    version_end?: number,
    collaborators?: Object
};

type BoxItem = {
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
    allowed_shared_link_access_levels?: Array<Access>,
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

type BoxItemCollection = {
    total_count?: number,
    entries?: Array<BoxItem>,
    order?: Array<Order>,
    isLoaded?: boolean,
    limit?: number,
    offset?: number,
    previous_marker?: string,
    next_marker?: string
};

type FlattenedBoxItem = {
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
    allowed_shared_link_access_levels?: Array<Access>,
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

type FlattenedBoxItemCollection = {
    total_count?: number,
    entries?: Array<string>,
    order?: Array<Order>,
    isLoaded?: boolean,
    limit?: number,
    offset?: number,
    previous_marker?: string,
    next_marker?: string
};

type BoxPathCollection = {
    total_count: number,
    entries: Array<Crumb>
};

type Collection = {
    id?: string,
    name?: string,
    permissions?: BoxItemPermission,
    breadcrumbs?: Array<Crumb>,
    percentLoaded?: number,
    sortBy?: SortBy,
    sortDirection?: SortDirection,
    items?: Array<BoxItem>,
    boxItem?: FlattenedBoxItem
};

type UploadItem = {
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

type UploadItemAPIOptions = {
    apiHost?: string,
    fileId?: string,
    folderId?: string,
    token?: Token,
    uploadHost?: string,
    uploadInitTimestamp?: number
};

type UploadFileWithAPIOptions = {
    file: File,
    options?: UploadItemAPIOptions
};

type ModalOptions = {
    buttonLabel: string,
    buttonClassName: string,
    modalClassName: string,
    overlayClassName: string
};

type IconType = {
    color?: string,
    secondaryColor?: string,
    className?: string,
    width?: number,
    height?: number
};

type Crumb = {
    id?: string,
    name: string
};

type Options = {
    id?: string,
    token: Token,
    clientName?: string,
    version?: string,
    sharedLink?: string,
    sharedLinkPassword?: string,
    cache?: APICache,
    apiHost?: string,
    uploadHost?: string,
    responseInterceptor?: Function,
    requestInterceptor?: Function,
    consoleLog?: boolean,
    consoleError?: boolean
};

type Recent = {
    interacted_at: string,
    item: BoxItem
};

type RecentCollection = {
    order: Order,
    entries: Array<Recent>
};

type MultiputConfig = {
    digestReadahead: number,
    initialRetryDelayMs: number,
    maxRetryDelayMs: number,
    parallelism: number,
    requestTimeoutMs: number,
    retries: number
};

type MultiputPart = {
    offset: number,
    part_id: string,
    sha1: string,
    size: number
};

type MultiputData = {
    part?: MultiputPart
};

type FileVersions = {
    total_count: number,
    entries: Array<BoxItemVersion>
};

type MaskError = {
    errorHeader: MessageDescriptor,
    errorSubHeader?: MessageDescriptor
};

type InlineError = {
    title: MessageDescriptor,
    content: MessageDescriptor
};

type Errors = {
    maskError?: MaskError,
    inlineError?: InlineError
};

type FileAccessStats = {
    preview_count: number,
    download_count: number,
    comment_count: number,
    edit_count: number,
    has_count_overflowed: boolean
};

type TaskAssignment = {
    type: 'task_assignment',
    id: string,
    assigned_to: User,
    resolution_state: string,
    message: string
};

type TaskAssignments = {
    total_count: number,
    entries: Array<TaskAssignment>
};

type Task = {
    type: 'task',
    id: string,
    created_at: string,
    created_by: User,
    due_at: string,
    message: string,
    task_assignment_collection: TaskAssignments
};

type Tasks = {
    total_count: number,
    entries: Array<Task>
};

type Comment = {
    type: 'comment',
    id: string,
    is_reply_comment?: boolean,
    tagged_message: string,
    message?: string,
    created_by: User,
    created_at: string,
    modified_at: string
};

type Comments = {
    total_count: number,
    entries: Array<Comment>
};

type FeedItems = Array<Comment | Task | BoxItemVersion>;

type Collaborators = {
    next_marker: 'string' | null,
    entries: Array<SelectorItem>
};

type Translations = {
    translationEnabled?: boolean,
    onTranslate?: Function
};

type JsonPatch = {
    op: 'add' | 'remove' | 'replace' | 'test',
    path: string,
    value?: Object
};

type JsonPatchData = Array<JsonPatch>;

type SidebarView =
    | typeof SIDEBAR_VIEW_SKILLS
    | typeof SIDEBAR_VIEW_DETAILS
    | typeof SIDEBAR_VIEW_METADATA
    | typeof SIDEBAR_VIEW_ACTIVITY;
