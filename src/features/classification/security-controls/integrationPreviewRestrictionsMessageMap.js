// @flow
import messages from './messages';
import { APP_RESTRICTION_MESSAGE_TYPE, PREVIEW_ACCESS_LEVEL } from '../constants';

const { BLACKLIST, WHITELIST } = PREVIEW_ACCESS_LEVEL;
const { DEFAULT, WITH_APP_LIST, WITH_OVERFLOWN_APP_LIST } = APP_RESTRICTION_MESSAGE_TYPE;

const integrationPreviewRestrictionsMessageMap = {
    [BLACKLIST]: {
        [DEFAULT]: messages.integrationPreviewRestricted,
        [WITH_APP_LIST]: messages.integrationPreviewDenylist,
        [WITH_OVERFLOWN_APP_LIST]: messages.integrationPreviewDenylistOverflow,
    },
    [WHITELIST]: {
        [DEFAULT]: messages.integrationPreviewAllowlistDefault,
        [WITH_APP_LIST]: messages.integrationPreviewAllowlist,
        [WITH_OVERFLOWN_APP_LIST]: messages.integrationPreviewAllowlistOverflow,
    },
};

export default integrationPreviewRestrictionsMessageMap;
