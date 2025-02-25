/**
 * @flow
 * @file Content Explorer Delete Confirmation Dialog
 * @author Box
 */

import * as React from 'react';
import Modal from 'react-modal';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import ContentUploader from '../../content-uploader';
import messages from '../messages';
import { CLASS_MODAL_CONTENT_FULL_BLEED, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../../constants';
import type { Token } from '../../../common/types/core';

type Props = {
    apiHost: string,
    appElement: HTMLElement,
    contentUploaderProps: ContentUploaderProps,
    currentFolderId: ?string,
    intl: IntlShape,
    isOpen: boolean,
    onClose: Function,
    onUpload?: Function,
    parentElement: HTMLElement,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    sharedLink?: string,
    sharedLinkPassword?: string,
    token: Token,
    uploadHost: string,
};

const UploadDialog = ({
    isOpen,
    currentFolderId,
    token,
    sharedLink,
    sharedLinkPassword,
    apiHost,
    uploadHost,
    onClose,
    parentElement,
    appElement,
    onUpload,
    contentUploaderProps,
    requestInterceptor,
    responseInterceptor,
    intl,
}: Props) => (
    <Modal
        appElement={appElement}
        className={CLASS_MODAL_CONTENT_FULL_BLEED}
        contentLabel={intl.formatMessage(messages.upload)}
        isOpen={isOpen}
        onRequestClose={onClose}
        overlayClassName={CLASS_MODAL_OVERLAY}
        parentSelector={() => parentElement}
        portalClassName={`${CLASS_MODAL} be-modal-upload`}
    >
        <ContentUploader
            {...contentUploaderProps}
            apiHost={apiHost}
            onClose={onClose}
            onComplete={onUpload}
            requestInterceptor={requestInterceptor}
            responseInterceptor={responseInterceptor}
            rootFolderId={currentFolderId}
            sharedLink={sharedLink}
            sharedLinkPassword={sharedLinkPassword}
            token={token}
            uploadHost={uploadHost}
        />
    </Modal>
);

export default injectIntl(UploadDialog);
