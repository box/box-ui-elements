import Base from './Base';
import { ERROR_CODE_FETCH_INTEGRATIONS, BOX_EDIT_INTEGRATION_ID, BOX_EDIT_SFC_INTEGRATION_ID } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';
import type { Integration, OpenWithAPI } from '../common/types/integrations';

class OpenWith extends Base {
    /** API URL for the Open With integrations of the Box file `id`. Throws when `id` is missing. */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }

        return `${this.getBaseApiUrl()}/files/${id}/open_with_integrations`;
    }

    /** Fetches Open With integrations for `fileId` and calls `successCallback` with the formatted, consolidated list. */
    getOpenWithIntegrations(fileId: string, successCallback: Function, errorCallback: ElementsErrorCallback): void {
        this.errorCode = ERROR_CODE_FETCH_INTEGRATIONS;

        this.get({
            id: fileId,
            successCallback: (openWithIntegrations: OpenWithAPI) => {
                const formattedOpenWithData = this.formatOpenWithData(openWithIntegrations);
                const consolidatedOpenWithIntegrations = this.consolidateBoxEditIntegrations(formattedOpenWithData);
                successCallback(consolidatedOpenWithIntegrations);
            },
            errorCallback,
        });
    }

    /**
     * Removes the Box Edit SFC integration if the higher scoped Box Edit integration is present.
     * Box Edit and SFC Box Edit are considered separate integrations by the API. We only want to show one,
     * even if both are enabled and returned from the API.
     */
    consolidateBoxEditIntegrations(integrations: Array<Integration>): Array<Integration> {
        let consolidatedIntegrations = [...integrations];
        const boxEditIntegration = integrations.some(item => item.appIntegrationId === BOX_EDIT_INTEGRATION_ID);

        if (boxEditIntegration) {
            consolidatedIntegrations = integrations.filter(
                item => item.appIntegrationId !== BOX_EDIT_SFC_INTEGRATION_ID,
            );
        }

        return consolidatedIntegrations;
    }

    /** Flattens raw Open With API integrations into client `Integration` objects, sorted by `displayOrder`. */
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
            }) => {
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
