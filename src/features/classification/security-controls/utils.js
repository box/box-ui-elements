// @flow
import getProp from 'lodash/get';
import isNil from 'lodash/isNil';

import type { Controls, MessageItem } from '../flowTypes';

import appRestrictionsMessageMap from './appRestrictionsMessageMap';
import appPreviewRestrictionsMessageMap from './appPreviewRestrictionsMessageMap';
import integrationRestrictionsMessageMap from './integrationRestrictionsMessageMap';
import integrationPreviewRestrictionsMessageMap from './integrationPreviewRestrictionsMessageMap';
import downloadRestrictionsMessageMap from './downloadRestrictionsMessageMap';
import messages from './messages';
import {
    ACCESS_POLICY_RESTRICTION,
    APP_RESTRICTION_MESSAGE_TYPE,
    DOWNLOAD_CONTROL,
    LIST_ACCESS_LEVEL,
    PREVIEW_ACCESS_LEVEL,
    SHARED_LINK_ACCESS_LEVEL,
} from '../constants';

const {
    APP,
    APP_PREVIEW,
    BOX_SIGN_REQUEST,
    DOWNLOAD,
    EXTERNAL_COLLAB,
    SHARED_LINK,
    WATERMARK,
    SHARED_LINK_AUTO_EXPIRATION,
} = ACCESS_POLICY_RESTRICTION;
const { DEFAULT, WITH_APP_LIST, WITH_OVERFLOWN_APP_LIST } = APP_RESTRICTION_MESSAGE_TYPE;
const { DESKTOP, MOBILE, WEB } = DOWNLOAD_CONTROL;
const { BLOCK, WHITELIST, BLACKLIST } = LIST_ACCESS_LEVEL;
const { WHITELIST: PREVIEW_WHITELIST, BLACKLIST: PREVIEW_BLACKLIST } = PREVIEW_ACCESS_LEVEL;
const { COLLAB_ONLY, COLLAB_AND_COMPANY_ONLY, PUBLIC } = SHARED_LINK_ACCESS_LEVEL;

const getAppListMessageItem = (apps, maxAppCount, accessLevel, restrictionsMessageMap, tooltipMessage): MessageItem => {
    const displayableApps = apps.filter(({ displayText }) => displayText);
    const effectiveMaxAppCount = isNil(maxAppCount) ? displayableApps.length : maxAppCount;
    const appsToDisplay = displayableApps.slice(0, effectiveMaxAppCount);
    const remainingAppCount = Math.max(0, displayableApps.length - effectiveMaxAppCount);
    const appNames = appsToDisplay.map(({ displayText }) => displayText).join(', ');

    if (remainingAppCount) {
        const appsList = displayableApps.map(({ displayText }) => displayText).join(', ');

        return {
            message: {
                ...restrictionsMessageMap[accessLevel][WITH_OVERFLOWN_APP_LIST],
                values: { appNames, remainingAppCount },
            },
            tooltipMessage: {
                ...tooltipMessage,
                values: { appsList },
            },
        };
    }

    const messageType = displayableApps.length ? WITH_APP_LIST : DEFAULT;

    return {
        message: {
            ...restrictionsMessageMap[accessLevel][messageType],
            values: { appNames },
        },
    };
};

const getShortSecurityControlsMessage = (
    controls: Controls,
    shouldDisplayAppsAsIntegrations?: boolean,
): Array<MessageItem> => {
    const items = [];
    const {
        app,
        appPreview,
        boxSignRequest,
        download,
        externalCollab,
        sharedLink,
        watermark,
        sharedLinkAutoExpiration,
    } = controls;
    const appRestriction = app || appPreview;

    // Shared link and external collab restrictions are grouped
    // together as generic "sharing" restrictions
    const sharing = (sharedLink && sharedLink.accessLevel !== PUBLIC) || externalCollab;

    // 5 restriction combinations
    if (sharedLinkAutoExpiration && sharing && download && appRestriction && boxSignRequest) {
        items.push({
            message: shouldDisplayAppsAsIntegrations
                ? messages.shortSharingDownloadIntegrationSignSharedLinkAutoExpiration
                : messages.shortSharingDownloadAppSignSharedLinkAutoExpiration,
        });
    }
    // 4 restriction combinations
    else if (sharedLinkAutoExpiration && sharing && download && appRestriction) {
        items.push({
            message: shouldDisplayAppsAsIntegrations
                ? messages.shortSharingDownloadIntegrationSharedLinkAutoExpiration
                : messages.shortSharingDownloadAppSharedLinkAutoExpiration,
        });
    } else if (sharedLinkAutoExpiration && sharing && download && boxSignRequest) {
        items.push({ message: messages.shortSharingDownloadSignSharedLinkAutoExpiration });
    } else if (sharedLinkAutoExpiration && sharing && appRestriction && boxSignRequest) {
        items.push({
            message: shouldDisplayAppsAsIntegrations
                ? messages.shortSharingIntegrationSignSharedLinkAutoExpiration
                : messages.shortSharingAppSignSharedLinkAutoExpiration,
        });
    } else if (sharedLinkAutoExpiration && download && appRestriction && boxSignRequest) {
        items.push({
            message: shouldDisplayAppsAsIntegrations
                ? messages.shortDownloadIntegrationSignSharedLinkAutoExpiration
                : messages.shortDownloadAppSignSharedLinkAutoExpiration,
        });
    } else if (sharing && download && appRestriction && boxSignRequest) {
        items.push({
            message: shouldDisplayAppsAsIntegrations
                ? messages.shortSharingDownloadIntegrationSign
                : messages.shortSharingDownloadAppSign,
        });
    }
    // 3 restriction combinations
    else if (sharedLinkAutoExpiration && sharing && download) {
        items.push({ message: messages.shortSharingDownloadSharedLinkAutoExpiration });
    } else if (sharedLinkAutoExpiration && sharing && appRestriction) {
        items.push({
            message: shouldDisplayAppsAsIntegrations
                ? messages.shortSharingIntegrationSharedLinkAutoExpiration
                : messages.shortSharingAppSharedLinkAutoExpiration,
        });
    } else if (sharedLinkAutoExpiration && sharing && boxSignRequest) {
        items.push({ message: messages.shortSharingSignSharedLinkAutoExpiration });
    } else if (sharedLinkAutoExpiration && download && appRestriction) {
        items.push({
            message: shouldDisplayAppsAsIntegrations
                ? messages.shortDownloadIntegrationSharedLinkAutoExpiration
                : messages.shortDownloadAppSharedLinkAutoExpiration,
        });
    } else if (sharedLinkAutoExpiration && download && boxSignRequest) {
        items.push({ message: messages.shortDownloadSignSharedLinkAutoExpiration });
    } else if (sharedLinkAutoExpiration && appRestriction && boxSignRequest) {
        items.push({
            message: shouldDisplayAppsAsIntegrations
                ? messages.shortIntegrationSignSharedLinkAutoExpiration
                : messages.shortAppSignSharedLinkAutoExpiration,
        });
    } else if (sharing && download && appRestriction) {
        items.push({
            message: shouldDisplayAppsAsIntegrations
                ? messages.shortSharingDownloadIntegration
                : messages.shortSharingDownloadApp,
        });
    } else if (download && appRestriction && boxSignRequest) {
        items.push({
            message: shouldDisplayAppsAsIntegrations
                ? messages.shortDownloadIntegrationSign
                : messages.shortDownloadAppSign,
        });
    } else if (sharing && appRestriction && boxSignRequest) {
        items.push({
            message: shouldDisplayAppsAsIntegrations
                ? messages.shortSharingIntegrationSign
                : messages.shortSharingAppSign,
        });
    } else if (sharing && download && boxSignRequest) {
        items.push({ message: messages.shortSharingDownloadSign });
    }
    // 2 restriction combinations
    else if (sharedLinkAutoExpiration && sharing) {
        items.push({ message: messages.shortSharingSharedLinkAutoExpiration });
    } else if (sharedLinkAutoExpiration && download) {
        items.push({ message: messages.shortDownloadSharedLinkAutoExpiration });
    } else if (sharedLinkAutoExpiration && appRestriction) {
        items.push({
            message: shouldDisplayAppsAsIntegrations
                ? messages.shortIntegrationSharedLinkAutoExpiration
                : messages.shortAppSharedLinkAutoExpiration,
        });
    } else if (sharedLinkAutoExpiration && boxSignRequest) {
        items.push({ message: messages.shortSignSharedLinkAutoExpiration });
    } else if (sharing && boxSignRequest) {
        items.push({ message: messages.shortSharingSign });
    } else if (download && boxSignRequest) {
        items.push({ message: messages.shortDownloadSign });
    } else if (appRestriction && boxSignRequest) {
        items.push({
            message: shouldDisplayAppsAsIntegrations ? messages.shortIntegrationSign : messages.shortAppSign,
        });
    } else if (sharing && download) {
        items.push({ message: messages.shortSharingDownload });
    } else if (sharing && appRestriction) {
        items.push({
            message: shouldDisplayAppsAsIntegrations ? messages.shortSharingIntegration : messages.shortSharingApp,
        });
    } else if (download && appRestriction) {
        items.push({
            message: shouldDisplayAppsAsIntegrations ? messages.shortDownloadIntegration : messages.shortDownloadApp,
        });
    }

    // 1 restriction combinations
    else if (boxSignRequest) {
        items.push({ message: messages.shortSign });
    } else if (sharing) {
        items.push({ message: messages.shortSharing });
    } else if (download) {
        items.push({ message: messages.shortDownload });
    } else if (appRestriction) {
        items.push({ message: shouldDisplayAppsAsIntegrations ? messages.shortIntegration : messages.shortApp });
    } else if (sharedLinkAutoExpiration) {
        items.push({ message: messages.shortSharedLinkAutoExpiration });
    }

    if (watermark) {
        items.push({ message: messages.shortWatermarking });
    }

    return items;
};

const getSharedLinkMessages = (controls: Controls): Array<MessageItem> => {
    const items = [];
    const accessLevel = getProp(controls, `${SHARED_LINK}.accessLevel`);

    switch (accessLevel) {
        case COLLAB_ONLY:
            items.push({ message: messages.sharingCollabOnly });
            break;
        case COLLAB_AND_COMPANY_ONLY:
            items.push({ message: messages.sharingCollabAndCompanyOnly });
            break;
        default:
            // no-op
            break;
    }
    return items;
};

const getWatermarkingMessages = (controls: Controls): Array<MessageItem> => {
    const items = [];
    const isWatermarkEnabled = getProp(controls, `${WATERMARK}.enabled`, false);

    if (isWatermarkEnabled) {
        items.push({ message: messages.watermarkingApplied });
    }

    return items;
};

const getSharedLinkAutoExpirationMessages = (controls: Controls): Array<MessageItem> => {
    const items = [];

    if (getProp(controls, `${SHARED_LINK_AUTO_EXPIRATION}`, false)) {
        items.push({ message: messages.sharedLinkAutoExpirationApplied });
    }

    return items;
};

const getExternalCollabMessages = (controls: Controls): Array<MessageItem> => {
    const items = [];
    const accessLevel = getProp(controls, `${EXTERNAL_COLLAB}.accessLevel`);

    switch (accessLevel) {
        case BLOCK:
            items.push({ message: messages.externalCollabBlock });
            break;
        case WHITELIST:
        case BLACKLIST:
            items.push({ message: messages.externalCollabDomainList });
            break;
        default:
            // no-op
            break;
    }
    return items;
};

const getAppDownloadMessages = (
    controls: Controls,
    maxAppCount?: number,
    shouldDisplayAppsAsIntegrations?: boolean,
): Array<MessageItem> => {
    const items = [];
    const accessLevel = getProp(controls, `${APP}.accessLevel`);

    switch (accessLevel) {
        case BLOCK:
            items.push({
                message: shouldDisplayAppsAsIntegrations
                    ? messages.integrationDownloadRestricted
                    : messages.appDownloadRestricted,
            });
            break;
        case WHITELIST:
        case BLACKLIST: {
            const apps = getProp(controls, `${APP}.apps`, []);
            const restrictionsMessageMap = shouldDisplayAppsAsIntegrations
                ? integrationRestrictionsMessageMap
                : appRestrictionsMessageMap;
            const tooltipMessage = shouldDisplayAppsAsIntegrations
                ? messages.allIntegrationNames
                : messages.allAppNames;

            items.push(getAppListMessageItem(apps, maxAppCount, accessLevel, restrictionsMessageMap, tooltipMessage));
            break;
        }
        default:
            // no-op
            break;
    }
    return items;
};

const getAppPreviewMessages = (
    controls: Controls,
    maxAppCount?: number,
    shouldDisplayAppsAsIntegrations?: boolean,
): Array<MessageItem> => {
    const items = [];
    const accessLevel = getProp(controls, `${APP_PREVIEW}.accessLevel`);

    switch (accessLevel) {
        case PREVIEW_BLACKLIST:
        case PREVIEW_WHITELIST: {
            const apps = getProp(controls, `${APP_PREVIEW}.apps`, []);
            const restrictionsMessageMap = shouldDisplayAppsAsIntegrations
                ? integrationPreviewRestrictionsMessageMap
                : appPreviewRestrictionsMessageMap;
            const tooltipMessage = shouldDisplayAppsAsIntegrations
                ? messages.allIntegrationNames
                : messages.allAppNames;

            items.push(getAppListMessageItem(apps, maxAppCount, accessLevel, restrictionsMessageMap, tooltipMessage));
            break;
        }
        default:
            // no-op
            break;
    }
    return items;
};

const getDownloadMessages = (controls: Controls): Array<MessageItem> => {
    const items = [];
    const { web, mobile, desktop } = getProp(controls, DOWNLOAD, {});

    const downloadRestrictions = {
        [WEB]: {
            platform: WEB,
            restrictions: web,
        },
        [MOBILE]: {
            platform: MOBILE,
            restrictions: mobile,
        },
        [DESKTOP]: {
            platform: DESKTOP,
            restrictions: desktop,
        },
    };

    Object.keys(downloadRestrictions).forEach(platformKey => {
        const { platform, restrictions } = downloadRestrictions[platformKey];

        if (!restrictions) {
            return;
        }
        const { restrictExternalUsers, restrictManagedUsers } = restrictions;

        if (restrictManagedUsers && restrictExternalUsers) {
            items.push({ message: downloadRestrictionsMessageMap[platform].externalRestricted[restrictManagedUsers] });
        } else if (restrictManagedUsers) {
            items.push({ message: downloadRestrictionsMessageMap[platform].externalAllowed[restrictManagedUsers] });
        } else if (restrictExternalUsers) {
            items.push({ message: downloadRestrictionsMessageMap[platform].externalRestricted.default });
        }
    });

    return items;
};

const getBoxSignRequestMessages = (controls: Controls): Array<MessageItem> => {
    const isBoxSignRequestRestrictionEnabled = getProp(controls, `${BOX_SIGN_REQUEST}.enabled`, false);
    const items = isBoxSignRequestRestrictionEnabled ? [{ message: messages.boxSignRequestRestricted }] : [];

    return items;
};

const getFullSecurityControlsMessages = (
    controls: Controls,
    maxAppCount?: number,
    shouldDisplayAppsAsIntegrations?: boolean,
): Array<MessageItem> => {
    const items = [
        ...getSharedLinkMessages(controls),
        ...getExternalCollabMessages(controls),
        ...getSharedLinkAutoExpirationMessages(controls),
        ...getDownloadMessages(controls),
        ...getAppDownloadMessages(controls, maxAppCount, shouldDisplayAppsAsIntegrations),
        ...getAppPreviewMessages(controls, maxAppCount, shouldDisplayAppsAsIntegrations),
        ...getWatermarkingMessages(controls),
        ...getBoxSignRequestMessages(controls),
    ];
    return items;
};

export { getShortSecurityControlsMessage, getFullSecurityControlsMessages };
