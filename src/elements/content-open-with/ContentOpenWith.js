/**
 * @flow
 * @file Open With Component
 * @author Box
 */

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import uniqueid from 'lodash/uniqueId';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import Internationalize from '../common/Internationalize';
import messages from '../common/messages';
import { withErrorBoundary } from '../common/error-boundary';
import API from '../../api';
import IntegrationPortalContainer from './IntegrationPortalContainer';
import OpenWithDropdownMenu from './OpenWithDropdownMenu';
import BoxToolsInstallMessage from './BoxToolsInstallMessage';
import OpenWithButton from './OpenWithButton';
import OpenWithFallbackButton from './OpenWithFallbackButton';
import ExecuteForm from './ExecuteForm';
import '../common/base.scss';
import './ContentOpenWith.scss';
import {
    BOX_EDIT_INTEGRATION_ID,
    BOX_EDIT_SFC_INTEGRATION_ID,
    CLIENT_NAME_OPEN_WITH,
    CLIENT_VERSION,
    DEFAULT_HOSTNAME_API,
    ERROR_CODE_EXECUTE_INTEGRATION,
    HTTP_GET,
    HTTP_POST,
    ORIGIN_OPEN_WITH,
    TYPE_FILE,
    TYPE_FOLDER,
} from '../../constants';
import type { Alignment } from '../common/flowTypes';
import type { ExecuteAPI, Integration } from '../../common/types/integrations';
import type { StringMap, Token, BoxItem } from '../../common/types/core';

const UNSUPPORTED_INVOCATION_METHOD_TYPE = 'Integration invocation using this HTTP method type is not supported';
const BLACKLISTED_ERROR_MESSAGE_KEY = 'boxToolsBlacklistedError';
const BOX_TOOLS_INSTALL_ERROR_MESSAGE_KEY = 'boxToolsInstallErrorMessage';
const GENERIC_EXECUTE_MESSAGE_KEY = 'executeIntegrationOpenWithErrorHeader';
const AUTH_CODE = 'auth_code';

type ExternalProps = {
    show?: boolean,
};

type Props = {
    /** Box API url. */
    apiHost: string,
    /** Class name applied to base component. */
    boxToolsInstallUrl?: string,
    /** Application client name. */
    boxToolsName?: string,
    /** Custom name for Box Tools to display to users */
    className: string,
    /** Custom URL to direct users to install Box Tools */
    clientName: string,
    /** Determines positioning of menu dropdown */
    dropdownAlignment: Alignment,
    /** Box File ID. */
    fileId: string,
    /** Language to use for translations. */
    language?: string,
    /** Messages to be translated. */
    messages?: StringMap,
    /** Callback that executes when an integration attempts to open the given file */
    onError: Function,
    /** Callback that executes when an integration invocation fails. The two most common cases being API failures or blocking of a new window */
    onExecute: Function,
    /** Axios request interceptor that runs before a network request. */
    requestInterceptor?: Function,
    /** Axios response interceptor that runs before a network response is returned. */
    responseInterceptor?: Function,
    /** Access token. */
    token: Token,
};

type State = {
    executePostData: ?Object,
    fetchError: ?Error,
    integrations: ?Array<Integration>,
    isDropdownOpen: boolean,
    isLoading: boolean,
    shouldRenderErrorIntegrationPortal: boolean,
    shouldRenderLoadingIntegrationPortal: boolean,
};

class ContentOpenWith extends PureComponent<Props, State> {
    api: API;

    id: string;

    props: Props;

    state: State;

    window: any;

    integrationWindow: ?any;

    static defaultProps = {
        apiHost: DEFAULT_HOSTNAME_API,
        className: '',
        clientName: CLIENT_NAME_OPEN_WITH,
        onExecute: noop,
        onError: noop,
    };

    initialState: State = {
        isDropdownOpen: false,
        integrations: null,
        isLoading: true,
        fetchError: null,
        executePostData: null,
        shouldRenderErrorIntegrationPortal: false,
        shouldRenderLoadingIntegrationPortal: false,
    };

    /**
     * [constructor]
     *
     * @private
     * @return {ContentOpenWith}
     */
    constructor(props: Props) {
        super(props);

        const { token, apiHost, clientName, language, requestInterceptor, responseInterceptor } = props;
        this.id = uniqueid('bcow_');
        this.api = new API({
            apiHost,
            clientName,
            language,
            requestInterceptor,
            responseInterceptor,
            token,
            version: CLIENT_VERSION,
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
            this.setState({ ...this.initialState });
            this.fetchOpenWithData();
        }
    }

    /**
     * Checks if a given integration is a Box Edit integration.
     *
     * @param {string} [integrationId] - The integration ID
     * @return {boolean}
     */
    isBoxEditIntegration(integrationId: ?string): boolean {
        return integrationId === BOX_EDIT_INTEGRATION_ID || this.isBoxEditSFCIntegration(integrationId);
    }

    /**
     * Checks if a given integration is a Box Edit integration.
     *
     * @param {string} [integrationId] - The integration ID
     * @return {boolean}
     */
    isBoxEditSFCIntegration(integrationId: ?string): boolean {
        return integrationId === BOX_EDIT_SFC_INTEGRATION_ID;
    }

    /**
     * Fetches Open With data.
     *
     * @return {void}
     */
    fetchOpenWithData(): void {
        const { fileId }: Props = this.props;
        this.api
            .getOpenWithAPI(false)
            .getOpenWithIntegrations(fileId, this.fetchOpenWithSuccessHandler, this.fetchErrorHandler);
    }

    /**
     * Fetch app integrations info needed to render.
     *
     * @param {OpenWithIntegrations} integrations - The available Open With integrations
     * @return {void}
     */
    fetchOpenWithSuccessHandler = async (integrations: Array<Integration>): Promise<any> => {
        const { boxToolsName, boxToolsInstallUrl } = this.props;
        const boxEditIntegration = integrations.find(({ appIntegrationId }) =>
            this.isBoxEditIntegration(appIntegrationId),
        );

        if (boxEditIntegration && !boxEditIntegration.isDisabled) {
            try {
                const { extension } = await this.getIntegrationFileExtension();
                boxEditIntegration.extension = extension;
                // If Box Edit is present and enabled, we need to set its ability to locally open the given file
                // No-op if these checks are successful
                await this.isBoxEditAvailable();
                await this.canOpenExtensionWithBoxEdit(boxEditIntegration);
            } catch (error) {
                const errorMessageObject = messages[error.message] || messages[GENERIC_EXECUTE_MESSAGE_KEY];
                let formattedErrorMessage = <FormattedMessage {...errorMessageObject} />;
                if (error.message === BOX_TOOLS_INSTALL_ERROR_MESSAGE_KEY) {
                    formattedErrorMessage = (
                        <BoxToolsInstallMessage boxToolsInstallUrl={boxToolsInstallUrl} boxToolsName={boxToolsName} />
                    );
                }

                boxEditIntegration.disabledReasons.push(formattedErrorMessage);
                boxEditIntegration.isDisabled = true;
            }
        }

        this.setState({ integrations, isLoading: false });
    };

    /**
     * Fetches the file extension of the current file.
     *
     * @return {Promise}
     */
    getIntegrationFileExtension = (): Promise<BoxItem> => {
        const { fileId }: Props = this.props;
        return new Promise((resolve, reject) => {
            this.api
                .getFileAPI()
                .getFileExtension(fileId, resolve, () => reject(new Error(GENERIC_EXECUTE_MESSAGE_KEY)));
        });
    };

    /**
     * Uses Box Edit to check if Box Tools is installed and reachable
     *
     * @return {Promise}
     */
    isBoxEditAvailable = (): Promise<any> => {
        return this.api
            .getBoxEditAPI()
            .checkBoxEditAvailability()
            .catch(() => {
                throw new Error(BOX_TOOLS_INSTALL_ERROR_MESSAGE_KEY);
            });
    };

    /**
     * Uses Box Edit to check if Box Tools can open a given file type
     *
     * @param {String} extension - A file extension
     * @return {Promise}
     */
    canOpenExtensionWithBoxEdit = ({ extension = '' }: Integration): Promise<any> => {
        return this.api
            .getBoxEditAPI()
            .getAppForExtension(extension)
            .catch(() => {
                throw new Error(BLACKLISTED_ERROR_MESSAGE_KEY);
            });
    };

    /**
     * Handles a fetch error for the open_with_integrations and app_integrations endpoints
     *
     * @param {Error} error - An axios fetch error
     * @return {void}
     */
    fetchErrorHandler = (error: any, code: string): void => {
        this.props.onError(error, code, { error });
        this.setState({ fetchError: error, isLoading: false });
    };

    /**
     * Click handler when an integration is clicked
     *
     * @private
     * @param {string} appIntegrationId - An app integration ID
     * @param {string} displayName - The integration's display name
     * @return {void}
     */
    onIntegrationClick = ({ appIntegrationId, displayName }: Integration): void => {
        const { fileId }: Props = this.props;
        const isBoxEditIntegration = this.isBoxEditIntegration(appIntegrationId);
        this.api
            .getAppIntegrationsAPI(false)
            .execute(
                appIntegrationId,
                fileId,
                this.executeIntegrationSuccessHandler.bind(this, appIntegrationId),
                isBoxEditIntegration ? this.executeBoxEditErrorHandler : this.executeIntegrationErrorHandler,
            );

        if (isBoxEditIntegration) {
            // No window management is required when using Box Edit.
            return;
        }

        // These window features will open the new window directly on top of the current window at the same
        const windowFeatures = `left=${window.screenX},top=${window.screenY},height=${window.outerHeight},width=${window.innerWidth},toolbar=0`;

        // window.open() is immediately invoked to avoid popup-blockers
        // The name is included to be the target of a form if the integration is a POST integration.
        // A uniqueid is used to force the browser to open a new tab every time, while still allowing
        // a form to reference a given tab.
        this.integrationWindow = this.window.open('', `${uniqueid(appIntegrationId)}`, windowFeatures);
        this.integrationWindow.document.title = displayName;
        this.integrationWindow.onunload = this.cleanupIntegrationWindow;

        this.setState({
            shouldRenderLoadingIntegrationPortal: true,
            shouldRenderErrorIntegrationPortal: false,
        });
    };

    /**
     * cleans up the portal UI when a tab is closed so that we can remount the component later.
     *
     * @private
     * @return {void}
     */
    cleanupIntegrationWindow = () => {
        this.setState({
            shouldRenderLoadingIntegrationPortal: false,
            shouldRenderErrorIntegrationPortal: false,
        });
    };

    /**
     * Opens the integration in a new tab based on the API data
     *
     * @private
     * @param {string} integrationId - The integration that was executed
     * @param {ExecuteAPI} executeData - API response on how to open an executed integration

     * @return {void}
     */
    executeIntegrationSuccessHandler = (integrationId: string, executeData: ExecuteAPI): void => {
        if (this.isBoxEditIntegration(integrationId)) {
            this.executeBoxEditSuccessHandler(integrationId, executeData);
        } else {
            this.executeOnlineIntegrationSuccessHandler(executeData);
        }
        this.onExecute(integrationId);
    };

    /**
     * Opens the file via a Partner Integration
     *
     * @private
     * @param {ExecuteAPI} executeData - API response on how to open an executed integration

     * @return {void}
     */
    executeOnlineIntegrationSuccessHandler = (executeData: ExecuteAPI): void => {
        const { method, url } = executeData;
        switch (method) {
            case HTTP_POST:
                this.setState({ executePostData: executeData });
                break;
            case HTTP_GET:
                if (!this.integrationWindow) {
                    return;
                }

                // Prevents abuse of window.opener
                // see here for more details: https://mathiasbynens.github.io/rel-noopener/
                this.integrationWindow.location = url;
                this.integrationWindow.opener = null;
                break;
            default:
                this.executeIntegrationErrorHandler(
                    Error(UNSUPPORTED_INVOCATION_METHOD_TYPE),
                    ERROR_CODE_EXECUTE_INTEGRATION,
                );
        }

        this.integrationWindow = null;
    };

    /**
     * Opens the file via Box Edit
     *
     * @private
     * @param {string} url - Integration execution URL

     * @return {void}
     */
    executeBoxEditSuccessHandler = (integrationId: string, { url }: ExecuteAPI): void => {
        const { fileId, token, onError } = this.props;
        const queryParams = queryString.parse(url);
        const authCode = queryParams[AUTH_CODE];
        const isFileScoped = this.isBoxEditSFCIntegration(integrationId);

        this.api
            .getBoxEditAPI()
            .openFile(fileId, {
                data: {
                    auth_code: authCode,
                    token,
                    token_scope: isFileScoped ? TYPE_FILE : TYPE_FOLDER,
                },
            })
            .catch(error => {
                onError(error, ERROR_CODE_EXECUTE_INTEGRATION, { error });
            });
    };

    /**
     * Clears state after a form has been submitted
     *
     * @private
     * @return {void}
     */
    onExecuteFormSubmit = (): void => {
        this.setState({ executePostData: null });
    };

    /**
     * Calls the onExecute prop
     *
     * @private
     * @param {string} integrationID - The integration that was executed
     * @return {void}
     */
    onExecute(integrationID: string) {
        this.props.onExecute(integrationID);
        this.setState({
            shouldRenderLoadingIntegrationPortal: false,
        });
    }

    /**
     * Handles execution related errors
     *
     * @private
     * @param {Error} error - Error object
     * @return {void}
     */
    executeIntegrationErrorHandler = (error: any, code: string): void => {
        this.props.onError(error, code, { error });
        // eslint-disable-next-line no-console
        console.error(error);
        this.setState({
            shouldRenderLoadingIntegrationPortal: false,
            shouldRenderErrorIntegrationPortal: true,
        });
    };

    /**
     * Handles Box Edit execution related errors
     *
     * @private
     * @param {Error} error - Error object
     * @return {void}
     */
    executeBoxEditErrorHandler = (error: any): void => {
        this.props.onError(error);
        // eslint-disable-next-line no-console
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
        return Array.isArray(integrations) && integrations.length === 1 ? integrations[0] : null;
    }

    /**
     * Render the Open With element
     *
     * @private
     * @inheritdoc
     * @return {Element}
     */
    render() {
        const { language, messages: intlMessages, dropdownAlignment }: Props = this.props;
        const {
            fetchError,
            isLoading,
            integrations,
            executePostData,
            shouldRenderLoadingIntegrationPortal,
            shouldRenderErrorIntegrationPortal,
        }: State = this.state;

        const className = classNames('be bcow', this.props.className);
        const displayIntegration = this.getDisplayIntegration();
        const numIntegrations = integrations ? integrations.length : 0;

        return (
            <Internationalize language={language} messages={intlMessages}>
                <div className={className} data-testid="bcow-content" id={this.id}>
                    {numIntegrations <= 1 ? (
                        <OpenWithButton
                            displayIntegration={displayIntegration}
                            error={fetchError}
                            isLoading={isLoading}
                            onClick={this.onIntegrationClick}
                        />
                    ) : (
                        <OpenWithDropdownMenu
                            dropdownAlignment={dropdownAlignment}
                            integrations={((integrations: any): Array<Integration>)}
                            onClick={this.onIntegrationClick}
                        />
                    )}
                    {(shouldRenderLoadingIntegrationPortal || shouldRenderErrorIntegrationPortal) && (
                        <IntegrationPortalContainer
                            hasError={shouldRenderErrorIntegrationPortal}
                            integrationWindow={this.integrationWindow}
                        />
                    )}
                    {executePostData && (
                        <ExecuteForm
                            executePostData={executePostData}
                            id={this.id}
                            onSubmit={this.onExecuteFormSubmit}
                            windowName={this.integrationWindow && this.integrationWindow.name}
                        />
                    )}
                </div>
            </Internationalize>
        );
    }
}

export type ContentOpenWithProps = Props & ExternalProps;
export { ContentOpenWith as ContentOpenWithComponent };
export default withErrorBoundary(ORIGIN_OPEN_WITH, OpenWithFallbackButton)(ContentOpenWith);
