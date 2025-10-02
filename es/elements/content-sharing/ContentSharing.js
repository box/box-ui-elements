/**
 * 
 * @file ContentSharing Element
 * @description This is the top-level component for ContentSharing. It instantiates the API, which it then
 * passes to the SharingModal component either immediately (when no custom button is provided) or on
 * button click (when a custom button is provided).
 * @author Box
 */
import 'regenerator-runtime/runtime';
import * as React from 'react';
import API from '../../api';
// $FlowFixMe
import { withBlueprintModernization } from '../common/withBlueprintModernization';
import { isFeatureEnabled } from '../common/feature-checking';
import SharingModal from './SharingModal';
// $FlowFixMe
import ContentSharingV2 from './ContentSharingV2';
import { CLIENT_NAME_CONTENT_SHARING, CLIENT_VERSION, DEFAULT_HOSTNAME_API } from '../../constants';
import '../common/base.scss';
import '../common/fonts.scss';
import '../common/modal.scss';
const createAPI = (apiHost, itemID, itemType, token) => new API({
  apiHost,
  clientName: CLIENT_NAME_CONTENT_SHARING,
  id: `${itemType}_${itemID}`,
  token,
  version: CLIENT_VERSION
});
function ContentSharing({
  apiHost = DEFAULT_HOSTNAME_API,
  children,
  config,
  customButton,
  displayInModal,
  features = {},
  hasProviders = true,
  itemID,
  itemType,
  language,
  messages,
  token,
  uuid
}) {
  const [api, setAPI] = React.useState(createAPI(apiHost, itemID, itemType, token));
  const [launchButton, setLaunchButton] = React.useState(null);
  const [isVisible, setIsVisible] = React.useState(!customButton);

  // Reset the API if necessary
  React.useEffect(() => {
    if (apiHost && itemID && itemType && token) {
      setAPI(createAPI(apiHost, itemID, itemType, token));
    }
  }, [apiHost, itemID, itemType, token]);

  // Reset state if the API has changed
  React.useEffect(() => {
    setIsVisible(!customButton);
  }, [api, customButton, uuid]);
  React.useEffect(() => {
    if (customButton && !launchButton) {
      setLaunchButton(/*#__PURE__*/React.cloneElement(customButton, {
        onClick: () => {
          return setIsVisible(true);
        }
      }));
    }
  }, [config, customButton, displayInModal, itemID, itemType, language, launchButton, messages, isVisible]);
  if (isFeatureEnabled(features, 'contentSharingV2')) {
    return api && /*#__PURE__*/React.createElement(ContentSharingV2, {
      api: api,
      itemID: itemID,
      itemType: itemType,
      hasProviders: hasProviders,
      language: language,
      messages: messages
    }, children);
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, launchButton, api && /*#__PURE__*/React.createElement(SharingModal, {
    api: api,
    config: config,
    displayInModal: displayInModal,
    isVisible: isVisible,
    itemID: itemID,
    itemType: itemType,
    language: language,
    messages: messages,
    setIsVisible: setIsVisible,
    uuid: uuid
  }));
}
export { ContentSharing as ContentSharingComponent };
export default withBlueprintModernization(ContentSharing);
//# sourceMappingURL=ContentSharing.js.map