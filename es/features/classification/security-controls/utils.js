function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import getProp from 'lodash/get';
import isNil from 'lodash/isNil';
import appRestrictionsMessageMap from './appRestrictionsMessageMap';
import integrationRestrictionsMessageMap from './integrationRestrictionsMessageMap';
import downloadRestrictionsMessageMap from './downloadRestrictionsMessageMap';
import messages from './messages';
import { ACCESS_POLICY_RESTRICTION, APP_RESTRICTION_MESSAGE_TYPE, DOWNLOAD_CONTROL, LIST_ACCESS_LEVEL, SHARED_LINK_ACCESS_LEVEL } from '../constants';
const {
  APP,
  BOX_SIGN_REQUEST,
  DOWNLOAD,
  EXTERNAL_COLLAB,
  SHARED_LINK,
  WATERMARK
} = ACCESS_POLICY_RESTRICTION;
const {
  DEFAULT,
  WITH_APP_LIST,
  WITH_OVERFLOWN_APP_LIST
} = APP_RESTRICTION_MESSAGE_TYPE;
const {
  DESKTOP,
  MOBILE,
  WEB
} = DOWNLOAD_CONTROL;
const {
  BLOCK,
  WHITELIST,
  BLACKLIST
} = LIST_ACCESS_LEVEL;
const {
  COLLAB_ONLY,
  COLLAB_AND_COMPANY_ONLY,
  PUBLIC
} = SHARED_LINK_ACCESS_LEVEL;
const getShortSecurityControlsMessage = (controls, shouldDisplayAppsAsIntegrations) => {
  const items = [];
  const {
    app,
    boxSignRequest,
    download,
    externalCollab,
    sharedLink,
    watermark
  } = controls;

  // Shared link and external collab restrictions are grouped
  // together as generic "sharing" restrictions
  const sharing = sharedLink && sharedLink.accessLevel !== PUBLIC || externalCollab;

  // 4 restriction combinations
  if (sharing && download && app && boxSignRequest) {
    items.push({
      message: shouldDisplayAppsAsIntegrations ? messages.shortSharingDownloadIntegrationSign : messages.shortSharingDownloadAppSign
    });
  }
  // 3 restriction combinations
  else if (sharing && download && app) {
    items.push({
      message: shouldDisplayAppsAsIntegrations ? messages.shortSharingDownloadIntegration : messages.shortSharingDownloadApp
    });
  } else if (download && app && boxSignRequest) {
    items.push({
      message: shouldDisplayAppsAsIntegrations ? messages.shortDownloadIntegrationSign : messages.shortDownloadAppSign
    });
  } else if (sharing && app && boxSignRequest) {
    items.push({
      message: shouldDisplayAppsAsIntegrations ? messages.shortSharingIntegrationSign : messages.shortSharingAppSign
    });
  } else if (sharing && download && boxSignRequest) {
    items.push({
      message: messages.shortSharingDownloadSign
    });
  }
  // 2 restriction combinations
  else if (sharing && boxSignRequest) {
    items.push({
      message: messages.shortSharingSign
    });
  } else if (download && boxSignRequest) {
    items.push({
      message: messages.shortDownloadSign
    });
  } else if (app && boxSignRequest) {
    items.push({
      message: shouldDisplayAppsAsIntegrations ? messages.shortIntegrationSign : messages.shortAppSign
    });
  } else if (sharing && download) {
    items.push({
      message: messages.shortSharingDownload
    });
  } else if (sharing && app) {
    items.push({
      message: shouldDisplayAppsAsIntegrations ? messages.shortSharingIntegration : messages.shortSharingApp
    });
  } else if (download && app) {
    items.push({
      message: shouldDisplayAppsAsIntegrations ? messages.shortDownloadIntegration : messages.shortDownloadApp
    });
  }
  // 1 restriction combinations
  else if (boxSignRequest) {
    items.push({
      message: messages.shortSign
    });
  } else if (sharing) {
    items.push({
      message: messages.shortSharing
    });
  } else if (download) {
    items.push({
      message: messages.shortDownload
    });
  } else if (app) {
    items.push({
      message: shouldDisplayAppsAsIntegrations ? messages.shortIntegration : messages.shortApp
    });
  }
  if (watermark) {
    items.push({
      message: messages.shortWatermarking
    });
  }
  return items;
};
const getSharedLinkMessages = controls => {
  const items = [];
  const accessLevel = getProp(controls, `${SHARED_LINK}.accessLevel`);
  switch (accessLevel) {
    case COLLAB_ONLY:
      items.push({
        message: messages.sharingCollabOnly
      });
      break;
    case COLLAB_AND_COMPANY_ONLY:
      items.push({
        message: messages.sharingCollabAndCompanyOnly
      });
      break;
    default:
      // no-op
      break;
  }
  return items;
};
const getWatermarkingMessages = controls => {
  const items = [];
  const isWatermarkEnabled = getProp(controls, `${WATERMARK}.enabled`, false);
  if (isWatermarkEnabled) {
    items.push({
      message: messages.watermarkingApplied
    });
  }
  return items;
};
const getExternalCollabMessages = controls => {
  const items = [];
  const accessLevel = getProp(controls, `${EXTERNAL_COLLAB}.accessLevel`);
  switch (accessLevel) {
    case BLOCK:
      items.push({
        message: messages.externalCollabBlock
      });
      break;
    case WHITELIST:
    case BLACKLIST:
      items.push({
        message: messages.externalCollabDomainList
      });
      break;
    default:
      // no-op
      break;
  }
  return items;
};
const getAppDownloadMessages = (controls, maxAppCount, shouldDisplayAppsAsIntegrations) => {
  const items = [];
  const accessLevel = getProp(controls, `${APP}.accessLevel`);
  switch (accessLevel) {
    case BLOCK:
      items.push({
        message: shouldDisplayAppsAsIntegrations ? messages.integrationDownloadRestricted : messages.appDownloadRestricted
      });
      break;
    case WHITELIST:
    case BLACKLIST:
      {
        const apps = getProp(controls, `${APP}.apps`, []);
        maxAppCount = isNil(maxAppCount) ? apps.length : maxAppCount;
        const appsToDisplay = apps.slice(0, maxAppCount);
        const remainingAppCount = apps.slice(maxAppCount).length;
        const appNames = appsToDisplay.map(({
          displayText
        }) => displayText).join(', ');
        if (remainingAppCount) {
          const appsList = apps.map(({
            displayText
          }) => displayText).join(', ');
          items.push({
            message: _objectSpread(_objectSpread({}, shouldDisplayAppsAsIntegrations ? integrationRestrictionsMessageMap[accessLevel][WITH_OVERFLOWN_APP_LIST] : appRestrictionsMessageMap[accessLevel][WITH_OVERFLOWN_APP_LIST]), {}, {
              values: {
                appNames,
                remainingAppCount
              }
            }),
            tooltipMessage: _objectSpread(_objectSpread({}, shouldDisplayAppsAsIntegrations ? messages.allIntegrationNames : messages.allAppNames), {}, {
              values: {
                appsList
              }
            })
          });
        } else {
          // Display list of apps if available, otherwise use generic
          // app restriction copy
          const messageType = apps.length ? WITH_APP_LIST : DEFAULT;
          items.push({
            message: _objectSpread(_objectSpread({}, shouldDisplayAppsAsIntegrations ? integrationRestrictionsMessageMap[accessLevel][messageType] : appRestrictionsMessageMap[accessLevel][messageType]), {}, {
              values: {
                appNames
              }
            })
          });
        }
        break;
      }
    default:
      // no-op
      break;
  }
  return items;
};
const getDownloadMessages = controls => {
  const items = [];
  const {
    web,
    mobile,
    desktop
  } = getProp(controls, DOWNLOAD, {});
  const downloadRestrictions = {
    [WEB]: {
      platform: WEB,
      restrictions: web
    },
    [MOBILE]: {
      platform: MOBILE,
      restrictions: mobile
    },
    [DESKTOP]: {
      platform: DESKTOP,
      restrictions: desktop
    }
  };
  Object.keys(downloadRestrictions).forEach(platformKey => {
    const {
      platform,
      restrictions
    } = downloadRestrictions[platformKey];
    if (!restrictions) {
      return;
    }
    const {
      restrictExternalUsers,
      restrictManagedUsers
    } = restrictions;
    if (restrictManagedUsers && restrictExternalUsers) {
      items.push({
        message: downloadRestrictionsMessageMap[platform].externalRestricted[restrictManagedUsers]
      });
    } else if (restrictManagedUsers) {
      items.push({
        message: downloadRestrictionsMessageMap[platform].externalAllowed[restrictManagedUsers]
      });
    } else if (restrictExternalUsers) {
      items.push({
        message: downloadRestrictionsMessageMap[platform].externalRestricted.default
      });
    }
  });
  return items;
};
const getBoxSignRequestMessages = controls => {
  const isBoxSignRequestRestrictionEnabled = getProp(controls, `${BOX_SIGN_REQUEST}.enabled`, false);
  const items = isBoxSignRequestRestrictionEnabled ? [{
    message: messages.boxSignRequestRestricted
  }] : [];
  return items;
};
const getFullSecurityControlsMessages = (controls, maxAppCount, shouldDisplayAppsAsIntegrations) => {
  const items = [...getSharedLinkMessages(controls), ...getExternalCollabMessages(controls), ...getDownloadMessages(controls), ...getAppDownloadMessages(controls, maxAppCount, shouldDisplayAppsAsIntegrations), ...getWatermarkingMessages(controls), ...getBoxSignRequestMessages(controls)];
  return items;
};
export { getShortSecurityControlsMessage, getFullSecurityControlsMessages };
//# sourceMappingURL=utils.js.map