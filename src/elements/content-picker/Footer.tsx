/**
 * @file Footer list component
 * @author Box
 */

import * as React from 'react';
import { injectIntl, FormattedMessage, type IntlShape } from 'react-intl';

import { type Collection, type BoxItem } from '../../common/types/core';
import ButtonAdapter from '../../components/button/ButtonAdapter';
import { ButtonType } from '../../components/button/Button';
import ButtonGroup from '../../components/button-group';
import IconCheck from '../../icons/general/IconCheck';
import IconClose from '../../icons/general/IconClose';
import messages from '../common/messages';
import Tooltip from '../common/Tooltip';
import './Footer.scss';

interface Props {
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
    renderCustomActionButtons?: (props: {
        currentFolderId?: string;
        currentFolderName?: string;
        onCancel: () => void;
        onChoose: () => void;
        selectedCount: number;
        selectedItems: BoxItem[];
    }) => React.ReactNode;
    selectedCount: number;
    selectedItems: BoxItem[];
    showSelectedButton: boolean;
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
}: Props) => {
    const cancelMessage = intl.formatMessage(messages.cancel);
    const chooseMessage = intl.formatMessage(messages.choose);
    const isChooseButtonDisabled = !selectedCount;
    return (
        <footer className="bcp-footer">
            <div className="bcp-footer-left">
                {showSelectedButton && !isSingleSelect && (
                    <ButtonAdapter
                        className="bcp-selected"
                        onClick={onSelectedClick}
                        type={ButtonType.BUTTON}
                    >
                        {intl.formatMessage(messages.selected, { count: selectedCount }) +
                            (hasHitSelectionLimit ? ` (${intl.formatMessage(messages.max)})` : '')}
                    </ButtonAdapter>
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
                            <ButtonAdapter
                                aria-label={cancelMessage}
                                onClick={onCancel}
                                type={ButtonType.BUTTON}
                            >
                                {cancelMessage}
                            </ButtonAdapter>
                        </Tooltip>
                        <Tooltip isDisabled={isChooseButtonDisabled} text={chooseButtonLabel || chooseMessage}>
                            <ButtonAdapter
                                aria-label={chooseMessage}
                                isDisabled={isChooseButtonDisabled}
                                onClick={onChoose}
                                type={ButtonType.BUTTON}
                                isSelected
                            >
                                {chooseMessage}
                            </ButtonAdapter>
                        </Tooltip>
                    </ButtonGroup>
                )}
            </div>
        </footer>
    );
};

export default injectIntl(Footer);
