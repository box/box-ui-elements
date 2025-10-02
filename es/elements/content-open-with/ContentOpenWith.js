function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Open With Component
 * @author Box
 */

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import uniqueid from 'lodash/uniqueId';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import queryString from 'query-string';
import Internationalize from '../common/Internationalize';
import messages from '../common/messages';
import { withErrorBoundary } from '../common/error-boundary';
import API from '../../api';
import IntegrationPortalContainer from './IntegrationPortalContainer';
import OpenWithDropdownMenu from './OpenWithDropdownMenu';
import BoxToolsInstallMessage from './BoxToolsInstallMessage';
import OpenWithButton from './OpenWithButton';
import OpenWithFallbackButton from './OpenWithFallbackButton';
import ExecuteForm from './ExecuteForm';
import '../common/base.scss';
import './ContentOpenWith.scss';
import { BOX_EDIT_INTEGRATION_ID, BOX_EDIT_SFC_INTEGRATION_ID, CLIENT_NAME_OPEN_WITH, CLIENT_VERSION, DEFAULT_HOSTNAME_API, ERROR_CODE_EXECUTE_INTEGRATION, HTTP_GET, HTTP_POST, ORIGIN_OPEN_WITH, TYPE_FILE, TYPE_FOLDER } from '../../constants';
const UNSUPPORTED_INVOCATION_METHOD_TYPE = 'Integration invocation using this HTTP method type is not supported';
const BLACKLISTED_ERROR_MESSAGE_KEY = 'boxToolsBlacklistedError';
const BOX_TOOLS_INSTALL_ERROR_MESSAGE_KEY = 'boxToolsInstallErrorMessage';
const GENERIC_EXECUTE_MESSAGE_KEY = 'executeIntegrationOpenWithErrorHeader';
const AUTH_CODE = 'auth_code';
class ContentOpenWith extends PureComponent {
  /**
   * [constructor]
   *
   * @private
   * @return {ContentOpenWith}
   */
  constructor(props) {
    super(props);
    _defineProperty(this, "initialState", {
      isDropdownOpen: false,
      integrations: null,
      isLoading: true,
      fetchError: null,
      executePostData: null,
      shouldRenderErrorIntegrationPortal: false,
      shouldRenderLoadingIntegrationPortal: false
    });
    /**
     * Fetch app integrations info needed to render.
     *
     * @param {OpenWithIntegrations} integrations - The available Open With integrations
     * @return {void}
     */
    _defineProperty(this, "fetchOpenWithSuccessHandler", async integrations => {
      const {
        boxToolsName,
        boxToolsInstallUrl
      } = this.props;
      const boxEditIntegration = integrations.find(({
        appIntegrationId
      }) => this.isBoxEditIntegration(appIntegrationId));
      if (boxEditIntegration && !boxEditIntegration.isDisabled) {
        try {
          const {
            extension
          } = await this.getIntegrationFileExtension();
          boxEditIntegration.extension = extension;
          // If Box Edit is present and enabled, we need to set its ability to locally open the given file
          // No-op if these checks are successful
          await this.isBoxEditAvailable();
          await this.canOpenExtensionWithBoxEdit(boxEditIntegration);
        } catch (error) {
          const errorMessageObject = messages[error.message] || messages[GENERIC_EXECUTE_MESSAGE_KEY];
          let formattedErrorMessage = /*#__PURE__*/React.createElement(FormattedMessage, errorMessageObject);
          if (error.message === BOX_TOOLS_INSTALL_ERROR_MESSAGE_KEY) {
            formattedErrorMessage = /*#__PURE__*/React.createElement(BoxToolsInstallMessage, {
              boxToolsInstallUrl: boxToolsInstallUrl,
              boxToolsName: boxToolsName
            });
          }
          boxEditIntegration.disabledReasons.push(formattedErrorMessage);
          boxEditIntegration.isDisabled = true;
        }
      }
      this.setState({
        integrations,
        isLoading: false
      });
    });
    /**
     * Fetches the file extension of the current file.
     *
     * @return {Promise}
     */
    _defineProperty(this, "getIntegrationFileExtension", () => {
      const {
        fileId
      } = this.props;
      return new Promise((resolve, reject) => {
        this.api.getFileAPI().getFileExtension(fileId, resolve, () => reject(new Error(GENERIC_EXECUTE_MESSAGE_KEY)));
      });
    });
    /**
     * Uses Box Edit to check if Box Tools is installed and reachable
     *
     * @return {Promise}
     */
    _defineProperty(this, "isBoxEditAvailable", () => {
      return this.api.getBoxEditAPI().checkBoxEditAvailability().catch(() => {
        throw new Error(BOX_TOOLS_INSTALL_ERROR_MESSAGE_KEY);
      });
    });
    /**
     * Uses Box Edit to check if Box Tools can open a given file type
     *
     * @param {String} extension - A file extension
     * @return {Promise}
     */
    _defineProperty(this, "canOpenExtensionWithBoxEdit", ({
      extension = ''
    }) => {
      return this.api.getBoxEditAPI().getAppForExtension(extension).catch(() => {
        throw new Error(BLACKLISTED_ERROR_MESSAGE_KEY);
      });
    });
    /**
     * Handles a fetch error for the open_with_integrations and app_integrations endpoints
     *
     * @param {Error} error - An axios fetch error
     * @return {void}
     */
    _defineProperty(this, "fetchErrorHandler", (error, code) => {
      this.props.onError(error, code, {
        error
      });
      this.setState({
        fetchError: error,
        isLoading: false
      });
    });
    /**
     * Click handler when an integration is clicked
     *
     * @private
     * @param {string} appIntegrationId - An app integration ID
     * @param {string} displayName - The integration's display name
     * @return {void}
     */
    _defineProperty(this, "onIntegrationClick", ({
      appIntegrationId,
      displayName
    }) => {
      const {
        fileId
      } = this.props;
      const isBoxEditIntegration = this.isBoxEditIntegration(appIntegrationId);
      this.api.getAppIntegrationsAPI(false).execute(appIntegrationId, fileId, this.executeIntegrationSuccessHandler.bind(this, appIntegrationId), isBoxEditIntegration ? this.executeBoxEditErrorHandler : this.executeIntegrationErrorHandler);
      if (isBoxEditIntegration) {
        // No window management is required when using Box Edit.
        return;
      }

      // These window features will open the new window directly on top of the current window at the same
      const windowFeatures = `left=${window.screenX},top=${window.screenY},height=${window.outerHeight},width=${window.innerWidth},toolbar=0`;

      // window.open() is immediately invoked to avoid popup-blockers
      // The name is included to be the target of a form if the integration is a POST integration.
      // A uniqueid is used to force the browser to open a new tab every time, while still allowing
      // a form to reference a given tab.
      this.integrationWindow = this.window.open('', `${uniqueid(appIntegrationId)}`, windowFeatures);
      this.integrationWindow.document.title = displayName;
      this.integrationWindow.onunload = this.cleanupIntegrationWindow;
      this.setState({
        shouldRenderLoadingIntegrationPortal: true,
        shouldRenderErrorIntegrationPortal: false
      });
    });
    /**
     * cleans up the portal UI when a tab is closed so that we can remount the component later.
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "cleanupIntegrationWindow", () => {
      this.setState({
        shouldRenderLoadingIntegrationPortal: false,
        shouldRenderErrorIntegrationPortal: false
      });
    });
    /**
     * Opens the integration in a new tab based on the API data
     *
     * @private
     * @param {string} integrationId - The integration that was executed
     * @param {ExecuteAPI} executeData - API response on how to open an executed integration
      * @return {void}
     */
    _defineProperty(this, "executeIntegrationSuccessHandler", (integrationId, executeData) => {
      if (this.isBoxEditIntegration(integrationId)) {
        this.executeBoxEditSuccessHandler(integrationId, executeData);
      } else {
        this.executeOnlineIntegrationSuccessHandler(executeData);
      }
      this.onExecute(integrationId);
    });
    /**
     * Opens the file via a Partner Integration
     *
     * @private
     * @param {ExecuteAPI} executeData - API response on how to open an executed integration
      * @return {void}
     */
    _defineProperty(this, "executeOnlineIntegrationSuccessHandler", executeData => {
      const {
        method,
        url
      } = executeData;
      switch (method) {
        case HTTP_POST:
          this.setState({
            executePostData: executeData
          });
          break;
        case HTTP_GET:
          if (!this.integrationWindow) {
            return;
          }

          // Prevents abuse of window.opener
          // see here for more details: https://mathiasbynens.github.io/rel-noopener/
          this.integrationWindow.location = url;
          this.integrationWindow.opener = null;
          break;
        default:
          this.executeIntegrationErrorHandler(Error(UNSUPPORTED_INVOCATION_METHOD_TYPE), ERROR_CODE_EXECUTE_INTEGRATION);
      }
      this.integrationWindow = null;
    });
    /**
     * Opens the file via Box Edit
     *
     * @private
     * @param {string} url - Integration execution URL
      * @return {void}
     */
    _defineProperty(this, "executeBoxEditSuccessHandler", (integrationId, {
      url
    }) => {
      const {
        fileId,
        token,
        onError
      } = this.props;
      const queryParams = queryString.parse(url);
      const authCode = queryParams[AUTH_CODE];
      const isFileScoped = this.isBoxEditSFCIntegration(integrationId);
      this.api.getBoxEditAPI().openFile(fileId, {
        data: {
          auth_code: authCode,
          token,
          token_scope: isFileScoped ? TYPE_FILE : TYPE_FOLDER
        }
      }).catch(error => {
        onError(error, ERROR_CODE_EXECUTE_INTEGRATION, {
          error
        });
      });
    });
    /**
     * Clears state after a form has been submitted
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "onExecuteFormSubmit", () => {
      this.setState({
        executePostData: null
      });
    });
    /**
     * Handles execution related errors
     *
     * @private
     * @param {Error} error - Error object
     * @return {void}
     */
    _defineProperty(this, "executeIntegrationErrorHandler", (error, code) => {
      this.props.onError(error, code, {
        error
      });
      // eslint-disable-next-line no-console
      console.error(error);
      this.setState({
        shouldRenderLoadingIntegrationPortal: false,
        shouldRenderErrorIntegrationPortal: true
      });
    });
    /**
     * Handles Box Edit execution related errors
     *
     * @private
     * @param {Error} error - Error object
     * @return {void}
     */
    _defineProperty(this, "executeBoxEditErrorHandler", error => {
      this.props.onError(error);
      // eslint-disable-next-line no-console
      console.error(error);
    });
    const {
      token: _token,
      apiHost,
      clientName,
      language,
      requestInterceptor,
      responseInterceptor
    } = props;
    this.id = uniqueid('bcow_');
    this.api = new API({
      apiHost,
      clientName,
      language,
      requestInterceptor,
      responseInterceptor,
      token: _token,
      version: CLIENT_VERSION
    });

    // Clone initial state to allow for state reset on new files
    this.state = _objectSpread({}, this.initialState);
  }

  /**
   * Destroys api instances with caches
   *
   * @private
   * @return {void}
   */
  clearCache() {
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
   *
   * @private
   * @inheritdoc
   * @return {void}
   */
  componentDidMount() {
    const {
      fileId
    } = this.props;
    if (!fileId) {
      return;
    }
    this.window = window;
    this.fetchOpenWithData();
  }

  /**
   * After component updates, re-fetch Open With data if appropriate.
   *
   * @return {void}
   */
  componentDidUpdate(prevProps) {
    const {
      fileId: currentFileId
    } = this.props;
    const {
      fileId: previousFileId
    } = prevProps;
    if (!currentFileId) {
      return;
    }
    if (currentFileId !== previousFileId) {
      this.setState(_objectSpread({}, this.initialState));
      this.fetchOpenWithData();
    }
  }

  /**
   * Checks if a given integration is a Box Edit integration.
   *
   * @param {string} [integrationId] - The integration ID
   * @return {boolean}
   */
  isBoxEditIntegration(integrationId) {
    return integrationId === BOX_EDIT_INTEGRATION_ID || this.isBoxEditSFCIntegration(integrationId);
  }

  /**
   * Checks if a given integration is a Box Edit integration.
   *
   * @param {string} [integrationId] - The integration ID
   * @return {boolean}
   */
  isBoxEditSFCIntegration(integrationId) {
    return integrationId === BOX_EDIT_SFC_INTEGRATION_ID;
  }

  /**
   * Fetches Open With data.
   *
   * @return {void}
   */
  fetchOpenWithData() {
    const {
      fileId
    } = this.props;
    this.api.getOpenWithAPI(false).getOpenWithIntegrations(fileId, this.fetchOpenWithSuccessHandler, this.fetchErrorHandler);
  }
  /**
   * Calls the onExecute prop
   *
   * @private
   * @param {string} integrationID - The integration that was executed
   * @return {void}
   */
  onExecute(integrationID) {
    this.props.onExecute(integrationID);
    this.setState({
      shouldRenderLoadingIntegrationPortal: false
    });
  }
  /**
   * Gets a display integration, if available, for the Open With button
   *
   * @private
   * @return {?Integration}
   */
  getDisplayIntegration() {
    const {
      integrations
    } = this.state;
    // We only consider an integration a display integration if is the only integration in our state
    return Array.isArray(integrations) && integrations.length === 1 ? integrations[0] : null;
  }

  /**
   * Render the Open With element
   *
   * @private
   * @inheritdoc
   * @return {Element}
   */
  render() {
    const {
      language,
      messages: intlMessages,
      dropdownAlignment
    } = this.props;
    const {
      fetchError,
      isLoading,
      integrations,
      executePostData,
      shouldRenderLoadingIntegrationPortal,
      shouldRenderErrorIntegrationPortal
    } = this.state;
    const className = classNames('be bcow', this.props.className);
    const displayIntegration = this.getDisplayIntegration();
    const numIntegrations = integrations ? integrations.length : 0;
    return /*#__PURE__*/React.createElement(Internationalize, {
      language: language,
      messages: intlMessages
    }, /*#__PURE__*/React.createElement("div", {
      className: className,
      "data-testid": "bcow-content",
      id: this.id
    }, numIntegrations <= 1 ? /*#__PURE__*/React.createElement(OpenWithButton, {
      displayIntegration: displayIntegration,
      error: fetchError,
      isLoading: isLoading,
      onClick: this.onIntegrationClick
    }) : /*#__PURE__*/React.createElement(OpenWithDropdownMenu, {
      dropdownAlignment: dropdownAlignment,
      integrations: integrations,
      onClick: this.onIntegrationClick
    }), (shouldRenderLoadingIntegrationPortal || shouldRenderErrorIntegrationPortal) && /*#__PURE__*/React.createElement(IntegrationPortalContainer, {
      hasError: shouldRenderErrorIntegrationPortal,
      integrationWindow: this.integrationWindow
    }), executePostData && /*#__PURE__*/React.createElement(ExecuteForm, {
      executePostData: executePostData,
      id: this.id,
      onSubmit: this.onExecuteFormSubmit,
      windowName: this.integrationWindow && this.integrationWindow.name
    })));
  }
}
_defineProperty(ContentOpenWith, "defaultProps", {
  apiHost: DEFAULT_HOSTNAME_API,
  className: '',
  clientName: CLIENT_NAME_OPEN_WITH,
  onExecute: noop,
  onError: noop
});
export { ContentOpenWith as ContentOpenWithComponent };
export default withErrorBoundary(ORIGIN_OPEN_WITH, OpenWithFallbackButton)(ContentOpenWith);
//# sourceMappingURL=ContentOpenWith.js.map