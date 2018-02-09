/**
 * @flow
 * @file Content Preview Component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import React, { PureComponent } from 'react';
import uniqueid from 'lodash/uniqueId';
import noop from 'lodash/noop';
import Measure from 'react-measure';
import ContentSidebar from '../ContentSidebar';
import Header from './Header';
import API from '../../api';
import Cache from '../../util/Cache';
import makeResponsive from '../makeResponsive';
import Internationalize from '../Internationalize';
import {
    DEFAULT_HOSTNAME_API,
    DEFAULT_HOSTNAME_APP,
    DEFAULT_HOSTNAME_STATIC,
    DEFAULT_PREVIEW_VERSION,
    DEFAULT_PREVIEW_LOCALE,
    DEFAULT_PATH_STATIC_PREVIEW,
    CLIENT_NAME_CONTENT_PREVIEW
} from '../../constants';
import type { Token, BoxItem, StringMap } from '../../flowTypes';
import '../fonts.scss';
import '../base.scss';
import './ContentPreview.scss';

type Props = {
    fileId: string,
    version: string,
    isSmall: boolean,
    showSidebar?: boolean,
    hasSidebar: boolean,
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
    collection?: string[],
    logoUrl?: string,
    sharedLink?: string,
    sharedLinkPassword?: string
};

type State = {
    file?: BoxItem,
    showSidebar: boolean
};

class ContentPreview extends PureComponent<Props, State> {
    id: string;
    props: Props;
    state: State;
    preview: any;
    api: API;

    static defaultProps = {
        className: '',
        apiHost: DEFAULT_HOSTNAME_API,
        appHost: DEFAULT_HOSTNAME_APP,
        staticHost: DEFAULT_HOSTNAME_STATIC,
        staticPath: DEFAULT_PATH_STATIC_PREVIEW,
        language: DEFAULT_PREVIEW_LOCALE,
        version: DEFAULT_PREVIEW_VERSION,
        hasSidebar: false,
        hasHeader: false,
        onLoad: noop,
        onNavigate: noop
    };

    /**
     * [constructor]
     *
     * @private
     * @return {ContentPreview}
     */
    constructor(props: Props) {
        super(props);
        const { hasSidebar, cache, token, sharedLink, sharedLinkPassword, apiHost, isSmall } = props;

        this.state = { showSidebar: hasSidebar && !isSmall };
        this.id = uniqueid('bcpr_');
        this.api = new API({
            cache,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            clientName: CLIENT_NAME_CONTENT_PREVIEW
        });
    }

    /**
     * Cleanup
     *
     * @private
     * @return {void}
     */
    componentWillUnmount(): void {
        if (this.preview) {
            this.preview.removeAllListeners();
            this.preview.destroy();
        }
        this.preview = undefined;
    }

    /**
     * Called after shell mounts
     *
     * @private
     * @return {void}
     */
    componentWillReceiveProps(nextProps: Props): void {
        const { fileId, token, isSmall, hasSidebar }: Props = this.props;

        const hasTokenChanged = nextProps.token !== token;
        const hasFileIdChanged = nextProps.fileId !== fileId;
        const hasSizeChanged = nextProps.isSmall !== isSmall;

        const newState = {};

        if (hasTokenChanged || hasFileIdChanged) {
            newState.file = undefined;
            if (this.preview) {
                this.preview.destroy();
                this.preview = undefined;
            }
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
     * Loads the preview
     *
     * @return {void}
     */
    loadPreview = (): void => {
        const { Preview } = global.Box;
        const { fileId, token, onLoad, onNavigate, ...rest }: Props = this.props;
        const { file }: State = this.state;

        if (!this.isPreviewLibraryLoaded() || this.preview || !file || !token) {
            return;
        }

        this.preview = new Preview();
        this.preview.addListener('navigate', (id: string) => {
            this.fetchFile(id);
            onNavigate(id);
        });
        this.preview.addListener('load', onLoad);
        this.preview.show(file, token, {
            container: `#${this.id} .bcpr-content`,
            header: 'none',
            skipServerUpdate: true,
            ...rest
        });
    };

    /**
     * Tells the preview to resize
     *
     * @return {void}
     */
    onResize = (): void => {
        if (this.preview) {
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
     * @param {Boolean|void} [forceFetch] To void cache
     * @return {void}
     */
    fetchFile(id: string, forceFetch: boolean = false): void {
        if (!id) {
            throw new Error('Invalid id for Preview!');
        }
        const { hasSidebar }: Props = this.props;
        this.api.getFileAPI().file(id, this.fetchFileSuccessCallback, this.errorCallback, forceFetch, hasSidebar);
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
            hasHeader,
            onClose,
            measureRef,
            sharedLink,
            sharedLinkPassword
        }: Props = this.props;

        const { file, showSidebar: showSidebarState }: State = this.state;

        let isSidebarVisible = !!file && hasSidebar && showSidebarState;
        let hasSidebarButton = hasSidebar;
        let onSidebarToggle = this.toggleSidebar;

        if (typeof showSidebar === 'boolean') {
            // The parent component passed in the showSidebar property.
            // Sidebar should be controlled by the parent and not by local state.
            isSidebarVisible = !!file && hasSidebar && showSidebar;
            hasSidebarButton = false;
            onSidebarToggle = null;
        }

        return (
            <Internationalize language={language} messages={messages}>
                <div id={this.id} className={`be bcpr ${className}`} ref={measureRef}>
                    {hasHeader && (
                        <Header
                            file={file}
                            hasSidebarButton={hasSidebarButton}
                            isSidebarVisible={isSidebarVisible}
                            onClose={onClose}
                            onSidebarToggle={onSidebarToggle}
                        />
                    )}
                    <div className='bcpr-body'>
                        <Measure bounds onResize={this.onResize}>
                            {({ measureRef: previewRef }) => <div ref={previewRef} className='bcpr-content' />}
                        </Measure>
                        {isSidebarVisible && (
                            <ContentSidebar
                                isSmall={isSmall}
                                hasProperties
                                hasSkills
                                cache={this.api.getCache()}
                                token={token}
                                fileId={file ? file.id : null}
                                getPreviewer={this.getPreviewer}
                                sharedLink={sharedLink}
                                sharedLinkPassword={sharedLinkPassword}
                            />
                        )}
                    </div>
                </div>
            </Internationalize>
        );
    }
}

export default makeResponsive(ContentPreview);
