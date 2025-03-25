import * as React from 'react';
import { useIntl } from 'react-intl';
import Modal from 'react-modal';
import cloneDeep from 'lodash/cloneDeep';

import { AxiosRequestConfig, AxiosResponse } from 'axios';
import ContentPreview, { ContentPreviewProps } from '../../content-preview';
import { TYPE_FILE, CLASS_MODAL_CONTENT_FULL_BLEED, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../../constants';
import type { Token, BoxItem, Collection } from '../../../common/types/core';
import type APICache from '../../../utils/Cache';

import messages from '../messages';

export interface PreviewDialogProps {
    apiHost: string;
    appElement: HTMLElement;
    appHost: string;
    cache: APICache;
    canDownload: boolean;
    contentPreviewProps: ContentPreviewProps;
    currentCollection: Collection;
    isOpen: boolean;
    isTouch: boolean;
    item: BoxItem;
    onCancel: () => void;
    onDownload: (item: BoxItem) => void;
    onPreview: (data: unknown) => void;
    parentElement: HTMLElement;
    previewLibraryVersion: string;
    requestInterceptor?: (response: AxiosResponse) => void;
    responseInterceptor?: (config: AxiosRequestConfig) => void;
    sharedLink?: string;
    sharedLinkPassword?: string;
    staticHost: string;
    staticPath: string;
    token: Token;
}

const PreviewDialog = ({
    apiHost,
    appElement,
    appHost,
    cache,
    canDownload,
    contentPreviewProps,
    currentCollection,
    isOpen,
    item,
    onCancel,
    onDownload,
    onPreview,
    parentElement,
    previewLibraryVersion,
    requestInterceptor,
    responseInterceptor,
    sharedLink,
    sharedLinkPassword,
    staticHost,
    staticPath,
    token,
}: PreviewDialogProps) => {
    const { formatMessage } = useIntl();
    const { items }: Collection = currentCollection;
    const onLoad = (data: unknown): void => {
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
            contentLabel={formatMessage(messages.preview)}
            isOpen={isOpen}
            onRequestClose={onCancel}
            overlayClassName={CLASS_MODAL_OVERLAY}
            parentSelector={() => parentElement}
            portalClassName={CLASS_MODAL}
        >
            <ContentPreview
                {...contentPreviewProps}
                autoFocus
                apiHost={apiHost}
                appHost={appHost}
                cache={cache}
                canDownload={canDownload}
                collection={files}
                fileId={item.id}
                hasHeader
                onClose={onCancel}
                onDownload={onDownload}
                onLoad={onLoad}
                previewLibraryVersion={previewLibraryVersion}
                staticHost={staticHost}
                staticPath={staticPath}
                sharedLink={sharedLink}
                sharedLinkPassword={sharedLinkPassword}
                requestInterceptor={requestInterceptor}
                responseInterceptor={responseInterceptor}
                token={token}
            />
        </Modal>
    );
};

export default PreviewDialog;
