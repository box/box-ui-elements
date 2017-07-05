/**
 * @flow
 * @file Content Picker Component
 * @author Box
 */

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
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
import API from '../../api';
import makeResponsive from '../makeResponsive';
import isActionableElement from '../../util/dom';
import {
    DEFAULT_HOSTNAME_UPLOAD,
    DEFAULT_HOSTNAME_API,
    DEFAULT_SEARCH_DEBOUNCE,
    SORT_ASC,
    SORT_NAME,
    DEFAULT_ROOT,
    VIEW_SEARCH,
    VIEW_FOLDER,
    VIEW_SELECTED,
    VIEW_ERROR,
    TYPE_FILE,
    TYPE_FOLDER,
    TYPE_WEBLINK,
    CLIENT_NAME_CONTENT_PICKER
} from '../../constants';
import type {
    BoxItem,
    Collection,
    View,
    SortDirection,
    SortBy,
    Access,
    BoxItemPermission,
    ItemAPI
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
    apiHost: string,
    uploadHost: string,
    getLocalizedMessage: Function,
    clientName: string,
    token: string | Function,
    isSmall: boolean,
    isLarge: boolean,
    isTouch: boolean,
    className: string,
    measureRef: Function,
    logoUrl?: string,
    sharedLink?: string,
    sharedLinkPassword?: string
};

type State = {
    sortBy: SortBy,
    sortDirection: SortDirection,
    rootName: string,
    currentCollection: Collection,
    selected: BoxItemMap,
    searchQuery: string,
    view: View,
    isUploadModalOpen: boolean
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
    apiHost: string,
    uploadHost: string,
    clientName: string,
    className: string
|};

class ContentPicker extends Component<DefaultProps, Props, State> {
    id: string;
    api: API;
    state: State;
    props: Props;
    table: any;
    rootElement: HTMLElement;
    appElement: HTMLElement;

    static defaultProps: DefaultProps = {
        type: `${TYPE_FILE},${TYPE_WEBLINK}`,
        rootFolderId: DEFAULT_ROOT,
        onChoose: noop,
        onCancel: noop,
        sortBy: SORT_NAME,
        sortDirection: SORT_ASC,
        extensions: [],
        maxSelectable: Infinity,
        canUpload: true,
        canSetShareAccess: true,
        className: '',
        apiHost: DEFAULT_HOSTNAME_API,
        uploadHost: DEFAULT_HOSTNAME_UPLOAD,
        clientName: CLIENT_NAME_CONTENT_PICKER
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
            rootFolderId,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            sortBy,
            sortDirection,
            clientName
        } = props;
        this.api = new API({
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            clientName,
            id: `folder_${rootFolderId}`
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
            isUploadModalOpen: false
        };
    }

    /**
     * Returns the API based on type of item
     *
     * @private
     * @param {String} type - item type
     * @return {ItemAPI} api
     */
    getAPI(type: string): ItemAPI {
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
        this.rootElement = ((document.getElementById(this.id): any): HTMLElement);
        // $FlowFixMe: child will exist
        this.appElement = this.rootElement.firstElementChild;
        this.fetchFolder();
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
            rootName: id === rootFolderId ? name : '',
            isUploadModalOpen: false
        };

        // Set the new state and focus the grid for tabbing
        this.setState(newState, () => {
            if (!this.table || !this.table.Grid || isActionableElement(document.activeElement)) {
                return;
            }
            const grid: any = findDOMNode(this.table.Grid);
            grid.focus();
        });
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
     * Shows the selected items
     *
     * @private
     * @return {void}
     */
    showSelected = (): void => {
        const { selected, sortBy, sortDirection }: State = this.state;
        this.setState({
            searchQuery: '',
            view: VIEW_SELECTED,
            currentCollection: {
                sortBy,
                sortDirection,
                percentLoaded: 100,
                items: Object.keys(selected).map((key) => selected[key])
            }
        });
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

        Modal.setAppElement(this.appElement);
        this.setState({
            isUploadModalOpen: true,
            currentCollection: this.currentUnloadedCollection()
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
     * Selects or unselects an item
     *
     * @private
     * @param {Object} item file or folder object
     * @return {void}
     */
    select = (item: BoxItem): void => {
        const { type: selectableType, maxSelectable }: Props = this.props;
        const { view, selected }: State = this.state;
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

        this.setState({ selected }, () => {
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
        const { view, searchQuery }: State = this.state;
        const { canSetShareAccess }: Props = this.props;
        if (!item || !canSetShareAccess) {
            return;
        }

        const { permissions, type, id }: BoxItem = item;
        if (!permissions || !type || !id) {
            return;
        }

        const { can_set_share_access: canSetShareAccessPermission }: BoxItemPermission = permissions;
        if (!canSetShareAccessPermission) {
            return;
        }

        this.getAPI(type).share(id, access, () => {
            if (view === VIEW_FOLDER) {
                const { parent }: BoxItem = item;
                if (parent) {
                    this.fetchFolder(parent.id);
                }
            } else if (view === VIEW_SEARCH) {
                this.search(searchQuery);
            } else if (view === VIEW_SELECTED) {
                this.showSelected();
            } else {
                throw new Error('Cannot sort incompatible view!');
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
            extensions,
            maxSelectable,
            type,
            getLocalizedMessage,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            uploadHost,
            isSmall,
            className,
            measureRef
        }: Props = this.props;
        const { view, rootName, selected, currentCollection, searchQuery, isUploadModalOpen }: State = this.state;
        const { id, permissions }: Collection = currentCollection;
        const { can_upload }: BoxItemPermission = permissions || {};
        const selectedCount: number = Object.keys(selected).length;
        const hasHitSelectionLimit: boolean = selectedCount === maxSelectable && maxSelectable !== 1;
        const allowUpload = canUpload && can_upload;
        const styleClassName = classNames('buik bcp', className);

        return (
            <div id={this.id} className={styleClassName} ref={measureRef}>
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
                        isSmall={isSmall}
                        rootId={rootFolderId}
                        selectableType={type}
                        canSetShareAccess={canSetShareAccess}
                        extensionsWhitelist={extensions}
                        hasHitSelectionLimit={hasHitSelectionLimit}
                        currentCollection={currentCollection}
                        tableRef={this.tableRef}
                        onItemSelect={this.select}
                        onItemClick={this.onItemClick}
                        onShareAccessChange={this.changeShareAccess}
                        getLocalizedMessage={getLocalizedMessage}
                    />
                    <Footer
                        selectedCount={selectedCount}
                        hasHitSelectionLimit={hasHitSelectionLimit}
                        onSelectedClick={this.showSelected}
                        onChoose={this.choose}
                        onCancel={this.cancel}
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
                      />
                    : null}
            </div>
        );
    }
}

export default makeResponsive(ContentPicker);
