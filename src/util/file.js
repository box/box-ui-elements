// @flow
import { TYPED_ID_FILE_PREFIX } from '../constants';

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
