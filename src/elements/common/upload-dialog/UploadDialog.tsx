import * as React from 'react';
import Modal from 'react-modal';
import { useIntl } from 'react-intl';
import ContentUploader from '../../content-uploader';
import messages from '../messages';
import { CLASS_MODAL_CONTENT_FULL_BLEED, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../../constants';
import type { Token } from '../../../common/types/core';
import type { ContentUploaderProps } from '../../content-uploader/ContentUploader';

export interface UploadDialogProps {
    apiHost: string;
    appElement: HTMLElement;
    contentUploaderProps: ContentUploaderProps;
    currentFolderId?: string;
    isOpen: boolean;
    onClose: () => void;
    onUpload?: (items: unknown[]) => void;
    parentElement: HTMLElement;
    requestInterceptor?: Function;
    responseInterceptor?: Function;
    sharedLink?: string;
    sharedLinkPassword?: string;
    token: Token;
    uploadHost: string;
}

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
}: UploadDialogProps) => {
    const { formatMessage } = useIntl();

    return (
        <Modal
            appElement={appElement}
            className={CLASS_MODAL_CONTENT_FULL_BLEED}
            contentLabel={formatMessage(messages.upload)}
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
};

export default UploadDialog;
