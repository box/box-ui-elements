import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import API from '../../api';
import { Theme } from '../common/theming';
import type { BoxItem, StringMap, Token, View } from '../../common/types/core';
import type { UploadDataTransferItemWithAPIOptions, UploadFile, UploadFileWithAPIOptions, UploadItem, UploadItemAPIOptions } from '../../common/types/upload';
import '../common/fonts.scss';
import '../common/base.scss';
export interface ContentUploaderProps {
    apiHost: string;
    chunked: boolean;
    className: string;
    clientName: string;
    dataTransferItems: Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>;
    fileLimit: number;
    files?: Array<UploadFileWithAPIOptions | File>;
    isDraggingItemsToUploadsManager?: boolean;
    isFolderUploadEnabled: boolean;
    isLarge: boolean;
    isPartialUploadEnabled: boolean;
    isPrepopulateFilesEnabled?: boolean;
    isResumableUploadsEnabled: boolean;
    isSmall: boolean;
    isTouch: boolean;
    isUploadFallbackLogicEnabled: boolean;
    language?: string;
    measureRef: (ref: Element | null) => void;
    messages?: StringMap;
    onBeforeUpload: (file: Array<UploadFileWithAPIOptions | File>) => void;
    onCancel: (items?: UploadItem[]) => void;
    onClickCancel: (item: UploadItem) => void;
    onClickResume: (item: UploadItem) => void;
    onClickRetry: (item: UploadItem) => void;
    onClose: () => void;
    onComplete: (items: UploadItem[]) => void;
    onError: Function;
    onMinimize?: () => void;
    onProgress: (item: UploadItem) => void;
    onResume: (item: UploadItem) => void;
    onUpgradeCTAClick?: () => void;
    onUpload: (item?: UploadItem | BoxItem) => void;
    overwrite: boolean | 'error';
    requestInterceptor?: (response: AxiosResponse) => void;
    responseInterceptor?: (config: AxiosRequestConfig) => void;
    rootFolderId: string;
    sharedLink?: string;
    sharedLinkPassword?: string;
    theme?: Theme;
    token?: Token;
    uploadHost: string;
    useUploadsManager?: boolean;
}
type State = {
    errorCode?: string;
    isUploadsManagerExpanded: boolean;
    itemIds: Object;
    items: UploadItem[];
    view: View;
};
declare const CHUNKED_UPLOAD_MIN_SIZE_BYTES = 104857600;
declare class ContentUploader extends Component<ContentUploaderProps, State> {
    id: string;
    props: ContentUploaderProps;
    state: State;
    rootElement: HTMLElement;
    appElement: HTMLElement;
    resetItemsTimeout: ReturnType<typeof setTimeout>;
    isAutoExpanded: boolean;
    itemsRef: React.MutableRefObject<UploadItem[]>;
    itemIdsRef: React.MutableRefObject<Object>;
    static defaultProps: {
        apiHost: any;
        chunked: boolean;
        className: string;
        clientName: any;
        dataTransferItems: any[];
        files: any[];
        fileLimit: number;
        isDraggingItemsToUploadsManager: boolean;
        isFolderUploadEnabled: boolean;
        isPartialUploadEnabled: boolean;
        isPrepopulateFilesEnabled: boolean;
        isResumableUploadsEnabled: boolean;
        isUploadFallbackLogicEnabled: boolean;
        onBeforeUpload: (...args: any[]) => void;
        onCancel: (...args: any[]) => void;
        onClickCancel: (...args: any[]) => void;
        onClickResume: (...args: any[]) => void;
        onClickRetry: (...args: any[]) => void;
        onClose: (...args: any[]) => void;
        onComplete: (...args: any[]) => void;
        onError: (...args: any[]) => void;
        onMinimize: (...args: any[]) => void;
        onProgress: (...args: any[]) => void;
        onResume: (...args: any[]) => void;
        onUpload: (...args: any[]) => void;
        overwrite: boolean;
        rootFolderId: any;
        uploadHost: any;
        useUploadsManager: boolean;
    };
    /**
     * [constructor]
     *
     * @return {ContentUploader}
     */
    constructor(props: ContentUploaderProps);
    /**
     * Fetches the root folder on load
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentDidMount(): void;
    /**
     * Cancels pending uploads
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentWillUnmount(): void;
    /**
     * Adds new items to the queue when files prop gets updated in window view
     *
     * @return {void}
     */
    componentDidUpdate(): void;
    /**
     * Create and return new instance of API creator
     *
     * @param {UploadItemAPIOptions} [uploadAPIOptions]
     * @return {API}
     */
    createAPIFactory(uploadAPIOptions?: UploadItemAPIOptions): API;
    /**
     * Return base API options from props
     *
     * @private
     * @returns {Object}
     */
    getBaseAPIOptions: () => Object;
    /**
     * Given an array of files, return the files that are new to the Content Uploader
     *
     * @param {Array<UploadFileWithAPIOptions | File>} files
     */
    getNewFiles: (files: Array<UploadFileWithAPIOptions | File>) => Array<UploadFileWithAPIOptions | File>;
    /**
     * Given an array of files, return the files that are new to the Content Uploader
     *
     * @param {Array<UploadFileWithAPIOptions | File>} files
     */
    getNewDataTransferItems: (items: Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>) => Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>;
    /**
     * Converts File API to upload items and adds to upload queue.
     *
     * @private
     * @param {Array<UploadFileWithAPIOptions | UploadFile>} files - Files to be added to upload queue
     * @param {Function} itemUpdateCallback - function to be invoked after items status are updated
     * @param {boolean} [isRelativePathIgnored] - if true webkitRelativePath property is ignored
     * @return {void}
     */
    addFilesToUploadQueue: (files: Array<UploadFileWithAPIOptions | UploadFile>, itemUpdateCallback?: Function, isRelativePathIgnored?: boolean) => void;
    /**
     * Add dropped items to the upload queue
     *
     * @private
     * @param {DataTransfer} droppedItems
     * @param {Function} itemUpdateCallback
     * @returns {void}
     */
    addDroppedItemsToUploadQueue: (droppedItems: DataTransfer, itemUpdateCallback: Function) => void;
    /**
     * Add dataTransferItems to the upload queue
     *
     * @private
     * @param {DataTransferItemList} dataTransferItems
     * @param {Function} itemUpdateCallback
     * @returns {void}
     */
    addDataTransferItemsToUploadQueue: (dataTransferItems: DataTransferItemList | Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>, itemUpdateCallback: Function) => void;
    /**
     * Add dataTransferItem of file type to the upload queue
     *
     * @private
     * @param {Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>} dataTransferItems
     * @param {Function} itemUpdateCallback
     * @returns {Promise<void>}
     */
    addFileDataTransferItemsToUploadQueue: (dataTransferItems: Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>, itemUpdateCallback: Function) => Promise<void>;
    /**
     * Add dataTransferItem of package type to the upload queue
     *
     * @private
     * @param {Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>} dataTransferItems
     * @param {Function} itemUpdateCallback
     * @returns {void}
     */
    addPackageDataTransferItemsToUploadQueue: (dataTransferItems: Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>, itemUpdateCallback: Function) => void;
    /**
     * Add dataTransferItem of folder type to the upload queue
     *
     * @private
     * @param {Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>} dataTransferItems
     * @param {Function} itemUpdateCallback
     * @returns {void}
     */
    addFolderDataTransferItemsToUploadQueue: (dataTransferItems: Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>, itemUpdateCallback: Function) => void;
    /**
     * Converts File API to upload items and adds to upload queue for files with webkitRelativePath.
     *
     * @private
     * @param {Array<UploadFileWithAPIOptions | File>} files - Files to be added to upload queue
     * @param {Function} itemUpdateCallback - function to be invoked after items status are updated
     * @return {void}
     */
    addFilesWithRelativePathToQueue(files: Array<UploadFileWithAPIOptions | File>, itemUpdateCallback: Function): void;
    /**
     * Get folder upload API instance
     *
     * @private
     * @param {string} folderId
     * @return {FolderUpload}
     */
    getFolderUploadAPI: (folderId: string) => FolderUpload;
    /**
     * Add folder to upload queue
     *
     * @private
     * @param {FolderUpload} folderUpload
     * @param {Function} itemUpdateCallback
     * @param {Object} apiOptions
     * @return {void}
     */
    addFolderToUploadQueue: (folderUpload: FolderUpload, itemUpdateCallback: Function, apiOptions: Object) => void;
    /**
     * Converts File API to upload items and adds to upload queue for files with webkitRelativePath missing or ignored.
     *
     * @private
     * @param {Array<UploadFileWithAPIOptions | File>} files - Files to be added to upload queue
     * @param {Function} itemUpdateCallback - function to be invoked after items status are updated
     * @return {void}
     */
    addFilesWithoutRelativePathToQueue: (files: Array<UploadFileWithAPIOptions | File>, itemUpdateCallback: Function) => void;
    /**
     * Add new items to the upload queue
     *
     * @private
     * @param {Array<UploadFileWithAPIOptions | File>} newItems - Files to be added to upload queue
     * @param {Function} itemUpdateCallback - function to be invoked after items status are updated
     * @return {void}
     */
    addToQueue: (newItems: UploadItem[], itemUpdateCallback: Function) => void;
    /**
     * Returns a new API instance for the given file.
     *
     * @private
     * @param {File} file - File to get a new API instance for
     * @param {UploadItemAPIOptions} [uploadAPIOptions]
     * @return {UploadAPI} - Instance of Upload API
     */
    getUploadAPI(file: File, uploadAPIOptions?: UploadItemAPIOptions): any;
    /**
     * Removes an item from the upload queue. Cancels upload if in progress.
     *
     * @param {UploadItem} item - Item to remove
     * @return {void}
     */
    removeFileFromUploadQueue: (item: UploadItem) => void;
    /**
     * Aborts uploads in progress and clears upload list.
     *
     * @private
     * @return {void}
     */
    cancel: () => void;
    /**
     * Uploads all items in the upload collection.
     *
     * @private
     * @return {void}
     */
    upload: () => void;
    /**
     * Helper to upload a single file.
     *
     * @param {UploadItem} item - Upload item object
     * @return {void}
     */
    uploadFile(item: UploadItem): void;
    /**
     * Helper to resume uploading a single file.
     *
     * @param {UploadItem} item - Upload item object
     * @return {void}
     */
    resumeFile(item: UploadItem): void;
    /**
     * Helper to reset a file. Cancels any current upload and resets progress.
     *
     * @param {UploadItem} item - Upload item to reset
     * @return {void}
     */
    resetFile(item: UploadItem): void;
    /**
     * Handles a successful upload.
     *
     * @private
     * @param {UploadItem} item - Upload item corresponding to success event
     * @param {BoxItem[]} entries - Successfully uploaded Box File objects
     * @return {void}
     */
    handleUploadSuccess: (item: UploadItem, entries?: BoxItem[]) => void;
    resetUploadManagerExpandState: () => void;
    /**
     * Updates view and internal upload collection with provided items.
     *
     * @private
     * @param {UploadItem[]} item - Items to update collection with
     * @param {Function} callback
     * @return {void}
     */
    updateViewAndCollection(items: UploadItem[], callback?: () => void): void;
    /**
     * Handles an upload error.
     *
     * @private
     * @param {UploadItem} item - Upload item corresponding to error
     * @param {Error} error - Upload error
     * @return {void}
     */
    handleUploadError: (item: UploadItem, error: Error) => void;
    /**
     * Handles an upload progress event.
     *
     * @private
     * @param {UploadItem} item - Upload item corresponding to progress event
     * @param {ProgressEvent} event - Progress event
     * @return {void}
     */
    handleUploadProgress: (item: UploadItem, event: ProgressEvent) => void;
    /**
     * Updates item based on its status.
     *
     * @private
     * @param {UploadItem} item - The upload item to update
     * @return {void}
     */
    onClick: (item: UploadItem) => void;
    /**
     * Click action button for all uploads in the Uploads Manager with the given status.
     *
     * @private
     * @param {UploadStatus} - the status that items should have for their action button to be clicked
     * @return {void}
     */
    clickAllWithStatus: (status?: UploadStatus) => void;
    /**
     * Expands the upload manager
     *
     * @return {void}
     */
    expandUploadsManager: () => void;
    /**
     * Minimizes the upload manager
     *
     * @return {void}
     */
    minimizeUploadsManager: () => void;
    /**
     * Checks if the upload items should be cleared after a timeout
     *
     * @return {void}
     */
    checkClearUploadItems: () => void;
    /**
     * Toggles the upload manager
     *
     * @return {void}
     */
    toggleUploadsManager: () => void;
    /**
     * Empties the items queue
     *
     * @return {void}
     */
    resetUploadsManagerItemsWhenUploadsComplete: () => void;
    /**
     * Adds file to the upload queue and starts upload immediately
     *
     * @param {Array<UploadFileWithAPIOptions | File>} files
     * @param {Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>} dataTransferItems
     * @return {void}
     */
    addFilesWithOptionsToUploadQueueAndStartUpload: (files?: Array<UploadFileWithAPIOptions | File>, dataTransferItems?: Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>) => void;
    /**
     * Renders the content uploader
     *
     * @inheritdoc
     * @return {Component}
     */
    render(): React.JSX.Element;
}
declare const _default: any;
export default _default;
export { ContentUploader as ContentUploaderComponent, CHUNKED_UPLOAD_MIN_SIZE_BYTES };
