/**
 * @flow
 * @file Content Preview Component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import React, { PureComponent } from 'react';
import uniqueid from 'lodash/uniqueId';
import noop from 'lodash/noop';
import cloneDeep from 'lodash/cloneDeep';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import Sidebar from './Sidebar';
import API from '../../api';
import Cache from '../../util/Cache';
import Internationalize from '../Internationalize';
import { DEFAULT_HOSTNAME_API, CLIENT_NAME_CONTENT_SIDEBAR } from '../../constants';
import type { Token, BoxItem, StringMap } from '../../flowTypes';
import '../fonts.scss';
import '../base.scss';
import '../modal.scss';
import './ContentSidebar.scss';

type Props = {
    fileId?: string,
    isSmall?: boolean,
    clientName: string,
    apiHost: string,
    token: Token,
    className: string,
    getPreviewer: Function,
    hasTitle: boolean,
    hasSkills: boolean,
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
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    onInteraction: Function
};

type State = {
    file?: BoxItem
};

class ContentSidebar extends PureComponent<Props, State> {
    id: string;
    props: Props;
    state: State;
    rootElement: HTMLElement;
    appElement: HTMLElement;
    api: API;

    static defaultProps = {
        className: '',
        isSmall: false,
        clientName: CLIENT_NAME_CONTENT_SIDEBAR,
        apiHost: DEFAULT_HOSTNAME_API,
        getPreviewer: noop,
        hasTitle: false,
        hasSkills: false,
        hasProperties: false,
        hasMetadata: false,
        hasAccessStats: false,
        hasClassification: false,
        hasActivityFeed: false,
        onInteraction: noop
    };

    /**
     * [constructor]
     *
     * @private
     * @return {ContentSidebar}
     */
    constructor(props: Props) {
        super(props);
        const {
            cache,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            clientName,
            requestInterceptor,
            responseInterceptor
        } = props;

        this.state = {};
        this.id = uniqueid('bcs_');
        this.api = new API({
            cache,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            clientName,
            requestInterceptor,
            responseInterceptor
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
        this.appElement = ((this.rootElement.firstElementChild: any): HTMLElement);

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
            hasProperties,
            hasMetadata,
            hasAccessStats,
            hasClassification,
            hasActivityFeed
        }: Props = this.props;

        return hasSkills || hasProperties || hasMetadata || hasAccessStats || hasClassification || hasActivityFeed;
    }

    /**
     * Function to log interactions
     *
     * @private
     * @param {Object} data - some data
     * @return {void}
     */
    onInteraction = (data: any): void => {
        const { onInteraction }: Props = this.props;
        const { file }: State = this.state;
        onInteraction(Object.assign({}, { file: cloneDeep(file) }, data));
    };

    /**
     * Function to update file description
     *
     * @private
     * @param {string} value - new file description
     * @return {void}
     */
    onDescriptionChange = (value: string): void => {
        const { file } = this.state;
        if (!file) {
            return;
        }

        const { description, id } = file;
        if (value === description || !description || !id) {
            return;
        }

        this.api.getFileAPI().setFileDescription(id, value, this.setFileDescriptionCallback, this.errorCallback);
    };

    /**
     * File update description callback
     *
     * @private
     * @param {string} value - updated file description
     * @return {void}
     */
    setFileDescriptionCallback = (value: string): void => {
        this.setState({
            file: {
                ...this.state.file,
                description: value
            }
        });
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
            hasProperties,
            hasMetadata,
            hasAccessStats,
            hasClassification,
            hasActivityFeed,
            className
        }: Props = this.props;
        const { file }: State = this.state;

        if (!this.shouldFetchOrRender()) {
            return null;
        }

        return (
            <Internationalize language={language} messages={messages}>
                <div id={this.id} className={`be bcs ${className}`}>
                    <div className='be-app-element'>
                        {file ? (
                            <Sidebar
                                file={file}
                                getPreviewer={getPreviewer}
                                hasTitle={hasTitle}
                                hasSkills={hasSkills}
                                hasProperties={hasProperties}
                                hasMetadata={hasMetadata}
                                hasAccessStats={hasAccessStats}
                                hasClassification={hasClassification}
                                hasActivityFeed={hasActivityFeed}
                                appElement={this.appElement}
                                rootElement={this.rootElement}
                                onInteraction={this.onInteraction}
                                onDescriptionChange={file.can_rename && this.onDescriptionChange}
                                descriptionTextareaProps={{ maxlength: '255' }}
                            />
                        ) : (
                            <div className='bcs-loading'>
                                <LoadingIndicator />
                            </div>
                        )}
                    </div>
                </div>
            </Internationalize>
        );
    }
}

export default ContentSidebar;
