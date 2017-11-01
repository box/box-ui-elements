/**
 * @flow
 * @file Content Explorer Preview dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import { injectIntl } from 'react-intl';
import cloneDeep from 'lodash.clonedeep';
import ContentPreview from '../ContentPreview';
import messages from '../messages';
import { TYPE_FILE, CLASS_MODAL_CONTENT_FULL_BLEED, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../constants';
import Cache from '../../util/Cache';
import type { BoxItem, Collection, Token } from '../../flowTypes';

type Props = {
    isOpen: boolean,
    currentCollection: Collection,
    onCancel: Function,
    item: BoxItem,
    token: Token,
    parentElement: HTMLElement,
    isTouch: boolean,
    onPreview: Function,
    hasPreviewSidebar: boolean,
    cache: Cache,
    apiHost: string,
    appHost: string,
    staticHost: string,
    intl: any
};

const PreviewDialog = ({
    item,
    isOpen,
    parentElement,
    token,
    cache,
    currentCollection,
    hasPreviewSidebar,
    onCancel,
    onPreview,
    apiHost,
    appHost,
    staticHost,
    intl
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
            contentLabel={intl.formatMessage(messages.preview)}
            onRequestClose={onCancel}
        >
            <ContentPreview
                skipServerUpdate
                apiHost={apiHost}
                appHost={appHost}
                staticHost={staticHost}
                cache={cache}
                file={item}
                token={token}
                hasHeader
                collection={files}
                onLoad={onLoad}
                onClose={onCancel}
                hasSidebar={hasPreviewSidebar}
            />
        </Modal>
    );
};

export default injectIntl(PreviewDialog);
