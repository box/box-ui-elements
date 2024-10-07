import * as React from 'react';
import { useIntl } from 'react-intl';
import { Modal } from '@box/blueprint-web';
import cloneDeep from 'lodash/cloneDeep';

import ContentPreview, { ContentPreviewProps } from '../content-preview';
import { TYPE_FILE } from '../../constants';
import type { Token, BoxItem, Collection } from '../../common/types/core';
import type APICache from '../../utils/Cache';

import messages from '../common/messages';

import './PreviewDialog.scss';

export interface PreviewDialogProps {
    apiHost: string;
    appHost: string;
    cache: APICache;
    canDownload: boolean;
    contentPreviewProps: ContentPreviewProps;
    currentCollection: Collection;
    isOpen: boolean;
    isTouch: boolean;
    item: BoxItem;
    onCancel: () => void;
    onDownload: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onPreview: (data: any) => void;
    parentElement: HTMLElement;
    previewLibraryVersion: string;
    requestInterceptor?: () => void;
    responseInterceptor?: () => void;
    sharedLink?: string;
    sharedLinkPassword?: string;
    staticHost: string;
    staticPath: string;
    token: Token;
}

const PreviewDialog = ({
    apiHost,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onLoad = (data: any): void => {
        if (onPreview) {
            onPreview(cloneDeep(data));
        }
    };

    if (!item || !items) {
        return null;
    }

    const files: BoxItem[] = items.filter(({ type }) => type === TYPE_FILE);
    return (
        <Modal onOpenChange={onCancel} open={isOpen}>
            <Modal.Content aria-label={formatMessage(messages.preview)} container={parentElement} size="xlarge">
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
            </Modal.Content>
        </Modal>
    );
};

export default PreviewDialog;
