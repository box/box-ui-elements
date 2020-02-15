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
    DOWNLOAD: 'download',
    EXTERNAL_COLLAB: 'externalCollab',
    FTP: 'ftp',
    SHARED_LINK: 'sharedLink',
} = {
    SHARED_LINK: 'sharedLink',
    DOWNLOAD: 'download',
    EXTERNAL_COLLAB: 'externalCollab',
    APP: 'app',
    FTP: 'ftp',
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

const CLASSIFICATION_COLOR_1 = 1;
const CLASSIFICATION_COLOR_2 = 2;
const CLASSIFICATION_COLOR_3 = 3;
const CLASSIFICATION_COLOR_4 = 4;
const CLASSIFICATION_COLOR_5 = 5;
const CLASSIFICATION_COLOR_6 = 6;
const CLASSIFICATION_COLOR_7 = 7;
const CLASSIFICATION_COLOR_8 = 8;

export {
    CLASSIFICATION_COLOR_1,
    CLASSIFICATION_COLOR_2,
    CLASSIFICATION_COLOR_3,
    CLASSIFICATION_COLOR_4,
    CLASSIFICATION_COLOR_5,
    CLASSIFICATION_COLOR_6,
    CLASSIFICATION_COLOR_7,
    CLASSIFICATION_COLOR_8,
    ACCESS_POLICY_RESTRICTION,
    DEFAULT_MAX_APP_COUNT,
    DOWNLOAD_CONTROL,
    LIST_ACCESS_LEVEL,
    MANAGED_USERS_ACCESS_LEVEL,
    SECURITY_CONTROLS_FORMAT,
    SHARED_LINK_ACCESS_LEVEL,
};
