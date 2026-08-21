import getProp from 'lodash/get';

import Browser from './Browser';

import type {
    UploadFile,
    UploadFileWithAPIOptions,
    UploadDataTransferItemWithAPIOptions,
    UploadItemAPIOptions,
    FileSystemFileEntry,
} from '../common/types/upload';

const DEFAULT_API_OPTIONS: UploadItemAPIOptions = {};

/** Returns true if file contains API options. */
function doesFileContainAPIOptions(file: UploadFile | UploadFileWithAPIOptions): boolean {
    return !!(file.options && file.file);
}

/** Returns true if item contains API options. */
function doesDataTransferItemContainAPIOptions(item: DataTransferItem | UploadDataTransferItemWithAPIOptions): boolean {
    return !!(item.options && item.item);
}

/** Converts UploadFile or UploadFileWithAPIOptions to UploadFile. */
function getFile(file: UploadFile | UploadFileWithAPIOptions): UploadFile {
    if (doesFileContainAPIOptions(file)) {
        return (file as UploadFileWithAPIOptions).file;
    }

    return file as UploadFile;
}

/** Converts DataTransferItem or UploadDataTransferItemWithAPIOptions to DataTransferItem. */
function getDataTransferItem(item: DataTransferItem | UploadDataTransferItemWithAPIOptions): DataTransferItem {
    if (doesDataTransferItemContainAPIOptions(item)) {
        return (item as UploadDataTransferItemWithAPIOptions).item;
    }

    return item as DataTransferItem;
}

/** Get API Options from file. */
function getFileAPIOptions(file: UploadFile | UploadFileWithAPIOptions): UploadItemAPIOptions {
    if (doesFileContainAPIOptions(file)) {
        return (file as UploadFileWithAPIOptions).options || DEFAULT_API_OPTIONS;
    }

    return DEFAULT_API_OPTIONS;
}

/** Get API Options from item. */
function getDataTransferItemAPIOptions(
    item: DataTransferItem | UploadDataTransferItemWithAPIOptions,
): UploadItemAPIOptions {
    if (doesDataTransferItemContainAPIOptions(item)) {
        return (item as UploadDataTransferItemWithAPIOptions).options || DEFAULT_API_OPTIONS;
    }

    return DEFAULT_API_OPTIONS;
}

/**
 * Returns true if the given object is a Date instance encoding a valid date
 * (i.e. new Date('this is not a timestamp') should return false).
 *
 * Code adapted from
 * http://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
 */
function isValidDateObject(date: Date): boolean {
    return Object.prototype.toString.call(date) === '[object Date]' && !Number.isNaN(date.getTime());
}

/** Remove milliseconds from date time string. */
function toISOStringNoMS(date: Date): string {
    return date.toISOString().replace(/\.[0-9]{3}/, '');
}

/**
 * Returns the file's last modified date as an ISO string with no MS component (e.g.
 * '2017-04-18T17:14:27Z'), or null if no such date can be extracted from the file object.
 * (Nothing on the Internet guarantees that the file object has this info.)
 */
function getFileLastModifiedAsISONoMSIfPossible(file: UploadFile): string | null | undefined {
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
 */
function tryParseJson(maybeJson: string): unknown {
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
 */
function getBoundedExpBackoffRetryDelay(initialRetryDelay: number, maxRetryDelay: number, retryNum: number): number {
    const delay = initialRetryDelay * retryNum ** 2;
    return delay > maxRetryDelay ? maxRetryDelay : delay;
}

/** Get entry from dataTransferItem. */
function getEntryFromDataTransferItem(item: DataTransferItem): FileSystemFileEntry {
    const itemWithEntry = item as DataTransferItem & {
        mozGetAsEntry?: () => FileSystemFileEntry;
        getAsEntry?: () => FileSystemFileEntry;
    };
    const entry = item.webkitGetAsEntry || itemWithEntry.mozGetAsEntry || itemWithEntry.getAsEntry;

    return entry.call(item);
}

/** Check if a dataTransferItem is a folder. */
function isDataTransferItemAFolder(itemData: UploadDataTransferItemWithAPIOptions | DataTransferItem): boolean {
    const item = getDataTransferItem(itemData);
    const entry = getEntryFromDataTransferItem(item as DataTransferItem);
    if (!entry) {
        return false;
    }

    return entry.isDirectory;
}

/**
 * Check if a dataTransfer item is a macOS "package file"
 * @see https://en.wikipedia.org/wiki/Package_(macOS)
 */
function isDataTransferItemAPackage(itemData: UploadDataTransferItemWithAPIOptions | DataTransferItem): boolean {
    const item = getDataTransferItem(itemData);
    const isDirectory = isDataTransferItemAFolder(item);

    return isDirectory && item.type === 'application/zip' && item.kind === 'file';
}

/** Get file from FileSystemFileEntry. */
function getFileFromEntry(entry: FileSystemFileEntry): Promise<UploadFile> {
    return new Promise(resolve => {
        entry.file(file => {
            resolve(file);
        });
    });
}

/**
 * Get file from DataTransferItem or UploadDataTransferItemWithAPIOptions
 */
async function getFileFromDataTransferItem(
    itemData: UploadDataTransferItemWithAPIOptions | DataTransferItem,
): Promise<UploadFile | UploadFileWithAPIOptions | null> {
    const item = getDataTransferItem(itemData);
    const entry = getEntryFromDataTransferItem(item as DataTransferItem);
    if (!entry) {
        return null;
    }

    const file = await getFileFromEntry(entry);

    if (doesDataTransferItemContainAPIOptions(itemData)) {
        return {
            file: file as UploadFile,
            options: getDataTransferItemAPIOptions(itemData),
        };
    }

    return file;
}

/**
 * Get file from DataTransferItem or UploadDataTransferItemWithAPIOptions
 * Uses `entry`'s `getAsFile` method for retrieving package information as a single file.
 * @see https://en.wikipedia.org/wiki/Package_(macOS)
 */
function getPackageFileFromDataTransferItem(
    itemData: UploadDataTransferItemWithAPIOptions | DataTransferItem,
): UploadFile | UploadFileWithAPIOptions | null {
    const item = getDataTransferItem(itemData);
    const entry = getEntryFromDataTransferItem(item as DataTransferItem);
    if (!entry) {
        return null;
    }

    const itemFile = item.getAsFile();

    if (doesDataTransferItemContainAPIOptions(itemData)) {
        return {
            file: itemFile as UploadFile,
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
 */
function getFileId(file: UploadFileWithAPIOptions | UploadFile, rootFolderId: string): string {
    if (!doesFileContainAPIOptions(file)) {
        return (file as UploadFile).name;
    }

    const fileWithOptions = file as UploadFileWithAPIOptions;
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
    const cryptoObj = window.crypto || (window as Window & { msCrypto?: Crypto }).msCrypto;

    if (Browser.isMobileSafari()) {
        return false;
    }

    return window.location.protocol === 'https:' && !!cryptoObj && !!cryptoObj.subtle;
}

export {
    DEFAULT_API_OPTIONS,
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
