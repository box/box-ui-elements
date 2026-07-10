// @flow
import messages from './messages';
import { APP_RESTRICTION_MESSAGE_TYPE, PREVIEW_ACCESS_LEVEL } from '../constants';

const { BLACKLIST, WHITELIST } = PREVIEW_ACCESS_LEVEL;
const { DEFAULT, WITH_APP_LIST, WITH_OVERFLOWN_APP_LIST } = APP_RESTRICTION_MESSAGE_TYPE;

const appPreviewRestrictionsMessageMap = {
    [BLACKLIST]: {
        [DEFAULT]: messages.appPreviewRestricted,
        [WITH_APP_LIST]: messages.appPreviewBlacklist,
        [WITH_OVERFLOWN_APP_LIST]: messages.appPreviewBlacklistOverflow,
    },
    [WHITELIST]: {
        [DEFAULT]: messages.appPreviewWhitelistDefault,
        [WITH_APP_LIST]: messages.appPreviewWhitelist,
        [WITH_OVERFLOWN_APP_LIST]: messages.appPreviewWhitelistOverflow,
    },
};

export default appPreviewRestrictionsMessageMap;
