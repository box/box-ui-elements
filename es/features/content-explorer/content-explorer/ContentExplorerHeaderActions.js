function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
  constructor(props) {
    super(props);
    _defineProperty(this, "handleBreadcrumbClick", (folderPathIndex, event) => {
      const {
        foldersPath,
        onEnterFolder
      } = this.props;
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
    });
    _defineProperty(this, "handleBreadcrumbsUpButtonClick", () => {
      const {
        foldersPath
      } = this.props;
      const newFolderIndex = foldersPath.length - 2;
      if (this.isViewingSearchResults()) {
        this.exitSearch();
      } else if (newFolderIndex >= 0) {
        this.handleBreadcrumbClick(newFolderIndex);
      }
    });
    _defineProperty(this, "handleSearchInput", input => {
      this.setState({
        searchInput: input
      });
    });
    _defineProperty(this, "handleClearSearchButtonClick", () => {
      this.exitSearch();
    });
    _defineProperty(this, "handleSubmitSearch", () => {
      const {
        searchInput
      } = this.state;
      this.submitSearch(searchInput);
    });
    this.state = {
      searchInput: ''
    };
    this.foldersPathBeforeSearch = [];
    this.lastSubmittedSearchInput = '';
  }
  getCurrentFolder() {
    const {
      foldersPath
    } = this.props;
    return foldersPath[foldersPath.length - 1];
  }
  isInSearchMode() {
    const {
      foldersPath
    } = this.props;
    return foldersPath.some(isSearchResultsFolder);
  }
  isViewingSearchResults() {
    return isSearchResultsFolder(this.getCurrentFolder());
  }
  exitSearch() {
    const {
      onFoldersPathUpdated,
      onExitSearch
    } = this.props;

    // Clear the search input even if we aren't in search mode
    this.setState({
      searchInput: ''
    });
    if (this.isInSearchMode()) {
      const foldersPathLength = this.foldersPathBeforeSearch.length;
      const folderBeforeSearch = foldersPathLength > 0 ? this.foldersPathBeforeSearch[foldersPathLength - 1] : {};
      onFoldersPathUpdated(this.foldersPathBeforeSearch);
      onExitSearch(folderBeforeSearch);
    }
  }
  submitSearch(searchInput) {
    const {
      foldersPath,
      intl,
      onFoldersPathUpdated,
      onSearchSubmit
    } = this.props;
    if (searchInput) {
      // Only save folders path if we aren't already in search mode
      if (!this.isInSearchMode()) {
        this.foldersPathBeforeSearch = foldersPath;
      }
      this.lastSubmittedSearchInput = searchInput;
      onFoldersPathUpdated([{
        id: SEARCH_RESULTS_FOLDER_ID,
        name: intl.formatMessage(messages.searchResults)
      }]);
      onSearchSubmit(searchInput);
    } else {
      this.exitSearch();
    }
  }
  render() {
    const {
      breadcrumbIcon,
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
      searchInputProps
    } = this.props;
    const {
      searchInput
    } = this.state;
    const isInSearchMode = this.isInSearchMode();
    const isBreadcrumbButtonDisabled = foldersPath.length <= 1 && !isInSearchMode;
    return /*#__PURE__*/React.createElement("div", {
      className: "content-explorer-header-actions"
    }, /*#__PURE__*/React.createElement("div", {
      className: "content-explorer-search-new-folder-container"
    }, CustomInput ? /*#__PURE__*/React.createElement(CustomInput, null) : /*#__PURE__*/React.createElement(ContentExplorerSearch, {
      inputValue: searchInput,
      onClearButtonClick: this.handleClearSearchButtonClick,
      onInput: this.handleSearchInput,
      onSubmit: this.handleSubmitSearch,
      searchInputProps: searchInputProps
    }), showCreateNewFolderButton && /*#__PURE__*/React.createElement(ContentExplorerNewFolderButton, {
      contentExplorerMode: contentExplorerMode,
      onClick: onCreateNewFolderButtonClick,
      isDisabled: !isCreateNewFolderAllowed || isInSearchMode,
      isCreateNewFolderAllowed: isCreateNewFolderAllowed
    }), children), hasFolderTreeBreadcrumbs ? /*#__PURE__*/React.createElement(ContentExplorerFolderTreeBreadcrumbs, {
      foldersPath: foldersPath,
      isFolderTreeButtonHidden: isBreadcrumbButtonDisabled || this.isViewingSearchResults(),
      numTotalItems: numTotalItems,
      onBreadcrumbClick: this.handleBreadcrumbClick
    }) : /*#__PURE__*/React.createElement(ContentExplorerBreadcrumbs, {
      breadcrumbIcon: breadcrumbIcon,
      breadcrumbProps: breadcrumbProps,
      foldersPath: foldersPath,
      isUpButtonDisabled: isBreadcrumbButtonDisabled,
      onUpButtonClick: this.handleBreadcrumbsUpButtonClick,
      onBreadcrumbClick: this.handleBreadcrumbClick
    }));
  }
}
_defineProperty(ContentExplorerHeaderActions, "propTypes", {
  breadcrumbIcon: PropTypes.element,
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
  searchInputProps: PropTypes.object
});
_defineProperty(ContentExplorerHeaderActions, "defaultProps", {
  showCreateNewFolderButton: true,
  isCreateNewFolderAllowed: true,
  searchInputProps: {}
});
export { ContentExplorerHeaderActions as ContentExplorerHeaderActionsBase };
export default injectIntl(ContentExplorerHeaderActions);
//# sourceMappingURL=ContentExplorerHeaderActions.js.map