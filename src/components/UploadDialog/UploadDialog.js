/**
 * @flow
 * @file Content Explorer Delete Confirmation Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import ContentUploader from '../ContentUploader';
import { CLASS_MODAL_CONTENT_FULL_BLEED, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../constants';

type Props = {
    isOpen: boolean,
    rootFolderId: string,
    token: string,
    sharedLink?: string,
    sharedLinkPassword?: string,
    apiHost: string,
    uploadHost: string,
    onClose: Function,
    getLocalizedMessage: Function,
    parentElement: HTMLElement,
    onUpload: Function
};

/* eslint-disable jsx-a11y/label-has-for */
const UploadDialog = ({
    isOpen,
    rootFolderId,
    token,
    sharedLink,
    sharedLinkPassword,
    apiHost,
    uploadHost,
    onClose,
    getLocalizedMessage,
    parentElement,
    onUpload
}: Props) =>
    <Modal
        isOpen={isOpen}
        parentSelector={() => parentElement}
        portalClassName={`${CLASS_MODAL} buik-modal-upload`}
        className={CLASS_MODAL_CONTENT_FULL_BLEED}
        overlayClassName={CLASS_MODAL_OVERLAY}
        contentLabel={getLocalizedMessage('buik.modal.upload.dialog.label')}
    >
        <ContentUploader
            rootFolderId={rootFolderId}
            token={token}
            sharedLink={sharedLink}
            sharedLinkPassword={sharedLinkPassword}
            apiHost={apiHost}
            uploadHost={uploadHost}
            onClose={onClose}
            getLocalizedMessage={getLocalizedMessage}
            onComplete={onUpload}
        />
    </Modal>;

export default UploadDialog;
