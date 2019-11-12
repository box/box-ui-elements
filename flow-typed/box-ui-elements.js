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
import type { TaskNew } from '../src/common/types/tasks';
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
    STATUS_STAGED,
    STATUS_COMPLETE,
    STATUS_ERROR,
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
    TASK_APPROVED,
    TASK_COMPLETED,
    TASK_INCOMPLETE,
    TASK_REJECTED,
    METRIC_TYPE_PREVIEW,
    METRIC_TYPE_ELEMENTS_LOAD_METRIC,
    METRIC_TYPE_ELEMENTS_PERFORMANCE_METRIC,
    VERSION_RETENTION_DELETE_ACTION,
    VERSION_RETENTION_REMOVE_ACTION,
    VERSION_RETENTION_INDEFINITE,
} from '../src/constants';

import {
    FIELD_TYPE_DATE,
    FIELD_TYPE_ENUM,
    FIELD_TYPE_FLOAT,
    FIELD_TYPE_MULTISELECT,
    FIELD_TYPE_STRING,
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
type UploadStatus =
    | typeof STATUS_PENDING
    | typeof STATUS_IN_PROGRESS
    | typeof STATUS_STAGED
    | typeof STATUS_COMPLETE
    | typeof STATUS_ERROR;
type Delimiter = typeof DELIMITER_SLASH | typeof DELIMITER_CARET;
type Size = typeof SIZE_SMALL | typeof SIZE_LARGE | typeof SIZE_MEDIUM;
type TaskAssignmentStatus =
    | typeof TASK_APPROVED
    | typeof TASK_COMPLETED
    | typeof TASK_INCOMPLETE
    | typeof TASK_REJECTED;

type SharedLink = {
    access: Access,
    url: string,
};

type Order = {
    by: SortBy,
    direction: SortDirection,
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

type BoxCommentPermission = {
    can_delete?: boolean,
    can_edit?: boolean,
};

type BoxTaskPermission = {
    can_delete?: boolean,
    can_update?: boolean,
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

type User = {
    avatar_url?: string,
    email?: string,
    id: string,
    login?: string,
    name: string,
    type: 'user',
};

type UserCollection = {
    entries?: Array<User>,
    isLoaded?: boolean,
    limit?: number,
    next_marker?: string,
    offset?: number,
    order?: Array<Order>,
    previous_marker?: string,
    total_count?: number,
};

type SelectorItem = {
    id: string,
    item: Object,
    name: string,
    value?: any,
};

type SelectorItems = Array<SelectorItem>;

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
    end?: number,
    start: number,
};

type SkillCardEntry = {
    appears?: Array<SkillCardEntryTimeSlice>,
    image_url?: string,
    label?: string,
    text?: string,
    type?: SkillCardEntryType,
};

type SkillCard = {
    duration?: number,
    entries: Array<SkillCardEntry>,
    error?: string,
    file_version: BoxItemVersion,
    id?: string,
    skill_card_title: SkillCardLocalizableType,
    skill_card_type: SkillCardType,
    status?: SkillCardLocalizableType,
    title?: string,
    type: 'skill_card',
};

type SkillCards = {
    cards: Array<SkillCard>,
};

type MetadataSkillsTemplate = {
    boxSkillsCards?: SkillCards,
};

type MetadataType = {
    enterprise?: MetadataQueryInstanceTemplate,
    global?: MetadataSkillsTemplate,
};

type MetadataQueryInstanceTypeField = {
    name: string,
    options?: MetadataTemplateFieldOption,
    type: string,
    value: string,
};

type MetadataQueryInstanceTemplate = {
    fields: Array<MetadataQueryInstanceTypeField>,
    id: string,
};

type MetadataFieldValue = string | number | Array<any>;

type MetadataFields = { [string]: MetadataFieldValue };

type MetadataFieldType =
    | typeof FIELD_TYPE_DATE
    | typeof FIELD_TYPE_ENUM
    | typeof FIELD_TYPE_FLOAT
    | typeof FIELD_TYPE_MULTISELECT
    | typeof FIELD_TYPE_STRING;

type MetadataTemplateFieldOption = {
    id?: string,
    key: string,
};

type MetadataTemplateField = {
    description?: string,
    displayName: string,
    hidden?: boolean,
    id: string,
    isHidden?: boolean,
    key: string, // V2
    options?: Array<MetadataTemplateFieldOption>, // V3
    type: MetadataFieldType,
};

type MetadataTemplate = {
    displayName?: string,
    fields?: Array<MetadataTemplateField>,
    hidden?: boolean,
    id: string,
    isHidden?: boolean,
    scope: string, // V2
    templateKey: string, // V3
};

type MetadataCascadePolicy = {
    canEdit?: boolean,
    id?: string,
};

type MetadataCascadingPolicyData = {
    id?: string,
    isEnabled: boolean,
    overwrite: boolean,
};

type MetadataInstance = {
    canEdit: boolean,
    cascadePolicy?: MetadataCascadePolicy,
    data: MetadataFields,
    id: string,
};

type MetadataInstanceV2 = {
    $canEdit: boolean,
    $id: string,
    $parent: string,
    $scope: string,
    $template: string,
    $type: string,
    $typeVersion: number,
    $version: number,
};

type MetadataEditor = {
    hasError?: boolean,
    instance: MetadataInstance,
    isDirty?: boolean,
    template: MetadataTemplate,
};

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

type FolderUploadItem = {
    boxFile?: BoxItem,
    error?: Object,
    extension: string,
    isFolder?: boolean,
    name: string,
    options?: UploadItemAPIOptions,
    progress: number,
    size: number,
    status: UploadStatus,
};

type UploadItem = {
    api: PlainUploadAPI | MultiputUploadAPI,
    boxFile?: BoxItem,
    error?: Object,
    extension: string,
    file: UploadFile,
    isFolder?: boolean,
    name: string,
    options?: UploadItemAPIOptions,
    progress: number,
    size: number,
    status: UploadStatus,
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

// this is a subset of TaskNew, which imports as `any`
type Task = {
    created_at: string,
    created_by: User,
    id: string,
    permissions: BoxTaskPermission,
    type: 'task',
};

type Tasks = {
    entries: Array<Task>,
    next_marker: ?string,
};

type Comment = {
    created_at: string,
    created_by: User,
    id: string,
    is_reply_comment?: boolean,
    message?: string,
    modified_at: string,
    permissions: BoxCommentPermission,
    tagged_message: string,
    type: 'comment',
};

type Comments = {
    entries: Array<Comment>,
    total_count: number,
};

type ActivityTemplateItem = {|
    id: string,
    type: 'activity_template',
|};

type AppItem = {|
    icon_url: string,
    id: string,
    name: string,
    type: 'app',
|};

type BaseAppActivityItem = {|
    activity_template: ActivityTemplateItem,
    app: AppItem,
    created_by: User,
    id: string,
    rendered_text: string,
    type: 'app_activity',
|};

type AppActivityAPIItem = {|
    occurred_at: string,
    ...BaseAppActivityItem,
|};

type AppActivityAPIItems = {
    entries: Array<AppActivityAPIItem>,
    total_count: number,
};

type AppActivityItem = {|
    created_at: string,
    permissions: BoxItemPermission,
    ...BaseAppActivityItem,
|};

type AppActivityItems = {
    entries: Array<AppActivityItem>,
    total_count: number,
};

type FeedItem = Comment | Task | BoxItemVersion | AppActivityItem;

type FeedItems = Array<FeedItem>;

type Collaborators = {
    entries: Array<SelectorItem>,
    next_marker: ?string,
};

type Translations = {
    onTranslate?: Function,
    translationEnabled?: boolean,
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
    integration_type: string,
    method: HTTP_POST | HTTP_GET,
    params: ?Array<ExecuteAPIParam>,
    url: string,
};

type DisabledReason = string | React.Element<typeof FormattedMessage>;

type Integration = {
    appIntegrationId: string,
    disabledReasons: Array<DisabledReason>,
    displayDescription: string,
    displayName: string,
    displayOrder: number,
    extension?: string,
    isDefault: boolean,
    isDisabled: boolean,
    requiresConsent: boolean,
    type: APP_INTEGRATION,
};

type AdditionalSidebarTab = {
    callback: (callbackData: Object) => void,
    iconUrl?: string,
    id: number,
    title: ?string,
};

type Alignment = 'left' | 'right';

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

type UploadFile = File & { lastModifiedDate?: Date, webkitRelativePath?: string };

type DirectoryReader = {
    readEntries: (Function, Function) => void,
};

type FetchOptions = {
    fields?: Array<string>,
    forceFetch?: boolean,
    noPagination?: boolean,
    refreshCache?: boolean,
};

type ErrorResponseData = {
    code: string,
    context_info: Object,
    help_url: string,
    message: string,
    request_id: string,
    status: number,
    type: 'error',
};

type ElementsXhrError = $AxiosError<any> | ErrorResponseData;

type ElementOrigin =
    | typeof ORIGIN_CONTENT_SIDEBAR
    | typeof ORIGIN_CONTENT_PREVIEW
    | typeof ORIGIN_PREVIEW
    | typeof ORIGIN_DETAILS_SIDEBAR
    | typeof ORIGIN_ACTIVITY_SIDEBAR
    | typeof ORIGIN_SKILLS_SIDEBAR
    | typeof ORIGIN_METADATA_SIDEBAR;

type ElementsError = {
    code: string,
    context_info: Object,
    message: string,
    origin: ElementOrigin,
    type: 'error',
};

type ErrorContextProps = {
    onError: (error: ElementsXhrError | Error, code: string, contextInfo?: Object, origin: ElementOrigin) => void,
};

type ElementsErrorCallback = (e: ElementsXhrError, code: string, contextInfo?: Object) => void;

type ClassificationInfo = {
    definition?: string,
    name: string,
};

type MetricType =
    | typeof METRIC_TYPE_PREVIEW
    | typeof METRIC_TYPE_ELEMENTS_LOAD_METRIC
    | typeof METRIC_TYPE_ELEMENTS_PERFORMANCE_METRIC;

type ElementsLoadMetricData = {
    endMarkName: string,
    startMarkName?: string,
};

type LoggerProps = {
    onPreviewMetric: (data: Object) => void,
    onReadyMetric: (data: ElementsLoadMetricData) => void,
};

type GetAvatarUrlCallback = string => Promise<?string>;

type GetProfileUrlCallback = string => Promise<string>;

type WithLoggerProps = {
    logger: LoggerProps,
};

type ActivityFeedFeatures = {
    appActivity: {
        enabled: boolean,
    },
    tasks: {
        anyTask: boolean,
    },
};

type ContentSidebarFeatures = {
    activityFeed?: ActivityFeedFeatures,
} & FeatureConfig;

type NavigateOptions = {
    isToggle?: boolean,
};

type AdditionalVersionInfo = {
    currentVersionId?: ?string,
    updateVersionToCurrent: () => void,
};
