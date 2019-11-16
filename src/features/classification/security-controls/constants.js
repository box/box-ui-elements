// @flow
const ACCESS_POLICY_RESTRICTIONS = {
    SHARED_LINK: 'sharedLink',
    DOWNLOAD: 'download',
    EXTERNAL_COLLAB: 'externalCollab',
    APP: 'app',
    FTP: 'ftp',
};

const DOWNLOAD_CONTROL_TYPE = {
    DESKTOP: 'desktop',
    FTP: 'ftp',
    MOBILE: 'mobile',
    WEB: 'web',
};

const LIST_ACCESS_LEVEL_TYPE = {
    BLOCK: 'block',
    WHITELIST: 'whitelist',
    BLACKLIST: 'blacklist',
};

const MANAGED_USERS_COMBINATION = {
    OWNERS_AND_COOWNERS: 'ownersCoOwners',
    OWNERS_COOWNERS_AND_EDITORS: 'ownersCoOwnersEditors',
};

const MAX_APP_COUNT = 3;

const RESTRICT_USERS_TYPE = {
    RESTRICT_MANAGED_USERS: 'restrictManagedUsers',
    RESTRICT_EXTERNAL_USERS: 'restrictExternalUsers',
};

const SECURITY_CONTROLS_FORMAT = {
    FULL: 'full',
    SHORT: 'short',
    SHORT_WITH_TOOLTIP: 'shortWithTooltip',
};

const SHARED_LINK_ACCESS_LEVEL_TYPE = {
    COLLAB_ONLY: 'collabOnly',
    COLLAB_AND_COMPANY_ONLY: 'companyAndCollabOnly',
    PUBLIC: 'public',
};

export {
    ACCESS_POLICY_RESTRICTIONS,
    DOWNLOAD_CONTROL_TYPE,
    LIST_ACCESS_LEVEL_TYPE,
    MANAGED_USERS_COMBINATION,
    MAX_APP_COUNT,
    RESTRICT_USERS_TYPE,
    SECURITY_CONTROLS_FORMAT,
    SHARED_LINK_ACCESS_LEVEL_TYPE,
};
