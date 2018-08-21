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
    fileId?: string,
    clientName: string,
    apiHost: string,
    token: Token,
    className: string,
    language?: string,
    messages?: StringMap,
    requestInterceptor?: Function,
    responseInterceptor?: Function
};

class OpenWith extends PureComponent<Props> {
    id: string;
    props: Props;
    api: API;

    static defaultProps = {
        className: '',
        clientName: CLIENT_NAME_OPEN_WITH,
        apiHost: DEFAULT_HOSTNAME_API
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
     * Fetches the list of potential integrations on load
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentDidMount() {
        /* no-op */
    }

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

        // Placeholder
        return (
            <Internationalize language={language} messages={intlMessages}>
                <button> Open With </button>
            </Internationalize>
        );
    }
}

export default OpenWith;
