/**
 * @file Footer list component
 * @author Box
 */

import * as React from 'react';
import { injectIntl, FormattedMessage, type IntlShape } from 'react-intl';
import { ReactNode } from 'react';

import { Collection, BoxItem } from '../../common/types/core';
import Button, { ButtonType } from '../../components/button';
import ButtonGroup from '../../components/button-group';
import IconCheck from '../../icons/general/IconCheck';
import IconClose from '../../icons/general/IconClose';
import messages from '../common/messages';

import PrimaryButton from '../../components/primary-button';
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
    renderCustomActionButtons?: (options: {
        currentFolderId?: string;
        currentFolderName?: string;
        onCancel: () => void;
        onChoose: () => void;
        selectedCount: number;
        selectedItems: BoxItem[];
    }) => ReactNode;
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
                    <Button
                        className="bcp-selected"
                        onClick={onSelectedClick}
                        type={ButtonType.SUBMIT}
                        isLoading={false}
                        showRadar={false}
                    >
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
                    <ButtonGroup className="bcp-footer-actions" data-testid="button-group">
                        <Tooltip text={cancelButtonLabel || cancelMessage}>
                            <Button
                                aria-label={cancelMessage}
                                onClick={onCancel}
                                type={ButtonType.SUBMIT}
                                className="btn-close"
                                isLoading={false}
                                showRadar={false}
                            >
                                <IconClose height={16} width={16} />
                            </Button>
                        </Tooltip>
                        <Tooltip isDisabled={isChooseButtonDisabled} text={chooseButtonLabel || chooseMessage}>
                            <PrimaryButton
                                aria-label={chooseMessage}
                                className="btn-choose"
                                isDisabled={isChooseButtonDisabled}
                                onClick={onChoose}
                                type={ButtonType.SUBMIT}
                                isLoading={false}
                                showRadar={false}
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
