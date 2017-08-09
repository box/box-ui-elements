/**
 * @flow
 * @file Content Preview Component
 * @author Box
 */

import React, { PureComponent } from 'react';
import uniqueid from 'lodash.uniqueid';
import Measure from 'react-measure';
import {
    DEFAULT_HOSTNAME_API,
    DEFAULT_HOSTNAME_STATIC,
    DEFAULT_PREVIEW_VERSION,
    DEFAULT_PREVIEW_LOCALE
} from '../../constants';
import type { Token } from '../../flowTypes';
import '../fonts.scss';
import '../base.scss';

type DefaultProps = {|
    apiHost: string,
    staticHost: string,
    staticPath: string,
    locale: string,
    version: string,
    className: string
|};

type Props = {
    fileId: string,
    locale: string,
    version: string,
    apiHost: string,
    staticHost: string,
    staticPath: string,
    token: Token,
    className: string,
    onLoad?: Function,
    collection?: string[],
    header?: 'none' | 'light' | 'dark',
    logoUrl?: string,
    sharedLink?: string,
    sharedLinkPassword?: string
};

class ContentPreview extends PureComponent<DefaultProps, Props, void> {
    id: string;
    props: Props;
    preview: any;

    static defaultProps: DefaultProps = {
        className: '',
        apiHost: DEFAULT_HOSTNAME_API,
        staticHost: DEFAULT_HOSTNAME_STATIC,
        staticPath: 'platform/preview',
        locale: DEFAULT_PREVIEW_LOCALE,
        version: DEFAULT_PREVIEW_VERSION
    };

    /**
     * [constructor]
     *
     * @private
     * @return {ContentPreview}
     */
    constructor(props: Props) {
        super(props);
        this.id = uniqueid('bcpr_');
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
     * Returns true if component should update
     *
     * @private
     * @return {void}
     */
    shouldComponentUpdate(nextProps: Props): boolean {
        return !this.preview || nextProps.fileId !== this.props.fileId || nextProps.token !== this.props.token;
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
        if (!this.isPreviewLoaded()) {
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
     * Determines if preview is loaded
     *
     * @private
     * @return {boolean} true if preview is loaded
     */
    isPreviewLoaded(): boolean {
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
        if (!this.isPreviewLoaded()) {
            return;
        }

        if (this.preview) {
            this.preview.destroy();
        }

        const { Preview } = global.Box;
        const { fileId, token, onLoad, ...rest }: Props = this.props;

        if (!fileId || !token) {
            return;
        }

        this.preview = new Preview();

        if (onLoad) {
            this.preview.addListener('load', onLoad);
        }

        this.preview.show(fileId, token, {
            container: `#${this.id}`,
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
     * Renders the file preview
     *
     * @private
     * @inheritdoc
     * @return {Element}
     */
    render() {
        const { className } = this.props;
        return (
            <Measure bounds onResize={this.onResize}>
                {({ measureRef }) =>
                    <div id={this.id} ref={measureRef} className={`buik buik-app-element ${className}`} />}
            </Measure>
        );
    }
}

export default ContentPreview;
