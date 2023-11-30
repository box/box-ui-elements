/**
 * @flow
 * @file Content Explorer Preview Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import { injectIntl } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import cloneDeep from 'lodash/cloneDeep';
import messages from '../common/messages';
import ContentPreview from '../content-preview';
import { TYPE_FILE, CLASS_MODAL_CONTENT_FULL_BLEED, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../constants';
import type { Token, BoxItem, Collection } from '../../common/types/core';
import type APICache from '../../utils/Cache';

type Props = {
    apiHost: string,
    appElement: HTMLElement,
    appHost: string,
    cache: APICache,
    canDownload: boolean,
    contentPreviewProps: ContentPreviewProps,
    currentCollection: Collection,
    isOpen: boolean,
    isTouch: boolean,
    item: BoxItem,
    onCancel: Function,
    onDownload: Function,
    onPreview: Function,
    parentElement: HTMLElement,
    previewLibraryVersion: string,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    sharedLink?: string,
    sharedLinkPassword?: string,
    staticHost: string,
    staticPath: string,
    token: Token,
} & InjectIntlProvidedProps;

const PreviewDialog = ({
    item,
    isOpen,
    parentElement,
    appElement,
    token,
    cache,
    currentCollection,
    canDownload,
    onCancel,
    onPreview,
    onDownload,
    apiHost,
    appHost,
    staticHost,
    staticPath,
    previewLibraryVersion,
    sharedLink,
    sharedLinkPassword,
    contentPreviewProps,
    requestInterceptor,
    responseInterceptor,
    intl,
}: Props) => {
    const { items }: Collection = currentCollection;
    const onLoad = (data: any): void => {
        onPreview(cloneDeep(data));
    };

    if (!item || !items) {
        return null;
    }

    const files: BoxItem[] = items.filter(({ type }) => type === TYPE_FILE);
    return (
        <Modal
            appElement={appElement}
            className={CLASS_MODAL_CONTENT_FULL_BLEED}
            contentLabel={intl.formatMessage(messages.preview)}
            isOpen={isOpen}
            onRequestClose={onCancel}
            overlayClassName={CLASS_MODAL_OVERLAY}
            parentSelector={() => parentElement}
            portalClassName={`${CLASS_MODAL} be-modal-preview`}
        >
            <ContentPreview
                {...contentPreviewProps}
                apiHost={apiHost}
                appHost={appHost}
                autoFocus
                cache={cache}
                canDownload={canDownload}
                collection={files}
                contentPreviewProps={contentPreviewProps}
                fileId={item.id}
                hasHeader
                onClose={onCancel}
                onDownload={onDownload}
                onLoad={onLoad}
                previewLibraryVersion={previewLibraryVersion}
                requestInterceptor={requestInterceptor}
                responseInterceptor={responseInterceptor}
                sharedLink={sharedLink}
                sharedLinkPassword={sharedLinkPassword}
                staticHost={staticHost}
                staticPath={staticPath}
                token={token}
            />
        </Modal>
    );
};

export default injectIntl(PreviewDialog);
