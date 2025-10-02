function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file SharingModal
 * @description This is the second-level component for the ContentSharing Element. It receives an API instance
 * from its parent component, ContentSharing, and then instantiates the UnifiedShareModal with API data.
 * @author Box
 */
import * as React from 'react';
import isEmpty from 'lodash/isEmpty';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import API from '../../api';
import Internationalize from '../common/Internationalize';
import NotificationsWrapper from '../../components/notification/NotificationsWrapper';
import Notification from '../../components/notification/Notification';
import { DURATION_SHORT, TYPE_ERROR } from '../../components/notification/constants';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import UnifiedShareModal from '../../features/unified-share-modal';
import SharedLinkSettingsModal from '../../features/shared-link-settings-modal';
import SharingNotification from './SharingNotification';
import { convertItemResponse, convertUserContactsByEmailResponse, convertUserResponse } from '../../features/unified-share-modal/utils/convertData';
import useContactsByEmail from './hooks/useContactsByEmail';
import { FIELD_ENTERPRISE, FIELD_HOSTNAME, TYPE_FILE, TYPE_FOLDER } from '../../constants';
import { CONTENT_SHARING_ERRORS, CONTENT_SHARING_ITEM_FIELDS, CONTENT_SHARING_VIEWS } from './constants';
import { INVITEE_PERMISSIONS_FOLDER, INVITEE_PERMISSIONS_FILE } from '../../features/unified-share-modal/constants';
import contentSharingMessages from './messages';
function SharingModal({
  api,
  config,
  displayInModal,
  isVisible,
  itemID,
  itemType,
  language,
  messages,
  setIsVisible,
  uuid
}) {
  const [item, setItem] = React.useState(null);
  const [sharedLink, setSharedLink] = React.useState(null);
  const [currentUserEnterpriseName, setCurrentUserEnterpriseName] = React.useState(null);
  const [currentUserID, setCurrentUserID] = React.useState(null);
  const [initialDataErrorMessage, setInitialDataErrorMessage] = React.useState(null);
  const [isInitialDataErrorVisible, setIsInitialDataErrorVisible] = React.useState(false);
  const [collaboratorsList, setCollaboratorsList] = React.useState(null);
  const [onAddLink, setOnAddLink] = React.useState(null);
  const [onRemoveLink, setOnRemoveLink] = React.useState(null);
  const [changeSharedLinkAccessLevel, setChangeSharedLinkAccessLevel] = React.useState(null);
  const [changeSharedLinkPermissionLevel, setChangeSharedLinkPermissionLevel] = React.useState(null);
  const [onSubmitSettings, setOnSubmitSettings] = React.useState(null);
  const [currentView, setCurrentView] = React.useState(CONTENT_SHARING_VIEWS.UNIFIED_SHARE_MODAL);
  const [getContacts, setGetContacts] = React.useState(null);
  const [getContactsByEmail, setGetContactsByEmail] = React.useState(null);
  const [sendInvites, setSendInvites] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Handle successful GET requests to /files or /folders
  const handleGetItemSuccess = React.useCallback(itemData => {
    const {
      item: itemFromAPI,
      sharedLink: sharedLinkFromAPI
    } = convertItemResponse(itemData);
    setItem(itemFromAPI);
    setSharedLink(sharedLinkFromAPI);
    setIsLoading(false);
  }, []);

  // Handle initial data retrieval errors
  const getError = React.useCallback(error => {
    if (isInitialDataErrorVisible) return; // display only one component-level notification at a time

    setIsInitialDataErrorVisible(true);
    setIsLoading(false);
    let errorObject;
    if (error.status) {
      errorObject = contentSharingMessages[CONTENT_SHARING_ERRORS[error.status]];
    } else if (error.response && error.response.status) {
      errorObject = contentSharingMessages[CONTENT_SHARING_ERRORS[error.response.status]];
    } else {
      errorObject = contentSharingMessages.loadingError;
    }
    setInitialDataErrorMessage(errorObject);
  }, [isInitialDataErrorVisible]);

  // Reset state if the API has changed
  React.useEffect(() => {
    setChangeSharedLinkAccessLevel(null);
    setChangeSharedLinkPermissionLevel(null);
    setCollaboratorsList(null);
    setInitialDataErrorMessage(null);
    setCurrentUserID(null);
    setCurrentUserEnterpriseName(null);
    setIsInitialDataErrorVisible(false);
    setIsLoading(true);
    setItem(null);
    setOnAddLink(null);
    setOnRemoveLink(null);
    setSharedLink(null);
  }, [api]);

  // Refresh error state if the uuid has changed
  React.useEffect(() => {
    setInitialDataErrorMessage(null);
    setIsInitialDataErrorVisible(false);
  }, [uuid]);

  // Get initial data for the item
  React.useEffect(() => {
    const getItem = () => {
      if (itemType === TYPE_FILE) {
        api.getFileAPI().getFile(itemID, handleGetItemSuccess, getError, {
          fields: CONTENT_SHARING_ITEM_FIELDS
        });
      } else if (itemType === TYPE_FOLDER) {
        api.getFolderAPI().getFolderFields(itemID, handleGetItemSuccess, getError, {
          fields: CONTENT_SHARING_ITEM_FIELDS
        });
      }
    };
    if (api && !isEmpty(api) && !initialDataErrorMessage && isVisible && !item && !sharedLink) {
      getItem();
    }
  }, [api, initialDataErrorMessage, getError, handleGetItemSuccess, isVisible, item, itemID, itemType, sharedLink]);

  // Get initial data for the user
  React.useEffect(() => {
    const getUserSuccess = userData => {
      const {
        id,
        userEnterpriseData
      } = convertUserResponse(userData);
      setCurrentUserID(id);
      setCurrentUserEnterpriseName(userEnterpriseData.enterpriseName || null);
      setSharedLink(prevSharedLink => _objectSpread(_objectSpread({}, prevSharedLink), userEnterpriseData));
      setInitialDataErrorMessage(null);
      setIsLoading(false);
    };
    const getUserData = () => {
      api.getUsersAPI(false).getUser(itemID, getUserSuccess, getError, {
        params: {
          fields: [FIELD_ENTERPRISE, FIELD_HOSTNAME].toString()
        }
      });
    };
    if (api && !isEmpty(api) && !initialDataErrorMessage && item && sharedLink && !currentUserID) {
      getUserData();
    }
  }, [getError, item, itemID, itemType, sharedLink, currentUserID, api, initialDataErrorMessage]);

  // Set the getContactsByEmail function. This call is not associated with a banner notification,
  // which is why it exists at this level and not in SharingNotification
  const getContactsByEmailFn = useContactsByEmail(api, itemID, {
    transformUsers: data => convertUserContactsByEmailResponse(data)
  });
  if (getContactsByEmailFn && !getContactsByEmail) {
    setGetContactsByEmail(() => getContactsByEmailFn);
  }

  // Display a notification if there is an error in retrieving initial data
  if (initialDataErrorMessage) {
    return isInitialDataErrorVisible ? /*#__PURE__*/React.createElement(Internationalize, {
      language: language,
      messages: messages
    }, /*#__PURE__*/React.createElement(NotificationsWrapper, null, /*#__PURE__*/React.createElement(Notification, {
      onClose: () => setIsInitialDataErrorVisible(false),
      type: TYPE_ERROR,
      duration: DURATION_SHORT
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(FormattedMessage, initialDataErrorMessage))))) : null;
  }

  // Ensure that all necessary data has been received before rendering child components.
  // If the USM is visible, show the LoadingIndicator; otherwise, show nothing.
  // "serverURL" is added to sharedLink after the call to the Users API, so it needs to be checked separately.
  if (!item || !sharedLink || !currentUserID || !sharedLink.serverURL) {
    return isVisible ? /*#__PURE__*/React.createElement(LoadingIndicator, null) : null;
  }
  const {
    ownerEmail,
    ownerID,
    permissions
  } = item;
  const {
    accessLevel = '',
    canChangeExpiration = false,
    expirationTimestamp,
    isDownloadAvailable = false,
    serverURL
  } = sharedLink;
  return /*#__PURE__*/React.createElement(Internationalize, {
    language: language,
    messages: messages
  }, /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SharingNotification, {
    accessLevel: accessLevel,
    api: api,
    closeComponent: displayInModal ? () => setIsVisible(false) : noop,
    closeSettings: () => setCurrentView(CONTENT_SHARING_VIEWS.UNIFIED_SHARE_MODAL),
    collaboratorsList: collaboratorsList,
    currentUserID: currentUserID,
    getContacts: getContacts,
    isDownloadAvailable: isDownloadAvailable,
    itemID: itemID,
    itemType: itemType,
    onSubmitSettings: onSubmitSettings,
    ownerEmail: ownerEmail,
    ownerID: ownerID,
    permissions: permissions,
    sendInvites: sendInvites,
    serverURL: serverURL,
    setChangeSharedLinkAccessLevel: setChangeSharedLinkAccessLevel,
    setChangeSharedLinkPermissionLevel: setChangeSharedLinkPermissionLevel,
    setGetContacts: setGetContacts,
    setCollaboratorsList: setCollaboratorsList,
    setIsLoading: setIsLoading,
    setItem: setItem,
    setOnAddLink: setOnAddLink,
    setOnRemoveLink: setOnRemoveLink,
    setOnSubmitSettings: setOnSubmitSettings,
    setSendInvites: setSendInvites,
    setSharedLink: setSharedLink
  }), isVisible && currentView === CONTENT_SHARING_VIEWS.SHARED_LINK_SETTINGS && /*#__PURE__*/React.createElement(SharedLinkSettingsModal, _extends({
    isDirectLinkUnavailableDueToDownloadSettings: false,
    isDirectLinkUnavailableDueToAccessPolicy: false,
    isDirectLinkUnavailableDueToMaliciousContent: false,
    isOpen: isVisible,
    item: item,
    onRequestClose: () => setCurrentView(CONTENT_SHARING_VIEWS.UNIFIED_SHARE_MODAL),
    onSubmit: onSubmitSettings,
    submitting: isLoading
  }, sharedLink, {
    canChangeExpiration: canChangeExpiration && !!currentUserEnterpriseName
  })), isVisible && currentView === CONTENT_SHARING_VIEWS.UNIFIED_SHARE_MODAL && /*#__PURE__*/React.createElement(UnifiedShareModal, {
    canInvite: sharedLink.canInvite,
    config: config,
    changeSharedLinkAccessLevel: changeSharedLinkAccessLevel,
    changeSharedLinkPermissionLevel: changeSharedLinkPermissionLevel,
    collaboratorsList: collaboratorsList,
    currentUserID: currentUserID,
    displayInModal: displayInModal,
    getCollaboratorContacts: getContacts,
    getContactsByEmail: getContactsByEmail,
    initialDataReceived: true,
    inviteePermissions: itemType === TYPE_FOLDER ? INVITEE_PERMISSIONS_FOLDER : INVITEE_PERMISSIONS_FILE,
    isOpen: isVisible,
    item: item,
    onAddLink: onAddLink,
    onRequestClose: displayInModal ? () => setIsVisible(false) : noop,
    onRemoveLink: onRemoveLink,
    onSettingsClick: () => setCurrentView(CONTENT_SHARING_VIEWS.SHARED_LINK_SETTINGS),
    sendInvites: sendInvites,
    sharedLink: _objectSpread(_objectSpread({}, sharedLink), {}, {
      expirationTimestamp: expirationTimestamp ? expirationTimestamp / 1000 : null
    }) // the USM expects this value in seconds, while the SLSM expects this value in milliseconds
    ,
    submitting: isLoading
  })));
}
export default SharingModal;
//# sourceMappingURL=SharingModal.js.map