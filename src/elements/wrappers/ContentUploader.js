/**
 * @flow
 * @file Base class for the Content Uploader ES6 wrapper
 * @author Box
 */

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import ES6Wrapper from './ES6Wrapper';
// $FlowFixMe
import ContentUploaderPopup from '../content-uploader/ContentUploaderPopup';
// $FlowFixMe
import WrappedContentUploaderComponent from '../content-uploader/ContentUploader';
import type { UploadFileWithAPIOptions } from '../../common/types/upload';
import type { BoxItem } from '../../common/types/core';
import type { ModalOptions } from '../common/flowTypes';

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
     * Callback on a single pre-uploaded file. Emits 'beforeupload' event with the Box File object pre-upload.
     *
     * @param {Object} data - Upload item
     * @return {void}
     */
    onBeforeUpload = (data: UploadFileWithAPIOptions | File): void => {
        this.emit('beforeupload', data);
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
        const { modal, ...rest }: { modal?: ModalOptions } = this.options;
        const UploaderComponent = modal ? ContentUploaderPopup : WrappedContentUploaderComponent;

        if (!this.root) {
            this.root = createRoot(this.container);
        }
        this.root.render(
            <UploaderComponent
                language={this.language}
                messages={this.messages}
                componentRef={this.setComponent}
                rootFolderId={this.id}
                token={this.token}
                onClose={this.onClose}
                onComplete={this.onComplete}
                onError={this.onError}
                onBeforeUpload={this.onBeforeUpload}
                onUpload={this.onUpload}
                modal={((modal: any): ModalOptions)}
                {...rest}
            />,
        );
    }
}

global.Box = global.Box || {};
global.Box.ContentUploader = ContentUploader;
export default ContentUploader;
