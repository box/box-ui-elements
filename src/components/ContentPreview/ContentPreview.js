/**
 * @flow
 * @file Content Preview Component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import React, { PureComponent } from 'react';
import uniqueid from 'lodash/uniqueId';
import throttle from 'lodash/throttle';
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
import File from '../../api/File';
import Cache from '../../util/Cache';
import makeResponsive from '../makeResponsive';
import Internationalize from '../Internationalize';
import TokenService from '../../util/TokenService';
import { isValidBoxFile } from '../../util/fields';
import { isInputElement, focus } from '../../util/dom';
import {
    DEFAULT_HOSTNAME_API,
    DEFAULT_HOSTNAME_APP,
    DEFAULT_HOSTNAME_STATIC,
    DEFAULT_PREVIEW_VERSION,
    DEFAULT_PREVIEW_LOCALE,
    DEFAULT_PATH_STATIC_PREVIEW,
    CLIENT_NAME_CONTENT_PREVIEW
} from '../../constants';
import type { Token, TokenLiteral, BoxItem, StringMap } from '../../flowTypes';
import '../fonts.scss';
import '../base.scss';
import './ContentPreview.scss';

type Props = {
    fileId: string,
    version: string,
    isSmall: boolean,
    autoFocus: boolean,
    useHotkeys: boolean,
    showSidebar?: boolean,
    hasSidebar: boolean,
    hasCustomBranding?: boolean,
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
    onClose?: Function,
    language: string,
    messages?: StringMap,
    cache?: Cache,
    collection: Array<string | BoxItem>,
    logoUrl?: string,
    sharedLink?: string,
    sharedLinkPassword?: string,
    onError?: Function,
    onInteraction: Function,
    onMetric?: Function,
    requestInterceptor?: Function,
    responseInterceptor?: Function
};

type State = {
    file?: BoxItem,
    showSidebar: boolean
};

const InvalidIdError = new Error('Invalid id for Preview!');

class ContentPreview extends PureComponent<Props, State> {
    id: string;
    props: Props;
    state: State;
    preview: any;
    api: API;
    previewContainer: ?HTMLDivElement;
    mouseMoveTimeoutID: TimeoutID;
    rootElement: HTMLElement;
    onError: ?Function;
    onMetric: ?Function;

    static defaultProps = {
        className: '',
        apiHost: DEFAULT_HOSTNAME_API,
        appHost: DEFAULT_HOSTNAME_APP,
        staticHost: DEFAULT_HOSTNAME_STATIC,
        staticPath: DEFAULT_PATH_STATIC_PREVIEW,
        language: DEFAULT_PREVIEW_LOCALE,
        version: DEFAULT_PREVIEW_VERSION,
        hasSidebar: false,
        hasCustomBranding: false,
        canDownload: true,
        showDownload: true,
        hasHeader: false,
        autoFocus: false,
        useHotkeys: true,
        onError: noop,
        onInteraction: noop,
        onLoad: noop,
        onMetric: noop,
        onNavigate: noop,
        collection: []
    };

    /**
     * [constructor]
     *
     * @private
     * @return {ContentPreview}
     */
    constructor(props: Props) {
        super(props);
        const {
            hasSidebar,
            cache,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            isSmall,
            requestInterceptor,
            responseInterceptor
        } = props;

        this.state = { showSidebar: hasSidebar && !isSmall };
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
     * @private
     * @return {void}
     */
    componentWillUnmount(): void {
        this.destroyPreview();
    }

    /**
     * Called after receiving new props
     *
     * @private
     * @return {void}
     */
    componentWillReceiveProps(nextProps: Props): void {
        const { fileId, token, isSmall, hasSidebar }: Props = this.props;

        const hasTokenChanged = nextProps.token !== token;
        const hasFileIdChanged = nextProps.fileId !== fileId;
        const hasSizeChanged = nextProps.isSmall !== isSmall;

        if (hasTokenChanged || hasFileIdChanged) {
            this.destroyPreview();
            this.setState({
                file: undefined
            });
            this.fetchFile(nextProps.fileId);
        }

        if (hasSizeChanged) {
            this.setState({
                showSidebar: hasSidebar && !nextProps.isSmall
            });
        }
    }

    /**
     * Called after shell mounts.
     * Once the component mounts fetch the file.
     *
     * @private
     * @return {void}
     */
    componentDidMount(): void {
        const { fileId }: Props = this.props;
        this.loadStylesheet();
        this.loadScript();
        this.fetchFile(fileId);
        this.rootElement = ((document.getElementById(this.id): any): HTMLElement);
        this.focusPreview();
    }

    /**
     * Called after shell re-mounts
     *
     * @private
     * @return {void}
     */
    componentDidUpdate(): void {
        this.loadPreview();
    }

    /**
     * Returns preview asset urls
     *
     * @private
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
     * @private
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
            previewScript.addEventListener('load', this.loadPreview);
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
     * Calls destroy of preview
     *
     * @return {void}
     */
    destroyPreview() {
        if (this.preview) {
            this.preview.removeAllListeners();
            this.preview.destroy();
            this.preview = undefined;
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
        const typedIds: string[] = files.map((file) => File.getTypedFileId(this.getFileId(file)));
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
    onPreviewLoad = (data: Object) => {
        const { onLoad, collection }: Props = this.props;
        const currentIndex = this.getFileIndex();
        const filesToPrefetch = collection.slice(currentIndex + 1, currentIndex + 5);
        onLoad(data);
        this.focusPreview();
        if (this.preview && filesToPrefetch.length > 1) {
            this.prefetch(filesToPrefetch);
        }
    };

    canDownload() {
        // showDownload is a prop that preview library uses and can be passed by the user
        const { showDownload, canDownload }: Props = this.props;
        const { file }: State = this.state;
        const isFileDownloadable =
            getProp(file, 'permissions.can_download', false) && getProp(file, 'is_download_available', false);
        return isFileDownloadable && canDownload && showDownload;
    }

    /**
     * Loads the preview
     *
     * @return {void}
     */
    loadPreview = async (): Promise<void> => {
        const { token: tokenOrTokenFunction, onError, onMetric, collection, ...rest }: Props = this.props;
        const { file }: State = this.state;

        if (!this.isPreviewLibraryLoaded() || !file || !tokenOrTokenFunction || this.preview) {
            return;
        }

        const { Preview } = global.Box;
        const typedId: string = File.getTypedFileId(this.getFileId(file));
        const token: TokenLiteral = await TokenService.getReadToken(typedId, tokenOrTokenFunction);

        const previewOptions = {
            showDownload: this.canDownload(),
            skipServerUpdate: true,
            header: 'none',
            container: `#${this.id} .bcpr-content`,
            useHotkeys: false
        };

        this.preview = new Preview();
        this.preview.updateFileCache([file]);
        this.preview.addListener('load', this.onPreviewLoad);
        this.preview.addListener('preview_error', onError);
        this.preview.addListener('preview_metric', onMetric);
        this.preview.show(file.id, token, {
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
     * @private
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
     * @private
     * @param {Object} file - Box file
     * @return {void}
     */
    fetchFileSuccessCallback = (file: BoxItem): void => {
        this.setState({ file });
    };

    /**
     * Fetches a file
     *
     * @private
     * @param {string} id file id
     * @param {Function|void} [successCallback] - Callback after file is fetched
     * @param {Function|void} [errorCallback] - Callback after error
     * @return {void}
     */
    fetchFile(id: string, successCallback: ?Function, errorCallback: ?Function): void {
        if (!id) {
            throw InvalidIdError;
        }
        const { hasSidebar }: Props = this.props;
        this.api
            .getFileAPI()
            .file(
                id,
                successCallback || this.fetchFileSuccessCallback,
                errorCallback || this.errorCallback,
                false,
                hasSidebar
            );
    }

    /**
     * Returns the viewer instance being used by preview.
     * This will let child components access the viewers.
     *
     * @private
     * @return {Preview} current instance of preview
     */
    getPreviewer = (): any => {
        const { file }: State = this.state;
        if (!this.preview || !file) {
            return null;
        }
        const viewer = this.preview.getCurrentViewer();
        const previewingFile = this.preview.getCurrentFile();
        if (!previewingFile || !viewer || previewingFile.id !== file.id) {
            return null;
        }
        return viewer;
    };

    /**
     * Handles showing or hiding of the sidebar.
     * Only used when showSidebar isnt passed in as prop.
     *
     * @private
     * @return {void}
     */
    toggleSidebar = (show: ?boolean): void => {
        const { hasSidebar }: Props = this.props;
        this.setState((prevState) => ({
            showSidebar: typeof show === 'boolean' ? hasSidebar && show : hasSidebar && !prevState.showSidebar
        }));
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
        onNavigate(fileId);
        this.destroyPreview();
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
        if (this.preview) {
            this.preview.download();
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
            const viewer = this.getPreviewer();
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
     * @private
     * @return {void}
     */
    onKeyDown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
        const { useHotkeys }: Props = this.props;
        if (!useHotkeys) {
            return;
        }

        let consumed = false;
        const key = decode(event);
        const viewer = this.getPreviewer();

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
     * @private
     * @inheritdoc
     * @return {Element}
     */
    render() {
        const {
            isSmall,
            token,
            language,
            messages,
            className,
            showSidebar,
            hasSidebar,
            hasCustomBranding,
            hasHeader,
            onClose,
            measureRef,
            sharedLink,
            sharedLinkPassword,
            onInteraction,
            requestInterceptor,
            responseInterceptor
        }: Props = this.props;

        const { file, showSidebar: showSidebarState }: State = this.state;
        const { collection }: Props = this.props;

        const fileIndex = this.getFileIndex();
        const hasLeftNavigation = collection.length > 1 && fileIndex > 0 && fileIndex < collection.length;
        const hasRightNavigation = collection.length > 1 && fileIndex > -1 && fileIndex < collection.length - 1;
        const isValidFile = isValidBoxFile(file, true, true);

        let isSidebarVisible = isValidFile && hasSidebar && showSidebarState;
        let hasSidebarButton = hasSidebar;
        let onSidebarToggle = this.toggleSidebar;

        if (typeof showSidebar === 'boolean') {
            // The parent component passed in the showSidebar property.
            // Sidebar should be controlled by the parent and not by local state.
            isSidebarVisible = isValidFile && hasSidebar && showSidebar;
            hasSidebarButton = false;
            onSidebarToggle = null;
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
                            hasSidebarButton={hasSidebarButton}
                            isSidebarVisible={isSidebarVisible}
                            onClose={onClose}
                            onSidebarToggle={onSidebarToggle}
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
                                isSmall={isSmall}
                                hasProperties
                                hasSkills
                                cache={this.api.getCache()}
                                token={token}
                                fileId={this.getFileId(file)}
                                getPreviewer={this.getPreviewer}
                                sharedLink={sharedLink}
                                sharedLinkPassword={sharedLinkPassword}
                                onInteraction={onInteraction}
                                requestInterceptor={requestInterceptor}
                                responseInterceptor={responseInterceptor}
                                hasCustomBranding={hasCustomBranding}
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

export { ContentPreview as ContentPreviewComponent };
export default makeResponsive(ContentPreview);
