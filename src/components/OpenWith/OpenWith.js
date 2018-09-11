/**
 * @flow
 * @file Open With Component
 * @author Box
 */

import React, { PureComponent } from 'react';
import uniqueid from 'lodash/uniqueId';
import noop from 'lodash/noop';
import API from '../../api';
import Internationalize from '../Internationalize';
import { FormattedMessage } from 'react-intl';
import OpenWithButton from './OpenWithButton';
import messages from '../messages';

import '../base.scss';
import './OpenWith.scss';

import {
    DEFAULT_HOSTNAME_API,
    CLIENT_NAME_OPEN_WITH,
    FIELD_EXTENSION,
} from '../../constants';

type Props = {
    /** File extension */
    extension?: string,
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
    extension: ?string,
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
        extension: '',
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
     * Fetches file extension and Open With data.
     *
     * @return {void}
     */
    fetchOpenWithData() {
        const { fileId, extension, language }: Props = this.props;
        if (extension) {
            this.setState({ extension });
        } else {
            this.api
                .getFileAPI()
                .getFile(fileId, this.fetchExtensionSuccessCallback, noop, {
                    fields: [FIELD_EXTENSION],
                });
        }

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
     * Handles a successful files call to get the file extension.
     *
     * @param {object} extensionData - The files call response with the file extension
     * @return {void}
     */
    fetchExtensionSuccessCallback = ({ extension }: { extension: string }) => {
        this.setState({ extension });
    };

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
     * Click handler when an integration is clicked
     *
     * @private
     * @return {void}
     */
    onIntegrationClick(): void {
        /* no-op */
    }

    /**
     * Gets the tooltip text for the OpenWith button
     *
     * @private
     * @return {?string | ?Element}
     */
    getTooltip(): ?string | ?Element {
        const { fetchError, isLoading, integrations }: State = this.state;
        const displayIntegration = this.getDisplayIntegration();
        if (isLoading) {
            return null;
        }
        if (fetchError) {
            return <FormattedMessage {...messages.errorOpenWithDescription} />;
        }
        if (displayIntegration) {
            return displayIntegration.displayDescription;
        }
        if (Array.isArray(integrations) && integrations.length > 1) {
            return (
                <FormattedMessage {...messages.defaultOpenWithDescription} />
            );
        }

        return <FormattedMessage {...messages.emptyOpenWithDescription} />;
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
        const { fetchError: error, isLoading, extension }: State = this.state;

        const displayIntegration = this.getDisplayIntegration();

        return (
            <Internationalize language={language} messages={intlMessages}>
                <div id={this.id} className="be bcow">
                    {
                        <OpenWithButton
                            isDisabled={
                                (displayIntegration &&
                                    !!displayIntegration.isDisabled) ||
                                !!error
                            }
                            onClick={this.onIntegrationClick}
                            displayIntegration={displayIntegration}
                            extension={extension}
                            isLoading={isLoading}
                            tooltipText={this.getTooltip()}
                        />
                    }
                </div>
            </Internationalize>
        );
    }
}

export default OpenWith;
