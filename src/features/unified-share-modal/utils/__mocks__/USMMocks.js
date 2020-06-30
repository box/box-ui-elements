/**
 * Mocks that represent the internal data formats of the UnifiedShareModal and its child components
 */
const MOCK_SHARED_LINK = {
    accessLevel: 'company',
    allowedAccessLevels: {
        peopleInThisItem: false,
        peopleInYourCompany: true,
        peopleWithTheLink: false,
    },
    canChangeAccessLevel: true,
    canChangeDownload: true,
    canChangePassword: true,
    canChangeVanityName: true,
    canInvite: true,
    directLink: '',
    expirationTimestamp: '',
    isDirectLinkAvailable: true,
    isDownloadAllowed: true,
    isDownloadAvailable: true,
    isDownloadEnabled: true,
    isDownloadSettingAvailable: true,
    isEditAllowed: true,
    isNewSharedLink: false,
    isPasswordAvailable: true,
    isPasswordEnabled: true,
    isPreviewAllowed: true,
    permissionLevel: 'peopleInYourCompany',
    url: '',
    vanityName: true,
};
const MOCK_ITEM = {
    id: '',
    description: '',
    extension: '',
    grantedPermissions: {
        itemShare: true,
    },
    name: '',
    permissions: {},
    typedID: '',
};

const MOCK_ITEM_API_RESPONSE = {
    item: MOCK_ITEM,
    shared_link: MOCK_SHARED_LINK,
    shared_link_features: {},
};

const MOCK_CONVERTED_ITEM_DATA = {
    item: MOCK_ITEM,
    sharedLink: MOCK_SHARED_LINK,
};

const MOCK_USER_API_RESPONSE = {
    enterprise: '',
    hostname: '',
    id: 'abcde',
};

const MOCK_CONVERTED_USER_DATA = {
    id: 'abcde',
    userEnterpriseData: {
        enterpriseName: '',
        serverURL: '',
    },
};

const MOCK_SHARED_LINK_DATA_AFTER_NORMALIZATION = {
    ...MOCK_SHARED_LINK,
    enterpriseName: '',
    serverURL: '',
};

export {
    MOCK_ITEM,
    MOCK_ITEM_API_RESPONSE,
    MOCK_CONVERTED_ITEM_DATA,
    MOCK_CONVERTED_USER_DATA,
    MOCK_SHARED_LINK,
    MOCK_SHARED_LINK_DATA_AFTER_NORMALIZATION,
    MOCK_USER_API_RESPONSE,
};
