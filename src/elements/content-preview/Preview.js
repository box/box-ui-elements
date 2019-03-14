/**
 * @flow
 * @file Preview Component
 * @author Box
 */

import React from 'react';
import Measure from 'react-measure';
import noop from 'lodash/noop';
import uniqueid from 'lodash/uniqueId';
import PreviewLoading from './PreviewLoading';
import TokenService from '../../utils/TokenService';
import { getTypedFileId } from '../../utils/file';
import { DEFAULT_HOSTNAME_STATIC, DEFAULT_PREVIEW_VERSION, DEFAULT_PATH_STATIC_PREVIEW } from '../../constants';

type Props = {
    autoFocus: boolean,
    file?: BoxItem,
    fileError?: Object,
    fileOptions?: Object,
    fileVersionId?: ?string,
    id: string,
    language: string,
    onError: Function,
    onLoad: Function,
    onMetric: Function,
    onThumbnailsClose: Function,
    onThumbnailsOpen: Function,
    previewLibraryVersion: string,
    showAnnotations: boolean,
    showDownload: boolean,
    showThumbnails: boolean,
    staticHost: string,
    staticPath: string,
    token: Token,
};

class Preview extends React.Component<Props> {
    content: ?HTMLDivElement;

    id: string;

    props: Props;

    preview: any;

    static defaultProps = {
        autoFocus: false,
        onError: noop,
        onLoad: noop,
        onMetric: noop,
        onThumbnailsClose: noop,
        onThumbnailsOpen: noop,
        previewLibraryVersion: DEFAULT_PREVIEW_VERSION,
        showAnnotations: false,
        showDownload: false,
        showThumbnails: false,
        staticHost: DEFAULT_HOSTNAME_STATIC,
        staticPath: DEFAULT_PATH_STATIC_PREVIEW,
    };

    /**
     * [constructor]
     *
     * @return {Preview}
     */
    constructor(props: Props) {
        super(props);

        this.id = uniqueid('bcpr_');
    }

    /**
     * Cleanup
     */
    componentWillUnmount(): void {
        this.destroyPreview();
    }

    /**
     * Once the component mounts, load Preview assets and fetch file info.
     */
    componentDidMount(): void {
        this.loadStylesheet();
        this.loadScript();
        this.loadPreview();
    }

    /**
     * After component updates, load Preview if appropriate.
     */
    componentDidUpdate(prevProps: Props): void {
        const { file, fileVersionId, token } = this.props;
        const hasFileChanged = prevProps.file !== file;
        const hasFileVersionChanged = prevProps.fileVersionId !== fileVersionId;
        const hasTokenChanged = prevProps.token !== token;

        if (hasFileChanged) {
            this.destroyPreview();
            this.loadPreview();
            this.showPreview();
        }

        if (hasFileVersionChanged) {
            this.showPreview();
        }

        if (hasTokenChanged) {
            this.setPreviewToken(token);
        }
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
     * Cleans up the preview instance
     */
    destroyPreview() {
        if (this.preview) {
            this.preview.destroy();
            this.preview.removeAllListeners();
            this.preview = undefined;
        }
    }

    /**
     * Loads preview in the component using the preview library.
     */
    loadPreview = () => {
        if (!this.isPreviewLibraryLoaded()) {
            return;
        }

        const { onError, onLoad, onMetric, onThumbnailsClose, onThumbnailsOpen }: Props = this.props;
        const { Preview: PreviewSDK } = global.Box;

        this.preview = new PreviewSDK();
        this.preview.addListener('load', onLoad);
        this.preview.addListener('preview_error', onError);
        this.preview.addListener('preview_metric', onMetric);
        this.preview.addListener('thumbnailsClose', onThumbnailsClose);
        this.preview.addListener('thumbnailsOpen', onThumbnailsOpen);
    };

    /**
     * Loads external script by appending a <script> element
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
     * Loads external css by appending a <link> element
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
     * Sets the access token used by preview library
     *
     * @param {string} token - The new token
     */
    setPreviewToken(token: ?string) {
        if (this.preview && token) {
            this.preview.updateToken(token, false);
        }
    }

    /**
     * Show a file in Preview
     */
    showPreview = () => {
        const {
            file,
            fileOptions,
            fileVersionId,
            id,
            showThumbnails,
            token: tokenOrTokenFunction,
            ...rest
        }: Props = this.props;

        if (!this.isPreviewLibraryLoaded() || !file || !tokenOrTokenFunction) {
            return;
        }

        const { id: fileId } = file;
        const typedId = getTypedFileId(fileId);

        TokenService.getReadToken(typedId, tokenOrTokenFunction).then(token => {
            const fileOpts = { ...fileOptions };

            if (fileVersionId) {
                fileOpts[fileId] = fileOpts[fileId] || {};
                fileOpts[fileId].fileVersionId = fileVersionId;
            }

            const previewOptions = {
                container: `#${id} .bcpr-content`,
                enableThumbnailsSidebar: showThumbnails,
                fileOptions: fileOpts,
                header: 'none',
                headerElement: `#${id} .bcpr-header`,
                skipServerUpdate: true,
                useHotkeys: false,
            };

            this.preview.updateFileCache([file]);
            this.preview.show(file.id, token, {
                ...rest,
                ...previewOptions,
            });
        });
    };

    /**
     * Returns the viewer instance being used by preview.
     * This will let child components access the viewers.
     *
     * @return {any} current instance of the preview viewer
     */
    getViewer = (): any => {
        const viewer = this.preview ? this.preview.getCurrentViewer() : null;
        return viewer && viewer.isLoaded() && !viewer.isDestroyed() ? viewer : null;
    };

    /**
     * Downloads file.
     */
    download = () => {
        if (this.preview) {
            this.preview.download();
        }
    };

    /**
     * Prints file.
     */
    print = () => {
        if (this.preview) {
            this.preview.print();
        }
    };

    /**
     * Tells the preview to resize
     */
    onResize = (): void => {
        if (this.preview && this.preview.getCurrentViewer()) {
            this.preview.resize();
        }
    };

    /**
     * Holds the reference to the preview content element
     *
     * @param {HTMLDivElement} content - The preview content element
     */
    contentRef = (content: ?HTMLDivElement) => {
        this.content = content;
    };

    /**
     * Renders the file preview
     *
     * @inheritdoc
     * @return {Element}
     */
    render() {
        const { file, fileError }: Props = this.props;

        if (!file) {
            return (
                <div className="bcpr-loading-wrapper">
                    <PreviewLoading isLoading={!fileError} loadingIndicatorProps={{ size: 'large' }} />
                </div>
            );
        }

        return (
            <Measure bounds innerRef={this.contentRef} onResize={this.onResize}>
                {({ measureRef: previewRef }) => <div ref={previewRef} className="bcpr-content" />}
            </Measure>
        );
    }
}

export default Preview;
