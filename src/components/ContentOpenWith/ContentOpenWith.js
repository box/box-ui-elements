/**
 * @flow
 * @file Open With Component
 * @author Box
 */

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import uniqueid from 'lodash/uniqueId';
import noop from 'lodash/noop';
import API from '../../api';
import Internationalize from '../Internationalize';
import OpenWithDropdownMenu from './OpenWithDropdownMenu';
import OpenWithButton from './OpenWithButton';
import ExecuteForm from './ExecuteForm';

import '../base.scss';
import './ContentOpenWith.scss';

import {
    CLIENT_NAME_OPEN_WITH,
    DEFAULT_HOSTNAME_API,
    HTTP_GET,
    HTTP_POST,
} from '../../constants';

const WINDOW_OPEN_BLOCKED_ERROR = 'Unable to open integration in new window';
const UNSUPPORTED_INVOCATION_METHOD_TYPE =
    'Integration invocation using this HTTP method type is not supported';

type ExternalProps = {
    show?: boolean,
};

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
    /** Callback that executes when an integration attempts to open the given file */
    onExecute: Function,
    /** Callback that executes when an integration invocation fails. The two most common cases being API failures or blocking of a new window */
    onError: Function,
};

type State = {
    isDropdownOpen: boolean,
    integrations: ?Array<Integration>,
    isLoading: boolean,
    fetchError: ?Error,
    executePostData: ?Object,
};

class ContentOpenWith extends PureComponent<Props, State> {
    api: API;
    id: string;
    props: Props;
    state: State;
    executeId: ?string;
    window: any;
    windowRef: ?any;

    static defaultProps = {
        className: '',
        clientName: CLIENT_NAME_OPEN_WITH,
        apiHost: DEFAULT_HOSTNAME_API,
        onExecute: noop,
        onError: noop,
    };

    initialState: State = {
        isDropdownOpen: false,
        integrations: null,
        isLoading: true,
        fetchError: null,
        executePostData: null,
    };

    /**
     * [constructor]
     *
     * @private
     * @return {ContentOpenWith}
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
        const { fileId }: Props = this.props;
        if (!fileId) {
            return;
        }

        this.window = window;

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

        if (!currentFileId) {
            return;
        }

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
    fetchOpenWithData(): void {
        const { fileId, language }: Props = this.props;
        this.api
            .getOpenWithAPI(false)
            .getOpenWithIntegrations(
                fileId,
                language,
                this.fetchOpenWithSuccessHandler,
                this.fetchErrorHandler,
            );
    }

    /**
     * Fetch app integrations info needed to render.
     *
     * @param {OpenWithIntegrations} integrations - The available Open With integrations
     * @return {void}
     */
    fetchOpenWithSuccessHandler = (integrations: Array<Integration>): void => {
        this.setState({ integrations, isLoading: false });
    };

    /**
     * Handles a fetch error for the open_with_integrations and app_integrations endpoints
     *
     * @param {Error} error - An axios fetch error
     * @return {void}
     */
    fetchErrorHandler = (error: any): void => {
        this.props.onError(error);
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
    onIntegrationClick = (appIntegrationId: string): void => {
        const { fileId }: Props = this.props;
        // window.open() is immediately invoked to avoid popup-blockers
        // The name is included to be the target of a form if the integration is a POST integration
        this.windowRef = this.window.open(
            '',
            `OpenWithIntegration-${appIntegrationId}`,
        );
        this.api
            .getAppIntegrationsAPI(false)
            .execute(
                appIntegrationId,
                fileId,
                this.executeIntegrationSuccessHandler,
                this.executeIntegrationErrorHandler,
            );

        this.executeId = appIntegrationId;
    };

    /**
     * Opens the integration in a new tab based on the API data
     *
     * @private
     * @param {ExecuteAPI} executeData - API response on how to open an executed integration

     * @return {void}
     */
    executeIntegrationSuccessHandler = (executeData: ExecuteAPI): void => {
        const { method, url } = executeData;
        switch (method) {
            case HTTP_POST:
                this.setState({ executePostData: executeData });
                break;
            case HTTP_GET:
                if (!this.windowRef) {
                    this.executeIntegrationErrorHandler(
                        Error(WINDOW_OPEN_BLOCKED_ERROR),
                    );
                    return;
                }

                // Prevents abuse of window.opener
                // see here for more details: https://mathiasbynens.github.io/rel-noopener/
                this.windowRef.location = url;
                this.windowRef.opener = null;
                this.onExecute();

                break;
            default:
                this.executeIntegrationErrorHandler(
                    Error(UNSUPPORTED_INVOCATION_METHOD_TYPE),
                );
        }

        this.windowRef = null;
    };

    /**
     * Clears state after a form has been submitted
     *
     * @private
     * @return {void}
     */
    onExecuteFormSubmit = (): void => {
        this.onExecute();
        this.setState({ executePostData: null });
    };

    /**
     * Calls the onExecute prop and resets the execute ID
     *
     * @private
     * @return {void}
     */
    onExecute() {
        this.props.onExecute(this.executeId);
        this.executeId = null;
    }

    /**
     * Handles execution related errors
     *
     * @private
     * @param {Error} error - Error object
     * @return {void}
     */
    executeIntegrationErrorHandler = (error: any): void => {
        this.props.onError(error);
        console.error(error);
    };

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
            executePostData,
        }: State = this.state;

        const className = classNames('be bcow', this.props.className);
        const displayIntegration = this.getDisplayIntegration();
        const numIntegrations = integrations ? integrations.length : 0;

        return (
            <Internationalize language={language} messages={intlMessages}>
                <div id={this.id} className={className}>
                    {numIntegrations <= 1 ? (
                        <OpenWithButton
                            error={error}
                            onClick={this.onIntegrationClick}
                            displayIntegration={displayIntegration}
                            isLoading={isLoading}
                        />
                    ) : (
                        <OpenWithDropdownMenu
                            onClick={this.onIntegrationClick}
                            integrations={integrations}
                        />
                    )}
                    {executePostData && (
                        <ExecuteForm
                            onSubmit={this.onExecuteFormSubmit}
                            executePostData={executePostData}
                            windowName={this.windowRef && this.windowRef.name}
                            id={this.id}
                        />
                    )}
                </div>
            </Internationalize>
        );
    }
}

export type ContentOpenWithProps = Props & ExternalProps;
export default ContentOpenWith;
