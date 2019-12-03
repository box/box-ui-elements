/**
 * @flow strict
 * @file Helper for throwing errors
 * @author Box
 */

import getProp from 'lodash/get';
import { TYPED_ID_FILE_PREFIX, TYPED_ID_FOLDER_PREFIX, FILE_EXTENSION_BOX_NOTE } from '../constants';
import type { BoxItem } from '../common/types/core';

const FILE_EXT_REGEX = /\.([0-9a-z]+)$/i; // Case insensitive regex to extract file extension without "."

/**
 * Returns typed id for file. Useful for when
 * making file based XHRs where auth token
 * can be per file as used by Preview.
 * @param {id} id the file id
 * @return {string} typed id for file
 */
export function getTypedFileId(id: string): string {
    return `${TYPED_ID_FILE_PREFIX}${id}`;
}

/**
 * Returns typed id for folder.
 * @param {id} id the folder id
 * @return {string} typed id for folder
 */
export function getTypedFolderId(id: string): string {
    return `${TYPED_ID_FOLDER_PREFIX}${id}`;
}

/**
 * Determines if the file is a box note
 * @param {Object} file a box file
 * @return boolean true if it is a box note
 */
export function isBoxNote(file: BoxItem): boolean {
    return file.extension === FILE_EXTENSION_BOX_NOTE;
}

/**
 * Returns the extension from the file name
 * @param {string} filename a Box file
 * @return {string} typed id for file
 */
export function getFileExtension(filename: string | void): string {
    if (typeof filename !== 'string') {
        return '';
    }

    const result = FILE_EXT_REGEX.exec(filename);
    return getProp(result, '[1]', '');
}
