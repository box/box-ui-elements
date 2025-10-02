import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import { UnifiedShareModal } from '@box/unified-share-modal';
import { FIELD_ENTERPRISE, FIELD_HOSTNAME, TYPE_FILE, TYPE_FOLDER } from '../../constants';
import Internationalize from '../common/Internationalize';
import Providers from '../common/Providers';
import { CONTENT_SHARING_ITEM_FIELDS } from './constants';
import { convertItemResponse } from './utils';
function ContentSharingV2({
  api,
  children,
  itemID,
  itemType,
  hasProviders,
  language,
  messages
}) {
  const [item, setItem] = React.useState(null);
  const [sharedLink, setSharedLink] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [collaborationRoles, setCollaborationRoles] = React.useState(null);

  // Handle successful GET requests to /files or /folders
  const handleGetItemSuccess = React.useCallback(itemData => {
    const {
      collaborationRoles: collaborationRolesFromAPI,
      item: itemFromAPI,
      sharedLink: sharedLinkFromAPI
    } = convertItemResponse(itemData);
    setItem(itemFromAPI);
    setSharedLink(sharedLinkFromAPI);
    setCollaborationRoles(collaborationRolesFromAPI);
  }, []);

  // Reset state if the API has changed
  React.useEffect(() => {
    setItem(null);
    setSharedLink(null);
    setCurrentUser(null);
    setCollaborationRoles(null);
  }, [api]);

  // Get initial data for the item
  React.useEffect(() => {
    const getItem = () => {
      if (itemType === TYPE_FILE) {
        api.getFileAPI().getFile(itemID, handleGetItemSuccess, {}, {
          fields: CONTENT_SHARING_ITEM_FIELDS
        });
      } else if (itemType === TYPE_FOLDER) {
        api.getFolderAPI().getFolderFields(itemID, handleGetItemSuccess, {}, {
          fields: CONTENT_SHARING_ITEM_FIELDS
        });
      }
    };
    if (api && !isEmpty(api) && !item && !sharedLink) {
      getItem();
    }
  }, [api, item, itemID, itemType, sharedLink, handleGetItemSuccess]);

  // Get initial data for the user
  React.useEffect(() => {
    const getUserSuccess = userData => {
      const {
        enterprise,
        id
      } = userData;
      setCurrentUser({
        id,
        enterprise: {
          name: enterprise ? enterprise.name : ''
        }
      });
    };
    const getUserData = () => {
      api.getUsersAPI(false).getUser(itemID, getUserSuccess, {}, {
        params: {
          fields: [FIELD_ENTERPRISE, FIELD_HOSTNAME].toString()
        }
      });
    };
    if (api && !isEmpty(api) && item && sharedLink && !currentUser) {
      getUserData();
    }
  }, [api, currentUser, item, itemID, itemType, sharedLink]);
  const config = {
    sharedLinkEmail: false
  };
  return /*#__PURE__*/React.createElement(Internationalize, {
    language: language,
    messages: messages
  }, /*#__PURE__*/React.createElement(Providers, {
    hasProviders: hasProviders
  }, item && /*#__PURE__*/React.createElement(UnifiedShareModal, {
    config: config,
    collaborationRoles: collaborationRoles,
    currentUser: currentUser,
    item: item,
    sharedLink: sharedLink
  }, children)));
}
export default ContentSharingV2;
//# sourceMappingURL=ContentSharingV2.js.map