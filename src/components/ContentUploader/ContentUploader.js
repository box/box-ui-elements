/**
 * @flow
 * @file Content Uploader component
 */

/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
import classNames from 'classnames';
import noop from 'lodash.noop';
import uniqueid from 'lodash.uniqueid';
import cloneDeep from 'lodash.clonedeep';
import API from '../../api';
import DroppableContent from './DroppableContent';
import Footer from './Footer';
import makeResponsive from '../makeResponsive';
import { isIE } from '../../util/browser';
import {
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
    STATUS_ERROR
} from '../../constants';
import type { BoxItem, UploadItem, View } from '../../flowTypes';
import '../fonts.scss';
import '../base.scss';

type Props = {
    rootFolderId: string,
    token: string,
    sharedLink?: string,
    sharedLinkPassword?: string,
    apiHost: string,
    uploadHost: string,
    clientName: string,
    className: string,
    chunked: boolean,
    onClose: Function,
    onComplete: Function,
    getLocalizedMessage: Function,
    isSmall: boolean,
    isLarge: boolean,
    isTouch: boolean,
    measureRef: Function
};

type DefaultProps = {|
    apiHost: string,
    chunked: boolean,
    className: string,
    clientName: string,
    uploadHost: string,
    onClose: Function,
    onComplete: Function
|};

type State = {
    view: View,
    items: UploadItem[]
};

class ContentUploader extends Component<DefaultProps, Props, State> {
    id: string;
    state: State;
    props: Props;
    table: any;
    rootElement: HTMLElement;
    appElement: HTMLElement;

    static defaultProps: DefaultProps = {
        apiHost: DEFAULT_HOSTNAME_API,
        chunked: true,
        className: '',
        clientName: CLIENT_NAME_CONTENT_UPLOADER,
        uploadHost: DEFAULT_HOSTNAME_UPLOAD,
        onClose: noop,
        onComplete: noop
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
            items: []
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
     * Create and return new instance of Upload API
     *
     * @return {API}
     */
    createAPI(): API {
        const { rootFolderId, token, sharedLink, sharedLinkPassword, apiHost, uploadHost, clientName } = this.props;
        return new API({
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            clientName,
            id: `folder_${rootFolderId}`
        });
    }

    /**
     * Saves reference to table component
     *
     * @private
     * @param {Component} table - React virtualized Table component
     * @return {void}
     */
    tableRef = (table: any) => {
        this.table = table;
    };

    /**
     * Converts File API to upload items and adds to upload queue.
     *
     * @private
     * @param {File[]} files - Files to be added to upload queue
     * @return {void}
     */
    addFilesToUploadQueue = (files: File[]) => {
        const { view, items } = this.state;

        // Filter out files that are already in the upload queue
        const newItems = [].filter
            .call(files, (file) => {
                const { name } = file;
                return !items.some((item) => item.name === name);

                // Convert files from the file API to upload items
            })
            .map((file) => {
                const { name, size } = file;

                // Extract extension or use empty string if file has no extension
                let extension = name.substr(name.lastIndexOf('.') + 1);
                if (extension.length === name.length) {
                    extension = '';
                }

                const uploadItem = {
                    api: this.createAPI(),
                    extension,
                    file,
                    name,
                    progress: 0,
                    size,
                    status: STATUS_PENDING
                };

                return uploadItem;
            });

        this.updateViewAndCollection(items.concat(newItems));

        // Automatically start upload if other files are being uploaded
        if (view === VIEW_UPLOAD_IN_PROGRESS) {
            this.upload();
        }
    };

    /**
     * Removes an item from the upload queue. Cancels upload if in progress.
     *
     * @param {UploadItem} item - Item to remove
     * @return {void}
     */
    removeFileFromUploadQueue(item: UploadItem) {
        const { api } = item;
        api.getUploadAPI().cancel();

        const { items } = this.state;
        items.splice(items.indexOf(item), 1);

        this.updateViewAndCollection(items);
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
                api.getUploadAPI().cancel();
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
        items.forEach((uploadItem) => {
            if (uploadItem.status !== STATUS_IN_PROGRESS) {
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
        const { rootFolderId, chunked } = this.props;
        const { api, file } = item;

        // Disable chunked upload in IE11 for now until hashing is done in a worker
        const useChunked = chunked && !isIE();

        api.getUploadAPI(useChunked, file.size).upload({
            id: rootFolderId,
            file,
            successCallback: (entries) => this.handleUploadSuccess(item, entries),
            errorCallback: this.handleUploadError,
            progressCallback: (event) => this.handleUploadProgress(item, event),
            overwrite: true
        });

        item.status = STATUS_IN_PROGRESS;
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
        item.progress = 100;
        item.status = STATUS_COMPLETE;

        // Cache Box File object of successfully uploaded item
        if (entries && entries.length === 1) {
            item.boxFile = entries[0];
        }

        const { items } = this.state;
        items[items.indexOf(item)] = item;

        this.updateViewAndCollection(items);
    };

    /**
     * Updates view and internal upload collection with provided items.
     *
     * @private
     * @param {UploadItem[]} item - Itmes to update collection with
     * @return {void}
     */
    updateViewAndCollection(items: UploadItem[]) {
        const { onComplete }: Props = this.props;
        const someUploadIsInProgress = items.some((uploadItem) => uploadItem.status !== STATUS_COMPLETE);
        const allFilesArePending = !items.some((uploadItem) => uploadItem.status !== STATUS_PENDING);

        let view = '';
        if ((items && items.length === 0) || allFilesArePending) {
            view = VIEW_UPLOAD_EMPTY;
        } else if (someUploadIsInProgress) {
            view = VIEW_UPLOAD_IN_PROGRESS;
        } else {
            view = VIEW_UPLOAD_SUCCESS;
            onComplete(cloneDeep(items.map((item) => item.boxFile)));
            items = []; // Reset item collection after successful upload
        }

        this.setState({
            view,
            items
        });
    }

    /**
     * Handles an upload error.
     *
     * @private
     * @return {void}
     */
    handleUploadError = () => {
        this.setState({
            view: VIEW_ERROR,
            items: []
        });
    };

    /**
     * Handles an upload error.
     *
     * @private
     * @param {UploadItem} item - Upload item corresponding to progress event
     * @param {ProgressEvent} event - Progress event
     * @return {void}
     */
    handleUploadProgress = (item: UploadItem, event: ProgressEvent) => {
        if (!event.lengthComputable || item.status === STATUS_COMPLETE) {
            return;
        }

        item.progress = Math.round(event.loaded / event.total * 100);
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
                this.uploadFile(item);
                break;
            default:
                break;
        }
    };

    /**
     * Renders the content uploader
     *
     * @inheritdoc
     * @return {Component}
     */
    render() {
        const { onClose, getLocalizedMessage, className, measureRef, isTouch }: Props = this.props;
        const { view, items }: State = this.state;

        const hasFiles = items.length !== 0;
        const isLoading = items.some((item) => item.status === STATUS_IN_PROGRESS);
        const styleClassName = classNames('buik buik-app-element bcu', className);

        return (
            <div className={styleClassName} id={this.id} ref={measureRef}>
                <DroppableContent
                    addFiles={this.addFilesToUploadQueue}
                    allowedTypes={['Files']}
                    getLocalizedMessage={getLocalizedMessage}
                    items={items}
                    isTouch={isTouch}
                    tableRef={this.tableRef}
                    view={view}
                    onClick={this.onClick}
                />
                <Footer
                    getLocalizedMessage={getLocalizedMessage}
                    hasFiles={hasFiles}
                    isLoading={isLoading}
                    onCancel={this.cancel}
                    onClose={onClose}
                    onUpload={this.upload}
                />
            </div>
        );
    }
}

export default makeResponsive(ContentUploader);
