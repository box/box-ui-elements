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
import type { ContentOpenWithProps } from '../src/components/ContentOpenWithProps';
import type { ContentPreviewProps } from '../src/components/ContentPreview';
import {
    ACCESS_OPEN,
    ACCESS_COLLAB,
    ACCESS_COMPANY,
    APP_INTEGRATION,
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
    STATUS_PENDING,
    STATUS_IN_PROGRESS,
    STATUS_COMPLETE,
    STATUS_ERROR,
    DELIMITER_SLASH,
    DELIMITER_CARET,
    SIZE_SMALL,
    SIZE_LARGE,
    FIELD_DATE,
    FIELD_NAME,
    FIELD_RELEVANCE,
    DEFAULT_VIEW_RECENTS,
    DEFAULT_VIEW_FILES,
    SKILLS_KEYWORD,
    SKILLS_TIMELINE,
    SKILLS_TRANSCRIPT,
    SKILLS_FACE,
    SKILLS_STATUS,
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
    ORIGIN_CONTENT_SIDEBAR,
    ORIGIN_PREVIEW,
    ORIGIN_CONTENT_PREVIEW,
    ORIGIN_DETAILS_SIDEBAR,
    ORIGIN_ACTIVITY_SIDEBAR,
    ORIGIN_SKILLS_SIDEBAR,
    ORIGIN_METADATA_SIDEBAR,
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
type SortBy = typeof FIELD_DATE | typeof FIELD_NAME | typeof FIELD_RELEVANCE;
type SortDirection = typeof SORT_ASC | typeof SORT_DESC;
type ItemType = typeof TYPE_FILE | typeof TYPE_FOLDER | typeof TYPE_WEBLINK;
type UploadStatus = typeof STATUS_PENDING | typeof STATUS_IN_PROGRESS | typeof STATUS_COMPLETE | typeof STATUS_ERROR;
type Delimiter = typeof DELIMITER_SLASH | typeof DELIMITER_CARET;
type Size = typeof SIZE_SMALL | typeof SIZE_LARGE | typeof SIZE_MEDIUM;

type SharedLink = {
    url: string,
    access: Access,
};

type Order = {
    by: SortBy,
    direction: SortDirection,
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
    can_set_share_access?: boolean,
};

type User = {
    type: 'user',
    id: string,
    name: string,
    login?: string,
    email?: string,
    avatar_url?: string,
};

type UserCollection = {
    total_count?: number,
    entries?: Array<User>,
    order?: Array<Order>,
    isLoaded?: boolean,
    limit?: number,
    offset?: number,
    previous_marker?: string,
    next_marker?: string,
};

type SelectorItem = {
    id: string,
    name: string,
    item: Object,
    value?: any,
};

type SelectorItems = Array<SelectorItem>;

type ActionItemError = {
    title: MessageDescriptor,
    message: MessageDescriptor,
    action?: {
        text: MessageDescriptor,
        onAction: Function,
    },
};

type OptionItem = {
    text: string,
    value: number | string,
};

type OptionItems = Array<OptionItem>;

type SkillCardType =
    | typeof SKILLS_KEYWORD
    | typeof SKILLS_TIMELINE
    | typeof SKILLS_TRANSCRIPT
    | typeof SKILLS_FACE
    | typeof SKILLS_STATUS;

type SkillCardEntryType = 'text' | 'image';

type SkillCardLocalizableType = {
    code?: string,
    message?: string,
};

type SkillCardEntryTimeSlice = {
    start: number,
    end?: number,
};

type SkillCardEntry = {
    type?: SkillCardEntryType,
    text?: string,
    label?: string,
    image_url?: string,
    appears?: Array<SkillCardEntryTimeSlice>,
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
    error?: string,
};

type SkillCards = {
    cards: Array<SkillCard>,
};

type MetadataSkillsTemplate = {
    boxSkillsCards?: SkillCards,
};

type MetadataType = {
    global?: MetadataSkillsTemplate,
};

type MetadataEditorTemplate = {
    id: string,
    scope: string,
    templateKey: string,
    hidden: boolean,
};

type MetadataEditorInstance = {
    id: string,
    data: Object,
    canEdit: boolean,
};

type MetadataInstance = {
    $id: string,
    $template: string,
    $canEdit: boolean,
    $scope: string,
    $parent: string,
    $type: string,
    $typeVersion: number,
    $version: number,
};

type MetadataEditor = {
    hasError?: boolean,
    instance: MetadataEditorInstance,
    isDirty?: boolean,
    template: MetadataEditorTemplate,
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
    version_number: string,
    version_start?: number,
    version_end?: number,
    collaborators?: Object,
};

type BoxItem = {
    id: string,
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
    is_download_available?: boolean,
    version_number?: string,
    restored_from?: BoxItemVersion,
};

type BoxItemCollection = {
    total_count?: number,
    entries?: Array<BoxItem>,
    order?: Array<Order>,
    isLoaded?: boolean,
    limit?: number,
    offset?: number,
    previous_marker?: string,
    next_marker?: string,
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
    file_version?: BoxItemVersion,
};

type FlattenedBoxItemCollection = {
    total_count?: number,
    entries?: Array<string>,
    order?: Array<Order>,
    isLoaded?: boolean,
    limit?: number,
    offset?: number,
    previous_marker?: string,
    next_marker?: string,
};

type BoxPathCollection = {
    total_count: number,
    entries: Array<Crumb>,
};

type Collection = {
    id?: string,
    name?: string,
    permissions?: BoxItemPermission,
    breadcrumbs?: Array<Crumb>,
    offset?: number,
    percentLoaded?: number,
    sortBy?: SortBy,
    sortDirection?: SortDirection,
    items?: Array<BoxItem>,
    boxItem?: FlattenedBoxItem,
    totalCount?: number,
};

type UploadItem = {
    api: PlainUploadAPI | MultiputUploadAPI,
    boxFile?: BoxItem,
    error?: Object,
    extension: string,
    file: UploadFile,
    name: string,
    progress: number,
    size: number,
    status: UploadStatus,
    options?: UploadItemAPIOptions,
    isFolder?: boolean,
};

type UploadItemAPIOptions = {
    apiHost?: string,
    fileId?: string,
    folderId?: string,
    token?: Token,
    uploadInitTimestamp?: number,
};

type UploadFileWithAPIOptions = {
    file: UploadFile,
    options?: UploadItemAPIOptions,
};

type ModalOptions = {
    buttonLabel: string,
    buttonClassName: string,
    modalClassName: string,
    overlayClassName: string,
};

type IconType = {
    color?: string,
    secondaryColor?: string,
    className?: string,
    width?: number,
    height?: number,
};

type Crumb = {
    id?: string,
    name: string,
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
    consoleError?: boolean,
};

type Recent = {
    interacted_at: string,
    item: BoxItem,
};

type RecentCollection = {
    order: Order,
    entries: Array<Recent>,
};

type MultiputConfig = {
    digestReadahead: number,
    initialRetryDelayMs: number,
    maxRetryDelayMs: number,
    parallelism: number,
    requestTimeoutMs: number,
    retries: number,
};

type MultiputPart = {
    offset: number,
    part_id: string,
    sha1: string,
    size: number,
};

type MultiputData = {
    part?: MultiputPart,
};

type FileVersions = {
    total_count: number,
    entries: Array<BoxItemVersion>,
};

type MaskError = {
    errorHeader: MessageDescriptor,
    errorSubHeader?: MessageDescriptor,
};

type InlineError = {
    title: MessageDescriptor,
    content: MessageDescriptor,
};

type Errors = {
    maskError?: MaskError,
    inlineError?: InlineError,
    error?: MessageDescriptor,
};

type FileAccessStats = {
    preview_count?: number,
    download_count?: number,
    comment_count?: number,
    edit_count?: number,
    has_count_overflowed: boolean,
};

type TaskAssignment = {
    type: 'task_assignment',
    id: string,
    assigned_to: User,
    resolution_state: string,
    message: string,
};

type TaskAssignments = {
    total_count: number,
    entries: Array<TaskAssignment>,
};

type Task = {
    type: 'task',
    id: string,
    created_at: string,
    created_by: User,
    due_at?: string,
    message: string,
    task_assignment_collection: TaskAssignments,
};

type Tasks = {
    total_count: number,
    entries: Array<Task>,
};

type Comment = {
    type: 'comment',
    id: string,
    is_reply_comment?: boolean,
    tagged_message: string,
    message?: string,
    created_by: User,
    created_at: string,
    modified_at: string,
};

type Comments = {
    total_count: number,
    entries: Array<Comment>,
};

type FeedItems = Array<Comment | Task | BoxItemVersion>;

type Collaborators = {
    next_marker: 'string' | null,
    entries: Array<SelectorItem>,
};

type Translations = {
    translationEnabled?: boolean,
    onTranslate?: Function,
};

type OpenWithAPI = {
    default_app_integration?: AppIntegrationAPIMiniItem,
    disabled_reasons?: Array<string>,
    is_disabled?: boolean,
    items: Array<OpenWithAPIItem>,
    should_show_consent_popup?: boolean,
};

type OpenWithAPIItem = {
    app_integration: AppIntegrationAPIMiniItem,
    disabled_reasons: Array<string>,
    display_description: string,
    display_name: string,
    display_order: number,
    is_disabled: boolean,
    should_show_consent_popup: boolean,
};

type AppIntegrationAPIMiniItem = {
    id: string,
    type: APP_INTEGRATION,
};

type ExecuteAPIParam = {
    key: string,
    value: string,
};

type ExecuteAPI = {
    url: string,
    params: ?Array<ExecuteAPIParam>,
    integration_type: string,
    method: HTTP_POST | HTTP_GET,
};

type Integration = {
    appIntegrationId: string,
    disabledReasons: Array<string>,
    displayDescription: string,
    displayName: string,
    displayOrder: number,
    isDefault: boolean,
    isDisabled: boolean,
    requiresConsent: boolean,
    type: APP_INTEGRATION,
};

type JsonPatch = {
    op: 'add' | 'remove' | 'replace' | 'test',
    path: string,
    value?: Object,
};

type JsonPatchData = Array<JsonPatch>;

type SidebarView =
    | typeof SIDEBAR_VIEW_SKILLS
    | typeof SIDEBAR_VIEW_DETAILS
    | typeof SIDEBAR_VIEW_METADATA
    | typeof SIDEBAR_VIEW_ACTIVITY;

type FileSystemFileEntry = {
    createReader: Function,
    file: Function,
    isDirectory: boolean,
    isFile: boolean,
    name: string,
};

type UploadDataTransferItemWithAPIOptions = {
    item: DataTransferItem,
    options?: UploadItemAPIOptions,
};

type UploadFile = File & { webkitRelativePath?: string };

type DirectoryReader = {
    readEntries: (Function, Function) => void,
};

type FetchOptions = {
    fields?: Array<string>,
    forceFetch?: boolean,
    refreshCache?: boolean,
};

type ErrorResponseData = {
    code: string,
    help_url: string,
    message: string,
    context_info: Object,
    request_id: string,
    status: number,
    type: 'error',
};

type ElementsXhrError = $AxiosError<any> | ErrorResponseData;

type ErrorOrigins =
    | ORIGIN_CONTENT_SIDEBAR
    | ORIGIN_CONTENT_PREVIEW
    | ORIGIN_PREVIEW
    | ORIGIN_DETAILS_SIDEBAR
    | ORIGIN_ACTIVITY_SIDEBAR
    | ORIGIN_SKILLS_SIDEBAR
    | ORIGIN_METADATA_SIDEBAR;

type ElementsError = {
    type: 'error',
    code: string,
    message: string,
    origin: ErrorOrigins,
    context_info: Object,
};

type ErrorContextProps = {
    onError: (
        error: ElementsXhrError | Error,
        code: string,
        contextInfo?: Object,
        origin: ErrorOrigins,
    ) => void,
};

type ClassificationInfo = {
    Box__Security__Classification__Key?: string
} & MetadataInstance;