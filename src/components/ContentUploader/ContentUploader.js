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
import { getTypedFileId, getTypedFolderId } from '../../util/file';
import API from '../../api';
import DroppableContent from './DroppableContent';
import UploadsManager from './UploadsManager';
import Footer from './Footer';
import makeResponsive from '../makeResponsive';
import Internationalize from '../Internationalize';
import FolderUpload from '../../api/uploads/FolderUpload';
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
    STATUS_COMPLETE,
    STATUS_ERROR,
    ERROR_CODE_UPLOAD_FILE_LIMIT,
} from '../../constants';
import '../fonts.scss';
import '../base.scss';
import {
    getDataTransferItemId,
    getFileId,
    getFileFromDataTransferItem,
    getFile,
    getFileAPIOptions,
    getDataTransferItemAPIOptions,
    isDataTransferItemAFolder,
    isMultiputSupported,
} from '../../util/uploads';

type Props = {
    apiHost: string,
    chunked: boolean,
    className: string,
    clientName: string,
    fileLimit: number,
    files?: Array<UploadFileWithAPIOptions | File>,
    isFolderUploadEnabled: boolean,
    isLarge: boolean,
    isSmall: boolean,
    isTouch: boolean,
    language?: string,
    measureRef: Function,
    messages?: StringMap,
    onCancel: Function,
    onClose: Function,
    onComplete: Function,
    onError: Function,
    onMinimize?: Function,
    onUpload: Function,
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
    dataTransferItems: Array<
        DataTransferItem | UploadDataTransferItemWithAPIOptions,
    >,
    isDraggingItemsToUploadsManager?: boolean,
};

type State = {
    errorCode?: string,
    isUploadsManagerExpanded: boolean,
    itemIds: Object,
    items: UploadItem[],
    view: View,
};

const CHUNKED_UPLOAD_MIN_SIZE_BYTES = 52428800; // 50MB
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

    numItemsUploading: number = 0;

    static defaultProps = {
        rootFolderId: DEFAULT_ROOT,
        apiHost: DEFAULT_HOSTNAME_API,
        chunked: true,
        className: '',
        clientName: CLIENT_NAME_CONTENT_UPLOADER,
        fileLimit: FILE_LIMIT_DEFAULT,
        uploadHost: DEFAULT_HOSTNAME_UPLOAD,
        onClose: noop,
        onComplete: noop,
        onError: noop,
        onUpload: noop,
        overwrite: true,
        useUploadsManager: false,
        files: [],
        onMinimize: noop,
        onCancel: noop,
        isFolderUploadEnabled: false,
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
            view:
                (rootFolderId && token) || useUploadsManager
                    ? VIEW_UPLOAD_EMPTY
                    : VIEW_ERROR,
            items: [],
            errorCode: '',
            itemIds: {},
            isUploadsManagerExpanded: false,
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
        this.rootElement = ((document.getElementById(
            this.id,
        ): any): HTMLElement);
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
     * @param {Props} nextProps
     * @return {void}
     */
    componentWillReceiveProps(nextProps: Props) {
        const { files, dataTransferItems, useUploadsManager } = nextProps;

        const hasFiles = Array.isArray(files) && files.length > 0;
        const hasItems =
            Array.isArray(dataTransferItems) && dataTransferItems.length > 0;
        const hasUploads = hasFiles || hasItems;

        if (!useUploadsManager || !hasUploads) {
            return;
        }

        this.addFilesWithOptionsToUploadQueueAndStartUpload(
            files,
            dataTransferItems,
        );
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
    getNewFiles = (
        files: Array<UploadFileWithAPIOptions | File>,
    ): Array<UploadFileWithAPIOptions | File> => {
        const { rootFolderId } = this.props;
        const { itemIds } = this.state;

        return Array.from(files).filter(
            file => !itemIds[getFileId(file, rootFolderId)],
        );
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

        return Array.from(items).filter(
            item => !itemIds[getDataTransferItemId(item, rootFolderId)],
        );
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
        const { rootFolderId } = this.props;
        if (!files || files.length === 0) {
            return;
        }

        const { itemIds } = this.state;
        const newFiles = this.getNewFiles(files);

        if (newFiles.length === 0) {
            return;
        }

        newFiles.forEach(file => {
            itemIds[getFileId(file, rootFolderId)] = true;
        });

        clearTimeout(this.resetItemsTimeout);

        const firstFile = getFile(newFiles[0]);

        // webkitRelativePath should be ignored when the upload destination folder is known
        if (firstFile.webkitRelativePath && !isRelativePathIgnored) {
            this.addFilesWithRelativePathToQueue(newFiles, itemUpdateCallback);
            return;
        }

        this.addFilesWithoutRelativePathToQueue(newFiles, itemUpdateCallback);
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
        dataTransferItems:
            | DataTransferItemList
            | Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>,
        itemUpdateCallback: Function,
    ): void => {
        const { isFolderUploadEnabled } = this.props;
        if (!dataTransferItems || dataTransferItems.length === 0) {
            return;
        }

        const folderItems = [];
        const fileItems = [];

        Array.from(dataTransferItems).forEach(item => {
            const isDirectory = isDataTransferItemAFolder(item);
            if (isDirectory && isFolderUploadEnabled) {
                folderItems.push(item);
            } else if (!isDirectory) {
                fileItems.push(item);
            }
        });

        this.addFileDataTransferItemsToUploadQueue(
            fileItems,
            itemUpdateCallback,
        );
        this.addFolderDataTransferItemsToUploadQueue(
            folderItems,
            itemUpdateCallback,
        );
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
        dataTransferItems: Array<
            DataTransferItem | UploadDataTransferItemWithAPIOptions,
        >,
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
     * Add dataTransferItem of folder type to the upload queue
     *
     * @private
     * @param {Array<DataTransferItem | UploadDataTransferItemWithAPIOptions>} dataTransferItems
     * @param {Function} itemUpdateCallback
     * @returns {Promise<any>}
     */
    addFolderDataTransferItemsToUploadQueue = async (
        dataTransferItems: Array<
            DataTransferItem | UploadDataTransferItemWithAPIOptions,
        >,
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

        // $FlowFixMe
        const fileAPIOptions: Object = getDataTransferItemAPIOptions(
            newItems[0],
        );
        const { folderId = rootFolderId } = fileAPIOptions;

        newItems.forEach(async item => {
            const folderUpload = this.getFolderUploadAPI(folderId);
            await folderUpload.buildFolderTreeFromDataTransferItem(item);
            this.addFolderToUploadQueue(
                folderUpload,
                itemUpdateCallback,
                fileAPIOptions,
            );
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
    addFilesWithRelativePathToQueue(
        files: Array<UploadFileWithAPIOptions | File>,
        itemUpdateCallback: Function,
    ) {
        if (files.length === 0) {
            return;
        }

        const { rootFolderId } = this.props;
        // $FlowFixMe
        const fileAPIOptions: Object = getFileAPIOptions(files[0]);
        const { folderId = rootFolderId } = fileAPIOptions;
        const folderUpload = this.getFolderUploadAPI(folderId);

        // Only 1 folder tree can be built with files having webkitRelativePath properties
        folderUpload.buildFolderTreeFromWebkitRelativePath(files);

        this.addFolderToUploadQueue(
            folderUpload,
            itemUpdateCallback,
            fileAPIOptions,
        );
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

        return new FolderUpload(
            this.addFilesToUploadQueue,
            folderId,
            this.addToQueue,
            uploadBaseAPIOptions,
        );
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
    addFolderToUploadQueue = (
        folderUpload: FolderUpload,
        itemUpdateCallback: Function,
        apiOptions: Object,
    ): void => {
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
        const { view, items } = this.state;

        let updatedItems = [];
        const prevItemsNum = items.length;
        const totalNumOfItems = prevItemsNum + newItems.length;

        // Don't add more than fileLimit # of items
        if (totalNumOfItems > fileLimit) {
            updatedItems = items.concat(
                newItems.slice(0, fileLimit - items.length),
            );
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
                useUploadsManager
            ) {
                this.expandUploadsManager();
            }
        }

        this.updateViewAndCollection(updatedItems, itemUpdateCallback);

        // Automatically start upload if other files are being uploaded
        if (view === VIEW_UPLOAD_IN_PROGRESS) {
            this.upload();
        }
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
        const { chunked } = this.props;
        const { size } = file;
        const factory = this.createAPIFactory(uploadAPIOptions);

        if (chunked && size > CHUNKED_UPLOAD_MIN_SIZE_BYTES) {
            if (isMultiputSupported()) {
                return factory.getChunkedUploadAPI();
            }

            /* eslint-disable no-console */
            console.warn(
                'Chunked uploading is enabled, but not supported by your browser. You may need to enable HTTPS.',
            );
            /* eslint-enable no-console */
        }

        return factory.getPlainUploadAPI();
    }

    /**
     * Removes an item from the upload queue. Cancels upload if in progress.
     *
     * @param {UploadItem} item - Item to remove
     * @return {void}
     */
    removeFileFromUploadQueue(item: UploadItem) {
        const { onCancel, useUploadsManager } = this.props;
        // Clear any error errorCode in footer
        this.setState({ errorCode: '' });

        const { api } = item;
        api.cancel();

        const { items } = this.state;
        items.splice(items.indexOf(item), 1);

        // Minimize uploads manager if there are no more items
        const callback =
            useUploadsManager && !items.length
                ? this.minimizeUploadsManager
                : noop;

        onCancel([item]);
        this.updateViewAndCollection(items, callback);
    }

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
        const { overwrite, rootFolderId } = this.props;
        const { api, file, options } = item;

        if (this.numItemsUploading >= UPLOAD_CONCURRENCY) {
            return;
        }

        this.numItemsUploading += 1;

        const uploadOptions: Object = {
            file,
            folderId:
                options && options.folderId ? options.folderId : rootFolderId,
            errorCallback: error => this.handleUploadError(item, error),
            progressCallback: event => this.handleUploadProgress(item, event),
            successCallback: entries => this.handleUploadSuccess(item, entries),
            overwrite,
            fileId: options && options.fileId ? options.fileId : null,
        };

        item.status = STATUS_IN_PROGRESS;
        const { items } = this.state;
        items[items.indexOf(item)] = item;

        api.upload(uploadOptions);

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
        item.status = STATUS_COMPLETE;
        this.numItemsUploading -= 1;

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
            this.hideUploadsManager();
        } else {
            onUpload(item.boxFile);
        }

        this.updateViewAndCollection(items);
        this.upload();
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
        const { onComplete, useUploadsManager }: Props = this.props;
        const someUploadIsInProgress = items.some(
            uploadItem => uploadItem.status !== STATUS_COMPLETE,
        );
        const someUploadHasFailed = items.some(
            uploadItem => uploadItem.status === STATUS_ERROR,
        );
        const allItemsArePending = !items.some(
            uploadItem => uploadItem.status !== STATUS_PENDING,
        );
        const noFileIsPendingOrInProgress = items.every(
            uploadItem =>
                uploadItem.status !== STATUS_PENDING &&
                uploadItem.status !== STATUS_IN_PROGRESS,
        );

        let view = '';
        let itemIds;
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
                items = []; // eslint-disable-line
                itemIds = {};
            }
        }

        if (noFileIsPendingOrInProgress && useUploadsManager) {
            onComplete(items);
        }

        const state: Object = {
            items,
            view,
            isUploadsManagerExpanded: this.state.isUploadsManagerExpanded,
        };

        if (itemIds) {
            state.itemIds = itemIds;
        }

        if (items.length === 0) {
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

        item.status = STATUS_ERROR;
        item.error = error;
        this.numItemsUploading -= 1;

        const { items } = this.state;
        items[items.indexOf(item)] = item;

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

        this.updateViewAndCollection(items);

        if (useUploadsManager) {
            this.expandUploadsManager();
        }

        this.upload();
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
        if (!event.total || item.status === STATUS_COMPLETE) {
            return;
        }

        item.progress = Math.min(
            Math.round((event.loaded / event.total) * 100),
            100,
        );
        item.status = STATUS_IN_PROGRESS;

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
        const { status } = item;
        switch (status) {
            case STATUS_IN_PROGRESS:
            case STATUS_COMPLETE:
            case STATUS_PENDING:
                this.removeFileFromUploadQueue(item);
                break;
            case STATUS_ERROR:
                this.resetFile(item);
                this.uploadFile(item);
                break;
            default:
                break;
        }
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
        this.setState({ isUploadsManagerExpanded: false });

        this.hideUploadsManager();
    };

    /**
     * Hides the upload manager
     *
     * @return {void}
     */
    hideUploadsManager = () => {
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
        if (
            (isUploadsManagerExpanded && useUploadsManager && !!items.length) ||
            view === VIEW_UPLOAD_IN_PROGRESS
        ) {
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
        dataTransferItems: Array<
            DataTransferItem | UploadDataTransferItemWithAPIOptions,
        >,
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
            language,
            messages,
            onClose,
            className,
            measureRef,
            isTouch,
            fileLimit,
            useUploadsManager,
            isFolderUploadEnabled,
            isDraggingItemsToUploadsManager = false,
        }: Props = this.props;
        const {
            view,
            items,
            errorCode,
            isUploadsManagerExpanded,
        }: State = this.state;
        const isEmpty = items.length === 0;
        const isVisible = !isEmpty || !!isDraggingItemsToUploadsManager;

        const hasFiles = items.length !== 0;
        const isLoading = items.some(
            item => item.status === STATUS_IN_PROGRESS,
        );

        const styleClassName = classNames('bcu', className, {
            'be-app-element': !useUploadsManager,
            be: !useUploadsManager,
        });

        return (
            <Internationalize language={language} messages={messages}>
                {useUploadsManager ? (
                    <div
                        className={styleClassName}
                        id={this.id}
                        ref={measureRef}
                    >
                        <UploadsManager
                            isExpanded={isUploadsManagerExpanded}
                            isVisible={isVisible}
                            items={items}
                            onItemActionClick={this.onClick}
                            toggleUploadsManager={this.toggleUploadsManager}
                            view={view}
                            isDragging={isDraggingItemsToUploadsManager}
                        />
                    </div>
                ) : (
                    <div
                        className={styleClassName}
                        id={this.id}
                        ref={measureRef}
                    >
                        <DroppableContent
                            addFiles={this.addFilesToUploadQueue}
                            addDataTransferItemsToUploadQueue={
                                this.addDataTransferItemsToUploadQueue
                            }
                            allowedTypes={['Files']}
                            items={items}
                            isTouch={isTouch}
                            view={view}
                            onClick={this.onClick}
                            isFolderUploadEnabled={isFolderUploadEnabled}
                        />
                        <Footer
                            hasFiles={hasFiles}
                            isLoading={isLoading}
                            errorCode={errorCode}
                            fileLimit={fileLimit}
                            onCancel={this.cancel}
                            onClose={onClose}
                            onUpload={this.upload}
                        />
                    </div>
                )}
            </Internationalize>
        );
    }
}

export default makeResponsive(ContentUploader);
export { ContentUploader as ContentUploaderComponent };
