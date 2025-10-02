/// <reference types="lodash" />
import 'regenerator-runtime/runtime';
import React, { Component } from 'react';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { Key, Selection } from 'react-aria-components';
import type { MetadataTemplateField } from '@box/metadata-editor';
import API from '../../api';
import MetadataQueryAPIHelperV2 from './MetadataQueryAPIHelper';
import MetadataQueryAPIHelper from '../../features/metadata-based-view/MetadataQueryAPIHelper';
import LocalStore from '../../utils/LocalStore';
import { type FeatureConfig } from '../common/feature-checking';
import type { ItemAction } from '../common/item';
import type { Theme } from '../common/theming';
import type { MetadataQuery, FieldsToShow } from '../../common/types/metadataQueries';
import type { MetadataFieldValue, MetadataTemplate } from '../../common/types/metadata';
import type { View, DefaultView, StringMap, SortBy, SortDirection, Token, Collection, BoxItem } from '../../common/types/core';
import type { BulkItemAction } from '../common/sub-header/BulkItemActionMenu';
import type { ContentPreviewProps } from '../content-preview';
import type { ContentUploaderProps } from '../content-uploader';
import type { ExternalFilterValues, MetadataViewContainerProps } from './MetadataViewContainer';
import '../common/fonts.scss';
import '../common/base.scss';
import '../common/modal.scss';
import './ContentExplorer.scss';
export interface ContentExplorerProps {
    apiHost?: string;
    appHost?: string;
    autoFocus?: boolean;
    bulkItemActions?: BulkItemAction[];
    canCreateNewFolder?: boolean;
    canDelete?: boolean;
    canDownload?: boolean;
    canPreview?: boolean;
    canRename?: boolean;
    canSetShareAccess?: boolean;
    canShare?: boolean;
    canUpload?: boolean;
    className?: string;
    contentPreviewProps?: ContentPreviewProps;
    contentUploaderProps?: ContentUploaderProps;
    currentFolderId?: string;
    defaultView?: DefaultView;
    features?: FeatureConfig;
    fieldsToShow?: FieldsToShow;
    hasProviders?: boolean;
    initialPage?: number;
    initialPageSize?: number;
    isLarge?: boolean;
    isMedium?: boolean;
    isSmall?: boolean;
    isTouch?: boolean;
    isVeryLarge?: boolean;
    itemActions?: ItemAction[];
    language?: string;
    logoUrl?: string;
    measureRef?: (ref: Element | null) => void;
    messages?: StringMap;
    metadataQuery?: MetadataQuery;
    metadataViewProps?: Omit<MetadataViewContainerProps, 'hasError' | 'currentCollection' | 'metadataTemplate' | 'selectedKeys'>;
    onCreate?: (item: BoxItem) => void;
    onDelete?: (item: BoxItem) => void;
    onDownload?: (item: BoxItem) => void;
    onNavigate?: (item: BoxItem) => void;
    onPreview?: (data: unknown) => void;
    onRename?: (item: BoxItem) => void;
    onSelect?: (item: BoxItem) => void;
    onUpload?: (item: BoxItem) => void;
    previewLibraryVersion?: string;
    requestInterceptor?: (response: AxiosResponse) => void;
    responseInterceptor?: (config: AxiosRequestConfig) => void;
    rootFolderId?: string;
    sharedLink?: string;
    sharedLinkPassword?: string;
    sortBy?: SortBy | Key;
    sortDirection?: SortDirection;
    staticHost?: string;
    staticPath?: string;
    theme?: Theme;
    title?: string;
    token: Token;
    uploadHost?: string;
}
type State = {
    currentCollection: Collection;
    currentOffset: number;
    currentPageNumber: number;
    currentPageSize: number;
    errorCode: string;
    focusedRow: number;
    gridColumnCount: number;
    isCreateFolderModalOpen: boolean;
    isDeleteModalOpen: boolean;
    isLoading: boolean;
    isMetadataSidePanelOpen: boolean;
    isPreviewModalOpen: boolean;
    isRenameModalOpen: boolean;
    isShareModalOpen: boolean;
    isUploadModalOpen: boolean;
    markers: Array<string | null | undefined>;
    metadataTemplate: MetadataTemplate;
    metadataFilters: ExternalFilterValues;
    rootName: string;
    searchQuery: string;
    selected?: BoxItem;
    selectedItemIds: Selection;
    sortBy: SortBy | string;
    sortDirection: SortDirection;
    view: View;
};
declare class ContentExplorer extends Component<ContentExplorerProps, State> {
    id: string;
    api: API;
    state: State;
    props: ContentExplorerProps;
    rootElement: HTMLElement;
    appElement: HTMLElement;
    globalModifier: boolean;
    firstLoad: boolean;
    store: LocalStore;
    metadataQueryAPIHelper: MetadataQueryAPIHelper | MetadataQueryAPIHelperV2;
    static defaultProps: {
        rootFolderId: any;
        sortBy: any;
        sortDirection: any;
        canDownload: boolean;
        canDelete: boolean;
        canUpload: boolean;
        canRename: boolean;
        canShare: boolean;
        canPreview: boolean;
        canSetShareAccess: boolean;
        canCreateNewFolder: boolean;
        autoFocus: boolean;
        apiHost: any;
        appHost: any;
        staticHost: any;
        uploadHost: any;
        className: string;
        onDelete: (...args: any[]) => void;
        onDownload: (...args: any[]) => void;
        onPreview: (...args: any[]) => void;
        onRename: (...args: any[]) => void;
        onCreate: (...args: any[]) => void;
        onSelect: (...args: any[]) => void;
        onUpload: (...args: any[]) => void;
        onNavigate: (...args: any[]) => void;
        defaultView: any;
        initialPage: any;
        initialPageSize: any;
        contentPreviewProps: {
            contentSidebarProps: {};
        };
        contentUploaderProps: {};
        metadataViewProps: {};
    };
    /**
     * [constructor]
     *
     * @private
     * @return {ContentExplorer}
     */
    constructor(props: ContentExplorerProps);
    /**
     * Destroys api instances
     *
     * @private
     * @return {void}
     */
    clearCache(): void;
    /**
     * Cleanup
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentWillUnmount(): void;
    /**
     * Fetches the root folder on load
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentDidMount(): void;
    /**
     * Fetches the current folder if different
     * from what was already fetched before.
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentDidUpdate({ currentFolderId: prevFolderId }: ContentExplorerProps, prevState: State): void;
    /**
     * Metadata queries success callback
     *
     * @private
     * @param {Object} metadataQueryCollection - Metadata query response collection
     * @param {Object} metadataTemplate - Metadata template object
     * @return {void}
     */
    showMetadataQueryResultsSuccessCallback: (metadataQueryCollection: Collection, metadataTemplate: MetadataTemplate) => void;
    /**
     * Queries metadata_queries/execute API and fetches the result
     *
     * @private
     * @return {void}
     */
    showMetadataQueryResults(): void;
    /**
     * Update selected items' metadata instances based on original and new field values in the metadata instance form
     *
     * @private
     * @return {void}
     */
    updateMetadataV2: (items: BoxItem[], operations: JSONPatchOperations, templateOldFields: MetadataTemplateField[], templateNewFields: MetadataTemplateField[], successCallback: () => void, errorCallback: ErrorCallback) => Promise<void>;
    /**
     * Resets the collection so that the loading bar starts showing
     *
     * @private
     * @return {Collection}
     */
    currentUnloadedCollection(): Collection;
    /**
     * Network error callback
     *
     * @private
     * @param {Error} error error object
     * @return {void}
     */
    errorCallback: (error: unknown) => void;
    /**
     * Focuses the grid and fires navigate event
     *
     * @private
     * @return {void}
     */
    finishNavigation(): void;
    /**
     * Refreshing the item collection depending upon the view.
     * Navigation event is prevented.
     *
     * @private
     * @return {void}
     */
    refreshCollection: () => void;
    /**
     * Folder fetch success callback
     *
     * @private
     * @param {Object} collection - item collection object
     * @param {Boolean|void} triggerNavigationEvent - To trigger navigate event and focus grid
     * @return {void}
     */
    fetchFolderSuccessCallback(collection: Collection, triggerNavigationEvent: boolean): void;
    /**
     * Fetches a folder, defaults to fetching root folder
     *
     * @private
     * @param {string|void} [id] folder id
     * @param {Boolean|void} [triggerNavigationEvent] To trigger navigate event
     * @return {void}
     */
    fetchFolder: (id?: string, triggerNavigationEvent?: boolean) => void;
    /**
     * Action performed when clicking on an item
     *
     * @private
     * @param {Object|string} item - the clicked box item
     * @return {void}
     */
    onItemClick: (item: BoxItem | string) => void;
    /**
     * Search success callback
     *
     * @private
     * @param {Object} collection item collection object
     * @return {void}
     */
    searchSuccessCallback: (collection: Collection) => void;
    /**
     * Debounced searching
     *
     * @private
     * @param {string} id folder id
     * @param {string} query search string
     * @return {void}
     */
    debouncedSearch: import("lodash").DebouncedFunc<(id: string, query: string) => void>;
    /**
     * Searches
     *
     * @private
     * @param {string} query search string
     * @return {void}
     */
    search: (query: string) => void;
    /**
     * Recents fetch success callback
     *
     * @private
     * @param {Object} collection item collection object
     * @param {Boolean} triggerNavigationEvent - To trigger navigate event
     * @return {void}
     */
    recentsSuccessCallback(collection: Collection, triggerNavigationEvent: boolean): void;
    /**
     * Shows recents.
     *
     * @private
     * @param {Boolean|void} [triggerNavigationEvent] To trigger navigate event
     * @return {void}
     */
    showRecents(triggerNavigationEvent?: boolean): void;
    /**
     * Uploads
     *
     * @private
     * @param {File} file dom file object
     * @return {void}
     */
    upload: () => void;
    /**
     * Upload success handler
     *
     * @private
     * @param {File} file dom file object
     * @return {void}
     */
    uploadSuccessHandler: () => void;
    /**
     * Changes the share access of an item
     *
     * @private
     * @param {string} access share access
     * @return {void}
     */
    changeShareAccess: (access: Access) => void;
    /**
     * Changes the sort by and sort direction
     *
     * @private
     * @param {string} sortBy - field to sort by
     * @param {string} sortDirection - sort direction
     * @return {void}
     */
    sort: (sortBy: SortBy | Key, sortDirection: SortDirection) => void;
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
    updateCollection(collection: Collection, selectedItem?: BoxItem | null, callback?: () => void): Promise<void>;
    /**
     * Validates selectedItemIds to ensure all selected IDs exist in current items
     * This should be called whenever currentCollection changes
     *
     * @private
     * @param {BoxItem[]} items - current items in the collection
     * @return {void}
     */
    validateSelectedItemIds: (items: BoxItem[]) => void;
    /**
     * Attempts to generate a thumbnail for the given item and assigns the
     * item its thumbnail url if successful
     *
     * @param {BoxItem} item - item to generate thumbnail for
     * @return {Promise<void>}
     */
    attemptThumbnailGeneration: (item: BoxItem) => Promise<void>;
    /**
     * Update item in this.state.currentCollection
     *
     * @param {BoxItem} newItem - item with updated properties
     * @return {void}
     */
    updateItemInCollection: (newItem: BoxItem) => void;
    /**
     * Selects or unselects an item
     *
     * @private
     * @param {Object} item - file or folder object
     * @param {Function|void} [onSelect] - optional on select callback
     * @return {void}
     */
    select: (item: BoxItem, callback?: (item: BoxItem) => void) => void;
    /**
     * Selects the clicked file and then previews it
     * or opens it, if it was a web link
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    preview: (item: BoxItem) => void;
    /**
     * Previews a file
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    previewCallback: () => void;
    /**
     * Selects the clicked file and then downloads it
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    download: (item: BoxItem) => void;
    /**
     * Downloads a file
     *
     * @private
     * @return {void}
     */
    downloadCallback: () => void;
    /**
     * Selects the clicked file and then deletes it
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    delete: (item: BoxItem) => void;
    /**
     * Deletes a file
     *
     * @private
     * @return {void}
     */
    deleteCallback: () => void;
    /**
     * Selects the clicked file and then renames it
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    rename: (item: BoxItem) => void;
    /**
     * Callback for renaming an item
     *
     * @private
     * @param {string} value new item name
     * @return {void}
     */
    renameCallback: (nameWithoutExt?: string, extension?: string) => void;
    /**
     * Creates a new folder
     *
     * @private
     * @return {void}
     */
    createFolder: () => void;
    /**
     * New folder callback
     *
     * @private
     * @param {string} name - folder name
     * @return {void}
     */
    createFolderCallback: (name?: string) => void;
    /**
     * Throttled version of createFolderCallback to prevent errors from rapid clicking.
     *
     * @private
     * @param {string} [name] - folder name
     * @return {void}
     */
    throttledCreateFolderCallback: import("lodash").DebouncedFuncLeading<(name?: string) => void>;
    /**
     * Selects the clicked file and then shares it
     *
     * @private
     * @param {Object} item - file or folder object
     * @return {void}
     */
    share: (item: BoxItem) => void;
    /**
     * Fetch the shared link info
     * @param {BoxItem} item - The item (folder, file, weblink)
     * @returns {void}
     */
    fetchSharedLinkInfo: (item: BoxItem) => void;
    /**
     * Handles the shared link info by either creating a share link using enterprise defaults if
     * it does not already exist, otherwise update the item in the state currentCollection.
     *
     * @param {Object} item file or folder
     * @returns {void}
     */
    handleSharedLinkSuccess: (item: BoxItem) => Promise<void>;
    /**
     * Callback for sharing an item
     *
     * @private
     * @return {void}
     */
    shareCallback: () => void;
    /**
     * Closes the modal dialogs that may be open
     *
     * @private
     * @return {void}
     */
    closeModals: () => void;
    /**
     * Keyboard events
     *
     * @private
     * @return {void}
     */
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
    /**
     * Handle pagination changes for offset based pagination
     *
     * @param {number} newOffset - the new page offset value
     */
    paginate: (newOffset: number) => void;
    /**
     * Handle pagination changes for marker based pagination
     * @param {number} newOffset - the new page offset value
     */
    markerBasedPaginate: (newOffset: number) => void;
    /**
     * Get the current viewMode, checking local store if applicable
     *
     * @return {ViewMode}
     */
    getViewMode: () => ViewMode;
    /**
     * Get the maximum number of grid view columns based on the current width of the
     * content explorer.
     *
     * @return {number}
     */
    getMaxNumberOfGridViewColumnsForWidth: () => number;
    getMetadataViewProps: () => Omit<MetadataViewContainerProps, 'hasError' | 'currentCollection' | 'metadataTemplate'>;
    /**
     * Change the current view mode
     *
     * @param {ViewMode} viewMode - the new view mode
     * @return {void}
     */
    changeViewMode: (viewMode: ViewMode) => void;
    /**
     * Callback for when value of GridViewSlider changes
     *
     * @param {number} sliderValue - value of slider
     * @return {void}
     */
    onGridViewSliderChange: (sliderValue: number) => void;
    /**
     * Function to update metadata field value in metadata based view
     * @param {BoxItem} item - file item whose metadata is being changed
     * @param {string} field - metadata template field name
     * @param {MetadataFieldValue} oldValue - current value
     * @param {MetadataFieldValue} newVlaue - new value the field to be updated to
     */
    updateMetadata: (item: BoxItem, field: string, oldValue?: MetadataFieldValue | null, newValue?: MetadataFieldValue | null) => void;
    updateMetadataSuccessCallback: (item: BoxItem, field: string, newValue?: MetadataFieldValue | null) => void;
    clearSelectedItemIds: () => void;
    /**
     * Toggle metadata side panel visibility
     *
     * @private
     * @return {void}
     */
    onMetadataSidePanelToggle: () => void;
    /**
     * Close metadata side panel
     *
     * @private
     * @return {void}
     */
    closeMetadataSidePanel: () => void;
    filterMetadata: (fields: ExternalFilterValues) => void;
    /**
     * Renders the file picker
     *
     * @private
     * @inheritdoc
     * @return {Element}
     */
    render(): React.JSX.Element;
}
export { ContentExplorer as ContentExplorerComponent };
declare const _default: any;
export default _default;
