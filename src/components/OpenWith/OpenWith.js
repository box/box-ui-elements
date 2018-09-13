/**
 * @flow
 * @file Open With Component
 * @author Box
 */

import React, { PureComponent } from 'react';
import uniqueid from 'lodash/uniqueId';
import API from '../../api';
import Internationalize from '../Internationalize';
import OpenWithLoadingButton from './OpenWithLoadingButton';
import OpenWithButton from './OpenWithButton';

import '../base.scss';
import './OpenWith.scss';

import { DEFAULT_HOSTNAME_API, CLIENT_NAME_OPEN_WITH } from '../../constants';

type Props = {
    /** Box File ID. */
    fileId: string,
    /** Application client name. */
    clientName: string,
    /** Box API url. */
    apiHost: string,
    /** Access token. */
    token: Token,
    /** Class name applied to base component. */
    className: string,
    /** Language to use for translations. */
    language?: string,
    /** Messages to be translated. */
    messages?: StringMap,
    /** Axios request interceptor that runs before a network request. */
    requestInterceptor?: Function,
    /** Axios response interceptor that runs before a network response is returned. */
    responseInterceptor?: Function,
};

type State = {
    isDropdownOpen: boolean,
    integrations: ?Array<Integration>,
    isLoading: boolean,
    fetchError: ?Error,
};

class OpenWith extends PureComponent<Props, State> {
    api: API;
    id: string;
    props: Props;
    state: State;

    static defaultProps = {
        className: '',
        clientName: CLIENT_NAME_OPEN_WITH,
        apiHost: DEFAULT_HOSTNAME_API,
    };

    initialState: State = {
        isDropdownOpen: false,
        integrations: null,
        isLoading: true,
        fetchError: null,
    };

    /**
     * [constructor]
     *
     * @private
     * @return {OpenWith}
     */
    constructor(props: Props) {
        super(props);

        const {
            token,
            apiHost,
            clientName,
            requestInterceptor,
            responseInterceptor,
        } = props;
        this.id = uniqueid('bcow_');
        this.api = new API({
            token,
            apiHost,
            clientName,
            requestInterceptor,
            responseInterceptor,
        });

        // Clone initial state to allow for state reset on new files
        this.state = { ...this.initialState };
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
     * Cleanup
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentWillUnmount() {
        // Don't destroy the cache while unmounting
        this.api.destroy(false);
    }

    /**
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentDidMount() {
        this.fetchOpenWithData();
    }

    /**
     * After component updates, re-fetch Open With data if appropriate.
     *
     * @return {void}
     */
    componentDidUpdate(prevProps: Props): void {
        const { fileId: currentFileId }: Props = this.props;
        const { fileId: previousFileId }: Props = prevProps;

        if (currentFileId !== previousFileId) {
            this.setState({ isLoading: true });
            this.fetchOpenWithData();
        }
    }

    /**
     * Fetches Open With data.
     *
     * @return {void}
     */
    fetchOpenWithData() {
        const { fileId, language }: Props = this.props;
        this.api
            .getOpenWithAPI(false)
            .getOpenWithIntegrations(
                fileId,
                language,
                this.fetchOpenWithSuccessHandler,
                this.fetchErrorCallback,
            );
    }

    /**
     * Fetch app integrations info needed to render.
     *
     * @param {OpenWithIntegrations} integrations - The available Open With integrations
     * @return {void}
     */
    fetchOpenWithSuccessHandler = (integrations: Array<Integration>) => {
        this.setState({ integrations, isLoading: false });
    };

    /**
     * Handles a fetch error for the open_with_integrations and app_integrations endpoints
     *
     * @param {Error} error - An axios fetch error
     * @return {void}
     */
    fetchErrorCallback = (error: Error) => {
        this.setState({ fetchError: error, isLoading: false });
    };

    /**
     * Called when the Open With button gets new properties
     *
     * @private
     * @return {void}
     */
    componentWillReceiveProps(): void {
        /* no-op */
    }

    /**
     * Click handler when an integration is clicked
     *
     * @private
     * @return {void}
     */
    onIntegrationClick(): void {
        /* no-op */
    }

    /**
     * Gets a display integration, if available, for the Open With button
     *
     * @private
     * @return {?Integration}
     */
    getDisplayIntegration(): ?Integration {
        const { integrations }: State = this.state;
        // We only consider an integration a display integration if is the only integration in our state
        return Array.isArray(integrations) && integrations.length === 1
            ? integrations[0]
            : null;
    }

    /**
     * Render the Open With element
     *
     * @private
     * @inheritdoc
     * @return {Element}
     */
    render() {
        const { language, messages: intlMessages }: Props = this.props;
        const {
            fetchError: error,
            isLoading,
            integrations,
        }: State = this.state;

        const displayIntegration = this.getDisplayIntegration();
        const numIntegrations = integrations ? integrations.length : 0;

        return (
            <Internationalize language={language} messages={intlMessages}>
                <div id={this.id} className="be bcow">
                    {isLoading ? (
                        <OpenWithLoadingButton />
                    ) : (
                        <OpenWithButton
                            error={error}
                            onClick={this.onIntegrationClick}
                            displayIntegration={displayIntegration}
                            numIntegrations={numIntegrations}
                        />
                    )}
                </div>
            </Internationalize>
        );
    }
}

export default OpenWith;
