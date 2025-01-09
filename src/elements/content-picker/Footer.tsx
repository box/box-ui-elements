/**
 * Footer component for content picker
 * Provides action buttons and selection status
 */
import * as React from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@box/blueprint-web';
import type { Collection, BoxItem } from '../../common/types/core';
import ButtonGroup from '../../components/button-group';
import IconCheck from '../../icons/general/IconCheck';
import IconClose from '../../icons/general/IconClose';
import messages from '../common/messages';
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
                    <Button className="bcp-selected" onClick={onSelectedClick} variant="secondary">
                        {formatMessage(messages.selected, { count: selectedCount })}
                        {hasHitSelectionLimit ? ` (${formatMessage(messages.max)})` : ''}
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
                            <Button
                                onClick={onCancel}
                                variant="secondary"
                                aria-label={cancelButtonLabel || cancelMessage}
                                icon={IconClose}
                            >
                                {cancelButtonLabel || cancelMessage}
                            </Button>
                        </Tooltip>
                        <Tooltip isDisabled={isChooseButtonDisabled} text={chooseButtonLabel || chooseMessage}>
                            <Button
                                variant="primary"
                                onClick={onChoose}
                                disabled={isChooseButtonDisabled}
                                aria-disabled={isChooseButtonDisabled}
                                aria-label={chooseButtonLabel || chooseMessage}
                                data-testid="choose-button"
                                data-resin-target="choose"
                                icon={IconCheck}
                            >
                                {chooseButtonLabel || chooseMessage}
                            </Button>
                        </Tooltip>
                    </ButtonGroup>
                )}
            </div>
        </footer>
    );
};

export default Footer;
