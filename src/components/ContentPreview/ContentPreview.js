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
import ContentSidebar from '../ContentSidebar';
import Header from './Header';
import API from '../../api';
import makeResponsive from '../makeResponsive';
import Internationalize from '../Internationalize';
import TokenService from '../../util/TokenService';
import { isValidBoxFile } from '../../util/fields';
import { isInputElement, focus } from '../../util/dom';
import { getTypedFileId } from '../../util/file';
import SidebarUtils from '../ContentSidebar/SidebarUtils';
import {
    DEFAULT_HOSTNAME_API,
    DEFAULT_HOSTNAME_APP,
    DEFAULT_HOSTNAME_STATIC,
    DEFAULT_PREVIEW_VERSION,
    DEFAULT_PREVIEW_LOCALE,
    DEFAULT_PATH_STATIC_PREVIEW,
    CLIENT_NAME_CONTENT_PREVIEW
} from '../../constants';
import '../fonts.scss';
import '../base.scss';
import './ContentPreview.scss';

type Props = {
    fileId: string,
    version: string,
    isLarge: boolean,
    autoFocus: boolean,
    useHotkeys: boolean,
    contentSidebarProps: ContentSidebarProps,
    canDownload?: boolean,
    showDownload?: boolean,
    hasHeader: boolean,
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
    onMetric?: Function,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    previewInstance?: any
};

type State = {
    file?: BoxItem
};

const InvalidIdError = new Error('Invalid id for Preview!');

class ContentPreview extends PureComponent<Props, State> {
    id: string;
    props: Props;
    state: State = {};
    preview: any;
    api: API;
    previewContainer: ?HTMLDivElement;
    mouseMoveTimeoutID: TimeoutID;
    rootElement: HTMLElement;
    onError: ?Function;
    onMetric: ?Function;
    fileError: boolean;

    static defaultProps = {
        className: '',
        apiHost: DEFAULT_HOSTNAME_API,
        appHost: DEFAULT_HOSTNAME_APP,
        staticHost: DEFAULT_HOSTNAME_STATIC,
        staticPath: DEFAULT_PATH_STATIC_PREVIEW,
        language: DEFAULT_PREVIEW_LOCALE,
        version: DEFAULT_PREVIEW_VERSION,
        canDownload: true,
        showDownload: true,
        hasHeader: false,
        autoFocus: false,
        useHotkeys: true,
        onDownload: noop,
        onError: noop,
        onLoad: noop,
        onMetric: noop,
        onNavigate: noop,
        collection: [],
        contentSidebarProps: {}
    };

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
            responseInterceptor
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
            responseInterceptor
        });
    }

    /**
     * Cleanup
     *
     * @return {void}
     */
    componentWillUnmount(): void {
        if (this.preview) {
            this.preview.removeAllListeners();
            this.preview.destroy();
            this.preview = undefined;
        }

        // Don't destroy the cache while unmounting
        this.api.destroy(false);
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
     * If new file ID or token is received, destroy preview and fetch file info for new file.
     *
     * @return {void}
     */
    componentWillReceiveProps(nextProps: Props): void {
        const { fileId, token, isLarge }: Props = this.props;
        const hasTokenChanged = nextProps.token !== token;
        const hasFileIdChanged = nextProps.fileId !== fileId;
        const hasSizeChanged = nextProps.isLarge !== isLarge;

        if (hasTokenChanged || hasFileIdChanged) {
            this.fetchFile(nextProps.fileId);
        } else if (hasSizeChanged) {
            this.forceUpdate();
        }
    }

    /**
     * Once the component mounts, load Preview assets and fetch file info.
     *
     * @return {void}
     */
    componentDidMount(): void {
        const { fileId, previewInstance }: Props = this.props;

        if (previewInstance) {
            this.setPreviewInstance(previewInstance);
        } else {
            this.loadStylesheet();
            this.loadScript();
        }

        this.fetchFile(fileId);
        this.rootElement = ((document.getElementById(this.id): any): HTMLElement);
        this.focusPreview();
    }

    /**
     * After component updates, load Preview if appropriate.
     *
     * @return {void}
     */
    componentDidUpdate(prevProps: Props, prevState: State): void {
        if (this.shouldLoadPreview(prevProps, prevState)) {
            this.loadPreview();
        }
    }

    /**
     * Returns whether or not preview should be loaded.
     *
     * @param {Props} prevProps - Previous props
     * @param {State} prevState - Previous state
     * @return {boolean}
     */
    shouldLoadPreview(prevProps: Props, prevState: State): boolean {
        const { file }: State = this.state;
        const { file: prevFile }: State = prevState;
        let loadPreview = false;

        if (!file) {
            loadPreview = !!this.fileError;
            // Load preview if file version ID has changed
        } else if (file.file_version && prevFile && prevFile.file_version) {
            loadPreview = file.file_version.id !== prevFile.file_version.id;
        } else {
            // Load preview if file object has newly been popuplated in state
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
        const { staticHost, staticPath, language, version }: Props = this.props;
        const path: string = `${staticPath}/${version}/${language}/${asset}`;
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
        const { autoFocus }: Props = this.props;
        if (autoFocus && !isInputElement(document.activeElement)) {
            focus(this.rootElement);
        }
    }

    /**
     * Updates preview cache and prefetches a file
     *
     * @param {BoxItem>} file - file to prefetch
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
        const typedIds: string[] = files.map((file) => getTypedFileId(this.getFileId(file)));
        await TokenService.cacheTokens(typedIds, token);
        files.forEach((file) => {
            const fileId = this.getFileId(file);
            this.fetchFile(fileId, noop, noop);
        });
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
        onLoad(data);
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
        // showDownload is a prop that preview library uses and can be passed by the user
        const { showDownload, canDownload }: Props = this.props;
        const { file }: State = this.state;
        const isFileDownloadable =
            getProp(file, 'permissions.can_download', false) && getProp(file, 'is_download_available', false);
        return isFileDownloadable && !!canDownload && !!showDownload;
    }

    /**
     * Sets a preview instance and adds event listeners.
     *
     * @param {Object} preview - Preview instance
     * @return {void}
     */
    setPreviewInstance = (preview: any): void => {
        this.preview = preview;
        this.addPreviewListeners();
    };

    /**
     * Adds preview event listeners.
     *
     * @return {void}
     */
    addPreviewListeners(): void {
        if (!this.preview || typeof this.preview.addListener !== 'function') {
            return;
        }

        const { onError, onMetric } = this.props;

        this.preview.addListener('load', this.onPreviewLoad);
        this.preview.addListener('preview_error', onError);
        this.preview.addListener('preview_metric', onMetric);
    }

    /**
     * Loads preview in the component using the preview library.
     *
     * @return {void}
     */
    loadPreview = async (): Promise<void> => {
        const { token: tokenOrTokenFunction, collection, ...rest }: Props = this.props;
        const { file }: State = this.state;

        const fileId = file ? this.getFileId(file) : rest.fileId;

        if (!this.isPreviewLibraryLoaded() || !tokenOrTokenFunction) {
            return;
        }

        const typedId: string = getTypedFileId(fileId);
        const token: TokenLiteral = await TokenService.getReadToken(typedId, tokenOrTokenFunction);

        const previewOptions = {
            showDownload: this.canDownload(),
            skipServerUpdate: true,
            header: 'none',
            container: `#${this.id} .bcpr-content`,
            useHotkeys: false
        };

        if (!this.preview) {
            const { Preview } = global.Box;
            this.setPreviewInstance(new Preview());
        }

        if (file) {
            this.preview.updateFileCache([file]);
        }

        this.preview.show(fileId, token, {
            ...previewOptions,
            ...omit(rest, Object.keys(previewOptions))
        });
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
     * Network error callback
     *
     * @param {Error} error error object
     * @return {void}
     */
    errorCallback = (error: Error): void => {
        /* eslint-disable no-console */
        console.error(error);
        /* eslint-enable no-console */
    };

    /**
     * File fetch success callback
     *
     * @param {Object} file - Box file
     * @return {void}
     */
    fetchFileSuccessCallback = (file: BoxItem): void => {
        this.setState({ file });
        this.fileError = false;
    };

    /**
     * File fetch success callback
     *
     * @param {Object} file - Box file
     * @return {void}
     */
    fetchFileErrorCallback = (): void => {
        this.fileError = true;
    };

    /**
     * Fetches a file
     *
     * @param {string} id file id
     * @param {Function|void} [successCallback] - Callback after file is fetched
     * @param {Function|void} [errorCallback] - Callback after error
     * @return {void}
     */
    fetchFile(id: string, successCallback: ?Function, errorCallback: ?Function): void {
        if (!id) {
            throw InvalidIdError;
        }

        this.api
            .getFileAPI()
            .file(
                id,
                successCallback || this.fetchFileSuccessCallback,
                errorCallback || this.fetchFileErrorCallback,
                false,
                SidebarUtils.canHaveSidebar(this.props.contentSidebarProps)
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
        const { file }: State = this.state;
        const { collection }: Props = this.props;
        if (!file || collection.length < 2) {
            return -1;
        }

        const index = collection.indexOf(file);
        if (index < 0) {
            return collection.indexOf(file.id);
        }

        return index;
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

        // Execute navigation callback
        onNavigate(fileId);

        // Hide current preview immediately - we don't want to wait until the next file info returns
        this.preview.hide();

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
     * Mouse move handler thati s throttled and show
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
            if (this.previewContainer && (!isPreviewing || viewer.allowNavigationArrows())) {
                this.previewContainer.classList.add(CLASS_NAVIGATION_VISIBILITY);
            }

            this.mouseMoveTimeoutID = setTimeout(() => {
                if (this.previewContainer) {
                    this.previewContainer.classList.remove(CLASS_NAVIGATION_VISIBILITY);
                }
            }, 1500);
        },
        1000,
        true
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
            responseInterceptor
        }: Props = this.props;

        const { file }: State = this.state;
        const { collection }: Props = this.props;
        const fileIndex = this.getFileIndex();
        const hasLeftNavigation = collection.length > 1 && fileIndex > 0 && fileIndex < collection.length;
        const hasRightNavigation = collection.length > 1 && fileIndex > -1 && fileIndex < collection.length - 1;
        const isValidFile = isValidBoxFile(file, true, true);
        const isSidebarVisible = isValidFile && SidebarUtils.shouldRenderSidebar(contentSidebarProps, file);

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
                    <div className='bcpr-body'>
                        <div className='bcpr-container' onMouseMove={this.onMouseMove} ref={this.containerRef}>
                            <Measure bounds onResize={this.onResize}>
                                {({ measureRef: previewRef }) => <div ref={previewRef} className='bcpr-content' />}
                            </Measure>
                            {hasLeftNavigation && (
                                <PlainButton type='button' className='bcpr-navigate-left' onClick={this.navigateLeft}>
                                    <IconNavigateLeft />
                                </PlainButton>
                            )}
                            {hasRightNavigation && (
                                <PlainButton type='button' className='bcpr-navigate-right' onClick={this.navigateRight}>
                                    <IconNavigateRight />
                                </PlainButton>
                            )}
                        </div>
                        {isSidebarVisible && (
                            <ContentSidebar
                                {...contentSidebarProps}
                                isLarge={isLarge}
                                apiHost={apiHost}
                                token={token}
                                cache={this.api.getCache()}
                                fileId={this.getFileId(file)}
                                getPreview={this.getPreview}
                                getViewer={this.getViewer}
                                sharedLink={sharedLink}
                                sharedLinkPassword={sharedLinkPassword}
                                requestInterceptor={requestInterceptor}
                                responseInterceptor={responseInterceptor}
                            />
                        )}
                    </div>
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
