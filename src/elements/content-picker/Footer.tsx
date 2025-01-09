import * as React from 'react';
import { injectIntl, type IntlShape } from 'react-intl';
import { Button, Toolbar, Tooltip } from '@box/blueprint-web';
import type { Collection, BoxItem } from '../../common/types/core';

import messages from '../common/messages';
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
    intl: IntlShape;
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
    intl,
    isSingleSelect,
    onCancel,
    onChoose,
    chooseButtonLabel,
    cancelButtonLabel,
    children,
    renderCustomActionButtons,
    showSelectedButton,
}: FooterProps) => {
    const cancelMessage = intl.formatMessage(messages.cancel);
    const chooseMessage = intl.formatMessage(messages.choose);
    const isChooseButtonDisabled = !selectedCount;

    return (
        <footer className="bcp-footer">
            <div className="bcp-footer-left">
                {showSelectedButton && !isSingleSelect && (
                    <Button className="bcp-selected" onClick={onSelectedClick} variant="secondary">
                        {`${intl.formatMessage(messages.selected, { count: selectedCount })}${
                            hasHitSelectionLimit ? ` (${intl.formatMessage(messages.max)})` : ''
                        }`}
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
                    <Toolbar.Root className="bcp-footer-actions">
                        <Tooltip content={cancelButtonLabel || cancelMessage} __checkInteractivity={false}>
                            <Button onClick={onCancel} variant="secondary">
                                {cancelButtonLabel || cancelMessage}
                            </Button>
                        </Tooltip>
                        <Tooltip
                            content={chooseButtonLabel || chooseMessage}
                            open={isChooseButtonDisabled ? false : undefined}
                            __checkInteractivity={false}
                        >
                            <Button
                                disabled={isChooseButtonDisabled}
                                onClick={onChoose}
                                variant="primary"
                                data-testid="choose-button"
                                data-resin-target="choose"
                            >
                                {chooseButtonLabel || chooseMessage}
                            </Button>
                        </Tooltip>
                    </Toolbar.Root>
                )}
            </div>
        </footer>
    );
};

export default injectIntl(Footer);
