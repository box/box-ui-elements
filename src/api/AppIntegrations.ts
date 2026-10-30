import Base from './Base';
import { TYPE_FILE, ERROR_CODE_EXECUTE_INTEGRATION } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';

class AppIntegrations extends Base {
    /** API URL for the app integration `integrationId`. Throws when `integrationId` is missing. */
    getUrl(integrationId: string): string {
        if (!integrationId) {
            throw new Error('Missing app integration id!');
        }

        return `${this.getBaseApiUrl()}/app_integrations/${integrationId}`;
    }

    /** Executes the app integration `integrationId` on the file `fileId`. Throws when either id is missing. */
    execute(
        integrationId: string | null | undefined,
        fileId: string | null | undefined,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
    ): void {
        if (!integrationId) {
            throw new Error('Missing integration id!');
        }

        if (!fileId) {
            throw new Error('Missing file id!');
        }

        this.errorCode = ERROR_CODE_EXECUTE_INTEGRATION;
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
