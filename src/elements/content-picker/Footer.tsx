/**
 * Footer component for content picker
 * Provides action buttons and selection status
 */
import * as React from 'react';
import { useIntl } from 'react-intl';
import type { Collection, BoxItem } from '../../common/types/core';
import Button, { ButtonType } from '../../components/button';
import ButtonGroup from '../../components/button-group';
import IconCheck from '../../icons/general/IconCheck';
import IconClose from '../../icons/general/IconClose';
import messages from '../common/messages';
import PrimaryButton from '../../components/primary-button';
import Tooltip from '../common/Tooltip';

import './Footer.scss';

export interface FooterCustomActionButtonsProps {
    currentFolderId: Collection['id'];
    currentFolderName: Collection['name'];
    onCancel: () => void;
    onChoose: () => void;
    selectedCount: number;
    selectedItems: BoxItem[];
}

export interface FooterProps {
    cancelButtonLabel?: string;
    children?: React.ReactNode;
    chooseButtonLabel?: string;
    currentCollection: Collection;
    hasHitSelectionLimit: boolean;
    isSingleSelect: boolean;
    onCancel: () => void;
    onChoose: () => void;
    onSelectedClick: () => void;
    renderCustomActionButtons?: (props: FooterCustomActionButtonsProps) => React.ReactNode;
    selectedCount: number;
    selectedItems: BoxItem[];
    showSelectedButton?: boolean;
}

const Footer = ({
    currentCollection,
    selectedCount,
    selectedItems,
    onSelectedClick,
    hasHitSelectionLimit,
    isSingleSelect,
    onCancel,
    onChoose,
    chooseButtonLabel,
    cancelButtonLabel,
    children,
    renderCustomActionButtons,
    showSelectedButton,
}: FooterProps) => {
    const { formatMessage } = useIntl();
    const cancelMessage = formatMessage(messages.cancel);
    const chooseMessage = formatMessage(messages.choose);
    const isChooseButtonDisabled = !selectedCount;

    return (
        <footer className="bcp-footer">
            <div className="bcp-footer-left">
                {showSelectedButton && !isSingleSelect && (
                    <Button className="bcp-selected" onClick={onSelectedClick} type={ButtonType.BUTTON}>
                        <span className="bcp-selected-count">
                            {formatMessage(messages.selected, { count: selectedCount })}
                        </span>
                        {hasHitSelectionLimit && (
                            <span className="bcp-selected-max">({formatMessage(messages.max)})</span>
                        )}
                    </Button>
                )}
            </div>
            <div className="bcp-footer-right">
                {children}

                {renderCustomActionButtons ? (
                    renderCustomActionButtons({
                        currentFolderId: currentCollection.id,
                        currentFolderName: currentCollection.name,
                        onCancel,
                        onChoose,
                        selectedCount,
                        selectedItems,
                    })
                ) : (
                    <ButtonGroup className="bcp-footer-actions">
                        <Tooltip text={cancelButtonLabel || cancelMessage}>
                            <Button aria-label={cancelMessage} onClick={onCancel} type={ButtonType.BUTTON}>
                                <IconClose height={16} width={16} />
                            </Button>
                        </Tooltip>
                        <Tooltip isDisabled={isChooseButtonDisabled} text={chooseButtonLabel || chooseMessage}>
                            <PrimaryButton
                                aria-label={chooseMessage}
                                isDisabled={isChooseButtonDisabled}
                                onClick={onChoose}
                                type={ButtonType.BUTTON}
                                data-testid="choose-button"
                                data-resin-target="choose"
                            >
                                <IconCheck color="#fff" height={16} width={16} />
                            </PrimaryButton>
                        </Tooltip>
                    </ButtonGroup>
                )}
            </div>
        </footer>
    );
};

export default Footer;
