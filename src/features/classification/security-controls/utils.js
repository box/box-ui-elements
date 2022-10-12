// @flow
import * as React from 'react';
import getProp from 'lodash/get';
import isNil from 'lodash/isNil';
import { FormattedMessage } from 'react-intl';

import type { Controls, MessageItem } from '../flowTypes';

import Link from '../../../components/link/Link';
import appRestrictionsMessageMap from './appRestrictionsMessageMap';
import downloadRestrictionsMessageMap from './downloadRestrictionsMessageMap';
import messages from './messages';
import {
    ACCESS_POLICY_RESTRICTION,
    APP_RESTRICTION_MESSAGE_TYPE,
    DOWNLOAD_CONTROL,
    LIST_ACCESS_LEVEL,
    SHARED_LINK_ACCESS_LEVEL,
} from '../constants';

const { APP, BOX_SIGN_REQUEST, DOWNLOAD, EXTERNAL_COLLAB, SHARED_LINK, WATERMARK } = ACCESS_POLICY_RESTRICTION;
const { DEFAULT, WITH_APP_LIST, WITH_OVERFLOWN_APP_LIST } = APP_RESTRICTION_MESSAGE_TYPE;
const { DESKTOP, MOBILE, WEB } = DOWNLOAD_CONTROL;
const { BLOCK, WHITELIST, BLACKLIST } = LIST_ACCESS_LEVEL;
const { COLLAB_ONLY, COLLAB_AND_COMPANY_ONLY, PUBLIC } = SHARED_LINK_ACCESS_LEVEL;

const getShortSecurityControlsMessage = (controls: Controls): Array<MessageItem> => {
    const items = [];
    const { app, boxSignRequest, download, externalCollab, sharedLink, watermark } = controls;

    // Shared link and external collab restrictions are grouped
    // together as generic "sharing" restrictions
    const sharing = (sharedLink && sharedLink.accessLevel !== PUBLIC) || externalCollab;

    // 4 restriction combinations
    if (sharing && download && app && boxSignRequest) {
        items.push({ message: messages.shortSharingDownloadAppSign });
    }
    // 3 restriction combinations
    else if (sharing && download && app) {
        items.push({ message: messages.shortSharingDownloadApp });
    } else if (download && app && boxSignRequest) {
        items.push({ message: messages.shortDownloadAppSign });
    } else if (sharing && app && boxSignRequest) {
        items.push({ message: messages.shortSharingAppSign });
    } else if (sharing && download && boxSignRequest) {
        items.push({ message: messages.shortSharingDownloadSign });
    }
    // 2 restriction combinations
    else if (sharing && boxSignRequest) {
        items.push({ message: messages.shortSharingSign });
    } else if (download && boxSignRequest) {
        items.push({ message: messages.shortDownloadSign });
    } else if (app && boxSignRequest) {
        items.push({ message: messages.shortAppSign });
    } else if (sharing && download) {
        items.push({ message: messages.shortSharingDownload });
    } else if (sharing && app) {
        items.push({ message: messages.shortSharingApp });
    } else if (download && app) {
        items.push({ message: messages.shortDownloadApp });
    }
    // 1 restriction combinations
    else if (boxSignRequest) {
        items.push({ message: messages.shortSign });
    } else if (sharing) {
        items.push({ message: messages.shortSharing });
    } else if (download) {
        items.push({ message: messages.shortDownload });
    } else if (app) {
        items.push({ message: messages.shortApp });
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
        const formattedMessages = (
            <>
                <FormattedMessage {...messages.watermarkingApplied} />
                <Link
                    className="support-link"
                    href="https://support.box.com/hc/en-us/articles/360044195253"
                    target="_blank"
                >
                    <FormattedMessage {...messages.linkForMoreDetails} />
                </Link>
            </>
        );
        items.push({ message: formattedMessages });
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

const getAppDownloadMessages = (controls: Controls, maxAppCount?: number): Array<MessageItem> => {
    const items = [];
    const accessLevel = getProp(controls, `${APP}.accessLevel`);

    switch (accessLevel) {
        case BLOCK:
            items.push({ message: messages.appDownloadRestricted });
            break;
        case WHITELIST:
        case BLACKLIST: {
            const apps = getProp(controls, `${APP}.apps`, []);

            maxAppCount = isNil(maxAppCount) ? apps.length : maxAppCount;
            const appsToDisplay = apps.slice(0, maxAppCount);
            const remainingAppCount = apps.slice(maxAppCount).length;
            const appNames = appsToDisplay.map(({ displayText }) => displayText).join(', ');

            if (remainingAppCount) {
                const appsList = apps.map(({ displayText }) => displayText).join(', ');

                items.push({
                    message: {
                        ...appRestrictionsMessageMap[accessLevel][WITH_OVERFLOWN_APP_LIST],
                        values: { appNames, remainingAppCount },
                    },
                    tooltipMessage: {
                        ...messages.allAppNames,
                        values: { appsList },
                    },
                });
            } else {
                // Display list of apps if available, otherwise use generic
                // app restriction copy
                const messageType = apps.length ? WITH_APP_LIST : DEFAULT;

                items.push({
                    message: {
                        ...appRestrictionsMessageMap[accessLevel][messageType],
                        values: { appNames },
                    },
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

const getFullSecurityControlsMessages = (controls: Controls, maxAppCount?: number): Array<MessageItem> => {
    const items = [
        ...getSharedLinkMessages(controls),
        ...getExternalCollabMessages(controls),
        ...getDownloadMessages(controls),
        ...getAppDownloadMessages(controls, maxAppCount),
        ...getWatermarkingMessages(controls),
        ...getBoxSignRequestMessages(controls),
    ];
    return items;
};

export { getShortSecurityControlsMessage, getFullSecurityControlsMessages };
