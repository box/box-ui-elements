import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';

import ContentExplorerSearch from './ContentExplorerSearch';
import ContentExplorerNewFolderButton from './ContentExplorerNewFolderButton';
import ContentExplorerBreadcrumbs from './ContentExplorerBreadcrumbs';
import ContentExplorerFolderTreeBreadcrumbs from './ContentExplorerFolderTreeBreadcrumbs';

import { BreadcrumbPropType, ContentExplorerModePropType, FoldersPathPropType } from '../prop-types';
import messages from '../messages';

const SEARCH_RESULTS_FOLDER_ID = 'search_results_id';

const isSearchResultsFolder = folder => folder && folder.id === SEARCH_RESULTS_FOLDER_ID;

class ContentExplorerHeaderActions extends Component {
    static propTypes = {
        breadcrumbProps: BreadcrumbPropType,
        children: PropTypes.node,
        contentExplorerMode: ContentExplorerModePropType.isRequired,
        customInput: PropTypes.func,
        foldersPath: FoldersPathPropType.isRequired,
        intl: PropTypes.any,
        onFoldersPathUpdated: PropTypes.func.isRequired,
        onEnterFolder: PropTypes.func.isRequired,
        onCreateNewFolderButtonClick: PropTypes.func,
        showCreateNewFolderButton: PropTypes.bool,
        isCreateNewFolderAllowed: PropTypes.bool,
        hasFolderTreeBreadcrumbs: PropTypes.bool,
        onSearchSubmit: PropTypes.func.isRequired,
        onExitSearch: PropTypes.func.isRequired,
        numTotalItems: PropTypes.number,
        searchInputProps: PropTypes.object,
    };

    static defaultProps = {
        showCreateNewFolderButton: true,
        isCreateNewFolderAllowed: true,
        searchInputProps: {},
    };

    constructor(props) {
        super(props);
        this.state = {
            searchInput: '',
        };
        this.foldersPathBeforeSearch = [];
        this.lastSubmittedSearchInput = '';
    }

    getCurrentFolder() {
        const { foldersPath } = this.props;
        return foldersPath[foldersPath.length - 1];
    }

    isInSearchMode() {
        const { foldersPath } = this.props;
        return foldersPath.some(isSearchResultsFolder);
    }

    isViewingSearchResults() {
        return isSearchResultsFolder(this.getCurrentFolder());
    }

    handleBreadcrumbClick = (folderPathIndex, event) => {
        const { foldersPath, onEnterFolder } = this.props;
        const clickedFolder = foldersPath[folderPathIndex];

        if (event) {
            event.preventDefault();
        }

        // Do nothing if the right-most breadcrumb (current folder) is clicked
        if (folderPathIndex === foldersPath.length - 1) {
            return;
        }

        // Show the search results for the last submitted input when clicking the "Search Results" breadcrumb
        if (isSearchResultsFolder(clickedFolder)) {
            this.submitSearch(this.lastSubmittedSearchInput);
            return;
        }

        onEnterFolder(clickedFolder);
    };

    handleBreadcrumbsUpButtonClick = () => {
        const { foldersPath } = this.props;
        const newFolderIndex = foldersPath.length - 2;

        if (this.isViewingSearchResults()) {
            this.exitSearch();
        } else if (newFolderIndex >= 0) {
            this.handleBreadcrumbClick(newFolderIndex);
        }
    };

    handleSearchInput = input => {
        this.setState({
            searchInput: input,
        });
    };

    handleClearSearchButtonClick = () => {
        this.exitSearch();
    };

    exitSearch() {
        const { onFoldersPathUpdated, onExitSearch } = this.props;

        // Clear the search input even if we aren't in search mode
        this.setState({ searchInput: '' });

        if (this.isInSearchMode()) {
            const foldersPathLength = this.foldersPathBeforeSearch.length;
            const folderBeforeSearch = foldersPathLength > 0 ? this.foldersPathBeforeSearch[foldersPathLength - 1] : {};
            onFoldersPathUpdated(this.foldersPathBeforeSearch);
            onExitSearch(folderBeforeSearch);
        }
    }

    handleSubmitSearch = () => {
        const { searchInput } = this.state;

        this.submitSearch(searchInput);
    };

    submitSearch(searchInput) {
        const { foldersPath, intl, onFoldersPathUpdated, onSearchSubmit } = this.props;

        if (searchInput) {
            // Only save folders path if we aren't already in search mode
            if (!this.isInSearchMode()) {
                this.foldersPathBeforeSearch = foldersPath;
            }

            this.lastSubmittedSearchInput = searchInput;
            onFoldersPathUpdated([
                {
                    id: SEARCH_RESULTS_FOLDER_ID,
                    name: intl.formatMessage(messages.searchResults),
                },
            ]);

            onSearchSubmit(searchInput);
        } else {
            this.exitSearch();
        }
    }

    render() {
        const {
            breadcrumbProps,
            children,
            contentExplorerMode,
            customInput: CustomInput,
            foldersPath,
            onCreateNewFolderButtonClick,
            showCreateNewFolderButton,
            isCreateNewFolderAllowed,
            hasFolderTreeBreadcrumbs,
            numTotalItems,
            searchInputProps,
        } = this.props;
        const { searchInput } = this.state;
        const isInSearchMode = this.isInSearchMode();
        const isBreadcrumbButtonDisabled = foldersPath.length <= 1 && !isInSearchMode;

        return (
            <div className="content-explorer-header-actions">
                <div className="content-explorer-search-new-folder-container">
                    {CustomInput ? (
                        <CustomInput />
                    ) : (
                        <ContentExplorerSearch
                            inputValue={searchInput}
                            onClearButtonClick={this.handleClearSearchButtonClick}
                            onInput={this.handleSearchInput}
                            onSubmit={this.handleSubmitSearch}
                            searchInputProps={searchInputProps}
                        />
                    )}
                    {showCreateNewFolderButton && (
                        <ContentExplorerNewFolderButton
                            contentExplorerMode={contentExplorerMode}
                            onClick={onCreateNewFolderButtonClick}
                            isDisabled={!isCreateNewFolderAllowed || isInSearchMode}
                            isCreateNewFolderAllowed={isCreateNewFolderAllowed}
                        />
                    )}
                    {children}
                </div>
                {hasFolderTreeBreadcrumbs ? (
                    <ContentExplorerFolderTreeBreadcrumbs
                        foldersPath={foldersPath}
                        isFolderTreeButtonHidden={isBreadcrumbButtonDisabled || this.isViewingSearchResults()}
                        numTotalItems={numTotalItems}
                        onBreadcrumbClick={this.handleBreadcrumbClick}
                    />
                ) : (
                    <ContentExplorerBreadcrumbs
                        breadcrumbProps={breadcrumbProps}
                        foldersPath={foldersPath}
                        isUpButtonDisabled={isBreadcrumbButtonDisabled}
                        onUpButtonClick={this.handleBreadcrumbsUpButtonClick}
                        onBreadcrumbClick={this.handleBreadcrumbClick}
                    />
                )}
            </div>
        );
    }
}

export { ContentExplorerHeaderActions as ContentExplorerHeaderActionsBase };
export default injectIntl(ContentExplorerHeaderActions);
