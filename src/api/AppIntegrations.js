/**
 * @flow
 * @file Helper for the app_integrations API endpoint
 * @author Box
 */

import Base from './Base';

class AppIntegrations extends Base {
    /**
     * API URL for Open With
     *
     * @param {string} [id] - a box integration app ID
     * @return {string} base url for app integrations
     */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing app integration id!');
        }

        return `${this.getBaseApiUrl()}/app_integrations/${id}`;
    }

    /**
     * API endpoint to execute an integration, given an ID
     *
     * @param {string} integrationID - An app integration ID
     * @param {string} fileID - A file ID
     * @return {string} base url for files
     */
    execute(integrationId?: string, fileId?: string, successCallback: Function, errorCallback: Function): void {
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
                    type: 'file'
                }
            }
        };

        this.post({
            id: fileId,
            url: executeURL,
            data: body,
            successCallback,
            errorCallback
        });
    }
}

export default AppIntegrations;
