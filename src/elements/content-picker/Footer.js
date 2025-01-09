/**
 * @flow
 * @file Footer list component
 * @author Box
 */

import * as React from 'react';
import { injectIntl } from 'react-intl';
import { Button } from '@box/blueprint-web';
import ButtonGroup from '../../components/button-group';
import messages from '../common/messages';
import Tooltip from '../common/Tooltip';
import './Footer.scss';

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
}) => {
    const cancelMessage = intl.formatMessage(messages.cancel);
    const chooseMessage = intl.formatMessage(messages.choose);
    const isChooseButtonDisabled = !selectedCount;
    return (
        <footer className="bcp-footer">
            <div className="bcp-footer-left">
                {showSelectedButton && !isSingleSelect && (
                    <Button
                        className="bcp-selected"
                        onClick={onSelectedClick}
                        variant="secondary"
                        aria-label={`${selectedCount} selected${hasHitSelectionLimit ? ' (max)' : ''}`}
                    >
                        {`${selectedCount} selected${hasHitSelectionLimit ? ' (max)' : ''}`}
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
                            >
                                {cancelButtonLabel || cancelMessage}
                            </Button>
                        </Tooltip>
                        <Tooltip isDisabled={isChooseButtonDisabled} text={chooseButtonLabel || chooseMessage}>
                            <Button
                                disabled={isChooseButtonDisabled} // sets disabled attribute
                                onClick={onChoose}
                                variant="primary"
                                data-testid="choose-button"
                                data-resin-target="choose"
                                aria-label={chooseButtonLabel || chooseMessage}
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

export default injectIntl(Footer);
