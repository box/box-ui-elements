/**
 * @flow
 * @file Utility functions for uploads
 * @author Box
 */
import getProp from 'lodash/get';

import Browser from './Browser';

import type {
    UploadFile,
    UploadFileWithAPIOptions,
    UploadDataTransferItemWithAPIOptions,
    UploadItemAPIOptions,
    FileSystemFileEntry,
} from '../common/types/upload';

const DEFAULT_API_OPTIONS = {};

/**
 * Returns true if file contains API options
 *
 * @param {UploadFile | UploadFileWithAPIOptions} item
 * @returns {boolean}
 */
function doesFileContainAPIOptions(file: UploadFile | UploadFileWithAPIOptions): boolean {
    // $FlowFixMe UploadFileWithAPIOptions has `file` and `options` properties
    return !!(file.options && file.file);
}

/**
 * Returns true if item contains API options
 *
 * @param {DataTransferItem | UploadDataTransferItemWithAPIOptions} item
 * @returns {boolean}
 */
function doesDataTransferItemContainAPIOptions(item: DataTransferItem | UploadDataTransferItemWithAPIOptions): boolean {
    // $FlowFixMe UploadDataTransferItemWithAPIOptions has `item` and `options` properties
    return !!(item.options && item.item);
}

/**
 * Converts UploadFile or UploadFileWithAPIOptions to UploadFile
 *
 * @param {UploadFile | UploadFileWithAPIOptions} file
 * @returns {UploadFile}
 */
function getFile(file: UploadFile | UploadFileWithAPIOptions): UploadFile {
    if (doesFileContainAPIOptions(file)) {
        return ((file: any): UploadFileWithAPIOptions).file;
    }

    return ((file: any): UploadFile);
}

/**
 * Converts DataTransferItem or UploadDataTransferItemWithAPIOptions to DataTransferItem
 *
 * @param {DataTransferItem | UploadDataTransferItemWithAPIOptions} item
 * @returns {DataTransferItem}
 */
function getDataTransferItem(item: DataTransferItem | UploadDataTransferItemWithAPIOptions): DataTransferItem {
    if (doesDataTransferItemContainAPIOptions(item)) {
        return ((item: any): UploadDataTransferItemWithAPIOptions).item;
    }

    return ((item: any): DataTransferItem);
}

/**
 * Get API Options from file
 *
 * @param {UploadFile | UploadFileWithAPIOptions} file
 * @returns {UploadItemAPIOptions}
 */
function getFileAPIOptions(file: UploadFile | UploadFileWithAPIOptions): UploadItemAPIOptions {
    if (doesFileContainAPIOptions(file)) {
        return ((file: any): UploadFileWithAPIOptions).options || DEFAULT_API_OPTIONS;
    }

    return DEFAULT_API_OPTIONS;
}

/**
 * Get API Options from item
 *
 * @param {DataTransferItem | UploadDataTransferItemWithAPIOptions} item
 * @returns {UploadItemAPIOptions}
 */
function getDataTransferItemAPIOptions(
    item: DataTransferItem | UploadDataTransferItemWithAPIOptions,
): UploadItemAPIOptions {
    if (doesDataTransferItemContainAPIOptions(item)) {
        return ((item: any): UploadDataTransferItemWithAPIOptions).options || DEFAULT_API_OPTIONS;
    }

    return DEFAULT_API_OPTIONS;
}

/**
 * Returns true if the given object is a Date instance encoding a valid date
 * (i.e. new Date('this is not a timestamp') should return false).
 *
 * Code adapted from
 * http://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
 *
 * @param {Date} date
 * @return {boolean}
 */
function isValidDateObject(date: Date): boolean {
    return Object.prototype.toString.call(date) === '[object Date]' && !Number.isNaN(date.getTime());
}

/**
 * Remove milliseconds from date time string
 *
 * @param {Date} date
 * @return {string}
 */
function toISOStringNoMS(date: Date): string {
    return date.toISOString().replace(/\.[0-9]{3}/, '');
}

/**
 * Returns the file's last modified date as an ISO string with no MS component (e.g.
 * '2017-04-18T17:14:27Z'), or null if no such date can be extracted from the file object.
 * (Nothing on the Internet guarantees that the file object has this info.)
 *
 * @param {UploadFile} file
 * @return {?string}
 */
function getFileLastModifiedAsISONoMSIfPossible(file: UploadFile): ?string {
    // The compatibility chart at https://developer.mozilla.org/en-US/docs/Web/API/File/lastModified#Browser_compatibility
    // is not up to date as of 12-13-2018. Edge & ie11 do not support lastModified, but support lastModifiedDate.
    const lastModified = file.lastModified || file.lastModifiedDate;
    if (lastModified) {
        let lastModifiedDate: Date | null = null;

        if (typeof lastModified === 'number') {
            // Only non-negative timestamps are valid. In rare cases, the timestamp may be erroneously set to a negative value
            // https://issues.chromium.org/issues/393149335
            if (lastModified < 0) {
                return null;
            }
            lastModifiedDate = new Date(lastModified); // Try number first
        } else if (typeof lastModified === 'string' || lastModified instanceof Date) {
            lastModifiedDate = new Date(lastModified);
        }

        if (lastModifiedDate && isValidDateObject(lastModifiedDate)) {
            const isoString = toISOStringNoMS(lastModifiedDate);
            return isoString;
        }
    }

    return null;
}

/**
 * If maybeJson is valid JSON string, return the result of calling JSON.parse
 * on it.  Otherwise, return null.
 *
 * @param {string} maybeJson
 * @return {?Object}
 */
function tryParseJson(maybeJson: string): ?Object {
    try {
        return JSON.parse(maybeJson);
    } catch (e) {
        return null;
    }
}

/**
 * Get bounded exponential backoff retry delay
 *
 * @param {number} initialRetryDelay
 * @param {number} maxRetryDelay
 * @param {number} retryNum - Current retry number (first retry will have value of 0).
 * @return {number}
 */
function getBoundedExpBackoffRetryDelay(initialRetryDelay: number, maxRetryDelay: number, retryNum: number) {
    const delay = initialRetryDelay * retryNum ** 2;
    return delay > maxRetryDelay ? maxRetryDelay : delay;
}

/**
 * Get entry from dataTransferItem
 *
 * @param {DataTransferItem} item
 * @returns {FileSystemFileEntry}
 */
function getEntryFromDataTransferItem(item: DataTransferItem): FileSystemFileEntry {
    const entry =
        // $FlowFixMe
        item.webkitGetAsEntry || item.mozGetAsEntry || item.getAsEntry;

    return entry.call(item);
}

/**
 * Check if a dataTransferItem is a folder
 *
 * @param {UploadDataTransferItemWithAPIOptions | DataTransferItem} itemData
 * @returns {boolean}
 */
function isDataTransferItemAFolder(itemData: UploadDataTransferItemWithAPIOptions | DataTransferItem): boolean {
    const item = getDataTransferItem(itemData);
    const entry = getEntryFromDataTransferItem(((item: any): DataTransferItem));
    if (!entry) {
        return false;
    }

    return entry.isDirectory;
}

/**
 * Check if a dataTransfer item is a macOS "package file"
 * @see https://en.wikipedia.org/wiki/Package_(macOS)
 *
 * @returns {boolean}
 */
function isDataTransferItemAPackage(itemData: UploadDataTransferItemWithAPIOptions | DataTransferItem): boolean {
    const item = getDataTransferItem(itemData);
    const isDirectory = isDataTransferItemAFolder(item);

    return isDirectory && item.type === 'application/zip' && item.kind === 'file';
}

/**
 * Get file from FileSystemFileEntry
 *
 * @param {FileSystemFileEntry} entry
 * @returns {Promise<UploadFile>}
 */
function getFileFromEntry(entry: FileSystemFileEntry): Promise<UploadFile> {
    return new Promise(resolve => {
        entry.file(file => {
            resolve(file);
        });
    });
}

/**
 * Get file from DataTransferItem or UploadDataTransferItemWithAPIOptions
 *
 * @param {UploadDataTransferItemWithAPIOptions | DataTransferItem} itemData
 * @returns {Promise<UploadFile | UploadFileWithAPIOptions | null>}
 */
async function getFileFromDataTransferItem(
    itemData: UploadDataTransferItemWithAPIOptions | DataTransferItem,
): Promise<UploadFile | UploadFileWithAPIOptions | null> {
    const item = getDataTransferItem(itemData);
    const entry = getEntryFromDataTransferItem(((item: any): DataTransferItem));
    if (!entry) {
        return null;
    }

    const file = await getFileFromEntry(entry);

    if (doesDataTransferItemContainAPIOptions(itemData)) {
        return {
            file: ((file: any): UploadFile),
            options: getDataTransferItemAPIOptions(itemData),
        };
    }

    return file;
}

/**
 * Get file from DataTransferItem or UploadDataTransferItemWithAPIOptions
 * Uses `entry`'s `getAsFile` method for retrieving package information as a single file.
 * @see https://en.wikipedia.org/wiki/Package_(macOS)
 *
 * @param {UploadDataTransferItemWithAPIOptions | DataTransferItem} itemData
 * @returns {?UploadFile | ?UploadFileWithAPIOptions | null}
 */
function getPackageFileFromDataTransferItem(
    itemData: UploadDataTransferItemWithAPIOptions | DataTransferItem,
): ?UploadFile | ?UploadFileWithAPIOptions | null {
    const item = getDataTransferItem(itemData);
    const entry = getEntryFromDataTransferItem(((item: any): DataTransferItem));
    if (!entry) {
        return null;
    }

    const itemFile = item.getAsFile();

    if (doesDataTransferItemContainAPIOptions(itemData)) {
        return {
            file: ((itemFile: any): UploadFile),
            options: getDataTransferItemAPIOptions(itemData),
        };
    }

    return itemFile;
}

/**
 * Generates file id based on file properties
 *
 * When folderId or uploadInitTimestamp is missing from file options, file name is returned as file id.
 * Otherwise, fileName_folderId_uploadInitTimestamp is used as file id.
 *
 * @param {UploadFileWithAPIOptions | UploadFile} file
 * @param {string} rootFolderId
 * @returns {string}
 */
function getFileId(file: UploadFileWithAPIOptions | UploadFile, rootFolderId: string): string {
    if (!doesFileContainAPIOptions(file)) {
        return ((file: any): UploadFile).name;
    }

    const fileWithOptions = ((file: any): UploadFileWithAPIOptions);
    const folderId = getProp(fileWithOptions, 'options.folderId', rootFolderId);
    const uploadInitTimestamp = getProp(fileWithOptions, 'options.uploadInitTimestamp', Date.now());
    const fileName = fileWithOptions.file.webkitRelativePath || fileWithOptions.file.name;

    return `${fileName}_${folderId}_${uploadInitTimestamp}`;
}

/**
 * Generates item id based on item properties
 *
 * When item options including folderId or uploadInitTimestamp are missing, item name is returned as item id.
 * Otherwise, item properties are used as item id.
 * E.g., folder1_0_123124124
 *
 * @param {DataTransferItem | UploadDataTransferItemWithAPIOptions} itemData
 * @param {string} rootFolderId
 * @returns {string}
 */
function getDataTransferItemId(
    itemData: DataTransferItem | UploadDataTransferItemWithAPIOptions,
    rootFolderId: string,
): string {
    const item = getDataTransferItem(itemData);
    const { name } = getEntryFromDataTransferItem(item);
    if (!doesDataTransferItemContainAPIOptions(itemData)) {
        return name;
    }

    const { folderId = rootFolderId, uploadInitTimestamp = Date.now() } = getDataTransferItemAPIOptions(itemData);

    return `${name}_${folderId}_${uploadInitTimestamp}`;
}

/**
 * Multiput uploads require the use of crypto, which is only supported in secure contexts.
 * Multiput uploads is not supported on mobile iOS Safari.
 */
function isMultiputSupported(): boolean {
    const cryptoObj = window.crypto || window.msCrypto;

    if (Browser.isMobileSafari()) {
        return false;
    }

    return window.location.protocol === 'https:' && cryptoObj && cryptoObj.subtle;
}

/**
 * Returns true if the clipboard event carries at least one file
 *
 * @param {ClipboardEvent} event
 * @returns {boolean}
 */
function clipboardHasFiles(event: ClipboardEvent): boolean {
    const { clipboardData } = event;
    if (!clipboardData) {
        return false;
    }

    if (clipboardData.files && clipboardData.files.length > 0) {
        return true;
    }

    return Array.from(clipboardData.items || []).some(item => item.kind === 'file');
}

/**
 * Extracts File objects from a clipboard event.
 * Prefers clipboardData.files, falling back to clipboardData.items[].getAsFile()
 *
 * @param {ClipboardEvent} event
 * @returns {File[]}
 */
function getFilesFromClipboard(event: ClipboardEvent): File[] {
    const { clipboardData } = event;
    if (!clipboardData) {
        return [];
    }

    if (clipboardData.files && clipboardData.files.length > 0) {
        return Array.from(clipboardData.files);
    }

    return Array.from(clipboardData.items || [])
        .filter(item => item.kind === 'file')
        .map(item => item.getAsFile())
        .filter(Boolean);
}

/**
 * Zero-pads a number to 2 digits
 *
 * @param {number} num
 * @returns {string}
 */
function padTo2Digits(num: number): string {
    return String(num).padStart(2, '0');
}

/**
 * Formats a Date as 'YYYY-MM-DD at HH.MM.SS' using local time
 *
 * @param {Date} date
 * @returns {string}
 */
function formatPastedImageTimestamp(date: Date): string {
    const dateStr = `${date.getFullYear()}-${padTo2Digits(date.getMonth() + 1)}-${padTo2Digits(date.getDate())}`;
    const timeStr = `${padTo2Digits(date.getHours())}.${padTo2Digits(date.getMinutes())}.${padTo2Digits(date.getSeconds())}`;

    return `${dateStr} at ${timeStr}`;
}

/**
 * Returns the extension (without the dot) from a file name, or '' if none
 *
 * @param {string} name
 * @returns {string}
 */
function getExtensionFromFileName(name: string): string {
    const match = /\.([a-z0-9]+)$/i.exec(name);
    return match ? match[1] : '';
}

/**
 * Returns the file extension implied by a MIME type, e.g. 'image/svg+xml' -> 'svg'
 *
 * @param {string} mimeType
 * @returns {string}
 */
function getExtensionFromMimeType(mimeType: string): string {
    if (!mimeType || !mimeType.includes('/')) {
        return '';
    }

    const [, subtype = ''] = mimeType.split('/');
    return subtype.split('+')[0];
}

/**
 * Returns true if a clipboard file name is a generic placeholder (e.g. 'image.png', 'image', '')
 * rather than a meaningful name the OS/app assigned
 *
 * @param {string} name
 * @returns {boolean}
 */
function isGenericClipboardFileName(name: string): boolean {
    return !name || /^image(\.[a-z0-9]+)?$/i.test(name);
}

/**
 * Generates a file name for a pasted clipboard file.
 * Preserves meaningful names; renames generic placeholders (e.g. 'image.png') to
 * 'Pasted Image YYYY-MM-DD at HH.MM.SS.<ext>'
 *
 * @param {File} file
 * @returns {string}
 */
function generateClipboardFileName(file: File): string {
    if (!isGenericClipboardFileName(file.name)) {
        return file.name;
    }

    const extension = getExtensionFromFileName(file.name) || getExtensionFromMimeType(file.type);
    const timestamp = formatPastedImageTimestamp(new Date());

    return `Pasted Image ${timestamp}${extension ? `.${extension}` : ''}`;
}

/**
 * Returns true if a paste target is an editable element (input, textarea, select,
 * contenteditable, or textbox role) where native paste should not be intercepted
 *
 * @param {EventTarget | null} target
 * @returns {boolean}
 */
function isEditablePasteTarget(target: EventTarget | null): boolean {
    if (!target || typeof (target: any).closest !== 'function') {
        return false;
    }

    return !!(target: any).closest('input, textarea, select, [contenteditable="true"], [role="textbox"]');
}

export {
    DEFAULT_API_OPTIONS,
    clipboardHasFiles,
    generateClipboardFileName,
    getFilesFromClipboard,
    isEditablePasteTarget,
    doesDataTransferItemContainAPIOptions,
    doesFileContainAPIOptions,
    getBoundedExpBackoffRetryDelay,
    getDataTransferItem,
    getDataTransferItemAPIOptions,
    getDataTransferItemId,
    getEntryFromDataTransferItem,
    getFile,
    getFileAPIOptions,
    getFileFromDataTransferItem,
    getPackageFileFromDataTransferItem,
    getFileFromEntry,
    getFileId,
    getFileLastModifiedAsISONoMSIfPossible,
    isDataTransferItemAFolder,
    isDataTransferItemAPackage,
    isMultiputSupported,
    toISOStringNoMS,
    tryParseJson,
};
