/**
 * 
 * @file Helper for the app_integrations API endpoint
 * @author Box
 */

import Base from './Base';
import { TYPE_FILE, ERROR_CODE_EXECUTE_INTEGRATION } from '../constants';
class AppIntegrations extends Base {
  /**
   * API URL for Open With
   *
   * @param {string} [integrationId] - a box integration app ID
   * @return {string} base url for app integrations
   */
  getUrl(integrationId) {
    if (!integrationId) {
      throw new Error('Missing app integration id!');
    }
    return `${this.getBaseApiUrl()}/app_integrations/${integrationId}`;
  }

  /**
   * API endpoint to execute an integration, given an ID
   *
   * @param {string} integrationID - An app integration ID
   * @param {string} fileID - A file ID
   * @return {string} base url for files
   */
  execute(integrationId, fileId, successCallback, errorCallback) {
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
          type: TYPE_FILE
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
//# sourceMappingURL=AppIntegrations.js.map