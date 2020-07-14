/**
 * Mocks that represent the internal data formats of the UnifiedShareModal and its child components
 */
const MOCK_SHARED_LINK = {
    accessLevel: 'peopleInThisItem',
    allowedAccessLevels: {
        peopleInThisItem: false,
        peopleInYourCompany: true,
        peopleWithTheLink: false,
    },
    canChangeAccessLevel: true,
    canChangeDownload: true,
    canChangeExpiration: true,
    canChangePassword: true,
    canChangeVanityName: true,
    canInvite: true,
    directLink: '',
    expirationTimestamp: 1596178800000,
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
    permissionLevel: 'canViewDownload',
    url: '',
    vanityName: '',
};

const MOCK_NULL_SHARED_LINK = { canInvite: true };

const MOCK_ITEM_ID = '123456789';

const MOCK_ITEM_PERMISSIONS = {
    can_download: true,
    can_preview: true,
    can_upload: true,
    can_comment: true,
    can_rename: true,
    can_delete: true,
    can_share: true,
    can_set_share_access: true,
    can_invite_collaborator: true,
    can_annotate: true,
    can_view_annotations_all: true,
    can_view_annotations_self: true,
};

const MOCK_ITEM = {
    id: MOCK_ITEM_ID,
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

const MOCK_ITEM_API_RESPONSE_WITHOUT_SHARED_LINK = {
    item: MOCK_ITEM,
    shared_link: null,
    shared_link_features: {},
};

const MOCK_CONVERTED_ITEM_DATA = {
    item: MOCK_ITEM,
    originalItemPermissions: {},
    sharedLink: MOCK_SHARED_LINK,
};

const MOCK_CONVERTED_ITEM_DATA_WITHOUT_SHARED_LINK = {
    item: MOCK_ITEM,
    originalItemPermissions: {},
    sharedLink: MOCK_NULL_SHARED_LINK,
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
    MOCK_ITEM_API_RESPONSE_WITHOUT_SHARED_LINK,
    MOCK_ITEM_ID,
    MOCK_ITEM_PERMISSIONS,
    MOCK_CONVERTED_ITEM_DATA,
    MOCK_CONVERTED_ITEM_DATA_WITHOUT_SHARED_LINK,
    MOCK_CONVERTED_USER_DATA,
    MOCK_NULL_SHARED_LINK,
    MOCK_SHARED_LINK,
    MOCK_SHARED_LINK_DATA_AFTER_NORMALIZATION,
    MOCK_USER_API_RESPONSE,
};
