/**
 * @flow
 * @file Global constants
 * @author Box
 */

import Browser from './utils/Browser';

/* ------------------------ API ---------------------------- */
export const API_PAGE_LIMIT = 1000; // default limit for paginated api calls

/* ----------------------- Size ---------------------------- */
export const SIZE_LARGE: 'large' = 'large';
export const SIZE_MEDIUM: 'medium' = 'medium';
export const SIZE_SMALL: 'small' = 'small';
export const SIZE_VERY_LARGE: 'very_large' = 'very_large';

/* ----------------------- Views ---------------------------- */
export const VIEW_FOLDER: 'folder' = 'folder';
export const VIEW_SEARCH: 'search' = 'search';
export const VIEW_SELECTED: 'selected' = 'selected';
export const VIEW_RECENTS: 'recents' = 'recents';
export const VIEW_ERROR: 'error' = 'error';
export const VIEW_UPLOAD_EMPTY: 'upload-empty' = 'upload-empty';
export const VIEW_UPLOAD_IN_PROGRESS: 'upload-inprogress' = 'upload-inprogress';
export const VIEW_UPLOAD_SUCCESS: 'upload-success' = 'upload-success';
export const VIEW_METADATA: 'metadata' = 'metadata';

/* ----------------------- ViewModes ---------------------------- */
export const VIEW_MODE_LIST: 'list' = 'list';
export const VIEW_MODE_GRID: 'grid' = 'grid';

/* ----------------------- Types ---------------------------- */
export const TYPE_FOLDER: 'folder' = 'folder';
export const TYPE_FILE: 'file' = 'file';
export const TYPE_WEBLINK: 'web_link' = 'web_link';

/* ----------------------- Archive Types ---------------------------- */
export const TYPE_ARCHIVE: 'archive' = 'archive';
export const TYPE_ARCHIVE_FOLDER: 'folder_archive' = 'folder_archive';
export const TYPE_ARCHIVE_FILE: 'file' = 'file';
export const TYPE_ARCHIVE_WEB_LINK: 'web_link' = 'web_link';

/* ----------------------- Feed Items Types ---------------------------- */
export const FEED_ITEM_TYPE_APP_ACTIVITY: 'app_activity' = 'app_activity';
export const FEED_ITEM_TYPE_ANNOTATION: 'annotation' = 'annotation';
export const FEED_ITEM_TYPE_COMMENT: 'comment' = 'comment';
export const FEED_ITEM_TYPE_TASK: 'task' = 'task';
export const FEED_ITEM_TYPE_VERSION: 'file_version' = 'file_version';

/* -------------------- Typed Prefix-------------------------- */
export const TYPED_ID_FOLDER_PREFIX = 'folder_';
export const TYPED_ID_FILE_PREFIX = 'file_';
export const TYPED_ID_WEBLINK_PREFIX = 'web_link_';
export const TYPED_ID_FEED_PREFIX = 'feedItems_';

/* ----------------- Cache Key Prefix ----------------------- */
export const CACHE_PREFIX_FOLDER = TYPED_ID_FOLDER_PREFIX;
export const CACHE_PREFIX_FILE = TYPED_ID_FILE_PREFIX;
export const CACHE_PREFIX_WEBLINK = TYPED_ID_WEBLINK_PREFIX;
export const CACHE_PREFIX_SEARCH = 'search_';
export const CACHE_PREFIX_RECENTS = 'recents_';
export const CACHE_PREFIX_METADATA = 'metadata_';
export const CACHE_PREFIX_METADATA_QUERY = 'metadata_query_';

/* ----------------------- Sorts ---------------------------- */
export const SORT_ASC: 'ASC' = 'ASC';
export const SORT_DESC: 'DESC' = 'DESC';

/* -------------------- Shared access ----------------------- */
export const ACCESS_NONE: 'none' = 'none';
export const ACCESS_OPEN: 'open' = 'open';
export const ACCESS_COLLAB: 'collaborators' = 'collaborators';
export const ACCESS_COMPANY: 'company' = 'company';

/* ----------------------- Headers -------------------------- */
export const HEADER_ACCEPT = 'Accept';
export const HEADER_CONTENT_TYPE = 'Content-Type';
export const HEADER_RETRY_AFTER = 'Retry-After';
export const HEADER_CLIENT_NAME = 'X-Box-Client-Name';
export const HEADER_CLIENT_VERSION = 'X-Box-Client-Version';
export const HEADER_ACCEPT_LANGUAGE = 'Accept-Language';

/* ------------------ Metadata ---------------------- */
export const KEY_CLASSIFICATION_TYPE = 'Box__Security__Classification__Key';
export const METADATA_TEMPLATE_ARCHIVE = 'archivedItemTemplate';
export const METADATA_TEMPLATE_CLASSIFICATION = 'securityClassification-6VMVochwUWo';
export const METADATA_TEMPLATE_SKILLS = 'boxSkillsCards';
export const METADATA_TEMPLATE_PROPERTIES = 'properties';
export const METADATA_SCOPE_GLOBAL = 'global';
export const METADATA_SCOPE_ENTERPRISE = 'enterprise';
export const METADATA_TEMPLATE_FETCH_LIMIT = API_PAGE_LIMIT;
export const METADATA_SUGGESTIONS_CONFIDENCE_EXPERIMENTAL = 'experimental';
export const SUCCESS_CODE_UPDATE_METADATA_TEMPLATE_INSTANCE = 'update_metadata_template_instance_success';
export const SUCCESS_CODE_DELETE_METADATA_TEMPLATE_INSTANCE = 'delete_metadata_template_instance_success';

/* ----------------------- Fields --------------------------- */
export const FIELD_ID = 'id';
export const FIELD_DATE: 'date' = 'date';
export const FIELD_NAME: 'name' = 'name';
export const FIELD_TYPE = 'type';
export const FIELD_SIZE: 'size' = 'size';
export const FIELD_PARENT = 'parent';
export const FIELD_EXTENSION = 'extension';
export const FIELD_ITEM_EXPIRATION = 'expires_at';
export const FIELD_PERMISSIONS = 'permissions';
export const FIELD_PERMISSIONS_CAN_SHARE = `${FIELD_PERMISSIONS}.can_share`;
export const FIELD_PERMISSIONS_CAN_UPLOAD = `${FIELD_PERMISSIONS}.can_upload`;
export const FIELD_ITEM_COLLECTION = 'item_collection';
export const FIELD_PATH_COLLECTION = 'path_collection';
export const FIELD_CONTENT_CREATED_AT: 'content_created_at' = 'content_created_at';
export const FIELD_CONTENT_MODIFIED_AT: 'content_modified_at' = 'content_modified_at';
export const FIELD_MODIFIED_AT: 'modified_at' = 'modified_at';
export const FIELD_RESTORED_AT = 'restored_at';
export const FIELD_RESTORED_FROM = 'restored_from';
export const FIELD_CREATED_AT = 'created_at';
export const FIELD_INTERACTED_AT: 'interacted_at' = 'interacted_at';
export const FIELD_SHARED_LINK = 'shared_link';
export const FIELD_SHARED_LINK_ACCESS_LEVELS_DISABLED_REASONS: 'allowed_shared_link_access_levels_disabled_reasons' =
    'allowed_shared_link_access_levels_disabled_reasons';
export const FIELD_SHARED_LINK_FEATURES: 'shared_link_features' = 'shared_link_features';
export const FIELD_ALLOWED_INVITEE_ROLES: 'allowed_invitee_roles' = 'allowed_invitee_roles';
export const FIELD_ALLOWED_SHARED_LINK_ACCESS_LEVELS = 'allowed_shared_link_access_levels';
export const FIELD_HAS_COLLABORATIONS = 'has_collaborations';
export const FIELD_IS_EXTERNALLY_OWNED = 'is_externally_owned';
export const FIELD_TOTAL_COUNT = 'total_count';
export const FIELD_ENTRIES = 'entries';
export const FIELD_DOWNLOAD_URL = 'download_url';
export const FIELD_ACCESS = 'access';
export const FIELD_URL = 'url';
export const FIELD_CREATED_BY = 'created_by';
export const FIELD_MODIFIED_BY = 'modified_by';
export const FIELD_OWNED_BY = 'owned_by';
export const FIELD_PROMOTED_BY = 'promoted_by';
export const FIELD_RESTORED_BY = 'restored_by';
export const FIELD_TRASHED_BY = 'trashed_by';
export const FIELD_DESCRIPTION = 'description';
export const FIELD_REPRESENTATIONS = 'representations';
export const FIELD_SHA1 = 'sha1';
export const FIELD_WATERMARK_INFO = 'watermark_info';
export const FIELD_AUTHENTICATED_DOWNLOAD_URL = 'authenticated_download_url';
export const FIELD_FILE_VERSION = 'file_version';
export const FIELD_IS_DOWNLOAD_AVAILABLE = 'is_download_available';
export const FIELD_VERSION_LIMIT = 'version_limit';
export const FIELD_VERSION_NUMBER = 'version_number';
export const FIELD_METADATA = 'metadata';
export const FIELD_METADATA_ARCHIVE = `${FIELD_METADATA}.${METADATA_SCOPE_GLOBAL}.${METADATA_TEMPLATE_ARCHIVE}`;
export const FIELD_METADATA_SKILLS = `${FIELD_METADATA}.${METADATA_SCOPE_GLOBAL}.${METADATA_TEMPLATE_SKILLS}`;
export const FIELD_METADATA_PROPERTIES = `${FIELD_METADATA}.${METADATA_SCOPE_GLOBAL}.${METADATA_TEMPLATE_PROPERTIES}`;
export const FIELD_METADATA_CLASSIFICATION = `${FIELD_METADATA}.${METADATA_SCOPE_ENTERPRISE}.${METADATA_TEMPLATE_CLASSIFICATION}`;
export const FIELD_DUE_AT = 'due_at';
export const FIELD_TASK_ASSIGNMENT_COLLECTION = 'task_assignment_collection';
export const FIELD_TASK_COLLABORATOR_COLLECTION = 'task_collaborator_collection';
export const FIELD_IS_COMPLETED = 'is_completed';
export const FIELD_MESSAGE = 'message';
export const FIELD_TAGGED_MESSAGE = 'tagged_message';
export const FIELD_TRASHED_AT = 'trashed_at';
export const FIELD_ASSIGNED_TO = 'assigned_to';
export const FIELD_RELEVANCE: '' = '';
export const FIELD_STATUS = 'status';
export const FIELD_ACTIVITY_TEMPLATE: 'activity_template' = 'activity_template';
export const FIELD_APP: 'app' = 'app';
export const FIELD_OCCURRED_AT: 'occurred_at' = 'occurred_at';
export const FIELD_RENDERED_TEXT: 'rendered_text' = 'rendered_text';
export const FIELD_RETENTION: 'retention' = 'retention';
export const FIELD_UPLOADER_DISPLAY_NAME: 'uploader_display_name' = 'uploader_display_name';
export const FIELD_CLASSIFICATION: 'classification' = 'classification';
export const FIELD_ENTERPRISE: 'enterprise' = 'enterprise';
export const FIELD_HOSTNAME: 'hostname' = 'hostname';

/* ----------------------- Permissions --------------------------- */
export const PERMISSION_CAN_COMMENT = 'can_comment';
export const PERMISSION_CAN_CREATE_ANNOTATIONS = 'can_create_annotations';
export const PERMISSION_CAN_DELETE = 'can_delete';
export const PERMISSION_CAN_DOWNLOAD = 'can_download';
export const PERMISSION_CAN_EDIT = 'can_edit';
export const PERMISSION_CAN_PREVIEW = 'can_preview';
export const PERMISSION_CAN_RENAME = 'can_rename';
export const PERMISSION_CAN_RESOLVE = 'can_resolve';
export const PERMISSION_CAN_SET_SHARE_ACCESS = 'can_set_share_access';
export const PERMISSION_CAN_SHARE = 'can_share';
export const PERMISSION_CAN_UPLOAD = 'can_upload';
export const PERMISSION_CAN_VIEW_ANNOTATIONS = 'can_view_annotations';

/* --------------------- Invitee roles --------------------------- */
export const INVITEE_ROLE_EDITOR: 'editor' = 'editor';

/* ------------- Delimiters for bread crumbs ---------------- */
export const DELIMITER_SLASH: 'slash' = 'slash';
export const DELIMITER_CARET: 'caret' = 'caret';

/* ---------------------- Defaults -------------------------- */
export const DEFAULT_PREVIEW_VERSION = '2.106.0';
export const DEFAULT_LOCALE = 'en-US';
export const DEFAULT_PATH_STATIC = 'platform/elements';
export const DEFAULT_PATH_STATIC_PREVIEW = 'platform/preview';
export const DEFAULT_HOSTNAME_API = 'https://api.box.com';
export const DEFAULT_HOSTNAME_STATIC = 'https://cdn01.boxcdn.net';
export const DEFAULT_HOSTNAME_UPLOAD = 'https://upload.box.com';
export const DEFAULT_HOSTNAME_UPLOAD_APP = 'https://upload.app.box.com';
export const DEFAULT_HOSTNAME_UPLOAD_GOV = 'https://upload.app.box-gov.com';
export const DEFAULT_HOSTNAME_APP = 'https://app.box.com';
export const DEFAULT_CONTAINER = 'body';
export const DEFAULT_ROOT = '0';
export const DEFAULT_SEARCH_DEBOUNCE = 500;
export const DEFAULT_COLLAB_DEBOUNCE = 500;
export const DEFAULT_FORMAT_DEBOUNCE = 1000;
export const DEFAULT_MAX_COLLABORATORS = 25;
export const DEFAULT_MAX_CONTACTS = 50;
export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 50;
export const DEFAULT_FETCH_START = 0;
export const DEFAULT_FETCH_END = 1000;
export const DEFAULT_VIEW_FILES: 'files' = 'files';
export const DEFAULT_VIEW_RECENTS: 'recents' = 'recents';
export const DEFAULT_VIEW_METADATA: 'metadata' = 'metadata';
export const CLIENT_NAME_CONTENT_EXPLORER: 'ContentExplorer' = 'ContentExplorer';
export const CLIENT_NAME_OPEN_WITH: 'ContentOpenWith' = 'ContentOpenWith';
export const CLIENT_NAME_CONTENT_PICKER: 'ContentPicker' = 'ContentPicker';
export const CLIENT_NAME_CONTENT_PREVIEW: 'ContentPreview' = 'ContentPreview';
export const CLIENT_NAME_CONTENT_SHARING: 'ContentSharing' = 'ContentSharing';
export const CLIENT_NAME_CONTENT_SIDEBAR: 'ContentSidebar' = 'ContentSidebar';
export const CLIENT_NAME_CONTENT_UPLOADER: 'ContentUploader' = 'ContentUploader';
export const CLIENT_NAME_FILE_PICKER: 'FilePicker' = 'FilePicker';
export const CLIENT_NAME_FOLDER_PICKER: 'FolderPicker' = 'FolderPicker';

/* ---------------------- Statuses -------------------------- */
export const STATUS_PENDING: 'pending' = 'pending';
export const STATUS_IN_PROGRESS: 'inprogress' = 'inprogress';
export const STATUS_STAGED: 'staged' = 'staged';
export const STATUS_COMPLETE: 'complete' = 'complete';
export const STATUS_ERROR: 'error' = 'error';
export const STATUS_ACCEPTED: 'accepted' = 'accepted';
export const STATUS_INACTIVE: 'inactive' = 'inactive';

/* ------------------- Styles ------------------------ */
export const CLASS_MODAL_CONTENT = 'be-modal-dialog-content';
export const CLASS_MODAL_CONTENT_FULL_BLEED = 'be-modal-dialog-content-full-bleed';
export const CLASS_MODAL_OVERLAY = 'be-modal-dialog-overlay';
export const CLASS_IS_SMALL = 'be-is-small';
export const CLASS_IS_MEDIUM = 'be-is-medium';
export const CLASS_IS_TOUCH = 'be-is-touch';
export const CLASS_MODAL = 'be-modal';
export const CLASS_INTEGRATION_ICON = 'bcow-integration-icon';
export const OVERLAY_WRAPPER_CLASS = 'overlay-wrapper';

/* ------------------ Error Codes ---------------------- */
export const ERROR_CODE_ITEM_NAME_INVALID = 'item_name_invalid';
export const ERROR_CODE_ITEM_NAME_TOO_LONG = 'item_name_too_long';
export const ERROR_CODE_ITEM_NAME_IN_USE = 'item_name_in_use';
export const ERROR_CODE_UPLOAD_FILE_LIMIT = 'upload_file_limit';
export const ERROR_CODE_UPLOAD_CHILD_FOLDER_FAILED = 'child_folder_failed_upload';
export const ERROR_CODE_UPLOAD_STORAGE_LIMIT_EXCEEDED = 'storage_limit_exceeded';
export const ERROR_CODE_UPLOAD_FILE_SIZE_LIMIT_EXCEEDED = 'file_size_limit_exceeded';
export const ERROR_CODE_UPLOAD_PENDING_APP_FOLDER_SIZE_LIMIT = 'pending_app_folder_size_limit';
export const ERROR_CODE_UPLOAD_BAD_DIGEST = 'bad_digest';
export const ERROR_CODE_UPLOAD_FAILED_PACKAGE = 'failed_package_upload';
export const ERROR_CODE_FETCH_ACTIVITY = 'fetch_activity_error';
export const ERROR_CODE_FETCH_ANNOTATION = 'fetch_annotation_error';
export const ERROR_CODE_FETCH_ANNOTATIONS = 'fetch_annotations_error';
export const ERROR_CODE_FETCH_FILE = 'fetch_file_error';
export const ERROR_CODE_FETCH_FILE_DUE_TO_POLICY = 'forbidden_by_policy';
export const ERROR_CODE_FETCH_FOLDER = 'fetch_folder_error';
export const ERROR_CODE_FETCH_WEBLINK = 'fetch_weblink_error';
export const ERROR_CODE_FETCH_CLASSIFICATION = 'fetch_classification_error';
export const ERROR_CODE_FETCH_COMMENT = 'fetch_comment_error';
export const ERROR_CODE_FETCH_COMMENTS = 'fetch_comments_error';
export const ERROR_CODE_FETCH_REPLIES = 'fetch_replies_error';
export const ERROR_CODE_FETCH_VERSION = 'fetch_version_error';
export const ERROR_CODE_FETCH_VERSIONS = 'fetch_versions_error';
export const ERROR_CODE_FETCH_TASKS = 'fetch_tasks_error';
export const ERROR_CODE_FETCH_CURRENT_USER = 'fetch_current_user_error';
export const ERROR_CODE_FETCH_ENTERPRISE_GROUPS: 'fetch_enterprise_groups_error' = 'fetch_enterprise_groups_error';
export const ERROR_CODE_FETCH_ENTERPRISE_USERS: 'fetch_enterprise_users_error' = 'fetch_enterprise_users_error';
export const ERROR_CODE_FETCH_TASK_ASSIGNMENT = 'fetch_task_assignment_error';
export const ERROR_CODE_FETCH_TASK_COLLABORATOR = 'fetch_task_collaborator_error';
export const ERROR_CODE_FETCH_INTEGRATIONS = 'fetch_integrations_error';
export const ERROR_CODE_FETCH_METADATA = 'fetch_metadata_error';
export const ERROR_CODE_FETCH_METADATA_TEMPLATES = 'fetch_metadata_templates_error';
export const ERROR_CODE_FETCH_ACCESS_STATS = 'fetch_access_stats_error';
export const ERROR_CODE_FETCH_SKILLS = 'fetch_skills_error';
export const ERROR_CODE_FETCH_RECENTS = 'fetch_recents_error';
export const ERROR_CODE_FETCH_METADATA_SUGGESTIONS = 'fetch_metadata_suggestions_error';
export const ERROR_CODE_FETCH_METADATA_OPTIONS = 'fetch_metadata_options_error';
export const ERROR_CODE_FETCH_METADATA_TAXONOMY_NODE = 'fetch_metadata_taxonomy_node_error';
export const ERROR_CODE_FETCH_METADATA_TAXONOMY = 'fetch_metadata_taxonomy_error';
export const ERROR_CODE_EMPTY_METADATA_SUGGESTIONS = 'empty_metadata_suggestions_error';
export const ERROR_CODE_EXECUTE_INTEGRATION = 'execute_integrations_error';
export const ERROR_CODE_EXTRACT_STRUCTURED = 'extract_structured_error';
export const ERROR_CODE_CREATE_ANNOTATION = 'create_annotation_error';
export const ERROR_CODE_CREATE_COMMENT = 'create_comment_error';
export const ERROR_CODE_CREATE_REPLY = 'create_reply_error';
export const ERROR_CODE_CREATE_TASK = 'create_task_error';
export const ERROR_CODE_CREATE_TASK_LINK = 'create_task_link_error';
export const ERROR_CODE_CREATE_TASK_ASSIGNMENT = 'create_task_assignment_error';
export const ERROR_CODE_CREATE_TASK_COLLABORATOR = 'create_task_collaborator_error';
export const ERROR_CODE_CREATE_FOLDER = 'create_folder_error';
export const ERROR_CODE_CREATE_METADATA = 'create_metadata_error';
export const ERROR_CODE_DELETE_APP_ACTIVITY = 'delete_app_activity_error';
export const ERROR_CODE_DELETE_ANNOTATION = 'delete_annotation_error';
export const ERROR_CODE_EDIT_ANNOTATION = 'edit_annotation_error';
export const ERROR_CODE_DELETE_COMMENT = 'delete_comment_error';
export const ERROR_CODE_DELETE_TASK = 'delete_task_error';
export const ERROR_CODE_DELETE_TASK_ASSIGNMENT = 'delete_task_assignment_error';
export const ERROR_CODE_DELETE_TASK_COLLABORATOR = 'delete_task_collaborator_error';
export const ERROR_CODE_DELETE_ITEM = 'delete_item_error';
export const ERROR_CODE_DELETE_METADATA = 'delete_metadata_error';
export const ERROR_CODE_DELETE_VERSION = 'delete_version_error';
export const ERROR_CODE_GROUP_EXCEEDS_LIMIT = 'group_exceeds_limit';
export const ERROR_CODE_PROMOTE_VERSION = 'promote_version_error';
export const ERROR_CODE_RESTORE_VERSION = 'restore_version_error';
export const ERROR_CODE_UPDATE_TASK = 'update_task_error';
export const ERROR_CODE_UPDATE_TASK_ASSIGNMENT = 'update_task_assignment_error';
export const ERROR_CODE_UPDATE_TASK_COLLABORATOR = 'update_task_collaborator_error';
export const ERROR_CODE_UPDATE_COMMENT = 'update_comment_error';
export const ERROR_CODE_UPDATE_SKILLS = 'update_skills_error';
export const ERROR_CODE_UPDATE_METADATA = 'update_metadata_error';
export const ERROR_CODE_GET_DOWNLOAD_URL = 'get_download_url_error';
export const ERROR_CODE_RENAME_ITEM = 'rename_item_error';
export const ERROR_CODE_SHARE_ITEM = 'share_item_error';
export const ERROR_CODE_SET_FILE_DESCRIPTION = 'set_file_description_error';
export const ERROR_CODE_UPLOAD = 'upload_error';
export const ERROR_CODE_UNEXPECTED_EXCEPTION = 'unexpected_exception_error';
export const ERROR_CODE_SEARCH = 'search_error';
export const ERROR_CODE_METADATA_QUERY = 'metadata_query_error';
export const ERROR_CODE_UNKNOWN = 'unknown_error';
export const ERROR_CODE_AI_AGENT_DEFAULT = 'ai_agent_default_error';

/* ------------------ Origins ---------------------- */
export const ORIGIN_CONTENT_PREVIEW: 'content_preview' = 'content_preview';
export const ORIGIN_CONTENT_SIDEBAR: 'content_sidebar' = 'content_sidebar';
export const ORIGIN_ACTIVITY_SIDEBAR: 'activity_sidebar' = 'activity_sidebar';
export const ORIGIN_BOXAI_SIDEBAR: 'boxai_sidebar' = 'boxai_sidebar';
export const ORIGIN_DETAILS_SIDEBAR: 'details_sidebar' = 'details_sidebar';
export const ORIGIN_DOCGEN_SIDEBAR: 'docgen_sidebar' = 'docgen_sidebar';
export const ORIGIN_METADATA_SIDEBAR: 'metadata_sidebar' = 'metadata_sidebar';
export const ORIGIN_METADATA_SIDEBAR_REDESIGN: 'metadata_sidebar_redesign' = 'metadata_sidebar_redesign';
export const ORIGIN_SKILLS_SIDEBAR: 'skills_sidebar' = 'skills_sidebar';
export const ORIGIN_VERSIONS_SIDEBAR: 'versions_sidebar' = 'versions_sidebar';
export const ORIGIN_PREVIEW: 'preview' = 'preview';
export const ORIGIN_PREVIEW_SIDEBAR: 'preview_sidebar' = 'preview_sidebar';
export const ORIGIN_CONTENT_EXPLORER: 'content_explorer' = 'content_explorer';
export const ORIGIN_OPEN_WITH: 'open_with' = 'open_with';

/* ------------------ Metric Types ---------------------- */
export const METRIC_TYPE_PREVIEW: 'preview_metric' = 'preview_metric';
export const METRIC_TYPE_ELEMENTS_PERFORMANCE_METRIC: 'elements_performance_metric' = 'elements_performance_metric';
export const METRIC_TYPE_ELEMENTS_LOAD_METRIC: 'elements_load_metric' = 'elements_load_metric';
export const METRIC_TYPE_UAA_PARITY_METRIC = 'uaa_parity_metric';

/* ------------------ Error Keys ---------------------- */
export const IS_ERROR_DISPLAYED = 'isErrorDisplayed'; // used to determine if user will see some error state or message

/* ------------- Representation Hints ------------------- */
const X_REP_HINT_BASE = '[3d][pdf][text][mp3][json]';
const X_REP_HINT_DOC_THUMBNAIL = '[jpg?dimensions=1024x1024&paged=false]';
const X_REP_HINT_IMAGE = '[jpg?dimensions=2048x2048,png?dimensions=2048x2048]';
const X_REP_HINT_VIDEO_DASH = '[dash,mp4][filmstrip]';
const X_REP_HINT_VIDEO_MP4 = '[mp4]';
const videoHint = Browser.canPlayDash() ? X_REP_HINT_VIDEO_DASH : X_REP_HINT_VIDEO_MP4;
export const X_REP_HINTS = `${X_REP_HINT_BASE}${X_REP_HINT_DOC_THUMBNAIL}${X_REP_HINT_IMAGE}${videoHint}`;

/* ------------------ Uploader ---------------------- */
export const DEFAULT_RETRY_DELAY_MS = 3000;
export const MS_IN_S = 1000;

/* ------------------ Colors ---------------------- */
export const COLOR_RED = '#c82341';
export const COLOR_999 = '#999';
export const COLOR_WHITE = '#fff';

/* ------------------ Skills ---------------------- */
export const SKILLS_TRANSCRIPT: 'transcript' = 'transcript';
export const SKILLS_KEYWORD: 'keyword' = 'keyword';
export const SKILLS_TIMELINE: 'timeline' = 'timeline';
export const SKILLS_FACE: 'face' = 'face';
export const SKILLS_STATUS: 'status' = 'status';
export const SKILLS_ERROR_INVOCATIONS = 'skills_invocations_error';
export const SKILLS_ERROR_BILLING = 'skills_billing_error';
export const SKILLS_ERROR_EXTERNAL_AUTH = 'skills_external_auth_error';
export const SKILLS_ERROR_UNKNOWN = 'skills_unknown_error';
export const SKILLS_ERROR_INVALID_FILE_SIZE = 'skills_invalid_file_size_error';
export const SKILLS_ERROR_INVALID_FILE_FORMAT = 'skills_invalid_file_format_error';
export const SKILLS_ERROR_FILE_PROCESSING = 'skills_file_processing_error';
export const SKILLS_STATUS_PENDING = 'skills_pending_status';
export const SKILLS_STATUS_INVOKED = 'skills_invoked_status';

/* ------------------ File Extensions ---------------------- */
export const FILE_EXTENSION_BOX_CANVAS = 'boxcanvas';
export const FILE_EXTENSION_BOX_NOTE = 'boxnote';
export const FILE_EXTENSION_GOOGLE_DOC = 'gdoc';
export const FILE_EXTENSION_GOOGLE_SHEET = 'gsheet';
export const FILE_EXTENSION_GOOGLE_SLIDE = 'gslides';
export const FILE_EXTENSION_GOOGLE_SLIDE_LEGACY = 'gslide';

/* ------------------ X-Rep-Hints ---------------------- */
// available dimensions for JPG: "32x32", "94x94", "160x160", "320x320", "1024x1024", "2048x2048"
export const X_REP_HINT_JPG_DIMENSIONS_DEFAULT: '1024x1024' = '1024x1024';

// available dimensions for PNG: "1024x1024", "2048x2048"
export const X_REP_HINT_PNG_DIMENSIONS_DEFAULT: '1024x1024' = '1024x1024';

// If unable to fetch jpg thumbnail, grab png rep of first page. Certain file types do not have a thumbnail rep but do have a first page rep.
// Get the PDF rep as well, which ensures that the Preview SDK loads linearized reps for customers with PDF optimization enabled.
// Get the text rep as well, which ensures that large text files load in the Preview SDK.
export const X_REP_HINT_HEADER_DIMENSIONS_DEFAULT = `[jpg?dimensions=${X_REP_HINT_JPG_DIMENSIONS_DEFAULT}&paged=false,png?dimensions=${X_REP_HINT_PNG_DIMENSIONS_DEFAULT}][pdf][text]`;

/* ------------------ Representations Response ---------- */
export const REPRESENTATIONS_RESPONSE_ERROR: 'error' = 'error';
export const REPRESENTATIONS_RESPONSE_NONE: 'none' = 'none';
export const REPRESENTATIONS_RESPONSE_PENDING: 'pending' = 'pending';
export const REPRESENTATIONS_RESPONSE_SUCCESS: 'success' = 'success';
export const REPRESENTATIONS_RESPONSE_VIEWABLE: 'viewable' = 'viewable';

/* ------------------ Sidebar View ---------------------- */
export const SIDEBAR_VIEW_SKILLS: 'skills' = 'skills';
export const SIDEBAR_VIEW_DETAILS: 'details' = 'details';
export const SIDEBAR_VIEW_METADATA: 'metadata' = 'metadata';
export const SIDEBAR_VIEW_METADATA_REDESIGN: 'metadata_redesign' = 'metadata_redesign';
export const SIDEBAR_VIEW_BOXAI: 'boxai' = 'boxai';
export const SIDEBAR_VIEW_ACTIVITY: 'activity' = 'activity';
export const SIDEBAR_VIEW_VERSIONS: 'versions' = 'versions';
export const SIDEBAR_VIEW_DOCGEN: 'docgen' = 'docgen';

/* ------------------ HTTP Requests ---------------------- */
export const HTTP_GET: 'GET' = 'GET';
export const HTTP_POST: 'POST' = 'POST';
export const HTTP_PUT: 'PUT' = 'PUT';
export const HTTP_DELETE: 'DELETE' = 'DELETE';
export const HTTP_OPTIONS: 'OPTIONS' = 'OPTIONS';
export const HTTP_HEAD: 'HEAD' = 'HEAD';

/* ------------------ HTTP Codes  ---------------------- */
export const HTTP_STATUS_CODE_BAD_REQUEST: 400 = 400;
export const HTTP_STATUS_CODE_UNAUTHORIZED: 401 = 401;
export const HTTP_STATUS_CODE_FORBIDDEN: 403 = 403;
export const HTTP_STATUS_CODE_NOT_FOUND: 404 = 404;
export const HTTP_STATUS_CODE_CONFLICT: 409 = 409;
export const HTTP_STATUS_CODE_RATE_LIMIT: 429 = 429;
export const HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR: 500 = 500;
export const HTTP_STATUS_CODE_NOT_IMPLEMENTED: 501 = 501;
export const HTTP_STATUS_CODE_BAD_GATEWAY: 502 = 502;
export const HTTP_STATUS_CODE_SERVICE_UNAVAILABLE: 503 = 503;
export const HTTP_STATUS_CODE_GATEWAY_TIMEOUT: 504 = 504;

/* ------------------ Version Action Types  ---------------------- */
export const VERSION_DELETE_ACTION: 'delete' = 'delete';
export const VERSION_PROMOTE_ACTION: 'promote' = 'promote';
export const VERSION_RESTORE_ACTION: 'restore' = 'restore';
export const VERSION_UPLOAD_ACTION: 'upload' = 'upload';

/* ------------------ Version Retention Policy Action Types  ---------------------- */
export const VERSION_RETENTION_DELETE_ACTION: 'permanently_delete' = 'permanently_delete';
export const VERSION_RETENTION_REMOVE_ACTION: 'remove_retention' = 'remove_retention';
export const VERSION_RETENTION_INDEFINITE: 'indefinite' = 'indefinite';

/* ------------------ Placeholder Feed Items ------------------------- */
export const PLACEHOLDER_USER = { type: 'user', id: '2', name: '' };
export const FILE_REQUEST_NAME = 'File Request';

/* ------------------ Open With ------------------------- */
export const APP_INTEGRATION: 'app_integration' = 'app_integration';
export const BOX_EDIT_INTEGRATION_ID = '1338';
export const BOX_EDIT_SFC_INTEGRATION_ID = '13418';
export const OPEN_WITH_BUTTON_ICON_SIZE = 26;
export const OPEN_WITH_MENU_ITEM_ICON_SIZE = 30;

/* ------------------ Task Statuses ----------------- */
export const TASK_NEW_APPROVED: 'APPROVED' = 'APPROVED';
export const TASK_NEW_COMPLETED: 'COMPLETED' = 'COMPLETED';
export const TASK_NEW_NOT_STARTED: 'NOT_STARTED' = 'NOT_STARTED';
export const TASK_NEW_IN_PROGRESS: 'IN_PROGRESS' = 'IN_PROGRESS';
export const TASK_NEW_REJECTED: 'REJECTED' = 'REJECTED';

/* ------------------ Task types ----------------- */
export const TASK_TYPE_GENERAL: 'GENERAL' = 'GENERAL';
export const TASK_TYPE_APPROVAL: 'APPROVAL' = 'APPROVAL';

/* ----------------- Task Completion Rules ------------ */
export const TASK_COMPLETION_RULE_ALL: 'ALL_ASSIGNEES' = 'ALL_ASSIGNEES';
export const TASK_COMPLETION_RULE_ANY: 'ANY_ASSIGNEE' = 'ANY_ASSIGNEE';

/* ----------------- Task Edit modes ---------------- */
export const TASK_EDIT_MODE_CREATE: 'CREATE' = 'CREATE';
export const TASK_EDIT_MODE_EDIT: 'EDIT' = 'EDIT';

/* ----------------- Task Validation ---------------- */
export const TASK_MAX_GROUP_ASSIGNEES: 250 = 250;

/* ------------------ Comment (and Annotation) Statuses ----------------- */
export const COMMENT_STATUS_OPEN: 'open' = 'open';
export const COMMENT_STATUS_RESOLVED: 'resolved' = 'resolved';

/* ------------------ Activity Filter Options ------------------ */
export const ACTIVITY_FILTER_OPTION_ALL: 'all' = 'all';
export const ACTIVITY_FILTER_OPTION_RESOLVED: 'resolved' = 'resolved';
export const ACTIVITY_FILTER_OPTION_TASKS: 'tasks' = 'tasks';
export const ACTIVITY_FILTER_OPTION_UNRESOLVED: 'open' = 'open';

/* ------------------ File Activity Action Types ----------- */
export const ACTION_TYPE_CREATED: 'created' = 'created';
export const ACTION_TYPE_RESTORED: 'restored' = 'restored';
export const ACTION_TYPE_PROMOTED: 'promoted' = 'promoted';
export const ACTION_TYPE_TRASHED: 'trashed' = 'trashed';

/* ------------------ File Activity Types ------------------ */
export const FILE_ACTIVITY_TYPE_ANNOTATION: 'annotation' = 'annotation';
export const FILE_ACTIVITY_TYPE_APP_ACTIVITY: 'app_activity' = 'app_activity';
export const FILE_ACTIVITY_TYPE_COMMENT: 'comment' = 'comment';
export const FILE_ACTIVITY_TYPE_TASK: 'task' = 'task';
export const FILE_ACTIVITY_TYPE_VERSION: 'versions' = 'versions';

/* ----------------- Theme ---------------------------*/
export const THEME_VERY_DARK = 'vDark';
export const THEME_DARK = 'dark';
export const THEME_MID_DARK = 'midDark';
export const THEME_MIDTONE = 'midTone';
export const THEME_MID_LIGHT = 'midLight';
export const THEME_VERY_LIGHT = 'vLight';

/* ------------------ Keyboard Events ----------------- */
export const KEYS = {
    arrowDown: 'ArrowDown',
    arrowLeft: 'ArrowLeft',
    arrowRight: 'ArrowRight',
    arrowUp: 'ArrowUp',
    backspace: 'Backspace',
    enter: 'Enter',
    escape: 'Escape',
    space: ' ',
};

/* ----------------- Other ----------------------- */
export const ONE_HOUR_MS = 3600000; // 60 * 60 * 1000
