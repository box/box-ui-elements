/**
 * @flow
 * @file Content Explorer Preview dialog
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
            isOpen={isOpen}
            parentSelector={() => parentElement}
            portalClassName={`${CLASS_MODAL} be-modal-preview`}
            className={CLASS_MODAL_CONTENT_FULL_BLEED}
            overlayClassName={CLASS_MODAL_OVERLAY}
            contentLabel={intl.formatMessage(messages.preview)}
            onRequestClose={onCancel}
            appElement={appElement}
        >
            <ContentPreview
                {...contentPreviewProps}
                fileId={item.id}
                apiHost={apiHost}
                appHost={appHost}
                staticHost={staticHost}
                staticPath={staticPath}
                previewLibraryVersion={previewLibraryVersion}
                cache={cache}
                token={token}
                hasHeader
                autoFocus
                collection={files}
                onLoad={onLoad}
                onClose={onCancel}
                onDownload={onDownload}
                canDownload={canDownload}
                sharedLink={sharedLink}
                sharedLinkPassword={sharedLinkPassword}
                contentPreviewProps={contentPreviewProps}
                requestInterceptor={requestInterceptor}
                responseInterceptor={responseInterceptor}
            />
        </Modal>
    );
};

export default injectIntl(PreviewDialog);
