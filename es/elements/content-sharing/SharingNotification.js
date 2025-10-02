function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import API from '../../api';
import Notification from '../../components/notification/Notification';
import { DURATION_SHORT, TYPE_ERROR, TYPE_INFO } from '../../components/notification/constants';
import NotificationsWrapper from '../../components/notification/NotificationsWrapper';
import useSharedLink from './hooks/useSharedLink';
import { convertCollab, convertCollabsRequest, convertCollabsResponse, convertGroupContactsResponse, convertItemResponse, convertSharedLinkPermissions, convertSharedLinkSettings, convertUserContactsResponse, USM_TO_API_ACCESS_LEVEL_MAP } from '../../features/unified-share-modal/utils/convertData';
import useAvatars from './hooks/useAvatars';
import useCollaborators from './hooks/useCollaborators';
import useContacts from './hooks/useContacts';
import useInvites from './hooks/useInvites';
import contentSharingMessages from './messages';
function SharingNotification({
  accessLevel,
  api,
  closeComponent,
  closeSettings,
  collaboratorsList,
  currentUserID,
  getContacts,
  isDownloadAvailable,
  itemID,
  itemType,
  ownerEmail,
  ownerID,
  permissions,
  sendInvites,
  serverURL,
  setChangeSharedLinkAccessLevel,
  setChangeSharedLinkPermissionLevel,
  setGetContacts,
  setCollaboratorsList,
  setIsLoading,
  setItem,
  setOnAddLink,
  setOnRemoveLink,
  setOnSubmitSettings,
  setSendInvites,
  setSharedLink
}) {
  const [notifications, setNotifications] = React.useState({});
  const [notificationID, setNotificationID] = React.useState(0);

  // Close a notification
  const handleNotificationClose = React.useCallback(id => {
    const updatedNotifications = _objectSpread({}, notifications);
    delete updatedNotifications[id];
    setNotifications(updatedNotifications);
  }, [notifications]);

  // Create a notification
  const createNotification = React.useCallback((notificationType, message) => {
    const updatedNotifications = _objectSpread({}, notifications);
    if (updatedNotifications[notificationID]) {
      return;
    }
    updatedNotifications[notificationID] = /*#__PURE__*/React.createElement(Notification, {
      key: notificationID,
      duration: DURATION_SHORT,
      onClose: () => handleNotificationClose(notificationID),
      type: notificationType
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(FormattedMessage, message)));
    setNotifications(updatedNotifications);
    setNotificationID(notificationID + 1);
  }, [handleNotificationClose, notificationID, notifications]);

  // Handle successful PUT requests to /files or /folders
  const handleUpdateSharedLinkSuccess = itemData => {
    const {
      item: updatedItem,
      sharedLink: updatedSharedLink
    } = convertItemResponse(itemData);
    setItem(prevItem => _objectSpread(_objectSpread({}, prevItem), updatedItem));
    setSharedLink(prevSharedLink => {
      return _objectSpread(_objectSpread({}, prevSharedLink), updatedSharedLink);
    }); // merge new shared link data with current shared link data
  };

  /**
   * Handle a successful shared link removal request.
   *
   * Most of the data for the shared link will be removed, with the exception of the "canInvite", "serverURL"
   * and "enterpriseName" properties, both of which are still necessary for rendering the form-only version of ContentSharing.
   * We retain "serverURL" and "enterpriseName" from the previous shared link, to avoid having to make another call to the Users API.
   *
   * @param {ContentSharingItemAPIResponse} itemData
   */
  const handleRemoveSharedLinkSuccess = itemData => {
    const {
      item: updatedItem,
      sharedLink: updatedSharedLink
    } = convertItemResponse(itemData);
    setItem(prevItem => _objectSpread(_objectSpread({}, prevItem), updatedItem));
    setSharedLink(prevSharedLink => {
      return _objectSpread(_objectSpread({}, updatedSharedLink), {}, {
        serverURL: prevSharedLink ? prevSharedLink.serverURL : '',
        enterpriseName: prevSharedLink && prevSharedLink.enterpriseName ? prevSharedLink.enterpriseName : ''
      });
    });
  };

  // Generate shared link CRUD functions for the item
  const {
    changeSharedLinkAccessLevel,
    changeSharedLinkPermissionLevel,
    onAddLink,
    onRemoveLink,
    onSubmitSettings
  } = useSharedLink(api, itemID, itemType, permissions, accessLevel, {
    handleUpdateSharedLinkError: () => {
      createNotification(TYPE_ERROR, contentSharingMessages.sharedLinkUpdateError);
      setIsLoading(false);
      closeSettings();
    },
    handleUpdateSharedLinkSuccess: itemData => {
      createNotification(TYPE_INFO, contentSharingMessages.sharedLinkSettingsUpdateSuccess);
      handleUpdateSharedLinkSuccess(itemData);
      setIsLoading(false);
      closeSettings();
    },
    handleRemoveSharedLinkError: () => {
      createNotification(TYPE_ERROR, contentSharingMessages.sharedLinkUpdateError);
      setIsLoading(false);
      closeComponent(); // if this function is provided, it will close the modal
    },
    handleRemoveSharedLinkSuccess: itemData => {
      createNotification(TYPE_INFO, contentSharingMessages.sharedLinkRemovalSuccess);
      handleRemoveSharedLinkSuccess(itemData);
      setIsLoading(false);
      closeComponent();
    },
    setIsLoading,
    transformAccess: newAccessLevel => USM_TO_API_ACCESS_LEVEL_MAP[newAccessLevel],
    transformPermissions: newSharedLinkPermissionLevel => convertSharedLinkPermissions(newSharedLinkPermissionLevel),
    transformSettings: (settings, access) => convertSharedLinkSettings(settings, access, isDownloadAvailable, serverURL)
  });
  setChangeSharedLinkAccessLevel(() => changeSharedLinkAccessLevel);
  setChangeSharedLinkPermissionLevel(() => changeSharedLinkPermissionLevel);
  setOnAddLink(() => onAddLink);
  setOnRemoveLink(() => onRemoveLink);
  setOnSubmitSettings(() => onSubmitSettings);

  // Set the collaborators list
  const collaboratorsListFromAPI = useCollaborators(api, itemID, itemType, {
    handleError: () => createNotification(TYPE_ERROR, contentSharingMessages.collaboratorsLoadingError)
  });
  const avatarsFromAPI = useAvatars(api, itemID, collaboratorsListFromAPI);
  if (collaboratorsListFromAPI && avatarsFromAPI && !collaboratorsList) {
    setCollaboratorsList(convertCollabsResponse(collaboratorsListFromAPI, avatarsFromAPI, ownerEmail, currentUserID === ownerID));
  }

  // Set the getContacts function
  const getContactsFn = useContacts(api, itemID, {
    handleError: () => createNotification(TYPE_ERROR, contentSharingMessages.getContactsError),
    transformGroups: data => convertGroupContactsResponse(data),
    transformUsers: data => convertUserContactsResponse(data, currentUserID)
  });
  if (getContactsFn && !getContacts) {
    setGetContacts(() => getContactsFn);
  }

  // Set the sendInvites function
  const sendInvitesFn = useInvites(api, itemID, itemType, {
    handleSuccess: response => {
      createNotification(TYPE_INFO, contentSharingMessages.sendInvitesSuccess);
      setIsLoading(false);
      setCollaboratorsList(prevList => {
        const newList = prevList ? _objectSpread({}, prevList) : {
          collaborators: []
        };
        const newCollab = convertCollab({
          collab: response,
          ownerEmail,
          isCurrentUserOwner: currentUserID === ownerID
        });
        if (newCollab) {
          newList.collaborators.push(newCollab);
        }
        return newList;
      });
      closeComponent();
    },
    handleError: () => {
      createNotification(TYPE_ERROR, contentSharingMessages.sendInvitesError);
      setIsLoading(false);
      closeComponent();
    },
    setIsLoading,
    transformRequest: data => convertCollabsRequest(data, collaboratorsList)
  });
  if (sendInvitesFn && !sendInvites) {
    setSendInvites(() => sendInvitesFn);
  }
  return /*#__PURE__*/React.createElement(NotificationsWrapper, null, /*#__PURE__*/React.createElement(React.Fragment, null, [...Object.values(notifications)]));
}
export default SharingNotification;
//# sourceMappingURL=SharingNotification.js.map