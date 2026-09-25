import getProp from 'lodash/get';
import {
    TYPED_ID_FILE_PREFIX,
    TYPED_ID_FOLDER_PREFIX,
    FILE_EXTENSION_BOX_CANVAS,
    FILE_EXTENSION_BOX_NOTE,
    FILE_EXTENSION_GOOGLE_DOC,
    FILE_EXTENSION_GOOGLE_SHEET,
    FILE_EXTENSION_GOOGLE_SLIDE,
    FILE_EXTENSION_GOOGLE_SLIDE_LEGACY,
} from '../constants';
import type { BoxItem } from '../common/types/core';

const FILE_EXT_REGEX = /\.([0-9a-z]+)$/i; // Case insensitive regex to extract file extension without "."

/**
 * Returns typed id for file. Useful for when
 * making file based XHRs where auth token
 * can be per file as used by Preview.
 */
export const getTypedFileId = (id: string): string => `${TYPED_ID_FILE_PREFIX}${id}`;

/** Returns typed id for folder. */
export const getTypedFolderId = (id: string): string => `${TYPED_ID_FOLDER_PREFIX}${id}`;

/** Determines if the file is a box note. */
export const isBoxNote = (file: BoxItem): boolean => file.extension === FILE_EXTENSION_BOX_NOTE;

/** Determines if the file is box canvas. */
export const isBoxCanvas = (file: BoxItem): boolean => file.extension === FILE_EXTENSION_BOX_CANVAS;

/** Determines whether a file extension is associated with a G Suite file. */
export const isGSuiteExtension = (extension: string): boolean =>
    extension === FILE_EXTENSION_GOOGLE_DOC ||
    extension === FILE_EXTENSION_GOOGLE_SHEET ||
    extension === FILE_EXTENSION_GOOGLE_SLIDE ||
    extension === FILE_EXTENSION_GOOGLE_SLIDE_LEGACY;

/** Returns the extension from the file name. */
export const getFileExtension = (filename?: string): string => {
    if (typeof filename !== 'string') {
        return '';
    }

    const result = FILE_EXT_REGEX.exec(filename);
    return getProp(result, '[1]', '');
};
