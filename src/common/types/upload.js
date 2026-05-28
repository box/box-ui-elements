// @flow
import type { Token, BoxItem } from './core';

// TODO: replace with `UploadItemStatus` from @box/uploads-manager once 'inprogress' is aligned to 'uploading'.
type UploadStatus = 'pending' | 'inprogress' | 'staged' | 'complete' | 'error' | 'canceled';

type FileSystemFileEntry = {
    createReader: Function,
    file: Function,
    isDirectory: boolean,
    isFile: boolean,
    name: string,
};

type UploadFile = File & { lastModifiedDate?: Date, webkitRelativePath?: string };

type UploadItemAPIOptions = {
    apiHost?: string,
    fileId?: string,
    folderId?: string,
    token?: Token,
    uploadInitTimestamp?: number,
};

type UploadDataTransferItemWithAPIOptions = {
    item: DataTransferItem,
    options?: UploadItemAPIOptions,
};

type UploadFileWithAPIOptions = {
    file: UploadFile,
    options?: UploadItemAPIOptions,
};

type DirectoryReader = {
    readEntries: (Function, Function) => void,
};

type FolderUploadItem = {
    boxFile?: BoxItem,
    error?: Object,
    extension: string,
    isFolder?: boolean,
    name: string,
    options?: UploadItemAPIOptions,
    progress: number,
    size: number,
    status: UploadStatus,
};

type UploadItem = {
    api: PlainUploadAPI | MultiputUploadAPI,
    boxFile?: BoxItem,
    bytesUploadedOnLastResume?: number,
    dedupeKey?: string,
    error?: Object,
    extension: string,
    file: UploadFile,
    isFolder?: boolean,
    name: string,
    options?: UploadItemAPIOptions,
    progress: number,
    size: number,
    status: UploadStatus,
};

type MultiputConfig = {
    digestReadahead: number,
    initialRetryDelayMs: number,
    maxRetryDelayMs: number,
    parallelism: number,
    requestTimeoutMs: number,
    retries: number,
};

type MultiputPart = {
    offset: number,
    part_id: string,
    sha1: string,
    size: number,
};

type MultiputData = {
    part?: MultiputPart,
};

export type {
    UploadStatus,
    FileSystemFileEntry,
    UploadFile,
    UploadItemAPIOptions,
    UploadDataTransferItemWithAPIOptions,
    UploadFileWithAPIOptions,
    DirectoryReader,
    FolderUploadItem,
    UploadItem,
    MultiputConfig,
    MultiputPart,
    MultiputData,
};
