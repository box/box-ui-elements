/**
 * @flow
 * @file Content Uploader component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import classNames from 'classnames';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import uniqueid from 'lodash/uniqueId';
import cloneDeep from 'lodash/cloneDeep';
import { getTypedFileId, getTypedFolderId } from '../../utils/file';
import Browser from '../../utils/Browser';

import makeResponsive from '../common/makeResponsive';
import Internationalize from '../common/Internationalize';
import FolderUpload from '../../api/uploads/FolderUpload';
import API from '../../api';
import {
    getDataTransferItemId,
    getFileId,
    getFileFromDataTransferItem,
    getPackageFileFromDataTransferItem,
    getFile,
    getFileAPIOptions,
    getDataTransferItemAPIOptions,
    isDataTransferItemAFolder,
    isDataTransferItemAPackage,
    isMultiputSupported,
} from '../../utils/uploads';
import DroppableContent from './DroppableContent';
import UploadsManager from './UploadsManager';
import Footer from './Footer';
import {
    DEFAULT_ROOT,
    CLIENT_NAME_CONTENT_UPLOADER,
    DEFAULT_HOSTNAME_UPLOAD,
    DEFAULT_HOSTNAME_API,
    VIEW_ERROR,
    VIEW_UPLOAD_EMPTY,
    VIEW_UPLOAD_IN_PROGRESS,
    VIEW_UPLOAD_SUCCESS,
    STATUS_PENDING,
    STATUS_IN_PROGRESS,
    STATUS_STAGED,
    STATUS_COMPLETE,
    STATUS_ERROR,
    ERROR_CODE_UPLOAD_FILE_LIMIT,
} from '../../constants';
import type {
    UploadItem,
    UploadDataTransferItemWithAPIOptions,
    UploadFileWithAPIOptions,
    UploadFile,
    UploadItemAPIOptions,
    UploadStatus,
} from '../../common/types/upload';
import type { StringMap, Token, View, BoxItem } from '../../common/types/core';
import '../common/fonts.scss';
import '../common/base.scss';

type Props = {
    apiHost: string,
    chunked: boolean,
    className: string,
    clientName: string,
    dataTransferItems: Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>,
    fileLimit: number,
    files?: Array<UploadFileWithAPIOptions | File>,
    isDraggingItemsToUploadsManager?: boolean,
    isFolderUploadEnabled: boolean,
    isLarge: boolean,
    isResumableUploadsEnabled: boolean,
    isSmall: boolean,
    isTouch: boolean,
    isUploadFallbackLogicEnabled: boolean,
    language?: string,
    measureRef: Function,
    messages?: StringMap,
    onBeforeUpload: (file: Array<UploadFileWithAPIOptions | File>) => void,
    onCancel: Function,
    onClickCancel: UploadItem => void,
    onClickResume: UploadItem => void,
    onClickRetry: UploadItem => void,
    onClose: Function,
    onComplete: Function,
    onError: Function,
    onMinimize?: Function,
    onProgress: Function,
    onResume: Function,
    onUpgradeCTAClick?: Function,
    onUpload: Function,
    overwrite: boolean,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    rootFolderId: string,
    sharedLink?: string,
    sharedLinkPassword?: string,
    token?: Token,
    uploadHost: string,
    useUploadsManager?: boolean,
};

type State = {
    errorCode?: string,
    isUploadsManagerExpanded: boolean,
    itemIds: Object,
    items: UploadItem[],
    view: View,
    conflictedItems: UploadItem[],
};

const CHUNKED_UPLOAD_MIN_SIZE_BYTES = 104857600; // 100MB
const FILE_LIMIT_DEFAULT = 100; // Upload at most 100 files at once by default
const HIDE_UPLOAD_MANAGER_DELAY_MS_DEFAULT = 8000;
const EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD = 5;
const UPLOAD_CONCURRENCY = 6;

class ContentUploader extends Component<Props, State> {
    id: string;

    state: State;

    props: Props;

    rootElement: HTMLElement;

    appElement: HTMLElement;

    resetItemsTimeout: TimeoutID;

    isAutoExpanded: boolean = false;

    static defaultProps = {
        rootFolderId: DEFAULT_ROOT,
        apiHost: DEFAULT_HOSTNAME_API,
        chunked: true,
        className: '',
        clientName: CLIENT_NAME_CONTENT_UPLOADER,
        fileLimit: FILE_LIMIT_DEFAULT,
        uploadHost: DEFAULT_HOSTNAME_UPLOAD,
        onBeforeUpload: noop,
        onClickCancel: noop,
        onClickResume: noop,
        onClickRetry: noop,
        onClose: noop,
        onComplete: noop,
        onError: noop,
        onResume: noop,
        onUpload: noop,
        onProgress: noop,
        overwrite: true,
        useUploadsManager: false,
        files: [],
        onMinimize: noop,
        onCancel: noop,
        isFolderUploadEnabled: false,
        isResumableUploadsEnabled: false,
        isUploadFallbackLogicEnabled: false,
        dataTransferItems: [],
        isDraggingItemsToUploadsManager: false,
    };

    /**
     * [constructor]
     *
     * @return {ContentUploader}
     */
    constructor(props: Props) {
        super(props);

        const { rootFolderId, token, useUploadsManager } = props;
        this.state = {
            view: (rootFolderId && token) || useUploadsManager ? VIEW_UPLOAD_EMPTY : VIEW_ERROR,
            items: [],
            errorCode: '',
            itemIds: {},
            isUploadsManagerExpanded: false,
            conflictedItems: [],
        };
        this.id = uniqueid('bcu_');
    }

    /**
     * Fetches the root folder on load
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentDidMount() {
        this.rootElement = ((document.getElementById(this.id): any): HTMLElement);
        this.appElement = this.rootElement;
    }

    /**
     * Cancels pending uploads
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentWillUnmount() {
        this.cancel();
    }

    /**
     * Adds new items to the queue when files prop gets updated in window view
     *
     * @return {void}
     */
    componentDidUpdate(): void {
        const { files, dataTransferItems, useUploadsManager } = this.props;

        const hasFiles = Array.isArray(files) && files.length > 0;
        const hasItems = Array.isArray(dataTransferItems) && dataTransferItems.length > 0;
        const hasUploads = hasFiles || hasItems;

        if (!useUploadsManager || !hasUploads) {
            return;
        }

        // TODO: this gets called unnecessarily (upon each render regardless of the queue not changing)
        this.addFilesWithOptionsToUploadQueueAndStartUpload(files, dataTransferItems);
    }

    /**
     * Create and return new instance of API creator
     *
     * @param {UploadItemAPIOptions} [uploadAPIOptions]
     * @return {API}
     */
    createAPIFactory(uploadAPIOptions?: UploadItemAPIOptions): API {
        const { rootFolderId } = this.props;
        const folderId = getProp(uploadAPIOptions, 'folderId') || rootFolderId;
        const fileId = getProp(uploadAPIOptions, 'fileId');
        const itemFolderId = getTypedFolderId(folderId);
        const itemFileId = fileId ? getTypedFileId(fileId) : null;

        return new API({
            ...this.getBaseAPIOptions(),
            id: itemFileId || itemFolderId,
            ...uploadAPIOptions,
        });
    }

    /**
     * Return base API options from props
     *
     * @private
     * @returns {Object}
     */
    getBaseAPIOptions = (): Object => {
        const {
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            clientName,
            requestInterceptor,
            responseInterceptor,
        } = this.props;

        return {
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            clientName,
            requestInterceptor,
            responseInterceptor,
        };
    };

    /**
     * Given an array of files, return the files that are new to the Content Uploader
     *
     * @param {Array<UploadFileWithAPIOptions | File>} files
     */
    getNewFiles = (files: Array<UploadFileWithAPIOptions | File>): Array<UploadFileWithAPIOptions | File> => {
        const { rootFolderId } = this.props;
        const { itemIds } = this.state;

        return Array.from(files).filter(file => !itemIds[getFileId(file, rootFolderId)]);
    };

    /**
     * Given an array of files, return the files that are new to the Content Uploader
     *
     * @param {Array<UploadFileWithAPIOptions | File>} files
     */
    getNewDataTransferItems = (
        items: Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>,
    ): Array<DataTransferItem | UploadDataTransferItemWithAPIOptions> => {
        const { rootFolderId } = this.props;
        const { itemIds } = this.state;

        return Array.from(items).filter(item => !itemIds[getDataTransferItemId(item, rootFolderId)]);
    };

    /**
     * Converts File API to upload items and adds to upload queue.
     *
     * @private
     * @param {Array<UploadFileWithAPIOptions | UploadFile>} files - Files to be added to upload queue
     * @param {Function} itemUpdateCallback - function to be invoked after items status are updated
     * @param {boolean} [isRelativePathIgnored] - if true webkitRelativePath property is ignored
     * @return {void}
     */
    addFilesToUploadQueue = (
        files?: Array<UploadFileWithAPIOptions | UploadFile>,
        itemUpdateCallback: Function,
        isRelativePathIgnored?: boolean = false,
    ) => {
        const { onBeforeUpload, rootFolderId } = this.props;
        if (!files || files.length === 0) {
            return;
        }

        const newFiles = this.getNewFiles(files);

        if (newFiles.length === 0) {
            return;
        }

        const newItemIds = {};

        newFiles.forEach(file => {
            newItemIds[getFileId(file, rootFolderId)] = true;
        });

        clearTimeout(this.resetItemsTimeout);

        const firstFile = getFile(newFiles[0]);

        this.setState(
            state => ({
                itemIds: {
                    ...state.itemIds,
                    ...newItemIds,
                },
            }),
            () => {
                onBeforeUpload(newFiles);
                if (firstFile.webkitRelativePath && !isRelativePathIgnored) {
                    // webkitRelativePath should be ignored when the upload destination folder is known
                    this.addFilesWithRelativePathToQueue(newFiles, itemUpdateCallback);
                } else {
                    this.addFilesWithoutRelativePathToQueue(newFiles, itemUpdateCallback);
                }
            },
        );
    };

    /**
     * Add dropped items to the upload queue
     *
     * @private
     * @param {DataTransfer} droppedItems
     * @param {Function} itemUpdateCallback
     * @returns {Promise<any>}
     */
    addDroppedItemsToUploadQueue = (droppedItems: DataTransfer, itemUpdateCallback: Function): void => {
        if (droppedItems.items) {
            this.addDataTransferItemsToUploadQueue(droppedItems.items, itemUpdateCallback);
        } else {
            Array.from(droppedItems.files).forEach(file => {
                this.addFilesToUploadQueue([file], itemUpdateCallback);
            });
        }
    };

    /**
     * Add dataTransferItems to the upload queue
     *
     * @private
     * @param {DataTransferItemList} dataTransferItems
     * @param {Function} itemUpdateCallback
     * @returns {Promise<any>}
     */
    addDataTransferItemsToUploadQueue = (
        dataTransferItems: DataTransferItemList | Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>,
        itemUpdateCallback: Function,
    ): void => {
        const { isFolderUploadEnabled } = this.props;
        if (!dataTransferItems || dataTransferItems.length === 0) {
            return;
        }

        const folderItems = [];
        const fileItems = [];
        const packageItems = [];
        Array.from(dataTransferItems).forEach(item => {
            const isDirectory = isDataTransferItemAFolder(item);
            if (Browser.isSafari() && isDataTransferItemAPackage(item)) {
                packageItems.push(item);
            } else if (isDirectory && isFolderUploadEnabled) {
                folderItems.push(item);
            } else if (!isDirectory) {
                fileItems.push(item);
            }
        });

        this.addFileDataTransferItemsToUploadQueue(fileItems, itemUpdateCallback);
        this.addPackageDataTransferItemsToUploadQueue(packageItems, itemUpdateCallback);
        this.addFolderDataTransferItemsToUploadQueue(folderItems, itemUpdateCallback);
    };

    /**
     * Add dataTransferItem of file type to the upload queue
     *
     * @private
     * @param {Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>} dataTransferItems
     * @param {Function} itemUpdateCallback
     * @returns {void}
     */
    addFileDataTransferItemsToUploadQueue = (
        dataTransferItems: Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>,
        itemUpdateCallback: Function,
    ): void => {
        dataTransferItems.forEach(async item => {
            const file = await getFileFromDataTransferItem(item);
            if (!file) {
                return;
            }

            this.addFilesToUploadQueue([file], itemUpdateCallback);
        });
    };

    /**
     * Add dataTransferItem of package type to the upload queue
     *
     * @private
     * @param {Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>} dataTransferItems
     * @param {Function} itemUpdateCallback
     * @returns {void}
     */
    addPackageDataTransferItemsToUploadQueue = (
        dataTransferItems: Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>,
        itemUpdateCallback: Function,
    ): void => {
        dataTransferItems.forEach(item => {
            const file = getPackageFileFromDataTransferItem(item);

            if (!file) {
                return;
            }

            this.addFilesToUploadQueue([file], itemUpdateCallback);
        });
    };

    /**
     * Add dataTransferItem of folder type to the upload queue
     *
     * @private
     * @param {Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>} dataTransferItems
     * @param {Function} itemUpdateCallback
     * @returns {Promise<any>}
     */
    addFolderDataTransferItemsToUploadQueue = async (
        dataTransferItems: Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>,
        itemUpdateCallback: Function,
    ): Promise<any> => {
        const { rootFolderId } = this.props;
        const { itemIds } = this.state;
        if (dataTransferItems.length === 0) {
            return;
        }

        const newItems = this.getNewDataTransferItems(dataTransferItems);
        newItems.forEach(item => {
            itemIds[getDataTransferItemId(item, rootFolderId)] = true;
        });

        if (newItems.length === 0) {
            return;
        }

        const fileAPIOptions: Object = getDataTransferItemAPIOptions(newItems[0]);
        const { folderId = rootFolderId } = fileAPIOptions;
        newItems.forEach(async item => {
            const folderUpload = this.getFolderUploadAPI(folderId);
            await folderUpload.buildFolderTreeFromDataTransferItem(item);
            this.addFolderToUploadQueue(folderUpload, itemUpdateCallback, fileAPIOptions);
        });
    };

    /**
     * Converts File API to upload items and adds to upload queue for files with webkitRelativePath.
     *
     * @private
     * @param {Array<UploadFileWithAPIOptions | File>} files - Files to be added to upload queue
     * @param {Function} itemUpdateCallback - function to be invoked after items status are updated
     * @return {void}
     */
    addFilesWithRelativePathToQueue(files: Array<UploadFileWithAPIOptions | File>, itemUpdateCallback: Function) {
        if (files.length === 0) {
            return;
        }

        const { rootFolderId } = this.props;
        const fileAPIOptions: Object = getFileAPIOptions(files[0]);
        const { folderId = rootFolderId } = fileAPIOptions;
        const folderUpload = this.getFolderUploadAPI(folderId);

        // Only 1 folder tree can be built with files having webkitRelativePath properties
        folderUpload.buildFolderTreeFromWebkitRelativePath(files);

        this.addFolderToUploadQueue(folderUpload, itemUpdateCallback, fileAPIOptions);
    }

    /**
     * Get folder upload API instance
     *
     * @private
     * @param {string} folderId
     * @return {FolderUpload}
     */
    getFolderUploadAPI = (folderId: string): FolderUpload => {
        const uploadBaseAPIOptions = this.getBaseAPIOptions();

        return new FolderUpload(this.addFilesToUploadQueue, folderId, this.addToQueue, uploadBaseAPIOptions);
    };

    /**
     * Add folder to upload queue
     *
     * @private
     * @param {FolderUpload} folderUpload
     * @param {Function} itemUpdateCallback
     * @param {Object} apiOptions
     * @return {void}
     */
    addFolderToUploadQueue = (folderUpload: FolderUpload, itemUpdateCallback: Function, apiOptions: Object): void => {
        this.addToQueue(
            [
                // $FlowFixMe no file property
                {
                    api: folderUpload,
                    extension: '',
                    isFolder: true,
                    name: folderUpload.folder.name,
                    options: apiOptions,
                    progress: 0,
                    size: 1,
                    status: STATUS_PENDING,
                },
            ],
            itemUpdateCallback,
        );
    };

    /**
     * Converts File API to upload items and adds to upload queue for files with webkitRelativePath missing or ignored.
     *
     * @private
     * @param {Array<UploadFileWithAPIOptions | File>} files - Files to be added to upload queue
     * @param {Function} itemUpdateCallback - function to be invoked after items status are updated
     * @return {void}
     */
    addFilesWithoutRelativePathToQueue = (
        files: Array<UploadFileWithAPIOptions | File>,
        itemUpdateCallback: Function,
    ) => {
        const { itemIds } = this.state;
        const { rootFolderId } = this.props;

        // Convert files from the file API to upload items
        const newItems = files.map(file => {
            const uploadFile = getFile(file);
            const uploadAPIOptions = getFileAPIOptions(file);
            const { name, size } = uploadFile;

            // Extract extension or use empty string if file has no extension
            let extension = name.substr(name.lastIndexOf('.') + 1);
            if (extension.length === name.length) {
                extension = '';
            }

            const api = this.getUploadAPI(uploadFile, uploadAPIOptions);
            const uploadItem: Object = {
                api,
                extension,
                file: uploadFile,
                name,
                progress: 0,
                size,
                status: STATUS_PENDING,
            };

            if (uploadAPIOptions) {
                uploadItem.options = uploadAPIOptions;
            }

            itemIds[getFileId(uploadItem, rootFolderId)] = true;

            return uploadItem;
        });

        if (newItems.length === 0) {
            return;
        }

        this.setState({
            itemIds,
        });
        this.addToQueue(newItems, itemUpdateCallback);
    };

    /**
     * Add new items to the upload queue
     *
     * @private
     * @param {Array<UploadFileWithAPIOptions | File>} newItems - Files to be added to upload queue
     * @param {Function} itemUpdateCallback - function to be invoked after items status are updated
     * @return {void}
     */
    addToQueue = (newItems: UploadItem[], itemUpdateCallback: Function) => {
        const { fileLimit, useUploadsManager } = this.props;
        const { items, isUploadsManagerExpanded } = this.state;

        let updatedItems = [];
        const prevItemsNum = items.length;
        const totalNumOfItems = prevItemsNum + newItems.length;

        // Don't add more than fileLimit # of items
        if (totalNumOfItems > fileLimit) {
            updatedItems = items.concat(newItems.slice(0, fileLimit - items.length));
            this.setState({
                errorCode: ERROR_CODE_UPLOAD_FILE_LIMIT,
            });
        } else {
            updatedItems = items.concat(newItems);
            this.setState({ errorCode: '' });

            // If the number of items being uploaded passes the threshold, expand the upload manager
            if (
                prevItemsNum < EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD &&
                totalNumOfItems >= EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD &&
                useUploadsManager &&
                !isUploadsManagerExpanded
            ) {
                this.isAutoExpanded = true;
                this.expandUploadsManager();
            }
        }

        this.updateViewAndCollection(updatedItems, () => {
            if (itemUpdateCallback) {
                itemUpdateCallback();
            }

            const { view } = this.state;
            // Automatically start upload if other files are being uploaded
            if (view === VIEW_UPLOAD_IN_PROGRESS) {
                this.upload();
            }
        });
    };

    /**
     * Returns a new API instance for the given file.
     *
     * @private
     * @param {File} file - File to get a new API instance for
     * @param {UploadItemAPIOptions} [uploadAPIOptions]
     * @return {UploadAPI} - Instance of Upload API
     */
    getUploadAPI(file: File, uploadAPIOptions?: UploadItemAPIOptions) {
        const { chunked, isResumableUploadsEnabled, isUploadFallbackLogicEnabled } = this.props;
        const { size } = file;
        const factory = this.createAPIFactory(uploadAPIOptions);

        if (chunked && size > CHUNKED_UPLOAD_MIN_SIZE_BYTES) {
            if (isMultiputSupported()) {
                const chunkedUploadAPI = factory.getChunkedUploadAPI();
                if (isResumableUploadsEnabled) {
                    chunkedUploadAPI.isResumableUploadsEnabled = true;
                }
                if (isUploadFallbackLogicEnabled) {
                    chunkedUploadAPI.isUploadFallbackLogicEnabled = true;
                }
                return chunkedUploadAPI;
            }

            /* eslint-disable no-console */
            console.warn(
                'Chunked uploading is enabled, but not supported by your browser. You may need to enable HTTPS.',
            );
            /* eslint-enable no-console */
        }

        const plainUploadAPI = factory.getPlainUploadAPI();
        if (isUploadFallbackLogicEnabled) {
            plainUploadAPI.isUploadFallbackLogicEnabled = true;
        }

        return plainUploadAPI;
    }

    /**
     * Removes an item from the upload queue. Cancels upload if in progress.
     *
     * @param {UploadItem} item - Item to remove
     * @return {void}
     */
    removeFileFromUploadQueue = (item: UploadItem) => {
        const { onCancel, useUploadsManager } = this.props;
        const { items } = this.state;
        // Clear any error errorCode in footer
        this.setState({ errorCode: '' });

        const { api } = item;
        api.cancel();

        items.splice(items.indexOf(item), 1);

        onCancel([item]);
        this.updateViewAndCollection(items, () => {
            // Minimize uploads manager if there are no more items
            if (useUploadsManager && !items.length) {
                this.minimizeUploadsManager();
            }

            const { view } = this.state;
            if (view === VIEW_UPLOAD_IN_PROGRESS) {
                this.upload();
            }
        });
    };

    /**
     * Aborts uploads in progress and clears upload list.
     *
     * @private
     * @return {void}
     */
    cancel = () => {
        const { items } = this.state;
        items.forEach(uploadItem => {
            const { api, status } = uploadItem;
            if (status === STATUS_IN_PROGRESS) {
                api.cancel();
            }
        });

        // Reset upload collection
        this.updateViewAndCollection([]);
    };

    /**
     * Uploads all items in the upload collection.
     *
     * @private
     * @return {void}
     */
    upload = () => {
        const { items } = this.state;
        items.forEach(uploadItem => {
            if (uploadItem.status === STATUS_PENDING) {
                this.uploadFile(uploadItem);
            }
        });
    };

    /**
     * Helper to upload a single file.
     *
     * @param {UploadItem} item - Upload item object
     * @return {void}
     */
    uploadFile(item: UploadItem) {
        this.setState({
            conflictedItems: [],
        });

        const { overwrite, rootFolderId } = this.props;
        const { api, file, options } = item;
        const { items } = this.state;

        const numItemsUploading = items.filter(item_t => item_t.status === STATUS_IN_PROGRESS).length;

        if (numItemsUploading >= UPLOAD_CONCURRENCY) {
            return;
        }

        const uploadOptions: Object = {
            file,
            folderId: options && options.folderId ? options.folderId : rootFolderId,
            errorCallback: error => this.handleUploadError(item, error),
            progressCallback: event => this.handleUploadProgress(item, event),
            successCallback: entries => this.handleUploadSuccess(item, entries),
            overwrite,
            fileId: options && options.fileId ? options.fileId : null,
        };

        item.status = STATUS_IN_PROGRESS;
        items[items.indexOf(item)] = item;

        api.upload(uploadOptions);

        this.updateViewAndCollection(items);
    }

    /**
     * Helper to resume uploading a single file.
     *
     * @param {UploadItem} item - Upload item object
     * @return {void}
     */
    resumeFile(item: UploadItem) {
        const { overwrite, rootFolderId, onResume } = this.props;
        const { api, file, options } = item;
        const { items } = this.state;

        const numItemsUploading = items.filter(item_t => item_t.status === STATUS_IN_PROGRESS).length;

        if (numItemsUploading >= UPLOAD_CONCURRENCY) {
            return;
        }

        const resumeOptions: Object = {
            file,
            folderId: options && options.folderId ? options.folderId : rootFolderId,
            errorCallback: error => this.handleUploadError(item, error),
            progressCallback: event => this.handleUploadProgress(item, event),
            successCallback: entries => this.handleUploadSuccess(item, entries),
            overwrite,
            sessionId: api && api.sessionId ? api.sessionId : null,
            fileId: options && options.fileId ? options.fileId : null,
        };

        item.status = STATUS_IN_PROGRESS;
        delete item.error;
        items[items.indexOf(item)] = item;

        onResume(item);
        api.resume(resumeOptions);

        this.updateViewAndCollection(items);
    }

    /**
     * Helper to reset a file. Cancels any current upload and resets progress.
     *
     * @param {UploadItem} item - Upload item to reset
     * @return {void}
     */
    resetFile(item: UploadItem) {
        const { api, file, options } = item;
        if (api && typeof api.cancel === 'function') {
            api.cancel();
        }

        // Reset API, progress & status
        item.api = this.getUploadAPI(file, options);
        item.progress = 0;
        item.status = STATUS_PENDING;
        delete item.error;

        const { items } = this.state;
        items[items.indexOf(item)] = item;

        this.updateViewAndCollection(items);
    }

    /**
     * Handles a successful upload.
     *
     * @private
     * @param {UploadItem} item - Upload item corresponding to success event
     * @param {BoxItem[]} entries - Successfully uploaded Box File objects
     * @return {void}
     */
    handleUploadSuccess = (item: UploadItem, entries?: BoxItem[]) => {
        const { onUpload, useUploadsManager } = this.props;

        item.progress = 100;
        if (!item.error) {
            item.status = STATUS_COMPLETE;
        }

        // Cache Box File object of successfully uploaded item
        if (entries && entries.length === 1) {
            const [boxFile] = entries;
            item.boxFile = boxFile;
        }

        const { items } = this.state;
        items[items.indexOf(item)] = item;

        // Broadcast that a file has been uploaded
        if (useUploadsManager) {
            onUpload(item);
            this.checkClearUploadItems();
        } else {
            onUpload(item.boxFile);
        }

        this.updateViewAndCollection(items, () => {
            const { view } = this.state;
            if (view === VIEW_UPLOAD_IN_PROGRESS) {
                this.upload();
            }
        });
    };

    resetUploadManagerExpandState = () => {
        this.isAutoExpanded = false;
        this.setState({
            isUploadsManagerExpanded: false,
        });
    };

    /**
     * Updates view and internal upload collection with provided items.
     *
     * @private
     * @param {UploadItem[]} item - Items to update collection with
     * @param {Function} callback
     * @return {void}
     */
    updateViewAndCollection(items: UploadItem[], callback?: Function) {
        const { onComplete, useUploadsManager, isResumableUploadsEnabled }: Props = this.props;
        const someUploadIsInProgress = items.some(uploadItem => uploadItem.status !== STATUS_COMPLETE);
        const someUploadHasFailed = items.some(uploadItem => uploadItem.status === STATUS_ERROR);
        const allItemsArePending = !items.some(uploadItem => uploadItem.status !== STATUS_PENDING);
        const noFileIsPendingOrInProgress = items.every(
            uploadItem => uploadItem.status !== STATUS_PENDING && uploadItem.status !== STATUS_IN_PROGRESS,
        );
        const areAllItemsFinished = items.every(
            uploadItem => uploadItem.status === STATUS_COMPLETE || uploadItem.status === STATUS_ERROR,
        );
        const uploadItemsStatus = isResumableUploadsEnabled ? areAllItemsFinished : noFileIsPendingOrInProgress;

        let view = '';
        if ((items && items.length === 0) || allItemsArePending) {
            view = VIEW_UPLOAD_EMPTY;
        } else if (someUploadHasFailed && useUploadsManager) {
            view = VIEW_ERROR;
        } else if (someUploadIsInProgress) {
            view = VIEW_UPLOAD_IN_PROGRESS;
        } else {
            view = VIEW_UPLOAD_SUCCESS;

            if (!useUploadsManager) {
                onComplete(cloneDeep(items.map(item => item.boxFile)));
                // Reset item collection after successful upload
                items = [];
            }
        }

        if (uploadItemsStatus && useUploadsManager) {
            if (this.isAutoExpanded) {
                this.resetUploadManagerExpandState();
            } // Else manually expanded so don't close
            onComplete(items);
        }

        const state: Object = {
            items,
            view,
        };

        if (items.length === 0) {
            state.itemIds = {};
            state.errorCode = '';
        }

        this.setState(state, callback);
    }

    /**
     * Handles an upload error.
     *
     * @private
     * @param {UploadItem} item - Upload item corresponding to error
     * @param {Error} error - Upload error
     * @return {void}
     */
    handleUploadError = (item: UploadItem, error: Error) => {
        const { onError, useUploadsManager } = this.props;
        const { file } = item;
        const { items } = this.state;

        item.status = STATUS_ERROR;
        item.error = error;

        const newItems = [...items];
        const index = newItems.findIndex(singleItem => singleItem === item);
        if (index !== -1) {
            newItems[index] = item;
        }

        // Broadcast that there was an error uploading a file
        const errorData = useUploadsManager
            ? {
                  item,
                  error,
              }
            : {
                  file,
                  error,
              };

        onError(errorData);

        this.updateViewAndCollection(newItems, () => {
            if (useUploadsManager) {
                this.isAutoExpanded = true;
                this.expandUploadsManager();
            }
            const { view } = this.state;
            if (view === VIEW_UPLOAD_IN_PROGRESS) {
                this.upload();
            }
        });
    };

    /**
     * Handles an upload progress event.
     *
     * @private
     * @param {UploadItem} item - Upload item corresponding to progress event
     * @param {ProgressEvent} event - Progress event
     * @return {void}
     */
    handleUploadProgress = (item: UploadItem, event: any) => {
        if (!event.total || item.status === STATUS_COMPLETE || item.status === STATUS_STAGED) {
            return;
        }

        item.progress = Math.min(Math.round((event.loaded / event.total) * 100), 100);
        item.status = item.progress === 100 ? STATUS_STAGED : STATUS_IN_PROGRESS;

        const { onProgress } = this.props;
        onProgress(item);

        const { items } = this.state;
        items[items.indexOf(item)] = item;

        this.updateViewAndCollection(items);
    };

    /**
     * Updates item based on its status.
     *
     * @private
     * @param {UploadItem} item - The upload item to update
     * @return {void}
     */
    onClick = (item: UploadItem) => {
        const { chunked, isResumableUploadsEnabled, onClickCancel, onClickResume, onClickRetry } = this.props;
        const { status, file } = item;
        const isChunkedUpload =
            chunked && !item.isFolder && file.size > CHUNKED_UPLOAD_MIN_SIZE_BYTES && isMultiputSupported();
        const isResumable = isResumableUploadsEnabled && isChunkedUpload && item.api.sessionId;

        switch (status) {
            case STATUS_IN_PROGRESS:
            case STATUS_STAGED:
            case STATUS_COMPLETE:
            case STATUS_PENDING:
                this.removeFileFromUploadQueue(item);
                onClickCancel(item);
                break;
            case STATUS_ERROR:
                if (isResumable) {
                    item.bytesUploadedOnLastResume = item.api.totalUploadedBytes;
                    this.resumeFile(item);
                    onClickResume(item);
                } else {
                    this.resetFile(item);
                    this.uploadFile(item);
                    onClickRetry(item);
                }
                break;
            default:
                break;
        }
    };

    /**
     * Click action button for all uploads in the Uploads Manager with the given status.
     *
     * @private
     * @param {UploadStatus} - the status that items should have for their action button to be clicked
     * @return {void}
     */
    clickAllWithStatus = (status?: UploadStatus) => {
        const { items } = this.state;

        items.forEach(item => {
            if (!status || item.status === status) {
                this.onClick(item);
            }
        });
    };

    /**
     * Expands the upload manager
     *
     * @return {void}
     */
    expandUploadsManager = (): void => {
        const { useUploadsManager } = this.props;

        if (!useUploadsManager) {
            return;
        }

        clearTimeout(this.resetItemsTimeout);

        this.setState({ isUploadsManagerExpanded: true });
    };

    /**
     * Minimizes the upload manager
     *
     * @return {void}
     */
    minimizeUploadsManager = (): void => {
        const { useUploadsManager, onMinimize } = this.props;

        if (!useUploadsManager || !onMinimize) {
            return;
        }

        clearTimeout(this.resetItemsTimeout);

        onMinimize();
        this.resetUploadManagerExpandState();
        this.checkClearUploadItems();
    };

    /**
     * Checks if the upload items should be cleared after a timeout
     *
     * @return {void}
     */
    checkClearUploadItems = () => {
        this.resetItemsTimeout = setTimeout(
            this.resetUploadsManagerItemsWhenUploadsComplete,
            HIDE_UPLOAD_MANAGER_DELAY_MS_DEFAULT,
        );
    };

    /**
     * Toggles the upload manager
     *
     * @return {void}
     */
    toggleUploadsManager = (): void => {
        const { isUploadsManagerExpanded } = this.state;

        if (isUploadsManagerExpanded) {
            this.minimizeUploadsManager();
        } else {
            this.expandUploadsManager();
        }
    };

    /**
     * Empties the items queue
     *
     * @return {void}
     */
    resetUploadsManagerItemsWhenUploadsComplete = (): void => {
        const { view, items, isUploadsManagerExpanded } = this.state;
        const { useUploadsManager, onCancel } = this.props;

        // Do not reset items when upload manger is expanded or there're uploads in progress
        if ((isUploadsManagerExpanded && useUploadsManager && !!items.length) || view === VIEW_UPLOAD_IN_PROGRESS) {
            return;
        }

        onCancel(items);

        this.setState({
            items: [],
            itemIds: {},
        });
    };

    /**
     * Adds file to the upload queue and starts upload immediately
     *
     * @param {Array<UploadFileWithAPIOptions | File>} files - Files to be added to upload queue
     * @return {void}
     */
    addFilesWithOptionsToUploadQueueAndStartUpload = (
        files?: Array<UploadFileWithAPIOptions | File>,
        dataTransferItems: Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>,
    ): void => {
        this.addFilesToUploadQueue(files, this.upload);
        this.addDataTransferItemsToUploadQueue(dataTransferItems, this.upload);
    };

    /**
     * Renders the content uploader
     *
     * @inheritdoc
     * @return {Component}
     */
    render() {
        const {
            className,
            fileLimit,
            isDraggingItemsToUploadsManager = false,
            isFolderUploadEnabled,
            isResumableUploadsEnabled,
            isTouch,
            language,
            measureRef,
            messages,
            onClose,
            onUpgradeCTAClick,
            useUploadsManager,
        }: Props = this.props;
        const { view, items, errorCode, isUploadsManagerExpanded }: State = this.state;
        const isEmpty = items.length === 0;
        const isVisible = !isEmpty || !!isDraggingItemsToUploadsManager;

        const hasFiles = items.length !== 0;
        const isLoading = items.some(item => item.status === STATUS_IN_PROGRESS);
        const isDone = items.every(item => item.status === STATUS_COMPLETE || item.status === STATUS_STAGED);
        const styleClassName = classNames('bcu', className, {
            'be-app-element': !useUploadsManager,
            be: !useUploadsManager,
        });

        items.forEach(item => {
            const fileFromApi = item?.api?.file;

            if (
                fileFromApi &&
                item?.api.hasConflict &&
                !this.state.conflictedItems.find(conflictedItem => fileFromApi?.name === conflictedItem.name)
            ) {
                this.setState({
                    conflictedItems: [...this.state.conflictedItems, fileFromApi],
                });
            }
        });

        return (
            <Internationalize language={language} messages={messages}>
                {useUploadsManager ? (
                    <div ref={measureRef} className={styleClassName} id={this.id}>
                        <UploadsManager
                            isDragging={isDraggingItemsToUploadsManager}
                            isExpanded={isUploadsManagerExpanded}
                            isResumableUploadsEnabled={isResumableUploadsEnabled}
                            isVisible={isVisible}
                            items={items}
                            onItemActionClick={this.onClick}
                            onRemoveActionClick={this.removeFileFromUploadQueue}
                            onUpgradeCTAClick={onUpgradeCTAClick}
                            onUploadsManagerActionClick={this.clickAllWithStatus}
                            toggleUploadsManager={this.toggleUploadsManager}
                            view={view}
                        />
                    </div>
                ) : (
                    <div ref={measureRef} className={styleClassName} id={this.id}>
                        <DroppableContent
                            addDataTransferItemsToUploadQueue={this.addDroppedItemsToUploadQueue}
                            addFiles={this.addFilesToUploadQueue}
                            allowedTypes={['Files']}
                            isFolderUploadEnabled={isFolderUploadEnabled}
                            isTouch={isTouch}
                            items={items}
                            onClick={this.onClick}
                            view={view}
                            conflictedItems={this.state.conflictedItems}
                        />
                        <Footer
                            errorCode={errorCode}
                            fileLimit={fileLimit}
                            hasFiles={hasFiles}
                            isLoading={isLoading}
                            onCancel={this.cancel}
                            onClose={onClose}
                            onUpload={this.upload}
                            isDone={isDone}
                        />
                    </div>
                )}
            </Internationalize>
        );
    }
}

export type ContentUploaderProps = Props;
export default makeResponsive(ContentUploader);
export { ContentUploader as ContentUploaderComponent, CHUNKED_UPLOAD_MIN_SIZE_BYTES };
