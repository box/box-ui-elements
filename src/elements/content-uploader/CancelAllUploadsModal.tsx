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
            heading={formatMessage(messages.heading)}
            textContent={formatMessage(messages.body)}
            closeButtonAriaLabel={formatMessage(messages.closeLabel)}
        >
            <AlertModal.SecondaryButton onClick={onDismiss}>
                {formatMessage(messages.keepUploadingButton)}
            </AlertModal.SecondaryButton>
            <AlertModal.PrimaryButton variant="destructive" onClick={onConfirm}>
                {formatMessage(messages.confirmButton)}
            </AlertModal.PrimaryButton>
        </AlertModal>
    );
}

export default CancelAllUploadsModal;
