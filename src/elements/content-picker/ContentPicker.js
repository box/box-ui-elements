/**
 * @flow
 * @file Content Picker Component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import uniqueid from 'lodash/uniqueId';
import noop from 'lodash/noop';
import Header from 'elements/common/header';
import SubHeader from 'elements/common/sub-header/SubHeader';
import UploadDialog from 'elements/common/upload-dialog';
import CreateFolderDialog from 'elements/common/create-folder-dialog';
import Internationalize from 'elements/common/Internationalize';
import makeResponsive from 'elements/common/makeResponsive';
import Pagination from 'elements/common/pagination/Pagination';
import { isFocusableElement, isInputElement, focus } from 'utils/dom';
import API from 'api';
import Content from './Content';
import Footer from './Footer';
import {
    DEFAULT_HOSTNAME_UPLOAD,
    DEFAULT_HOSTNAME_API,
    DEFAULT_SEARCH_DEBOUNCE,
    SORT_ASC,
    FIELD_NAME,
    DEFAULT_ROOT,
    VIEW_SEARCH,
    VIEW_FOLDER,
    VIEW_SELECTED,
    VIEW_ERROR,
    VIEW_RECENTS,
    TYPE_FILE,
    TYPE_FOLDER,
    TYPE_WEBLINK,
    CLIENT_NAME_CONTENT_PICKER,
    DEFAULT_PAGE_NUMBER,
    DEFAULT_PAGE_SIZE,
    DEFAULT_VIEW_FILES,
    DEFAULT_VIEW_RECENTS,
    ERROR_CODE_ITEM_NAME_INVALID,
    ERROR_CODE_ITEM_NAME_TOO_LONG,
    ERROR_CODE_ITEM_NAME_IN_USE,
    TYPED_ID_FOLDER_PREFIX,
} from '../../constants';
import 'elements/common/fonts.scss';
import 'elements/common/base.scss';
import 'elements/common/modal.scss';

type Props = {
    type: string,
    rootFolderId: string,
    currentFolderId?: string,
    onChoose: Function,
    onCancel: Function,
    sortBy: SortBy,
    sortDirection: SortDirection,
    extensions: string[],
    maxSelectable: number,
    canUpload: boolean,
    canSetShareAccess: boolean,
    canCreateNewFolder: boolean,
    autoFocus: boolean,
    apiHost: string,
    uploadHost: string,
    clientName: string,
    token: Token,
    isSmall: boolean,
    isLarge: boolean,
    isTouch: boolean,
    className: string,
    measureRef?: Function,
    defaultView: DefaultView,
    chooseButtonLabel?: string,
    cancelButtonLabel?: string,
    language?: string,
    messages?: StringMap,
    logoUrl?: string,
    sharedLink?: string,
    sharedLinkPassword?: string,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    initialPage: number,
    initialPageSize: number,
};

type State = {
    sortBy: SortBy,
    sortDirection: SortDirection,
    rootName: string,
    errorCode: string,
    currentCollection: Collection,
    currentOffset: number,
    currentPageSize: number,
    selected: { [string]: BoxItem },
    searchQuery: string,
    isLoading: boolean,
    view: View,
    isUploadModalOpen: boolean,
    isCreateFolderModalOpen: boolean,
    focusedRow: number,
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
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            initialPage,
            initialPageSize,
            sortBy,
            sortDirection,
            clientName,
            requestInterceptor,
            responseInterceptor,
            rootFolderId,
        } = props;

        this.api = new API({
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            clientName,
            requestInterceptor,
            responseInterceptor,
            id: `${TYPED_ID_FOLDER_PREFIX}${rootFolderId}`,
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
    componentWillReceiveProps(nextProps: Props) {
        const { currentFolderId }: Props = nextProps;
        const {
            currentCollection: { id },
        }: State = this.state;

        if (typeof currentFolderId === 'string' && id !== currentFolderId) {
            this.fetchFolder(currentFolderId);
        }
    }

    /**
     * Choose button action.
     * Clones values before returning so that
     * object references are broken. Also cleans
     * up the selected attribute since it was
     * added by the file picker.
     *
     * @private
     * @fires choose
     * @return {void}
     */
    choose = (): void => {
        const { selected }: State = this.state;
        const { onChoose }: Props = this.props;
        const results: BoxItem[] = Object.keys(selected).map(key => {
            const clone: BoxItem = Object.assign({}, selected[key]);
            delete clone.selected;
            return clone;
        });
        onChoose(results);
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
        const { selected }: State = this.state;

        // Clear out the selected field
        Object.keys(selected).forEach(key => delete selected[key].selected);

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
        const { rootFolderId }: Props = this.props;
        const { id, name }: Collection = collection;

        // New folder state
        const newState = {
            currentCollection: collection,
            rootName: id === rootFolderId ? name : '',
        };

        // Close any open modals
        this.closeModals();

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
            () => {
                this.fetchFolder(id);
            },
            ({ response: { status } }) => {
                this.setState({
                    errorCode: status === 409 ? ERROR_CODE_ITEM_NAME_IN_USE : ERROR_CODE_ITEM_NAME_INVALID,
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
     * @return {void}
     */
    select = (item: BoxItem): void => {
        const { type: selectableType, maxSelectable }: Props = this.props;
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
            // prior item that was item that was selected.

            // Check if we hit the selection limit
            // Ignore when in single file selection mode.
            if (hasHitSelectionLimit && !isSingleFileSelection) {
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
            this.refreshCollection();
            if (item.selected) {
                this.select(updatedItem);
            }
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
            extensions,
            maxSelectable,
            type,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            isSmall,
            className,
            measureRef,
            chooseButtonLabel,
            cancelButtonLabel,
            requestInterceptor,
            responseInterceptor,
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
        const hasHitSelectionLimit: boolean = selectedCount === maxSelectable && maxSelectable !== 1;
        const allowUpload: boolean = canUpload && !!can_upload;
        const allowCreate: boolean = canCreateNewFolder && !!can_upload;
        const styleClassName = classNames('be bcp', className);

        /* eslint-disable jsx-a11y/no-static-element-interactions */
        /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
        return (
            <Internationalize language={language} messages={messages}>
                <div id={this.id} className={styleClassName} ref={measureRef}>
                    <div className="be-app-element" onKeyDown={this.onKeyDown} tabIndex={0}>
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
                            tableRef={this.tableRef}
                            onItemSelect={this.select}
                            onItemClick={this.onItemClick}
                            onFocusChange={this.onFocusChange}
                            onShareAccessChange={this.changeShareAccess}
                        />
                        <Footer
                            selectedCount={selectedCount}
                            hasHitSelectionLimit={hasHitSelectionLimit}
                            onSelectedClick={this.showSelected}
                            onChoose={this.choose}
                            onCancel={this.cancel}
                            chooseButtonLabel={chooseButtonLabel}
                            cancelButtonLabel={cancelButtonLabel}
                        >
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
