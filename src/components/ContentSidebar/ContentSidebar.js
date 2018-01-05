/**
 * @flow
 * @file Content Preview Component
 * @author Box
 */

import React, { PureComponent } from 'react';
import uniqueid from 'lodash/uniqueId';
import noop from 'lodash/noop';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import DetailsSidebar from './DetailsSidebar';
import API from '../../api';
import Cache from '../../util/Cache';
import Internationalize from '../Internationalize';
import { DEFAULT_HOSTNAME_API, CLIENT_NAME_CONTENT_SIDEBAR } from '../../constants';
import type { Token, BoxItem, StringMap } from '../../flowTypes';
import '../fonts.scss';
import '../base.scss';
import './ContentSidebar.scss';

type Props = {
    fileId?: string,
    clientName: string,
    apiHost: string,
    token: Token,
    getPreviewer: Function,
    hasTitle: boolean,
    hasSkills: boolean,
    hasDescription: boolean,
    hasProperties: boolean,
    hasMetadata: boolean,
    hasAccessStats: boolean,
    hasClassification: boolean,
    hasActivityFeed: boolean,
    language?: string,
    messages?: StringMap,
    cache?: Cache,
    sharedLink?: string,
    sharedLinkPassword?: string,
    responseFilter?: Function
};

type State = {
    file?: BoxItem
};

class ContentSidebar extends PureComponent<Props, State> {
    id: string;
    props: Props;
    state: State;
    rootElement: HTMLElement;
    api: API;

    static defaultProps = {
        clientName: CLIENT_NAME_CONTENT_SIDEBAR,
        apiHost: DEFAULT_HOSTNAME_API,
        getPreviewer: noop,
        hasTitle: false,
        hasSkills: false,
        hasDescription: false,
        hasProperties: false,
        hasMetadata: false,
        hasAccessStats: false,
        hasClassification: false,
        hasActivityFeed: false
    };

    /**
     * [constructor]
     *
     * @private
     * @return {ContentSidebar}
     */
    constructor(props: Props) {
        super(props);
        const { cache, token, sharedLink, sharedLinkPassword, apiHost, clientName } = props;

        this.state = {};
        this.id = uniqueid('bcs_');
        this.api = new API({
            cache,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            clientName
        });
    }

    /**
     * Destroys api instances
     *
     * @private
     * @return {void}
     */
    clearCache(): void {
        this.api.destroy(true);
    }

    /**
     * Cleanup
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentWillUnmount() {
        this.clearCache();
    }

    /**
     * Fetches the root folder on load
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentDidMount() {
        const { fileId }: Props = this.props;
        this.rootElement = ((document.getElementById(this.id): any): HTMLElement);
        if (fileId) {
            this.fetchFile(fileId);
        }
    }

    /**
     * Called when sidebar gets new properties
     *
     * @private
     * @return {void}
     */
    componentWillReceiveProps(nextProps: Props): void {
        const { fileId, token }: Props = this.props;
        const { fileId: newFileId }: Props = nextProps;

        const hasTokenChanged = nextProps.token !== token;
        const hasFileIdChanged = newFileId !== fileId;

        if (hasTokenChanged || hasFileIdChanged) {
            if (newFileId) {
                this.fetchFile(newFileId);
            } else if (fileId) {
                this.fetchFile(fileId);
            }
        }
    }

    /**
     * Determines if we should bother fetching or rendering
     *
     * @private
     * @param {string} id file id
     * @param {Boolean|void} [forceFetch] To void cache
     * @return {Boolean} true if we should fetch or render
     */
    shouldFetchOrRender(): boolean {
        const {
            hasSkills,
            hasDescription,
            hasProperties,
            hasMetadata,
            hasAccessStats,
            hasClassification
        }: Props = this.props;

        return hasSkills || hasDescription || hasProperties || hasMetadata || hasAccessStats || hasClassification;
    }

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
        if (this.shouldFetchOrRender()) {
            this.api.getFileAPI().file(id, this.fetchFileSuccessCallback, this.errorCallback, forceFetch, true);
        }
    }

    /**
     * Renders the file preview
     *
     * @private
     * @inheritdoc
     * @return {Element}
     */
    render() {
        const {
            language,
            messages,
            getPreviewer,
            hasTitle,
            hasSkills,
            hasDescription,
            hasProperties,
            hasMetadata,
            hasAccessStats,
            hasClassification,
            sharedLink
        }: Props = this.props;
        const { file }: State = this.state;

        if (!this.shouldFetchOrRender()) {
            return null;
        }

        return (
            <Internationalize language={language} messages={messages}>
                <div className='be bcs'>
                    {file ? (
                        <DetailsSidebar
                            file={file}
                            getPreviewer={getPreviewer}
                            ensurePrivacy={!!sharedLink}
                            hasTitle={hasTitle}
                            hasSkills={hasSkills}
                            hasDescription={hasDescription}
                            hasProperties={hasProperties}
                            hasMetadata={hasMetadata}
                            hasAccessStats={hasAccessStats}
                            hasClassification={hasClassification}
                        />
                    ) : (
                        <div className='bcs-loading'>
                            <LoadingIndicator />
                        </div>
                    )}
                </div>
            </Internationalize>
        );
    }
}

export default ContentSidebar;
