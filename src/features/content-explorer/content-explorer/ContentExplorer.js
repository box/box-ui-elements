import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';

import ContentExplorerHeaderActions from './ContentExplorerHeaderActions';
import ContentExplorerEmptyState from './ContentExplorerEmptyState';
import ContentExplorerActionButtons from './ContentExplorerActionButtons';
import ContentExplorerSelectAll from './ContentExplorerSelectAll';
import ContentExplorerIncludeSubfolders from './ContentExplorerIncludeSubfolders';

import ItemList from '../item-list';
import { ContentExplorerModePropType, FoldersPathPropType, ItemsPropType } from '../prop-types';
import ContentExplorerModes from '../modes';

import { TYPE_FOLDER } from '../../../constants';
import { DEFAULT_ROW_HEIGHT } from '../item-list/ItemList';

import './ContentExplorer.scss';

class ContentExplorer extends Component {
    static propTypes = {
        /** Props for the action buttons container */
        actionButtonsProps: PropTypes.object,
        /**
         * Extra columns displayed in the folders table after folder name column
         * Each column has to be a Column element
         */
        additionalColumns: PropTypes.arrayOf(PropTypes.element),
        /**  Allow users to choose no selections in MULTI_SELECT mode, defaults to false  */
        isNoSelectionAllowed: PropTypes.bool,
        /** Props for breadcrumbs */
        breadcrumbProps: PropTypes.object,
        /** Props for the cancel button */
        cancelButtonProps: PropTypes.object,
        /** Props for the choose button */
        chooseButtonProps: PropTypes.object,
        /** Custom text for the choose button */
        chooseButtonText: PropTypes.node,
        /** Adds class name. */
        className: PropTypes.string,
        /** Configures the content explorer based on the user's intended action (ex. select file or move/copy) */
        contentExplorerMode: ContentExplorerModePropType.isRequired,
        /** Props that contains the custom search input. Is rendered in header actions */
        customInput: PropTypes.func,
        /** Called when a user selects a folder to include subfolders for */
        handleSelectAllTree: PropTypes.func,
        /** Any extra items in the header to the right of the search input (and new folder button) */
        headerActionsAccessory: PropTypes.node,
        /** Initial path of folders. The last folder in the array is the current folder. */
        initialFoldersPath: FoldersPathPropType.isRequired,
        /** Initial items that will show up as selected */
        initialSelectedItems: PropTypes.object,
        /** Whether the user can see the Include Subfolders toggle with breadcrumb updated design */
        isIncludeSubfoldersAllowed: PropTypes.bool,
        /** Whether to use the responsive version */
        isResponsive: PropTypes.bool,
        /**
         * Called when the current folder changes
         *
         * @param {Object} enteredFolder
         * @param {Array} newFoldersPath
         */
        onEnterFolder: PropTypes.func.isRequired,
        /**
         * Called when an item is selected
         *
         * @param {Object} selectedItem
         * @param {number} selectedItemIndex
         */
        onSelectItem: PropTypes.func,
        /**
         * Called when an item is chosen
         *
         * @param {Object[]} chosenItems
         */
        onChooseItems: PropTypes.func,
        /** Called when selected button is clicked */
        onSelectedClick: PropTypes.func,
        /**
         * Called when a destination folder has been selected for moving an item to
         *
         * @param {Object} destFolder destination folder
         */
        onMoveItem: PropTypes.func,
        /**
         * Called when a destination folder has been selected for copying an item to
         *
         * @param {Object} destFolder destination folder
         */
        onCopyItem: PropTypes.func,
        /** Called when cancel button is clicked */
        onCancelButtonClick: PropTypes.func,
        /** Called when new folder button is clicked */
        onCreateNewFolderButtonClick: PropTypes.func,
        /** Whether the new folder button should be shown */
        showCreateNewFolderButton: PropTypes.bool,
        /** Whether the choose button should be shown with a loading indicator */
        isChooseButtonLoading: PropTypes.bool,
        /** Whether the copy button should be shown with a loading indicator */
        isCopyButtonLoading: PropTypes.bool,
        /** Whether the user has permission to create a new folder */
        isCreateNewFolderAllowed: PropTypes.bool,
        /** Whether the user can see select all checkbox */
        isSelectAllAllowed: PropTypes.bool,
        /** Whether the move button should be shown with a loading indicator */
        isMoveButtonLoading: PropTypes.bool,
        /**
         * Called when a search query is submitted.
         *
         * @param {string} searchQuery
         */
        onSearchSubmit: PropTypes.func.isRequired,
        /**
         * Called when search mode is exited. An updated items list should now be passed in to display the user's file tree.
         *
         * @param {Object} folderBeforeSearch the previous folder object before entering search mode
         */
        onExitSearch: PropTypes.func.isRequired,
        /** List of items to display */
        items: ItemsPropType.isRequired,
        /** Number of items to load per page as the user scrolls */
        numItemsPerPage: PropTypes.number,
        /** Total number of items across all pages */
        numTotalItems: PropTypes.number,
        /** Called to load more items */
        onLoadMoreItems: PropTypes.func,
        /** Used to render item icons in the list. Overrides the default icons. */
        itemIconRenderer: PropTypes.func,
        /** Used to render item name links in the list. Overrides the default links. */
        itemNameLinkRenderer: PropTypes.func,
        /** Used to render item buttons in the list. Overrides the default buttons. */
        itemButtonRenderer: PropTypes.func,
        /** Height of an item row */
        itemRowHeight: PropTypes.number,
        /** Used to render the row element for items on the list. Allows row customizations such as adding tooltips, etc. */
        itemRowRenderer: PropTypes.func,
        /** Height of the item list header, defaults to 0, which makes header not visible */
        listHeaderHeight: PropTypes.number,
        /** Used to render the header row on the item list */
        listHeaderRenderer: PropTypes.func,
        /** Width of the item list */
        listWidth: PropTypes.number.isRequired,
        /** Height of the item list */
        listHeight: PropTypes.number.isRequired,
        /** Props for the search input */
        searchInputProps: PropTypes.object,
    };

    static defaultProps = {
        actionButtonsProps: {},
        cancelButtonProps: {},
        chooseButtonProps: {},
        className: '',
        searchInputProps: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: props.initialSelectedItems || {},
            foldersPath: props.initialFoldersPath,
            isInSearchMode: false,
            isSelectAllChecked: false,
            includeSubfolders: false,
            allItemsEnabled: true,
            folderToDeepScan: {},
            itemsAreSelectedAndActionDisabled: false,
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick, true);
    }

    componentDidUpdate({ initialFoldersPath: prevInitialFoldersPath }) {
        const { allItemsEnabled, folderToDeepScan, includeSubfolders, itemsAreSelectedAndActionDisabled } = this.state;
        const { initialFoldersPath } = this.props;

        if (prevInitialFoldersPath !== initialFoldersPath) {
            this.setState({
                foldersPath: initialFoldersPath,
            });
        }

        // If we are inside a selected folder while the include subfolders toggle is on
        if (includeSubfolders && !itemsAreSelectedAndActionDisabled && this.shouldSelectAndActionDisableItems()) {
            this.setState({ itemsAreSelectedAndActionDisabled: true, allItemsEnabled: false });
        }
        // If we turn include subfolders toggle off while inside a folder that was chosen to include subfolders
        else if (itemsAreSelectedAndActionDisabled && !this.shouldSelectAndActionDisableItems()) {
            this.setState({ itemsAreSelectedAndActionDisabled: false });
        }
        // If we return back to the folder that our folder chosen for including subfolders is in
        else if (
            includeSubfolders &&
            !allItemsEnabled &&
            !this.shouldSelectAndActionDisableItems() &&
            !this.areOtherItemsDisabled(folderToDeepScan.id)
        ) {
            this.disableAllOtherItemButtons(folderToDeepScan.id);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick, true);
    }

    getCurrentFolder() {
        const { foldersPath } = this.state;
        return foldersPath[foldersPath.length - 1];
    }

    /**
     * Traverse the hirerachy up to the limit to see if any of the parent has the className
     */
    doAncestersContainClassname = (node, className, limit) => {
        let nodeOfInterest = node;
        let counter = 0;
        while (nodeOfInterest.parentNode && counter < limit) {
            // Done traversing (Document node does not have classnames)
            if (!nodeOfInterest.parentNode.className) {
                break;
            }

            if (nodeOfInterest.parentNode.className.includes(className)) {
                return true;
            }

            nodeOfInterest = nodeOfInterest.parentNode;
            counter += 1;
        }

        return false;
    };

    shouldDeselectItems = () => {
        const { contentExplorerMode } = this.props;

        return (
            // always deselect when not in multi select mode
            contentExplorerMode !== ContentExplorerModes.MULTI_SELECT
        );
    };

    handleDocumentClick = event => {
        const isInside = (this.domNode && this.domNode.contains(event.target)) || this.domNode === event.target;

        if (!isInside && this.shouldDeselectItems()) {
            this.deselectItems();
        }
    };

    handleContentExplorerClick = () => {
        if (this.shouldDeselectItems()) {
            this.deselectItems();
        }
    };

    deselectItems() {
        this.setState({
            selectedItems: {},
        });
    }

    enterFolder = enteredFolder => {
        const { contentExplorerMode, onEnterFolder } = this.props;
        const { foldersPath } = this.state;

        const folderIndex = foldersPath.findIndex(folder => folder.id === enteredFolder.id);
        let newFoldersPath = foldersPath.slice();

        if (folderIndex === -1) {
            // Append folder to the path if it's not already in the folders path
            newFoldersPath = newFoldersPath.concat([
                {
                    ...enteredFolder,
                },
            ]);
        } else {
            // Otherwise, remove all folders that came after the entered folder
            newFoldersPath = newFoldersPath.slice(0, folderIndex + 1);
        }

        const newState = { foldersPath: newFoldersPath };
        if (contentExplorerMode !== ContentExplorerModes.MULTI_SELECT) {
            newState.selectedItems = {};
        }

        this.setState(newState);

        onEnterFolder(enteredFolder, newFoldersPath);
    };

    handleFoldersPathUpdated = newFoldersPath => {
        this.setState({
            foldersPath: newFoldersPath,
        });
    };

    handleSearchSubmit = searchQuery => {
        const { onSearchSubmit } = this.props;

        this.setState({ isInSearchMode: true });
        onSearchSubmit(searchQuery);
    };

    handleExitSearch = folderBeforeSearch => {
        const { onExitSearch } = this.props;

        this.setState({ isInSearchMode: false });
        onExitSearch(folderBeforeSearch);
    };

    getFoldersOnly = () => {
        const { items } = this.props;

        if (this.itemsAreLoading()) {
            return items;
        }
        return items.filter(item => item.type === TYPE_FOLDER);
    };

    handleItemClick = ({ event, index }) => {
        const { contentExplorerMode, items, onSelectItem } = this.props;
        const { allItemsEnabled, includeSubfolders, itemsAreSelectedAndActionDisabled, selectedItems } = this.state;
        const item = includeSubfolders ? this.getFoldersOnly()[index] : items[index];

        if (item.isDisabled || item.isLoading || itemsAreSelectedAndActionDisabled) {
            return;
        }

        // Prevent the event from bubbling up (so our content explorer click handler doesn't fire)
        event.stopPropagation();

        let newSelectedItems = {};
        if (contentExplorerMode === ContentExplorerModes.MULTI_SELECT) {
            newSelectedItems = this.toggleSelectedItem(selectedItems, item);
        } else {
            newSelectedItems[item.id] = item;
        }

        this.setState({ selectedItems: newSelectedItems, isSelectAllChecked: false }, () => {
            if (this.shouldDisableAllOtherButtons()) {
                const newSelectedItem = Object.values(newSelectedItems)[0];
                this.setState({ folderToDeepScan: newSelectedItem });
                this.disableAllOtherItemButtons(newSelectedItem.id);
            } else if (!allItemsEnabled) {
                this.setState({ folderToDeepScan: {}, itemsAreSelectedAndActionDisabled: false });
                this.enableAllItemButtons();
            }
        });

        if (onSelectItem) {
            onSelectItem(item, index);
        }
    };

    handleItemDoubleClick = ({ index }) => {
        const { includeSubfolders, itemsAreSelectedAndActionDisabled } = this.state;
        const { items, onChooseItems } = this.props;
        const item = includeSubfolders ? this.getFoldersOnly()[index] : items[index];

        if (item.isDisabled || item.isLoading) {
            return;
        }

        if (item.type === TYPE_FOLDER) {
            this.enterFolder(item);
        } else if (!itemsAreSelectedAndActionDisabled) {
            onChooseItems([item]);
        }
        this.setState({ isSelectAllChecked: false });
    };

    handleItemNameClick = (event, index) => {
        const { includeSubfolders } = this.state;
        const { items } = this.props;
        const item = includeSubfolders ? this.getFoldersOnly()[index] : items[index];

        if (item.isDisabled || item.isLoading) {
            return;
        }

        if (item.type !== TYPE_FOLDER) {
            return;
        }

        // Prevent the event from bubbling (so our row click handler doesn't fire)
        event.preventDefault();
        event.stopPropagation();

        this.enterFolder(item);
        this.setState({ isSelectAllChecked: false });
    };

    toggleSelectedItem = (selectedItems, item) => {
        const result = { ...selectedItems };
        if (result[item.id]) {
            delete result[item.id];
        } else {
            result[item.id] = item;
        }

        return result;
    };

    selectAll = () => {
        const { items } = this.props;
        const { selectedItems } = this.state;
        const result = { ...selectedItems };
        items.forEach(item => {
            if (!result[item.id]) {
                result[item.id] = item;
            }
        });

        return result;
    };

    unselectAll = () => {
        const { items } = this.props;
        const { selectedItems } = this.state;
        const result = { ...selectedItems };
        items.forEach(item => {
            if (result[item.id]) {
                delete result[item.id];
            }
        });

        return result;
    };

    itemsAreLoading = () => {
        const { items } = this.props;
        return items && items[0] && items[0].isLoading;
    };

    handleSelectAllClick = async () => {
        if (this.itemsAreLoading()) {
            return;
        }
        const { isSelectAllChecked } = this.state;
        const newSelectedItems = isSelectAllChecked ? this.unselectAll() : this.selectAll();
        this.setState({ selectedItems: newSelectedItems, isSelectAllChecked: !isSelectAllChecked });
    };

    shouldSelectAndActionDisableItems = () => {
        const { folderToDeepScan, foldersPath } = this.state;
        let result = false;

        if (this.itemsAreLoading()) {
            return result;
        }

        // Check to see if the folder that was selected for include subfolders is in our current folder path
        foldersPath.forEach(folder => {
            if (folder.id === folderToDeepScan.id) {
                result = true;
            }
        });

        return result;
    };

    shouldDisableAllOtherButtons = () => {
        const { includeSubfolders } = this.state;
        return this.numOfSelectedItems() === 1 && includeSubfolders;
    };

    disableAllOtherItemButtons = itemToKeepId => {
        const { handleSelectAllTree, items } = this.props;

        if (this.itemsAreLoading()) {
            return;
        }

        items.forEach(item => {
            item.id === itemToKeepId ? (item.isDisabled = false) : (item.isDisabled = true);
        });
        this.setState({ allItemsEnabled: false });
        handleSelectAllTree(itemToKeepId);
    };

    enableAllItemButtons = () => {
        const { handleSelectAllTree, items } = this.props;
        items.forEach(item => {
            item.isDisabled = false;
        });
        this.setState({ allItemsEnabled: true });
        handleSelectAllTree(null);
    };

    handleIncludeSubfoldersToggle = () => {
        const { allItemsEnabled, includeSubfolders, selectedItems } = this.state;

        this.setState({ includeSubfolders: !includeSubfolders }, () => {
            if (this.shouldDisableAllOtherButtons()) {
                const selectedItem = Object.values(selectedItems)[0];
                this.setState({ folderToDeepScan: selectedItem }, () => {
                    if (this.shouldSelectAndActionDisableItems()) {
                        this.setState({ itemsAreSelectedAndActionDisabled: true });
                    } else {
                        this.disableAllOtherItemButtons(selectedItem.id);
                    }
                });
            } else if (!allItemsEnabled) {
                this.setState({ folderToDeepScan: {}, itemsAreSelectedAndActionDisabled: false });
                this.enableAllItemButtons();
            }
        });
    };

    areOtherItemsDisabled = enabledItemId => {
        const { items } = this.props;

        const result = items.every(item => {
            if (
                (item.id !== enabledItemId && !item.isDisabled) ||
                (item.id === enabledItemId && item.isDisabled) ||
                item.isLoading
            ) {
                return false;
            }
            return true;
        });
        return result;
    };

    foldersPresent = () => {
        const { items } = this.props;
        for (let i = 0; i < items.length; i += 1) {
            if (items[i].type === TYPE_FOLDER) {
                return true;
            }
        }
        return false;
    };

    numOfSelectedItems = () => {
        const { selectedItems } = this.state;
        return Object.keys(selectedItems).length;
    };

    noFoldersSelected = () => {
        const { selectedItems } = this.state;
        const result = Object.values(selectedItems).every(item => {
            if (item.type === TYPE_FOLDER) {
                return false;
            }
            return true;
        });
        return result;
    };

    includeSubfolderToggleDisabled = () => {
        const { itemsAreSelectedAndActionDisabled, includeSubfolders } = this.state;
        const selectedItemIsFolder = this.numOfSelectedItems() === 1 && !this.noFoldersSelected();
        const selectedItemIsNotFolder = this.numOfSelectedItems() === 1 && this.noFoldersSelected();

        return (
            this.itemsAreLoading() ||
            (!includeSubfolders &&
                !(selectedItemIsFolder && !this.foldersPresent()) &&
                ((!itemsAreSelectedAndActionDisabled && !this.foldersPresent()) ||
                    selectedItemIsNotFolder ||
                    this.numOfSelectedItems() > 1))
        );
    };

    isVerticalScrollBarPresent = () => {
        // We can assume the itemRowHeight is DEFAULT_ROW_HEIGHT if none is given as it is defined in ItemList.js
        // listHeight is required, but itemRowHeight is an optional prop
        const { listHeight, itemRowHeight, numTotalItems } = this.props;
        const currentItemRowHeight = itemRowHeight || DEFAULT_ROW_HEIGHT;
        const numItemsThatFitWithoutBar = listHeight / currentItemRowHeight;

        return numTotalItems > numItemsThatFitWithoutBar;
    };

    renderItemListEmptyState = () => {
        const { foldersPath, isInSearchMode } = this.state;
        const { isIncludeSubfoldersAllowed } = this.props;
        const isViewingSearchResults = isInSearchMode && foldersPath.length === 1;
        const isOnInitialModalPage = foldersPath.length === 1 && foldersPath[0].id === '0';

        return (
            <ContentExplorerEmptyState
                isIncludeSubfoldersAllowed={isIncludeSubfoldersAllowed}
                isOnInitialModalPage={isOnInitialModalPage}
                isSearch={isViewingSearchResults}
            />
        );
    };

    render() {
        const {
            actionButtonsProps,
            additionalColumns,
            isNoSelectionAllowed = false,
            breadcrumbProps,
            cancelButtonProps,
            chooseButtonProps,
            chooseButtonText,
            className,
            contentExplorerMode,
            customInput,
            headerActionsAccessory,
            onChooseItems,
            onMoveItem,
            onCopyItem,
            onCancelButtonClick,
            onCreateNewFolderButtonClick,
            onSelectedClick,
            showCreateNewFolderButton,
            isChooseButtonLoading,
            isCopyButtonLoading,
            isCreateNewFolderAllowed,
            isIncludeSubfoldersAllowed,
            isMoveButtonLoading,
            isResponsive = false,
            isSelectAllAllowed,
            items,
            numItemsPerPage,
            numTotalItems,
            onLoadMoreItems,
            itemIconRenderer,
            itemNameLinkRenderer,
            itemButtonRenderer,
            itemRowHeight,
            itemRowRenderer,
            listHeaderHeight,
            listHeaderRenderer,
            listWidth,
            listHeight,
            searchInputProps,
            ...rest
        } = this.props;
        const {
            isInSearchMode,
            foldersPath,
            selectedItems,
            isSelectAllChecked,
            includeSubfolders,
            itemsAreSelectedAndActionDisabled,
        } = this.state;
        const isViewingSearchResults = isInSearchMode && foldersPath.length === 1;
        const currentFolder = this.getCurrentFolder();
        const contentExplorerProps = omit(rest, [
            'initialFoldersPath',
            'onEnterFolder',
            'onSelectItem',
            'onSearchSubmit',
            'onExitSearch',
            'initialSelectedItems',
        ]);

        const selectedItemsIds = Object.keys(selectedItems);
        let areActionButtonsDisabled;
        // NOTE: it almost feels like this whole section should be inside the
        // ContentExplorerActionButtons instead. There's a lot of implicit knowledge
        // of what the action buttons are and what they should be doing.
        if (contentExplorerMode === ContentExplorerModes.MULTI_SELECT) {
            // NOTE: only expecting to have 1 (choose) button so as long as something
            // is selected and that item's isActionDisabled is false, we enable the action button
            areActionButtonsDisabled =
                (selectedItemsIds.length === 0 && !isNoSelectionAllowed) ||
                (selectedItemsIds.length === 1 && selectedItems[selectedItemsIds[0]].isActionDisabled);
        } else if (isViewingSearchResults || contentExplorerMode === ContentExplorerModes.SELECT_FILE) {
            // Buttons are only enabled when an item is selected
            // When viewing search results, there is no "current folder"
            // When selecting a file, the file can only selected from the list
            areActionButtonsDisabled =
                selectedItemsIds.length === 0 || selectedItems[selectedItemsIds[0]].isActionDisabled;
        } else {
            // Buttons are enabled using the selected item or the current folder if no item is selected
            areActionButtonsDisabled =
                selectedItemsIds.length > 0
                    ? selectedItems[selectedItemsIds[0]].isActionDisabled
                    : currentFolder.isActionDisabled;
        }

        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
            <div
                className={classNames('content-explorer', className, {
                    'bdl-ContentExplorer--responsive': isResponsive,
                })}
                data-testid="content-explorer"
                onClick={this.handleContentExplorerClick}
                ref={ref => {
                    this.domNode = ref;
                }}
                {...contentExplorerProps}
            >
                <ContentExplorerHeaderActions
                    breadcrumbProps={breadcrumbProps}
                    contentExplorerMode={contentExplorerMode}
                    customInput={customInput}
                    foldersPath={foldersPath}
                    isCreateNewFolderAllowed={isCreateNewFolderAllowed}
                    isIncludeSubfoldersAllowed={isIncludeSubfoldersAllowed}
                    numTotalItems={numTotalItems}
                    onCreateNewFolderButtonClick={onCreateNewFolderButtonClick}
                    onFoldersPathUpdated={this.handleFoldersPathUpdated}
                    onEnterFolder={this.enterFolder}
                    onExitSearch={this.handleExitSearch}
                    onSearchSubmit={this.handleSearchSubmit}
                    searchInputProps={searchInputProps}
                    showCreateNewFolderButton={showCreateNewFolderButton}
                >
                    {headerActionsAccessory}
                </ContentExplorerHeaderActions>
                {isSelectAllAllowed && isIncludeSubfoldersAllowed ? (
                    <ContentExplorerIncludeSubfolders
                        foldersPresent={this.foldersPresent()}
                        handleIncludeSubfoldersToggle={this.handleIncludeSubfoldersToggle}
                        handleSelectAllClick={this.handleSelectAllClick}
                        hideSelectAllCheckbox={includeSubfolders}
                        isSelectAllChecked={isSelectAllChecked}
                        isVerticalScrollBarPresent={this.isVerticalScrollBarPresent()}
                        noFoldersSelected={this.noFoldersSelected()}
                        numOfSelectedItems={this.numOfSelectedItems()}
                        toggleIsDisabled={this.includeSubfolderToggleDisabled()}
                    />
                ) : (
                    isSelectAllAllowed && (
                        <ContentExplorerSelectAll
                            numTotalItems={numTotalItems}
                            isSelectAllChecked={isSelectAllChecked}
                            handleSelectAllClick={this.handleSelectAllClick}
                        />
                    )
                )}
                <ItemList
                    additionalColumns={additionalColumns}
                    contentExplorerMode={contentExplorerMode}
                    headerHeight={listHeaderHeight}
                    headerRenderer={listHeaderRenderer}
                    height={listHeight}
                    isResponsive={isResponsive}
                    itemButtonRenderer={itemButtonRenderer}
                    itemIconRenderer={itemIconRenderer}
                    itemNameLinkRenderer={itemNameLinkRenderer}
                    items={includeSubfolders && !itemsAreSelectedAndActionDisabled ? this.getFoldersOnly() : items}
                    itemRowRenderer={itemRowRenderer}
                    noItemsRenderer={this.renderItemListEmptyState}
                    numItemsPerPage={numItemsPerPage}
                    numTotalItems={
                        includeSubfolders && !itemsAreSelectedAndActionDisabled
                            ? this.getFoldersOnly().length
                            : numTotalItems
                    }
                    onItemClick={this.handleItemClick}
                    onItemDoubleClick={this.handleItemDoubleClick}
                    onItemNameClick={this.handleItemNameClick}
                    onLoadMoreItems={onLoadMoreItems}
                    rowHeight={itemRowHeight}
                    selectedItems={selectedItems}
                    itemsAreSelectedAndActionDisabled={itemsAreSelectedAndActionDisabled}
                    width={listWidth}
                />
                <ContentExplorerActionButtons
                    actionButtonsProps={actionButtonsProps}
                    areButtonsDisabled={areActionButtonsDisabled}
                    cancelButtonProps={cancelButtonProps}
                    chooseButtonProps={chooseButtonProps}
                    chooseButtonText={chooseButtonText}
                    contentExplorerMode={contentExplorerMode}
                    currentFolder={currentFolder}
                    isChooseButtonLoading={isChooseButtonLoading}
                    isCopyButtonLoading={isCopyButtonLoading}
                    isMoveButtonLoading={isMoveButtonLoading}
                    isResponsive={isResponsive}
                    onCancelClick={onCancelButtonClick}
                    onChooseClick={onChooseItems}
                    onCopyClick={onCopyItem}
                    onSelectedClick={onSelectedClick}
                    onMoveClick={onMoveItem}
                    selectedItems={selectedItems}
                    isNoSelectionAllowed={isNoSelectionAllowed}
                />
            </div>
        );
    }
}

export default ContentExplorer;
