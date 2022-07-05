// @flow
const DEFAULT_MAX_APP_COUNT = 3;

const SECURITY_CONTROLS_FORMAT: {
    FULL: 'full',
    SHORT: 'short',
    SHORT_WITH_BTN: 'shortWithBtn',
} = {
    FULL: 'full',
    SHORT: 'short',
    SHORT_WITH_BTN: 'shortWithBtn',
};

const ACCESS_POLICY_RESTRICTION: {
    APP: 'app',
    BOX_SIGN_REQUEST: 'boxSignRequest',
    DOWNLOAD: 'download',
    EXTERNAL_COLLAB: 'externalCollab',
    FTP: 'ftp',
    SHARED_LINK: 'sharedLink',
    WATERMARK: 'watermark',
} = {
    APP: 'app',
    BOX_SIGN_REQUEST: 'boxSignRequest',
    DOWNLOAD: 'download',
    EXTERNAL_COLLAB: 'externalCollab',
    FTP: 'ftp',
    SHARED_LINK: 'sharedLink',
    WATERMARK: 'watermark',
};

const DOWNLOAD_CONTROL: {
    DESKTOP: 'desktop',
    FTP: 'ftp',
    MOBILE: 'mobile',
    WEB: 'web',
} = {
    DESKTOP: 'desktop',
    FTP: 'ftp',
    MOBILE: 'mobile',
    WEB: 'web',
};

const LIST_ACCESS_LEVEL: {
    BLACKLIST: 'blacklist',
    BLOCK: 'block',
    WHITELIST: 'whitelist',
} = {
    BLACKLIST: 'blacklist',
    BLOCK: 'block',
    WHITELIST: 'whitelist',
};

const MANAGED_USERS_ACCESS_LEVEL: {
    OWNERS_AND_COOWNERS: 'ownersCoOwners',
    OWNERS_COOWNERS_AND_EDITORS: 'ownersCoOwnersEditors',
} = {
    OWNERS_AND_COOWNERS: 'ownersCoOwners',
    OWNERS_COOWNERS_AND_EDITORS: 'ownersCoOwnersEditors',
};

const SHARED_LINK_ACCESS_LEVEL: {
    COLLAB_AND_COMPANY_ONLY: 'companyAndCollabOnly',
    COLLAB_ONLY: 'collabOnly',
    PUBLIC: 'public',
} = {
    COLLAB_AND_COMPANY_ONLY: 'companyAndCollabOnly',
    COLLAB_ONLY: 'collabOnly',
    PUBLIC: 'public',
};

const APP_RESTRICTION_MESSAGE_TYPE = {
    DEFAULT: 'default',
    WITH_APP_LIST: 'withAppList',
    WITH_OVERFLOWN_APP_LIST: 'withOverflownAppList',
};

const CLASSIFICATION_COLOR_ID_0 = 0;
const CLASSIFICATION_COLOR_ID_1 = 1;
const CLASSIFICATION_COLOR_ID_2 = 2;
const CLASSIFICATION_COLOR_ID_3 = 3;
const CLASSIFICATION_COLOR_ID_4 = 4;
const CLASSIFICATION_COLOR_ID_5 = 5;
const CLASSIFICATION_COLOR_ID_6 = 6;
const CLASSIFICATION_COLOR_ID_7 = 7;

const DEFAULT_CLASSIFICATION_COLOR_ID = CLASSIFICATION_COLOR_ID_0;

export {
    ACCESS_POLICY_RESTRICTION,
    APP_RESTRICTION_MESSAGE_TYPE,
    CLASSIFICATION_COLOR_ID_0,
    CLASSIFICATION_COLOR_ID_1,
    CLASSIFICATION_COLOR_ID_2,
    CLASSIFICATION_COLOR_ID_3,
    CLASSIFICATION_COLOR_ID_4,
    CLASSIFICATION_COLOR_ID_5,
    CLASSIFICATION_COLOR_ID_6,
    CLASSIFICATION_COLOR_ID_7,
    DEFAULT_CLASSIFICATION_COLOR_ID,
    DEFAULT_MAX_APP_COUNT,
    DOWNLOAD_CONTROL,
    LIST_ACCESS_LEVEL,
    MANAGED_USERS_ACCESS_LEVEL,
    SECURITY_CONTROLS_FORMAT,
    SHARED_LINK_ACCESS_LEVEL,
};
