/**
 * @flow
 * @file Helper for throwing errors
 * @author Box
 */

import { TYPED_ID_FILE_PREFIX, FILE_EXTENSION_BOX_NOTE } from '../constants';
import type { BoxItem } from '../flowTypes';

/* eslint-disable import/prefer-default-export */
/**
 * Returns typed id for file. Useful for when
 * making file based XHRs where auth token
 * can be per file as used by Preview.
 *
 * @return {string} typed id for file
 */
export function getTypedFileId(id: string): string {
    return `${TYPED_ID_FILE_PREFIX}${id}`;
}

export function isBoxNote(file: BoxItem): boolean {
    return file.extension === FILE_EXTENSION_BOX_NOTE;
}
