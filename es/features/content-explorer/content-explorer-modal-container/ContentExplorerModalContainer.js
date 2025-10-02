const _excluded = ["className", "modalTitle", "modalDescription", "onCreateFolderSubmit", "onCreateFolderInput", "isCreatingFolder", "createFolderError", "initialFoldersPath", "shouldNotUsePortal", "infoNoticeText"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { BreadcrumbPropType, ContentExplorerModePropType, FoldersPathPropType, ItemsPropType } from '../prop-types';
import ContentExplorerModal from '../content-explorer-modal';
import NewFolderModal from '../new-folder-modal';
class ContentExplorerModalContainer extends Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "handleEnterFolder", (enteredFolder, newFoldersPath) => {
      const {
        onEnterFolder
      } = this.props;
      this.setState({
        foldersPath: newFoldersPath
      });
      onEnterFolder(enteredFolder, newFoldersPath);
    });
    _defineProperty(this, "handleCreateNewFolderButtonClick", () => {
      const {
        onNewFolderModalShown
      } = this.props;
      this.setState({
        isNewFolderModalOpen: true
      }, () => onNewFolderModalShown && onNewFolderModalShown());
    });
    _defineProperty(this, "handleNewFolderModalClose", () => {
      const {
        onNewFolderModalClosed
      } = this.props;
      this.setState({
        isNewFolderModalOpen: false
      }, () => onNewFolderModalClosed && onNewFolderModalClosed());
    });
    this.state = {
      foldersPath: props.initialFoldersPath,
      isNewFolderModalOpen: false
    };
  }
  componentDidUpdate({
    initialFoldersPath: prevInitialFoldersPath
  }) {
    const {
      initialFoldersPath
    } = this.props;
    if (prevInitialFoldersPath !== initialFoldersPath) {
      // Close the new folder modal when the folders path has changed
      this.setState({
        foldersPath: initialFoldersPath,
        isNewFolderModalOpen: false
      });
    }
  }
  render() {
    const _this$props = this.props,
      {
        className,
        modalTitle,
        modalDescription,
        onCreateFolderSubmit,
        onCreateFolderInput,
        isCreatingFolder,
        createFolderError,
        initialFoldersPath,
        shouldNotUsePortal,
        infoNoticeText
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const {
      foldersPath,
      isNewFolderModalOpen
    } = this.state;
    const currentFolder = foldersPath[foldersPath.length - 1];
    return /*#__PURE__*/React.createElement("div", {
      className: classNames('content-explorer-modal-container', className)
    }, /*#__PURE__*/React.createElement(ContentExplorerModal, _extends({
      className: isNewFolderModalOpen ? 'hidden' : '',
      title: modalTitle,
      description: modalDescription,
      initialFoldersPath: initialFoldersPath,
      isOpen: true,
      onEnterFolder: this.handleEnterFolder,
      onCreateNewFolderButtonClick: this.handleCreateNewFolderButtonClick,
      shouldNotUsePortal: shouldNotUsePortal,
      infoNoticeText: infoNoticeText
    }, rest)), isNewFolderModalOpen && /*#__PURE__*/React.createElement(NewFolderModal, {
      isOpen: true,
      parentFolderName: currentFolder.name,
      onRequestClose: this.handleNewFolderModalClose,
      onCreateFolderSubmit: onCreateFolderSubmit,
      onCreateFolderInput: onCreateFolderInput,
      isCreatingFolder: isCreatingFolder,
      createFolderError: createFolderError,
      shouldNotUsePortal: shouldNotUsePortal
    }));
  }
}
_defineProperty(ContentExplorerModalContainer, "propTypes", {
  /**
   * Extra columns displayed in the folders table after folder name column
   * Each column has to be a Column element
   */
  additionalColumns: PropTypes.arrayOf(PropTypes.element),
  /**  Allow users to choose no selections in MULTI_SELECT mode, defaults to false */
  isNoSelectionAllowed: PropTypes.bool,
  /** Custom icon for the breadcrumb. Overrides the default icon */
  breadcrumbIcon: PropTypes.element,
  /** Breadcrumb component options */
  breadcrumbProps: BreadcrumbPropType,
  /** Adds class name. */
  className: PropTypes.string,
  /** Whether the user can see the breadcrumbs represented with the folder tree button */
  hasFolderTreeBreadcrumbs: PropTypes.bool,
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
  /** Called when the number of items selected text is clicked */
  onViewSelectedClick: PropTypes.func,
  /** Folder is in the process of being created. */
  isCreatingFolder: PropTypes.bool,
  /** Whether the user can see select all checkbox */
  isSelectAllAllowed: PropTypes.bool,
  /** Message that will be shown when there was an error creating the folder. */
  createFolderError: PropTypes.string,
  /** Configures the content explorer based on the user's intended action (ex. select file or move/copy) */
  contentExplorerMode: ContentExplorerModePropType.isRequired,
  /** Props for the include subfolders toggle */
  includeSubfoldersProps: PropTypes.object,
  /** Initial path of folders. The last folder in the array is the current folder. */
  initialFoldersPath: FoldersPathPropType.isRequired,
  /** Initial items that will show up as selected */
  initialSelectedItems: PropTypes.object,
  /** Items that will show up as selected */
  controlledSelectedItems: PropTypes.object,
  /**
   * Called when the current folder changes
   *
   * @param {Object} enteredFolder
   * @param {Array} newFoldersPath
   */
  onEnterFolder: PropTypes.func.isRequired,
  /** Called when the folders path is updated
   *
   * @param {Array} newFoldersPath
   */
  onFoldersPathUpdate: PropTypes.func,
  /** Called whenever the selected items list changes
   *
   * @param {Object} selectedItems
   */
  onSelectedItemsUpdate: PropTypes.func,
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
  /** Height of an item row */
  itemRowHeight: PropTypes.number,
  /** Used to render the row element for items on the list */
  itemRowRenderer: PropTypes.func,
  /** Height of the item list header, defaults to 0, which makes header not visible */
  listHeaderHeight: PropTypes.number,
  /** Used to render the header row on the item list */
  listHeaderRenderer: PropTypes.func,
  /** Whether the new folder button should be shown */
  showCreateNewFolderButton: PropTypes.bool,
  /** Whether the modals should be nested in a Portal or in a div */
  shouldNotUsePortal: PropTypes.bool,
  /** Props for the search input */
  searchInputProps: PropTypes.object,
  /** Custom text for the choose button */
  chooseButtonText: PropTypes.node,
  /** Text for the informational notice, defaults to empty string, which makes notice not visible */
  infoNoticeText: PropTypes.string,
  /** Used to render the no items state. Overrides the default no items state. */
  noItemsRenderer: PropTypes.func
});
_defineProperty(ContentExplorerModalContainer, "defaultProps", {
  onCreateFolderSubmit: () => {}
});
export default ContentExplorerModalContainer;
//# sourceMappingURL=ContentExplorerModalContainer.js.map