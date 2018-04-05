/**
 * @flow
 * @file Utility to combine API fields needed
 * @author Box
 */

import getProp from 'lodash/get';
import {
    FIELD_ID,
    FIELD_NAME,
    FIELD_TYPE,
    FIELD_SIZE,
    FIELD_PARENT,
    FIELD_EXTENSION,
    FIELD_PERMISSIONS,
    FIELD_ITEM_COLLECTION,
    FIELD_PATH_COLLECTION,
    FIELD_MODIFIED_AT,
    FIELD_CREATED_AT,
    FIELD_SHARED_LINK,
    FIELD_ALLOWED_SHARED_LINK_ACCESS_LEVELS,
    FIELD_HAS_COLLABORATIONS,
    FIELD_IS_EXTERNALLY_OWNED,
    FIELD_CREATED_BY,
    FIELD_MODIFIED_BY,
    FIELD_OWNED_BY,
    FIELD_DESCRIPTION,
    FIELD_REPRESENTATIONS,
    FIELD_SHA1,
    FIELD_WATERMARK_INFO,
    FIELD_AUTHENTICATED_DOWNLOAD_URL,
    FIELD_FILE_VERSION,
    FIELD_IS_DOWNLOAD_AVAILABLE,
    METADATA_SKILLS
} from '../constants';
import type { BoxItem } from '../flowTypes';

// Optional Box file fields
const BOX_ITEM_OPTIONAL_FIELDS = [FIELD_ITEM_COLLECTION];

// Minimum set of fields needed for Content Explorer / Picker
const BASE_FIELDS_TO_FETCH = [
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
    FIELD_SHARED_LINK,
    FIELD_ALLOWED_SHARED_LINK_ACCESS_LEVELS,
    FIELD_HAS_COLLABORATIONS,
    FIELD_IS_EXTERNALLY_OWNED,
    FIELD_ITEM_COLLECTION
];

// Additional fields needed for the sidebar
const SIDEBAR_FIELDS_TO_FETCH = [FIELD_CREATED_BY, FIELD_OWNED_BY, FIELD_DESCRIPTION, METADATA_SKILLS];

// Additional fields needed for preview
const PREVIEW_FIELDS_TO_FETCH = [
    FIELD_REPRESENTATIONS,
    FIELD_SHA1,
    FIELD_WATERMARK_INFO,
    FIELD_AUTHENTICATED_DOWNLOAD_URL,
    FIELD_FILE_VERSION,
    FIELD_IS_DOWNLOAD_AVAILABLE
];

/**
 * Returns all the fields that can be fetched
 *
 * @return {Array<string>} list of fields with preview and sidebar
 */
function getFieldsIncludingPreviewSidebar(): Array<string> {
    return BASE_FIELDS_TO_FETCH.concat(SIDEBAR_FIELDS_TO_FETCH).concat(PREVIEW_FIELDS_TO_FETCH);
}

/**
 * Returns base fields and preview fields
 *
 * @return {Array<string>} list of fields with preview
 */
function getFieldsIncludingPreview(): Array<string> {
    return BASE_FIELDS_TO_FETCH.concat(PREVIEW_FIELDS_TO_FETCH);
}

/**
 * Returns fields needed for fetching
 *
 * @param {boolean|void} [includePreview] - Optionally include preview fields
 * @param {boolean|void} [includePreviewSidebar] - Optionally include preview and sidebar fields
 * @return {Array<string>} list of fields
 */
function getFields(includePreview?: boolean = false, includePreviewSidebar?: boolean = false): Array<string> {
    let fields = BASE_FIELDS_TO_FETCH;
    if (includePreview && includePreviewSidebar) {
        // Only include sidebar fields if we are also including preview fields
        fields = getFieldsIncludingPreviewSidebar();
    } else if (includePreview) {
        // Preview may not have a sidebar
        fields = getFieldsIncludingPreview();
    }
    return fields;
}

/**
 * Returns fields needed for fetching
 *
 * @param {boolean|void} [includePreview] - Optionally include preview fields
 * @param {boolean|void} [includePreviewSidebar] - Optionally include preview and sidebar fields
 * @return {string} comma seperated list of fields
 */
export function getFieldsAsString(includePreview?: boolean = false, includePreviewSidebar?: boolean = false): string {
    const fields = getFields(includePreview, includePreviewSidebar);
    return fields.join(',');
}

/**
 * Checks the fields needed for a box file
 *
 * @param {boolean|void} [includePreview] - Optionally include preview fields
 * @param {boolean|void} [includePreviewSidebar] - Optionally include preview and sidebar fields
 * @return {string} comma seperated list of fields
 */
export function isValidBoxFile(
    file?: BoxItem | string,
    includePreview?: boolean = false,
    includePreviewSidebar?: boolean = false
): boolean {
    if (!file || typeof file !== 'object') {
        return false;
    }
    const fields = getFields(includePreview, includePreviewSidebar).filter(
        (field) => BOX_ITEM_OPTIONAL_FIELDS.indexOf(field) < 0
    );

    // Some fields like metadata have dots in it. Only use the root prop.
    return fields.every((field) => typeof getProp(file, field.split('.')[0]) !== 'undefined');
}
