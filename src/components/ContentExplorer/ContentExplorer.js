/**
 * @flow
 * @file Content Explorer Component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import uniqueid from 'lodash/uniqueId';
import cloneDeep from 'lodash/cloneDeep';
import Content from './Content';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import RenameDialog from './RenameDialog';
import CreateFolderDialog from '../CreateFolderDialog';
import ShareDialog from './ShareDialog';
import UploadDialog from '../UploadDialog';
import PreviewDialog from './PreviewDialog';
import Header from '../Header';
import SubHeader from '../SubHeader/SubHeader';
import API from '../../api';
import makeResponsive from '../makeResponsive';
import openUrlInsideIframe from '../../util/iframe';
import { isFocusableElement, isInputElement, focus } from '../../util/dom';
import Internationalize from '../Internationalize';
import {
    DEFAULT_HOSTNAME_UPLOAD,
    DEFAULT_HOSTNAME_API,
    DEFAULT_HOSTNAME_APP,
    DEFAULT_HOSTNAME_STATIC,
    DEFAULT_SEARCH_DEBOUNCE,
    SORT_ASC,
    FIELD_NAME,
    FIELD_MODIFIED_AT,
    FIELD_INTERACTED_AT,
    DEFAULT_ROOT,
    VIEW_SEARCH,
    VIEW_FOLDER,
    VIEW_ERROR,
    VIEW_RECENTS,
    TYPE_FILE,
    TYPE_WEBLINK,
    TYPE_FOLDER,
    CLIENT_NAME_CONTENT_EXPLORER,
    DEFAULT_VIEW_FILES,
    DEFAULT_VIEW_RECENTS,
    ERROR_CODE_ITEM_NAME_INVALID,
    ERROR_CODE_ITEM_NAME_TOO_LONG,
    TYPED_ID_FOLDER_PREFIX
} from '../../constants';
import type {
    BoxItem,
    Collection,
    View,
    SortDirection,
    SortBy,
    Access,
    BoxItemPermission,
    Token,
    DefaultView,
    StringMap
} from '../../flowTypes';
import '../fonts.scss';
import '../base.scss';
import '../modal.scss';

type Props = {
    rootFolderId: string,
    currentFolderId?: string,
    sortBy: SortBy,
    sortDirection: SortDirection,
    canPreview: boolean,
    canDownload: boolean,
    canDelete: boolean,
    canUpload: boolean,
    canRename: boolean,
    canShare: boolean,
    canSetShareAccess: boolean,
    canCreateNewFolder: boolean,
    apiHost: string,
    appHost: string,
    staticHost: string,
    uploadHost: string,
    token: Token,
    isSmall: boolean,
    isMedium: boolean,
    isLarge: boolean,
    isTouch: boolean,
    autoFocus: boolean,
    className: string,
    measureRef: Function,
    onDelete: Function,
    onDownload: Function,
    onPreview: Function,
    onRename: Function,
    onCreate: Function,
    onSelect: Function,
    onUpload: Function,
    onNavigate: Function,
    defaultView: DefaultView,
    hasPreviewSidebar: boolean,
    language?: string,
    messages?: StringMap,
    logoUrl?: string,
    sharedLink?: string,
    sharedLinkPassword?: string,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    onInteraction: Function
};

type State = {
    sortBy: SortBy,
    sortDirection: SortDirection,
    rootName: string,
    currentCollection: Collection,
    selected?: BoxItem,
    searchQuery: string,
    view: View,
    isDeleteModalOpen: boolean,
    isRenameModalOpen: boolean,
    isCreateFolderModalOpen: boolean,
    isShareModalOpen: boolean,
    isUploadModalOpen: boolean,
    isPreviewModalOpen: boolean,
    isLoading: boolean,
    errorCode: string,
    focusedRow: number
};

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
        hasPreviewSidebar: false,
        onInteraction: noop
    };

    /**
     * [constructor]
     *
     * @private
     * @return {ItemPicker}
     */
    constructor(props: Props) {
        super(props);

        const {
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            sortBy,
            sortDirection,
            requestInterceptor,
            responseInterceptor,
            rootFolderId
        }: Props = props;

        this.api = new API({
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            requestInterceptor,
            responseInterceptor,
            clientName: CLIENT_NAME_CONTENT_EXPLORER,
            id: `${TYPED_ID_FOLDER_PREFIX}${rootFolderId}`
        });

        this.id = uniqueid('bce_');

        this.state = {
            sortBy,
            sortDirection,
            rootName: '',
            currentCollection: {},
            searchQuery: '',
            view: VIEW_FOLDER,
            isDeleteModalOpen: false,
            isRenameModalOpen: false,
            isCreateFolderModalOpen: false,
            isShareModalOpen: false,
            isUploadModalOpen: false,
            isPreviewModalOpen: false,
            isLoading: false,
            errorCode: '',
            focusedRow: 0
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
        const { defaultView, currentFolderId }: Props = this.props;
        this.rootElement = ((document.getElementById(this.id): any): HTMLElement);
        this.appElement = ((this.rootElement.firstElementChild: any): HTMLElement);

        if (defaultView === DEFAULT_VIEW_RECENTS) {
            this.showRecents();
        } else {
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
    componentWillReceiveProps(nextProps: Props) {
        const { currentFolderId }: Props = nextProps;
        const { currentCollection: { id } }: State = this.state;

        if (typeof currentFolderId === 'string' && id !== currentFolderId) {
            this.fetchFolder(currentFolderId);
        }
    }

    /**
     * Resets the percentLoaded in the collection
     * so that the loading bar starts showing
     *
     * @private
     * @fires cancel
     * @return {void}
     */
    currentUnloadedCollection(): Collection {
        const { currentCollection }: State = this.state;
        return Object.assign(currentCollection, {
            percentLoaded: 0
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
            view: VIEW_ERROR
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
        const { currentCollection: { percentLoaded } }: State = this.state;

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
     * Refreshing the item collection depending
     * upon the view. Collection is gotten from cache.
     * Navigation event is prevented.
     *
     * @private
     * @return {void}
     */
    refreshCollection = () => {
        const { currentCollection: { id }, view, searchQuery }: State = this.state;
        if (view === VIEW_FOLDER && id) {
            this.fetchFolder(id, false);
        } else if (view === VIEW_RECENTS) {
            this.showRecents(false, false);
        } else if (view === VIEW_SEARCH && searchQuery) {
            this.search(searchQuery);
        } else {
            throw new Error('Cannot sort incompatible view!');
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
        const { id, name, boxItem }: Collection = collection;

        // New folder state
        const newState = {
            selected: undefined,
            currentCollection: collection,
            rootName: id === rootFolderId ? name : ''
        };

        // Unselect any rows that were selected
        this.unselect();

        // Close any open modals
        this.closeModals();

        if (triggerNavigationEvent) {
            // Fire folder navigation event
            this.setState(newState, this.finishNavigation);
            if (boxItem) {
                onNavigate(cloneDeep(boxItem));
            }
        } else {
            this.setState(newState);
        }
    }

    /**
     * Fetches a folder, defaults to fetching root folder
     *
     * @private
     * @param {string|void} [id] folder id
     * @param {Boolean|void} [triggerNavigationEvent] To trigger navigate event
     * @param {Boolean|void} [forceFetch] To void the cache
     * @return {void}
     */
    fetchFolder = (id?: string, triggerNavigationEvent: boolean = true, forceFetch: boolean = false) => {
        const { rootFolderId, canPreview, hasPreviewSidebar }: Props = this.props;
        const { sortBy, sortDirection }: State = this.state;
        const folderId: string = typeof id === 'string' ? id : rootFolderId;

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
            currentCollection: this.currentUnloadedCollection()
        });

        // Fetch the folder using folder API
        this.api.getFolderAPI().folder(
            folderId,
            sortBy,
            sortDirection,
            (collection: Collection) => {
                this.fetchFolderSuccessCallback(collection, triggerNavigationEvent);
            },
            this.errorCallback,
            forceFetch,
            canPreview,
            hasPreviewSidebar
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
        const { currentCollection }: State = this.state;

        // Unselect any rows that were selected
        this.unselect();

        // Close any open modals
        this.closeModals();

        this.setState({
            selected: undefined,
            currentCollection: Object.assign(currentCollection, collection)
        });
    };

    /**
     * Debounced searching
     *
     * @private
     * @param {string} id folder id
     * @param {string} query search string
     * @param {Boolean|void} [forceFetch] To void cache
     * @return {void}
     */
    debouncedSearch = debounce((id: string, query: string, forceFetch?: boolean) => {
        const { canPreview, hasPreviewSidebar }: Props = this.props;
        const { sortBy, sortDirection }: State = this.state;
        this.api
            .getSearchAPI()
            .search(
                id,
                query,
                sortBy,
                sortDirection,
                this.searchSuccessCallback,
                this.errorCallback,
                forceFetch,
                canPreview,
                hasPreviewSidebar
            );
    }, DEFAULT_SEARCH_DEBOUNCE);

    /**
     * Searches
     *
     * @private
     * @param {string} query search string
     * @param {Boolean|void} [forceFetch] To void cache
     * @return {void}
     */
    search = (query: string, forceFetch: boolean = false) => {
        const { rootFolderId }: Props = this.props;
        const { currentCollection: { id } }: State = this.state;
        const folderId = typeof id === 'string' ? id : rootFolderId;
        const trimmedQuery: string = query.trim();

        if (!query) {
            // Query was cleared out, load the prior folder
            // The prior folder is always the parent folder for search
            this.fetchFolder(folderId, false);
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
            selected: undefined,
            searchQuery: query,
            view: VIEW_SEARCH,
            currentCollection: this.currentUnloadedCollection()
        });

        this.debouncedSearch(folderId, query, forceFetch);
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
        // Unselect any rows that were selected
        this.unselect();

        // Set the new state and focus the grid for tabbing
        const newState = { currentCollection: collection };
        if (triggerNavigationEvent) {
            this.setState(newState, this.finishNavigation);
        } else {
            this.setState(newState);
        }
    }

    /**
     * Shows recents.
     * We always try to force fetch recents.
     *
     * @private
     * @param {Boolean|void} [triggerNavigationEvent] To trigger navigate event
     * @param {Boolean|void} [forceFetch] To void cache
     * @return {void}
     */
    showRecents(triggerNavigationEvent: boolean = true, forceFetch: boolean = true): void {
        const { rootFolderId, canPreview, hasPreviewSidebar }: Props = this.props;
        const { sortBy, sortDirection }: State = this.state;

        // Recents are sorted by a different date field than the rest
        const by = sortBy === FIELD_MODIFIED_AT ? FIELD_INTERACTED_AT : sortBy;

        // Reset search state, the view and show busy indicator
        this.setState({
            searchQuery: '',
            view: VIEW_RECENTS,
            currentCollection: this.currentUnloadedCollection()
        });

        // Fetch the folder using folder API
        this.api.getRecentsAPI().recents(
            rootFolderId,
            by,
            sortDirection,
            (collection: Collection) => {
                this.recentsSuccessCallback(collection, triggerNavigationEvent);
            },
            this.errorCallback,
            forceFetch,
            canPreview,
            hasPreviewSidebar
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
        const { currentCollection: { id, permissions } }: State = this.state;
        const { canUpload }: Props = this.props;
        if (!canUpload || !id || !permissions) {
            return;
        }

        const { can_upload }: BoxItemPermission = permissions;
        if (!can_upload) {
            return;
        }

        this.setState({
            isUploadModalOpen: true
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
        const { currentCollection: { id } }: State = this.state;
        this.fetchFolder(id, false, true);
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
     * @param {string} sortBy - field to sorty by
     * @param {string} sortDirection - sort direction
     * @return {void}
     */
    sort = (sortBy: SortBy, sortDirection: SortDirection) => {
        const { currentCollection: { id } }: State = this.state;
        if (id) {
            this.setState({ sortBy, sortDirection }, this.refreshCollection);
        }
    };

    /**
     * Unselects an item
     *
     * @private
     * @param {Object} item - file or folder object
     * @param {Function|void} [onSelect] - optional on select callback
     * @return {void}
     */
    unselect(): void {
        const { selected }: State = this.state;
        if (selected) {
            selected.selected = false;
        }
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
        const { selected, currentCollection: { items = [] } }: State = this.state;
        const { onSelect }: Props = this.props;

        if (item === selected) {
            callback(item);
            return;
        }

        this.unselect();
        item.selected = true;

        const focusedRow = items.findIndex((i: BoxItem) => i.id === item.id);
        this.setState({ focusedRow, selected: item }, () => {
            onSelect(cloneDeep([item]));
            callback(item);
        });
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
            this.api.getFileAPI().getDownloadUrl(id, openUrl, noop);
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
        this.api.getAPI(type).delete(selected, () => {
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
            this.setState({ errorCode: ERROR_CODE_ITEM_NAME_INVALID, isLoading: false });
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
            }
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
            this.setState({ errorCode: ERROR_CODE_ITEM_NAME_INVALID, isLoading: false });
            return;
        }

        if (name.length > 255) {
            this.setState({ errorCode: ERROR_CODE_ITEM_NAME_TOO_LONG, isLoading: false });
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
                    isLoading: false
                });
            }
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

        this.setState({ isShareModalOpen: true });
    };

    /**
     * Saves reference to table component
     *
     * @private
     * @param {Component} react component
     * @return {void}
     */
    tableRef = (table: React$Component<*, *, *>): void => {
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
            isPreviewModalOpen: false
        });

        const { selected, currentCollection: { items = [] } }: State = this.state;
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
            onUpload,
            hasPreviewSidebar,
            onInteraction,
            requestInterceptor,
            responseInterceptor
        }: Props = this.props;

        const {
            view,
            rootName,
            currentCollection,
            searchQuery,
            isDeleteModalOpen,
            isRenameModalOpen,
            isShareModalOpen,
            isUploadModalOpen,
            isPreviewModalOpen,
            isCreateFolderModalOpen,
            selected,
            isLoading,
            errorCode,
            focusedRow
        }: State = this.state;

        const { id, permissions }: Collection = currentCollection;
        const { can_upload }: BoxItemPermission = permissions || {};
        const styleClassName = classNames('be bce', className);
        const allowUpload: boolean = canUpload && !!can_upload;
        const allowCreate: boolean = canCreateNewFolder && !!can_upload;

        /* eslint-disable jsx-a11y/no-static-element-interactions */
        /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
        return (
            <Internationalize language={language} messages={messages}>
                <div id={this.id} className={styleClassName} ref={measureRef}>
                    <div className='be-app-element' onKeyDown={this.onKeyDown} tabIndex={0}>
                        <Header
                            view={view}
                            isSmall={isSmall}
                            searchQuery={searchQuery}
                            logoUrl={logoUrl}
                            onSearch={this.search}
                        />
                        <SubHeader
                            view={view}
                            rootId={rootFolderId}
                            isSmall={isSmall}
                            rootName={rootName}
                            rootElement={this.rootElement}
                            currentCollection={currentCollection}
                            canUpload={allowUpload}
                            canCreateNewFolder={allowCreate}
                            onUpload={this.upload}
                            onCreate={this.createFolder}
                            onItemClick={this.fetchFolder}
                            onSortChange={this.sort}
                        />
                        <Content
                            view={view}
                            rootId={rootFolderId}
                            isSmall={isSmall}
                            isMedium={isMedium}
                            isTouch={isTouch}
                            rootElement={this.rootElement}
                            focusedRow={focusedRow}
                            canSetShareAccess={canSetShareAccess}
                            canShare={canShare}
                            canPreview={canPreview}
                            canDelete={canDelete}
                            canRename={canRename}
                            canDownload={canDownload}
                            currentCollection={currentCollection}
                            tableRef={this.tableRef}
                            onItemSelect={this.select}
                            onItemClick={this.onItemClick}
                            onItemDelete={this.delete}
                            onItemDownload={this.download}
                            onItemRename={this.rename}
                            onItemShare={this.share}
                            onItemPreview={this.preview}
                            onSortChange={this.sort}
                        />
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
                            hasPreviewSidebar={hasPreviewSidebar}
                            cache={this.api.getCache()}
                            apiHost={apiHost}
                            appHost={appHost}
                            staticHost={staticHost}
                            sharedLink={sharedLink}
                            sharedLinkPassword={sharedLinkPassword}
                            onInteraction={onInteraction}
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

export default makeResponsive(ContentExplorer);
