/**
 * @flow
 * @file Base class for the Content Picker ES6 wrapper
 * @author Box
 */

import * as React from 'react';
import { versionAwareRender } from '../../utils/dom-render';
import ES6Wrapper from './ES6Wrapper';
import ContentPickerPopup from '../content-picker/ContentPickerPopup';
import ContentPickerReactComponent from '../content-picker/ContentPicker';
import { TYPE_FOLDER, TYPE_FILE, TYPE_WEBLINK, CLIENT_NAME_CONTENT_PICKER } from '../../constants';
import type { ModalOptions } from '../common/flowTypes';
import type { BoxItem } from '../../common/types/core';

class ContentPicker extends ES6Wrapper {
    /**
     * Callback for pressing choose
     *
     * @param {Array} data - chosen box items
     * @return {void}
     */
    onChoose = (data: BoxItem[]): void => {
        this.emit('choose', data);
    };

    /**
     * Callback for pressing cancel
     *
     * @return {void}
     */
    onCancel = (): void => {
        this.emit('cancel');
    };

    /**
     * Returns the type of content picker
     *
     * @return {void}
     */
    getType(): string {
        const { type } = this.options || {};
        return type || `${TYPE_FOLDER},${TYPE_FILE},${TYPE_WEBLINK}`;
    }

    /**
     * Returns the name for content picker
     *
     * @return {void}
     */
    getClientName(): string {
        return CLIENT_NAME_CONTENT_PICKER;
    }

    /** @inheritdoc */
    render() {
        const { modal, ...rest }: { modal?: ModalOptions } = this.options;
        const PickerComponent = modal ? ContentPickerPopup : ContentPickerReactComponent;
        this.cleanup = versionAwareRender(
            <PickerComponent
                clientName={this.getClientName()}
                componentRef={this.setComponent}
                language={this.language}
                messages={this.messages}
                modal={((modal: any): ModalOptions)}
                onCancel={this.onCancel}
                onChoose={this.onChoose}
                rootFolderId={this.id}
                token={this.token}
                type={this.getType()}
                {...rest}
            />,
            this.container,
        );
    }
}

export default ContentPicker;
