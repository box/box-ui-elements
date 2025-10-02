function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import isEqual from 'lodash/isEqual';
import noop from 'lodash/noop';
import throttle from 'lodash/throttle';
import uniqueid from 'lodash/uniqueId';
import CreateFolderDialog from '../common/create-folder-dialog';
import UploadDialog from '../common/upload-dialog';
import Header from '../common/header';
import Pagination from '../common/pagination';
import SubHeader from '../common/sub-header/SubHeader';
import makeResponsive from '../common/makeResponsive';
import openUrlInsideIframe from '../../utils/iframe';
import Internationalize from '../common/Internationalize';
import ThemingStyles from '../common/theming';
import API from '../../api';
import MetadataQueryAPIHelperV2 from './MetadataQueryAPIHelper';
import MetadataQueryAPIHelper from '../../features/metadata-based-view/MetadataQueryAPIHelper';
import MetadataSidePanel from './MetadataSidePanel';
import Footer from './Footer';
import PreviewDialog from '../common/preview-dialog/PreviewDialog';
import ShareDialog from './ShareDialog';
import RenameDialog from './RenameDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import Content from './Content';
import { isThumbnailAvailable } from '../common/utils';
import { isFocusableElement, isInputElement, focus } from '../../utils/dom';
import { FILE_SHARED_LINK_FIELDS_TO_FETCH } from '../../utils/fields';
import { CONTENT_EXPLORER_FOLDER_FIELDS_TO_FETCH } from './constants';
import LocalStore from '../../utils/LocalStore';
import { withFeatureConsumer, withFeatureProvider, isFeatureEnabled } from '../common/feature-checking';
import { DEFAULT_HOSTNAME_UPLOAD, DEFAULT_HOSTNAME_API, DEFAULT_HOSTNAME_APP, DEFAULT_HOSTNAME_STATIC, DEFAULT_SEARCH_DEBOUNCE, SORT_ASC, FIELD_ITEM_NAME, FIELD_NAME, FIELD_PERMISSIONS_CAN_SHARE, FIELD_SHARED_LINK, DEFAULT_ROOT, VIEW_SEARCH, VIEW_FOLDER, VIEW_ERROR, VIEW_RECENTS, VIEW_METADATA, VIEW_MODE_LIST, TYPE_FILE, TYPE_WEBLINK, TYPE_FOLDER, CLIENT_NAME_CONTENT_EXPLORER, CLIENT_VERSION, DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, DEFAULT_VIEW_FILES, DEFAULT_VIEW_RECENTS, DEFAULT_VIEW_METADATA, ERROR_CODE_ITEM_NAME_INVALID, ERROR_CODE_ITEM_NAME_TOO_LONG, TYPED_ID_FOLDER_PREFIX, VIEW_MODE_GRID } from '../../constants';
import '../common/fonts.scss';
import '../common/base.scss';
import '../common/modal.scss';
import './ContentExplorer.scss';
import { withBlueprintModernization } from '../common/withBlueprintModernization';
import Providers from '../common/Providers';
const GRID_VIEW_MAX_COLUMNS = 7;
const GRID_VIEW_MIN_COLUMNS = 1;
const localStoreViewMode = 'bce.defaultViewMode';
class ContentExplorer extends Component {
  /**
   * [constructor]
   *
   * @private
   * @return {ContentExplorer}
   */
  constructor(props) {
    super(props);
    _defineProperty(this, "firstLoad", true);
    // Keeps track of very 1st load
    _defineProperty(this, "store", new LocalStore());
    /**
     * Metadata queries success callback
     *
     * @private
     * @param {Object} metadataQueryCollection - Metadata query response collection
     * @param {Object} metadataTemplate - Metadata template object
     * @return {void}
     */
    _defineProperty(this, "showMetadataQueryResultsSuccessCallback", (metadataQueryCollection, metadataTemplate) => {
      const {
        nextMarker
      } = metadataQueryCollection;
      const {
        metadataQuery,
        features
      } = this.props;
      const {
        currentCollection,
        currentPageNumber,
        markers
      } = this.state;
      const cloneMarkers = [...markers];
      if (nextMarker) {
        cloneMarkers[currentPageNumber + 1] = nextMarker;
      }
      const nextState = {
        currentCollection: _objectSpread(_objectSpread(_objectSpread({}, currentCollection), metadataQueryCollection), {}, {
          percentLoaded: 100
        }),
        markers: cloneMarkers,
        metadataTemplate
      };
      this.validateSelectedItemIds(metadataQueryCollection.items || []);

      // if v2, fetch folder name and add to state
      if (metadataQuery?.ancestor_folder_id && isFeatureEnabled(features, 'contentExplorer.metadataViewV2')) {
        this.api.getFolderAPI().getFolderFields(metadataQuery.ancestor_folder_id, ({
          name
        }) => {
          this.setState(_objectSpread(_objectSpread({}, nextState), {}, {
            rootName: name || ''
          }));
        }, this.errorCallback, {
          fields: [FIELD_NAME]
        });
      } else {
        // No folder name to fetch, update state immediately with just metadata
        this.setState(nextState);
      }
    });
    /**
     * Update selected items' metadata instances based on original and new field values in the metadata instance form
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "updateMetadataV2", async (items, operations, templateOldFields, templateNewFields, successCallback, errorCallback) => {
      if (items.length === 1) {
        await this.metadataQueryAPIHelper.updateMetadataWithOperations(items[0], operations, successCallback, errorCallback);
      } else {
        await this.metadataQueryAPIHelper.bulkUpdateMetadata(items, templateOldFields, templateNewFields, successCallback, errorCallback);
      }
    });
    /**
     * Network error callback
     *
     * @private
     * @param {Error} error error object
     * @return {void}
     */
    _defineProperty(this, "errorCallback", error => {
      this.setState({
        view: VIEW_ERROR
      });
      /* eslint-disable no-console */
      console.error(error);
      /* eslint-enable no-console */
    });
    /**
     * Refreshing the item collection depending upon the view.
     * Navigation event is prevented.
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "refreshCollection", () => {
      const {
        currentCollection: {
          id
        },
        view,
        searchQuery
      } = this.state;
      if (view === VIEW_FOLDER && id) {
        this.fetchFolder(id, false);
      } else if (view === VIEW_RECENTS) {
        this.showRecents(false);
      } else if (view === VIEW_SEARCH && searchQuery) {
        this.search(searchQuery);
      } else if (view === VIEW_METADATA) {
        this.showMetadataQueryResults();
      } else {
        throw new Error('Cannot refresh incompatible view!');
      }
    });
    /**
     * Fetches a folder, defaults to fetching root folder
     *
     * @private
     * @param {string|void} [id] folder id
     * @param {Boolean|void} [triggerNavigationEvent] To trigger navigate event
     * @return {void}
     */
    _defineProperty(this, "fetchFolder", (id, triggerNavigationEvent = true) => {
      const {
        rootFolderId
      } = this.props;
      const {
        currentCollection: {
          id: currentId
        },
        currentOffset,
        currentPageSize: limit,
        searchQuery = '',
        sortBy,
        sortDirection
      } = this.state;
      const folderId = typeof id === 'string' ? id : rootFolderId;
      const hasFolderChanged = currentId && currentId !== folderId;
      const hasSearchQuery = !!searchQuery.trim().length;
      const offset = hasFolderChanged || hasSearchQuery ? 0 : currentOffset; // Reset offset on folder or mode change

      // If we are navigating around, aka not first load
      // then reset the focus to the root so that after
      // the collection loads the activeElement is not the
      // button that was clicked to fetch the folder
      if (!this.firstLoad) {
        this.rootElement.focus();
      }

      // Reset search state, the view and show busy indicator
      this.setState({
        searchQuery: '',
        view: VIEW_FOLDER,
        currentCollection: this.currentUnloadedCollection(),
        currentOffset: offset
      });

      // Fetch the folder using folder API
      this.api.getFolderAPI().getFolder(folderId, limit, offset, sortBy, sortDirection, collection => {
        this.fetchFolderSuccessCallback(collection, triggerNavigationEvent);
      }, this.errorCallback, {
        fields: CONTENT_EXPLORER_FOLDER_FIELDS_TO_FETCH,
        forceFetch: true
      });
    });
    /**
     * Action performed when clicking on an item
     *
     * @private
     * @param {Object|string} item - the clicked box item
     * @return {void}
     */
    _defineProperty(this, "onItemClick", item => {
      // If the id was passed in, just use that
      if (typeof item === 'string') {
        this.fetchFolder(item);
        return;
      }
      const {
        id,
        type
      } = item;
      const {
        isTouch
      } = this.props;
      if (type === TYPE_FOLDER) {
        this.fetchFolder(id);
        return;
      }
      if (isTouch) {
        return;
      }
      this.preview(item);
    });
    /**
     * Search success callback
     *
     * @private
     * @param {Object} collection item collection object
     * @return {void}
     */
    _defineProperty(this, "searchSuccessCallback", collection => {
      const {
        selected
      } = this.state;

      // Close any open modals
      this.closeModals();
      this.updateCollection(collection, selected);
    });
    /**
     * Debounced searching
     *
     * @private
     * @param {string} id folder id
     * @param {string} query search string
     * @return {void}
     */
    _defineProperty(this, "debouncedSearch", debounce((id, query) => {
      const {
        currentOffset,
        currentPageSize
      } = this.state;
      this.api.getSearchAPI().search(id, query, currentPageSize, currentOffset, this.searchSuccessCallback, this.errorCallback, {
        fields: CONTENT_EXPLORER_FOLDER_FIELDS_TO_FETCH,
        forceFetch: true
      });
    }, DEFAULT_SEARCH_DEBOUNCE));
    /**
     * Searches
     *
     * @private
     * @param {string} query search string
     * @return {void}
     */
    _defineProperty(this, "search", query => {
      const {
        rootFolderId
      } = this.props;
      const {
        currentCollection: {
          id
        },
        currentOffset,
        searchQuery
      } = this.state;
      const folderId = typeof id === 'string' ? id : rootFolderId;
      const trimmedQuery = query.trim();
      if (!query) {
        // Cancel the debounce so we don't search on a previous query
        this.debouncedSearch.cancel();

        // Query was cleared out, load the prior folder
        // The prior folder is always the parent folder for search
        this.setState({
          currentOffset: 0
        }, () => {
          this.fetchFolder(folderId, false);
        });
        return;
      }
      if (!trimmedQuery) {
        // Query now only has bunch of spaces
        // do nothing and but update prior state
        this.setState({
          searchQuery: query
        });
        return;
      }
      this.setState({
        currentCollection: this.currentUnloadedCollection(),
        currentOffset: trimmedQuery === searchQuery ? currentOffset : 0,
        searchQuery: query,
        selected: undefined,
        view: VIEW_SEARCH
      });
      this.debouncedSearch(folderId, query);
    });
    /**
     * Uploads
     *
     * @private
     * @param {File} file dom file object
     * @return {void}
     */
    _defineProperty(this, "upload", () => {
      const {
        currentCollection: {
          id,
          permissions
        }
      } = this.state;
      const {
        canUpload
      } = this.props;
      if (!canUpload || !id || !permissions) {
        return;
      }
      const {
        can_upload
      } = permissions;
      if (!can_upload) {
        return;
      }
      this.setState({
        isUploadModalOpen: true
      });
    });
    /**
     * Upload success handler
     *
     * @private
     * @param {File} file dom file object
     * @return {void}
     */
    _defineProperty(this, "uploadSuccessHandler", () => {
      const {
        currentCollection: {
          id
        }
      } = this.state;
      this.fetchFolder(id, false);
    });
    /**
     * Changes the share access of an item
     *
     * @private
     * @param {string} access share access
     * @return {void}
     */
    _defineProperty(this, "changeShareAccess", access => {
      const {
        selected
      } = this.state;
      const {
        canSetShareAccess
      } = this.props;
      if (!selected || !canSetShareAccess) {
        return;
      }
      const {
        permissions,
        type
      } = selected;
      if (!permissions || !type) {
        return;
      }
      const {
        can_set_share_access
      } = permissions;
      if (!can_set_share_access) {
        return;
      }
      this.setState({
        isLoading: true
      });
      this.api.getAPI(type).share(selected, access, updatedItem => {
        this.setState({
          isLoading: false
        });
        this.select(updatedItem);
      });
    });
    /**
     * Changes the sort by and sort direction
     *
     * @private
     * @param {string} sortBy - field to sort by
     * @param {string} sortDirection - sort direction
     * @return {void}
     */
    _defineProperty(this, "sort", (sortBy, sortDirection) => {
      const {
        currentCollection: {
          id
        },
        view
      } = this.state;
      if (id || view === VIEW_METADATA) {
        this.setState({
          sortBy,
          sortDirection
        }, this.refreshCollection);
      }
    });
    /**
     * Validates selectedItemIds to ensure all selected IDs exist in current items
     * This should be called whenever currentCollection changes
     *
     * @private
     * @param {BoxItem[]} items - current items in the collection
     * @return {void}
     */
    _defineProperty(this, "validateSelectedItemIds", items => {
      const {
        selectedItemIds
      } = this.state;
      if (selectedItemIds === 'all' || selectedItemIds.size === 0) {
        // If all/none items are selected, no need to change anything
        return;
      }
      const validSelectedIds = new Set();
      items.forEach(item => {
        if (selectedItemIds.has(item.id)) {
          validSelectedIds.add(item.id);
        }
      });
      if (!isEqual(validSelectedIds, selectedItemIds)) {
        this.setState({
          selectedItemIds: validSelectedIds
        });
      }
    });
    /**
     * Attempts to generate a thumbnail for the given item and assigns the
     * item its thumbnail url if successful
     *
     * @param {BoxItem} item - item to generate thumbnail for
     * @return {Promise<void>}
     */
    _defineProperty(this, "attemptThumbnailGeneration", async item => {
      const entries = getProp(item, 'representations.entries');
      const representation = getProp(entries, '[0]');
      if (representation) {
        const updatedRepresentation = await this.api.getFileAPI(false).generateRepresentation(representation);
        if (updatedRepresentation !== representation) {
          this.updateItemInCollection(_objectSpread(_objectSpread({}, cloneDeep(item)), {}, {
            representations: {
              entries: [updatedRepresentation, ...entries.slice(1)]
            }
          }));
        }
      }
    });
    /**
     * Update item in this.state.currentCollection
     *
     * @param {BoxItem} newItem - item with updated properties
     * @return {void}
     */
    _defineProperty(this, "updateItemInCollection", newItem => {
      const {
        currentCollection
      } = this.state;
      const {
        items = []
      } = currentCollection;
      const newCollection = _objectSpread({}, currentCollection);
      newCollection.items = items.map(item => item.id === newItem.id ? newItem : item);
      this.validateSelectedItemIds(newCollection.items);
      this.setState({
        currentCollection: newCollection
      });
    });
    /**
     * Selects or unselects an item
     *
     * @private
     * @param {Object} item - file or folder object
     * @param {Function|void} [onSelect] - optional on select callback
     * @return {void}
     */
    _defineProperty(this, "select", (item, callback = noop) => {
      const {
        selected,
        currentCollection
      } = this.state;
      const {
        items = []
      } = currentCollection;
      const {
        onSelect
      } = this.props;
      if (item === selected) {
        callback(item);
        return;
      }
      const selectedItem = _objectSpread(_objectSpread({}, item), {}, {
        selected: true
      });
      this.updateCollection(currentCollection, selectedItem, () => {
        onSelect(cloneDeep([selectedItem]));
        callback(selectedItem);
      });
      const focusedRow = items.findIndex(i => i.id === item.id);
      this.setState({
        focusedRow
      });
    });
    /**
     * Selects the clicked file and then previews it
     * or opens it, if it was a web link
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    _defineProperty(this, "preview", item => {
      const {
        type,
        url
      } = item;
      if (type === TYPE_WEBLINK) {
        window.open(url);
        return;
      }
      this.select(item, this.previewCallback);
    });
    /**
     * Previews a file
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    _defineProperty(this, "previewCallback", () => {
      const {
        selected
      } = this.state;
      const {
        canPreview
      } = this.props;
      if (!selected || !canPreview) {
        return;
      }
      const {
        permissions
      } = selected;
      if (!permissions) {
        return;
      }
      const {
        can_preview
      } = permissions;
      if (!can_preview) {
        return;
      }
      this.setState({
        isPreviewModalOpen: true
      });
    });
    /**
     * Selects the clicked file and then downloads it
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    _defineProperty(this, "download", item => {
      this.select(item, this.downloadCallback);
    });
    /**
     * Downloads a file
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "downloadCallback", () => {
      const {
        selected
      } = this.state;
      const {
        canDownload,
        onDownload
      } = this.props;
      if (!selected || !canDownload) {
        return;
      }
      const {
        id,
        permissions
      } = selected;
      if (!id || !permissions) {
        return;
      }
      const {
        can_download
      } = permissions;
      if (!can_download) {
        return;
      }
      const openUrl = url => {
        openUrlInsideIframe(url);
        onDownload(cloneDeep([selected]));
      };
      const {
        type
      } = selected;
      if (type === TYPE_FILE) {
        this.api.getFileAPI().getDownloadUrl(id, selected, openUrl, noop);
      }
    });
    /**
     * Selects the clicked file and then deletes it
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    _defineProperty(this, "delete", item => {
      this.select(item, this.deleteCallback);
    });
    /**
     * Deletes a file
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "deleteCallback", () => {
      const {
        selected,
        isDeleteModalOpen
      } = this.state;
      const {
        canDelete,
        onDelete
      } = this.props;
      if (!selected || !canDelete) {
        return;
      }
      const {
        id,
        permissions,
        parent,
        type
      } = selected;
      if (!id || !permissions || !parent || !type) {
        return;
      }
      const {
        id: parentId
      } = parent;
      const {
        can_delete
      } = permissions;
      if (!can_delete || !parentId) {
        return;
      }
      if (!isDeleteModalOpen) {
        this.setState({
          isDeleteModalOpen: true
        });
        return;
      }
      this.setState({
        isLoading: true
      });
      this.api.getAPI(type).deleteItem(selected, () => {
        onDelete(cloneDeep([selected]));
        this.refreshCollection();
      }, () => {
        this.refreshCollection();
      });
    });
    /**
     * Selects the clicked file and then renames it
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    _defineProperty(this, "rename", item => {
      this.select(item, this.renameCallback);
    });
    /**
     * Callback for renaming an item
     *
     * @private
     * @param {string} value new item name
     * @return {void}
     */
    _defineProperty(this, "renameCallback", (nameWithoutExt, extension) => {
      const {
        selected,
        isRenameModalOpen
      } = this.state;
      const {
        canRename,
        onRename
      } = this.props;
      if (!selected || !canRename) {
        return;
      }
      const {
        id,
        permissions,
        type
      } = selected;
      if (!id || !permissions || !type) {
        return;
      }
      const {
        can_rename
      } = permissions;
      if (!can_rename) {
        return;
      }
      if (!isRenameModalOpen || !nameWithoutExt) {
        this.setState({
          isRenameModalOpen: true,
          errorCode: ''
        });
        return;
      }
      const name = `${nameWithoutExt}${extension}`;
      if (!nameWithoutExt.trim()) {
        this.setState({
          errorCode: ERROR_CODE_ITEM_NAME_INVALID,
          isLoading: false
        });
        return;
      }
      this.setState({
        isLoading: true
      });
      this.api.getAPI(type).rename(selected, name.trim(), updatedItem => {
        this.setState({
          isRenameModalOpen: false
        });
        this.refreshCollection();
        this.select(updatedItem);
        onRename(cloneDeep(selected));
      }, ({
        code
      }) => {
        this.setState({
          errorCode: code,
          isLoading: false
        });
      });
    });
    /**
     * Creates a new folder
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "createFolder", () => {
      this.throttledCreateFolderCallback();
    });
    /**
     * New folder callback
     *
     * @private
     * @param {string} name - folder name
     * @return {void}
     */
    _defineProperty(this, "createFolderCallback", name => {
      const {
        isCreateFolderModalOpen,
        currentCollection
      } = this.state;
      const {
        canCreateNewFolder,
        onCreate
      } = this.props;
      if (!canCreateNewFolder) {
        return;
      }
      const {
        id,
        permissions
      } = currentCollection;
      if (!id || !permissions) {
        return;
      }
      const {
        can_upload
      } = permissions;
      if (!can_upload) {
        return;
      }
      if (!isCreateFolderModalOpen || !name) {
        this.setState({
          isCreateFolderModalOpen: true,
          errorCode: ''
        });
        return;
      }
      if (!name.trim()) {
        this.setState({
          errorCode: ERROR_CODE_ITEM_NAME_INVALID,
          isLoading: false
        });
        return;
      }
      if (name.length > 255) {
        this.setState({
          errorCode: ERROR_CODE_ITEM_NAME_TOO_LONG,
          isLoading: false
        });
        return;
      }
      this.setState({
        isLoading: true
      });
      this.api.getFolderAPI().create(id, name.trim(), item => {
        this.refreshCollection();
        this.select(item);
        onCreate(cloneDeep(item));
      }, ({
        code
      }) => {
        this.setState({
          errorCode: code,
          isLoading: false
        });
      });
    });
    /**
     * Throttled version of createFolderCallback to prevent errors from rapid clicking.
     *
     * @private
     * @param {string} [name] - folder name
     * @return {void}
     */
    _defineProperty(this, "throttledCreateFolderCallback", throttle(this.createFolderCallback, 500, {
      trailing: false
    }));
    /**
     * Selects the clicked file and then shares it
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    _defineProperty(this, "share", item => {
      this.select(item, this.shareCallback);
    });
    /**
     * Fetch the shared link info
     * @param {BoxItem} item - The item (folder, file, weblink)
     * @returns {void}
     */
    _defineProperty(this, "fetchSharedLinkInfo", item => {
      const {
        id,
        type
      } = item;
      switch (type) {
        case TYPE_FOLDER:
          this.api.getFolderAPI().getFolderFields(id, this.handleSharedLinkSuccess, noop, {
            fields: FILE_SHARED_LINK_FIELDS_TO_FETCH
          });
          break;
        case TYPE_FILE:
          this.api.getFileAPI().getFile(id, this.handleSharedLinkSuccess, noop, {
            fields: FILE_SHARED_LINK_FIELDS_TO_FETCH
          });
          break;
        case TYPE_WEBLINK:
          this.api.getWebLinkAPI().getWeblink(id, this.handleSharedLinkSuccess, noop, {
            fields: FILE_SHARED_LINK_FIELDS_TO_FETCH
          });
          break;
        default:
          throw new Error('Unknown Type');
      }
    });
    /**
     * Handles the shared link info by either creating a share link using enterprise defaults if
     * it does not already exist, otherwise update the item in the state currentCollection.
     *
     * @param {Object} item file or folder
     * @returns {void}
     */
    _defineProperty(this, "handleSharedLinkSuccess", async item => {
      const {
        currentCollection
      } = this.state;
      let updatedItem = item;

      // if there is no shared link, create one with enterprise default access
      if (!item[FIELD_SHARED_LINK] && getProp(item, FIELD_PERMISSIONS_CAN_SHARE, false)) {
        await this.api.getAPI(item.type).share(item, undefined, sharedItem => {
          updatedItem = sharedItem;
        });
      }
      this.updateCollection(currentCollection, updatedItem, () => this.setState({
        isShareModalOpen: true
      }));
    });
    /**
     * Callback for sharing an item
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "shareCallback", () => {
      const {
        selected
      } = this.state;
      const {
        canShare
      } = this.props;
      if (!selected || !canShare) {
        return;
      }
      const {
        permissions,
        type
      } = selected;
      if (!permissions || !type) {
        return;
      }
      const {
        can_share
      } = permissions;
      if (!can_share) {
        return;
      }
      this.fetchSharedLinkInfo(selected);
    });
    /**
     * Closes the modal dialogs that may be open
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "closeModals", () => {
      const {
        focusedRow
      } = this.state;
      this.setState({
        isLoading: false,
        isDeleteModalOpen: false,
        isRenameModalOpen: false,
        isCreateFolderModalOpen: false,
        isShareModalOpen: false,
        isUploadModalOpen: false,
        isPreviewModalOpen: false
      });
      const {
        selected,
        currentCollection: {
          items = []
        }
      } = this.state;
      if (selected && items.length > 0) {
        focus(this.rootElement, `.bce-item-row-${focusedRow}`);
      }
    });
    /**
     * Keyboard events
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "onKeyDown", event => {
      if (isInputElement(event.target)) {
        return;
      }
      const {
        rootFolderId
      } = this.props;
      const key = event.key.toLowerCase();
      switch (key) {
        case '/':
          focus(this.rootElement, '.be-search input[type="search"]', false);
          event.preventDefault();
          break;
        case 'arrowdown':
          if (this.getViewMode() === VIEW_MODE_GRID) {
            if (document.activeElement && !document.activeElement.closest('.be-ItemGrid')) {
              focus(this.rootElement, '.be-ItemGrid-item', false);
              event.preventDefault();
            }
          } else if (document.activeElement && !document.activeElement.closest('.be-ItemList')) {
            focus(this.rootElement, '.be-ItemList-item', false);
            this.setState({
              focusedRow: 0
            });
            event.preventDefault();
          }
          break;
        case 'g':
          break;
        case 'b':
          if (this.globalModifier) {
            focus(this.rootElement, '.be-breadcrumb button', false);
            event.preventDefault();
          }
          break;
        case 'f':
          if (this.globalModifier) {
            this.fetchFolder(rootFolderId);
            event.preventDefault();
          }
          break;
        case 'u':
          if (this.globalModifier) {
            this.upload();
            event.preventDefault();
          }
          break;
        case 'r':
          if (this.globalModifier) {
            this.showRecents();
            event.preventDefault();
          }
          break;
        case 'n':
          if (this.globalModifier) {
            this.createFolder();
            event.preventDefault();
          }
          break;
        default:
          this.globalModifier = false;
          return;
      }
      this.globalModifier = key === 'g';
    });
    /**
     * Handle pagination changes for offset based pagination
     *
     * @param {number} newOffset - the new page offset value
     */
    _defineProperty(this, "paginate", newOffset => {
      this.setState({
        currentOffset: newOffset
      }, this.refreshCollection);
    });
    /**
     * Handle pagination changes for marker based pagination
     * @param {number} newOffset - the new page offset value
     */
    _defineProperty(this, "markerBasedPaginate", newOffset => {
      const {
        currentPageNumber
      } = this.state;
      this.setState({
        currentPageNumber: currentPageNumber + newOffset // newOffset could be negative
      }, this.refreshCollection);
    });
    /**
     * Get the current viewMode, checking local store if applicable
     *
     * @return {ViewMode}
     */
    _defineProperty(this, "getViewMode", () => this.store.getItem(localStoreViewMode) || VIEW_MODE_LIST);
    /**
     * Get the maximum number of grid view columns based on the current width of the
     * content explorer.
     *
     * @return {number}
     */
    _defineProperty(this, "getMaxNumberOfGridViewColumnsForWidth", () => {
      const {
        isSmall,
        isMedium,
        isLarge
      } = this.props;
      let maxWidthColumns = GRID_VIEW_MAX_COLUMNS;
      if (isSmall) {
        maxWidthColumns = 1;
      } else if (isMedium) {
        maxWidthColumns = 3;
      } else if (isLarge) {
        maxWidthColumns = 5;
      }
      return maxWidthColumns;
    });
    _defineProperty(this, "getMetadataViewProps", () => {
      const {
        metadataViewProps
      } = this.props;
      const {
        onSelectionChange
      } = metadataViewProps ?? {};
      const {
        currentPageNumber,
        markers,
        selectedItemIds
      } = this.state;
      const hasNextMarker = !!markers[currentPageNumber + 1];
      const hasPrevMarker = currentPageNumber === 1 || !!markers[currentPageNumber - 1];
      return _objectSpread(_objectSpread({}, metadataViewProps), {}, {
        selectedKeys: selectedItemIds,
        onSelectionChange: ids => {
          onSelectionChange?.(ids);
          const isSelectionEmpty = ids !== 'all' && ids.size === 0;
          this.setState(_objectSpread({
            selectedItemIds: ids
          }, isSelectionEmpty && {
            isMetadataSidePanelOpen: false
          }));
        },
        paginationProps: {
          onMarkerBasedPageChange: this.markerBasedPaginate,
          hasNextMarker,
          hasPrevMarker,
          type: 'marker'
        }
      });
    });
    /**
     * Change the current view mode
     *
     * @param {ViewMode} viewMode - the new view mode
     * @return {void}
     */
    _defineProperty(this, "changeViewMode", viewMode => {
      this.store.setItem(localStoreViewMode, viewMode);
      this.forceUpdate();
    });
    /**
     * Callback for when value of GridViewSlider changes
     *
     * @param {number} sliderValue - value of slider
     * @return {void}
     */
    _defineProperty(this, "onGridViewSliderChange", sliderValue => {
      // need to do this calculation since lowest value of grid view slider
      // means highest number of columns
      const gridColumnCount = GRID_VIEW_MAX_COLUMNS - sliderValue + 1;
      this.setState({
        gridColumnCount
      });
    });
    /**
     * Function to update metadata field value in metadata based view
     * @param {BoxItem} item - file item whose metadata is being changed
     * @param {string} field - metadata template field name
     * @param {MetadataFieldValue} oldValue - current value
     * @param {MetadataFieldValue} newVlaue - new value the field to be updated to
     */
    _defineProperty(this, "updateMetadata", (item, field, oldValue, newValue) => {
      this.metadataQueryAPIHelper.updateMetadata(item, field, oldValue, newValue, () => {
        this.updateMetadataSuccessCallback(item, field, newValue);
      }, this.errorCallback);
    });
    _defineProperty(this, "updateMetadataSuccessCallback", (item, field, newValue) => {
      const {
        currentCollection
      } = this.state;
      const {
        items = [],
        nextMarker
      } = currentCollection;
      const updatedItems = items.map(collectionItem => {
        const clonedItem = cloneDeep(collectionItem);
        if (item.id === clonedItem.id) {
          const fields = getProp(clonedItem, 'metadata.enterprise.fields', []);
          fields.forEach(itemField => {
            if (itemField.key.split('.').pop() === field) {
              itemField.value = newValue; // set updated metadata value to correct item in currentCollection
            }
          });
        }
        return clonedItem;
      });
      this.validateSelectedItemIds(updatedItems);
      this.setState({
        currentCollection: {
          items: updatedItems,
          nextMarker,
          percentLoaded: 100
        }
      });
    });
    _defineProperty(this, "clearSelectedItemIds", () => {
      this.setState({
        selectedItemIds: new Set(),
        isMetadataSidePanelOpen: false
      });
    });
    /**
     * Toggle metadata side panel visibility
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "onMetadataSidePanelToggle", () => {
      this.setState(prevState => ({
        isMetadataSidePanelOpen: !prevState.isMetadataSidePanelOpen
      }));
    });
    /**
     * Close metadata side panel
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "closeMetadataSidePanel", () => {
      this.setState({
        isMetadataSidePanelOpen: false
      });
    });
    _defineProperty(this, "filterMetadata", fields => {
      this.setState({
        metadataFilters: fields
      }, this.refreshCollection);
    });
    const {
      apiHost,
      initialPage,
      initialPageSize,
      language,
      requestInterceptor,
      responseInterceptor,
      rootFolderId: _rootFolderId,
      sharedLink,
      sharedLinkPassword,
      sortBy: _sortBy,
      sortDirection: _sortDirection,
      token,
      uploadHost
    } = props;
    this.api = new API({
      apiHost,
      clientName: CLIENT_NAME_CONTENT_EXPLORER,
      id: `${TYPED_ID_FOLDER_PREFIX}${_rootFolderId}`,
      language,
      requestInterceptor,
      responseInterceptor,
      sharedLink,
      sharedLinkPassword,
      token,
      uploadHost,
      version: CLIENT_VERSION
    });
    this.id = uniqueid('bce_');
    this.state = {
      currentCollection: {},
      currentOffset: initialPageSize * (initialPage - 1),
      currentPageSize: initialPageSize,
      currentPageNumber: 0,
      errorCode: '',
      focusedRow: 0,
      gridColumnCount: 4,
      isCreateFolderModalOpen: false,
      isDeleteModalOpen: false,
      isLoading: false,
      isMetadataSidePanelOpen: false,
      isPreviewModalOpen: false,
      isRenameModalOpen: false,
      isShareModalOpen: false,
      isUploadModalOpen: false,
      markers: [],
      metadataFilters: {},
      metadataTemplate: {},
      rootName: '',
      selectedItemIds: new Set(),
      searchQuery: '',
      sortBy: _sortBy,
      sortDirection: _sortDirection,
      view: VIEW_FOLDER
    };
  }

  /**
   * Destroys api instances
   *
   * @private
   * @return {void}
   */
  clearCache() {
    this.api.destroy(true);
  }

  /**
   * Cleanup
   *
   * @private
   * @inheritdoc
   * @return {void}
   */
  componentWillUnmount() {
    this.clearCache();
  }

  /**
   * Fetches the root folder on load
   *
   * @private
   * @inheritdoc
   * @return {void}
   */
  componentDidMount() {
    const {
      currentFolderId,
      defaultView
    } = this.props;
    this.rootElement = document.getElementById(this.id);
    this.appElement = this.rootElement.firstElementChild;
    switch (defaultView) {
      case DEFAULT_VIEW_RECENTS:
        this.showRecents();
        break;
      case DEFAULT_VIEW_METADATA:
        this.showMetadataQueryResults();
        break;
      default:
        this.fetchFolder(currentFolderId);
    }
  }

  /**
   * Fetches the current folder if different
   * from what was already fetched before.
   *
   * @private
   * @inheritdoc
   * @return {void}
   */
  componentDidUpdate({
    currentFolderId: prevFolderId
  }, prevState) {
    const {
      currentFolderId
    } = this.props;
    const {
      currentCollection: {
        id
      }
    } = prevState;
    if (prevFolderId === currentFolderId) {
      return;
    }
    if (typeof currentFolderId === 'string' && id !== currentFolderId) {
      this.fetchFolder(currentFolderId);
    }
  }
  /**
   * Queries metadata_queries/execute API and fetches the result
   *
   * @private
   * @return {void}
   */
  showMetadataQueryResults() {
    const {
      features,
      metadataQuery = {}
    } = this.props;
    const {
      currentPageNumber,
      markers,
      metadataFilters,
      sortBy,
      sortDirection
    } = this.state;
    const metadataQueryClone = cloneDeep(metadataQuery);
    if (currentPageNumber === 0) {
      // Preserve the marker as part of the original query
      markers[currentPageNumber] = metadataQueryClone.marker;
    }
    if (typeof markers[currentPageNumber] === 'string') {
      // Set marker to the query to get next set of results
      metadataQueryClone.marker = markers[currentPageNumber];
    }
    if (typeof metadataQueryClone.limit !== 'number') {
      // Set limit to the query for pagination support
      metadataQueryClone.limit = DEFAULT_PAGE_SIZE;
    }

    // Reset search state, the view and show busy indicator
    this.setState({
      searchQuery: '',
      currentCollection: this.currentUnloadedCollection(),
      view: VIEW_METADATA
    });
    if (isFeatureEnabled(features, 'contentExplorer.metadataViewV2')) {
      metadataQueryClone.order_by = [{
        // Default to the prefixed name field for metadata view v2 only, while not touching the default sortBy for other views.
        field_key: sortBy === FIELD_NAME ? FIELD_ITEM_NAME : sortBy,
        direction: sortDirection
      }];
      this.metadataQueryAPIHelper = new MetadataQueryAPIHelperV2(this.api);
      this.metadataQueryAPIHelper.fetchMetadataQueryResults(metadataQueryClone, this.showMetadataQueryResultsSuccessCallback, this.errorCallback, metadataFilters);
    } else {
      metadataQueryClone.order_by = [{
        field_key: sortBy,
        direction: sortDirection
      }];
      this.metadataQueryAPIHelper = new MetadataQueryAPIHelper(this.api);
      this.metadataQueryAPIHelper.fetchMetadataQueryResults(metadataQueryClone, this.showMetadataQueryResultsSuccessCallback, this.errorCallback);
    }
  }
  /**
   * Resets the collection so that the loading bar starts showing
   *
   * @private
   * @return {Collection}
   */
  currentUnloadedCollection() {
    const {
      currentCollection
    } = this.state;
    return _extends(currentCollection, {
      percentLoaded: 0
    });
  }
  /**
   * Focuses the grid and fires navigate event
   *
   * @private
   * @return {void}
   */
  finishNavigation() {
    const {
      autoFocus
    } = this.props;
    const {
      currentCollection: {
        percentLoaded
      }
    } = this.state;

    // If loading for the very first time, only allow focus if autoFocus is true
    if (this.firstLoad && !autoFocus) {
      this.firstLoad = false;
      return;
    }

    // Don't focus the grid until its loaded and user is not already on an interactable element
    if (percentLoaded === 100 && !isFocusableElement(document.activeElement)) {
      focus(this.rootElement, '.bce-item-row');
      this.setState({
        focusedRow: 0
      });
    }
    this.firstLoad = false;
  }
  /**
   * Folder fetch success callback
   *
   * @private
   * @param {Object} collection - item collection object
   * @param {Boolean|void} triggerNavigationEvent - To trigger navigate event and focus grid
   * @return {void}
   */
  fetchFolderSuccessCallback(collection, triggerNavigationEvent) {
    const {
      onNavigate,
      rootFolderId
    } = this.props;
    const {
      boxItem,
      id,
      name
    } = collection;
    const {
      selected
    } = this.state;
    const rootName = id === rootFolderId ? name : '';

    // Close any open modals
    this.closeModals();
    this.updateCollection(collection, selected, () => {
      if (triggerNavigationEvent) {
        // Fire folder navigation event
        this.setState({
          rootName
        }, this.finishNavigation);
        if (boxItem) {
          onNavigate(cloneDeep(boxItem));
        }
      } else {
        this.setState({
          rootName
        });
      }
    });
  }
  /**
   * Recents fetch success callback
   *
   * @private
   * @param {Object} collection item collection object
   * @param {Boolean} triggerNavigationEvent - To trigger navigate event
   * @return {void}
   */
  recentsSuccessCallback(collection, triggerNavigationEvent) {
    if (triggerNavigationEvent) {
      this.updateCollection(collection, undefined, this.finishNavigation);
    } else {
      this.updateCollection(collection);
    }
  }

  /**
   * Shows recents.
   *
   * @private
   * @param {Boolean|void} [triggerNavigationEvent] To trigger navigate event
   * @return {void}
   */
  showRecents(triggerNavigationEvent = true) {
    const {
      rootFolderId
    } = this.props;

    // Reset search state, the view and show busy indicator
    this.setState({
      searchQuery: '',
      view: VIEW_RECENTS,
      currentCollection: this.currentUnloadedCollection(),
      currentOffset: 0
    });

    // Fetch the folder using folder API
    this.api.getRecentsAPI().recents(rootFolderId, collection => {
      this.recentsSuccessCallback(collection, triggerNavigationEvent);
    }, this.errorCallback, {
      fields: CONTENT_EXPLORER_FOLDER_FIELDS_TO_FETCH,
      forceFetch: true
    });
  }
  /**
   * Sets state with currentCollection updated to have `items.selected` properties
   * set according to the given selected param. Also updates the selected item in the
   * currentCollection. selectedItem will be set to the selected state
   * item if it is in currentCollection, otherwise it will be set to undefined.
   *
   * @private
   * @param {Collection} collection - collection that needs to be updated
   * @param {Object} [selectedItem] - The item that should be selected in that collection (if present)
   * @param {Function} [callback] - callback function that should be called after setState occurs
   * @return {void}
   */
  async updateCollection(collection, selectedItem, callback = noop) {
    const newCollection = cloneDeep(collection);
    const {
      items = []
    } = newCollection;
    const fileAPI = this.api.getFileAPI(false);
    const selectedId = selectedItem ? selectedItem.id : null;
    let newSelectedItem;
    const itemThumbnails = await Promise.all(items.map(item => {
      return item.type === TYPE_FILE ? fileAPI.getThumbnailUrl(item) : null;
    }));
    newCollection.items = items.map((item, index) => {
      const isSelected = item.id === selectedId;
      const currentItem = isSelected ? selectedItem : item;
      const thumbnailUrl = itemThumbnails[index];
      const newItem = _objectSpread(_objectSpread({}, currentItem), {}, {
        selected: isSelected,
        thumbnailUrl
      });
      if (item.type === TYPE_FILE && thumbnailUrl && !isThumbnailAvailable(newItem)) {
        this.attemptThumbnailGeneration(newItem);
      }

      // Only if selectedItem is in the current collection do we want to set selected state
      if (isSelected) {
        newSelectedItem = newItem;
      }
      return newItem;
    });
    this.setState({
      currentCollection: newCollection,
      selected: newSelectedItem
    }, callback);
  }
  /**
   * Renders the file picker
   *
   * @private
   * @inheritdoc
   * @return {Element}
   */
  render() {
    const {
      apiHost,
      appHost,
      bulkItemActions,
      canCreateNewFolder,
      canDelete,
      canDownload,
      canPreview,
      canRename,
      canSetShareAccess,
      canShare,
      canUpload,
      className,
      contentPreviewProps,
      contentUploaderProps,
      defaultView,
      features,
      hasProviders,
      isMedium,
      isSmall,
      isTouch,
      itemActions,
      language,
      logoUrl,
      measureRef,
      messages,
      fieldsToShow,
      onDownload,
      onPreview,
      onUpload,
      requestInterceptor,
      responseInterceptor,
      rootFolderId,
      sharedLink,
      sharedLinkPassword,
      staticHost,
      staticPath,
      previewLibraryVersion,
      theme,
      title,
      token,
      uploadHost
    } = this.props;
    const {
      currentCollection,
      currentPageNumber,
      currentPageSize,
      errorCode,
      gridColumnCount,
      isCreateFolderModalOpen,
      isDeleteModalOpen,
      isLoading,
      isMetadataSidePanelOpen,
      isPreviewModalOpen,
      isRenameModalOpen,
      isShareModalOpen,
      isUploadModalOpen,
      markers,
      metadataTemplate,
      rootName,
      selected,
      selectedItemIds,
      view
    } = this.state;
    const {
      id,
      offset,
      permissions,
      totalCount
    } = currentCollection;
    const {
      can_upload
    } = permissions || {};
    const styleClassName = classNames('be bce', className);
    const allowUpload = canUpload && !!can_upload;
    const allowCreate = canCreateNewFolder && !!can_upload;
    const isDefaultViewMetadata = defaultView === DEFAULT_VIEW_METADATA;
    const isMetadataViewV2Feature = isFeatureEnabled(features, 'contentExplorer.metadataViewV2');
    const isErrorView = view === VIEW_ERROR;
    const viewMode = this.getViewMode();
    const maxGridColumnCount = this.getMaxNumberOfGridViewColumnsForWidth();
    const hasNextMarker = !!markers[currentPageNumber + 1];
    const hasPreviousMarker = currentPageNumber === 1 || !!markers[currentPageNumber - 1];
    const metadataViewProps = this.getMetadataViewProps();

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    return /*#__PURE__*/React.createElement(Internationalize, {
      language: language,
      messages: messages
    }, /*#__PURE__*/React.createElement(Providers, {
      hasProviders: hasProviders
    }, /*#__PURE__*/React.createElement("div", {
      id: this.id,
      className: styleClassName,
      ref: measureRef,
      "data-testid": "content-explorer"
    }, /*#__PURE__*/React.createElement(ThemingStyles, {
      selector: `#${this.id}`,
      theme: theme
    }), /*#__PURE__*/React.createElement("div", {
      className: "be-app-element",
      onKeyDown: this.onKeyDown,
      tabIndex: 0
    }, /*#__PURE__*/React.createElement("div", {
      className: "bce-ContentExplorer-main"
    }, !isDefaultViewMetadata && /*#__PURE__*/React.createElement(Header, {
      view: view,
      logoUrl: logoUrl,
      onSearch: this.search
    }), /*#__PURE__*/React.createElement(SubHeader, {
      bulkItemActions: bulkItemActions,
      view: view,
      viewMode: viewMode,
      rootId: rootFolderId,
      isSmall: isSmall,
      rootName: rootName,
      currentCollection: currentCollection,
      canUpload: allowUpload,
      canCreateNewFolder: allowCreate,
      gridColumnCount: gridColumnCount,
      gridMaxColumns: GRID_VIEW_MAX_COLUMNS,
      gridMinColumns: GRID_VIEW_MIN_COLUMNS,
      maxGridColumnCountForWidth: maxGridColumnCount,
      onUpload: this.upload,
      onClearSelectedItemIds: this.clearSelectedItemIds,
      onCreate: this.createFolder,
      onGridViewSliderChange: this.onGridViewSliderChange,
      onItemClick: this.fetchFolder,
      onSortChange: this.sort,
      onMetadataSidePanelToggle: this.onMetadataSidePanelToggle,
      onViewModeChange: this.changeViewMode,
      portalElement: this.rootElement,
      selectedItemIds: selectedItemIds,
      title: title
    }), /*#__PURE__*/React.createElement(Content, {
      canDelete: canDelete,
      canDownload: canDownload,
      canPreview: canPreview,
      canRename: canRename,
      canShare: canShare,
      currentCollection: currentCollection,
      features: features,
      gridColumnCount: Math.min(gridColumnCount, maxGridColumnCount),
      isMedium: isMedium,
      isSmall: isSmall,
      isTouch: isTouch,
      itemActions: itemActions,
      fieldsToShow: fieldsToShow,
      metadataTemplate: metadataTemplate,
      metadataViewProps: metadataViewProps,
      onItemClick: this.onItemClick,
      onItemDelete: this.delete,
      onItemDownload: this.download,
      onItemPreview: this.preview,
      onItemRename: this.rename,
      onItemSelect: this.select,
      onItemShare: this.share,
      onMetadataFilter: this.filterMetadata,
      onMetadataUpdate: this.updateMetadata,
      onSortChange: this.sort,
      portalElement: this.rootElement,
      view: view,
      viewMode: viewMode
    }), !isErrorView && !isMetadataViewV2Feature && /*#__PURE__*/React.createElement(Footer, null, /*#__PURE__*/React.createElement(Pagination, {
      hasNextMarker: hasNextMarker,
      hasPrevMarker: hasPreviousMarker,
      isSmall: isSmall,
      offset: offset,
      onOffsetChange: this.paginate,
      pageSize: currentPageSize,
      totalCount: totalCount,
      onMarkerBasedPageChange: this.markerBasedPaginate
    }))), isDefaultViewMetadata && isMetadataViewV2Feature && isMetadataSidePanelOpen && /*#__PURE__*/React.createElement(MetadataSidePanel, {
      currentCollection: currentCollection,
      metadataTemplate: metadataTemplate,
      onClose: this.closeMetadataSidePanel,
      onUpdate: this.updateMetadataV2,
      refreshCollection: this.refreshCollection,
      selectedItemIds: selectedItemIds
    })), allowUpload && !!this.appElement ? /*#__PURE__*/React.createElement(UploadDialog, {
      isOpen: isUploadModalOpen,
      currentFolderId: id,
      token: token,
      sharedLink: sharedLink,
      sharedLinkPassword: sharedLinkPassword,
      apiHost: apiHost,
      uploadHost: uploadHost,
      onClose: this.uploadSuccessHandler,
      parentElement: this.rootElement,
      appElement: this.appElement,
      onUpload: onUpload,
      contentUploaderProps: contentUploaderProps,
      requestInterceptor: requestInterceptor,
      responseInterceptor: responseInterceptor
    }) : null, allowCreate && !!this.appElement ? /*#__PURE__*/React.createElement(CreateFolderDialog, {
      isOpen: isCreateFolderModalOpen,
      onCreate: this.throttledCreateFolderCallback,
      onCancel: this.closeModals,
      isLoading: isLoading,
      errorCode: errorCode,
      parentElement: this.rootElement,
      appElement: this.appElement
    }) : null, canDelete && selected && !!this.appElement ? /*#__PURE__*/React.createElement(DeleteConfirmationDialog, {
      isOpen: isDeleteModalOpen,
      onDelete: this.deleteCallback,
      onCancel: this.closeModals,
      item: selected,
      isLoading: isLoading,
      parentElement: this.rootElement,
      appElement: this.appElement
    }) : null, canRename && selected && !!this.appElement ? /*#__PURE__*/React.createElement(RenameDialog, {
      isOpen: isRenameModalOpen,
      onRename: this.renameCallback,
      onCancel: this.closeModals,
      item: selected,
      isLoading: isLoading,
      errorCode: errorCode,
      parentElement: this.rootElement,
      appElement: this.appElement
    }) : null, canShare && selected && !!this.appElement ? /*#__PURE__*/React.createElement(ShareDialog, {
      isOpen: isShareModalOpen,
      canSetShareAccess: canSetShareAccess,
      onShareAccessChange: this.changeShareAccess,
      onCancel: this.refreshCollection,
      item: selected,
      isLoading: isLoading,
      parentElement: this.rootElement,
      appElement: this.appElement
    }) : null, canPreview && selected && !!this.appElement ? /*#__PURE__*/React.createElement(PreviewDialog, {
      isOpen: isPreviewModalOpen,
      isTouch: isTouch,
      onCancel: this.closeModals,
      item: selected,
      currentCollection: cloneDeep(currentCollection),
      token: token,
      parentElement: this.rootElement,
      appElement: this.appElement,
      onPreview: onPreview,
      onDownload: onDownload,
      canDownload: canDownload,
      cache: this.api.getCache(),
      apiHost: apiHost,
      appHost: appHost,
      staticHost: staticHost,
      staticPath: staticPath,
      previewLibraryVersion: previewLibraryVersion,
      sharedLink: sharedLink,
      sharedLinkPassword: sharedLinkPassword,
      contentPreviewProps: contentPreviewProps,
      requestInterceptor: requestInterceptor,
      responseInterceptor: responseInterceptor
    }) : null)));
    /* eslint-enable jsx-a11y/no-static-element-interactions */
    /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
  }
}
_defineProperty(ContentExplorer, "defaultProps", {
  rootFolderId: DEFAULT_ROOT,
  sortBy: FIELD_NAME,
  sortDirection: SORT_ASC,
  canDownload: true,
  canDelete: true,
  canUpload: true,
  canRename: true,
  canShare: true,
  canPreview: true,
  canSetShareAccess: true,
  canCreateNewFolder: true,
  autoFocus: false,
  apiHost: DEFAULT_HOSTNAME_API,
  appHost: DEFAULT_HOSTNAME_APP,
  staticHost: DEFAULT_HOSTNAME_STATIC,
  uploadHost: DEFAULT_HOSTNAME_UPLOAD,
  className: '',
  onDelete: noop,
  onDownload: noop,
  onPreview: noop,
  onRename: noop,
  onCreate: noop,
  onSelect: noop,
  onUpload: noop,
  onNavigate: noop,
  defaultView: DEFAULT_VIEW_FILES,
  initialPage: DEFAULT_PAGE_NUMBER,
  initialPageSize: DEFAULT_PAGE_SIZE,
  contentPreviewProps: {
    contentSidebarProps: {}
  },
  contentUploaderProps: {},
  metadataViewProps: {}
});
export { ContentExplorer as ContentExplorerComponent };
export default flow([makeResponsive, withFeatureConsumer, withFeatureProvider, withBlueprintModernization])(ContentExplorer);
//# sourceMappingURL=ContentExplorer.js.map