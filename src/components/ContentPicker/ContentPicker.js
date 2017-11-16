/**
 * @flow
 * @file Content Picker Component
 * @author Box
 */

import React, { Component } from 'react';
import classNames from 'classnames';
import Modal from 'react-modal';
import debounce from 'lodash.debounce';
import uniqueid from 'lodash.uniqueid';
import noop from 'lodash.noop';
import Footer from './Footer';
import Content from './Content';
import Header from '../Header';
import SubHeader from '../SubHeader/SubHeader';
import UploadDialog from '../UploadDialog';
import CreateFolderDialog from '../CreateFolderDialog';
import API from '../../api';
import makeResponsive from '../makeResponsive';
import { isFocusableElement, isInputElement, focus } from '../../util/dom';
import Internationalize from '../Internationalize';
import {
    DEFAULT_HOSTNAME_UPLOAD,
    DEFAULT_HOSTNAME_API,
    DEFAULT_SEARCH_DEBOUNCE,
    SORT_ASC,
    FIELD_NAME,
    FIELD_MODIFIED_AT,
    FIELD_INTERACTED_AT,
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
    DEFAULT_VIEW_FILES,
    DEFAULT_VIEW_RECENTS,
    ERROR_CODE_ITEM_NAME_INVALID,
    ERROR_CODE_ITEM_NAME_TOO_LONG,
    ERROR_CODE_ITEM_NAME_IN_USE,
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

type BoxItemMap = { [string]: BoxItem };

type Props = {
    type: string,
    rootFolderId: string,
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
    measureRef: Function,
    defaultView: DefaultView,
    chooseButtonLabel?: string,
    cancelButtonLabel?: string,
    language?: string,
    messages?: StringMap,
    logoUrl?: string,
    sharedLink?: string,
    sharedLinkPassword?: string,
    responseFilter?: Function
};

type State = {
    sortBy: SortBy,
    sortDirection: SortDirection,
    rootName: string,
    errorCode: string,
    currentCollection: Collection,
    selected: BoxItemMap,
    searchQuery: string,
    isLoading: boolean,
    view: View,
    isUploadModalOpen: boolean,
    isCreateFolderModalOpen: boolean,
    focusedRow: number
};

type DefaultProps = {|
    type: string,
    rootFolderId: string,
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
    className: string,
    defaultView: DefaultView
|};

const defaultType = `${TYPE_FILE},${TYPE_WEBLINK}`;

class ContentPicker extends Component<DefaultProps, Props, State> {
    id: string;
    api: API;
    state: State;
    props: Props;
    table: any;
    rootElement: HTMLElement;
    appElement: HTMLElement;
    globalModifier: boolean;
    firstLoad: boolean = true; // Keeps track of very 1st load

    static defaultProps: DefaultProps = {
        type: defaultType,
        rootFolderId: DEFAULT_ROOT,
        onChoose: noop,
        onCancel: noop,
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
        defaultView: DEFAULT_VIEW_FILES
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
            sortBy,
            sortDirection,
            clientName,
            responseFilter,
            rootFolderId
        } = props;

        this.api = new API({
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            clientName,
            responseFilter,
            id: `${TYPED_ID_FOLDER_PREFIX}${rootFolderId}`
        });

        this.id = uniqueid('bcp_');

        this.state = {
            sortBy,
            sortDirection,
            rootName: '',
            currentCollection: {},
            selected: {},
            searchQuery: '',
            view: VIEW_FOLDER,
            isCreateFolderModalOpen: false,
            isUploadModalOpen: false,
            focusedRow: 0,
            isLoading: false,
            errorCode: ''
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
     * react-modal expects the Modals app element
     * to be set so that it can add proper aria tags.
     * We need to keep setting it, since there might be
     * multiple widgets on the same page with their own
     * app elements.
     *
     * @private
     * @param {Object} collection item collection object
     * @return {void}
     */
    setModalAppElement() {
        Modal.setAppElement(this.appElement);
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
        this.rootElement = ((document.getElementById(this.id): any): HTMLElement);
        // $FlowFixMe: child will exist
        this.appElement = this.rootElement.firstElementChild;

        const { defaultView }: Props = this.props;
        if (defaultView === DEFAULT_VIEW_RECENTS) {
            this.showRecents(true);
        } else {
            this.fetchFolder();
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
        const results: BoxItem[] = Object.keys(selected).map((key) => {
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
        Object.keys(selected).forEach((key) => delete selected[key].selected);

        // Reset the selected state
        this.setState({ selected: {} }, () => onCancel());
    };

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
     * Helper function to refresh the grid.
     * This is useful when mutating the underlying data
     * structure and hence the state.
     *
     * @private
     * @fires cancel
     * @return {void}
     */
    refreshGrid = () => {
        if (this.table) {
            this.table.forceUpdateGrid();
        }
    };

    /**
     * Network error callback
     *
     * @private
     * @param {Error} error error object
     * @return {void}
     */
    errorCallback = (error: Error): void => {
        this.setState({
            view: VIEW_ERROR
        });
        /* eslint-disable no-console */
        console.error(error);
        /* eslint-enable no-console */
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
     * @return {void}
     */
    fetchFolderSuccessCallback = (collection: Collection): void => {
        const { rootFolderId }: Props = this.props;
        const { id, name }: Collection = collection;

        // New folder state
        const newState = {
            currentCollection: collection,
            rootName: id === rootFolderId ? name : ''
        };

        // Close any open modals
        this.closeModals();

        // Set the new state and focus the grid for tabbing
        this.setState(newState, this.finishNavigation);
    };

    /**
     * Fetches a folder, defaults to fetching root folder
     *
     * @private
     * @param {string|void} [id] folder id
     * @param {Boolean|void} [forceFetch] To void cache
     * @return {void}
     */
    fetchFolder = (id?: string, forceFetch: boolean = false): void => {
        const { rootFolderId }: Props = this.props;
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
        this.api
            .getFolderAPI()
            .folder(folderId, sortBy, sortDirection, this.fetchFolderSuccessCallback, this.errorCallback, forceFetch);
    };

    /**
     * Recents fetch success callback
     *
     * @private
     * @param {Object} collection item collection object
     * @return {void}
     */
    recentsSuccessCallback = (collection: Collection) => {
        // Set the new state and focus the grid for tabbing
        this.setState(
            {
                currentCollection: collection
            },
            this.finishNavigation
        );
    };

    /**
     * Shows recents
     *
     * @private
     * @param {Boolean|void} [forceFetch] To void cache
     * @return {void}
     */
    showRecents = (forceFetch: boolean = false) => {
        const { rootFolderId }: Props = this.props;
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
        this.api
            .getRecentsAPI()
            .recents(rootFolderId, by, sortDirection, this.recentsSuccessCallback, this.errorCallback, forceFetch);
    };

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
                    items: Object.keys(selected).map((key) => selected[key])
                }
            },
            this.finishNavigation
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
    debouncedSearch: Function = debounce((id: string, query: string, forceFetch?: boolean): void => {
        const { sortBy, sortDirection }: State = this.state;
        this.api
            .getSearchAPI()
            .search(id, query, sortBy, sortDirection, this.searchSuccessCallback, this.errorCallback, forceFetch);
    }, DEFAULT_SEARCH_DEBOUNCE);

    /**
     * Searches
     *
     * @private
     * @param {string} query search string
     * @param {Boolean|void} [forceFetch] To void cache
     * @return {void}
     */
    search = (query: string, forceFetch: boolean = false): void => {
        const { rootFolderId }: Props = this.props;
        const { currentCollection: { id } }: State = this.state;
        const folderId = typeof id === 'string' ? id : rootFolderId;
        const trimmedQuery: string = query.trim();

        if (!query) {
            // Query was cleared out, load the prior folder
            // The prior folder is always the parent folder for search
            this.fetchFolder(folderId);
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
            searchQuery: query,
            view: VIEW_SEARCH,
            currentCollection: this.currentUnloadedCollection()
        });

        this.debouncedSearch(folderId, query, forceFetch);
    };

    /**
     * Uploads
     *
     * @private
     * @param {File} file dom file object
     * @return {void}
     */
    upload = (): void => {
        const { currentCollection: { id, permissions } }: State = this.state;
        const { canUpload }: Props = this.props;
        if (!id || !permissions) {
            return;
        }

        const { can_upload: canUploadPermission }: BoxItemPermission = permissions;
        if (!canUpload || !canUploadPermission) {
            return;
        }

        this.setModalAppElement();
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
    uploadSuccessHandler = (): void => {
        const { currentCollection: { id } }: State = this.state;
        this.fetchFolder(id, true);
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
            this.setModalAppElement();
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
            () => {
                this.fetchFolder(id);
            },
            ({ response: { status } }) => {
                this.setState({
                    errorCode: status === 409 ? ERROR_CODE_ITEM_NAME_IN_USE : ERROR_CODE_ITEM_NAME_INVALID,
                    isLoading: false
                });
            }
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
        const { view, selected, currentCollection: { items = [] } }: State = this.state;
        const { id, type }: BoxItem = item;

        if (!id || !type || selectableType.indexOf(type) === -1) {
            return;
        }

        const selectedCount: number = Object.keys(selected).length;
        const hasHitSelectionLimit: boolean = selectedCount === maxSelectable;
        const isSingleFileSelection: boolean = maxSelectable === 1;
        const typedId: string = `${type}_${id}`;
        const existing: BoxItem = selected[typedId];

        if (existing) {
            // We are selecting the same item that was already
            // selected. Unselect it in this case. Toggle case.
            existing.selected = false;
            delete selected[typedId];
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

            const keys: Array<string> = Object.keys(selected);
            if (keys.length > 0 && isSingleFileSelection) {
                const key: string = keys[0]; // Only 1 in the map
                const prior: BoxItem = selected[key];
                prior.selected = false;
                delete selected[key];
            }

            // Select the new item
            item.selected = true;
            selected[typedId] = item;
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

        this.api.getAPI(type).share(item, access, this.refreshGrid);
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
        const { currentCollection: { id }, view, searchQuery }: State = this.state;
        if (!id) {
            return;
        }

        this.setState({ sortBy, sortDirection }, () => {
            if (view === VIEW_FOLDER) {
                this.fetchFolder(id);
            } else if (view === VIEW_SEARCH) {
                this.search(searchQuery);
            } else if (view === VIEW_RECENTS) {
                this.showRecents();
            } else {
                throw new Error('Cannot sort incompatible view!');
            }
        });
    };

    /**
     * Saves reference to table component
     *
     * @private
     * @param {Component} react component
     * @return {void}
     */
    tableRef = (table: React$Component<*, *, *>) => {
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
            isUploadModalOpen: false
        });

        const { selected, currentCollection: { items = [] } }: State = this.state;
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
    onKeyDown = (event: SyntheticKeyboardEvent & { target: HTMLElement }) => {
        if (isInputElement(event.target)) {
            return;
        }

        const { rootFolderId }: Props = this.props;
        const key = event.key.toLowerCase();

        switch (key) {
            case '/':
                focus(this.rootElement, '.buik-search input[type="search"]', false);
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
                    focus(this.rootElement, '.buik-breadcrumb button', false);
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
                    this.showRecents(true);
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
            cancelButtonLabel
        }: Props = this.props;
        const {
            view,
            rootName,
            selected,
            currentCollection,
            searchQuery,
            isCreateFolderModalOpen,
            isUploadModalOpen,
            isLoading,
            errorCode,
            focusedRow
        }: State = this.state;
        const { id, permissions }: Collection = currentCollection;
        const { can_upload }: BoxItemPermission = permissions || {};
        const selectedCount: number = Object.keys(selected).length;
        const hasHitSelectionLimit: boolean = selectedCount === maxSelectable && maxSelectable !== 1;
        const allowUpload: boolean = canUpload && !!can_upload;
        const allowCreate: boolean = canCreateNewFolder && !!can_upload;
        const styleClassName = classNames('buik bcp', className);

        /* eslint-disable jsx-a11y/no-static-element-interactions */
        /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
        return (
            <Internationalize language={language} messages={messages}>
                <div id={this.id} className={styleClassName} ref={measureRef}>
                    <div className='buik-app-element' onKeyDown={this.onKeyDown} tabIndex={0}>
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
                        />
                    </div>
                    {allowUpload && !!this.appElement
                        ? <UploadDialog
                            isOpen={isUploadModalOpen}
                            currentFolderId={id}
                            token={token}
                            sharedLink={sharedLink}
                            sharedLinkPassword={sharedLinkPassword}
                            apiHost={apiHost}
                            uploadHost={uploadHost}
                            onClose={this.uploadSuccessHandler}
                            parentElement={this.rootElement}
                          />
                        : null}
                    {allowCreate && !!this.appElement
                        ? <CreateFolderDialog
                            isOpen={isCreateFolderModalOpen}
                            onCreate={this.createFolderCallback}
                            onCancel={this.closeModals}
                            isLoading={isLoading}
                            errorCode={errorCode}
                            parentElement={this.rootElement}
                          />
                        : null}
                </div>
            </Internationalize>
        );
        /* eslint-enable jsx-a11y/no-static-element-interactions */
        /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    }
}

export default makeResponsive(ContentPicker);
