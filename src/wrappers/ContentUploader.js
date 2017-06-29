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
     * Callback on completed upload. Emits 'complete' event with Box File objects of uploaded items as data.
     *
     * @param {Array} data - Completed upload items
     * @return {void}
     */
    onComplete = (data: BoxItem[]): void => {
        this.emit('complete', data);
    };

    /** @inheritdoc */
    render() {
        const { modal, ...rest }: { modal?: ModalOptions } = this.options;
        const UploaderComponent = modal ? ContentUploaderPopup : ContentUploaderComponent;
        render(
            <UploaderComponent
                getLocalizedMessage={this.getLocalizedMessage}
                componentRef={this.setComponent}
                rootFolderId={this.root}
                token={this.token}
                onClose={this.onClose}
                onComplete={this.onComplete}
                modal={modal}
                {...rest}
            />,
            this.container
        );
    }
}

global.Box = global.Box || {};
global.Box.ContentUploader = ContentUploader;
export default ContentUploader;
