/**
 * @flow
 * @file Content Explorer Component
 * @author Box
 */

import React, { Component } from 'react';
import classNames from 'classnames';
import Modal from 'react-modal';
import debounce from 'lodash.debounce';
import noop from 'lodash.noop';
import uniqueid from 'lodash.uniqueid';
import cloneDeep from 'lodash.clonedeep';
import Content from './Content';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import RenameDialog from './RenameDialog';
import ShareDialog from './ShareDialog';
import UploadDialog from '../UploadDialog';
import PreviewDialog from './PreviewDialog';
import Header from '../Header';
import SubHeader from '../SubHeader/SubHeader';
import API from '../../api';
import makeResponsive from '../makeResponsive';
import openUrlInsideIframe from '../../util/iframe';
import { isFocusableElement, isInputElement, focus } from '../../util/dom';
import {
    DEFAULT_HOSTNAME_UPLOAD,
    DEFAULT_HOSTNAME_API,
    DEFAULT_SEARCH_DEBOUNCE,
    SORT_ASC,
    SORT_NAME,
    DEFAULT_ROOT,
    VIEW_SEARCH,
    VIEW_FOLDER,
    VIEW_ERROR,
    TYPE_FILE,
    TYPE_WEBLINK,
    TYPE_FOLDER,
    CLIENT_NAME_CONTENT_EXPLORER
} from '../../constants';
import type {
    BoxItem,
    Collection,
    View,
    SortDirection,
    SortBy,
    Access,
    BoxItemPermission,
    ItemAPI,
    ItemType,
    Token
} from '../../flowTypes';
import '../fonts.scss';
import '../base.scss';

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
    apiHost: string,
    uploadHost: string,
    getLocalizedMessage: Function,
    token: Token,
    isSmall: boolean,
    isLarge: boolean,
    isTouch: boolean,
    autoFocus: boolean,
    className: string,
    measureRef: Function,
    onDelete: Function,
    onDownload: Function,
    onPreview: Function,
    onRename: Function,
    onSelect: Function,
    onUpload: Function,
    onNavigate: Function,
    logoUrl?: string,
    sharedLink?: string,
    sharedLinkPassword?: string
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
    isShareModalOpen: boolean,
    isUploadModalOpen: boolean,
    isPreviewModalOpen: boolean,
    isLoading: boolean,
    errorCode: string,
    focusedRow: number,
    firstLoad: boolean
};

type DefaultProps = {|
    rootFolderId: string,
    sortBy: SortBy,
    sortDirection: SortDirection,
    canDownload: boolean,
    canDelete: boolean,
    canUpload: boolean,
    canRename: boolean,
    canPreview: boolean,
    canShare: boolean,
    canSetShareAccess: boolean,
    autoFocus: boolean,
    apiHost: string,
    uploadHost: string,
    className: string,
    onDelete: Function,
    onDownload: Function,
    onPreview: Function,
    onRename: Function,
    onSelect: Function,
    onUpload: Function,
    onNavigate: Function
|};

class ContentExplorer extends Component<DefaultProps, Props, State> {
    id: string;
    api: API;
    state: State;
    props: Props;
    table: any;
    rootElement: HTMLElement;
    appElement: HTMLElement;
    globalModifier: boolean;

    static defaultProps: DefaultProps = {
        rootFolderId: DEFAULT_ROOT,
        sortBy: SORT_NAME,
        sortDirection: SORT_ASC,
        canDownload: true,
        canDelete: true,
        canUpload: true,
        canRename: true,
        canShare: true,
        canPreview: true,
        canSetShareAccess: true,
        autoFocus: false,
        apiHost: DEFAULT_HOSTNAME_API,
        uploadHost: DEFAULT_HOSTNAME_UPLOAD,
        className: '',
        onDelete: noop,
        onDownload: noop,
        onPreview: noop,
        onRename: noop,
        onSelect: noop,
        onUpload: noop,
        onNavigate: noop
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
            rootFolderId,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            sortBy,
            sortDirection
        }: Props = props;
        this.api = new API({
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            clientName: CLIENT_NAME_CONTENT_EXPLORER,
            id: `folder_${rootFolderId}`
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
            isShareModalOpen: false,
            isUploadModalOpen: false,
            isPreviewModalOpen: false,
            isLoading: false,
            errorCode: '',
            focusedRow: 0,
            firstLoad: true
        };
    }

    /**
     * Returns the API based on type of item
     *
     * @private
     * @param {String} type - item type
     * @return {ItemAPI} api
     */
    getAPI(type: ItemType): ItemAPI {
        let api: ItemAPI;

        switch (type) {
            case TYPE_FOLDER:
                api = this.api.getFolderAPI();
                break;
            case TYPE_FILE:
                api = this.api.getFileAPI();
                break;
            case TYPE_WEBLINK:
                api = this.api.getWebLinkAPI();
                break;
            default:
                throw new Error('Unknown Type!');
        }

        return api;
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
     * Fetches the root folder on load
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentDidMount() {
        const { currentFolderId }: Props = this.props;
        this.rootElement = ((document.getElementById(this.id): any): HTMLElement);
        // $FlowFixMe: child will exist
        this.appElement = this.rootElement.firstElementChild;
        this.fetchFolder(currentFolderId);
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
        const { currentFolderId }: Props = this.props;
        const { currentFolderId: newFolderId }: Props = nextProps;
        if (currentFolderId !== newFolderId) {
            this.fetchFolder(newFolderId);
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
        const { onNavigate, autoFocus }: Props = this.props;
        const { firstLoad, currentCollection: { percentLoaded, boxItem } }: State = this.state;
        onNavigate(cloneDeep(boxItem));

        // Don't focus the grid until its loaded and user is not already on an interactable element
        if (percentLoaded === 100 && !isFocusableElement(document.activeElement)) {
            // If loading for the very first time, only focus if autoFocus is true
            if (firstLoad && !autoFocus) {
                this.setState({ firstLoad: false });
                return;
            }
            focus(this.rootElement, '.bce-item-row');
            this.setState({ focusedRow: 0 });
        }
    }

    /**
     * Folder fetch success callback
     *
     * @private
     * @param {Object} collection item collection object
     * @return {void}
     */
    fetchFolderSuccessCallback = (collection: Collection) => {
        const { rootFolderId }: Props = this.props;
        const { id, name }: Collection = collection;

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
    fetchFolder = (id?: string, forceFetch: boolean = false) => {
        const { rootFolderId }: Props = this.props;
        const { sortBy, sortDirection }: State = this.state;
        const folderId: string = typeof id === 'string' ? id : rootFolderId;

        // Reset search state, the view and show busy indicator
        this.setState({
            selected: undefined,
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
    search = (query: string, forceFetch: boolean = false) => {
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
            selected: undefined,
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
    uploadSuccessHandler = () => {
        const { currentCollection: { id } }: State = this.state;
        this.fetchFolder(id, true);
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

        const { permissions, type, id }: BoxItem = selected;
        if (!permissions || !type || !id) {
            return;
        }

        const { can_set_share_access: canSetShareAccessPermission }: BoxItemPermission = permissions;
        if (!canSetShareAccessPermission) {
            return;
        }

        this.setState({ isLoading: true });
        this.getAPI(type).share(id, access, (updatedItem: BoxItem) => {
            updatedItem.selected = true;
            this.setState({ selected: updatedItem, isLoading: false });
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
        const { currentCollection: { id }, view, searchQuery }: State = this.state;
        if (!id) {
            return;
        }

        this.setState({ sortBy, sortDirection }, () => {
            if (view === VIEW_FOLDER) {
                this.fetchFolder(id);
            } else if (view === VIEW_SEARCH) {
                this.search(searchQuery);
            } else {
                throw new Error('Cannot sort incompatible view!');
            }
        });
    };

    /**
     * Selects or unselects an item
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
        const { selected, isDeleteModalOpen, view, searchQuery }: State = this.state;
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
            this.setModalAppElement();
            this.setState({ isDeleteModalOpen: true });
            return;
        }

        this.setState({ isLoading: true });
        this.getAPI(type).delete(selected, () => {
            onDelete(cloneDeep([selected]));
            if (view === VIEW_FOLDER) {
                this.fetchFolder(parentId);
            } else if (view === VIEW_SEARCH) {
                this.search(searchQuery);
            } else {
                throw new Error('Cannot sort incompatible view!');
            }
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
     * Chages the sort by and sort direction
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
            this.setModalAppElement();
            this.setState({ isRenameModalOpen: true, errorCode: '' });
            return;
        }

        const name = `${nameWithoutExt}${extension}`;
        if (!nameWithoutExt.trim()) {
            this.setState({ errorCode: 'item_name_invalid', isLoading: false });
            return;
        }

        this.setState({ isLoading: true });
        this.getAPI(type).rename(
            id,
            name,
            (updatedItem: BoxItem) => {
                onRename(cloneDeep(selected));
                updatedItem.selected = true;
                this.setState({
                    selected: updatedItem,
                    isLoading: false,
                    isRenameModalOpen: false
                });
            },
            ({ code }) => {
                this.setState({ errorCode: code, isLoading: false });
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

        this.setModalAppElement();
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
                break;
            case 'arrowdown':
                focus(this.rootElement, '.bce-item-row', false);
                this.setState({ focusedRow: 0 });
                break;
            case 'g':
                break;
            case 'b':
                if (this.globalModifier) {
                    focus(this.rootElement, '.buik-breadcrumb button', false);
                }
                break;
            case 'f':
                if (this.globalModifier) {
                    this.fetchFolder(rootFolderId);
                }
                break;
            case 'u':
                if (this.globalModifier) {
                    this.upload();
                }
                break;
            default:
                this.globalModifier = false;
                return;
        }

        this.globalModifier = key === 'g';
        event.preventDefault();
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
            rootFolderId,
            logoUrl,
            canUpload,
            canSetShareAccess,
            canDelete,
            canRename,
            canDownload,
            canPreview,
            canShare,
            getLocalizedMessage,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            isSmall,
            isTouch,
            className,
            measureRef,
            onPreview,
            onUpload
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
            selected,
            isLoading,
            errorCode,
            focusedRow
        }: State = this.state;
        const { id, permissions }: Collection = currentCollection;
        const { can_upload }: BoxItemPermission = permissions || {};
        const styleClassName = classNames('buik bce', className);
        const allowUpload = canUpload && can_upload;

        /* eslint-disable jsx-a11y/no-static-element-interactions */
        /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
        return (
            <div id={this.id} className={styleClassName} ref={measureRef} onKeyDown={this.onKeyDown} tabIndex={0}>
                <div className='buik-app-element'>
                    <Header
                        view={view}
                        searchQuery={searchQuery}
                        logoUrl={logoUrl}
                        canUpload={allowUpload}
                        onSearch={this.search}
                        onUpload={this.upload}
                        getLocalizedMessage={getLocalizedMessage}
                    />
                    <SubHeader
                        view={view}
                        rootId={rootFolderId}
                        isSmall={isSmall}
                        rootName={rootName}
                        currentCollection={currentCollection}
                        onItemClick={this.fetchFolder}
                        onSortChange={this.sort}
                        getLocalizedMessage={getLocalizedMessage}
                    />
                    <Content
                        view={view}
                        rootId={rootFolderId}
                        isSmall={isSmall}
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
                        getLocalizedMessage={getLocalizedMessage}
                    />
                </div>
                {canUpload && !!this.appElement
                    ? <UploadDialog
                        isOpen={isUploadModalOpen}
                        rootFolderId={id}
                        token={token}
                        sharedLink={sharedLink}
                        sharedLinkPassword={sharedLinkPassword}
                        apiHost={apiHost}
                        uploadHost={uploadHost}
                        onClose={this.uploadSuccessHandler}
                        getLocalizedMessage={getLocalizedMessage}
                        parentElement={this.rootElement}
                        onUpload={onUpload}
                      />
                    : null}
                {canDelete && selected && !!this.appElement
                    ? <DeleteConfirmationDialog
                        isOpen={isDeleteModalOpen}
                        onDelete={this.deleteCallback}
                        onCancel={this.closeModals}
                        item={selected}
                        getLocalizedMessage={getLocalizedMessage}
                        isLoading={isLoading}
                        parentElement={this.rootElement}
                      />
                    : null}
                {canRename && selected && !!this.appElement
                    ? <RenameDialog
                        isOpen={isRenameModalOpen}
                        onRename={this.renameCallback}
                        onCancel={this.closeModals}
                        item={selected}
                        getLocalizedMessage={getLocalizedMessage}
                        isLoading={isLoading}
                        errorCode={errorCode}
                        parentElement={this.rootElement}
                      />
                    : null}
                {canShare && selected && !!this.appElement
                    ? <ShareDialog
                        isOpen={isShareModalOpen}
                        canSetShareAccess={canSetShareAccess}
                        onShareAccessChange={this.changeShareAccess}
                        onCancel={this.closeModals}
                        item={selected}
                        getLocalizedMessage={getLocalizedMessage}
                        isLoading={isLoading}
                        parentElement={this.rootElement}
                      />
                    : null}
                {canPreview && selected && !!this.appElement
                    ? <PreviewDialog
                        isOpen={isPreviewModalOpen}
                        isTouch={isTouch}
                        onCancel={this.closeModals}
                        item={selected}
                        currentCollection={currentCollection}
                        token={token}
                        getLocalizedMessage={getLocalizedMessage}
                        parentElement={this.rootElement}
                        onPreview={onPreview}
                      />
                    : null}
            </div>
        );
        /* eslint-enable jsx-a11y/no-static-element-interactions */
        /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    }
}

export default makeResponsive(ContentExplorer);
