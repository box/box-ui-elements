/**
 * @flow
 * @file Helper for the open_with_integrations API endpoint
 * @author Box
 */
import Base from './Base';
import AppIntegrationsAPI from './AppIntegrations';

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
     * @return {Array<OpenWithIntegrationItem>} formatted open with integrations
     */
    getOpenWithIntegrations(fileId: string, successCallback: Function, errorCallback: Function) {
        this.get({
            id: fileId,
            successCallback: (openWithIntegrations) => {
                const formattedOpenWithIntegrations = this.formatOpenWithData(openWithIntegrations);
                this.fetchAppIntegrations(formattedOpenWithIntegrations, successCallback, errorCallback);
            },
            errorCallback
        });
    }

    /**
     * Formats data conveniently for the client
     *
     * @param {OpenWithIntegrations} openWithIntegrations - The available Open With integrations
     * @return {Array<OpenWithIntegrationItem>} formatted open with integrations
     */
    formatOpenWithData(openWithIntegrations: OpenWithIntegrations): Array<any> {
        // Eventually, a default integration will be returned outside of the items array,
        // which should be inserted into this list of integrations.

        const { items } = openWithIntegrations;
        // Fix the API response by converting the app integration ID to a string
        const integrations = items.map((item) => ({
            ...item,
            app_integration: {
                id: item.app_integration.id.toString(),
                type: 'app_integration'
            }
        }));

        // Sort integrations by display_order
        return integrations.sort(
            (integrationA: OpenWithIntegrationItem, integrationB: OpenWithIntegrationItem) =>
                integrationA.display_order - integrationB.display_order
        );
    }

    /**
     * Fetch app integrations info needed to render.
     *
     * @param {Array<OpenWithIntegrationItem>} openWithIntegrations - The available Open With integrations
     * @return {void}
     */
    fetchAppIntegrations = async (
        openWithIntegrations: Array<OpenWithIntegrationItem>,
        successCallback: Function,
        errorCallback: Function
    ) => {
        this.appIntegrationsAPI = new AppIntegrationsAPI(this.options);

        const appIntegrationPromises = openWithIntegrations.map((integrationItem: OpenWithIntegrationItem) => {
            const { app_integration: { id } } = integrationItem;
            return this.appIntegrationsAPI.getAppIntegrationPromise(id);
        });

        try {
            const appIntegrations: Array<AppIntegrationItem> = await Promise.all(appIntegrationPromises);
            const completedOpenWithIntegrations = this.completeOpenWithIntegrationData(
                openWithIntegrations,
                appIntegrations
            );

            successCallback(completedOpenWithIntegrations);
        } catch (error) {
            errorCallback(error);
        }
    };

    /**
     * Completes the app integration mini objects in Open With data with the required fields to render.
     *
     * @param {Array<OpenWithIntegrationItem>} openWithintegrations - The available Open With integrations
     * @param {Array<AppIntegrationItem>} appIntegrations - An array of full app integration items
     * @return {Array<OpenWithIntegrationItem>} array of completed Open w=With items
     */
    completeOpenWithIntegrationData = (
        openWithintegrations: Array<OpenWithIntegrationItem>,
        appIntegrations: Array<AppIntegrationItem>
    ): any =>
        openWithintegrations.map((item) => ({
            ...item,
            app_integration: appIntegrations.find(
                (appIntegration) => appIntegration.id === item.app_integration.id.toString()
            )
        }));
}

export default OpenWith;
