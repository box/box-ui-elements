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

type DefaultProps = {|
    apiHost: string,
    appHost: string,
    staticHost: string,
    staticPath: string,
    language: string,
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
    version: string,
    hasSidebar: boolean,
    hasHeader: boolean,
    apiHost: string,
    appHost: string,
    staticHost: string,
    staticPath: string,
    token: Token,
    className: string,
    onLoad: Function,
    onNavigate: Function,
    onClose?: Function,
    skipServerUpdate?: boolean,
    language: string,
    messages?: StringMap,
    cache?: Cache,
    collection?: string[],
    logoUrl?: string,
    sharedLink?: string,
    sharedLinkPassword?: string
};

type State = {
    file?: BoxItem
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
        const { file, cache, token, sharedLink, sharedLinkPassword, apiHost } = props;

        this.state = { file };
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
        const { file, fileId, token }: Props = this.props;

        const hasTokenChanged = nextProps.token !== token;
        const hasFileIdChanged = nextProps.fileId !== fileId;
        const hasFileChanged = nextProps.file !== file;

        const newState = {};

        if (hasTokenChanged || hasFileChanged || hasFileIdChanged) {
            if (hasFileChanged) {
                newState.file = nextProps.file;
            } else {
                newState.file = undefined;
            }
            if (this.preview) {
                this.preview.destroy();
                this.preview = undefined;
            }
        }

        // Only update the state if there is something to update
        if (Object.keys(newState).length) {
            this.setState(newState);
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
    }

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
     * Renders the file preview
     *
     * @private
     * @inheritdoc
     * @return {Element}
     */
    render() {
        const { language, messages, className, hasSidebar, hasHeader, onClose }: Props = this.props;
        const { file }: State = this.state;
        return (
            <Internationalize language={language} messages={messages}>
                <div id={this.id} className={`buik bcpr ${className}`}>
                    {hasHeader && <Header file={file} showSidebarButton={hasSidebar} onClose={onClose} />}
                    <div className='bcpr-body'>
                        {hasSidebar && <Sidebar file={file} getPreviewer={this.getPreviewer} />}
                        <Measure bounds onResize={this.onResize}>
                            {({ measureRef }) => <div ref={measureRef} className='bcpr-content' />}
                        </Measure>
                    </div>
                </div>
            </Internationalize>
        );
    }
}

export default ContentPreview;
