/**
 * @flow
 * @file Content Tree Component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import uniqueid from 'lodash/uniqueId';
import noop from 'lodash/noop';
import Content from './Content';
import API from '../../api';
import makeResponsive from '../makeResponsive';
import { isFocusableElement } from '../../util/dom';
import Internationalize from '../Internationalize';
import {
    DEFAULT_HOSTNAME_API,
    DEFAULT_ROOT,
    VIEW_FOLDER,
    VIEW_ERROR,
    TYPE_FOLDER,
    TYPE_FILE,
    TYPE_WEBLINK,
    CLIENT_NAME_CONTENT_TREE,
    FIELD_NAME,
    SORT_ASC,
    TYPED_ID_FOLDER_PREFIX,
} from '../../constants';

import '../fonts.scss';
import '../base.scss';

type Props = {
    type: string,
    rootFolderId: string,
    onClick: Function,
    apiHost: string,
    clientName: string,
    token: Token,
    isSmall: boolean,
    isLarge: boolean,
    isTouch: boolean,
    autoFocus: boolean,
    className: string,
    measureRef: Function,
    language?: string,
    messages?: StringMap,
    sharedLink?: string,
    sharedLinkPassword?: string,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
};

type State = {
    currentCollection: Collection,
    view: View,
};

// Pagination is not supported by this component
const ITEM_LIMIT = 200;
const ITEM_OFFSET = 0;

class ContentTree extends Component<Props, State> {
    id: string;
    api: API;
    state: State;
    props: Props;
    table: any;

    static defaultProps = {
        type: `${TYPE_FILE},${TYPE_WEBLINK},${TYPE_FOLDER}`,
        rootFolderId: DEFAULT_ROOT,
        onClick: noop,
        className: '',
        autoFocus: false,
        apiHost: DEFAULT_HOSTNAME_API,
        clientName: CLIENT_NAME_CONTENT_TREE,
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
            clientName,
            requestInterceptor,
            responseInterceptor,
        } = props;

        this.api = new API({
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            clientName,
            requestInterceptor,
            responseInterceptor,
            id: `${TYPED_ID_FOLDER_PREFIX}${rootFolderId}`,
        });

        this.id = uniqueid('bct_');

        this.state = {
            currentCollection: {},
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
        this.fetchFolder();
    }

    /**
     * Calls the passed on onClick funcsion
     *
     * @private
     * @param {Object} item - clicked item
     * @return {void}
     */
    onItemClick = (item: BoxItem): void => {
        const { onClick }: Props = this.props;
        delete item.selected;
        onClick(item);
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
    errorCallback = (error: Error): void => {
        this.setState({
            view: VIEW_ERROR,
        });
        /* eslint-disable no-console */
        console.error(error);
        /* eslint-enable no-console */
    };

    /**
     * Action performed when clicking on an item expand button
     *
     * @private
     * @param {Object} item - the clicked box item
     * @return {void}
     */
    onExpanderClick = (folder: BoxItem) => {
        const { currentCollection }: State = this.state;
        const { id, path_collection, selected = false }: BoxItem = folder;

        if (!path_collection || !currentCollection.items) {
            throw new Error('Bad state!');
        }

        if (selected) {
            folder.selected = false;
            const length = path_collection.total_count;
            const newItems = currentCollection.items.filter(item => {
                if (
                    item.path_collection &&
                    item.path_collection.total_count > length
                ) {
                    return item.path_collection.entries[length].id !== id;
                }

                return true;
            });
            currentCollection.items = newItems;
            this.setState({ currentCollection });
        } else {
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
        const {
            currentCollection: { percentLoaded },
        }: State = this.state;

        // Don't focus the grid until its loaded and user is not already on an interactable element
        if (
            !autoFocus ||
            percentLoaded !== 100 ||
            !this.table ||
            !this.table.Grid ||
            isFocusableElement(document.activeElement)
        ) {
            return;
        }

        const grid: any = findDOMNode(this.table.Grid); // eslint-disable-line react/no-find-dom-node
        grid.focus();
    }

    /**
     * Folder fetch success callback
     *
     * @private
     * @param {Object} collection item collection object
     * @return {void}
     */
    fetchFolderSuccessCallback = (collection: Collection): void => {
        const { items: newItems = [], percentLoaded }: Collection = collection;
        const { type }: Props = this.props;

        const filteredItems = newItems.filter((item: BoxItem) => {
            if (item.type) {
                return type.indexOf(item.type) > -1;
            }

            return false;
        });
        let { currentCollection }: State = this.state;
        const { items }: Collection = currentCollection;

        if (items) {
            const parentIndex = items.findIndex(
                item => item.type === TYPE_FOLDER && item.id === collection.id,
            );
            items[parentIndex].selected = true;
            items.splice(parentIndex + 1, 0, ...filteredItems);
            currentCollection.percentLoaded = percentLoaded;
        } else {
            currentCollection = collection;
            currentCollection.items = filteredItems;
        }

        // Set the new state and focus the grid for tabbing
        this.setState({ currentCollection }, this.finishNavigation);
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
        const folderId: string = typeof id === 'string' ? id : rootFolderId;

        // Reset the view and show busy indicator
        this.setState({
            view: VIEW_FOLDER,
            currentCollection: this.currentUnloadedCollection(),
        });

        // Fetch the folder using folder API
        this.api
            .getFolderAPI()
            .getFolder(
                folderId,
                ITEM_LIMIT,
                ITEM_OFFSET,
                FIELD_NAME,
                SORT_ASC,
                this.fetchFolderSuccessCallback,
                this.errorCallback,
                {
                    forceFetch,
                },
            );
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
            language,
            messages,

            rootFolderId,
            type,
            isSmall,
            className,
            measureRef,
        }: Props = this.props;
        const { view, currentCollection }: State = this.state;
        const styleClassName = classNames('be bct be-app-element', className);

        return (
            <Internationalize language={language} messages={messages}>
                <div id={this.id} className={styleClassName} ref={measureRef}>
                    <Content
                        view={view}
                        isSmall={isSmall}
                        rootId={rootFolderId}
                        selectableType={type}
                        currentCollection={currentCollection}
                        tableRef={this.tableRef}
                        onItemClick={this.onItemClick}
                        onExpanderClick={this.onExpanderClick}
                    />
                </div>
            </Internationalize>
        );
    }
}

export default makeResponsive(ContentTree);
