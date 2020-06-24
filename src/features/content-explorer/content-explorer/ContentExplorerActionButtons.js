import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../../components/button';
import PrimaryButton from '../../../components/primary-button';

import { ContentExplorerModePropType, FolderPropType, ItemsMapPropType } from '../prop-types';
import ContentExplorerModes from '../modes';
import messages from '../messages';

export const getChosenItemsFromSelectedItems = selectedItems => {
    const chosenItems = [];
    const selectedItemsIds = Object.keys(selectedItems);
    selectedItemsIds.forEach(id => {
        if (!selectedItems[id].isActionDisabled) {
            chosenItems.push(selectedItems[id]);
        }
    });
    return chosenItems;
};

const ContentExplorerActionButtons = ({
    actionButtonsProps = {},
    areButtonsDisabled = false,
    cancelButtonProps = {},
    chooseButtonProps = {},
    chooseButtonText,
    contentExplorerMode,
    currentFolder,
    isChooseButtonLoading = false,
    isCopyButtonLoading = false,
    isMoveButtonLoading = false,
    onCancelClick,
    onChooseClick,
    onCopyClick,
    onMoveClick,
    onSelectedClick,
    selectedItems,
}) => {
    const handleChooseClick = () => {
        let chosenItems = getChosenItemsFromSelectedItems(selectedItems);
        if (chosenItems.length === 0 && contentExplorerMode === ContentExplorerModes.SELECT_FOLDER && currentFolder) {
            // Choose the selected item. If no item is selected, choose the current folder.
            chosenItems = [currentFolder];
        }

        if (onChooseClick && chosenItems.length > 0) {
            onChooseClick(chosenItems);
        }
    };

    const handleMoveClick = () => {
        const selectedItemsIds = Object.keys(selectedItems);
        // Move to the selected item. If no item is selected, move to the current folder.
        const itemToMove = selectedItemsIds.length > 0 ? selectedItems[selectedItemsIds[0]] : currentFolder;

        if (onMoveClick) {
            onMoveClick(itemToMove);
        }
    };

    const handleCopyClick = () => {
        const selectedItemsIds = Object.keys(selectedItems);
        // Copy to the selected item. If no item is selected, copy to the current folder.
        const itemToCopy = selectedItemsIds.length > 0 ? selectedItems[selectedItemsIds[0]] : currentFolder;

        if (onCopyClick) {
            onCopyClick(itemToCopy);
        }
    };

    const renderStatus = () => {
        const chosenItems = getChosenItemsFromSelectedItems(selectedItems);
        const statusMessage = (
            <FormattedMessage {...messages.numSelected} values={{ numSelected: chosenItems.length }} />
        );

        const statusElement = onSelectedClick ? (
            <Button className="status-message" onClick={onSelectedClick}>
                {statusMessage}
            </Button>
        ) : (
            <span className="status-message">{statusMessage}</span>
        );

        return contentExplorerMode === ContentExplorerModes.MULTI_SELECT && statusElement;
    };

    return (
        <div className="content-explorer-action-buttons-container" {...actionButtonsProps}>
            {renderStatus()}
            <Button
                className="content-explorer-cancel-button"
                type="button"
                isDisabled={isChooseButtonLoading || isMoveButtonLoading || isCopyButtonLoading}
                onClick={onCancelClick}
                {...cancelButtonProps}
            >
                <FormattedMessage {...messages.cancel} />
            </Button>
            {(contentExplorerMode === ContentExplorerModes.SELECT_FILE ||
                contentExplorerMode === ContentExplorerModes.SELECT_FOLDER ||
                contentExplorerMode === ContentExplorerModes.MULTI_SELECT) && (
                <PrimaryButton
                    type="button"
                    className="content-explorer-choose-button"
                    isDisabled={areButtonsDisabled || isChooseButtonLoading}
                    isLoading={isChooseButtonLoading}
                    onClick={handleChooseClick}
                    {...chooseButtonProps}
                >
                    {chooseButtonText || <FormattedMessage {...messages.choose} />}
                </PrimaryButton>
            )}
            {contentExplorerMode === ContentExplorerModes.MOVE_COPY && (
                <PrimaryButton
                    key="move-btn"
                    type="button"
                    className="content-explorer-move-button"
                    onClick={handleMoveClick}
                    isDisabled={areButtonsDisabled || isMoveButtonLoading || isCopyButtonLoading}
                    isLoading={isMoveButtonLoading}
                >
                    <FormattedMessage {...messages.move} />
                </PrimaryButton>
            )}
            {contentExplorerMode === ContentExplorerModes.MOVE_COPY && (
                <PrimaryButton
                    key="copy-btn"
                    type="button"
                    className="content-explorer-copy-button"
                    onClick={handleCopyClick}
                    isDisabled={areButtonsDisabled || isMoveButtonLoading || isCopyButtonLoading}
                    isLoading={isCopyButtonLoading}
                >
                    <FormattedMessage {...messages.copy} />
                </PrimaryButton>
            )}
        </div>
    );
};

ContentExplorerActionButtons.propTypes = {
    actionButtonsProps: PropTypes.object,
    areButtonsDisabled: PropTypes.bool,
    cancelButtonProps: PropTypes.object,
    chooseButtonProps: PropTypes.object,
    chooseButtonText: PropTypes.node,
    contentExplorerMode: ContentExplorerModePropType.isRequired,
    currentFolder: FolderPropType,
    isChooseButtonLoading: PropTypes.bool,
    isCopyButtonLoading: PropTypes.bool,
    isMoveButtonLoading: PropTypes.bool,
    onCancelClick: PropTypes.func,
    onChooseClick: PropTypes.func,
    onCopyClick: PropTypes.func,
    onMoveClick: PropTypes.func,
    onSelectedClick: PropTypes.func,
    selectedItems: ItemsMapPropType.isRequired,
};

export default ContentExplorerActionButtons;
