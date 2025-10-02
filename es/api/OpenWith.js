/**
 * 
 * @file Helper for the open_with_integrations API endpoint
 * @author Box
 */

import Base from './Base';
import { ERROR_CODE_FETCH_INTEGRATIONS, BOX_EDIT_INTEGRATION_ID, BOX_EDIT_SFC_INTEGRATION_ID } from '../constants';
class OpenWith extends Base {
  /**
   * API URL for Open With
   *
   * @param {string} [id] - a box file id
   * @return {string} base url for files
   */
  getUrl(id) {
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
  getOpenWithIntegrations(fileId, successCallback, errorCallback) {
    this.errorCode = ERROR_CODE_FETCH_INTEGRATIONS;
    this.get({
      id: fileId,
      successCallback: openWithIntegrations => {
        const formattedOpenWithData = this.formatOpenWithData(openWithIntegrations);
        const consolidatedOpenWithIntegrations = this.consolidateBoxEditIntegrations(formattedOpenWithData);
        successCallback(consolidatedOpenWithIntegrations);
      },
      errorCallback
    });
  }

  /**
   * Removes the Box Edit SFC integration if the higher scoped Box Edit integration is present.
   * Box Edit and SFC Box Edit are considered separate integrations by the API. We only want to show one,
   * even if both are enabled and returned from the API.
   *
   * @param {Array<Integration>} integrations - List of integrations
   * @return {Array<Integration>} Integrations with only one Box Edit integration
   */
  consolidateBoxEditIntegrations(integrations) {
    let consolidatedIntegrations = [...integrations];
    const boxEditIntegration = integrations.some(item => item.appIntegrationId === BOX_EDIT_INTEGRATION_ID);
    if (boxEditIntegration) {
      consolidatedIntegrations = integrations.filter(item => item.appIntegrationId !== BOX_EDIT_SFC_INTEGRATION_ID);
    }
    return consolidatedIntegrations;
  }

  /**
   * Formats Open With data conveniently for the client
   *
   * @param {Array<Object>} openWithIntegrations - The modified Open With integration objects
   * @return {Array<Integration>} formatted Open With integrations
   */
  formatOpenWithData(openWithIntegrations) {
    const {
      items,
      default_app_integration: defaultIntegration
    } = openWithIntegrations;
    const integrations = items.map(({
      app_integration,
      disabled_reasons,
      display_name,
      display_description,
      display_order,
      is_disabled,
      should_show_consent_popup
    }) => {
      const {
        id,
        type
      } = app_integration;
      return {
        appIntegrationId: id,
        displayDescription: display_description,
        disabledReasons: disabled_reasons || [],
        displayOrder: display_order,
        isDefault: !!defaultIntegration && id === defaultIntegration.id,
        isDisabled: is_disabled,
        displayName: display_name,
        requiresConsent: should_show_consent_popup,
        type
      };
    });

    // Sort integrations by displayOrder
    return integrations.sort((integrationA, integrationB) => integrationA.displayOrder - integrationB.displayOrder);
  }
}
export default OpenWith;
//# sourceMappingURL=OpenWith.js.map