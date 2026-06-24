import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '@box/blueprint-web';

import getFileSize from '../../utils/getFileSize';
import messages from './messages';

import './LargeFileWarningModal.scss';

export type OversizeFile = {
    name: string;
    size: number;
};

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
    const intl = useIntl();
    const oversizeCount = oversizeFiles.length;
    const maxFileSizeLabel = maxFileSize ? getFileSize(maxFileSize, intl.locale) : null;
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const rowVirtualizer = useVirtualizer({
        count: oversizeFiles.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 20,
        overscan: 1,
        gap: 12,
    });

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

    const renderFileList = () => {
        return (
            <div
                aria-label={intl.formatMessage(messages.largeFileWarningFileListAriaLabel)}
                className="bcu-large-file-warning-modal-fileListContainer"
                ref={scrollRef}
                role="list"
            >
                <div
                    className="bcu-large-file-warning-modal-fileListInner"
                    style={{ height: rowVirtualizer.getTotalSize() }}
                >
                    {rowVirtualizer.getVirtualItems().map(item => {
                        const file = oversizeFiles[item.index];

                        return (
                            <div
                                key={`${file.name}-${file.size}`}
                                ref={rowVirtualizer.measureElement}
                                className="bcu-large-file-warning-modal-fileListRow"
                                data-index={item.index}
                                role="listitem"
                                style={{ transform: `translateY(${item.start}px)` }}
                            >
                                <span className="bcu-large-file-warning-modal-fileName" title={file.name}>
                                    {file.name}
                                </span>
                                <span className="bcu-large-file-warning-modal-fileSize">
                                    {getFileSize(file.size, intl.locale)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <Modal open={isOpen} onOpenChange={handleOpenChange}>
            <Modal.Content size="small">
                <Modal.Header>
                    {intl.formatMessage(messages.largeFileWarningHeading, { count: oversizeCount })}
                </Modal.Header>
                <Modal.ScrollableContainer>
                    <Modal.Body>
                        <div className="bcu-large-file-warning-modal-body">
                            <p className="bcu-large-file-warning-modal-description">
                                <FormattedMessage
                                    {...messages.largeFileWarningBody}
                                    values={{
                                        count: oversizeCount,
                                        maxFileSize: maxFileSizeLabel,
                                        link: chunks =>
                                            onUpgradeCTAClick ? (
                                                <button
                                                    className="bcu-large-file-warning-modal-upgradeLink"
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
                            {renderFileList()}
                        </div>
                    </Modal.Body>
                </Modal.ScrollableContainer>
                <Modal.Footer>
                    <Modal.Footer.SecondaryButton onClick={onCancel}>
                        {intl.formatMessage(messages.largeFileWarningCancelButton)}
                    </Modal.Footer.SecondaryButton>
                    <Modal.Footer.PrimaryButton disabled={eligibleCount <= 0} onClick={onConfirm}>
                        {intl.formatMessage(messages.largeFileWarningUploadTheRestButton)}
                    </Modal.Footer.PrimaryButton>
                </Modal.Footer>
                <Modal.Close aria-label={intl.formatMessage(messages.largeFileWarningCloseAriaLabel)} />
            </Modal.Content>
        </Modal>
    );
};

export default LargeFileWarningModal;
