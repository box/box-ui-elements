function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { getTypedFileId, getTypedFolderId } from '../../../utils/file';
import { checkIsExternalUser } from '../../../utils/parseEmails';
import { ACCESS_COLLAB, ACCESS_COMPANY, ACCESS_NONE, ACCESS_OPEN, INVITEE_ROLE_EDITOR, PERMISSION_CAN_DOWNLOAD, PERMISSION_CAN_PREVIEW, STATUS_ACCEPTED, STATUS_INACTIVE, TYPE_FOLDER } from '../../../constants';
import { ALLOWED_ACCESS_LEVELS, ANYONE_IN_COMPANY, ANYONE_WITH_LINK, CAN_VIEW_DOWNLOAD, CAN_VIEW_ONLY, COLLAB_GROUP_TYPE, COLLAB_USER_TYPE, DISABLED_REASON_ACCESS_POLICY, DISABLED_REASON_MALICIOUS_CONTENT, PEOPLE_IN_ITEM } from '../constants';
import { bdlDarkBlue50, bdlGray20, bdlGreenLight50, bdlLightBlue50, bdlOrange50, bdlPurpleRain50, bdlWatermelonRed50, bdlYellow50 } from '../../../styles/variables';
import { CLASSIFICATION_COLOR_ID_0, CLASSIFICATION_COLOR_ID_1, CLASSIFICATION_COLOR_ID_2, CLASSIFICATION_COLOR_ID_3, CLASSIFICATION_COLOR_ID_4, CLASSIFICATION_COLOR_ID_5, CLASSIFICATION_COLOR_ID_6, CLASSIFICATION_COLOR_ID_7 } from '../../classification/constants';
/**
 * The following constants are used for converting API requests
 * and responses into objects expected by the USM, and vice versa
 */
export const API_TO_USM_ACCESS_LEVEL_MAP = {
  [ACCESS_COLLAB]: PEOPLE_IN_ITEM,
  [ACCESS_COMPANY]: ANYONE_IN_COMPANY,
  [ACCESS_OPEN]: ANYONE_WITH_LINK,
  [ACCESS_NONE]: ''
};
export const API_TO_USM_PERMISSION_LEVEL_MAP = {
  [PERMISSION_CAN_DOWNLOAD]: CAN_VIEW_DOWNLOAD,
  [PERMISSION_CAN_PREVIEW]: CAN_VIEW_ONLY
};
export const USM_TO_API_ACCESS_LEVEL_MAP = {
  [ANYONE_IN_COMPANY]: ACCESS_COMPANY,
  [ANYONE_WITH_LINK]: ACCESS_OPEN,
  [PEOPLE_IN_ITEM]: ACCESS_COLLAB
};
export const USM_TO_API_PERMISSION_LEVEL_MAP = {
  [CAN_VIEW_DOWNLOAD]: PERMISSION_CAN_DOWNLOAD,
  [CAN_VIEW_ONLY]: PERMISSION_CAN_PREVIEW
};
const API_TO_USM_CLASSIFICATION_COLORS_MAP = {
  [bdlYellow50]: CLASSIFICATION_COLOR_ID_0,
  [bdlOrange50]: CLASSIFICATION_COLOR_ID_1,
  [bdlWatermelonRed50]: CLASSIFICATION_COLOR_ID_2,
  [bdlPurpleRain50]: CLASSIFICATION_COLOR_ID_3,
  [bdlLightBlue50]: CLASSIFICATION_COLOR_ID_4,
  [bdlDarkBlue50]: CLASSIFICATION_COLOR_ID_5,
  [bdlGreenLight50]: CLASSIFICATION_COLOR_ID_6,
  [bdlGray20]: CLASSIFICATION_COLOR_ID_7
};
const APP_USERS_DOMAIN_REGEXP = /boxdevedition.com/;

/**
 * Convert access levels disabled reasons into USM format.
 *
 * @param {{ [string]: string }} disabledReasons
 * @returns {accessLevelsDisabledReasonType | null}
 */
export const convertAccessLevelsDisabledReasons = disabledReasons => {
  if (!disabledReasons) return null;
  const convertedReasons = {};
  Object.entries(disabledReasons).forEach(([level, reason]) => {
    convertedReasons[API_TO_USM_ACCESS_LEVEL_MAP[level]] = reason;
  });
  return convertedReasons;
};

/**
 * Convert allowed access levels into USM format.
 *
 * @param {Array<string>} [levelsFromAPI]
 * @returns {allowedAccessLevelsType | null}
 */
export const convertAllowedAccessLevels = levelsFromAPI => {
  if (!levelsFromAPI) return null;
  const convertedLevels = {
    peopleInThisItem: false,
    peopleInYourCompany: false,
    peopleWithTheLink: false
  };
  levelsFromAPI.forEach(level => {
    convertedLevels[API_TO_USM_ACCESS_LEVEL_MAP[level]] = true;
  });
  return convertedLevels;
};

/**
 * Convert a response from the Item API to the object that the USM expects.
 *
 * @param {BoxItem} itemAPIData
 * @returns {ContentSharingItemDataType} Object containing item and shared link information
 */

export const convertItemResponse = itemAPIData => {
  const {
    allowed_invitee_roles,
    allowed_shared_link_access_levels,
    allowed_shared_link_access_levels_disabled_reasons,
    classification,
    id,
    description,
    extension,
    name,
    owned_by: {
      id: ownerID,
      login: ownerEmail
    },
    permissions,
    shared_link,
    shared_link_features: {
      download_url: isDirectLinkAvailable,
      password: isPasswordAvailable
    },
    type
  } = itemAPIData;
  const {
    can_download: isDownloadSettingAvailable,
    can_invite_collaborator: canInvite,
    can_preview: isPreviewAllowed,
    can_set_share_access: canChangeAccessLevel,
    can_share: itemShare
  } = permissions;

  // Convert classification data for the item if available
  let classificationData = {};
  if (classification) {
    const {
      color,
      definition,
      name: classificationName
    } = classification;
    classificationData = {
      bannerPolicy: {
        body: definition,
        colorID: API_TO_USM_CLASSIFICATION_COLORS_MAP[color]
      },
      classification: classificationName
    };
  }
  const isEditAllowed = allowed_invitee_roles.indexOf(INVITEE_ROLE_EDITOR) !== -1;

  // The "canInvite" property is necessary even if the item does not have a shared link,
  // because it allows users to invite individual collaborators.
  let sharedLink = {
    canInvite: !!canInvite
  };
  if (shared_link) {
    const {
      download_url: directLink,
      effective_access,
      effective_permission,
      is_password_enabled: isPasswordEnabled,
      password,
      unshared_at: expirationTimestamp,
      url,
      vanity_name: vanityName
    } = shared_link;
    const accessLevel = effective_access ? API_TO_USM_ACCESS_LEVEL_MAP[effective_access] : '';
    const permissionLevel = effective_permission ? API_TO_USM_PERMISSION_LEVEL_MAP[effective_permission] : null;
    const isDownloadAllowed = permissionLevel === API_TO_USM_PERMISSION_LEVEL_MAP.can_download;
    const canChangeDownload = canChangeAccessLevel && isDownloadSettingAvailable && effective_access !== ACCESS_COLLAB; // access must be "company" or "open"
    const canChangePassword = canChangeAccessLevel && isPasswordAvailable;
    const canChangeExpiration = canChangeAccessLevel && isEditAllowed;
    sharedLink = {
      accessLevel,
      accessLevelsDisabledReason: convertAccessLevelsDisabledReasons(allowed_shared_link_access_levels_disabled_reasons) || {},
      allowedAccessLevels: convertAllowedAccessLevels(allowed_shared_link_access_levels) || ALLOWED_ACCESS_LEVELS,
      // show all access levels by default
      canChangeAccessLevel,
      canChangeDownload,
      canChangeExpiration,
      canChangePassword,
      canChangeVanityName: false,
      // vanity URLs cannot be set via the API
      canInvite: !!canInvite,
      directLink,
      expirationTimestamp: expirationTimestamp ? new Date(expirationTimestamp).getTime() : null,
      // convert to milliseconds
      isDirectLinkAvailable,
      isDownloadAllowed,
      isDownloadAvailable: isDownloadSettingAvailable,
      isDownloadEnabled: isDownloadAllowed,
      isDownloadSettingAvailable,
      isEditAllowed,
      isNewSharedLink: false,
      isPasswordAvailable,
      isPasswordEnabled,
      isPreviewAllowed,
      password,
      permissionLevel,
      url,
      vanityName: vanityName || ''
    };
  }
  return {
    item: _objectSpread({
      canUserSeeClassification: !!classification,
      description,
      extension,
      grantedPermissions: {
        itemShare: !!itemShare
      },
      hideCollaborators: false,
      // to do: connect to Collaborations API
      id,
      name,
      ownerEmail,
      // the owner email is used to determine whether collaborators are external
      ownerID,
      // the owner ID is used to determine whether external collaborator badges should be shown
      permissions,
      // the original permissions are necessary for PUT requests to the Item API
      type,
      typedID: type === TYPE_FOLDER ? getTypedFolderId(id) : getTypedFileId(id)
    }, classificationData),
    sharedLink
  };
};

/**
 * Convert a response from the User API into the object that the USM expects.
 *
 * @param {User} userAPIData
 * @returns {ContentSharingUserDataType} Object containing user and enterprise information
 */
export const convertUserResponse = userAPIData => {
  const {
    enterprise,
    hostname,
    id
  } = userAPIData;
  return {
    id,
    userEnterpriseData: {
      enterpriseName: enterprise ? enterprise.name : '',
      serverURL: hostname ? `${hostname}v/` : ''
    }
  };
};

/**
 * Create a shared link permissions object for the API based on a USM permission level.
 *
 * @param {string} newSharedLinkPermissionLevel
 * @returns {$Shape<BoxItemPermission>} Object containing shared link permissions
 */
export const convertSharedLinkPermissions = newSharedLinkPermissionLevel => {
  const sharedLinkPermissions = {};
  Object.keys(USM_TO_API_PERMISSION_LEVEL_MAP).forEach(level => {
    if (level === newSharedLinkPermissionLevel) {
      sharedLinkPermissions[USM_TO_API_PERMISSION_LEVEL_MAP[level]] = true;
    } else {
      sharedLinkPermissions[USM_TO_API_PERMISSION_LEVEL_MAP[level]] = false;
    }
  });
  return sharedLinkPermissions;
};

/**
 * Convert a shared link settings object from the USM into the format that the API expects.
 * This function compares the provided access level to both API and internal USM access level constants, to accommodate two potential flows:
 * - Changing the settings for a shared link right after the shared link has been created. The access level is saved directly from the data
 *   returned by the API, so it is in API format.
 * - Changing the settings for a shared link in any other scenario. The access level is saved from the initial calls to the Item API and
 *   convertItemResponse, so it is in internal USM format.
 *
 * @param {SharedLinkSettingsOptions} newSettings
 * @param {accessLevel} string
 * @param {serverURL} string
 * @returns {$Shape<SharedLink>}
 */
export const convertSharedLinkSettings = (newSettings, accessLevel, isDownloadAvailable, serverURL) => {
  const {
    expirationTimestamp,
    isDownloadEnabled: can_download,
    isExpirationEnabled,
    isPasswordEnabled,
    password,
    vanityName
  } = newSettings;
  const convertedSettings = {
    unshared_at: expirationTimestamp && isExpirationEnabled ? new Date(expirationTimestamp).toISOString() : null,
    vanity_url: serverURL && vanityName ? `${serverURL}${vanityName}` : ''
  };

  // Download permissions can only be set on "company" or "open" shared links.
  if (![ACCESS_COLLAB, PEOPLE_IN_ITEM].includes(accessLevel)) {
    const permissions = {
      can_preview: !can_download
    };
    if (isDownloadAvailable) {
      permissions.can_download = can_download;
    }
    convertedSettings.permissions = permissions;
  }

  /**
   * This block covers the following cases:
   * - Setting a new password: "isPasswordEnabled" is true, and "password" is a non-empty string.
   * - Removing a password: "isPasswordEnabled" is false, and "password" is an empty string.
   *   The API only accepts non-empty strings and null values, so the empty string must be converted to null.
   *
   * Other notes:
   * - Passwords can only be set on "open" shared links.
   * - Attempting to set the password field on any other type of shared link will throw a 400 error.
   * - When other settings are updated, and a password has already been set, the SharedLinkSettingsModal
   *   returns password = '' and isPasswordEnabled = true. In these cases, the password should *not*
   *   be converted to null, because that would remove the existing password.
   */
  if ([ANYONE_WITH_LINK, ACCESS_OPEN].includes(accessLevel)) {
    if (isPasswordEnabled && !!password) {
      convertedSettings.password = password;
    } else if (!isPasswordEnabled) {
      convertedSettings.password = null;
    }
  }
  return convertedSettings;
};

/**
 * Convert a collaborator.
 * Note: We do not retrieve the avatar URL of collaborators right after inviting them,
 * so the avatar fields (hasCustomAvatar and imageURL) are not set in that case.
 *
 * @param {ConvertCollabOptions} options
 * @returns {collaboratorType | null} Object containing a collaborator
 */
export const convertCollab = ({
  collab,
  avatarURLMap,
  ownerEmail,
  isCurrentUserOwner = false
}) => {
  if (!collab || collab.status !== STATUS_ACCEPTED) return null;
  const ownerEmailDomain = ownerEmail && /@/.test(ownerEmail) ? ownerEmail.split('@')[1] : null;
  const {
    accessible_by: {
      id: userID,
      login: email,
      name,
      type
    },
    id: collabID,
    expires_at: executeAt,
    role
  } = collab;
  const avatarURL = avatarURLMap ? avatarURLMap[userID] : undefined;
  const convertedCollab = {
    collabID: parseInt(collabID, 10),
    email,
    hasCustomAvatar: !!avatarURL,
    imageURL: avatarURL,
    isExternalCollab: checkIsExternalUser(isCurrentUserOwner, ownerEmailDomain, email),
    name,
    translatedRole: `${role[0].toUpperCase()}${role.slice(1)}`,
    // capitalize the user's role
    type,
    userID: parseInt(userID, 10)
  };
  if (executeAt) {
    convertedCollab.expiration = {
      executeAt
    };
  }
  return convertedCollab;
};

/**
 * Convert a response from the Item Collaborations API into the object that the USM expects.
 *
 * @param {Collaborations} collabsAPIData
 * @param {AvatarURLMap | null} avatarURLMap
 * @param {string | null | undefined} ownerEmail
 * @param {boolean} isCurrentUserOwner
 * @returns {collaboratorsListType} Object containing an array of collaborators
 */
export const convertCollabsResponse = (collabsAPIData, avatarURLMap, ownerEmail, isCurrentUserOwner) => {
  const {
    entries = []
  } = collabsAPIData;
  if (!entries.length) return {
    collaborators: []
  };
  const collaborators = [];
  entries
  // Only show accepted collaborations
  .filter(collab => collab.status === STATUS_ACCEPTED).forEach(collab => {
    const convertedCollab = convertCollab({
      collab,
      avatarURLMap,
      ownerEmail,
      isCurrentUserOwner
    });
    if (convertedCollab) {
      // Necessary for Flow checking
      collaborators.push(convertedCollab);
    }
  });
  return {
    collaborators
  };
};

/**
 * Convert a request from the USM (specifically the Invite Collaborators Modal) into the format expected by the Collaborations API.
 * ContentSharing/USM will only call this function when at least one properly-formatted email is entered into the "Invite People" field.
 * Within the context of this feature, groups are identified by IDs, whereas users are identified by their emails.
 *
 * @param {InviteCollaboratorsRequest} collabRequest
 * @returns {ContentSharingCollaborationsRequest}
 */
export const convertCollabsRequest = (collabRequest, existingCollaboratorsList) => {
  const {
    emails,
    groupIDs,
    permission
  } = collabRequest;
  const emailArray = emails ? emails.split(',') : [];
  const groupIDArray = groupIDs ? groupIDs.split(',') : [];
  const collabSet = new Set();
  if (existingCollaboratorsList) {
    existingCollaboratorsList.collaborators.forEach(collab => {
      if (collab.type === COLLAB_USER_TYPE && !!collab.email) {
        collabSet.add(collab.email);
      } else if (collab.type === COLLAB_GROUP_TYPE && !!collab.userID) {
        collabSet.add(collab.userID.toString());
      }
    });
  }
  const roleSettings = {
    role: permission.toLowerCase() // USM permissions are identical to API roles, except for the casing
  };
  const groups = groupIDArray.filter(groupID => !collabSet.has(groupID)).map(groupID => _objectSpread({
    accessible_by: {
      id: groupID,
      type: COLLAB_GROUP_TYPE
    }
  }, roleSettings));
  const users = emailArray.filter(email => !collabSet.has(email)).map(email => _objectSpread({
    accessible_by: {
      login: email,
      type: COLLAB_USER_TYPE
    }
  }, roleSettings));
  return {
    groups,
    users
  };
};
const sortByName = ({
  name: nameA = ''
}, {
  name: nameB = ''
}) => nameA.localeCompare(nameB);

/**
 * Convert an enterprise users API response into an array of internal USM contacts.
 *
 * @param {UserCollection} contactsAPIData
 * @param {string|null} currentUserID
 * @returns {Array<contactType>} Array of USM contacts
 */
export const convertUserContactsResponse = (contactsAPIData, currentUserID) => {
  const {
    entries = []
  } = contactsAPIData;

  // Return all active users except for the current user and app users
  return entries.filter(({
    id,
    login: email,
    status
  }) => id !== currentUserID && email && !APP_USERS_DOMAIN_REGEXP.test(email) && status && status !== STATUS_INACTIVE).map(contact => {
    const {
      id,
      login: email,
      name,
      type
    } = contact;
    return {
      id,
      email,
      name,
      type
    };
  }).sort(sortByName);
};

/**
 * Convert an enterprise users API response into an object of internal USM contacts, keyed by email, which is
 * then passed to the mergeContacts function.
 *
 * @param {UserCollection} contactsAPIData
 * @returns { [string]: contactType } Object of USM contacts
 */
export const convertUserContactsByEmailResponse = contactsAPIData => {
  const {
    entries = []
  } = contactsAPIData;
  const contactsMap = {};
  entries.forEach(contact => {
    const {
      id,
      login: email = '',
      name,
      type
    } = contact;
    contactsMap[email] = {
      id,
      email,
      name,
      type
    };
  });
  return contactsMap;
};

/**
 * Convert an enterprise groups API response into an array of internal USM contacts.
 *
 * @param {GroupCollection} contactsAPIData
 * @returns {Array<contactType>} Array of USM contacts
 */
export const convertGroupContactsResponse = contactsAPIData => {
  const {
    entries = []
  } = contactsAPIData;

  // Only return groups with the correct permissions
  return entries.filter(({
    permissions
  }) => {
    return permissions && permissions.can_invite_as_collaborator;
  }).map(contact => {
    const {
      id,
      name,
      type
    } = contact;
    return {
      id,
      name,
      type
    };
  }).sort(sortByName);
};
//# sourceMappingURL=convertData.js.map