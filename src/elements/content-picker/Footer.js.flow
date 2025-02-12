/**
 * @flow
 * @file Footer list component
 * @author Box
 */

import * as React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { Node } from 'react';

import type { Collection, BoxItem } from '../../common/types/core';
import Button from '../../components/button';
import ButtonGroup from '../../components/button-group';
import IconCheck from '../../icons/general/IconCheck';
import IconClose from '../../icons/general/IconClose';
import messages from '../common/messages';

import PrimaryButton from '../../components/primary-button';
import Tooltip from '../common/Tooltip';
import './Footer.scss';

type Props = {
    cancelButtonLabel?: string,
    children?: any,
    chooseButtonLabel?: string,
    currentCollection: Collection,
    hasHitSelectionLimit: boolean,
    intl: any,
    isSingleSelect: boolean,
    onCancel: Function,
    onChoose: Function,
    onSelectedClick: Function,
    renderCustomActionButtons?: ({
        onCancel: Function,
        onChoose: Function,
        selectedCount: number,
        selectedItems: BoxItem[],
    }) => Node,
    selectedCount: number,
    selectedItems: BoxItem[],
    showSelectedButton: boolean,
};

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
                    <Button className="bcp-selected" onClick={onSelectedClick} type="button">
                        <FormattedMessage
                            className="bcp-selected-count"
                            {...messages.selected}
                            values={{ count: selectedCount }}
                        />
                        {hasHitSelectionLimit && (
                            <span className="bcp-selected-max">
                                (<FormattedMessage {...messages.max} />)
                            </span>
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
                            <Button aria-label={cancelMessage} onClick={onCancel} type="button">
                                <IconClose height={16} width={16} />
                            </Button>
                        </Tooltip>
                        <Tooltip isDisabled={isChooseButtonDisabled} text={chooseButtonLabel || chooseMessage}>
                            <PrimaryButton
                                aria-label={chooseMessage}
                                disabled={isChooseButtonDisabled} // sets disabled attribute
                                isDisabled={isChooseButtonDisabled} // used in Button component
                                onClick={onChoose}
                                type="button"
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

export default injectIntl(Footer);
