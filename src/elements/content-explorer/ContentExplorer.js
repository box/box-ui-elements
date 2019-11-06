/**
 * @flow
 * @file Content Explorer Component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import flow from 'lodash/flow';
import noop from 'lodash/noop';
import uniqueid from 'lodash/uniqueId';
import CreateFolderDialog from '../common/create-folder-dialog';
import UploadDialog from '../common/upload-dialog';
import Header from '../common/header';
import Pagination from '../common/pagination';
import SubHeader from '../common/sub-header/SubHeader';
import makeResponsive from '../common/makeResponsive';
import openUrlInsideIframe from '../../utils/iframe';
import Internationalize from '../common/Internationalize';
import API from '../../api';
import MetadataQueryAPIHelper from '../../features/metadata-based-view/MetadataQueryAPIHelper';
import Footer from './Footer';
import PreviewDialog from './PreviewDialog';
import ShareDialog from './ShareDialog';
import RenameDialog from './RenameDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import Content from './Content';
import { isFocusableElement, isInputElement, focus } from '../../utils/dom';
import { FILE_SHARED_LINK_FIELDS_TO_FETCH, FOLDER_FIELDS_TO_FETCH } from '../../utils/fields';
import LocalStore from '../../utils/LocalStore';
import { withFeatureConsumer, withFeatureProvider, type FeatureConfig } from '../common/feature-checking';
import {
    DEFAULT_HOSTNAME_UPLOAD,
    DEFAULT_HOSTNAME_API,
    DEFAULT_HOSTNAME_APP,
    DEFAULT_HOSTNAME_STATIC,
    DEFAULT_SEARCH_DEBOUNCE,
    SORT_ASC,
    FIELD_NAME,
    DEFAULT_ROOT,
    VIEW_SEARCH,
    VIEW_FOLDER,
    VIEW_ERROR,
    VIEW_RECENTS,
    VIEW_METADATA,
    VIEW_MODE_LIST,
    TYPE_FILE,
    TYPE_WEBLINK,
    TYPE_FOLDER,
    CLIENT_NAME_CONTENT_EXPLORER,
    DEFAULT_PAGE_NUMBER,
    DEFAULT_PAGE_SIZE,
    DEFAULT_VIEW_FILES,
    DEFAULT_VIEW_RECENTS,
    DEFAULT_VIEW_METADATA,
    ERROR_CODE_ITEM_NAME_INVALID,
    ERROR_CODE_ITEM_NAME_TOO_LONG,
    TYPED_ID_FOLDER_PREFIX,
} from '../../constants';
import type { ViewMode } from '../common/flowTypes';
import type { MetadataQuery, MetadataColumnsToShow } from '../../common/types/metadataQueries';
import '../common/fonts.scss';
import '../common/base.scss';
import '../common/modal.scss';
import './ContentExplorer.scss';

const GRID_VIEW_MAX_COLUMNS = 7;
const GRID_VIEW_MIN_COLUMNS = 1;

type Props = {
    apiHost: string,
    appHost: string,
    autoFocus: boolean,
    canCreateNewFolder: boolean,
    canDelete: boolean,
    canDownload: boolean,
    canPreview: boolean,
    canRename: boolean,
    canSetShareAccess: boolean,
    canShare: boolean,
    canUpload: boolean,
    className: string,
    contentPreviewProps: ContentPreviewProps,
    currentFolderId?: string,
    defaultView: DefaultView,
    features: FeatureConfig,
    initialPage: number,
    initialPageSize: number,
    isLarge: boolean,
    isMedium: boolean,
    isSmall: boolean,
    isTouch: boolean,
    isVeryLarge: boolean,
    language?: string,
    logoUrl?: string,
    measureRef?: Function,
    messages?: StringMap,
    metadataColumnsToShow: MetadataColumnsToShow,
    metadataQuery: MetadataQuery,
    onCreate: Function,
    onDelete: Function,
    onDownload: Function,
    onNavigate: Function,
    onPreview: Function,
    onRename: Function,
    onSelect: Function,
    onUpload: Function,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    rootFolderId: string,
    sharedLink?: string,
    sharedLinkPassword?: string,
    sortBy: SortBy,
    sortDirection: SortDirection,
    staticHost: string,
    token: Token,
    uploadHost: string,
};

type State = {
    currentCollection: Collection,
    currentOffset: number,
    currentPageSize: number,
    errorCode: string,
    focusedRow: number,
    gridColumnCount: number,
    isCreateFolderModalOpen: boolean,
    isDeleteModalOpen: boolean,
    isLoading: boolean,
    isPreviewModalOpen: boolean,
    isRenameModalOpen: boolean,
    isShareModalOpen: boolean,
    isUploadModalOpen: boolean,
    rootName: string,
    searchQuery: string,
    selected?: BoxItem,
    sortBy: SortBy,
    sortDirection: SortDirection,
    view: View,
};

const localStoreViewMode = 'bce.defaultViewMode';

class ContentExplorer extends Component<Props, State> {
    id: string;

    api: API;

    state: State;

    props: Props;

    table: any;

    rootElement: HTMLElement;

    appElement: HTMLElement;

    globalModifier: boolean;

    firstLoad: boolean = true; // Keeps track of very 1st load

    store: LocalStore = new LocalStore();

    metadataQueryAPIHelper: MetadataQueryAPIHelper;

    static defaultProps = {
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
            contentSidebarProps: {},
        },
    };

    /**
     * [constructor]
     *
     * @private
     * @return {ContentExplorer}
     */
    constructor(props: Props) {
        super(props);

        const {
            apiHost,
            initialPage,
            initialPageSize,
            language,
            requestInterceptor,
            responseInterceptor,
            rootFolderId,
            sharedLink,
            sharedLinkPassword,
            sortBy,
            sortDirection,
            token,
            uploadHost,
        }: Props = props;

        this.api = new API({
            apiHost,
            clientName: CLIENT_NAME_CONTENT_EXPLORER,
            id: `${TYPED_ID_FOLDER_PREFIX}${rootFolderId}`,
            language,
            requestInterceptor,
            responseInterceptor,
            sharedLink,
            sharedLinkPassword,
            token,
            uploadHost,
        });

        this.id = uniqueid('bce_');

        this.state = {
            currentCollection: {},
            currentOffset: initialPageSize * (initialPage - 1),
            currentPageSize: initialPageSize,
            errorCode: '',
            focusedRow: 0,
            gridColumnCount: 4,
            isCreateFolderModalOpen: false,
            isDeleteModalOpen: false,
            isLoading: false,
            isPreviewModalOpen: false,
            isRenameModalOpen: false,
            isShareModalOpen: false,
            isUploadModalOpen: false,
            rootName: '',
            searchQuery: '',
            sortBy,
            sortDirection,
            view: VIEW_FOLDER,
        };
    }

    /**
     * Destroys api instances
     *
     * @private
     * @return {void}
     */
    clearCache(): void {
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
        const { currentFolderId, defaultView }: Props = this.props;
        this.rootElement = ((document.getElementById(this.id): any): HTMLElement);
        this.appElement = ((this.rootElement.firstElementChild: any): HTMLElement);

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
    componentDidUpdate({ currentFolderId: prevFolderId }: Props, prevState: State): void {
        const { currentFolderId }: Props = this.props;
        const {
            currentCollection: { id },
        }: State = prevState;

        if (prevFolderId === currentFolderId) {
            return;
        }

        if (typeof currentFolderId === 'string' && id !== currentFolderId) {
            this.fetchFolder(currentFolderId);
        }
    }

    /**
     * Metadata queries success callback
     *
     * @private
     * @param {Object} metadataQueryCollection - Metadata query response collection
     * @return {void}
     */
    showMetadataQueryResultsSuccessCallback = (metadataQueryCollection: Collection): void => {
        const { currentCollection }: State = this.state;
        this.setState({
            currentCollection: {
                ...currentCollection,
                ...metadataQueryCollection,
                percentLoaded: 100,
            },
        });
    };

    /**
     * Queries metadata_queries/execute API and fetches the result
     *
     * @private
     * @return {void}
     */
    showMetadataQueryResults() {
        const { metadataQuery }: Props = this.props;
        // Reset search state, the view and show busy indicator
        this.setState({
            searchQuery: '',
            currentCollection: this.currentUnloadedCollection(),
            view: VIEW_METADATA,
        });
        this.metadataQueryAPIHelper = new MetadataQueryAPIHelper(this.api);
        this.metadataQueryAPIHelper.fetchMetadataQueryResults(
            metadataQuery,
            this.showMetadataQueryResultsSuccessCallback,
            this.errorCallback,
        );
    }

    /**
     * Resets the collection so that the loading bar starts showing
     *
     * @private
     * @return {Collection}
     */
    currentUnloadedCollection(): Collection {
        const { currentCollection }: State = this.state;
        return Object.assign(currentCollection, {
            percentLoaded: 0,
        });
    }

    /**
     * Network error callback
     *
     * @private
     * @param {Error} error error object
     * @return {void}
     */
    errorCallback = (error: any) => {
        this.setState({
            view: VIEW_ERROR,
        });
        /* eslint-disable no-console */
        console.error(error);
        /* eslint-enable no-console */
    };

    /**
     * Focuses the grid and fires navigate event
     *
     * @private
     * @return {void}
     */
    finishNavigation() {
        const { autoFocus }: Props = this.props;
        const {
            currentCollection: { percentLoaded },
        }: State = this.state;

        // If loading for the very first time, only allow focus if autoFocus is true
        if (this.firstLoad && !autoFocus) {
            this.firstLoad = false;
            return;
        }

        // Don't focus the grid until its loaded and user is not already on an interactable element
        if (percentLoaded === 100 && !isFocusableElement(document.activeElement)) {
            focus(this.rootElement, '.bce-item-row');
            this.setState({ focusedRow: 0 });
        }

        this.firstLoad = false;
    }

    /**
     * Refreshing the item collection depending upon the view.
     * Navigation event is prevented.
     *
     * @private
     * @return {void}
     */
    refreshCollection = () => {
        const {
            currentCollection: { id },
            view,
            searchQuery,
        }: State = this.state;
        if (view === VIEW_FOLDER && id) {
            this.fetchFolder(id, false);
        } else if (view === VIEW_RECENTS) {
            this.showRecents(false);
        } else if (view === VIEW_SEARCH && searchQuery) {
            this.search(searchQuery);
        } else {
            throw new Error('Cannot refresh incompatible view!');
        }
    };

    /**
     * Folder fetch success callback
     *
     * @private
     * @param {Object} collection - item collection object
     * @param {Boolean|void} triggerNavigationEvent - To trigger navigate event and focus grid
     * @return {void}
     */
    fetchFolderSuccessCallback(collection: Collection, triggerNavigationEvent: boolean): void {
        const { onNavigate, rootFolderId }: Props = this.props;
        const { boxItem, id, name }: Collection = collection;
        const { selected }: State = this.state;
        const rootName = id === rootFolderId ? name : '';

        // Close any open modals
        this.closeModals();

        this.updateCollection(collection, selected, () => {
            if (triggerNavigationEvent) {
                // Fire folder navigation event
                this.setState({ rootName }, this.finishNavigation);
                if (boxItem) {
                    onNavigate(cloneDeep(boxItem));
                }
            } else {
                this.setState({ rootName });
            }
        });
    }

    /**
     * Fetches a folder, defaults to fetching root folder
     *
     * @private
     * @param {string|void} [id] folder id
     * @param {Boolean|void} [triggerNavigationEvent] To trigger navigate event
     * @return {void}
     */
    fetchFolder = (id?: string, triggerNavigationEvent?: boolean = true) => {
        const { rootFolderId }: Props = this.props;
        const {
            currentCollection: { id: currentId },
            currentOffset,
            currentPageSize: limit,
            searchQuery = '',
            sortBy,
            sortDirection,
        }: State = this.state;
        const folderId: string = typeof id === 'string' ? id : rootFolderId;
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
            currentOffset: offset,
        });

        // Fetch the folder using folder API
        this.api.getFolderAPI().getFolder(
            folderId,
            limit,
            offset,
            sortBy,
            sortDirection,
            (collection: Collection) => {
                this.fetchFolderSuccessCallback(collection, triggerNavigationEvent);
            },
            this.errorCallback,
            { fields: FOLDER_FIELDS_TO_FETCH, forceFetch: true },
        );
    };

    /**
     * Action performed when clicking on an item
     *
     * @private
     * @param {Object|string} item - the clicked box item
     * @return {void}
     */
    onItemClick = (item: BoxItem | string) => {
        // If the id was passed in, just use that
        if (typeof item === 'string') {
            this.fetchFolder(item);
            return;
        }

        const { id, type }: BoxItem = item;
        const { isTouch }: Props = this.props;

        if (type === TYPE_FOLDER) {
            this.fetchFolder(id);
            return;
        }

        if (isTouch) {
            return;
        }

        this.preview(item);
    };

    /**
     * Search success callback
     *
     * @private
     * @param {Object} collection item collection object
     * @return {void}
     */
    searchSuccessCallback = (collection: Collection) => {
        const { selected }: State = this.state;

        // Close any open modals
        this.closeModals();

        this.updateCollection(collection, selected);
    };

    /**
     * Debounced searching
     *
     * @private
     * @param {string} id folder id
     * @param {string} query search string
     * @return {void}
     */
    debouncedSearch = debounce((id: string, query: string) => {
        const { currentOffset, currentPageSize }: State = this.state;

        this.api
            .getSearchAPI()
            .search(id, query, currentPageSize, currentOffset, this.searchSuccessCallback, this.errorCallback, {
                fields: FOLDER_FIELDS_TO_FETCH,
                forceFetch: true,
            });
    }, DEFAULT_SEARCH_DEBOUNCE);

    /**
     * Searches
     *
     * @private
     * @param {string} query search string
     * @return {void}
     */
    search = (query: string) => {
        const { rootFolderId }: Props = this.props;
        const {
            currentCollection: { id },
            currentOffset,
            searchQuery,
        }: State = this.state;
        const folderId = typeof id === 'string' ? id : rootFolderId;
        const trimmedQuery: string = query.trim();

        if (!query) {
            // Cancel the debounce so we don't search on a previous query
            this.debouncedSearch.cancel();

            // Query was cleared out, load the prior folder
            // The prior folder is always the parent folder for search
            this.setState({ currentOffset: 0 }, () => {
                this.fetchFolder(folderId, false);
            });

            return;
        }

        if (!trimmedQuery) {
            // Query now only has bunch of spaces
            // do nothing and but update prior state
            this.setState({
                searchQuery: query,
            });
            return;
        }

        this.setState({
            currentCollection: this.currentUnloadedCollection(),
            currentOffset: trimmedQuery === searchQuery ? currentOffset : 0,
            searchQuery: query,
            selected: undefined,
            view: VIEW_SEARCH,
        });

        this.debouncedSearch(folderId, query);
    };

    /**
     * Recents fetch success callback
     *
     * @private
     * @param {Object} collection item collection object
     * @param {Boolean} triggerNavigationEvent - To trigger navigate event
     * @return {void}
     */
    recentsSuccessCallback(collection: Collection, triggerNavigationEvent: boolean) {
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
    showRecents(triggerNavigationEvent: boolean = true): void {
        const { rootFolderId }: Props = this.props;

        // Reset search state, the view and show busy indicator
        this.setState({
            searchQuery: '',
            view: VIEW_RECENTS,
            currentCollection: this.currentUnloadedCollection(),
            currentOffset: 0,
        });

        // Fetch the folder using folder API
        this.api.getRecentsAPI().recents(
            rootFolderId,
            (collection: Collection) => {
                this.recentsSuccessCallback(collection, triggerNavigationEvent);
            },
            this.errorCallback,
            { fields: FOLDER_FIELDS_TO_FETCH, forceFetch: true },
        );
    }

    /**
     * Uploads
     *
     * @private
     * @param {File} file dom file object
     * @return {void}
     */
    upload = () => {
        const {
            currentCollection: { id, permissions },
        }: State = this.state;
        const { canUpload }: Props = this.props;
        if (!canUpload || !id || !permissions) {
            return;
        }

        const { can_upload }: BoxItemPermission = permissions;
        if (!can_upload) {
            return;
        }

        this.setState({
            isUploadModalOpen: true,
        });
    };

    /**
     * Upload success handler
     *
     * @private
     * @param {File} file dom file object
     * @return {void}
     */
    uploadSuccessHandler = () => {
        const {
            currentCollection: { id },
        }: State = this.state;
        this.fetchFolder(id, false);
    };

    /**
     * Changes the share access of an item
     *
     * @private
     * @param {Object} item file or folder object
     * @param {string} access share access
     * @return {void}
     */
    changeShareAccess = (access: Access) => {
        const { selected }: State = this.state;
        const { canSetShareAccess }: Props = this.props;
        if (!selected || !canSetShareAccess) {
            return;
        }

        const { permissions, type }: BoxItem = selected;
        if (!permissions || !type) {
            return;
        }

        const { can_set_share_access }: BoxItemPermission = permissions;
        if (!can_set_share_access) {
            return;
        }

        this.setState({ isLoading: true });
        this.api.getAPI(type).share(selected, access, (updatedItem: BoxItem) => {
            this.setState({ isLoading: false });
            this.select(updatedItem);
        });
    };

    /**
     * Chages the sort by and sort direction
     *
     * @private
     * @param {string} sortBy - field to sort by
     * @param {string} sortDirection - sort direction
     * @return {void}
     */
    sort = (sortBy: SortBy, sortDirection: SortDirection) => {
        const {
            currentCollection: { id },
        }: State = this.state;
        if (id) {
            this.setState({ sortBy, sortDirection }, this.refreshCollection);
        }
    };

    /**
     * Sets state with currentCollection updated to have items.selected properties
     * set according to the given selected param. Also updates the selected item in the
     * currentcollection. selectedItem will be set to the selected state
     * item if it is in currentCollection, otherwise it will be set to undefined.
     *
     * @private
     * @param {Collection} collection - collection that needs to be updated
     * @param {Object} [selectedItem] - The item that should be selected in that collection (if present)
     * @param {Function} [callback] - callback function that should be called after setState occurs
     * @return {void}
     */
    async updateCollection(collection: Collection, selectedItem: ?BoxItem, callback: Function = noop): Object {
        const { items = [] } = collection;
        const fileAPI = this.api.getFileAPI(false);
        const newCollection: Collection = { ...collection };
        const selectedId = selectedItem ? selectedItem.id : null;
        const thumbnails = await Promise.all(items.map(item => fileAPI.getThumbnailUrl(item)));
        let newSelectedItem: ?BoxItem;

        newCollection.items = items.map((obj, index) => {
            const isSelected = obj.id === selectedId;
            const currentItem = isSelected ? selectedItem : obj;
            const newItem = {
                ...currentItem,
                selected: isSelected,
                thumbnailUrl: thumbnails[index],
            };

            // Only if selectedItem is in the current collection do we want to set selected state
            if (isSelected) {
                newSelectedItem = newItem;
            }

            return newItem;
        });
        this.setState({ currentCollection: newCollection, selected: newSelectedItem }, callback);
    }

    /**
     * Selects or unselects an item
     *
     * @private
     * @param {Object} item - file or folder object
     * @param {Function|void} [onSelect] - optional on select callback
     * @return {void}
     */
    select = (item: BoxItem, callback: Function = noop): void => {
        const { selected, currentCollection }: State = this.state;
        const { items = [] } = currentCollection;
        const { onSelect }: Props = this.props;

        if (item === selected) {
            callback(item);
            return;
        }

        const selectedItem: BoxItem = { ...item, selected: true };

        this.updateCollection(currentCollection, selectedItem, () => {
            onSelect(cloneDeep([selectedItem]));
            callback(selectedItem);
        });

        const focusedRow: number = items.findIndex((i: BoxItem) => i.id === item.id);

        this.setState({ focusedRow });
    };

    /**
     * Selects the clicked file and then previews it
     * or opens it, if it was a web link
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    preview = (item: BoxItem): void => {
        const { type, url }: BoxItem = item;
        if (type === TYPE_WEBLINK) {
            window.open(url);
            return;
        }

        this.select(item, this.previewCallback);
    };

    /**
     * Previews a file
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    previewCallback = (): void => {
        const { selected }: State = this.state;
        const { canPreview }: Props = this.props;
        if (!selected || !canPreview) {
            return;
        }

        const { permissions } = selected;
        if (!permissions) {
            return;
        }

        const { can_preview }: BoxItemPermission = permissions;
        if (!can_preview) {
            return;
        }

        this.setState({ isPreviewModalOpen: true });
    };

    /**
     * Selects the clicked file and then downloads it
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    download = (item: BoxItem): void => {
        this.select(item, this.downloadCallback);
    };

    /**
     * Downloads a file
     *
     * @private
     * @return {void}
     */
    downloadCallback = (): void => {
        const { selected }: State = this.state;
        const { canDownload, onDownload }: Props = this.props;
        if (!selected || !canDownload) {
            return;
        }

        const { id, permissions } = selected;
        if (!id || !permissions) {
            return;
        }

        const { can_download }: BoxItemPermission = permissions;
        if (!can_download) {
            return;
        }

        const openUrl: Function = (url: string) => {
            openUrlInsideIframe(url);
            onDownload(cloneDeep([selected]));
        };

        const { type }: BoxItem = selected;
        if (type === TYPE_FILE) {
            this.api.getFileAPI().getDownloadUrl(id, selected, openUrl, noop);
        }
    };

    /**
     * Selects the clicked file and then deletes it
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    delete = (item: BoxItem): void => {
        this.select(item, this.deleteCallback);
    };

    /**
     * Deletes a file
     *
     * @private
     * @return {void}
     */
    deleteCallback = (): void => {
        const { selected, isDeleteModalOpen }: State = this.state;
        const { canDelete, onDelete }: Props = this.props;
        if (!selected || !canDelete) {
            return;
        }

        const { id, permissions, parent, type }: BoxItem = selected;
        if (!id || !permissions || !parent || !type) {
            return;
        }

        const { id: parentId } = parent;
        const { can_delete }: BoxItemPermission = permissions;
        if (!can_delete || !parentId) {
            return;
        }

        if (!isDeleteModalOpen) {
            this.setState({ isDeleteModalOpen: true });
            return;
        }

        this.setState({ isLoading: true });
        this.api.getAPI(type).deleteItem(selected, () => {
            onDelete(cloneDeep([selected]));
            this.refreshCollection();
        });
    };

    /**
     * Selects the clicked file and then renames it
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    rename = (item: BoxItem): void => {
        this.select(item, this.renameCallback);
    };

    /**
     * Callback for renaming an item
     *
     * @private
     * @param {string} value new item name
     * @return {void}
     */
    renameCallback = (nameWithoutExt: string, extension: string): void => {
        const { selected, isRenameModalOpen }: State = this.state;
        const { canRename, onRename }: Props = this.props;
        if (!selected || !canRename) {
            return;
        }

        const { id, permissions, type }: BoxItem = selected;
        if (!id || !permissions || !type) {
            return;
        }

        const { can_rename }: BoxItemPermission = permissions;
        if (!can_rename) {
            return;
        }

        if (!isRenameModalOpen || !nameWithoutExt) {
            this.setState({ isRenameModalOpen: true, errorCode: '' });
            return;
        }

        const name = `${nameWithoutExt}${extension}`;
        if (!nameWithoutExt.trim()) {
            this.setState({
                errorCode: ERROR_CODE_ITEM_NAME_INVALID,
                isLoading: false,
            });
            return;
        }

        this.setState({ isLoading: true });
        this.api.getAPI(type).rename(
            selected,
            name,
            (updatedItem: BoxItem) => {
                this.setState({ isRenameModalOpen: false });
                this.refreshCollection();
                this.select(updatedItem);
                onRename(cloneDeep(selected));
            },
            ({ code }) => {
                this.setState({ errorCode: code, isLoading: false });
            },
        );
    };

    /**
     * Creates a new folder
     *
     * @private
     * @return {void}
     */
    createFolder = (): void => {
        this.createFolderCallback();
    };

    /**
     * New folder callback
     *
     * @private
     * @param {string} name - folder name
     * @return {void}
     */
    createFolderCallback = (name?: string): void => {
        const { isCreateFolderModalOpen, currentCollection }: State = this.state;
        const { canCreateNewFolder, onCreate }: Props = this.props;
        if (!canCreateNewFolder) {
            return;
        }

        const { id, permissions }: Collection = currentCollection;
        if (!id || !permissions) {
            return;
        }

        const { can_upload }: BoxItemPermission = permissions;
        if (!can_upload) {
            return;
        }

        if (!isCreateFolderModalOpen || !name) {
            this.setState({ isCreateFolderModalOpen: true, errorCode: '' });
            return;
        }

        if (!name) {
            this.setState({
                errorCode: ERROR_CODE_ITEM_NAME_INVALID,
                isLoading: false,
            });
            return;
        }

        if (name.length > 255) {
            this.setState({
                errorCode: ERROR_CODE_ITEM_NAME_TOO_LONG,
                isLoading: false,
            });
            return;
        }

        this.setState({ isLoading: true });
        this.api.getFolderAPI().create(
            id,
            name,
            (item: BoxItem) => {
                this.refreshCollection();
                this.select(item);
                onCreate(cloneDeep(item));
            },
            ({ code }) => {
                this.setState({
                    errorCode: code,
                    isLoading: false,
                });
            },
        );
    };

    /**
     * Selects the clicked file and then shares it
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    share = (item: BoxItem): void => {
        this.select(item, this.shareCallback);
    };

    /**
     * Fetch the shared link info
     * @param {BoxItem} item - The item (folder, file, weblink)
     * @returns {void}
     */
    fetchSharedLinkInfo = (item: BoxItem): void => {
        const { id, type }: BoxItem = item;

        switch (type) {
            case TYPE_FOLDER:
                this.api.getFolderAPI().getFolderFields(id, this.handleSharedLinkSuccess, noop, {
                    fields: FILE_SHARED_LINK_FIELDS_TO_FETCH,
                });
                break;
            case TYPE_FILE:
                this.api
                    .getFileAPI()
                    .getFile(id, this.handleSharedLinkSuccess, noop, { fields: FILE_SHARED_LINK_FIELDS_TO_FETCH });
                break;
            case TYPE_WEBLINK:
                this.api
                    .getWebLinkAPI()
                    .getWeblink(id, this.handleSharedLinkSuccess, noop, { fields: FILE_SHARED_LINK_FIELDS_TO_FETCH });
                break;
            default:
                throw new Error('Unknown Type');
        }
    };

    /**
     * Handles the shared link info by either creating a share link using enterprise defaults if
     * it does not already exist, otherwise update the item in the state currentCollection.
     *
     * @param {Object} item file or folder
     * @returns {void}
     */
    handleSharedLinkSuccess = (newItem: BoxItem) => {
        const { currentCollection } = this.state;

        // Update item in collection
        this.updateCollection(currentCollection, newItem, () => this.setState({ isShareModalOpen: true }));
    };

    /**
     * Chages the sort by and sort direction
     *
     * @private
     * @return {void}
     */
    shareCallback = (): void => {
        const { selected }: State = this.state;
        const { canShare }: Props = this.props;

        if (!selected || !canShare) {
            return;
        }

        const { permissions } = selected;
        if (!permissions) {
            return;
        }

        const { can_share }: BoxItemPermission = permissions;
        if (!can_share) {
            return;
        }

        this.fetchSharedLinkInfo(selected);
    };

    /**
     * Saves reference to table component
     *
     * @private
     * @param {Component} react component
     * @return {void}
     */
    tableRef = (table: React$Component<*, *>): void => {
        this.table = table;
    };

    /**
     * Closes the modal dialogs that may be open
     *
     * @private
     * @return {void}
     */
    closeModals = (): void => {
        const { focusedRow }: State = this.state;

        this.setState({
            isLoading: false,
            isDeleteModalOpen: false,
            isRenameModalOpen: false,
            isCreateFolderModalOpen: false,
            isShareModalOpen: false,
            isUploadModalOpen: false,
            isPreviewModalOpen: false,
        });

        const {
            selected,
            currentCollection: { items = [] },
        }: State = this.state;
        if (selected && items.length > 0) {
            focus(this.rootElement, `.bce-item-row-${focusedRow}`);
        }
    };

    /**
     * Keyboard events
     *
     * @private
     * @return {void}
     */
    onKeyDown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
        if (isInputElement(event.target)) {
            return;
        }

        const { rootFolderId }: Props = this.props;
        const key = event.key.toLowerCase();

        switch (key) {
            case '/':
                focus(this.rootElement, '.be-search input[type="search"]', false);
                event.preventDefault();
                break;
            case 'arrowdown':
                focus(this.rootElement, '.bce-item-row', false);
                this.setState({ focusedRow: 0 });
                event.preventDefault();
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
    };

    /**
     * Handle pagination changes
     *
     * @param {number} newOffset - the new page offset value
     */
    paginate = (newOffset: number) => {
        this.setState({ currentOffset: newOffset }, this.refreshCollection);
    };

    /**
     * Get the current viewMode, checking local store if applicable
     *
     * @return {ViewMode}
     */
    getViewMode = (): ViewMode => this.store.getItem(localStoreViewMode) || VIEW_MODE_LIST;

    /**
     * Get the maximum number of grid view columns based on the current width of the
     * content explorer.
     *
     * @return {number}
     */
    getMaxNumberOfGridViewColumnsForWidth = (): number => {
        const { isSmall, isMedium, isLarge } = this.props;
        let maxWidthColumns = GRID_VIEW_MAX_COLUMNS;
        if (isSmall) {
            maxWidthColumns = 1;
        } else if (isMedium) {
            maxWidthColumns = 3;
        } else if (isLarge) {
            maxWidthColumns = 5;
        }
        return maxWidthColumns;
    };

    /**
     * Change the current view mode
     *
     * @param {ViewMode} viewMode - the new view mode
     * @return {void}
     */
    changeViewMode = (viewMode: ViewMode): void => {
        this.store.setItem(localStoreViewMode, viewMode);
        this.forceUpdate();
    };

    /**
     * Callback for when value of GridViewSlider changes
     *
     * @param {number} sliderValue - value of slider
     * @return {void}
     */
    onGridViewSliderChange = (sliderValue: number): void => {
        // need to do this calculation since lowest value of grid view slider
        // means highest number of columns
        const gridColumnCount = GRID_VIEW_MAX_COLUMNS - sliderValue + 1;
        this.setState({ gridColumnCount });
    };

    /**
     * Renders the file picker
     *
     * @private
     * @inheritdoc
     * @return {Element}
     */
    render() {
        const {
            language,
            messages,
            rootFolderId,
            logoUrl,
            canUpload,
            canCreateNewFolder,
            canSetShareAccess,
            canDelete,
            canRename,
            canDownload,
            canPreview,
            canShare,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            appHost,
            staticHost,
            uploadHost,
            isSmall,
            isMedium,
            isTouch,
            className,
            measureRef,
            onPreview,
            onDownload,
            onUpload,
            requestInterceptor,
            responseInterceptor,
            contentPreviewProps,
            metadataColumnsToShow,
        }: Props = this.props;

        const {
            view,
            rootName,
            currentCollection,
            currentPageSize,
            searchQuery,
            gridColumnCount,
            isDeleteModalOpen,
            isRenameModalOpen,
            isShareModalOpen,
            isUploadModalOpen,
            isPreviewModalOpen,
            isCreateFolderModalOpen,
            selected,
            isLoading,
            errorCode,
            focusedRow,
        }: State = this.state;

        const { id, offset, permissions, totalCount }: Collection = currentCollection;
        const { can_upload }: BoxItemPermission = permissions || {};
        const styleClassName = classNames('be bce', className);
        const allowUpload: boolean = canUpload && !!can_upload;
        const allowCreate: boolean = canCreateNewFolder && !!can_upload;
        const hasHeader: boolean = view !== VIEW_METADATA; // Show Header and SubHeader when it's not metadata view

        const viewMode = this.getViewMode();
        const maxGridColumnCount = this.getMaxNumberOfGridViewColumnsForWidth();

        /* eslint-disable jsx-a11y/no-static-element-interactions */
        /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
        return (
            <Internationalize language={language} messages={messages}>
                <div id={this.id} className={styleClassName} ref={measureRef} data-testid="content-explorer">
                    <div className="be-app-element" onKeyDown={this.onKeyDown} tabIndex={0}>
                        {hasHeader && (
                            <>
                                <Header
                                    view={view}
                                    isSmall={isSmall}
                                    searchQuery={searchQuery}
                                    logoUrl={logoUrl}
                                    onSearch={this.search}
                                />
                                <SubHeader
                                    view={view}
                                    viewMode={viewMode}
                                    rootId={rootFolderId}
                                    isSmall={isSmall}
                                    rootName={rootName}
                                    currentCollection={currentCollection}
                                    canUpload={allowUpload}
                                    canCreateNewFolder={allowCreate}
                                    gridColumnCount={gridColumnCount}
                                    gridMaxColumns={GRID_VIEW_MAX_COLUMNS}
                                    gridMinColumns={GRID_VIEW_MIN_COLUMNS}
                                    maxGridColumnCountForWidth={maxGridColumnCount}
                                    onUpload={this.upload}
                                    onCreate={this.createFolder}
                                    onGridViewSliderChange={this.onGridViewSliderChange}
                                    onItemClick={this.fetchFolder}
                                    onSortChange={this.sort}
                                    onViewModeChange={this.changeViewMode}
                                />
                            </>
                        )}
                        <Content
                            canDelete={canDelete}
                            canDownload={canDownload}
                            canPreview={canPreview}
                            canRename={canRename}
                            canSetShareAccess={canSetShareAccess}
                            canShare={canShare}
                            currentCollection={currentCollection}
                            focusedRow={focusedRow}
                            gridColumnCount={Math.min(gridColumnCount, maxGridColumnCount)}
                            isMedium={isMedium}
                            isSmall={isSmall}
                            isTouch={isTouch}
                            metadataColumnsToShow={metadataColumnsToShow}
                            onItemClick={this.onItemClick}
                            onItemDelete={this.delete}
                            onItemDownload={this.download}
                            onItemPreview={this.preview}
                            onItemRename={this.rename}
                            onItemSelect={this.select}
                            onItemShare={this.share}
                            onSortChange={this.sort}
                            rootElement={this.rootElement}
                            rootId={rootFolderId}
                            tableRef={this.tableRef}
                            view={view}
                            viewMode={viewMode}
                        />
                        <Footer>
                            <Pagination
                                offset={offset}
                                onChange={this.paginate}
                                pageSize={currentPageSize}
                                totalCount={totalCount}
                            />
                        </Footer>
                    </div>
                    {allowUpload && !!this.appElement ? (
                        <UploadDialog
                            isOpen={isUploadModalOpen}
                            currentFolderId={id}
                            token={token}
                            sharedLink={sharedLink}
                            sharedLinkPassword={sharedLinkPassword}
                            apiHost={apiHost}
                            uploadHost={uploadHost}
                            onClose={this.uploadSuccessHandler}
                            parentElement={this.rootElement}
                            appElement={this.appElement}
                            onUpload={onUpload}
                            requestInterceptor={requestInterceptor}
                            responseInterceptor={responseInterceptor}
                        />
                    ) : null}
                    {allowCreate && !!this.appElement ? (
                        <CreateFolderDialog
                            isOpen={isCreateFolderModalOpen}
                            onCreate={this.createFolderCallback}
                            onCancel={this.closeModals}
                            isLoading={isLoading}
                            errorCode={errorCode}
                            parentElement={this.rootElement}
                            appElement={this.appElement}
                        />
                    ) : null}
                    {canDelete && selected && !!this.appElement ? (
                        <DeleteConfirmationDialog
                            isOpen={isDeleteModalOpen}
                            onDelete={this.deleteCallback}
                            onCancel={this.closeModals}
                            item={selected}
                            isLoading={isLoading}
                            parentElement={this.rootElement}
                            appElement={this.appElement}
                        />
                    ) : null}
                    {canRename && selected && !!this.appElement ? (
                        <RenameDialog
                            isOpen={isRenameModalOpen}
                            onRename={this.renameCallback}
                            onCancel={this.closeModals}
                            item={selected}
                            isLoading={isLoading}
                            errorCode={errorCode}
                            parentElement={this.rootElement}
                            appElement={this.appElement}
                        />
                    ) : null}
                    {canShare && selected && !!this.appElement ? (
                        <ShareDialog
                            isOpen={isShareModalOpen}
                            canSetShareAccess={canSetShareAccess}
                            onShareAccessChange={this.changeShareAccess}
                            onCancel={this.refreshCollection}
                            item={selected}
                            isLoading={isLoading}
                            parentElement={this.rootElement}
                            appElement={this.appElement}
                        />
                    ) : null}
                    {canPreview && selected && !!this.appElement ? (
                        <PreviewDialog
                            isOpen={isPreviewModalOpen}
                            isTouch={isTouch}
                            onCancel={this.closeModals}
                            item={selected}
                            currentCollection={currentCollection}
                            token={token}
                            parentElement={this.rootElement}
                            appElement={this.appElement}
                            onPreview={onPreview}
                            onDownload={onDownload}
                            canDownload={canDownload}
                            cache={this.api.getCache()}
                            apiHost={apiHost}
                            appHost={appHost}
                            staticHost={staticHost}
                            sharedLink={sharedLink}
                            sharedLinkPassword={sharedLinkPassword}
                            contentPreviewProps={contentPreviewProps}
                            requestInterceptor={requestInterceptor}
                            responseInterceptor={responseInterceptor}
                        />
                    ) : null}
                </div>
            </Internationalize>
        );
        /* eslint-enable jsx-a11y/no-static-element-interactions */
        /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    }
}

export { ContentExplorer as ContentExplorerComponent };
export default flow([makeResponsive, withFeatureConsumer, withFeatureProvider])(ContentExplorer);
