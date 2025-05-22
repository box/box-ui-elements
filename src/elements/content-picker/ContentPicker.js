/**
 * @flow
 * @file Content Picker Component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import type { Node } from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import getProp from 'lodash/get';
import uniqueid from 'lodash/uniqueId';
import noop from 'lodash/noop';
import Header from '../common/header';
import SubHeader from '../common/sub-header/SubHeader';
import UploadDialog from '../common/upload-dialog';
import CreateFolderDialog from '../common/create-folder-dialog';
import Internationalize from '../common/Internationalize';
import makeResponsive from '../common/makeResponsive';
// $FlowFixMe TypeScript file
import ThemingStyles from '../common/theming';
import Pagination from '../../features/pagination';
import { isFocusableElement, isInputElement, focus } from '../../utils/dom';
import API from '../../api';
import Content from './Content';
import Footer from './Footer';
import {
    CLIENT_NAME_CONTENT_PICKER,
    DEFAULT_HOSTNAME_API,
    DEFAULT_HOSTNAME_UPLOAD,
    DEFAULT_PAGE_NUMBER,
    DEFAULT_PAGE_SIZE,
    DEFAULT_ROOT,
    DEFAULT_SEARCH_DEBOUNCE,
    DEFAULT_VIEW_FILES,
    DEFAULT_VIEW_RECENTS,
    ERROR_CODE_ITEM_NAME_INVALID,
    ERROR_CODE_ITEM_NAME_TOO_LONG,
    FIELD_NAME,
    FIELD_PERMISSIONS_CAN_SHARE,
    FIELD_SHARED_LINK,
    SORT_ASC,
    TYPE_FILE,
    TYPE_FOLDER,
    TYPE_WEBLINK,
    TYPED_ID_FOLDER_PREFIX,
    VIEW_ERROR,
    VIEW_FOLDER,
    VIEW_RECENTS,
    VIEW_SEARCH,
    VIEW_SELECTED,
} from '../../constants';
import { FILE_SHARED_LINK_FIELDS_TO_FETCH } from '../../utils/fields';
// $FlowFixMe TypeScript file
import type { Theme } from '../common/theming';
import type { ElementsXhrError } from '../../common/types/api';
import type {
    View,
    DefaultView,
    StringAnyMap,
    StringMap,
    SortBy,
    SortDirection,
    Token,
    Access,
    BoxItemPermission,
    BoxItem,
    Collection,
} from '../../common/types/core';
// $FlowFixMe TypeScript file
import type { ItemAction } from '../common/item';

import '../common/fonts.scss';
import '../common/base.scss';
import '../common/modal.scss';
import './ContentPicker.scss';

type Props = {
    apiHost: string,
    autoFocus: boolean,
    canCreateNewFolder: boolean,
    canSetShareAccess: boolean,
    canUpload: boolean,
    cancelButtonLabel?: string,
    chooseButtonLabel?: string,
    className: string,
    clearSelectedItemsOnNavigation: boolean,
    clientName: string,
    contentUploaderProps: ContentUploaderProps,
    currentFolderId?: string,
    defaultView: DefaultView,
    extensions: string[],
    initialPage: number,
    initialPageSize: number,
    isHeaderLogoVisible?: boolean,
    isLarge: boolean,
    isPaginationVisible?: boolean,
    isSmall: boolean,
    isTouch: boolean,
    itemActions?: ItemAction[],
    language?: string,
    logoUrl?: string,
    maxSelectable: number,
    measureRef?: Function,
    messages?: StringMap,
    onCancel: Function,
    onChoose: Function,
    renderCustomActionButtons?: ({
        onCancel: Function,
        onChoose: Function,
        selectedCount: number,
        selectedItems: BoxItem[],
    }) => Node,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    rootFolderId: string,
    sharedLink?: string,
    sharedLinkPassword?: string,
    showSelectedButton: boolean,
    sortBy: SortBy,
    sortDirection: SortDirection,
    theme?: Theme,
    token: Token,
    type: string,
    uploadHost: string,
};

type State = {
    currentCollection: Collection,
    currentOffset: number,
    currentPageSize: number,
    errorCode: string,
    focusedRow: number,
    isCreateFolderModalOpen: boolean,
    isLoading: boolean,
    isUploadModalOpen: boolean,
    rootName: string,
    searchQuery: string,
    selected: { [string]: BoxItem },
    sortBy: SortBy,
    sortDirection: SortDirection,
    view: View,
};

const defaultType = `${TYPE_FILE},${TYPE_WEBLINK}`;

class ContentPicker extends Component<Props, State> {
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
        type: defaultType,
        rootFolderId: DEFAULT_ROOT,
        onChoose: noop,
        onCancel: noop,
        initialPage: DEFAULT_PAGE_NUMBER,
        initialPageSize: DEFAULT_PAGE_SIZE,
        sortBy: FIELD_NAME,
        sortDirection: SORT_ASC,
        extensions: [],
        maxSelectable: Infinity,
        canUpload: true,
        canSetShareAccess: true,
        canCreateNewFolder: true,
        autoFocus: false,
        className: '',
        apiHost: DEFAULT_HOSTNAME_API,
        uploadHost: DEFAULT_HOSTNAME_UPLOAD,
        clientName: CLIENT_NAME_CONTENT_PICKER,
        defaultView: DEFAULT_VIEW_FILES,
        contentUploaderProps: {},
        showSelectedButton: true,
        clearSelectedItemsOnNavigation: false,
        isHeaderLogoVisible: true,
        isPaginationVisible: true,
        itemActions: [],
    };

    /**
     * [constructor]
     *
     * @private
     * @return {ContentPicker}
     */
    constructor(props: Props) {
        super(props);

        const {
            apiHost,
            clientName,
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
        } = props;

        this.api = new API({
            apiHost,
            clientName,
            id: `${TYPED_ID_FOLDER_PREFIX}${rootFolderId}`,
            language,
            requestInterceptor,
            responseInterceptor,
            sharedLink,
            sharedLinkPassword,
            token,
            uploadHost,
        });

        this.id = uniqueid('bcp_');

        this.state = {
            sortBy,
            sortDirection,
            rootName: '',
            currentCollection: {},
            currentOffset: initialPageSize * (initialPage - 1),
            currentPageSize: initialPageSize,
            selected: {},
            searchQuery: '',
            view: VIEW_FOLDER,
            isCreateFolderModalOpen: false,
            isUploadModalOpen: false,
            focusedRow: 0,
            isLoading: false,
            errorCode: '',
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
     * Gets selected items from state.
     * Clones values before returning so that
     * object references are broken. Also cleans
     * up the selected attribute since it was
     * added by the file picker.
     *
     * @private
     * @return {BoxItem[]}
     */
    getSelectedItems = (): BoxItem[] => {
        const { selected }: State = this.state;
        return Object.keys(selected).map(key => {
            const clone: BoxItem = { ...selected[key] };
            delete clone.selected;
            return clone;
        });
    };

    /**
     * Choose button action.
     *
     * @private
     * @fires choose
     * @return {void}
     */
    choose = (): void => {
        const { onChoose }: Props = this.props;
        const results = this.getSelectedItems();
        onChoose(results);
    };

    /**
     * Deletes selected keys off of selected items in state.
     *
     * @private
     * @return {void}
     */
    deleteSelectedKeys = (): void => {
        const { selected }: State = this.state;

        // Clear out the selected field
        Object.keys(selected).forEach(key => delete selected[key].selected);
    };

    /**
     * Cancel button action
     *
     * @private
     * @fires cancel
     * @return {void}
     */
    cancel = (): void => {
        const { onCancel }: Props = this.props;

        this.deleteSelectedKeys();

        // Reset the selected state
        this.setState({ selected: {} }, () => onCancel());
    };

    /**
     * Resets the percentLoaded in the collection
     * so that the loading bar starts showing
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
     * Refreshing the item collection depending
     * upon the view. Collection is gotten from cache.
     * Navigation event is prevented.
     *
     * @private
     * @return {void}
     */
    refreshCollection = (): void => {
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
        } else if (view === VIEW_SELECTED) {
            this.showSelected();
        } else {
            throw new Error('Cannot refresh incompatible view!');
        }
    };

    /**
     * Network error callback
     *
     * @private
     * @param {Error} error error object
     * @return {void}
     */
    errorCallback = (error: ElementsXhrError, code: string): void => {
        this.setState({ view: VIEW_ERROR });
        /* eslint-disable no-console */
        console.error(error, code);
        /* eslint-enable no-console */
    };

    /**
     * Action performed when clicking on an item
     *
     * @private
     * @param {Object|string} item - the clicked box item
     * @return {void}
     */
    onItemClick = (item: BoxItem | string): void => {
        // If the id was passed in, just use that
        if (typeof item === 'string') {
            this.fetchFolder(item);
            return;
        }

        // If the item was passed in
        const { id, type }: BoxItem = item;
        if (type === TYPE_FOLDER) {
            this.fetchFolder(id);
        }
    };

    /**
     * Focuses the grid
     *
     * @private
     * @return {void}
     */
    finishNavigation(): void {
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
            focus(this.rootElement, '.bcp-item-row');
            this.setState({ focusedRow: 0 });
        }

        this.firstLoad = false;
    }

    /**
     * Folder fetch success callback
     *
     * @private
     * @param {Object} collection item collection object
     * @param {Boolean|void} triggerNavigationEvent - To focus the grid
     * @return {void}
     */
    fetchFolderSuccessCallback(collection: Collection, triggerNavigationEvent: boolean): void {
        const { clearSelectedItemsOnNavigation, rootFolderId }: Props = this.props;
        const { id, name }: Collection = collection;

        const commonState = {
            currentCollection: collection,
            rootName: id === rootFolderId ? name : '',
        };

        // New folder state
        const newState = clearSelectedItemsOnNavigation ? { ...commonState, selected: {} } : commonState;

        // Close any open modals
        this.closeModals();

        // Deletes selected keys
        if (clearSelectedItemsOnNavigation) {
            this.deleteSelectedKeys();
        }

        if (triggerNavigationEvent) {
            // Fire folder navigation event
            this.setState(newState, this.finishNavigation);
        } else {
            this.setState(newState);
        }
    }

    /**
     * Fetches a folder, defaults to fetching root folder
     *
     * @private
     * @param {string|void} [id] folder id
     * @param {Boolean|void} [triggerNavigationEvent] - To focus the grid
     * @return {void}
     */
    fetchFolder = (id?: string, triggerNavigationEvent?: boolean = true): void => {
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
            { forceFetch: true },
        );
    };

    /**
     * Recents fetch success callback
     *
     * @private
     * @param {Object} collection item collection object
     * @param {Boolean|void} [triggerNavigationEvent] To trigger navigate event
     * @return {void}
     */
    recentsSuccessCallback(collection: Collection, triggerNavigationEvent: boolean): void {
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
            { forceFetch: true },
        );
    }

    /**
     * Shows the selected items
     *
     * @private
     * @return {void}
     */
    showSelected = (): void => {
        const { selected, sortBy, sortDirection }: State = this.state;
        this.setState(
            {
                searchQuery: '',
                view: VIEW_SELECTED,
                currentCollection: {
                    sortBy,
                    sortDirection,
                    percentLoaded: 100,
                    items: Object.keys(selected).map(key => this.api.getCache().get(key)),
                },
            },
            this.finishNavigation,
        );
    };

    /**
     * Search success callback
     *
     * @private
     * @param {Object} collection item collection object
     * @return {void}
     */
    searchSuccessCallback = (collection: Collection): void => {
        const { currentCollection }: State = this.state;
        this.setState({
            currentCollection: Object.assign(currentCollection, collection),
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
    debouncedSearch: Function = debounce((id: string, query: string): void => {
        const { currentOffset, currentPageSize }: State = this.state;

        this.api
            .getSearchAPI()
            .search(id, query, currentPageSize, currentOffset, this.searchSuccessCallback, this.errorCallback, {
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
    search = (query: string): void => {
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
            searchQuery: query,
            view: VIEW_SEARCH,
            currentCollection: this.currentUnloadedCollection(),
            currentOffset: trimmedQuery === searchQuery ? currentOffset : 0,
        });

        this.debouncedSearch(folderId, query);
    };

    /**
     * Uploads
     *
     * @private
     * @param {File} file dom file object
     * @return {void}
     */
    upload = (): void => {
        const {
            currentCollection: { id, permissions },
        }: State = this.state;
        const { canUpload }: Props = this.props;
        if (!id || !permissions) {
            return;
        }

        const { can_upload: canUploadPermission }: BoxItemPermission = permissions;
        if (!canUpload || !canUploadPermission) {
            return;
        }

        this.setState({ isUploadModalOpen: true });
    };

    /**
     * Upload success handler
     *
     * @private
     * @param {File} file dom file object
     * @return {void}
     */
    uploadSuccessHandler = (): void => {
        const {
            currentCollection: { id },
        }: State = this.state;
        this.fetchFolder(id, false);
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
        const { canCreateNewFolder }: Props = this.props;
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

        if (!name.trim()) {
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
            name.trim(),
            () => {
                this.fetchFolder(id);
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
     * Selects or unselects an item
     *
     * @private
     * @param {Object} item file or folder object
     * @param {boolean} options.forceSharedLink Force a shared link if no link exists
     * @return {void}
     */
    select = (item: BoxItem, { forceSharedLink = true }: StringAnyMap = {}): void => {
        const { canSetShareAccess, type: selectableType, maxSelectable }: Props = this.props;
        const {
            view,
            selected,
            currentCollection: { items = [] },
        }: State = this.state;
        const { id, type }: BoxItem = item;

        if (!id || !type || selectableType.indexOf(type) === -1) {
            return;
        }

        const selectedKeys: Array<string> = Object.keys(selected);
        const selectedCount: number = selectedKeys.length;
        const hasHitSelectionLimit: boolean = selectedCount === maxSelectable;
        const isSingleFileSelection: boolean = maxSelectable === 1;
        const cacheKey: string = this.api.getAPI(type).getCacheKey(id);
        const existing: BoxItem = selected[cacheKey];
        const existingFromCache: BoxItem = this.api.getCache().get(cacheKey);
        const existInSelected = selectedKeys.indexOf(cacheKey) !== -1;

        // Existing object could have mutated and we just need to update the
        // reference in the selected map. In that case treat it like a new selection.
        if (existing && existing === existingFromCache) {
            // We are selecting the same item that was already
            // selected. Unselect it in this case. Toggle case.
            delete existing.selected;
            delete selected[cacheKey];
        } else {
            // We are selecting a new item that was never
            // selected before. However if we are in a single
            // item selection mode, we should also unselect any
            // prior item that was selected.

            // Check if we hit the selection limit and if selection
            // is not already currently in the selected data structure.
            // Ignore when in single file selection mode.
            if (hasHitSelectionLimit && !isSingleFileSelection && !existInSelected) {
                return;
            }

            // Clear out the prior item for single file selection mode
            if (selectedCount > 0 && isSingleFileSelection) {
                const prior = selectedKeys[0]; // only one item
                delete selected[prior].selected;
                delete selected[prior];
            }

            // Select the new item
            item.selected = true;
            selected[cacheKey] = item;

            // If can set share access, fetch the shared link properties of the item
            // In the case where another item is selected, any in flight XHR will get
            // cancelled
            if (canSetShareAccess && forceSharedLink) {
                this.fetchSharedLinkInfo(item);
            }
        }

        const focusedRow = items.findIndex((i: BoxItem) => i.id === item.id);
        this.setState({ selected, focusedRow }, () => {
            if (view === VIEW_SELECTED) {
                // Need to refresh the selected view
                this.showSelected();
            }
        });
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
    handleSharedLinkSuccess = async (item: BoxItem) => {
        const { selected } = this.state;
        const { id, type } = item;
        // $FlowFixMe
        const cacheKey = this.api.getAPI(type).getCacheKey(id);
        let updatedItem = item;

        // if there is no shared link, create one with enterprise default access
        if (!item[FIELD_SHARED_LINK] && getProp(item, FIELD_PERMISSIONS_CAN_SHARE, false)) {
            // $FlowFixMe
            await this.api.getAPI(item.type).share(item, undefined, (sharedItem: BoxItem) => {
                updatedItem = sharedItem;
            });
        }

        this.updateItemInCollection(updatedItem);
        if (updatedItem.selected && updatedItem !== selected[cacheKey]) {
            this.select(updatedItem, { forceSharedLink: false });
        }
    };

    /**
     * Changes the share access of an item
     *
     * @private
     * @param {string} access share access
     * @param {Object} item file or folder object
     * @return {void}
     */
    changeShareAccess = (access: Access, item: BoxItem): void => {
        const { canSetShareAccess }: Props = this.props;
        if (!item || !canSetShareAccess) {
            return;
        }

        const { permissions, type }: BoxItem = item;
        if (!permissions || !type) {
            return;
        }

        const { can_set_share_access }: BoxItemPermission = permissions;
        if (!can_set_share_access) {
            return;
        }

        this.api.getAPI(type).share(item, access, (updatedItem: BoxItem) => {
            this.updateItemInCollection(updatedItem);
            if (item.selected) {
                this.select(updatedItem, { forceSharedLink: false });
            }
        });
    };

    /**
     * Updates the BoxItem in the state's currentCollection
     *
     * @param {Object} item file or folder object
     * @returns {void}
     */
    updateItemInCollection = (item: BoxItem) => {
        const { currentCollection } = this.state;
        const { items = [] } = currentCollection;
        const newState = {
            currentCollection: {
                ...currentCollection,
                items: items.map(collectionItem => (collectionItem.id === item.id ? item : collectionItem)),
            },
        };
        this.setState(newState);
    };

    /**
     * Changes the sort by and sort direction
     *
     * @private
     * @param {string} sortBy - field to sorty by
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
     * Saves reference to table component
     *
     * @private
     * @param {Component} react component
     * @return {void}
     */
    tableRef = (table: React$Component<*, *>) => {
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
            isCreateFolderModalOpen: false,
            isUploadModalOpen: false,
        });

        const {
            selected,
            currentCollection: { items = [] },
        }: State = this.state;
        if (selected && items.length > 0) {
            focus(this.rootElement, `.bcp-item-row-${focusedRow}`);
        }
    };

    /**
     * Keyboard events
     *
     * @private
     * @inheritdoc
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
                focus(this.rootElement, '.bcp-item-row', false);
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
            case 'c':
                if (this.globalModifier) {
                    this.choose();
                    event.preventDefault();
                }

                break;
            case 'x':
                if (this.globalModifier) {
                    this.cancel();
                    event.preventDefault();
                }

                break;
            case 's':
                if (this.globalModifier) {
                    this.showSelected();
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
     * Updates the focused row based on key binder
     *
     * @private
     * @param {number} focusedRow - the row index thats focused
     * @return {void}
     */
    onFocusChange = (focusedRow: number) => {
        this.setState({ focusedRow });
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
            canSetShareAccess,
            canCreateNewFolder,
            contentUploaderProps,
            extensions,
            maxSelectable,
            type,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            isHeaderLogoVisible,
            isPaginationVisible,
            isSmall,
            className,
            measureRef,
            chooseButtonLabel,
            cancelButtonLabel,
            requestInterceptor,
            responseInterceptor,
            renderCustomActionButtons,
            showSelectedButton,
            theme,
            itemActions,
        }: Props = this.props;
        const {
            view,
            rootName,
            selected,
            currentCollection,
            currentPageSize,
            searchQuery,
            isCreateFolderModalOpen,
            isUploadModalOpen,
            isLoading,
            errorCode,
            focusedRow,
        }: State = this.state;
        const { id, offset, permissions, totalCount }: Collection = currentCollection;
        const { can_upload }: BoxItemPermission = permissions || {};
        const selectedCount: number = Object.keys(selected).length;
        const isSingleSelect = maxSelectable === 1;
        const hasHitSelectionLimit: boolean = selectedCount === maxSelectable && !isSingleSelect;
        const allowUpload: boolean = canUpload && !!can_upload;
        const allowCreate: boolean = canCreateNewFolder && !!can_upload;
        const styleClassName = classNames('be bcp', className);

        /* eslint-disable jsx-a11y/no-static-element-interactions */
        /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
        return (
            <Internationalize language={language} messages={messages}>
                <div id={this.id} className={styleClassName} ref={measureRef} data-testid="content-picker">
                    <ThemingStyles theme={theme} />
                    <div className="be-app-element" onKeyDown={this.onKeyDown} tabIndex={0}>
                        <Header
                            view={view}
                            isHeaderLogoVisible={isHeaderLogoVisible}
                            searchQuery={searchQuery}
                            logoUrl={logoUrl}
                            onSearch={this.search}
                        />
                        <SubHeader
                            view={view}
                            rootId={rootFolderId}
                            isSmall={isSmall}
                            rootName={rootName}
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
                            isSmall={isSmall}
                            rootId={rootFolderId}
                            rootElement={this.rootElement}
                            focusedRow={focusedRow}
                            selectableType={type}
                            canSetShareAccess={canSetShareAccess}
                            extensionsWhitelist={extensions}
                            hasHitSelectionLimit={hasHitSelectionLimit}
                            currentCollection={currentCollection}
                            isSingleSelect={isSingleSelect}
                            tableRef={this.tableRef}
                            onItemSelect={this.select}
                            onItemClick={this.onItemClick}
                            onFocusChange={this.onFocusChange}
                            onShareAccessChange={this.changeShareAccess}
                            itemActions={itemActions}
                        />
                        <Footer
                            currentCollection={currentCollection}
                            selectedCount={selectedCount}
                            selectedItems={this.getSelectedItems()}
                            showSelectedButton={showSelectedButton}
                            hasHitSelectionLimit={hasHitSelectionLimit}
                            isSingleSelect={isSingleSelect}
                            onSelectedClick={this.showSelected}
                            onChoose={this.choose}
                            onCancel={this.cancel}
                            chooseButtonLabel={chooseButtonLabel}
                            cancelButtonLabel={cancelButtonLabel}
                            renderCustomActionButtons={renderCustomActionButtons}
                        >
                            {isPaginationVisible ? (
                                <Pagination
                                    offset={offset}
                                    onOffsetChange={this.paginate}
                                    pageSize={currentPageSize}
                                    totalCount={totalCount}
                                />
                            ) : null}
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
                            contentUploaderProps={contentUploaderProps}
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
                </div>
            </Internationalize>
        );
        /* eslint-enable jsx-a11y/no-static-element-interactions */
        /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    }
}

export { ContentPicker as ContentPickerComponent };
export default makeResponsive(ContentPicker);
