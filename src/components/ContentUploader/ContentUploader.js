/**
 * @flow
 * @file Content Uploader component
 * @author Box
 */

/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import uniqueid from 'lodash/uniqueId';
import cloneDeep from 'lodash/cloneDeep';
import API from '../../api';
import DroppableContent from './DroppableContent';
import UploadsManager from './UploadsManager';
import Footer from './Footer';
import makeResponsive from '../makeResponsive';
import Internationalize from '../Internationalize';
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
    ERROR_CODE_UPLOAD_FILE_LIMIT
} from '../../constants';
import type {
    BoxItem,
    UploadItem,
    View,
    Token,
    StringMap,
    UploadItemAPIOptions,
    UploadFileWithAPIOptions
} from '../../flowTypes';
import '../fonts.scss';
import '../base.scss';

type Props = {
    rootFolderId: string,
    token: Token,
    sharedLink?: string,
    sharedLinkPassword?: string,
    apiHost: string,
    uploadHost: string,
    clientName: string,
    className: string,
    chunked: boolean,
    fileLimit: number,
    onClose: Function,
    onComplete: Function,
    onError: Function,
    onUpload: Function,
    isSmall: boolean,
    isLarge: boolean,
    isTouch: boolean,
    measureRef: Function,
    language?: string,
    messages?: StringMap,
    responseFilter?: Function,
    intl: any,
    windowView?: boolean,
    files?: Array<UploadFileWithAPIOptions | File>,
    onExpand?: Function,
    onMinimize?: Function,
    onUploadsManagerCancel: Function,
    onUploadsManagerComplete: Function,
    onUploadsManagerError: Function,
    onUploadsManagerUpload: Function
};

type State = {
    errorCode?: string,
    items: UploadItem[],
    view: View,
    isUploadsManagerExpanded: boolean
};

const CHUNKED_UPLOAD_MIN_SIZE_BYTES = 52428800; // 50MB
const FILE_LIMIT_DEFAULT = 100; // Upload at most 100 files at once by default
const HIDE_UPLOAD_MANAGER_DELAY_MS_DEFAULT = 8000;
const EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD = 5;

class ContentUploader extends Component<Props, State> {
    id: string;
    state: State;
    props: Props;
    rootElement: HTMLElement;
    appElement: HTMLElement;
    resetItemsTimeout: ?number;

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
        windowView: false,
        files: [],
        onExpand: noop,
        onMinimize: noop,
        onUploadsManagerCancel: noop,
        onUploadsManagerComplete: noop,
        onUploadsManagerError: noop,
        onUploadsManagerUpload: noop
    };

    /**
     * [constructor]
     *
     * @return {ContentUploader}
     */
    constructor(props: Props) {
        super(props);

        const { rootFolderId, token } = props;
        this.state = {
            view: rootFolderId && token ? VIEW_UPLOAD_EMPTY : VIEW_ERROR,
            items: [],
            errorCode: '',
            isUploadsManagerExpanded: false
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
     * Adds new items to the queue when files prop gets updated in window view
     *
     * @param {Props} nextProps
     * @return {void}
     */
    componentWillReceiveProps(nextProps: Props) {
        const { files, windowView } = nextProps;

        if (!windowView || !files || !files.length) {
            return;
        }

        const newFiles = this.getNewFiles(files, windowView);

        if (newFiles.length <= 0) {
            return;
        }

        this.addFilesWithOptionsToUploadQueueAndStartUpload(files);
    }

    /**
     * Create and return new instance of API creator
     *
     * @param {UploadItemAPIOptions} [uploadAPIOptions]
     * @return {API}
     */
    createAPIFactory(uploadAPIOptions?: UploadItemAPIOptions): API {
        const {
            rootFolderId,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            clientName,
            responseFilter
        } = this.props;

        const itemFolderId =
            uploadAPIOptions && uploadAPIOptions.folderId
                ? `folder_${uploadAPIOptions.folderId}`
                : `folder_${rootFolderId}`;
        const options = {
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            clientName,
            responseFilter,
            id: itemFolderId,
            ...uploadAPIOptions
        };
        return new API(options);
    }

    /**
     * Get files that are new to the content uploader
     *
     * @param {Array<UploadFileWithAPIOptions | File>} files
     * @param {boolean} withApiOptions
     */
    getNewFiles = (files: Array<UploadFileWithAPIOptions | File>, withApiOptions) => {
        const { items } = this.state;
        return [].filter.call(files, (file) => {
            let uploadFile = file;
            let uploadAPIOptions = {};

            if (withApiOptions) {
                uploadFile = file.file;
                uploadAPIOptions = file.options;
            }
            const { name } = uploadFile;
            return !items.some((item) => {
                if (!uploadAPIOptions || !item.options) {
                    return item.name === name;
                }
                return (
                    item.name === name &&
                    (item.options.folderId === uploadAPIOptions.folderId &&
                        item.options.uploadInitTimestamp === uploadAPIOptions.uploadInitTimestamp)
                );
            });
        });
    };

    /**
     * Converts File API to upload items and adds to upload queue.
     *
     * @private
     * @param {File[]} files - Files to be added to upload queue
     * @param {UploadItemAPIOptions} [uploadAPIOptions]
     * @return {void}
     */
    addFilesToUploadQueue = (files: Array<UploadFileWithAPIOptions | File>, withApiOptions, itemUpdateCallback) => {
        const { fileLimit, windowView } = this.props;
        const { view, items } = this.state;

        clearTimeout(this.resetItemsTimeout);

        // Convert files from the file API to upload items
        const newItems = this.getNewFiles(files, withApiOptions).map((file) => {
            let uploadFile = file;
            let uploadAPIOptions = {};

            if (withApiOptions) {
                uploadFile = file.file;
                uploadAPIOptions = file.options;
            }
            const { name, size } = uploadFile;

            // Extract extension or use empty string if file has no extension
            let extension = name.substr(name.lastIndexOf('.') + 1);
            if (extension.length === name.length) {
                extension = '';
            }

            const api = this.getUploadAPI(uploadFile, uploadAPIOptions);
            const uploadItem: UploadItem = {
                api,
                extension,
                file: uploadFile,
                name,
                progress: 0,
                size,
                status: STATUS_PENDING
            };

            if (uploadAPIOptions) {
                uploadItem.options = uploadAPIOptions;
            }

            return uploadItem;
        });

        let updatedItems = [];
        const prevItemsNum = items.length;
        const totalNumOfItems = prevItemsNum + newItems.length;

        // Don't add more than fileLimit # of items
        if (totalNumOfItems > fileLimit) {
            updatedItems = items.concat(newItems.slice(0, fileLimit - items.length));
            this.setState({
                errorCode: ERROR_CODE_UPLOAD_FILE_LIMIT
            });
        } else {
            updatedItems = items.concat(newItems);
            this.setState({ errorCode: '' });

            // If the number of items being uploaded passes the threshold, expand the upload manager
            if (
                prevItemsNum < EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD &&
                totalNumOfItems >= EXPAND_UPLOADS_MANAGER_ITEMS_NUM_THRESHOLD &&
                windowView
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
    getUploadAPI(file, uploadAPIOptions?: UploadItemAPIOptions) {
        const { chunked } = this.props;
        const { size } = file;
        const factory = this.createAPIFactory(uploadAPIOptions);

        if (chunked && size > CHUNKED_UPLOAD_MIN_SIZE_BYTES) {
            return factory.getChunkedUploadAPI();
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
        const { onUploadsManagerCancel } = this.props;
        // Clear any error errorCode in footer
        this.setState({ errorCode: '' });

        const { api } = item;
        api.cancel();

        const { items } = this.state;
        items.splice(items.indexOf(item), 1);

        let callback = noop;
        if (this.props.windowView && !items.length) {
            // minimize the uploads manager when items is empty after the removal
            callback = this.minimizeUploadsManager;
        }
        onUploadsManagerCancel(item);
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
        items.forEach((uploadItem) => {
            const { api, status } = uploadItem;
            if (status === STATUS_IN_PROGRESS) {
                api.cancel();
            }
        });

        // Reset upload collection
        this.updateViewAndCollection([]);
    };

    /**
     * Checks whether should upload an item
     *
     * @private
     * @param {UploadItem} item
     * @return {boolean}
     */
    shouldUploadItem = (item) => {
        const { windowView } = this.props;

        return windowView ? item.status === STATUS_PENDING : item.status !== STATUS_IN_PROGRESS;
    };

    /**
     * Uploads all items in the upload collection.
     *
     * @private
     * @return {void}
     */
    upload = () => {
        const { items } = this.state;
        items.forEach((uploadItem) => {
            if (this.shouldUploadItem(uploadItem)) {
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
        const { rootFolderId } = this.props;
        const { api, file, options } = item;

        api.upload({
            // TODO: rename id to folderId
            file,
            id: options && options.folderId ? options.folderId : rootFolderId,
            errorCallback: (error) => this.handleUploadError(item, error),
            progressCallback: (event) => this.handleUploadProgress(item, event),
            successCallback: (entries) => this.handleUploadSuccess(item, entries),
            overwrite: true,
            fileId: options && options.fileId ? options.fileId : undefined
        });

        item.status = STATUS_IN_PROGRESS;
        const { items } = this.state;
        items[items.indexOf(item)] = item;

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
        const { onUpload, onUploadsManagerUpload, windowView } = this.props;

        item.progress = 100;
        item.status = STATUS_COMPLETE;

        // Cache Box File object of successfully uploaded item
        if (entries && entries.length === 1) {
            const [boxFile] = entries;
            item.boxFile = boxFile;
        }

        const { items } = this.state;
        items[items.indexOf(item)] = item;

        // Broadcast that a file has been uploaded
        if (windowView) {
            onUploadsManagerUpload(item);
        } else {
            onUpload(item.boxFile);
        }

        this.updateViewAndCollection(items);

        if (windowView) {
            this.hideUploadsManager();
        }
    };

    /**
     * Updates view and internal upload collection with provided items.
     *
     * @private
     * @param {UploadItem[]} item - Itmes to update collection with
     * @return {void}
     */
    updateViewAndCollection(items: UploadItem[], callback) {
        const { onComplete, onUploadsManagerComplete, windowView }: Props = this.props;
        const someUploadIsInProgress = items.some((uploadItem) => uploadItem.status !== STATUS_COMPLETE);
        const someUploadHasFailed = items.some((uploadItem) => uploadItem.status === STATUS_ERROR);
        const allFilesArePending = !items.some((uploadItem) => uploadItem.status !== STATUS_PENDING);
        const noFileIsPendingOrInProgress = items.every(
            (uploadItem) => uploadItem.status !== STATUS_PENDING && uploadItem.status !== STATUS_IN_PROGRESS
        );

        let view = '';
        if ((items && items.length === 0) || allFilesArePending) {
            view = VIEW_UPLOAD_EMPTY;
        } else if (someUploadHasFailed && windowView) {
            view = VIEW_ERROR;
        } else if (someUploadIsInProgress) {
            view = VIEW_UPLOAD_IN_PROGRESS;
        } else {
            view = VIEW_UPLOAD_SUCCESS;

            if (!windowView) {
                onComplete(cloneDeep(items.map((item) => item.boxFile)));
                items = []; // Reset item collection after successful upload
            }
        }

        if (noFileIsPendingOrInProgress && windowView) {
            clearTimeout(this.resetItemsTimeout);
            onUploadsManagerComplete(items);
        }

        const state: State = {
            items,
            view,
            isUploadsManagerExpanded: this.state.isUploadsManagerExpanded
        };

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
        const { onError, onUploadsManagerError, windowView } = this.props;
        const { file } = item;

        item.status = STATUS_ERROR;

        const { items } = this.state;
        items[items.indexOf(item)] = item;

        // Broadcast that there was an error uploading a file
        if (windowView) {
            onUploadsManagerError({
                item,
                error
            });
        } else {
            onError({
                file,
                error
            });
        }

        this.updateViewAndCollection(items);

        if (windowView) {
            this.expandUploadsManager();
        }
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

        item.progress = Math.min(Math.round(event.loaded / event.total * 100), 100);
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
        const { windowView, onExpand } = this.props;

        if (!windowView || !onExpand) {
            return;
        }

        clearTimeout(this.resetItemsTimeout);

        onExpand();
        this.setState({ isUploadsManagerExpanded: true });
    };

    /**
     * Minimizes the upload manager
     *
     * @return {void}
     */
    minimizeUploadsManager = (): void => {
        const { windowView, onMinimize } = this.props;

        if (!windowView || !onMinimize) {
            return;
        }

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
            HIDE_UPLOAD_MANAGER_DELAY_MS_DEFAULT
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
            return;
        }

        this.expandUploadsManager();
    };

    /**
     * Empties the items queue
     *
     * @return {void}
     */
    resetUploadsManagerItemsWhenUploadsComplete = (): void => {
        const { view, items, isUploadsManagerExpanded } = this.state;
        const { windowView, onUploadsManagerCancel } = this.props;

        // Do not reset items when upload manger is expanded or there're uploads in progress
        if ((isUploadsManagerExpanded && windowView && !!items.length) || view === VIEW_UPLOAD_IN_PROGRESS) {
            return;
        }

        items.forEach((item) => {
            onUploadsManagerCancel(item);
        });

        this.setState({
            items: []
        });
    };

    /**
     * Adds file to the upload queue and starts upload immediately
     *
     * @param {Array<UploadFileWithAPIOptions | File>} files - Files to be added to upload queue
     * @return {void}
     */
    addFilesWithOptionsToUploadQueueAndStartUpload = (files: Array<UploadFileWithAPIOptions | File>): void => {
        this.addFilesToUploadQueue(files, true, this.upload);
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
            windowView
        }: Props = this.props;
        const { view, items, errorCode, isUploadsManagerExpanded }: State = this.state;

        const hasFiles = items.length !== 0;
        const isLoading = items.some((item) => item.status === STATUS_IN_PROGRESS);
        const styleClassName = classNames('bcu', className, {
            'buik-app-element': !windowView,
            buik: !windowView
        });

        return (
            <Internationalize language={language} messages={messages}>
                {windowView ? (
                    <div className={styleClassName} id={this.id} ref={measureRef}>
                        <UploadsManager
                            isExpanded={isUploadsManagerExpanded}
                            items={items}
                            onItemActionClick={this.onClick}
                            toggleUploadsManager={this.toggleUploadsManager}
                            view={view}
                        />
                    </div>
                ) : (
                    <div className={styleClassName} id={this.id} ref={measureRef}>
                        <DroppableContent
                            addFiles={this.addFilesToUploadQueue}
                            allowedTypes={['Files']}
                            items={items}
                            isTouch={isTouch}
                            view={view}
                            onClick={this.onClick}
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
