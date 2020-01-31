// @flow
import messages from './messages';
import { LIST_ACCESS_LEVEL } from '../constants';

const { BLACKLIST, WHITELIST } = LIST_ACCESS_LEVEL;

const appRestrictionsMessageMap = {
    [BLACKLIST]: {
        default: messages.appDownloadBlacklist,
        overflow: messages.appDownloadBlacklistOverflow,
    },
    [WHITELIST]: {
        default: messages.appDownloadWhitelist,
        overflow: messages.appDownloadWhitelistOverflow,
    },
};

export default appRestrictionsMessageMap;
