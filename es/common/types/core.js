import { ITEM_TYPE_FOLDER, ITEM_TYPE_FILE, ITEM_TYPE_HUBS, ITEM_TYPE_WEBLINK } from '../constants';
import { ACCESS_OPEN, ACCESS_COLLAB, ACCESS_COMPANY, ACCESS_NONE, VIEW_SEARCH, VIEW_FOLDER, VIEW_ERROR, VIEW_SELECTED, VIEW_RECENTS, VIEW_UPLOAD_EMPTY, VIEW_UPLOAD_IN_PROGRESS, VIEW_UPLOAD_SUCCESS, VIEW_METADATA, SORT_ASC, SORT_DESC, DELIMITER_SLASH, DELIMITER_CARET, SIZE_SMALL, SIZE_MEDIUM, SIZE_LARGE, SIZE_VERY_LARGE, FIELD_DATE, FIELD_NAME, FIELD_SIZE, FIELD_RELEVANCE, DEFAULT_VIEW_RECENTS, DEFAULT_VIEW_FILES, VERSION_RETENTION_DELETE_ACTION, VERSION_RETENTION_REMOVE_ACTION, VERSION_RETENTION_INDEFINITE, PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_PREVIEW } from '../../constants';

// TODO: Investigate some better types for these different maps, perhaps make use
// of generic types like:
// type GenericMap<K, V> = {
//    [K]: V,
// }

// Used for things like collaborator search
// NOTE: PillSelectorDropdown requires an additional "text" or "displayText" field

// reflects an IE11 specific object to support drag
// and drop for file uploads
//# sourceMappingURL=core.js.map