// @flow
import getProp from 'lodash/get';
import isNil from 'lodash/isNil';

import type { MessageDescriptor } from 'react-intl';
import type { Controls } from './flowTypes';

import downloadRestrictionsMessageMap from './downloadRestrictionsMessageMap';
import messages from './messages';
import { ACCESS_POLICY_RESTRICTION, DOWNLOAD_CONTROL, LIST_ACCESS_LEVEL, SHARED_LINK_ACCESS_LEVEL } from './constants';

const { SHARED_LINK, DOWNLOAD, EXTERNAL_COLLAB, APP } = ACCESS_POLICY_RESTRICTION;
const { DESKTOP, MOBILE, WEB } = DOWNLOAD_CONTROL;
const { BLOCK, WHITELIST, BLACKLIST } = LIST_ACCESS_LEVEL;
const { COLLAB_ONLY, COLLAB_AND_COMPANY_ONLY } = SHARED_LINK_ACCESS_LEVEL;

const getShortSecurityControlsMessage = (controls: Controls): ?MessageDescriptor => {
    const { sharedLink, download, externalCollab, app } = controls;
    const sharing = sharedLink || externalCollab;
    // Shared link and external collab restrictions are grouped
    // together as generic "sharing" restrictions
    if (sharing && download && app) {
        return messages.shortAllRestrictions;
    }

    if (sharing && download) {
        return messages.shortSharingDownload;
    }

    if (sharing && app) {
        return messages.shortSharingApp;
    }

    if (download && app) {
        return messages.shortDownloadApp;
    }

    if (sharedLink || externalCollab) {
        return messages.shortSharing;
    }

    if (download) {
        return messages.shortDownload;
    }

    if (app) {
        return messages.shortApp;
    }

    return null;
};

const getSharedLinkMessages = (controls: Controls): Array<MessageDescriptor> => {
    const items = [];
    const accessLevel = getProp(controls, `${SHARED_LINK}.accessLevel`);

    switch (accessLevel) {
        case COLLAB_ONLY:
            items.push(messages.sharingCollabOnly);
            break;
        case COLLAB_AND_COMPANY_ONLY:
            items.push(messages.sharingCollabAndCompanyOnly);
            break;
        default:
            // no-op
            break;
    }
    return items;
};

const getExternalCollabMessages = (controls: Controls): Array<MessageDescriptor> => {
    const items = [];
    const accessLevel = getProp(controls, `${EXTERNAL_COLLAB}.accessLevel`);

    switch (accessLevel) {
        case BLOCK:
            items.push(messages.externalCollabBlock);
            break;
        case WHITELIST:
        case BLACKLIST:
            items.push(messages.externalCollabDomainList);
            break;
        default:
            // no-op
            break;
    }
    return items;
};

const getAppDownloadMessages = (controls: Controls, maxAppCount?: number): Array<MessageDescriptor> => {
    const items = [];
    const accessLevel = getProp(controls, `${APP}.accessLevel`);

    switch (accessLevel) {
        case BLOCK:
            items.push(messages.appDownloadBlock);
            break;
        case WHITELIST:
        case BLACKLIST: {
            const apps = getProp(controls, `${APP}.apps`, []);

            maxAppCount = isNil(maxAppCount) ? apps.length : maxAppCount;
            const appsToDisplay = apps.slice(0, maxAppCount);
            const remainingAppCount = apps.slice(maxAppCount).length;
            const appNames = appsToDisplay.map(({ displayText }) => displayText).join(', ');

            if (remainingAppCount) {
                items.push({
                    ...messages.appDownloadListOverflow,
                    values: { appNames, remainingAppCount },
                });
            } else {
                items.push({ ...messages.appDownloadList, values: { appNames } });
            }
            break;
        }
        default:
            // no-op
            break;
    }
    return items;
};

const getDownloadMessages = (controls: Controls): Array<MessageDescriptor> => {
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
            items.push(downloadRestrictionsMessageMap[platform].externalRestricted[restrictManagedUsers]);
        } else if (restrictManagedUsers) {
            items.push(downloadRestrictionsMessageMap[platform].externalAllowed[restrictManagedUsers]);
        } else if (restrictExternalUsers) {
            items.push(downloadRestrictionsMessageMap[platform].externalRestricted.default);
        }
    });

    return items;
};

const getFullSecurityControlsMessages = (controls: Controls, maxAppCount?: number): Array<MessageDescriptor> => {
    const items = [
        ...getSharedLinkMessages(controls),
        ...getExternalCollabMessages(controls),
        ...getDownloadMessages(controls),
        ...getAppDownloadMessages(controls, maxAppCount),
    ];
    return items;
};

export { getShortSecurityControlsMessage, getFullSecurityControlsMessages };
