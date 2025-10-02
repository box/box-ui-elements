/**
 * 
 * @file integration portal container
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ErrorMask from '../../components/error-mask/ErrorMask';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import messages from '../common/messages';
import IntegrationPortal from './IntegrationPortal';
const IntegrationPortalContainer = ({
  hasError,
  integrationWindow
}) => /*#__PURE__*/React.createElement(IntegrationPortal, {
  integrationWindow: integrationWindow
}, /*#__PURE__*/React.createElement("div", {
  className: "be bcow bcow-portal-container"
}, hasError ? /*#__PURE__*/React.createElement(ErrorMask, {
  errorHeader: /*#__PURE__*/React.createElement(FormattedMessage, messages.executeIntegrationOpenWithErrorHeader),
  errorSubHeader: /*#__PURE__*/React.createElement(FormattedMessage, messages.executeIntegrationOpenWithErrorSubHeader)
}) : /*#__PURE__*/React.createElement(LoadingIndicator, {
  className: "bcow-portal-loading-indicator",
  size: "large"
})));
export default IntegrationPortalContainer;
//# sourceMappingURL=IntegrationPortalContainer.js.map