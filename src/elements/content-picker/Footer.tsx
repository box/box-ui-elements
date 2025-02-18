import * as React from 'react';
import { injectIntl, FormattedMessage, IntlShape } from 'react-intl';
import type { Collection, BoxItem } from '../../common/types/core';
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
        currentFolderId: string;
        currentFolderName: string;
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
}: Props): React.ReactElement => {
    const cancelMessage = intl.formatMessage(messages.cancel);
    const chooseMessage = intl.formatMessage(messages.choose);
    const isChooseButtonDisabled = !selectedCount;
    return (
        <footer className="bcp-footer">
            <div className="bcp-footer-left">
                {showSelectedButton && !isSingleSelect && (
                    <Button className="bcp-selected" onClick={onSelectedClick} type={ButtonType.BUTTON}>
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
                            <Button aria-label={cancelMessage} onClick={onCancel} type={ButtonType.BUTTON}>
                                <IconClose height={16} width={16} />
                            </Button>
                        </Tooltip>
                        <Tooltip isDisabled={isChooseButtonDisabled} text={chooseButtonLabel || chooseMessage}>
                            <PrimaryButton
                                aria-label={chooseMessage}
                                disabled={isChooseButtonDisabled} // sets disabled attribute for native HTML button
                                isDisabled={isChooseButtonDisabled} // used in Button component
                                onClick={onChoose}
                                type={ButtonType.BUTTON}
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

export default injectIntl(Footer) as React.ComponentType<Omit<Props, 'intl'>>;
