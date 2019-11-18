// @flow
import messages from './messages';
import { DOWNLOAD_CONTROL_TYPE, MANAGED_USERS_COMBINATION } from './constants';

const { DESKTOP, MOBILE, WEB } = DOWNLOAD_CONTROL_TYPE;
const { OWNERS_AND_COOWNERS, OWNERS_COOWNERS_AND_EDITORS } = MANAGED_USERS_COMBINATION;

const downloadRestrictionsMessageMap = {
    [DESKTOP]: {
        externalAllowed: {
            [OWNERS_AND_COOWNERS]: messages.desktopDownloadOwners,
            [OWNERS_COOWNERS_AND_EDITORS]: messages.desktopDownloadOwnersEditors,
        },
        externalRestricted: {
            [OWNERS_AND_COOWNERS]: messages.desktopDownloadExternalOwners,
            [OWNERS_COOWNERS_AND_EDITORS]: messages.desktopDownloadExternalOwnersEditors,
            default: messages.desktopDownloadExternal,
        },
    },
    [MOBILE]: {
        externalAllowed: {
            [OWNERS_AND_COOWNERS]: messages.mobileDownloadOwners,
            [OWNERS_COOWNERS_AND_EDITORS]: messages.mobileDownloadOwnersEditors,
        },
        externalRestricted: {
            [OWNERS_AND_COOWNERS]: messages.mobileDownloadExternalOwners,
            [OWNERS_COOWNERS_AND_EDITORS]: messages.mobileDownloadExternalOwnersEditors,
            default: messages.mobileDownloadExternal,
        },
    },
    [WEB]: {
        externalAllowed: {
            [OWNERS_AND_COOWNERS]: messages.webDownloadOwners,
            [OWNERS_COOWNERS_AND_EDITORS]: messages.webDownloadOwnersEditors,
        },
        externalRestricted: {
            [OWNERS_AND_COOWNERS]: messages.webDownloadExternalOwners,
            [OWNERS_COOWNERS_AND_EDITORS]: messages.webDownloadExternalOwnersEditors,
            default: messages.webDownloadExternal,
        },
    },
};

export default downloadRestrictionsMessageMap;
