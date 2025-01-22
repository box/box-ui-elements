/**
 * @file Content Explorer Component
 * @author Box
 */

import * as React from 'react';
import { Component } from 'react';
import noop from 'lodash/noop';
import flow from 'lodash/flow';
import { FormattedMessage } from 'react-intl';
import { Theme } from '../common/theming';
import API from '../../api';
import type { View } from '../../constants';
import MetadataQueryAPIHelper from '../../features/metadata-based-view/MetadataQueryAPIHelper';
import LocalStore from '../../utils/LocalStore';
import makeResponsive from '../common/makeResponsive';
import { FeatureConfig } from '../common/feature-checking';
import withFeatureConsumer from '../common/feature-checking/withFeatureConsumer';
import withFeatureProvider from '../common/feature-checking/withFeatureProvider';
import { MetadataQuery, FieldsToShow } from '../../common/types/metadataQueries';
import { MetadataFieldValue } from '../../common/types/metadata';
import Header from '../common/header/Header';
import Content from './Content';
import UploadDialog from '../common/upload-dialog/UploadDialog';
import {
    DEFAULT_HOSTNAME_UPLOAD,
    DEFAULT_HOSTNAME_API,
    DEFAULT_HOSTNAME_APP,
    DEFAULT_HOSTNAME_STATIC,
    SORT_ASC,
    FIELD_NAME,
    DEFAULT_ROOT,
    DEFAULT_PAGE_NUMBER,
    DEFAULT_PAGE_SIZE,
    DEFAULT_VIEW_FILES,
} from '../../constants';

import '../common/fonts.scss';
import '../common/base.scss';
import '../common/modal.scss';
import './ContentExplorer.scss';

// Core types converted from Flow to TypeScript
type Token = null | undefined | string | Function;
type StringMap = { [key: string]: string };

type View =
    | 'error'
    | 'selected'
    | 'recents'
    | 'folder'
    | 'search'
    | 'upload-empty'
    | 'upload-in-progress'
    | 'upload-success'
    | 'metadata';

type DefaultView = 'recents' | 'files';

type SortBy = 'date' | 'name' | 'relevance' | 'size';
type SortDirection = 'ASC' | 'DESC';

type Access = 'collab' | 'company' | 'open' | 'none';

type User = {
    avatar_url?: string;
    email?: string;
    id: string;
    login?: string;
    name: string;
    type: 'user';
};

type BoxItemPermission = {
    can_annotate?: boolean;
    can_comment?: boolean;
    can_create_annotations?: boolean;
    can_delete?: boolean;
    can_download?: boolean;
    can_edit?: boolean;
    can_invite_collaborator?: boolean;
    can_preview?: boolean;
    can_rename?: boolean;
    can_set_share_access?: boolean;
    can_share?: boolean;
    can_upload?: boolean;
    can_view_annotations?: boolean;
    can_view_annotations_all?: boolean;
    can_view_annotations_self?: boolean;
};

type SharedLink = {
    access: Access;
    download_count?: number;
    download_url?: string;
    is_password_enabled?: boolean;
    permissions?: BoxItemPermission;
    url: string;
    vanity_name?: string;
    vanity_url?: string;
};

type BoxItem = {
    id: string;
    name?: string;
    type?: string;
    size?: number;
    permissions?: BoxItemPermission;
    shared_link?: SharedLink;
    modified_at?: string;
    modified_by?: User;
    created_at?: string;
    created_by?: User;
    owned_by?: User;
    description?: string;
    extension?: string;
    is_externally_owned?: boolean;
    metadata?: MetadataFieldValue;
    parent?: BoxItem;
};

type Collection = {
    boxItem?: BoxItem;
    id?: string;
    items?: Array<BoxItem>;
    name?: string;
    nextMarker?: string | null;
    offset?: number;
    percentLoaded?: number;
    permissions?: BoxItemPermission;
    sortBy?: SortBy;
    sortDirection?: SortDirection;
    totalCount?: number;
};

/**
 * Content Explorer Component
 * @class ContentExplorer
 * @extends {Component<Props, State>}
 * @description A React component for exploring and managing Box content, including viewing, uploading, and managing files and folders
 */

export interface ContentPreviewProps {
    contentSidebarProps: Record<string, unknown>;
}

export interface ContentUploaderProps {
    apiHost?: string;
    chunked?: boolean;
}

interface Props {
    apiHost: string;
    appHost: string;
    autoFocus: boolean;
    canCreateNewFolder: boolean;
    canDelete: boolean;
    canDownload: boolean;
    canPreview: boolean;
    canRename: boolean;
    canSetShareAccess: boolean;
    canShare: boolean;
    canUpload: boolean;
    className: string;
    contentPreviewProps: ContentPreviewProps;
    contentUploaderProps: ContentUploaderProps;
    currentFolderId?: string;
    defaultView: DefaultView;
    features: FeatureConfig;
    fieldsToShow?: FieldsToShow;
    initialPage: number;
    initialPageSize: number;
    isLarge: boolean;
    isMedium: boolean;
    isSmall: boolean;
    isTouch: boolean;
    isVeryLarge: boolean;
    language?: string;
    logoUrl?: string;
    measureRef?: Function;
    messages?: StringMap;
    metadataQuery?: MetadataQuery;
    onCreate: Function;
    onDelete: Function;
    onDownload: Function;
    onNavigate: Function;
    onPreview: Function;
    onRename: Function;
    onSelect: Function;
    onUpload: Function;
    previewLibraryVersion: string;
    requestInterceptor?: Function;
    responseInterceptor?: Function;
    rootFolderId: string;
    sharedLink?: string;
    sharedLinkPassword?: string;
    sortBy: SortBy;
    sortDirection: SortDirection;
    staticHost: string;
    staticPath: string;
    theme?: Theme;
    token: Token;
    uploadHost: string;
}

export interface State {
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
    isPreviewModalOpen: boolean;
    isRenameModalOpen: boolean;
    isShareModalOpen: boolean;
    isUploadModalOpen: boolean;
    markers: Array<string | null>;
    rootName: string;
    searchQuery: string;
    selected?: BoxItem;
    sortBy: SortBy;
    sortDirection: SortDirection;
    view: View;
    viewMode: 'grid' | 'list';
}

class ContentExplorer extends Component<Props, State> {
    static displayName = 'ContentExplorer';

    static localStoreViewMode = 'bce.defaultViewMode';

    id: string;

    api: API;

    table: HTMLTableElement | null = null;

    rootElement!: HTMLElement;

    appElement!: HTMLElement;

    globalModifier: boolean;

    firstLoad: boolean = true;

    store: LocalStore = new LocalStore();

    metadataQueryAPIHelper!: MetadataQueryAPIHelper;

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
        contentUploaderProps: {},
    };

    constructor(props: Props) {
        super(props);
        this.id = `bce_${Date.now()}`;
        this.api = new API({});
        this.globalModifier = false;

        this.state = {
            currentCollection: {
                items: [],
                percentLoaded: 0,
            } as Collection,
            currentOffset: 0,
            currentPageNumber: props.initialPage,
            currentPageSize: props.initialPageSize,
            errorCode: '',
            focusedRow: 0,
            gridColumnCount: 1,
            isCreateFolderModalOpen: false,
            isDeleteModalOpen: false,
            isLoading: false,
            isPreviewModalOpen: false,
            isRenameModalOpen: false,
            isShareModalOpen: false,
            isUploadModalOpen: false,
            markers: [],
            rootName: '',
            searchQuery: '',
            sortBy: props.sortBy,
            sortDirection: props.sortDirection,
            view: props.defaultView as View,
            viewMode: this.store.getItem(ContentExplorer.localStoreViewMode) || 'list',
        };
    }

    handleItemClick = (item: BoxItem): void => {
        const { onSelect } = this.props;
        this.setState({ selected: item });
        onSelect(item);
    };

    handleViewModeChange = (viewMode: 'grid' | 'list'): void => {
        this.store.setItem(ContentExplorer.localStoreViewMode, viewMode);
        this.setState({ viewMode });
    };

    fetchFolder = async (
        folderId: string,
        pageSize: number,
        offset: number,
        sortBy: string,
        sortDirection: string,
        successCallback: Function,
        errorCallback: Function,
        options: { fields?: string[]; forceFetch?: boolean } = {},
    ): Promise<void> => {
        const { currentCollection } = this.state;
        const { viewMode } = this.state;
        const isGridView = viewMode === 'grid';

        const fields = options.fields || [
            'id',
            'name',
            'type',
            'size',
            'parent',
            'extension',
            'permissions',
            'path_collection',
            'modified_at',
            'created_at',
            'modified_by',
            'created_by',
            'shared_link',
            'description',
            'owned_by',
            ...(isGridView ? ['representations'] : []),
        ];

        try {
            const folder = await this.api
                .getFolderAPI()
                .getFolder(folderId, pageSize, offset, sortBy, sortDirection, fields, options.forceFetch);

            if (successCallback) {
                successCallback(folder);
            }

            this.setState({ currentCollection: { ...currentCollection, ...folder } });
        } catch (error) {
            if (errorCallback) {
                errorCallback(error);
            }
        }
    };

    render(): JSX.Element {
        const { className } = this.props;
        const { currentCollection, isLoading, isUploadModalOpen, view } = this.state;

        return (
            <div
                className={`be bce ${className}`}
                data-testid="content-explorer"
                id={this.id}
                ref={ref => {
                    this.rootElement = ref as HTMLElement;
                }}
            >
                {isLoading && (
                    <div className="bce-loading" role="alert">
                        <FormattedMessage
                            id="be.contentExplorer.loading"
                            defaultMessage="Loading content..."
                            description="Message shown when content explorer is loading items"
                        />
                    </div>
                )}
                <Header
                    view={view}
                    onUpload={() => this.setState({ isUploadModalOpen: true })}
                    onViewModeChange={this.handleViewModeChange}
                />
                <Content
                    canDelete={this.props.canDelete}
                    canDownload={this.props.canDownload}
                    canPreview={this.props.canPreview}
                    canRename={this.props.canRename}
                    canShare={this.props.canShare}
                    currentCollection={currentCollection}
                    focusedRow={this.state.focusedRow}
                    gridColumnCount={this.state.gridColumnCount}
                    isMedium={this.props.isMedium}
                    isSmall={this.props.isSmall}
                    isTouch={this.props.isTouch}
                    onItemClick={item => this.handleItemClick(item)}
                    onItemDelete={(item: BoxItem) => this.props.onDelete(item)}
                    onItemDownload={(item: BoxItem) => this.props.onDownload(item)}
                    onItemPreview={(item: BoxItem) => this.props.onPreview(item)}
                    onItemRename={(item: BoxItem) => this.props.onRename(item)}
                    onItemSelect={(item: BoxItem) => this.props.onSelect(item)}
                    onItemShare={noop}
                    onMetadataUpdate={noop}
                    onSortChange={(sortBy, sortDirection) =>
                        this.setState({ sortBy: sortBy as SortBy, sortDirection: sortDirection as SortDirection })
                    }
                    rootId={this.props.rootFolderId}
                    selected={this.state.selected}
                    tableRef={ref => {
                        this.table = ref;
                    }}
                    view={this.state.view}
                    viewMode={this.state.viewMode}
                />
                {isUploadModalOpen && (
                    <UploadDialog
                        isOpen={isUploadModalOpen}
                        onClose={() => this.setState({ isUploadModalOpen: false })}
                        contentUploaderProps={this.props.contentUploaderProps}
                    />
                )}
            </div>
        );
    }
}

export type { Props };
export { ContentExplorer as ContentExplorerComponent };
const enhance = flow([makeResponsive, withFeatureConsumer, withFeatureProvider]);
export default enhance(ContentExplorer);
