/**
 * @flow
 * @file Content Preview Component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import * as React from 'react';
import classNames from 'classnames';
import uniqueid from 'lodash/uniqueId';
import throttle from 'lodash/throttle';
import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';
import getProp from 'lodash/get';
import flow from 'lodash/flow';
import noop from 'lodash/noop';
import Measure from 'react-measure';
import type { RouterHistory } from 'react-router-dom';
import { decode } from '../../utils/keys';
import makeResponsive from '../common/makeResponsive';
import Internationalize from '../common/Internationalize';
import AsyncLoad from '../common/async-load';
import TokenService from '../../utils/TokenService';
import { isInputElement, focus } from '../../utils/dom';
import { getTypedFileId } from '../../utils/file';
import { withErrorBoundary } from '../common/error-boundary';
import { withLogger } from '../common/logger';
import { PREVIEW_FIELDS_TO_FETCH } from '../../utils/fields';
import { mark } from '../../utils/performance';
import { withFeatureProvider } from '../common/feature-checking';
import { EVENT_JS_READY } from '../common/logger/constants';
import ReloadNotification from './ReloadNotification';
import API from '../../api';
import PreviewHeader from './preview-header';
import PreviewNavigation from './PreviewNavigation';
import PreviewLoading from './PreviewLoading';
import {
    DEFAULT_HOSTNAME_API,
    DEFAULT_HOSTNAME_APP,
    DEFAULT_HOSTNAME_STATIC,
    DEFAULT_PREVIEW_VERSION,
    DEFAULT_LOCALE,
    DEFAULT_PATH_STATIC_PREVIEW,
    CLIENT_NAME_CONTENT_PREVIEW,
    ORIGIN_PREVIEW,
    ORIGIN_CONTENT_PREVIEW,
    ERROR_CODE_UNKNOWN,
} from '../../constants';
import type { ErrorType } from '../common/flowTypes';
import type { VersionChangeCallback } from '../content-sidebar/versions';
import '../common/fonts.scss';
import '../common/base.scss';
import './ContentPreview.scss';

type Props = {
    apiHost: string,
    appHost: string,
    autoFocus: boolean,
    cache?: APICache,
    canDownload?: boolean,
    className: string,
    collection: Array<string | BoxItem>,
    contentOpenWithProps: ContentOpenWithProps,
    contentSidebarProps: ContentSidebarProps,
    enableThumbnailsSidebar: boolean,
    features?: FeatureConfig,
    fileId?: string,
    fileOptions?: Object,
    getInnerRef: () => ?HTMLElement,
    hasHeader?: boolean,
    history?: RouterHistory,
    isLarge: boolean,
    isVeryLarge?: boolean,
    language: string,
    logoUrl?: string,
    measureRef: Function,
    messages?: StringMap,
    onClose?: Function,
    onDownload: Function,
    onLoad: Function,
    onNavigate: Function,
    onVersionChange: VersionChangeCallback,
    previewLibraryVersion: string,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    sharedLink?: string,
    sharedLinkPassword?: string,
    showAnnotations?: boolean,
    staticHost: string,
    staticPath: string,
    token: Token,
    useHotkeys: boolean,
} & ErrorContextProps &
    WithLoggerProps;

type State = {
    currentFileId?: string,
    error?: ErrorType,
    file?: BoxItem,
    isReloadNotificationVisible: boolean,
    isThumbnailSidebarOpen: boolean,
    prevFileIdProp?: string, // the previous value of the "fileId" prop. Needed to implement getDerivedStateFromProps
    selectedVersion?: BoxItemVersion,
};

// Emitted by preview's 'load' event
type PreviewTimeMetrics = {
    conversion: number,
    preload?: number,
    rendering: number,
    total: number,
};

// Emitted by preview's 'preview_metric' event
type PreviewMetrics = {
    browser_name: string,
    client_version: string,
    content_type: string, // Sum of all available load times.
    convert_time: number,
    download_response_time: number,
    error?: Object,
    event_name?: string,
    extension: string,
    file_id: string,
    file_info_time: number,
    file_version_id: string,
    full_document_load_time: number,
    locale: string,
    logger_session_id: string,
    rep_type: string,
    timestamp: string,
    value: number,
};

type PreviewLibraryError = {
    error: ErrorType,
};

const InvalidIdError = new Error('Invalid id for Preview!');
const PREVIEW_LOAD_METRIC_EVENT = 'load';
const MARK_NAME_JS_READY = `${ORIGIN_CONTENT_PREVIEW}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

const LoadableSidebar = AsyncLoad({
    loader: () => import(/* webpackMode: "lazy", webpackChunkName: "content-sidebar" */ '../content-sidebar'),
});

class ContentPreview extends React.PureComponent<Props, State> {
    id: string;

    props: Props;

    state: State;

    preview: any;

    api: API;

    // Defines a generic type for ContentSidebar, since an import would interfere with code splitting
    contentSidebar: { current: null | { refresh: Function } } = React.createRef();

    previewContainer: ?HTMLDivElement;

    mouseMoveTimeoutID: TimeoutID;

    rootElement: HTMLElement;

    stagedFile: ?BoxItem;

    updateVersionToCurrent: ?() => void;

    initialState: State = {
        error: undefined,
        isReloadNotificationVisible: false,
        isThumbnailSidebarOpen: false,
    };

    static defaultProps = {
        apiHost: DEFAULT_HOSTNAME_API,
        appHost: DEFAULT_HOSTNAME_APP,
        autoFocus: false,
        canDownload: true,
        className: '',
        collection: [],
        contentOpenWithProps: {},
        contentSidebarProps: {},
        enableThumbnailsSidebar: false,
        hasHeader: false,
        language: DEFAULT_LOCALE,
        onDownload: noop,
        onError: noop,
        onLoad: noop,
        onNavigate: noop,
        onVersionChange: noop,
        previewLibraryVersion: DEFAULT_PREVIEW_VERSION,
        showAnnotations: false,
        staticHost: DEFAULT_HOSTNAME_STATIC,
        staticPath: DEFAULT_PATH_STATIC_PREVIEW,
        useHotkeys: true,
    };

    /**
     * @property {number}
     */
    fetchFileEndTime: ?number;

    /**
     * @property {number}
     */
    fetchFileStartTime: ?number;

    /**
     * [constructor]
     *
     * @return {ContentPreview}
     */
    constructor(props: Props) {
        super(props);
        const {
            apiHost,
            cache,
            fileId,
            language,
            requestInterceptor,
            responseInterceptor,
            sharedLink,
            sharedLinkPassword,
            token,
        } = props;

        this.id = uniqueid('bcpr_');
        this.api = new API({
            apiHost,
            cache,
            clientName: CLIENT_NAME_CONTENT_PREVIEW,
            language,
            requestInterceptor,
            responseInterceptor,
            sharedLink,
            sharedLinkPassword,
            token,
        });
        this.state = {
            ...this.initialState,
            currentFileId: fileId,
            // eslint-disable-next-line react/no-unused-state
            prevFileIdProp: fileId,
        };
        const { logger } = props;
        logger.onReadyMetric({
            endMarkName: MARK_NAME_JS_READY,
        });
    }

    /**
     * Cleanup
     *
     * @return {void}
     */
    componentWillUnmount(): void {
        // Don't destroy the cache while unmounting
        this.api.destroy(false);
        this.destroyPreview();
    }

    /**
     * Cleans up the preview instance
     */
    destroyPreview() {
        if (this.preview) {
            this.preview.destroy();
            this.preview.removeAllListeners();
            this.preview = undefined;
        }

        this.setState({ selectedVersion: undefined });
    }

    /**
     * Destroys api instances with caches
     *
     * @private
     * @return {void}
     */
    clearCache(): void {
        this.api.destroy(true);
    }

    /**
     * Once the component mounts, load Preview assets and fetch file info.
     *
     * @return {void}
     */
    componentDidMount(): void {
        this.loadStylesheet();
        this.loadScript();

        this.fetchFile(this.state.currentFileId);
        this.focusPreview();
    }

    static getDerivedStateFromProps(props: Props, state: State) {
        const { fileId } = props;

        if (fileId !== state.prevFileIdProp) {
            return {
                currentFileId: fileId,
                prevFileIdProp: fileId,
            };
        }

        return null;
    }

    /**
     * After component updates, load Preview if appropriate.
     *
     * @return {void}
     */
    componentDidUpdate(prevProps: Props, prevState: State): void {
        const { token } = this.props;
        const { currentFileId } = this.state;
        const hasFileIdChanged = prevState.currentFileId !== currentFileId;
        const hasTokenChanged = prevProps.token !== token;
        if (hasFileIdChanged) {
            this.destroyPreview();
            this.fetchFile(currentFileId);
        } else if (this.shouldLoadPreview(prevState)) {
            this.loadPreview();
        } else if (hasTokenChanged) {
            this.updatePreviewToken();
        }
    }

    /**
     * Updates the access token used by preview library
     *
     * @param {boolean} shouldReload - true if preview should be reloaded
     */
    updatePreviewToken(shouldReload: boolean = false) {
        if (this.preview) {
            this.preview.updateToken(this.props.token, shouldReload);
        }
    }

    /**
     * Returns whether or not preview should be loaded.
     *
     * @param {State} prevState - Previous state
     * @return {boolean}
     */
    shouldLoadPreview(prevState: State): boolean {
        const { file, selectedVersion }: State = this.state;
        const { file: prevFile, selectedVersion: prevSelectedVersion }: State = prevState;
        const prevSelectedVersionId = getProp(prevSelectedVersion, 'id');
        const selectedVersionId = getProp(selectedVersion, 'id');
        const prevFileVersionId = getProp(prevFile, 'file_version.id');
        const fileVersionId = getProp(file, 'file_version.id');
        let loadPreview = false;

        if (selectedVersionId !== prevSelectedVersionId) {
            const isPreviousCurrent = fileVersionId === prevSelectedVersionId || !prevSelectedVersionId;
            const isSelectedCurrent = fileVersionId === selectedVersionId || !selectedVersionId;

            // Load preview if the user has selected a non-current version of the file
            loadPreview = !isPreviousCurrent || !isSelectedCurrent;
        } else if (fileVersionId && prevFileVersionId) {
            // Load preview if the file's current version ID has changed
            loadPreview = fileVersionId !== prevFileVersionId;
        } else {
            // Load preview if file object has newly been populated in state
            loadPreview = !prevFile && !!file;
        }

        return loadPreview;
    }

    /**
     * Returns preview asset urls
     *
     * @return {string} base url
     */
    getBasePath(asset: string): string {
        const { staticHost, staticPath, language, previewLibraryVersion }: Props = this.props;
        const path: string = `${staticPath}/${previewLibraryVersion}/${language}/${asset}`;
        const suffix: string = staticHost.endsWith('/') ? path : `/${path}`;
        return `${staticHost}${suffix}`;
    }

    /**
     * Determines if preview assets are loaded
     *
     * @return {boolean} true if preview is loaded
     */
    isPreviewLibraryLoaded(): boolean {
        return !!global.Box && !!global.Box.Preview;
    }

    /**
     * Loads external css by appending a <link> element
     *
     * @return {void}
     */
    loadStylesheet(): void {
        const { head } = document;
        const url: string = this.getBasePath('preview.css');

        if (!head || head.querySelector(`link[rel="stylesheet"][href="${url}"]`)) {
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;
        head.appendChild(link);
    }

    /**
     * Loads external script by appending a <script> element
     *
     * @return {void}
     */
    loadScript(): void {
        const { head } = document;
        const url: string = this.getBasePath('preview.js');

        if (!head || this.isPreviewLibraryLoaded()) {
            return;
        }

        const previewScript = head.querySelector(`script[src="${url}"]`);
        if (previewScript) {
            return;
        }

        const script = document.createElement('script');
        script.src = url;
        script.addEventListener('load', this.loadPreview);
        head.appendChild(script);
    }

    /**
     * Focuses the preview on load.
     *
     * @return {void}
     */
    focusPreview() {
        const { autoFocus, getInnerRef }: Props = this.props;
        if (autoFocus && !isInputElement(document.activeElement)) {
            focus(getInnerRef());
        }
    }

    /**
     * Updates preview cache and prefetches a file
     *
     * @param {BoxItem} file - file to prefetch
     * @return {void}
     */
    updatePreviewCacheAndPrefetch(file: BoxItem, token: Token): void {
        if (!this.preview || !file || !file.id) {
            return;
        }

        this.preview.updateFileCache([file]);
        this.preview.prefetch({ fileId: file.id, token });
    }

    /**
     * Gets the file id
     *
     * @param {string|BoxItem} file - box file or file id
     * @return {string} file id
     */
    getFileId(file?: string | BoxItem): string {
        if (typeof file === 'string') {
            return file;
        }

        if (typeof file === 'object' && !!file.id) {
            return file.id;
        }

        throw InvalidIdError;
    }

    /**
     * Prefetches the next few preview files if any
     *
     * @param {Array<string|BoxItem>} files - files to prefetch
     * @return {void}
     */
    async prefetch(files: Array<string | BoxItem>): Promise<void> {
        const { token }: Props = this.props;
        const typedIds: string[] = files.map(file => getTypedFileId(this.getFileId(file)));
        await TokenService.cacheTokens(typedIds, token);
        files.forEach(file => {
            const fileId = this.getFileId(file);
            this.fetchFile(fileId, noop, noop, {
                refreshCache: false,
            });
        });
    }

    /**
     * Calculates the total file fetch time
     *
     * @return {number} the total fetch time
     */
    getTotalFileFetchTime(): number {
        if (!this.fetchFileStartTime || !this.fetchFileEndTime) {
            return 0;
        }

        return Math.round(this.fetchFileEndTime - this.fetchFileStartTime);
    }

    /**
     * Handler for 'preview_error' preview event
     *
     * @param {PreviewLibraryError} previewError - the error data emitted from preview
     * @return {void}
     */
    onPreviewError = ({ error, ...rest }: PreviewLibraryError): void => {
        const { code = ERROR_CODE_UNKNOWN } = error;
        const { onError } = this.props;

        // In case of error, there should be no thumbnail sidebar to account for
        this.setState({ isThumbnailSidebarOpen: false });

        onError(
            error,
            code,
            {
                ...rest,
                error,
            },
            ORIGIN_PREVIEW,
        );
    };

    /**
     * Event handler 'preview_metric' which also adds in the file fetch time if it's a load event
     *
     * @param {Object} previewMetrics - the object emitted by 'preview_metric'
     * @return {void}
     */
    onPreviewMetric = (previewMetrics: PreviewMetrics): void => {
        const { logger } = this.props;
        const { event_name } = previewMetrics;
        let metrics = {
            ...previewMetrics,
        };

        // We need to add in the total file fetch time to the file_info_time and value (total)
        // as preview does not do the files call
        if (event_name === PREVIEW_LOAD_METRIC_EVENT) {
            const totalFetchFileTime = this.getTotalFileFetchTime();
            const totalTime = (previewMetrics.value || 0) + totalFetchFileTime;

            // If an unnatural load time occurs or is invalid, don't log a load event
            if (!totalTime) {
                return;
            }

            metrics = {
                ...previewMetrics,
                file_info_time: totalFetchFileTime,
                value: totalTime,
            };
        }

        logger.onPreviewMetric(metrics);
    };

    /**
     * Adds in the file fetch time to the preview metrics
     *
     * @param {Object} previewTimeMetrics - the preview time metrics
     * @return {Object} the preview time metrics merged with the files call time
     */
    addFetchFileTimeToPreviewMetrics(previewTimeMetrics: PreviewTimeMetrics): PreviewTimeMetrics {
        const totalFetchFileTime = this.getTotalFileFetchTime();
        const { rendering, conversion, preload } = previewTimeMetrics;

        // We need to add in the total file fetch time to the rendering and total as preview
        // does not do the files call. In the case the file is in the process of
        // being converted, we need to add to conversion instead of the render
        let totalConversion = conversion;
        let totalRendering = rendering;
        let totalPreload = preload;
        if (conversion) {
            totalConversion += totalFetchFileTime;
        } else {
            totalRendering += totalFetchFileTime;
        }

        if (totalPreload) {
            // Preload is optional, depending on file type
            totalPreload += totalFetchFileTime;
        }

        const previewMetrics = {
            conversion: totalConversion,
            rendering: totalRendering,
            total: totalRendering + totalConversion,
            preload: totalPreload,
        };

        return previewMetrics;
    }

    /**
     * onLoad function for preview
     *
     * @return {void}
     */
    onPreviewLoad = (data: Object): void => {
        const { onLoad, collection }: Props = this.props;
        const currentIndex = this.getFileIndex();
        const filesToPrefetch = collection.slice(currentIndex + 1, currentIndex + 5);
        const previewTimeMetrics = getProp(data, 'metrics.time');
        let loadData = data;

        if (previewTimeMetrics) {
            const totalPreviewMetrics = this.addFetchFileTimeToPreviewMetrics(previewTimeMetrics);
            loadData = {
                ...loadData,
                metrics: {
                    ...loadData.metrics,
                    time: totalPreviewMetrics,
                },
            };
        }

        onLoad(loadData);
        this.focusPreview();
        if (this.preview && filesToPrefetch.length > 1) {
            this.prefetch(filesToPrefetch);
        }
    };

    /**
     * Returns whether file can be downloaded based on file properties, permissions, and user-defined options.
     *
     * @return {boolean}
     */
    canDownload(): boolean {
        const { canDownload }: Props = this.props;
        const { file }: State = this.state;
        const isFileDownloadable =
            getProp(file, 'permissions.can_download', false) && getProp(file, 'is_download_available', false);
        return isFileDownloadable && !!canDownload;
    }

    /**
     * Returns whether file can be annotated based on permissions
     *
     * @return {boolean}
     */
    canAnnotate(): boolean {
        const { showAnnotations }: Props = this.props;
        const { file }: State = this.state;
        const isFileAnnotatable = getProp(file, 'permissions.can_annotate', false);
        return !!showAnnotations && isFileAnnotatable;
    }

    /**
     * Returns whether a preview should render annotations based on permissions
     *
     * @return {boolean}
     */
    canViewAnnotations(): boolean {
        const { showAnnotations }: Props = this.props;
        const { file }: State = this.state;
        const hasViewAllPermissions = getProp(file, 'permissions.can_view_annotations_all', false);
        const hasViewSelfPermissions = getProp(file, 'permissions.can_view_annotations_self', false);
        return !!showAnnotations && (this.canAnnotate() || hasViewAllPermissions || hasViewSelfPermissions);
    }

    /**
     * Loads preview in the component using the preview library.
     *
     * @return {void}
     */
    loadPreview = async (): Promise<void> => {
        const { enableThumbnailsSidebar, fileOptions, token: tokenOrTokenFunction, ...rest }: Props = this.props;
        const { file, selectedVersion }: State = this.state;

        if (!this.isPreviewLibraryLoaded() || !file || !tokenOrTokenFunction) {
            return;
        }

        const fileId = this.getFileId(file);

        if (fileId !== this.state.currentFileId) {
            return;
        }

        const fileOpts = { ...fileOptions };
        const token = typedId => TokenService.getReadTokens(typedId, tokenOrTokenFunction);

        if (selectedVersion) {
            fileOpts[fileId] = fileOpts[fileId] || {};
            fileOpts[fileId].fileVersionId = selectedVersion.id;
        }

        const previewOptions = {
            container: `#${this.id} .bcpr-content`,
            enableThumbnailsSidebar,
            fileOptions: fileOpts,
            header: 'none',
            headerElement: `#${this.id} .bcpr-PreviewHeader`,
            showAnnotations: this.canViewAnnotations(),
            showDownload: this.canDownload(),
            skipServerUpdate: true,
            useHotkeys: false,
        };
        const { Preview } = global.Box;
        this.preview = new Preview();
        this.preview.addListener('load', this.onPreviewLoad);
        this.preview.addListener('preview_error', this.onPreviewError);
        this.preview.addListener('preview_metric', this.onPreviewMetric);
        this.preview.addListener('thumbnailsOpen', () => this.setState({ isThumbnailSidebarOpen: true }));
        this.preview.addListener('thumbnailsClose', () => this.setState({ isThumbnailSidebarOpen: false }));
        this.preview.updateFileCache([file]);
        this.preview.show(file.id, token, {
            ...previewOptions,
            ...omit(rest, Object.keys(previewOptions)),
        });
    };

    /**
     * Updates preview file from temporary staged file.
     *
     * @return {void}
     */
    loadFileFromStage = () => {
        if (this.stagedFile) {
            this.setState({ ...this.initialState, file: this.stagedFile }, () => {
                this.stagedFile = undefined;
            });
        }
    };

    /**
     * Removes the reload notification
     *
     * @return {void}
     */
    closeReloadNotification = () => {
        this.setState({ isReloadNotificationVisible: false });
    };

    /**
     * Tells the preview to resize
     *
     * @return {void}
     */
    onResize = (): void => {
        if (this.preview && this.preview.getCurrentViewer()) {
            this.preview.resize();
        }
    };

    /**
     * File fetch success callback
     *
     * @param {Object} file - Box file
     * @return {void}
     */
    fetchFileSuccessCallback = (file: BoxItem): void => {
        this.fetchFileEndTime = performance.now();

        const { file: currentFile }: State = this.state;
        const isExistingFile = currentFile ? currentFile.id === file.id : false;
        const isWatermarked = getProp(file, 'watermark_info.is_watermarked', false);

        // If the file is watermarked or if its a new file, then update the state
        // In this case preview should reload without prompting the user
        if (isWatermarked || !isExistingFile) {
            this.setState({ ...this.initialState, file });
            // $FlowFixMe file version and sha1 should exist at this point
        } else if (currentFile.file_version.sha1 !== file.file_version.sha1) {
            // If we are already prevewing the file that got updated then show the
            // user a notification to reload the file only if its sha1 changed
            this.stagedFile = file;
            this.setState({
                ...this.initialState,
                isReloadNotificationVisible: true,
            });
        }
    };

    /**
     * File fetch error callback
     *
     * @return {void}
     */
    fetchFileErrorCallback = (fileError: ElementsXhrError, code: string): void => {
        const { onError } = this.props;
        const errorCode = fileError.code || code;
        const error = {
            code: errorCode,
            message: fileError.message,
        };
        this.setState({ error, file: undefined });
        onError(fileError, errorCode, {
            error: fileError,
        });
    };

    /**
     * Fetches a file
     *
     * @param {string} id file id
     * @param {Function|void} [successCallback] - Callback after file is fetched
     * @param {Function|void} [errorCallback] - Callback after error
     * @param {Object|void} [fetchOptions] - Fetch options
     * @return {void}
     */
    fetchFile(
        id: ?string,
        successCallback?: Function,
        errorCallback?: Function,
        fetchOptions?: FetchOptions = {},
    ): void {
        if (!id) {
            return;
        }

        this.fetchFileStartTime = performance.now();
        this.fetchFileEndTime = null;

        this.api
            .getFileAPI()
            .getFile(
                id,
                successCallback || this.fetchFileSuccessCallback,
                errorCallback || this.fetchFileErrorCallback,
                {
                    ...fetchOptions,
                    fields: PREVIEW_FIELDS_TO_FETCH,
                },
            );
    }

    /**
     * Returns the preview instance
     *
     * @return {Preview} current instance of preview
     */
    getPreview = (): any => {
        const { file }: State = this.state;
        if (!this.preview || !file) {
            return null;
        }

        return this.preview;
    };

    /**
     * Returns the viewer instance being used by preview.
     * This will let child components access the viewers.
     *
     * @return {Viewer} current instance of the preview viewer
     */
    getViewer = (): any => {
        const preview = this.getPreview();
        const viewer = preview ? preview.getCurrentViewer() : null;
        return viewer && viewer.isLoaded() && !viewer.isDestroyed() ? viewer : null;
    };

    /**
     * Finds the index of current file inside the collection
     *
     * @return {number} -1 if not indexed
     */
    getFileIndex() {
        const { currentFileId }: State = this.state;
        const { collection }: Props = this.props;
        if (!currentFileId || collection.length < 2) {
            return -1;
        }

        return collection.findIndex(item => {
            if (typeof item === 'string') {
                return item === currentFileId;
            }

            return item.id === currentFileId;
        });
    }

    /**
     * Shows a preview of a file at the specified index in the current collection.
     *
     * @public
     * @param {number} index - Index of file to preview
     * @return {void}
     */
    navigateToIndex(index: number) {
        const { collection, onNavigate }: Props = this.props;
        const { length } = collection;
        if (length < 2 || index < 0 || index > length - 1) {
            return;
        }

        const fileOrId = collection[index];
        const fileId = typeof fileOrId === 'object' ? fileOrId.id || '' : fileOrId;

        this.setState(
            {
                currentFileId: fileId,
            },
            () => {
                // Execute navigation callback
                onNavigate(fileId);
            },
        );
    }

    /**
     * Shows a preview of the previous file.
     *
     * @public
     * @return {void}
     */
    navigateLeft = () => {
        const currentIndex = this.getFileIndex();
        const newIndex = currentIndex === 0 ? 0 : currentIndex - 1;
        if (newIndex !== currentIndex) {
            this.navigateToIndex(newIndex);
        }
    };

    /**
     * Shows a preview of the next file.
     *
     * @public
     * @return {void}
     */
    navigateRight = () => {
        const { collection }: Props = this.props;
        const currentIndex = this.getFileIndex();
        const newIndex = currentIndex === collection.length - 1 ? collection.length - 1 : currentIndex + 1;
        if (newIndex !== currentIndex) {
            this.navigateToIndex(newIndex);
        }
    };

    /**
     * Downloads file.
     *
     * @public
     * @return {void}
     */
    download = () => {
        const { onDownload }: Props = this.props;
        const { file }: State = this.state;
        if (this.preview) {
            this.preview.download();
            onDownload(cloneDeep(file));
        }
    };

    /**
     * Prints file.
     *
     * @public
     * @return {void}
     */
    print = () => {
        if (this.preview) {
            this.preview.print();
        }
    };

    /**
     * Mouse move handler that is throttled and show
     * the navigation arrows if applicable.
     *
     * @return {void}
     */
    onMouseMove = throttle(() => {
        const viewer = this.getViewer();
        const isPreviewing = !!viewer;
        const CLASS_NAVIGATION_VISIBILITY = 'bcpr-nav-is-visible';

        clearTimeout(this.mouseMoveTimeoutID);

        if (!this.previewContainer) {
            return;
        }

        // Always assume that navigation arrows will be hidden
        this.previewContainer.classList.remove(CLASS_NAVIGATION_VISIBILITY);

        // Only show it if either we aren't previewing or if we are then the viewer
        // is not blocking the show. If we are previewing then the viewer may choose
        // to not allow navigation arrows. This is mostly useful for videos since the
        // navigation arrows may interfere with the settings menu inside video player.
        if (this.previewContainer && (!isPreviewing || viewer.allowNavigationArrows())) {
            this.previewContainer.classList.add(CLASS_NAVIGATION_VISIBILITY);
        }

        this.mouseMoveTimeoutID = setTimeout(() => {
            if (this.previewContainer) {
                this.previewContainer.classList.remove(CLASS_NAVIGATION_VISIBILITY);
            }
        }, 1500);
    }, 1000);

    /**
     * Keyboard events
     *
     * @return {void}
     */
    onKeyDown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
        const { useHotkeys }: Props = this.props;
        if (!useHotkeys) {
            return;
        }

        let consumed = false;
        const key = decode(event);
        const viewer = this.getViewer();

        // If focus was on an input or if the viewer doesn't exist
        // then don't bother doing anything further
        if (!key || !viewer || isInputElement(event.target)) {
            return;
        }

        if (typeof viewer.onKeydown === 'function') {
            consumed = !!viewer.onKeydown(key, event.nativeEvent);
        }

        if (!consumed) {
            switch (key) {
                case 'ArrowLeft':
                    this.navigateLeft();
                    consumed = true;
                    break;
                case 'ArrowRight':
                    this.navigateRight();
                    consumed = true;
                    break;
                default:
                // no-op
            }
        }

        if (consumed) {
            event.preventDefault();
            event.stopPropagation();
        }
    };

    /**
     * Handles version change events
     *
     * @param {string} [version] - The version that is now previewed
     * @param {object} [additionalVersionInfo] - extra info about the version
     */
    onVersionChange = (version?: BoxItemVersion, additionalVersionInfo?: AdditionalVersionInfo = {}): void => {
        const { onVersionChange }: Props = this.props;
        this.updateVersionToCurrent = additionalVersionInfo.updateVersionToCurrent;

        onVersionChange(version, additionalVersionInfo);
        this.setState({
            selectedVersion: version,
        });
    };

    /**
     * Holds the reference the preview container
     *
     * @return {void}
     */
    containerRef = (container: ?HTMLDivElement) => {
        this.previewContainer = container;
    };

    /**
     * Refreshes the content sidebar panel
     *
     * @return {void}
     */
    refreshSidebar(): void {
        const { current: contentSidebar } = this.contentSidebar;

        if (contentSidebar) {
            contentSidebar.refresh();
        }
    }

    /**
     * Renders the file preview
     *
     * @inheritdoc
     * @return {Element}
     */
    render() {
        const {
            apiHost,
            token,
            language,
            messages,
            className,
            contentSidebarProps,
            contentOpenWithProps,
            hasHeader,
            history,
            isLarge,
            isVeryLarge,
            logoUrl,
            onClose,
            measureRef,
            sharedLink,
            sharedLinkPassword,
            requestInterceptor,
            responseInterceptor,
        }: Props = this.props;

        const {
            error,
            file,
            isReloadNotificationVisible,
            currentFileId,
            isThumbnailSidebarOpen,
            selectedVersion,
        }: State = this.state;
        const { collection }: Props = this.props;
        const styleClassName = classNames(
            'be bcpr',
            {
                'bcpr-thumbnails-open': isThumbnailSidebarOpen,
            },
            className,
        );

        if (!currentFileId) {
            return null;
        }

        const errorCode = getProp(error, 'code');
        const currentVersionId = getProp(file, 'file_version.id');
        const selectedVersionId = getProp(selectedVersion, 'id', currentVersionId);
        const onHeaderClose = currentVersionId === selectedVersionId ? onClose : this.updateVersionToCurrent;

        /* eslint-disable jsx-a11y/no-static-element-interactions */
        /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
        return (
            <Internationalize language={language} messages={messages}>
                <div id={this.id} className={styleClassName} ref={measureRef} onKeyDown={this.onKeyDown} tabIndex={0}>
                    {hasHeader && (
                        <PreviewHeader
                            file={file}
                            logoUrl={logoUrl}
                            token={token}
                            onClose={onHeaderClose}
                            onPrint={this.print}
                            canDownload={this.canDownload()}
                            onDownload={this.download}
                            contentOpenWithProps={contentOpenWithProps}
                            canAnnotate={this.canAnnotate()}
                            selectedVersion={selectedVersion}
                        />
                    )}
                    <div className="bcpr-body">
                        <div className="bcpr-container" onMouseMove={this.onMouseMove} ref={this.containerRef}>
                            {file ? (
                                <Measure bounds onResize={this.onResize}>
                                    {({ measureRef: previewRef }) => <div ref={previewRef} className="bcpr-content" />}
                                </Measure>
                            ) : (
                                <div className="bcpr-loading-wrapper">
                                    <PreviewLoading
                                        errorCode={errorCode}
                                        isLoading={!errorCode}
                                        loadingIndicatorProps={{
                                            size: 'large',
                                        }}
                                    />
                                </div>
                            )}
                            <PreviewNavigation
                                collection={collection}
                                currentIndex={this.getFileIndex()}
                                history={history}
                                onNavigateLeft={this.navigateLeft}
                                onNavigateRight={this.navigateRight}
                            />
                        </div>
                        {file && (
                            <LoadableSidebar
                                {...contentSidebarProps}
                                apiHost={apiHost}
                                token={token}
                                cache={this.api.getCache()}
                                fileId={currentFileId}
                                getPreview={this.getPreview}
                                getViewer={this.getViewer}
                                history={history}
                                isDefaultOpen={isLarge || isVeryLarge}
                                language={language}
                                ref={this.contentSidebar}
                                sharedLink={sharedLink}
                                sharedLinkPassword={sharedLinkPassword}
                                requestInterceptor={requestInterceptor}
                                responseInterceptor={responseInterceptor}
                                onVersionChange={this.onVersionChange}
                            />
                        )}
                    </div>
                    {isReloadNotificationVisible && (
                        <ReloadNotification onClose={this.closeReloadNotification} onClick={this.loadFileFromStage} />
                    )}
                </div>
            </Internationalize>
        );
        /* eslint-enable jsx-a11y/no-static-element-interactions */
        /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
    }
}

export type ContentPreviewProps = Props;
export { ContentPreview as ContentPreviewComponent };
export default flow([
    makeResponsive,
    withFeatureProvider,
    withLogger(ORIGIN_CONTENT_PREVIEW),
    withErrorBoundary(ORIGIN_CONTENT_PREVIEW),
])(ContentPreview);
