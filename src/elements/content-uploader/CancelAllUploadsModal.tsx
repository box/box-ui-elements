import * as React from 'react';
import { useIntl } from 'react-intl';
import { AlertModal } from '@box/blueprint-web';
import messages from './messages';

export interface CancelAllUploadsModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onDismiss: () => void;
}

export function CancelAllUploadsModal({ isOpen, onConfirm, onDismiss }: CancelAllUploadsModalProps) {
    const { formatMessage } = useIntl();

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onDismiss();
        }
    };

    return (
        <AlertModal
            open={isOpen}
            onOpenChange={handleOpenChange}
            heading={formatMessage(messages.cancelAllUploadsModalHeading)}
            textContent={formatMessage(messages.cancelAllUploadsModalContent)}
            closeButtonAriaLabel={formatMessage(messages.cancelAllUploadsCloseLabel)}
        >
            <AlertModal.SecondaryButton onClick={onDismiss}>
                {formatMessage(messages.cancelAllUploadsKeepButton)}
            </AlertModal.SecondaryButton>
            <AlertModal.PrimaryButton variant="destructive" onClick={onConfirm}>
                {formatMessage(messages.cancelAllUploadsConfirmButton)}
            </AlertModal.PrimaryButton>
        </AlertModal>
    );
}

export default CancelAllUploadsModal;
