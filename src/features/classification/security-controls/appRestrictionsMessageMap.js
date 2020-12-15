// @flow
import messages from './messages';
import { APP_RESTRICTION_MESSAGE_TYPE, LIST_ACCESS_LEVEL } from '../constants';

const { BLACKLIST, WHITELIST } = LIST_ACCESS_LEVEL;
const { DEFAULT, WITH_APP_LIST, WITH_OVERFLOWN_APP_LIST } = APP_RESTRICTION_MESSAGE_TYPE;

const appRestrictionsMessageMap = {
    [BLACKLIST]: {
        [DEFAULT]: messages.appDownloadRestricted,
        [WITH_APP_LIST]: messages.appDownloadBlacklist,
        [WITH_OVERFLOWN_APP_LIST]: messages.appDownloadBlacklistOverflow,
    },
    [WHITELIST]: {
        [DEFAULT]: messages.appDownloadRestricted,
        [WITH_APP_LIST]: messages.appDownloadWhitelist,
        [WITH_OVERFLOWN_APP_LIST]: messages.appDownloadWhitelistOverflow,
    },
};

export default appRestrictionsMessageMap;
