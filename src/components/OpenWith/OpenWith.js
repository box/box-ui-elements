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
    responseInterceptor?: Function,
    /** Temporary prop that allows app integration to be passed in for testing purporses. */
    getAppIntegration?: Function
};

type State = {
    isDropdownOpen: boolean,
    integrationsData: ?OpenWithIntegrations
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
        integrationsData: null
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
        this.api.getOpenWithAPI(false).get({
            id: fileId,
            successCallback: this.fetchAppIntegrations,
            errorCallback: this.fetchErrorCallback
        });
    }

    /**
     * Fetch app intgrations info needed to render.
     *
     * @param {OpenWithIntegrations} openWithintegrations - The available Open With integrations
     * @return {void}
     */
    fetchAppIntegrations = (openWithintegrations: OpenWithIntegrations) => {
        const { items } = openWithintegrations;
        const appIntegrationInfoPromises = [];

        items.forEach((integrationItem: OpenWithIntegrationItem) => {
            const { app_integration: { id } } = integrationItem;
            const promise = this.fetchAppIntegrationPromise(id);
            appIntegrationInfoPromises.push(promise);
        });

        // Update state after we have information for all integrations, which are required to render.
        Promise.all(appIntegrationInfoPromises)
            .then((integrations) => {
                const openWithintegrationsWithIntegrationData = this.completeOpenWithIntegrationData(
                    openWithintegrations,
                    integrations
                );

                this.setState({ integrationsData: openWithintegrationsWithIntegrationData });
            })
            .catch(this.fetchErrorCallback);
    };

    /**
     * Creates a promise that resolves with the needed app integration fields
     *
     * @param {number} id - An app integration ID
     * @return {Promise} a promise that resolves with app integration data
     */
    fetchAppIntegrationPromise = (id: number) => {
        const { getAppIntegration }: Props = this.props;
        return new Promise((resolve, reject) => {
            // Use a passed in getter if provided, replace when no longer needed
            const appIntegrationGetFunction: Function = getAppIntegration || this.api.getAppIntegrationsAPI(false).get;
            appIntegrationGetFunction({
                id,
                successCallback: (appIntegration) => resolve(appIntegration),
                errorCallback: (error) => reject(error)
            });
        });
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
     * Completes the app integration mini objects in Open With data with the required fields to render.
     *
     * @param {OpenWithIntegrations} openWithintegrations - The available Open With integrations
     * @param {Array<AppIntegrationItem>} appIntegrations - An array of full app integration items
     * @return {void}
     */
    completeOpenWithIntegrationData = (
        openWithintegrations: OpenWithIntegrations,
        appIntegrations: Array<AppIntegrationItem>
    ): any =>
        openWithintegrations.items.map((item) => ({
            ...item,
            app_integration: appIntegrations.find(
                (appIntegration) => appIntegration.id === item.app_integration.id.toString()
            )
        }));

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
        const { integrationsData }: State = this.state;

        // Placeholder
        return (
            integrationsData && (
                <Internationalize language={language} messages={intlMessages}>
                    <button> Open With </button>
                </Internationalize>
            )
        );
    }
}

export default OpenWith;
