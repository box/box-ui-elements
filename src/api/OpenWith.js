/**
 * @flow
 * @file Helper for the open_with_integrations API endpoint
 * @author Box
 */

import omit from 'lodash/omit';
import Base from './Base';
import AppIntegrationsAPI from './AppIntegrations';

const DEFAULT_APP_INTEGRATION = 'default_app_integration';

class OpenWith extends Base {
    /**
     * @property {AppIntegrationsAPI}
     */
    appIntegrationsAPI: AppIntegrationsAPI;

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
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    getOpenWithIntegrations(fileId: string, successCallback: Function, errorCallback: Function) {
        this.get({
            id: fileId,
            successCallback: (openWithIntegrations) => {
                this.fetchAppIntegrations(openWithIntegrations, successCallback, errorCallback);
            },
            errorCallback
        });
    }

    /**
     * Fetch app integrations info needed to render.
     *
     * @param {Array<OpenWithIntegrationItem>} openWithIntegrations - The available Open With integrations
     * @return {void}
     */
    fetchAppIntegrations = async (
        openWithIntegrations: OpenWithAPI,
        successCallback: Function,
        errorCallback: Function
    ) => {
        const items = this.addDefaultToOpenWithItems(openWithIntegrations);
        this.appIntegrationsAPI = new AppIntegrationsAPI(this.options);

        const appIntegrationPromises = items.map((integrationItem: OpenWithAPIItem) => {
            const { app_integration: { id } } = integrationItem;
            return this.appIntegrationsAPI.fetchAppIntegrationsPromise(id);
        });

        try {
            const appIntegrations: Array<AppIntegrationAPIItem> = await Promise.all(appIntegrationPromises);
            const completedOpenWithIntegrations = this.completeOpenWithIntegrationData(items, appIntegrations);
            const formattedOpenWithIntegrations = this.formatOpenWithData(completedOpenWithIntegrations);
            successCallback(formattedOpenWithIntegrations);
        } catch (error) {
            errorCallback(error);
        }
    };

    /**
     * Adds an optional default integration to our list of Open With integration items.
     *
     * @param {OpenWithAPI} openWithIntegrations - The available Open With integrations
     * @return {Array<Object>} formatted Open With integrations
     */
    addDefaultToOpenWithItems(openWithIntegrations: OpenWithAPI): Array<Object> {
        const { defaultOpenWithItem } = omit(openWithIntegrations, 'items');
        const { items } = openWithIntegrations;
        if (defaultOpenWithItem) {
            // Replace the default_app_integration with a regular app integration
            // and add the is_default field
            items.push({
                ...omit(defaultOpenWithItem, DEFAULT_APP_INTEGRATION),
                app_integration: defaultOpenWithItem.default_app_integration,
                is_default: true
            });
        }

        return items;
    }

    /**
     * Formats Open With data conveniently for the client
     *
     * @param {Array<Object>} openWithIntegrations - The modified Open With integration objects
     * @return {Array<Integration>} formatted Open With integrations
     */
    formatOpenWithData(openWithIntegrations: Array<Object>): Array<Integration> {
        const integrations: Array<Integration> = openWithIntegrations.map(
            ({
                app_integration,
                disabled_reasons,
                display_order,
                icon,
                is_default,
                is_disabled,
                should_show_consent_popup
            }: Object) => ({
                appIntegrationId: app_integration.id,
                description: app_integration.description,
                disabledReasons: disabled_reasons,
                displayOrder: display_order,
                icon,
                isDefault: !!is_default,
                isDisabled: is_disabled,
                name: app_integration.name,
                shouldShowConsentPopup: should_show_consent_popup,
                type: app_integration.type
            })
        );

        // Sort integrations by displayOrder
        return integrations.sort(
            (integrationA: Integration, integrationB: Integration) =>
                integrationA.displayOrder - integrationB.displayOrder
        );
    }

    /**
     * Completes the app integration mini objects in Open With data with the required fields to render.
     *
     * @param {Array<Object>} openWithIntegrations - The available Open With integrations
     * @param {Array<AppIntegrationItem>} appIntegrations - An array of full app integration items
     * @return {Array<Object>} array of completed Open With items
     */
    completeOpenWithIntegrationData(
        openWithIntegrations: Array<Object>,
        appIntegrations: Array<AppIntegrationAPIItem>
    ): any {
        return openWithIntegrations.map((openWithIntegration) => {
            const matchedAppIntegration = appIntegrations.find(
                (appIntegration) => appIntegration.id === openWithIntegration.app_integration.id.toString()
            );
            return {
                ...openWithIntegration,
                app_integration: matchedAppIntegration
            };
        });
    }
}

export default OpenWith;
