/**
 * @flow
 * @file Helper for the open_with_integrations API endpoint
 * @author Box
 */

import Base from './Base';
import {
    HEADER_ACCEPT_LANGUAGE,
    DEFAULT_LOCALE,
    ERROR_CODE_FETCH_INTEGRATIONS,
    BOX_EDIT_INTEGRATION_ID,
    BOX_EDIT_SFC_INTEGRATION_ID,
} from '../constants';

class OpenWith extends Base {
    /**
     * API URL for Open With
     *
     * @param {string} [id] - a box file id
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }

        return `${this.getBaseApiUrl()}/files/${id}/open_with_integrations`;
    }

    /**
     * Gets Open With integration data
     *
     * @param {string} fileId - Box file ID
     * @param {string} locale - locale to receive translated strings from the API
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    getOpenWithIntegrations(
        fileId: string,
        locale: ?string = DEFAULT_LOCALE,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
    ) {
        this.errorCode = ERROR_CODE_FETCH_INTEGRATIONS;
        const params = {
            headers: {
                [HEADER_ACCEPT_LANGUAGE]: locale,
            },
        };

        this.get({
            id: fileId,
            params,
            successCallback: openWithIntegrations => {
                const consolidatedOpenWithIntegrations = this.consolidateBoxEditIntegrations(openWithIntegrations);
                const formattedOpenWithData = this.formatOpenWithData(consolidatedOpenWithIntegrations);
                successCallback(formattedOpenWithData);
            },
            errorCallback,
        });
    }

    /**
     * Removes the Box Edit SFC integration if the higher scoped Box Edit integration is present.
     * Box Edit and SFC Box Edit are considered separate integrations by the API. We only want to show one,
     * even if both are enabled and returned from the API.
     *
     * @param {OpenWithAPI} openWithIntegrations - Open With integration items
     * @return {OpenWithAPI} Open With Integrations with only one Box Edit integration
     */
    consolidateBoxEditIntegrations(openWithIntegrations: OpenWithAPI): OpenWithAPI {
        const { items } = openWithIntegrations;
        let consolidatedItems = [...items];
        const boxEditIntegration = items.some(item => item.app_integration.id === BOX_EDIT_INTEGRATION_ID);

        if (boxEditIntegration) {
            consolidatedItems = items.filter(item => item.app_integration.id !== BOX_EDIT_SFC_INTEGRATION_ID);
        }

        return {
            ...openWithIntegrations,
            items: consolidatedItems,
        };
    }

    /**
     * Formats Open With data conveniently for the client
     *
     * @param {Array<Object>} openWithIntegrations - The modified Open With integration objects
     * @return {Array<Integration>} formatted Open With integrations
     */
    formatOpenWithData(openWithIntegrations: OpenWithAPI): Array<Integration> {
        const { items, default_app_integration: defaultIntegration } = openWithIntegrations;
        const integrations: Array<Integration> = items.map(
            ({
                app_integration,
                disabled_reasons,
                display_name,
                display_description,
                display_order,
                is_disabled,
                should_show_consent_popup,
            }: Object) => {
                const { id, type } = app_integration;

                return {
                    appIntegrationId: id,
                    displayDescription: display_description,
                    disabledReasons: disabled_reasons || [],
                    displayOrder: display_order,
                    isDefault: !!defaultIntegration && id === defaultIntegration.id,
                    isDisabled: is_disabled,
                    displayName: display_name,
                    requiresConsent: should_show_consent_popup,
                    type,
                };
            },
        );

        // Sort integrations by displayOrder
        return integrations.sort(
            (integrationA: Integration, integrationB: Integration) =>
                integrationA.displayOrder - integrationB.displayOrder,
        );
    }
}

export default OpenWith;
