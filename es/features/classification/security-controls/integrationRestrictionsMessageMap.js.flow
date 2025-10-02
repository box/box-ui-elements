// @flow
import messages from './messages';
import { APP_RESTRICTION_MESSAGE_TYPE, LIST_ACCESS_LEVEL } from '../constants';

const { BLACKLIST, WHITELIST } = LIST_ACCESS_LEVEL;
const { DEFAULT, WITH_APP_LIST, WITH_OVERFLOWN_APP_LIST } = APP_RESTRICTION_MESSAGE_TYPE;

const integrationRestrictionsMessageMap = {
    [BLACKLIST]: {
        [DEFAULT]: messages.integrationDownloadRestricted,
        [WITH_APP_LIST]: messages.integrationDownloadDenylist,
        [WITH_OVERFLOWN_APP_LIST]: messages.integrationDownloadDenylistOverflow,
    },
    [WHITELIST]: {
        [DEFAULT]: messages.integrationDownloadRestricted,
        [WITH_APP_LIST]: messages.integrationDownloadAllowlist,
        [WITH_OVERFLOWN_APP_LIST]: messages.integrationDownloadAllowlistOverflow,
    },
};

export default integrationRestrictionsMessageMap;
