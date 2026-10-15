import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Modal from 'react-modal';
import { Modal as BlueprintModal } from '@box/blueprint-web';
import type { BoxItem } from '../../common/types/core';

import { CLASS_MODAL_CONTENT, CLASS_MODAL_OVERLAY, CLASS_MODAL, TYPE_FOLDER } from '../../constants';

import messages from '../common/messages';

export interface DeleteConfirmationDialogProps {
    appElement: HTMLElement;
    isLoading: boolean;
    isOpen: boolean;
    item: BoxItem;
    onCancel: () => void;
    onDelete: () => void;
    parentElement: HTMLElement;
}

const DeleteConfirmationDialog = ({
    appElement,
    isLoading,
    isOpen,
    item,
    onCancel,
    onDelete,
    parentElement,
}: DeleteConfirmationDialogProps) => {
    const { formatMessage } = useIntl();
    const message = item.type === TYPE_FOLDER ? messages.deleteDialogFolderText : messages.deleteDialogFileText;
    return (
        <Modal
            appElement={appElement}
            className={CLASS_MODAL_CONTENT}
            contentLabel={formatMessage(messages.deleteDialogLabel)}
            isOpen={isOpen}
            onRequestClose={onCancel}
            overlayClassName={CLASS_MODAL_OVERLAY}
            parentSelector={() => parentElement}
            portalClassName={`${CLASS_MODAL} be-modal-delete`}
        >
            <BlueprintModal.Body>
                <FormattedMessage {...message} values={{ name: item.name }} />
            </BlueprintModal.Body>
            <BlueprintModal.Footer>
                <BlueprintModal.Footer.SecondaryButton autoFocus disabled={isLoading} onClick={onCancel} size="large">
                    {formatMessage(messages.cancel)}
                </BlueprintModal.Footer.SecondaryButton>
                <BlueprintModal.Footer.PrimaryButton
                    loading={isLoading}
                    loadingAriaLabel={formatMessage(messages.loading)}
                    onClick={onDelete}
                    size="large"
                >
                    {formatMessage(messages.delete)}
                </BlueprintModal.Footer.PrimaryButton>
            </BlueprintModal.Footer>
        </Modal>
    );
};

export default DeleteConfirmationDialog;
