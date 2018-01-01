/**
 * @flow
 * @file Base class for the content uploader ES6 wrapper
 * @author Box
 */

import React from 'react';
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
import ContentUploaderPopup from '../components/ContentUploader/ContentUploaderPopup';
import ContentUploaderComponent from '../components/ContentUploader/ContentUploader';
import type { BoxItem, ModalOptions } from '../flowTypes';

class ContentUploader extends ES6Wrapper {
    /**
     * Callback on closing uploader. Emits 'close' event.
     *
     * @return {void}
     */
    onClose = (): void => {
        this.emit('close');
    };

    /**
     * Callback when all files finish uploading. Emits 'complete' event with Box File objects of uploaded items as data.
     *
     * @param {Array} data - Completed upload items
     * @return {void}
     */
    onComplete = (data: BoxItem[]): void => {
        this.emit('complete', data);
    };

    /**
     * Callback on a single upload error. Emits 'uploaderror' event with information about the failed upload.
     *
     * @param {Object} data - File and error info about failed upload
     * @return {void}
     */
    onError = (data: any): void => {
        this.emit('error', data);
    };

    /**
     * Callback on a single successful upload. Emits 'uploadsuccess' event with Box File object of uploaded item.
     *
     * @param {BoxItem} data - Successfully uploaded item
     * @return {void}
     */
    onUpload = (data: BoxItem): void => {
        this.emit('upload', data);
    };

    /** @inheritdoc */
    render() {
        const {
            modal,
            useUploadsManager = false,
            ...rest
        }: { modal?: ModalOptions, useUploadsManager?: boolean } = this.options;
        const UploaderComponent = modal ? ContentUploaderPopup : ContentUploaderComponent;

        render(
            <UploaderComponent
                language={this.language}
                messages={this.messages}
                componentRef={this.setComponent}
                rootFolderId={this.id}
                token={this.token}
                onClose={this.onClose}
                onComplete={this.onComplete}
                onError={this.onError}
                onUpload={this.onUpload}
                useUploadsManager={useUploadsManager}
                modal={((modal: any): ModalOptions)}
                {...rest}
            />,
            this.container
        );
    }
}

global.Box = global.Box || {};
global.Box.ContentUploader = ContentUploader;
export default ContentUploader;
