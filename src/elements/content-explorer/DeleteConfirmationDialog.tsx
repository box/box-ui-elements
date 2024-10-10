import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '@box/blueprint-web';
import type { BoxItem } from '../../common/types/core';

import { TYPE_FOLDER } from '../../constants';

import messages from '../common/messages';

export interface DeleteConfirmationDialogProps {
    isLoading: boolean;
    isOpen: boolean;
    item: BoxItem;
    onCancel: () => void;
    onDelete: () => void;
    parentElement: HTMLElement;
}

const DeleteConfirmationDialog = ({
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
        <Modal onOpenChange={onCancel} open={isOpen}>
            <Modal.Content
                aria-label={formatMessage(messages.deleteDialogLabel)}
                container={parentElement}
                size="small"
            >
                <Modal.Header>{formatMessage(messages.deleteDialogHeader)}</Modal.Header>
                <Modal.Body>
                    <FormattedMessage {...message} values={{ name: item.name }} />
                </Modal.Body>
                <Modal.Footer>
                    <Modal.Footer.SecondaryButton disabled={isLoading} onClick={onCancel}>
                        {formatMessage(messages.cancel)}
                    </Modal.Footer.SecondaryButton>
                    <Modal.Footer.PrimaryButton
                        loading={isLoading}
                        loadingAriaLabel={formatMessage(messages.loading)}
                        onClick={onDelete}
                    >
                        {formatMessage(messages.delete)}
                    </Modal.Footer.PrimaryButton>
                </Modal.Footer>
                <Modal.Close aria-label={formatMessage(messages.close)} />
            </Modal.Content>
        </Modal>
    );
};

export default DeleteConfirmationDialog;
