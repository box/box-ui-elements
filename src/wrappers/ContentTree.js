/**
 * @flow
 * @file Base class for the folder tree ES6 wrapper
 * @author Box
 */

import React from 'react';
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
import ContentTreePopup from '../components/ContentTree/ContentTreePopup';
import ContentTreeComponent from '../components/ContentTree/ContentTree';
import { CLIENT_NAME_CONTENT_TREE } from '../constants';
import type { ModalOptions, BoxItem } from '../flowTypes';

class ContentTree extends ES6Wrapper {
    /**
     * Callback for clicking an item
     *
     * @param {Array} data - chosen box items
     * @return {void}
     */
    onClick = (data: BoxItem): void => {
        this.emit('click', data);
    };

    /**
     * Returns the name for folder tree
     *
     * @return {void}
     */
    getClientName(): string {
        return CLIENT_NAME_CONTENT_TREE;
    }

    /** @inheritdoc */
    render() {
        const { modal, ...rest }: { modal?: ModalOptions } = this.options;
        const TreeComponent = modal ? ContentTreePopup : ContentTreeComponent;
        render(
            <TreeComponent
                clientName={this.getClientName()}
                getLocalizedMessage={this.getLocalizedMessage}
                componentRef={this.setComponent}
                rootFolderId={this.root}
                token={this.token}
                onClick={this.onClick}
                modal={modal}
                {...rest}
            />,
            this.container
        );
    }
}

global.Box = global.Box || {};
global.Box.ContentTree = ContentTree;
export default ContentTree;
