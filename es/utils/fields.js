function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Utility to combine API fields needed
 * @author Box
 */

import has from 'lodash/has';
import setProp from 'lodash/set';
import { FIELD_ID, FIELD_NAME, FIELD_TYPE, FIELD_SIZE, FIELD_PARENT, FIELD_EXTENSION, FIELD_PERMISSIONS, FIELD_ITEM_COLLECTION, FIELD_ITEM_EXPIRATION, FIELD_PATH_COLLECTION, FIELD_CONTENT_CREATED_AT, FIELD_CONTENT_MODIFIED_AT, FIELD_MODIFIED_AT, FIELD_CREATED_AT, FIELD_SHARED_LINK, FIELD_ALLOWED_SHARED_LINK_ACCESS_LEVELS, FIELD_HAS_COLLABORATIONS, FIELD_IS_EXTERNALLY_OWNED, FIELD_CREATED_BY, FIELD_MODIFIED_BY, FIELD_OWNED_BY, FIELD_PROMOTED_BY, FIELD_RESTORED_BY, FIELD_TRASHED_BY, FIELD_DESCRIPTION, FIELD_REPRESENTATIONS, FIELD_SHA1, FIELD_UPLOADER_DISPLAY_NAME, FIELD_WATERMARK_INFO, FIELD_AUTHENTICATED_DOWNLOAD_URL, FIELD_FILE_VERSION, FIELD_IS_DOWNLOAD_AVAILABLE, FIELD_VERSION_LIMIT, FIELD_VERSION_NUMBER, FIELD_METADATA_SKILLS, FIELD_TASK_ASSIGNMENT_COLLECTION, FIELD_IS_COMPLETED, FIELD_MESSAGE, FIELD_TAGGED_MESSAGE, FIELD_DUE_AT, FIELD_TRASHED_AT, FIELD_ASSIGNED_TO, FIELD_RESTORED_FROM, FIELD_RESTORED_AT, FIELD_STATUS, FIELD_ACTIVITY_TEMPLATE, FIELD_APP, FIELD_OCCURRED_AT, FIELD_RENDERED_TEXT, FIELD_RETENTION, FIELD_URL, PLACEHOLDER_USER, FIELD_METADATA_ARCHIVE } from '../constants';

// Minimum set of fields needed for folder requests
const FOLDER_FIELDS_TO_FETCH = [FIELD_ID, FIELD_NAME, FIELD_TYPE, FIELD_SIZE, FIELD_PARENT, FIELD_EXTENSION, FIELD_PERMISSIONS, FIELD_PATH_COLLECTION, FIELD_MODIFIED_AT, FIELD_CREATED_AT, FIELD_MODIFIED_BY, FIELD_HAS_COLLABORATIONS, FIELD_IS_EXTERNALLY_OWNED, FIELD_ITEM_COLLECTION, FIELD_AUTHENTICATED_DOWNLOAD_URL, FIELD_IS_DOWNLOAD_AVAILABLE, FIELD_REPRESENTATIONS, FIELD_URL];

// Fields needed for the sidebar
const SIDEBAR_FIELDS_TO_FETCH = [FIELD_ID, FIELD_NAME, FIELD_SIZE, FIELD_EXTENSION, FIELD_FILE_VERSION, FIELD_SHARED_LINK, FIELD_PERMISSIONS, FIELD_CONTENT_CREATED_AT, FIELD_CONTENT_MODIFIED_AT, FIELD_CREATED_AT, FIELD_CREATED_BY, FIELD_MODIFIED_AT, FIELD_MODIFIED_BY, FIELD_OWNED_BY, FIELD_DESCRIPTION, FIELD_METADATA_SKILLS, FIELD_ITEM_EXPIRATION, FIELD_VERSION_LIMIT, FIELD_VERSION_NUMBER, FIELD_IS_EXTERNALLY_OWNED, FIELD_RESTORED_FROM, FIELD_AUTHENTICATED_DOWNLOAD_URL, FIELD_IS_DOWNLOAD_AVAILABLE, FIELD_UPLOADER_DISPLAY_NAME];

// Fields needed for sidebar of file in archive
const SIDEBAR_FIELDS_TO_FETCH_ARCHIVE = SIDEBAR_FIELDS_TO_FETCH.concat(FIELD_METADATA_ARCHIVE);

// Fields needed for preview
const PREVIEW_FIELDS_TO_FETCH = [FIELD_ID, FIELD_PERMISSIONS, FIELD_SHARED_LINK, FIELD_SHA1, FIELD_FILE_VERSION, FIELD_NAME, FIELD_SIZE, FIELD_EXTENSION, FIELD_REPRESENTATIONS, FIELD_WATERMARK_INFO, FIELD_AUTHENTICATED_DOWNLOAD_URL, FIELD_IS_DOWNLOAD_AVAILABLE];

// Fields needed to get versions for a file in activity feed
const FEED_FILE_VERSIONS_FIELDS_TO_FETCH = [FIELD_CREATED_AT, FIELD_EXTENSION, FIELD_IS_DOWNLOAD_AVAILABLE, FIELD_MODIFIED_AT, FIELD_MODIFIED_BY, FIELD_NAME, FIELD_RESTORED_AT, FIELD_RESTORED_BY, FIELD_SIZE, FIELD_TRASHED_AT, FIELD_TRASHED_BY, FIELD_UPLOADER_DISPLAY_NAME, FIELD_VERSION_NUMBER];

// Fields needed to get information on the current version of a file
const FILE_VERSION_FIELDS_TO_FETCH = [FIELD_FILE_VERSION, FIELD_MODIFIED_AT, FIELD_MODIFIED_BY, FIELD_RESTORED_FROM, FIELD_SIZE, FIELD_PROMOTED_BY, FIELD_UPLOADER_DISPLAY_NAME, FIELD_VERSION_NUMBER];

// Fields needed to get information on the current version of a file for file in archive
const FILE_VERSION_FIELDS_TO_FETCH_ARCHIVE = FILE_VERSION_FIELDS_TO_FETCH.concat(FIELD_METADATA_ARCHIVE);

// Fields needed to get versions for a file
const FILE_VERSIONS_FIELDS_TO_FETCH = [FIELD_AUTHENTICATED_DOWNLOAD_URL,
// Expensive field to fetch
FIELD_CREATED_AT, FIELD_EXTENSION, FIELD_IS_DOWNLOAD_AVAILABLE, FIELD_MODIFIED_AT, FIELD_MODIFIED_BY, FIELD_NAME, FIELD_PERMISSIONS,
// Expensive field to fetch
FIELD_PROMOTED_BY, FIELD_RESTORED_AT, FIELD_RESTORED_BY, FIELD_RETENTION,
// Expensive field to fetch
FIELD_SIZE, FIELD_TRASHED_AT, FIELD_TRASHED_BY, FIELD_UPLOADER_DISPLAY_NAME, FIELD_VERSION_NUMBER];

// Fields needed to show shared link permissions
const FILE_SHARED_LINK_FIELDS_TO_FETCH = [FIELD_ALLOWED_SHARED_LINK_ACCESS_LEVELS, FIELD_SHARED_LINK];

// Fields needed to get tasks data
const TASKS_FIELDS_TO_FETCH = [FIELD_TASK_ASSIGNMENT_COLLECTION, FIELD_IS_COMPLETED, FIELD_CREATED_AT, FIELD_CREATED_BY, FIELD_DUE_AT, FIELD_MESSAGE];

// Fields needed to get task assignments data
const TASK_ASSIGNMENTS_FIELDS_TO_FETCH = [FIELD_ASSIGNED_TO, FIELD_STATUS];

// Fields needed to get tasks data
const COMMENTS_FIELDS_TO_FETCH = [FIELD_TAGGED_MESSAGE, FIELD_MESSAGE, FIELD_CREATED_AT, FIELD_CREATED_BY, FIELD_MODIFIED_AT, FIELD_PERMISSIONS];

// Fields that represent users
const USER_FIELDS = [FIELD_CREATED_BY, FIELD_MODIFIED_BY, FIELD_OWNED_BY, FIELD_ASSIGNED_TO];

// Fields required to fetch app activity
const APP_ACTIVITY_FIELDS_TO_FETCH = [FIELD_ACTIVITY_TEMPLATE, FIELD_APP, FIELD_CREATED_BY, FIELD_OCCURRED_AT, FIELD_RENDERED_TEXT];

/**
 * Finds properties missing in an object
 *
 * @param {Object} obj - some object
 * @param {Array<string>|void} [properties] - object properties to check
 * @return {Array<string>} comma seperated list of properties missing
 */
function findMissingProperties(obj, properties = []) {
  // If file doesn't exist or is an empty object, we should fetch all fields
  if (!obj || typeof obj !== 'object' || Object.keys(obj).length === 0) {
    return properties;
  }
  return properties.filter(field => !has(obj, field));
}

/**
 * Fill properties missing in an object
 *
 * @param {Object} obj - some object
 * @param {Array<string>|void} [properties] - some properties to check
 * @return {Object} new object with missing fields
 */
function fillMissingProperties(obj = {}, properties) {
  // If file doesn't exist or is an empty object, we should fetch all fields
  if (!Array.isArray(properties) || properties.length === 0) {
    return obj;
  }
  const newObj = _objectSpread({}, obj);
  const missingProperties = findMissingProperties(obj, properties);
  missingProperties.forEach(field => {
    // @Note: This will overwrite non object fields
    // @Note: We don't know the type of the field
    setProp(newObj, field, null);
  });
  return newObj;
}

/**
 * Fill user properties that are null in an object
 *
 * @param {Object} obj - some object
 * @return {Object} new object with user placeholder
 */
function fillUserPlaceholder(obj) {
  const newObj = _objectSpread({}, obj);
  USER_FIELDS.forEach(field => {
    if (has(newObj, field) && newObj[field] === null) {
      setProp(newObj, field, PLACEHOLDER_USER);
    }
  });
  return newObj;
}
export { APP_ACTIVITY_FIELDS_TO_FETCH, COMMENTS_FIELDS_TO_FETCH, FEED_FILE_VERSIONS_FIELDS_TO_FETCH, FILE_SHARED_LINK_FIELDS_TO_FETCH, FILE_VERSION_FIELDS_TO_FETCH, FILE_VERSION_FIELDS_TO_FETCH_ARCHIVE, FILE_VERSIONS_FIELDS_TO_FETCH, fillMissingProperties, fillUserPlaceholder, findMissingProperties, FOLDER_FIELDS_TO_FETCH, PREVIEW_FIELDS_TO_FETCH, SIDEBAR_FIELDS_TO_FETCH, SIDEBAR_FIELDS_TO_FETCH_ARCHIVE, TASK_ASSIGNMENTS_FIELDS_TO_FETCH, TASKS_FIELDS_TO_FETCH, USER_FIELDS };
//# sourceMappingURL=fields.js.map