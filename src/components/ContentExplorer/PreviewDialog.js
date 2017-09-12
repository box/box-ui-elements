/**
 * @flow
 * @file Content Explorer Preview dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import cloneDeep from 'lodash.clonedeep';
import ContentPreview from '../ContentPreview';
import { TYPE_FILE, CLASS_MODAL_CONTENT_FULL_BLEED, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../constants';
import Cache from '../../util/Cache';
import type { BoxItem, Collection, Token } from '../../flowTypes';

type Props = {
    isOpen: boolean,
    currentCollection: Collection,
    onCancel: Function,
    item: BoxItem,
    token: Token,
    getLocalizedMessage: Function,
    parentElement: HTMLElement,
    isTouch: boolean,
    onPreview: Function,
    hasPreviewSidebar: boolean,
    cache: Cache
};

const PreviewDialog = ({
    item,
    isOpen,
    getLocalizedMessage,
    parentElement,
    token,
    cache,
    currentCollection,
    hasPreviewSidebar,
    onCancel,
    onPreview
}: Props) => {
    const { items }: Collection = currentCollection;
    const onLoad = (data: any): void => {
        onPreview(cloneDeep(data));
    };

    if (!item || !items || !isOpen) {
        return null;
    }

    const files: BoxItem[] = items.filter(({ type }) => type === TYPE_FILE);
    return (
        <Modal
            isOpen={isOpen}
            parentSelector={() => parentElement}
            portalClassName={`${CLASS_MODAL} buik-modal-preview`}
            className={CLASS_MODAL_CONTENT_FULL_BLEED}
            overlayClassName={CLASS_MODAL_OVERLAY}
            contentLabel={getLocalizedMessage('buik.modal.preview.dialog.label')}
            onRequestClose={onCancel}
        >
            <ContentPreview
                cache={cache}
                file={item}
                token={token}
                hasHeader
                collection={files}
                onLoad={onLoad}
                onClose={onCancel}
                hasSidebar={hasPreviewSidebar}
                getLocalizedMessage={getLocalizedMessage}
                skipServerUpdate
                staticHost='https://phora.dev.box.net'
                staticPath='content-experience'
                version='dev'
            />
        </Modal>
    );
};

export default PreviewDialog;
