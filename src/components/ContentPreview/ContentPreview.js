/**
 * @flow
 * @file Content Preview Component
 * @author Box
 */

import React, { PureComponent } from 'react';
import uniqueid from 'lodash.uniqueid';
import noop from 'lodash.noop';
import Measure from 'react-measure';
import Sidebar from './Sidebar';
import Header from './Header';
import API from '../../api';
import Cache from '../../util/Cache';
import {
    DEFAULT_HOSTNAME_API,
    DEFAULT_HOSTNAME_STATIC,
    DEFAULT_PREVIEW_VERSION,
    DEFAULT_PREVIEW_LOCALE,
    DEFAULT_PREVIEW_STATIC_PATH,
    CLIENT_NAME_CONTENT_PREVIEW
} from '../../constants';
import type { Token, BoxItem, Cards } from '../../flowTypes';
import '../fonts.scss';
import '../base.scss';
import './ContentPreview.scss';

type DefaultProps = {|
    apiHost: string,
    staticHost: string,
    staticPath: string,
    locale: string,
    version: string,
    hasSidebar: boolean,
    hasHeader: boolean,
    className: string,
    onLoad: Function,
    onNavigate: Function
|};

type Props = {
    file?: BoxItem,
    fileId?: string,
    locale: string,
    version: string,
    hasSidebar: boolean,
    hasHeader: boolean,
    apiHost: string,
    staticHost: string,
    staticPath: string,
    token: Token,
    className: string,
    getLocalizedMessage: Function,
    onLoad: Function,
    onNavigate: Function,
    onClose?: Function,
    skipServerUpdate?: boolean,
    cache?: Cache,
    collection?: string[],
    logoUrl?: string,
    sharedLink?: string,
    sharedLinkPassword?: string
};

type State = {
    file?: BoxItem,
    metadata?: Cards,
    isSidebarVisible: boolean
};

class ContentPreview extends PureComponent<DefaultProps, Props, State> {
    id: string;
    props: Props;
    state: State;
    preview: any;
    api: API;

    static defaultProps: DefaultProps = {
        className: '',
        apiHost: DEFAULT_HOSTNAME_API,
        staticHost: DEFAULT_HOSTNAME_STATIC,
        staticPath: DEFAULT_PREVIEW_STATIC_PATH,
        locale: DEFAULT_PREVIEW_LOCALE,
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
        const { file, cache, token, hasSidebar, sharedLink, sharedLinkPassword, apiHost } = props;

        this.state = { file, isSidebarVisible: hasSidebar };
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
        const { fileId, token }: Props = this.props;
        const { file }: State = this.state;

        const hasTokenChanged = nextProps.token !== token;
        const hasFileIdChanged = nextProps.fileId !== fileId;
        const hasFileChanged = nextProps.file !== file;

        if (hasTokenChanged || hasFileChanged || hasFileIdChanged) {
            if (hasFileChanged) {
                this.setState({ file: nextProps.file });
            } else {
                this.setState({ file: undefined });
            }
            if (this.preview) {
                this.preview.destroy();
                this.preview = undefined;
            }
        }
    }

    /**
     * Called after shell mounts
     *
     * @private
     * @return {void}
     */
    componentDidMount(): void {
        this.loadAssetsAndPreview();
    }

    /**
     * Called after shell updates
     *
     * @private
     * @return {void}
     */
    componentDidUpdate(): void {
        this.loadAssetsAndPreview();
    }

    /**
     * Loads assets and preview
     *
     * @private
     * @return {void}
     */
    loadAssetsAndPreview(): void {
        if (!this.isPreviewLibraryLoaded()) {
            this.loadStylesheet();
            this.loadScript();
        }
        this.loadPreview();
    }

    /**
     * Returns preview asset urls
     *
     * @private
     * @return {string} base url
     */
    getBasePath(asset: string): string {
        const { staticHost, staticPath, locale, version }: Props = this.props;
        const path: string = `${staticPath}/${version}/${locale}/${asset}`;
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

        if (!head || head.querySelector(`script[src="${url}"]`)) {
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
        if (!this.isPreviewLibraryLoaded() || this.preview) {
            return;
        }

        const { Preview } = global.Box;
        const { fileId, token, onLoad, onNavigate, ...rest }: Props = this.props;
        const { file }: State = this.state;
        const fileOrFileId = file ? Object.assign({}, file) : fileId;

        if ((!file && !fileId) || !token) {
            throw new Error('Missing file or fileId and/or token for Preview!');
        }

        this.preview = new Preview();
        this.preview.addListener('navigate', (id: string) => {
            this.updateHeaderAndSidebar(id);
            onNavigate(id);
        });
        this.preview.addListener('load', onLoad);
        this.preview.show(fileOrFileId, token, {
            container: `#${this.id} .bcpr-content`,
            header: 'none',
            ...rest
        });
        this.updateHeaderAndSidebar(file ? file.id : fileId);
    };

    /**
     * Updates header and sidebar
     *
     * @private
     * @param {String} id - file id
     * @return {void}
     */
    updateHeaderAndSidebar(id?: string): void {
        if (!id) {
            throw new Error('Invalid id for Preview!');
        }
        this.fetchFile(id);
        this.fetchMetadata(id);
    }

    /**
     * Handles showing or hiding of hasSidebar
     *
     * @private
     * @return {void}
     */
    toggleSidebar = (): void => {
        this.setState((prevState) => ({
            isSidebarVisible: !prevState.isSidebarVisible
        }));
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
     * Metadata fetch success callback
     *
     * @private
     * @param {Object} metadata - file metadata
     * @return {void}
     */
    fetchMetadataSuccessCallback = (metadata: Cards): void => {
        this.setState({ metadata });
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
        const { hasSidebar }: Props = this.props;
        this.api.getFileAPI().file(id, this.fetchFileSuccessCallback, this.errorCallback, forceFetch, hasSidebar);
    }

    /**
     * Fetches file metadata
     *
     * @private
     * @param {string} id file id
     * @param {Boolean|void} [forceFetch] To void cache
     * @return {void}
     */
    fetchMetadata(id: string, forceFetch: boolean = false): void {
        this.api.getMetadataAPI().metadata(id, this.fetchMetadataSuccessCallback, this.errorCallback, forceFetch);
    }

    /**
     * Renders the file preview
     *
     * @private
     * @inheritdoc
     * @return {Element}
     */
    render() {
        const { className, hasSidebar, hasHeader, onClose, getLocalizedMessage }: Props = this.props;
        const { file, metadata, isSidebarVisible }: State = this.state;
        return (
            <div id={this.id} className={`buik bcpr ${className}`}>
                {hasHeader &&
                    <Header
                        file={file}
                        isSidebarVisible={isSidebarVisible}
                        hasSidebar={hasSidebar}
                        toggleSidebar={this.toggleSidebar}
                        onClose={onClose}
                        getLocalizedMessage={getLocalizedMessage}
                    />}
                <div className='bcpr-body'>
                    <Measure bounds onResize={this.onResize}>
                        {({ measureRef }) => <div ref={measureRef} className='bcpr-content' />}
                    </Measure>
                    {isSidebarVisible &&
                        <Sidebar file={file} metadata={metadata} getLocalizedMessage={getLocalizedMessage} />}
                </div>
            </div>
        );
    }
}

export default ContentPreview;
