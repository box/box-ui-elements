/**
 * @flow
 * @file Utility to combine API fields needed
 * @author Box
 */

import has from 'lodash/has';
import setProp from 'lodash/set';
import {
    FIELD_ID,
    FIELD_NAME,
    FIELD_TYPE,
    FIELD_SIZE,
    FIELD_PARENT,
    FIELD_EXTENSION,
    FIELD_PERMISSIONS,
    FIELD_ITEM_COLLECTION,
    FIELD_ITEM_EXPIRATION,
    FIELD_PATH_COLLECTION,
    FIELD_CONTENT_CREATED_AT,
    FIELD_CONTENT_MODIFIED_AT,
    FIELD_MODIFIED_AT,
    FIELD_CREATED_AT,
    FIELD_SHARED_LINK,
    FIELD_ALLOWED_SHARED_LINK_ACCESS_LEVELS,
    FIELD_HAS_COLLABORATIONS,
    FIELD_IS_EXTERNALLY_OWNED,
    FIELD_CREATED_BY,
    FIELD_MODIFIED_BY,
    FIELD_OWNED_BY,
    FIELD_RESTORED_BY,
    FIELD_TRASHED_BY,
    FIELD_DESCRIPTION,
    FIELD_REPRESENTATIONS,
    FIELD_SHA1,
    FIELD_UPLOADER_DISPLAY_NAME,
    FIELD_WATERMARK_INFO,
    FIELD_AUTHENTICATED_DOWNLOAD_URL,
    FIELD_FILE_VERSION,
    FIELD_IS_DOWNLOAD_AVAILABLE,
    FIELD_VERSION_LIMIT,
    FIELD_VERSION_NUMBER,
    FIELD_METADATA_SKILLS,
    FIELD_TASK_ASSIGNMENT_COLLECTION,
    FIELD_IS_COMPLETED,
    FIELD_MESSAGE,
    FIELD_TAGGED_MESSAGE,
    FIELD_DUE_AT,
    FIELD_TRASHED_AT,
    FIELD_ASSIGNED_TO,
    FIELD_RESTORED_FROM,
    FIELD_RESTORED_AT,
    FIELD_STATUS,
    FIELD_ACTIVITY_TEMPLATE,
    FIELD_APP,
    FIELD_OCCURRED_AT,
    FIELD_RENDERED_TEXT,
    FIELD_RETENTION,
    FIELD_URL,
    PLACEHOLDER_USER,
} from '../constants';

// Minimum set of fields needed for folder requests
const FOLDER_FIELDS_TO_FETCH = [
    FIELD_ID,
    FIELD_NAME,
    FIELD_TYPE,
    FIELD_SIZE,
    FIELD_PARENT,
    FIELD_EXTENSION,
    FIELD_PERMISSIONS,
    FIELD_PATH_COLLECTION,
    FIELD_MODIFIED_AT,
    FIELD_CREATED_AT,
    FIELD_MODIFIED_BY,
    FIELD_HAS_COLLABORATIONS,
    FIELD_IS_EXTERNALLY_OWNED,
    FIELD_ITEM_COLLECTION,
    FIELD_AUTHENTICATED_DOWNLOAD_URL,
    FIELD_IS_DOWNLOAD_AVAILABLE,
    FIELD_REPRESENTATIONS,
    FIELD_URL,
];

// Fields needed for the sidebar
const SIDEBAR_FIELDS_TO_FETCH = [
    FIELD_ID,
    FIELD_NAME,
    FIELD_SIZE,
    FIELD_EXTENSION,
    FIELD_FILE_VERSION,
    FIELD_SHARED_LINK,
    FIELD_PERMISSIONS,
    FIELD_CONTENT_CREATED_AT,
    FIELD_CONTENT_MODIFIED_AT,
    FIELD_CREATED_AT,
    FIELD_CREATED_BY,
    FIELD_MODIFIED_AT,
    FIELD_MODIFIED_BY,
    FIELD_OWNED_BY,
    FIELD_DESCRIPTION,
    FIELD_METADATA_SKILLS,
    FIELD_ITEM_EXPIRATION,
    FIELD_VERSION_LIMIT,
    FIELD_VERSION_NUMBER,
    FIELD_IS_EXTERNALLY_OWNED,
    FIELD_RESTORED_FROM,
    FIELD_AUTHENTICATED_DOWNLOAD_URL,
    FIELD_IS_DOWNLOAD_AVAILABLE,
    FIELD_UPLOADER_DISPLAY_NAME,
];

// Fields needed for preview
const PREVIEW_FIELDS_TO_FETCH = [
    FIELD_ID,
    FIELD_PERMISSIONS,
    FIELD_SHARED_LINK,
    FIELD_SHA1,
    FIELD_FILE_VERSION,
    FIELD_NAME,
    FIELD_SIZE,
    FIELD_EXTENSION,
    FIELD_REPRESENTATIONS,
    FIELD_WATERMARK_INFO,
    FIELD_AUTHENTICATED_DOWNLOAD_URL,
    FIELD_IS_DOWNLOAD_AVAILABLE,
];

// Fields needed to get information on the current version of a file
const FILE_VERSION_FIELDS_TO_FETCH = [
    FIELD_FILE_VERSION,
    FIELD_MODIFIED_AT,
    FIELD_MODIFIED_BY,
    FIELD_RESTORED_FROM,
    FIELD_SIZE,
    FIELD_UPLOADER_DISPLAY_NAME,
    FIELD_VERSION_NUMBER,
];

// Fields needed to get versions for a file
const FILE_VERSIONS_FIELDS_TO_FETCH = [
    FIELD_AUTHENTICATED_DOWNLOAD_URL,
    FIELD_CREATED_AT,
    FIELD_EXTENSION,
    FIELD_IS_DOWNLOAD_AVAILABLE,
    FIELD_MODIFIED_AT,
    FIELD_MODIFIED_BY,
    FIELD_NAME,
    FIELD_PERMISSIONS,
    FIELD_RESTORED_AT,
    FIELD_RESTORED_BY,
    FIELD_RETENTION,
    FIELD_SIZE,
    FIELD_TRASHED_AT,
    FIELD_TRASHED_BY,
    FIELD_UPLOADER_DISPLAY_NAME,
    FIELD_VERSION_NUMBER,
];

// Fields needed for Content Picker to show shared link permissions
const FILE_SHARED_LINK_FIELDS_TO_FETCH = [FIELD_ALLOWED_SHARED_LINK_ACCESS_LEVELS, FIELD_SHARED_LINK];

// Fields needed to get tasks data
const TASKS_FIELDS_TO_FETCH = [
    FIELD_TASK_ASSIGNMENT_COLLECTION,
    FIELD_IS_COMPLETED,
    FIELD_CREATED_AT,
    FIELD_CREATED_BY,
    FIELD_DUE_AT,
    FIELD_MESSAGE,
];

// Fields needed to get task assignments data
const TASK_ASSIGNMENTS_FIELDS_TO_FETCH = [FIELD_ASSIGNED_TO, FIELD_STATUS];

// Fields needed to get tasks data
const COMMENTS_FIELDS_TO_FETCH = [
    FIELD_TAGGED_MESSAGE,
    FIELD_MESSAGE,
    FIELD_CREATED_AT,
    FIELD_CREATED_BY,
    FIELD_MODIFIED_AT,
    FIELD_PERMISSIONS,
];

// Fields that represent users
const USER_FIELDS = [FIELD_CREATED_BY, FIELD_MODIFIED_BY, FIELD_OWNED_BY, FIELD_ASSIGNED_TO];

// Fields required to fetch app activity
const APP_ACTIVITY_FIELDS_TO_FETCH = [
    FIELD_ACTIVITY_TEMPLATE,
    FIELD_APP,
    FIELD_CREATED_BY,
    FIELD_OCCURRED_AT,
    FIELD_RENDERED_TEXT,
];

/**
 * Finds properties missing in an object
 *
 * @param {Object} obj - some object
 * @param {Array<string>|void} [properties] - object properties to check
 * @return {Array<string>} comma seperated list of properties missing
 */
function findMissingProperties(obj?: Object, properties?: Array<string> = []): Array<string> {
    // If file doesn't exist or is an empty object, we should fetch all fields
    if (!obj || typeof obj !== 'object' || Object.keys(obj).length === 0) {
        return properties;
    }

    return properties.filter((field: string) => !has(obj, field));
}

/**
 * Fill properties missing in an object
 *
 * @param {Object} obj - some object
 * @param {Array<string>|void} [properties] - some properties to check
 * @return {Object} new object with missing fields
 */
function fillMissingProperties(obj?: Object = {}, properties?: Array<string>): Object {
    // If file doesn't exist or is an empty object, we should fetch all fields
    if (!Array.isArray(properties) || properties.length === 0) {
        return obj;
    }

    const newObj = { ...obj };
    const missingProperties = findMissingProperties(obj, properties);
    missingProperties.forEach((field: string) => {
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
function fillUserPlaceholder(obj: Object): Object {
    const newObj = { ...obj };

    USER_FIELDS.forEach((field: string) => {
        if (has(newObj, field) && newObj[field] === null) {
            setProp(newObj, field, PLACEHOLDER_USER);
        }
    });

    return newObj;
}

export {
    APP_ACTIVITY_FIELDS_TO_FETCH,
    COMMENTS_FIELDS_TO_FETCH,
    FILE_SHARED_LINK_FIELDS_TO_FETCH,
    FILE_VERSION_FIELDS_TO_FETCH,
    FILE_VERSIONS_FIELDS_TO_FETCH,
    fillMissingProperties,
    fillUserPlaceholder,
    findMissingProperties,
    FOLDER_FIELDS_TO_FETCH,
    PREVIEW_FIELDS_TO_FETCH,
    SIDEBAR_FIELDS_TO_FETCH,
    TASK_ASSIGNMENTS_FIELDS_TO_FETCH,
    TASKS_FIELDS_TO_FETCH,
    USER_FIELDS,
};
