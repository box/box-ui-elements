import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '@box/blueprint-web';

import getFileSize from '../../utils/getFileSize';
import messages from './messages';
import OversizeFileList, { type OversizeFile } from './OversizeFileList';

import './LargeFileWarningModal.scss';

export type { OversizeFile };

export interface LargeFileWarningModalProps {
    eligibleCount: number;
    isOpen: boolean;
    maxFileSize?: number;
    onCancel: () => void;
    onConfirm: () => void;
    onUpgradeCTAClick?: () => void;
    oversizeFiles: ReadonlyArray<OversizeFile>;
}

const LargeFileWarningModal = ({
    eligibleCount,
    isOpen,
    maxFileSize,
    onCancel,
    onConfirm,
    onUpgradeCTAClick,
    oversizeFiles,
}: LargeFileWarningModalProps) => {
    const { formatMessage, locale } = useIntl();
    const oversizeCount = oversizeFiles.length;
    const maxFileSizeLabel = maxFileSize ? getFileSize(maxFileSize, locale) : null;

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onCancel();
        }
    };

    const handleUpgradeCTAClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onUpgradeCTAClick?.();
        onCancel();
    };

    return (
        <Modal open={isOpen} onOpenChange={handleOpenChange}>
            <Modal.Content size="small">
                <Modal.Header>{formatMessage(messages.largeFileWarningHeading, { count: oversizeCount })}</Modal.Header>
                <Modal.ScrollableContainer>
                    <Modal.Body>
                        <div className="bcu-LargeFileWarningModal-body">
                            <p className="bcu-LargeFileWarningModal-description">
                                <FormattedMessage
                                    {...messages.largeFileWarningBody}
                                    values={{
                                        count: oversizeCount,
                                        maxFileSize: maxFileSizeLabel,
                                        link: chunks =>
                                            onUpgradeCTAClick ? (
                                                <button
                                                    className="bcu-LargeFileWarningModal-upgradeLink"
                                                    onClick={handleUpgradeCTAClick}
                                                    type="button"
                                                >
                                                    {chunks}
                                                </button>
                                            ) : (
                                                <span>{chunks}</span>
                                            ),
                                    }}
                                />
                            </p>
                            <OversizeFileList oversizeFiles={oversizeFiles} />
                        </div>
                    </Modal.Body>
                </Modal.ScrollableContainer>
                <Modal.Footer>
                    <Modal.Footer.SecondaryButton onClick={onCancel}>
                        {formatMessage(messages.largeFileWarningCancelButton)}
                    </Modal.Footer.SecondaryButton>
                    <Modal.Footer.PrimaryButton disabled={eligibleCount <= 0} onClick={onConfirm}>
                        {formatMessage(messages.largeFileWarningUploadTheRestButton)}
                    </Modal.Footer.PrimaryButton>
                </Modal.Footer>
                <Modal.Close aria-label={formatMessage(messages.largeFileWarningCloseAriaLabel)} />
            </Modal.Content>
        </Modal>
    );
};

export default LargeFileWarningModal;
