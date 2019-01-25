/**
 * @flow
 * @file Content Explorer Delete Confirmation Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import { injectIntl } from 'react-intl';
import ContentUploader from '../../content-uploader';
import messages from '../messages';
import { CLASS_MODAL_CONTENT_FULL_BLEED, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../../constants';

type Props = {
    isOpen: boolean,
    currentFolderId: ?string,
    token: Token,
    sharedLink?: string,
    sharedLinkPassword?: string,
    apiHost: string,
    uploadHost: string,
    onClose: Function,
    parentElement: HTMLElement,
    appElement: HTMLElement,
    onUpload?: Function,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
} & InjectIntlProvidedProps;

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
    requestInterceptor,
    responseInterceptor,
    intl,
}: Props) => (
    <Modal
        isOpen={isOpen}
        parentSelector={() => parentElement}
        portalClassName={`${CLASS_MODAL} be-modal-upload`}
        className={CLASS_MODAL_CONTENT_FULL_BLEED}
        overlayClassName={CLASS_MODAL_OVERLAY}
        onRequestClose={onClose}
        contentLabel={intl.formatMessage(messages.upload)}
        appElement={appElement}
    >
        <ContentUploader
            rootFolderId={currentFolderId}
            token={token}
            sharedLink={sharedLink}
            sharedLinkPassword={sharedLinkPassword}
            apiHost={apiHost}
            uploadHost={uploadHost}
            onClose={onClose}
            onComplete={onUpload}
            requestInterceptor={requestInterceptor}
            responseInterceptor={responseInterceptor}
        />
    </Modal>
);

export default injectIntl(UploadDialog);
