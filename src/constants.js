/**
 * @flow
 * @file Global constants
 * @author Box
 */

/* ----------------------- Size ---------------------------- */
export const SIZE_SMALL: 'small' = 'small';
export const SIZE_LARGE: 'large' = 'large';

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

/* ----------------- Cache Key Prefix ----------------------- */
export const CACHE_PREFIX_FOLDER = 'folder_';
export const CACHE_PREFIX_FILE = 'file_';
export const CACHE_PREFIX_WEBLINK = 'web_link_';
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

/* ----------------------- Fields --------------------------- */
export const FIELD_ID = 'id';
export const FIELD_NAME: 'name' = 'name';
export const FIELD_TYPE = 'type';
export const FIELD_SIZE: 'size' = 'size';
export const FIELD_PARENT = 'parent';
export const FIELD_EXTENSION = 'extension';
export const FIELD_PERMISSIONS = 'permissions';
export const FIELD_ITEM_COLLECTION = 'item_collection';
export const FIELD_PATH_COLLECTION = 'path_collection';
export const FIELD_MODIFIED_AT: 'modified_at' = 'modified_at';
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

/* ----------------------- Permissions --------------------------- */
export const PERMISSION_CAN_PREVIEW = 'can_preview';
export const PERMISSION_CAN_RENAME = 'can_rename';
export const PERMISSION_CAN_DOWNLOAD = 'can_download';
export const PERMISSION_CAN_DELETE = 'can_delete';
export const PERMISSION_CAN_UPLOAD = 'can_upload';
export const PERMISSION_CAN_SHARE = 'can_share';
export const PERMISSION_CAN_SET_SHARE_ACCESS = 'can_set_share_access';

/* ------------- Delimiters for bread crumbs ---------------- */
export const DELIMITER_SLASH: 'slash' = 'slash';
export const DELIMITER_CARET: 'caret' = 'caret';

/* ---------------------- Defaults -------------------------- */
export const DEFAULT_PREVIEW_VERSION = '1.2.1';
export const DEFAULT_PREVIEW_LOCALE = 'en-US';
export const DEFAULT_HOSTNAME_API = 'https://api.box.com';
export const DEFAULT_HOSTNAME_STATIC = 'https://cdn01.boxcdn.net';
export const DEFAULT_HOSTNAME_UPLOAD = 'https://upload.box.com';
export const DEFAULT_CONTAINER = 'body';
export const DEFAULT_ROOT = '0';
export const DEFAULT_SEARCH_DEBOUNCE = 500;
export const DEFAULT_VIEW_FILES: 'files' = 'files';
export const DEFAULT_VIEW_RECENTS: 'recents' = 'recents';
export const BOX_BLUE = '#0061d5';
export const BOX_BLUE_LIGHT = '#dbe8f8';
export const COLOR_RED = '#c82341';
export const CLIENT_NAME_CONTENT_TREE = 'ContentTree';
export const CLIENT_NAME_CONTENT_PICKER = 'ContentPicker';
export const CLIENT_NAME_FILE_PICKER = 'FilePicker';
export const CLIENT_NAME_FOLDER_PICKER = 'FolderPicker';
export const CLIENT_NAME_CONTENT_UPLOADER = 'ContentUploader';
export const CLIENT_NAME_CONTENT_EXPLORER = 'ContentExplorer';

/* ---------------------- Statuses  -------------------------- */
export const STATUS_PENDING: 'pending' = 'pending';
export const STATUS_IN_PROGRESS: 'inprogress' = 'inprogress';
export const STATUS_COMPLETE: 'complete' = 'complete';
export const STATUS_ERROR: 'error' = 'error';

/* ------------------- Styles ------------------------ */
export const CLASS_MODAL_CONTENT = 'buik-modal-dialog-content';
export const CLASS_MODAL_CONTENT_FULL_BLEED = 'buik-modal-dialog-content-full-bleed';
export const CLASS_MODAL_OVERLAY = 'buik-modal-dialog-overlay';
export const CLASS_IS_COMPACT = 'buik-is-small';
export const CLASS_IS_TOUCH = 'buik-is-touch';
export const CLASS_MODAL = 'buik-modal';
export const CLASS_BUTTON_CONTENT_SPAN = 'buik-btn-content';
export const CLASS_CHECKBOX_SPAN = 'buik-checkbox-span';

/* --------------- Feilds to fetch via API ----------------- */
export const FIELDS_TO_FETCH = [
    FIELD_NAME,
    FIELD_URL,
    FIELD_TYPE,
    FIELD_SIZE,
    FIELD_PARENT,
    FIELD_EXTENSION,
    FIELD_PERMISSIONS,
    FIELD_ITEM_COLLECTION,
    FIELD_PATH_COLLECTION,
    FIELD_MODIFIED_AT,
    FIELD_SHARED_LINK,
    FIELD_ALLOWED_SHARED_LINK_ACCESS_LEVELS,
    FIELD_HAS_COLLABORATIONS,
    FIELD_IS_EXTERNALLY_OWNED
].join(',');

/* ------------------ Error Codes  ---------------------- */
export const ERROR_CODE_ITEM_NAME_INVALID = 'item_name_invalid';
export const ERROR_CODE_ITEM_NAME_TOO_LONG = 'item_name_too_long';
export const ERROR_CODE_ITEM_NAME_IN_USE = 'item_name_in_use';
