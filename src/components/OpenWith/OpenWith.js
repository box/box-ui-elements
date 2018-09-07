/**
 * @flow
 * @file Open With Component
 * @author Box
 */

import React, { PureComponent } from 'react';
import uniqueid from 'lodash/uniqueId';
import API from '../../api';
import Internationalize from '../Internationalize';

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
    responseInterceptor?: Function
};

type State = {
    isDropdownOpen: boolean,
    integrations: ?Array<Integration>
};

class OpenWith extends PureComponent<Props, State> {
    api: API;
    id: string;
    props: Props;
    state: State;

    static defaultProps = {
        className: '',
        clientName: CLIENT_NAME_OPEN_WITH,
        apiHost: DEFAULT_HOSTNAME_API
    };

    initialState: State = {
        isDropdownOpen: false,
        integrations: null
    };

    /**
     * [constructor]
     *
     * @private
     * @return {OpenWith}
     */
    constructor(props: Props) {
        super(props);

        const { token, apiHost, clientName, requestInterceptor, responseInterceptor } = props;
        this.id = uniqueid('bcow_');
        this.api = new API({
            token,
            apiHost,
            clientName,
            requestInterceptor,
            responseInterceptor
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
        const { fileId }: Props = this.props;
        this.api
            .getOpenWithAPI(false)
            .getOpenWithIntegrations(fileId, this.fetchOpenWithSuccessHandler, this.fetchErrorCallback);
    }

    /**
     * Fetch app integrations info needed to render.
     *
     * @param {OpenWithIntegrations} openWithIntegrations - The available Open With integrations
     * @return {void}
     */
    fetchOpenWithSuccessHandler = (openWithIntegrations: Array<Integration>) => {
        this.setState({ integrations: openWithIntegrations });
    };

    /**
     * Handles a fetch error for the open_with_integrations and app_integrations endpoints
     *
     * @param {Error} error - An axios fetch error
     * @return {void}
     */
    fetchErrorCallback = (error: Error) => {
        console.error(error); // eslint-disable-line no-console
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
     * Renders the Open With element
     *
     * @private
     * @inheritdoc
     * @return {Element}
     */
    render() {
        const { language, messages: intlMessages }: Props = this.props;
        const { integrations }: State = this.state;
        // Placeholder
        return (
            integrations && (
                <Internationalize language={language} messages={intlMessages}>
                    <button> Open With </button>
                </Internationalize>
            )
        );
    }
}

export default OpenWith;
