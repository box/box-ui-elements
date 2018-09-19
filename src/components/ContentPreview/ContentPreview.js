/**
 * @flow
 * @file Content Preview Component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import React, { PureComponent } from 'react';
import uniqueid from 'lodash/uniqueId';
import throttle from 'lodash/throttle';
import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import Measure from 'react-measure';
import { decode } from 'box-react-ui/lib/utils/keys';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import IconNavigateLeft from 'box-react-ui/lib/icons/general/IconNavigateLeft';
import IconNavigateRight from 'box-react-ui/lib/icons/general/IconNavigateRight';
import PreviewLoading from './PreviewLoading';
import ContentSidebar from '../ContentSidebar';
import Header from './Header';
import API from '../../api';
import makeResponsive from '../makeResponsive';
import Internationalize from '../Internationalize';
import TokenService from '../../util/TokenService';
import { isInputElement, focus } from '../../util/dom';
import { getTypedFileId } from '../../util/file';
import ReloadNotification from './ReloadNotification';
import { PREVIEW_FIELDS_TO_FETCH } from '../../util/fields';
import {
    DEFAULT_HOSTNAME_API,
    DEFAULT_HOSTNAME_APP,
    DEFAULT_HOSTNAME_STATIC,
    DEFAULT_PREVIEW_VERSION,
    DEFAULT_LOCALE,
    DEFAULT_PATH_STATIC_PREVIEW,
    CLIENT_NAME_CONTENT_PREVIEW,
    HEADER_RETRY_AFTER,
} from '../../constants';
import '../fonts.scss';
import '../base.scss';
import './ContentPreview.scss';

type Props = {
    fileId?: string,
    previewLibraryVersion: string,
    isLarge: boolean,
    autoFocus: boolean,
    useHotkeys: boolean,
    contentSidebarProps: ContentSidebarProps,
    canDownload?: boolean,
    hasHeader?: boolean,
    apiHost: string,
    appHost: string,
    staticHost: string,
    staticPath: string,
    token: Token,
    className: string,
    measureRef: Function,
    onLoad: Function,
    onNavigate: Function,
    onDownload: Function,
    onClose?: Function,
    language: string,
    messages?: StringMap,
    cache?: APICache,
    collection: Array<string | BoxItem>,
    logoUrl?: string,
    sharedLink?: string,
    sharedLinkPassword?: string,
    onError?: Function,
    onMetric: Function,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    getInnerRef: () => ?HTMLElement,
};

type State = {
    file?: BoxItem,
    isFileError: boolean,
    isReloadNotificationVisible: boolean,
};

// Emitted by preview's 'load' event
type PreviewTimeMetrics = {
    conversion: number,
    rendering: number,
    total: number,
    preload?: number,
};

// Emitted by preview's 'preview_metric' event
type PreviewMetrics = {
    error?: Object,
    event_name?: string,
    value: number, // Sum of all available load times.
    file_info_time: number,
    convert_time: number,
    download_response_time: number,
    full_document_load_time: number,
    timestamp: string,
    file_id: string,
    file_version_id: string,
    content_type: string,
    extension: string,
    locale: string,
    rep_type: string,
    client_version: string,
    browser_name: string,
    logger_session_id: string,
};

const InvalidIdError = new Error('Invalid id for Preview!');
const RETRY_COUNT = 3; // number of times to retry network request for a file
const MS_IN_S = 1000; // ms in a sec
const PREVIEW_LOAD_METRIC_EVENT = 'load';

class ContentPreview extends PureComponent<Props, State> {
    id: string;
    props: Props;
    state: State;
    preview: any;
    api: API;
    previewContainer: ?HTMLDivElement;
    mouseMoveTimeoutID: TimeoutID;
    rootElement: HTMLElement;
    retryCount: number = 0;
    retryTimeout: TimeoutID;
    stagedFile: ?BoxItem;

    initialState: State = {
        isFileError: false,
        isReloadNotificationVisible: false,
    };

    static defaultProps = {
        className: '',
        apiHost: DEFAULT_HOSTNAME_API,
        appHost: DEFAULT_HOSTNAME_APP,
        staticHost: DEFAULT_HOSTNAME_STATIC,
        staticPath: DEFAULT_PATH_STATIC_PREVIEW,
        language: DEFAULT_LOCALE,
        previewLibraryVersion: DEFAULT_PREVIEW_VERSION,
        canDownload: true,
        hasHeader: false,
        autoFocus: false,
        useHotkeys: true,
        onDownload: noop,
        onError: noop,
        onLoad: noop,
        onMetric: noop,
        onNavigate: noop,
        collection: [],
        contentSidebarProps: {},
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
            cache,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            requestInterceptor,
            responseInterceptor,
        } = props;

        this.id = uniqueid('bcpr_');
        this.api = new API({
            cache,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            clientName: CLIENT_NAME_CONTENT_PREVIEW,
            requestInterceptor,
            responseInterceptor,
        });
        this.state = { ...this.initialState };
    }

    /**
     * Cleanup
     *
     * @return {void}
     */
    componentWillUnmount(): void {
        if (this.retryTimeout) {
            clearTimeout(this.retryTimeout);
        }
        // Don't destroy the cache while unmounting
        this.api.destroy(false);
    }

    /**
     * Cleans up the preview instance
     */
    destroyPreview() {
        if (this.preview) {
            this.preview.removeAllListeners();
            this.preview.destroy();
            this.preview = undefined;
        }
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
        const { fileId }: Props = this.props;

        this.loadStylesheet();
        this.loadScript();

        this.fetchFile(fileId);
        this.focusPreview();
    }

    /**
     * After component updates, load Preview if appropriate.
     *
     * @return {void}
     */
    componentDidUpdate(prevProps: Props, prevState: State): void {
        const { fileId, token } = this.props;
        const hasFileIdChanged = prevProps.fileId !== fileId;
        const hasTokenChanged = prevProps.token !== token;

        if (hasFileIdChanged) {
            this.destroyPreview();
            this.fetchFile(fileId);
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
     * @param {Props} prevProps - Previous props
     * @param {State} prevState - Previous state
     * @return {boolean}
     */
    shouldLoadPreview(prevState: State): boolean {
        const { file }: State = this.state;
        const { file: prevFile }: State = prevState;
        const versionPath = 'file_version.id';
        const previousVersionId = getProp(prevFile, versionPath);
        const currentVersionId = getProp(file, versionPath);
        let loadPreview = false;

        if (file && !this.preview) {
            loadPreview = true;
        } else if (previousVersionId && currentVersionId) {
            // Load preview if file version ID has changed
            loadPreview = currentVersionId !== previousVersionId;
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
        const {
            staticHost,
            staticPath,
            language,
            previewLibraryVersion,
        }: Props = this.props;
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

        if (
            !head ||
            head.querySelector(`link[rel="stylesheet"][href="${url}"]`)
        ) {
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
        const typedIds: string[] = files.map(file =>
            getTypedFileId(this.getFileId(file)),
        );
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

        const totalFetchFileTime = Math.round(
            this.fetchFileEndTime - this.fetchFileStartTime,
        );
        return totalFetchFileTime;
    }

    /**
     * Event handler 'preview_metric' which also adds in the file fetch time if it's a load event
     *
     * @param {Object} previewMetrics - the object emitted by 'preview_metric'
     * @return {void}
     */
    onPreviewMetric = (previewMetrics: PreviewMetrics): void => {
        const { onMetric }: Props = this.props;
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

        onMetric(metrics);
    };

    /**
     * Adds in the file fetch time to the preview metrics
     *
     * @param {Object} previewTimeMetrics - the preview time metrics
     * @return {Object} the preview time metrics merged with the files call time
     */
    addFetchFileTimeToPreviewMetrics(
        previewTimeMetrics: PreviewTimeMetrics,
    ): PreviewTimeMetrics {
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
        const filesToPrefetch = collection.slice(
            currentIndex + 1,
            currentIndex + 5,
        );
        const previewTimeMetrics = getProp(data, 'metrics.time');
        let loadData = data;

        if (previewTimeMetrics) {
            const totalPreviewMetrics = this.addFetchFileTimeToPreviewMetrics(
                previewTimeMetrics,
            );
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
            getProp(file, 'permissions.can_download', false) &&
            getProp(file, 'is_download_available', false);
        return isFileDownloadable && !!canDownload;
    }

    /**
     * Loads preview in the component using the preview library.
     *
     * @return {void}
     */
    loadPreview = async (): Promise<void> => {
        const {
            token: tokenOrTokenFunction,
            collection,
            onError,
            ...rest
        }: Props = this.props;
        const { file }: State = this.state;

        if (!this.isPreviewLibraryLoaded() || !file || !tokenOrTokenFunction) {
            return;
        }

        const typedId: string = getTypedFileId(this.getFileId(file));
        const token: TokenLiteral = await TokenService.getReadToken(
            typedId,
            tokenOrTokenFunction,
        );
        const previewOptions = {
            showDownload: this.canDownload(),
            skipServerUpdate: true,
            header: 'none',
            container: `#${this.id} .bcpr-content`,
            useHotkeys: false,
        };
        const { Preview } = global.Box;
        this.preview = new Preview();
        this.preview.addListener('load', this.onPreviewLoad);
        this.preview.addListener('preview_error', onError);
        this.preview.addListener('preview_metric', this.onPreviewMetric);
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
            this.setState(
                { ...this.initialState, file: this.stagedFile },
                () => {
                    this.stagedFile = undefined;
                },
            );
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
        this.retryCount = 0;

        const { file: currentFile }: State = this.state;
        const isExistingFile = currentFile ? currentFile.id === file.id : false;
        const isWatermarked = getProp(
            file,
            'watermark_info.is_watermarked',
            false,
        );

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
    /* eslint-disable no-unused-vars */
    fetchFileErrorCallback = (fileError: Error): void => {
        /* eslint-enable no-unused-vars */
        const { fileId }: Props = this.props;
        if (this.retryCount >= RETRY_COUNT) {
            this.setState({ isFileError: true });
        } else {
            this.retryCount += 1;
            clearTimeout(this.retryTimeout);

            // Respect 'Retry-After' header if present, otherwise retry with exponential back-off
            let timeoutMs = 2 ** this.retryCount * MS_IN_S;
            const retryAfter = getProp(
                `fileError.response.headers[${HEADER_RETRY_AFTER}]`,
            );
            if (retryAfter) {
                const retryAfterS = parseInt(retryAfter, 10);
                if (!Number.isNaN(retryAfterS)) {
                    timeoutMs = retryAfterS * MS_IN_S;
                }
            }

            this.retryTimeout = setTimeout(() => {
                this.fetchFile(fileId);
            }, timeoutMs);
        }
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
        return viewer && viewer.isLoaded() && !viewer.isDestroyed()
            ? viewer
            : null;
    };

    /**
     * Finds the index of current file inside the collection
     *
     * @return {number} -1 if not indexed
     */
    getFileIndex() {
        const { file }: State = this.state;
        const { collection }: Props = this.props;
        if (!file || collection.length < 2) {
            return -1;
        }

        return collection.findIndex(item => {
            if (typeof item === 'string') {
                return item === file.id;
            }

            return item.id === file.id;
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
        const fileId =
            typeof fileOrId === 'object' ? fileOrId.id || '' : fileOrId;

        // Execute navigation callback
        onNavigate(fileId);

        // Hide current preview immediately - we don't want to wait until the next file info returns
        this.destroyPreview();

        // Fetch file info for next file
        this.fetchFile(fileId);
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
        const newIndex =
            currentIndex === collection.length - 1
                ? collection.length - 1
                : currentIndex + 1;
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
    onMouseMove = throttle(
        () => {
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
            if (
                this.previewContainer &&
                (!isPreviewing || viewer.allowNavigationArrows())
            ) {
                this.previewContainer.classList.add(
                    CLASS_NAVIGATION_VISIBILITY,
                );
            }

            this.mouseMoveTimeoutID = setTimeout(() => {
                if (this.previewContainer) {
                    this.previewContainer.classList.remove(
                        CLASS_NAVIGATION_VISIBILITY,
                    );
                }
            }, 1500);
        },
        1000,
        true,
    );

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
     * Holds the reference the preview container
     *
     * @return {void}
     */
    containerRef = (container: ?HTMLDivElement) => {
        this.previewContainer = container;
    };

    /**
     * Renders the file preview
     *
     * @inheritdoc
     * @return {Element}
     */
    render() {
        const {
            apiHost,
            isLarge,
            token,
            language,
            messages,
            className,
            contentSidebarProps,
            hasHeader,
            onClose,
            measureRef,
            sharedLink,
            sharedLinkPassword,
            requestInterceptor,
            responseInterceptor,
            fileId,
        }: Props = this.props;

        const {
            file,
            isFileError,
            isReloadNotificationVisible,
        }: State = this.state;
        const { collection }: Props = this.props;
        const fileIndex = this.getFileIndex();
        const hasLeftNavigation =
            collection.length > 1 &&
            fileIndex > 0 &&
            fileIndex < collection.length;
        const hasRightNavigation =
            collection.length > 1 &&
            fileIndex > -1 &&
            fileIndex < collection.length - 1;

        if (!fileId) {
            return null;
        }
        /* eslint-disable jsx-a11y/no-static-element-interactions */
        /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
        return (
            <Internationalize language={language} messages={messages}>
                <div
                    id={this.id}
                    className={`be bcpr ${className}`}
                    ref={measureRef}
                    onKeyDown={this.onKeyDown}
                    tabIndex={0}
                >
                    {hasHeader && (
                        <Header
                            file={file}
                            onClose={onClose}
                            onPrint={this.print}
                            canDownload={this.canDownload()}
                            onDownload={this.download}
                        />
                    )}
                    <div className="bcpr-body">
                        <div
                            className="bcpr-container"
                            onMouseMove={this.onMouseMove}
                            ref={this.containerRef}
                        >
                            {file ? (
                                <Measure bounds onResize={this.onResize}>
                                    {({ measureRef: previewRef }) => (
                                        <div
                                            ref={previewRef}
                                            className="bcpr-content"
                                        />
                                    )}
                                </Measure>
                            ) : (
                                <div className="bcpr-loading-wrapper">
                                    <PreviewLoading
                                        isLoading={!isFileError}
                                        loadingIndicatorProps={{
                                            size: 'large',
                                        }}
                                    />
                                </div>
                            )}
                            {hasLeftNavigation && (
                                <PlainButton
                                    type="button"
                                    className="bcpr-navigate-left"
                                    onClick={this.navigateLeft}
                                >
                                    <IconNavigateLeft />
                                </PlainButton>
                            )}
                            {hasRightNavigation && (
                                <PlainButton
                                    type="button"
                                    className="bcpr-navigate-right"
                                    onClick={this.navigateRight}
                                >
                                    <IconNavigateRight />
                                </PlainButton>
                            )}
                        </div>
                        {file && (
                            <ContentSidebar
                                {...contentSidebarProps}
                                isLarge={isLarge}
                                apiHost={apiHost}
                                token={token}
                                cache={this.api.getCache()}
                                fileId={fileId}
                                getPreview={this.getPreview}
                                getViewer={this.getViewer}
                                sharedLink={sharedLink}
                                sharedLinkPassword={sharedLinkPassword}
                                requestInterceptor={requestInterceptor}
                                responseInterceptor={responseInterceptor}
                            />
                        )}
                    </div>
                    {isReloadNotificationVisible && (
                        <ReloadNotification
                            onClose={this.closeReloadNotification}
                            onClick={this.loadFileFromStage}
                        />
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
export default makeResponsive(ContentPreview);
