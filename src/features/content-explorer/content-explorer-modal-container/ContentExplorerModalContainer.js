import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';

import { BreadcrumbPropType, ContentExplorerModePropType, FoldersPathPropType, ItemsPropType } from '../prop-types';
import ContentExplorerModal from '../content-explorer-modal';
import NewFolderModal from '../new-folder-modal';

class ContentExplorerModalContainer extends Component {
    static propTypes = {
        /** Breadcrumb component options */
        breadcrumbProps: BreadcrumbPropType,
        /** Adds class name. */
        className: PropTypes.string,
        /** Any extra items in the header to the right of the search input (and new folder button) */
        headerActionsAccessory: PropTypes.node,
        /** Title shown in the ContentExplorerModal. */
        modalTitle: PropTypes.string,
        /** Description text shown in the ContentExplorerModal. */
        modalDescription: PropTypes.string,
        /** Called when the ContentExplorerModal is closed. */
        onRequestClose: PropTypes.func.isRequired,
        /**
         * Called when the folder creation is submitted.
         *
         * @param {string} folderName
         */
        onCreateFolderSubmit: PropTypes.func,
        /**
         * Called with the latest folder name input.
         *
         * @param {string} folderName
         */
        onCreateFolderInput: PropTypes.func,
        /** Called when the NewFolderModal is shown. */
        onNewFolderModalShown: PropTypes.func,
        /** Called when the NewFolderModal is closed. */
        onNewFolderModalClosed: PropTypes.func,
        /** Called when selected button is clicked */
        onSelectedClick: PropTypes.func,
        /**
         * Called when an item is selected
         *
         * @param {Object} selectedItem
         * @param {number} selectedItemIndex
         */
        onSelectItem: PropTypes.func,
        /** Folder is in the process of being created. */
        isCreatingFolder: PropTypes.bool,
        /** Whether the user can see select all checkbox */
        isSelectAllAllowed: PropTypes.bool,
        /** Message that will be shown when there was an error creating the folder. */
        createFolderError: PropTypes.string,
        /** Configures the content explorer based on the user's intended action (ex. select file or move/copy) */
        contentExplorerMode: ContentExplorerModePropType.isRequired,
        /** Initial path of folders. The last folder in the array is the current folder. */
        initialFoldersPath: FoldersPathPropType.isRequired,
        /** Initial items that will show up as selected */
        initialSelectedItems: PropTypes.object,
        /**
         * Called when the current folder changes
         *
         * @param {Object} enteredFolder
         * @param {Array} newFoldersPath
         */
        onEnterFolder: PropTypes.func.isRequired,
        /**
         * Called when items are chosen.
         *
         * @param {Object[]} chosenItems In non-multi select mode, the chosenItems will be a 1 element array contain the one chosen item
         */
        onChooseItems: PropTypes.func,
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
        /** Whether the user has permission to create a new folder */
        isCreateNewFolderAllowed: PropTypes.bool,
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
        /** Whether the new folder button should be shown */
        showCreateNewFolderButton: PropTypes.bool,
        /** Props for the search input */
        searchInputProps: PropTypes.object,
        /** Custom text for the choose button */
        chooseButtonText: PropTypes.node,
        /** Table row height */
        rowHeight: PropTypes.number,
        /**
         * Extra columns displayed in the folders table after folder name column
         * Each column has to be a Column element
         */
        additionalColumns: PropTypes.arrayOf(PropTypes.element),
    };

    static defaultProps = {
        onCreateFolderSubmit: () => {},
    };

    constructor(props) {
        super(props);
        this.state = {
            foldersPath: props.initialFoldersPath,
            isNewFolderModalOpen: false,
        };
    }

    componentDidUpdate({ initialFoldersPath: prevInitialFoldersPath }) {
        const { initialFoldersPath } = this.props;

        if (prevInitialFoldersPath !== initialFoldersPath) {
            // Close the new folder modal when the folders path has changed
            this.setState({
                foldersPath: initialFoldersPath,
                isNewFolderModalOpen: false,
            });
        }
    }

    handleEnterFolder = (enteredFolder, newFoldersPath) => {
        const { onEnterFolder } = this.props;

        this.setState({ foldersPath: newFoldersPath });
        onEnterFolder(enteredFolder, newFoldersPath);
    };

    handleCreateNewFolderButtonClick = () => {
        const { onNewFolderModalShown } = this.props;

        this.setState({ isNewFolderModalOpen: true }, () => onNewFolderModalShown && onNewFolderModalShown());
    };

    handleNewFolderModalClose = () => {
        const { onNewFolderModalClosed } = this.props;

        this.setState({ isNewFolderModalOpen: false }, () => onNewFolderModalClosed && onNewFolderModalClosed());
    };

    render() {
        const {
            className,
            modalTitle,
            modalDescription,
            onCreateFolderSubmit,
            onCreateFolderInput,
            isCreatingFolder,
            createFolderError,
            initialFoldersPath,
            ...rest
        } = this.props;
        const { foldersPath, isNewFolderModalOpen } = this.state;
        const currentFolder = foldersPath[foldersPath.length - 1];

        return (
            <div className={classNames('content-explorer-modal-container', className)}>
                <ContentExplorerModal
                    className={isNewFolderModalOpen ? 'hidden' : ''}
                    title={modalTitle}
                    description={modalDescription}
                    initialFoldersPath={initialFoldersPath}
                    isOpen
                    onEnterFolder={this.handleEnterFolder}
                    onCreateNewFolderButtonClick={this.handleCreateNewFolderButtonClick}
                    {...rest}
                />
                {isNewFolderModalOpen && (
                    <NewFolderModal
                        isOpen
                        parentFolderName={currentFolder.name}
                        onRequestClose={this.handleNewFolderModalClose}
                        onCreateFolderSubmit={onCreateFolderSubmit}
                        onCreateFolderInput={onCreateFolderInput}
                        isCreatingFolder={isCreatingFolder}
                        createFolderError={createFolderError}
                    />
                )}
            </div>
        );
    }
}

export default ContentExplorerModalContainer;
