/**
 * @flow
 * @file Global constants
 * @author Box
 */

import Browser from './util/Browser';

/* ----------------------- Size ---------------------------- */
export const SIZE_SMALL: 'small' = 'small';
export const SIZE_LARGE: 'large' = 'large';
export const SIZE_MEDIUM: 'medium' = 'medium';

/* ----------------------- Views ---------------------------- */
export const VIEW_FOLDER: 'folder' = 'folder';
export const VIEW_SEARCH: 'search' = 'search';
export const VIEW_SELECTED: 'selected' = 'selected';
export const VIEW_RECENTS: 'recents' = 'recents';
export const VIEW_ERROR: 'error' = 'error';
export const VIEW_UPLOAD_EMPTY: 'upload-empty' = 'upload-empty';
export const VIEW_UPLOAD_IN_PROGRESS: 'upload-inprogress' = 'upload-inprogress';
export const VIEW_UPLOAD_SUCCESS: 'upload-success' = 'upload-success';

/* ----------------------- Types ---------------------------- */
export const TYPE_FOLDER: 'folder' = 'folder';
export const TYPE_FILE: 'file' = 'file';
export const TYPE_WEBLINK: 'web_link' = 'web_link';

/* -------------------- Typed Prefix-------------------------- */
export const TYPED_ID_FOLDER_PREFIX = 'folder_';
export const TYPED_ID_FILE_PREFIX = 'file_';
export const TYPED_ID_WEBLINK_PREFIX = 'web_link_';

/* ----------------- Cache Key Prefix ----------------------- */
export const CACHE_PREFIX_FOLDER = TYPED_ID_FOLDER_PREFIX;
export const CACHE_PREFIX_FILE = TYPED_ID_FILE_PREFIX;
export const CACHE_PREFIX_WEBLINK = TYPED_ID_WEBLINK_PREFIX;
export const CACHE_PREFIX_SEARCH = 'search_';
export const CACHE_PREFIX_RECENTS = 'recents_';

/* ----------------------- Sorts ---------------------------- */
export const SORT_ASC: 'ASC' = 'ASC';
export const SORT_DESC: 'DESC' = 'DESC';
export const SORT_NAME: 'name' = 'name';
export const SORT_DATE: 'date' = 'date';
export const SORT_SIZE: 'size' = 'size';

/* -------------------- Shared access ----------------------- */
export const ACCESS_NONE: 'none' = 'none';
export const ACCESS_OPEN: 'open' = 'open';
export const ACCESS_COLLAB: 'collaborators' = 'collaborators';
export const ACCESS_COMPANY: 'company' = 'company';

/* ----------------------- Headers -------------------------- */
export const HEADER_ACCEPT = 'Accept';
export const HEADER_CONTENT_TYPE = 'Content-Type';
export const HEADER_CLIENT_NAME = 'X-Box-Client-Name';
export const HEADER_CLIENT_VERSION = 'X-Box-Client-Version';

/* ------------------ Metadata  ---------------------- */
export const KEY_CLASSIFICATION = 'securityClassification-6VMVochwUWo';
export const KEY_CLASSIFICATION_TYPE = 'Box__Security__Classification__Key';

/* ----------------------- Fields --------------------------- */
export const FIELD_ID = 'id';
export const FIELD_NAME: 'name' = 'name';
export const FIELD_TYPE = 'type';
export const FIELD_SIZE: 'size' = 'size';
export const FIELD_PARENT = 'parent';
export const FIELD_EXTENSION = 'extension';
export const FIELD_ITEM_EXPIRATION = 'expires_at';
export const FIELD_PERMISSIONS = 'permissions';
export const FIELD_ITEM_COLLECTION = 'item_collection';
export const FIELD_PATH_COLLECTION = 'path_collection';
export const FIELD_MODIFIED_AT: 'modified_at' = 'modified_at';
export const FIELD_CREATED_AT = 'created_at';
export const FIELD_INTERACTED_AT: 'interacted_at' = 'interacted_at';
export const FIELD_SHARED_LINK = 'shared_link';
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
export const FIELD_DESCRIPTION = 'description';
export const FIELD_REPRESENTATIONS = 'representations';
export const FIELD_SHA1 = 'sha1';
export const FIELD_WATERMARK_INFO = 'watermark_info';
export const FIELD_AUTHENTICATED_DOWNLOAD_URL = 'authenticated_download_url';
export const FIELD_FILE_VERSION = 'file_version';
export const FIELD_IS_DOWNLOAD_AVAILABLE = 'is_download_available';
export const FIELD_VERSION_NUMBER = 'version_number';
export const FIELD_METADATA_SKILLS = 'metadata.global.boxSkillsCards';
export const FIELD_METADATA_CLASSIFICATION = `metadata.enterprise.${KEY_CLASSIFICATION}`;
export const FIELD_DUE_AT = 'due_at';
export const FIELD_TASK_ASSIGNMENT_COLLECTION = 'task_assignment_collection';
export const FIELD_IS_COMPLETED = 'is_completed';
export const FIELD_MESSAGE = 'message';
export const FIELD_TAGGED_MESSAGE = 'tagged_message';
export const FIELD_TRASHED_AT = 'trashed_at';
export const FIELD_ASSIGNED_TO = 'assigned_to';
export const FIELD_RESOLUTION_STATE = 'resolution_state';
export const METADATA_SKILLS = 'metadata.global.boxSkillsCards';
export const METADATA_CLASSIFICATION = 'metadata.enterprise.securityClassification-6VMVochwUWo';

/* ----------------------- Permissions --------------------------- */
export const PERMISSION_CAN_PREVIEW = 'can_preview';
export const PERMISSION_CAN_RENAME = 'can_rename';
export const PERMISSION_CAN_DOWNLOAD = 'can_download';
export const PERMISSION_CAN_DELETE = 'can_delete';
export const PERMISSION_CAN_UPLOAD = 'can_upload';
export const PERMISSION_CAN_SHARE = 'can_share';
export const PERMISSION_CAN_SET_SHARE_ACCESS = 'can_set_share_access';
export const PERMISSION_CAN_COMMENT = 'can_comment';
export const PERMISSION_CAN_EDIT = 'can_edit';

/* ------------- Delimiters for bread crumbs ---------------- */
export const DELIMITER_SLASH: 'slash' = 'slash';
export const DELIMITER_CARET: 'caret' = 'caret';

/* ---------------------- Defaults -------------------------- */
export const DEFAULT_PREVIEW_VERSION = '1.46.0';
export const DEFAULT_PREVIEW_LOCALE = 'en-US';
export const DEFAULT_PATH_STATIC = 'platform/elements';
export const DEFAULT_PATH_STATIC_PREVIEW = 'platform/preview';
export const DEFAULT_HOSTNAME_API = 'https://api.box.com';
export const DEFAULT_HOSTNAME_STATIC = 'https://cdn01.boxcdn.net';
export const DEFAULT_HOSTNAME_UPLOAD = 'https://upload.box.com';
export const DEFAULT_HOSTNAME_APP = 'https://app.box.com';
export const DEFAULT_CONTAINER = 'body';
export const DEFAULT_ROOT = '0';
export const DEFAULT_SEARCH_DEBOUNCE = 500;
export const DEFAULT_COLLAB_DEBOUNCE = 500;
export const DEFAULT_MAX_COLLABORATORS = 5;
export const DEFAULT_VIEW_FILES: 'files' = 'files';
export const DEFAULT_VIEW_RECENTS: 'recents' = 'recents';
export const CLIENT_NAME_CONTENT_TREE = 'ContentTree';
export const CLIENT_NAME_CONTENT_PICKER = 'ContentPicker';
export const CLIENT_NAME_FILE_PICKER = 'FilePicker';
export const CLIENT_NAME_FOLDER_PICKER = 'FolderPicker';
export const CLIENT_NAME_CONTENT_UPLOADER = 'ContentUploader';
export const CLIENT_NAME_CONTENT_EXPLORER = 'ContentExplorer';
export const CLIENT_NAME_CONTENT_PREVIEW = 'ContentPreview';
export const CLIENT_NAME_CONTENT_SIDEBAR = 'ContentSidebar';

/* ---------------------- Statuses  -------------------------- */
export const STATUS_PENDING: 'pending' = 'pending';
export const STATUS_IN_PROGRESS: 'inprogress' = 'inprogress';
export const STATUS_COMPLETE: 'complete' = 'complete';
export const STATUS_ERROR: 'error' = 'error';

/* ------------------- Styles ------------------------ */
export const CLASS_MODAL_CONTENT = 'be-modal-dialog-content';
export const CLASS_MODAL_CONTENT_FULL_BLEED = 'be-modal-dialog-content-full-bleed';
export const CLASS_MODAL_OVERLAY = 'be-modal-dialog-overlay';
export const CLASS_IS_SMALL = 'be-is-small';
export const CLASS_IS_MEDIUM = 'be-is-medium';
export const CLASS_IS_TOUCH = 'be-is-touch';
export const CLASS_MODAL = 'be-modal';

/* ------------------ Error Codes  ---------------------- */
export const ERROR_CODE_ITEM_NAME_INVALID = 'item_name_invalid';
export const ERROR_CODE_ITEM_NAME_TOO_LONG = 'item_name_too_long';
export const ERROR_CODE_ITEM_NAME_IN_USE = 'item_name_in_use';
export const ERROR_CODE_UPLOAD_FILE_LIMIT = 'upload_file_limit';

/* ------------- Representation Hints  ------------------- */
const X_REP_HINT_BASE = '[3d][pdf][text][mp3]';
const X_REP_HINT_DOC_THUMBNAIL = '[jpg?dimensions=1024x1024&paged=false]';
const X_REP_HINT_IMAGE = '[jpg?dimensions=2048x2048,png?dimensions=2048x2048]';
const X_REP_HINT_VIDEO_DASH = '[dash,mp4][filmstrip]';
const X_REP_HINT_VIDEO_MP4 = '[mp4]';
const videoHint = Browser.canPlayDash() ? X_REP_HINT_VIDEO_DASH : X_REP_HINT_VIDEO_MP4;
export const X_REP_HINTS = `${X_REP_HINT_BASE}${X_REP_HINT_DOC_THUMBNAIL}${X_REP_HINT_IMAGE}${videoHint}`;

/* ------------------ Uploader  ---------------------- */
export const DEFAULT_RETRY_DELAY_MS = 3000;
export const MS_IN_S = 1000;

/* ------------------ Colors  ---------------------- */
export const COLOR_RED = '#c82341';
export const COLOR_999 = '#999';
export const COLOR_WHITE = '#fff';

/* ------------------ Skills  ---------------------- */
export const SKILLS_TRANSCRIPT: 'transcript' = 'transcript';
export const SKILLS_KEYWORD: 'keyword' = 'keyword';
export const SKILLS_TIMELINE: 'timeline' = 'timeline';
export const SKILLS_FACE: 'face' = 'face';
export const SKILLS_STATUS: 'status' = 'status';
export const SKILLS_INTERNAL_SERVER_ERROR = 'skills_internal_server_error';
export const SKILLS_UNKNOWN_ERROR = 'skills_unknown_error';
export const SKILLS_INVALID_FILE_SIZE = 'skills_invalid_file_size_error';
export const SKILLS_INVALID_FILE_FORMAT = 'skills_invalid_file_format_error';
export const SKILLS_NO_INFO_FOUND = 'skills_no_info_found_error';
export const SKILLS_PENDING = 'skills_pending_status';

/* ------------------ File Extensions  ---------------------- */
export const FILE_EXTENSION_BOX_NOTE = 'boxnote';

/* ------------------ Sidebar View  ---------------------- */
export const SIDEBAR_VIEW_SKILLS: 'skills' = 'skills';
export const SIDEBAR_VIEW_DETAILS: 'details' = 'details';
export const SIDEBAR_VIEW_METADATA: 'metadata' = 'metadata';
export const SIDEBAR_VIEW_ACTIVITY: 'activity' = 'activity';

/* ------------------ HTTP Requests  ---------------------- */
export const HTTP_GET: 'get' = 'get';
export const HTTP_POST: 'post' = 'post';
export const HTTP_PUT: 'put' = 'put';
export const HTTP_DELETE: 'delete' = 'delete';
export const HTTP_OPTIONS: 'options' = 'options';
export const HTTP_HEAD: 'head' = 'head';
