/**
 * @file Base class for the Content Uploader ES6 wrapper
 * @author Box
 */

import * as React from 'react';
// TODO switch to createRoot when upgrading to React 18
// eslint-disable-next-line react/no-deprecated
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
import ContentUploaderPopup from '../content-uploader/ContentUploaderPopup';
import WrappedContentUploaderComponent from '../content-uploader/ContentUploader';

class ContentUploader extends ES6Wrapper {
    /**
     * Callback on closing uploader. Emits 'close' event.
     *
     * @return {void}
     */
    onClose = () => {
        this.emit('close');
    };

    /**
     * Callback when all files finish uploading. Emits 'complete' event with Box File objects of uploaded items as data.
     *
     * @param {Array} data - Completed upload items
     * @return {void}
     */
    onComplete = data => {
        this.emit('complete', data);
    };

    /**
     * Callback on a single upload error. Emits 'uploaderror' event with information about the failed upload.
     *
     * @param {Object} data - File and error info about failed upload
     * @return {void}
     */
    onError = data => {
        this.emit('error', data);
    };

    /**
     * Callback on a single pre-uploaded file. Emits 'beforeupload' event with the Box File object pre-upload.
     *
     * @param {Object} data - Upload item
     * @return {void}
     */
    onBeforeUpload = data => {
        this.emit('beforeupload', data);
    };

    /**
     * Callback on a single successful upload. Emits 'uploadsuccess' event with Box File object of uploaded item.
     *
     * @param {BoxItem} data - Successfully uploaded item
     * @return {void}
     */
    onUpload = data => {
        this.emit('upload', data);
    };

    /** @inheritdoc */
    render() {
        const { modal, ...rest } = this.options;
        const UploaderComponent = modal ? ContentUploaderPopup : WrappedContentUploaderComponent;

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
                onBeforeUpload={this.onBeforeUpload}
                onUpload={this.onUpload}
                modal={modal}
                {...rest}
            />,
            this.container,
        );
    }
}

global.Box = global.Box || {};
global.Box.ContentUploader = ContentUploader;
export default ContentUploader;
