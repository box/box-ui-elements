// @flow
import getProp from 'lodash/get';

import type { MessageDescriptor } from 'react-intl';

import messages from './messages';
import {
    ACCESS_POLICY_RESTRICTIONS,
    LIST_ACCESS_LEVEL_TYPE,
    MANAGED_USERS_COMBINATION,
    MAX_APP_COUNT,
    SHARED_LINK_ACCESS_LEVEL_TYPE,
} from './constants';

const { SHARED_LINK, DOWNLOAD, EXTERNAL_COLLAB, APP } = ACCESS_POLICY_RESTRICTIONS;
const { BLOCK, WHITELIST, BLACKLIST } = LIST_ACCESS_LEVEL_TYPE;
const { OWNERS_AND_COOWNERS, OWNERS_COOWNERS_AND_EDITORS } = MANAGED_USERS_COMBINATION;
const { COLLAB_ONLY, COLLAB_AND_COMPANY_ONLY } = SHARED_LINK_ACCESS_LEVEL_TYPE;

const getShortSecurityControlsMessage = (accessPolicy: Object): ?MessageDescriptor => {
    const { sharedLink, download, externalCollab, app } = accessPolicy;

    if ((sharedLink || externalCollab) && download && app) {
        return messages.shortAllRestrictions;
    }

    if ((sharedLink || externalCollab) && download) {
        return messages.shortSharingDownload;
    }

    if ((sharedLink || externalCollab) && app) {
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
        return messages.shortApplication;
    }

    return null;
};

const getSharedLinkitems = (accessPolicy: Object): Array<MessageDescriptor> => {
    const items = [];
    const accessLevel = getProp(accessPolicy, `${SHARED_LINK}.accessLevel`);

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

const getExternalCollabitems = (accessPolicy: Object): Array<MessageDescriptor> => {
    const items = [];
    const accessLevel = getProp(accessPolicy, `${EXTERNAL_COLLAB}.accessLevel`);

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

const getApplicationDownloaditems = (accessPolicy: Object): Array<MessageDescriptor> => {
    const items = [];
    const accessLevel = getProp(accessPolicy, `${APP}.accessLevel`);

    const apps = getProp(accessPolicy, `${APP}.apps`, []);
    const appsToDisplay = apps.slice(0, MAX_APP_COUNT);
    const remainingAppCount = apps.slice(MAX_APP_COUNT).length;
    const appNames = appsToDisplay.map(({ displayText }) => displayText).join(', ');

    switch (accessLevel) {
        case BLOCK:
            items.push(messages.appDownloadBlock);
            break;
        case WHITELIST:
        case BLACKLIST:
            if (remainingAppCount) {
                items.push({
                    ...messages.appDownloadListOverflow,
                    values: { appNames, remainingAppCount },
                });
            } else {
                items.push({ ...messages.appDownloadList, values: { appNames } });
            }
            break;
        default:
            // no-op
            break;
    }
    return items;
};

const getDownloaditems = (accessPolicy: Object): Array<MessageDescriptor> => {
    const items = [];
    const { desktop, mobile, web } = getProp(accessPolicy, DOWNLOAD, {});

    const map = {
        '0': 'Box Desktop',
        '1': 'Mobile',
        '2': 'Web',
    };

    [desktop, mobile, web].forEach((platform, i) => {
        if (!platform) {
            return;
        }
        const { restrictExternalUsers, restrictManagedUsers } = platform;

        if (restrictManagedUsers && restrictExternalUsers) {
            switch (restrictManagedUsers) {
                case OWNERS_AND_COOWNERS:
                    items.push({ ...messages.downloadExternalOwners, values: { platform: map[i] } });
                    break;
                case OWNERS_COOWNERS_AND_EDITORS:
                    items.push({ ...messages.downloadExternalOwnersEditors, values: { platform: map[i] } });
                    break;
                default:
                    break;
            }
        } else if (restrictManagedUsers) {
            switch (restrictManagedUsers) {
                case OWNERS_AND_COOWNERS:
                    items.push({ ...messages.downloadOwners, values: { platform: map[i] } });
                    break;
                case OWNERS_COOWNERS_AND_EDITORS:
                    items.push({ ...messages.downloadOwnersEditors, values: { platform: map[i] } });
                    break;
                default:
                    break;
            }
        } else if (restrictExternalUsers) {
            items.push(messages.downloadExternal);
        }
    });

    return items;
};

const getFullSecurityControlsMessages = (accessPolicy: Object): Array<MessageDescriptor> => {
    const items = [
        ...getSharedLinkitems(accessPolicy),
        ...getExternalCollabitems(accessPolicy),
        ...getDownloaditems(accessPolicy),
        ...getApplicationDownloaditems(accessPolicy),
    ];
    return items;
};

export { getShortSecurityControlsMessage, getFullSecurityControlsMessages };
