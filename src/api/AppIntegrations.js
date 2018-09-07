/**
 * @flow
 * @file Helper for the app_integrations API endpoint
 * @author Box
 */

import Base from './Base';
import { TYPE_FILE, APP_INTEGRATION } from '../constants';

// Test data, will be replaced with the API when functioning
const MOCK_INTEGRATIONS = {
    '10897': {
        type: APP_INTEGRATION,
        id: '10897',
        name: 'Edit with G Suite',
        description:
            "This integration allows customers to work seamlessly between Box and G Suite's editor",
    },
    '3282': {
        type: APP_INTEGRATION,
        id: '3282',
        name: 'Sign with Adobe Sign',
        description: 'Send your document for signature to Adobe Sign',
    },
};

class AppIntegrations extends Base {
    /**
     * API URL for Open With
     *
     * @param {string} [integrationId] - a box integration app ID
     * @return {string} base url for app integrations
     */
    getUrl(integrationId: string): string {
        if (!integrationId) {
            throw new Error('Missing app integration id!');
        }

        return `${this.getBaseApiUrl()}/app_integrations/${integrationId}`;
    }

    /**
     * Returns mock API data.
     *
     * @param {string} id - An app integration ID
     * @return {void}
     */
    fetchMockAppIntegration({
        id,
        successCallback,
    }: {
        id: string,
        successCallback: Function,
    }) {
        // Simulate network latency to test loading states
        setTimeout(() => {
            successCallback(MOCK_INTEGRATIONS[id]);
        }, 300);
    }

    /**
     * Creates a promise that resolves with the needed app integration fields.
     *
     * @param {string} id - An app integration ID
     * @return {Promise} a promise that resolves with app integration data
     */
    fetchAppIntegrationsPromise(id: string): Promise<AppIntegrationAPIItem> {
        return new Promise((resolve, reject) => {
            // Using the mock getter until the API is fixed.
            this.fetchMockAppIntegration({
                id,
                successCallback: appIntegration => resolve(appIntegration),
                errorCallback: error => reject(error),
            });
        });
    }

    /**
     * API endpoint to execute an integration, given an ID
     *
     * @param {string} integrationID - An app integration ID
     * @param {string} fileID - A file ID
     * @return {string} base url for files
     */
    execute(
        integrationId: ?string,
        fileId: ?string,
        successCallback: Function,
        errorCallback: Function,
    ): void {
        if (!integrationId) {
            throw new Error('Missing integration id!');
        }

        if (!fileId) {
            throw new Error('Missing file id!');
        }

        const executeURL = `${this.getUrl(integrationId)}/execute`;
        const body = {
            data: {
                item: {
                    id: fileId,
                    type: TYPE_FILE,
                },
            },
        };

        this.post({
            id: fileId,
            url: executeURL,
            data: body,
            successCallback,
            errorCallback,
        });
    }
}

export default AppIntegrations;
