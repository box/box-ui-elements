/**
 * Mocks that represent the internal data formats of the UnifiedShareModal and its child components
 */

const MOCK_PASSWORD = 'supersecureunbreakablepassword';
const MOCK_TIMESTAMP = 1596203940000;
const MOCK_TIMESTAMP_ISO_STRING = '2020-07-31T13:59:00.000Z';
const MOCK_SERVER_URL = 'https://cloud.box.com/v/';
const MOCK_VANITY_NAME = 'amazinguniquefile';
const MOCK_VANITY_URL = `${MOCK_SERVER_URL}${MOCK_VANITY_NAME}`;

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
    expirationTimestamp: MOCK_TIMESTAMP,
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
    url: MOCK_VANITY_URL,
    vanityName: MOCK_VANITY_NAME,
};

const MOCK_NULL_SHARED_LINK = { canInvite: true, enterpriseName: '', serverURL: MOCK_SERVER_URL };

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

const MOCK_OWNER_EMAIL = 'boxie@box.com';
const MOCK_OWNER_ID = '3510542';
const MOCK_OWNER = {
    type: 'user',
    id: MOCK_OWNER_ID,
    name: 'Boxie',
    login: MOCK_OWNER_EMAIL,
};

const MOCK_ITEM = {
    id: MOCK_ITEM_ID,
    description: '',
    extension: '',
    grantedPermissions: {
        itemShare: true,
    },
    name: '',
    ownerEmail: MOCK_OWNER_EMAIL,
    ownerID: MOCK_OWNER_ID,
    permissions: {},
    typedID: '',
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
        serverURL: MOCK_SERVER_URL,
    },
};

const MOCK_SHARED_LINK_DATA_AFTER_NORMALIZATION = {
    ...MOCK_SHARED_LINK,
    enterpriseName: '',
    serverURL: MOCK_SERVER_URL,
};

const MOCK_ITEM_API_RESPONSE = {
    item: MOCK_ITEM,
    shared_link: MOCK_SHARED_LINK_DATA_AFTER_NORMALIZATION,
    shared_link_features: {},
};

const COLLAB_ITEM = {
    type: 'folder',
    id: '20345908254',
    sequence_id: '1',
    etag: '1',
    name: 'Box UI Elements',
};

const MOCK_COLLAB_IDS = ['123', '456', '789', '1011', '1213'];
const MOCK_USER_IDS = ['1415', '1617', '1819', '2021', '2223'];
const MOCK_COLLAB_IDS_CONVERTED = [123, 456, 789, 1011, 1213];
const MOCK_USER_IDS_CONVERTED = [1415, 1617, 1819, 2021, 2223];

const MOCK_AVATAR_URL_MAP = {
    [MOCK_USER_IDS[0]]: `https://api.box.com/2.0/users/${MOCK_USER_IDS[0]}/avatar?access_token=foo&pic_type=large`,
    [MOCK_USER_IDS[1]]: `https://api.box.com/2.0/users/${MOCK_USER_IDS[1]}/avatar?access_token=foo&pic_type=large`,
    [MOCK_USER_IDS[2]]: `https://api.box.com/2.0/users/${MOCK_USER_IDS[2]}/avatar?access_token=foo&pic_type=large`,
    [MOCK_USER_IDS[3]]: `https://api.box.com/2.0/users/${MOCK_USER_IDS[3]}/avatar?access_token=foo&pic_type=large`,
    [MOCK_USER_IDS[4]]: `https://api.box.com/2.0/users/${MOCK_USER_IDS[4]}/avatar?access_token=foo&pic_type=large`,
};

const MOCK_AVATAR_URL_MAP_FOR_INCOMPLETE_ENTRIES = {
    [MOCK_USER_IDS[3]]: `https://api.box.com/2.0/users/${MOCK_USER_IDS[3]}/avatar?access_token=foo&pic_type=large`,
    [MOCK_USER_IDS[4]]: `https://api.box.com/2.0/users/${MOCK_USER_IDS[4]}/avatar?access_token=foo&pic_type=large`,
};

const MOCK_COLLABS_API_RESPONSE = {
    total_count: 5,
    entries: [
        {
            type: 'collaboration',
            id: MOCK_COLLAB_IDS[0],
            created_by: MOCK_OWNER,
            created_at: '2019-08-07T13:37:32-07:00',
            modified_at: '2019-08-07T13:37:32-07:00',
            expires_at: null,
            status: 'accepted',
            accessible_by: {
                type: 'user',
                id: MOCK_USER_IDS[0],
                name: 'Content Explorer',
                login: 'contentexplorer@box.com',
            },
            invite_email: null,
            role: 'editor',
            acknowledged_at: '2019-08-07T13:37:32-07:00',
            item: COLLAB_ITEM,
        },
        {
            type: 'collaboration',
            id: MOCK_COLLAB_IDS[1],
            created_by: MOCK_OWNER,
            created_at: '2019-08-07T13:37:32-07:00',
            modified_at: '2019-08-07T13:37:32-07:00',
            expires_at: null,
            status: 'accepted',
            accessible_by: {
                type: 'user',
                id: MOCK_USER_IDS[1],
                name: 'Content Preview',
                login: 'contentpreview@box.com',
            },
            invite_email: null,
            role: 'editor',
            acknowledged_at: '2019-08-07T13:37:32-07:00',
            item: COLLAB_ITEM,
        },
        {
            type: 'collaboration',
            id: MOCK_COLLAB_IDS[2],
            created_by: MOCK_OWNER,
            created_at: '2019-11-20T14:33:52-08:00',
            modified_at: '2019-11-20T14:33:52-08:00',
            expires_at: '2020-07-09T14:53:12-08:00',
            status: 'accepted',
            accessible_by: {
                type: 'user',
                id: MOCK_USER_IDS[2],
                name: 'Content Picker',
                login: 'contentpicker@box.com',
            },
            invite_email: null,
            role: 'editor',
            acknowledged_at: '2019-11-20T14:33:52-08:00',
            item: COLLAB_ITEM,
        },
        {
            type: 'collaboration',
            id: MOCK_COLLAB_IDS[3],
            created_by: MOCK_OWNER,
            created_at: '2019-11-20T14:33:52-08:00',
            modified_at: '2019-11-20T14:33:52-08:00',
            expires_at: null,
            status: 'accepted',
            accessible_by: {
                type: 'user',
                id: MOCK_USER_IDS[3],
                name: 'Content Uploader',
                login: 'contentuploader@box.com',
            },
            invite_email: null,
            role: 'editor',
            acknowledged_at: '2019-11-20T14:33:52-08:00',
            item: COLLAB_ITEM,
        },
        {
            type: 'collaboration',
            id: MOCK_COLLAB_IDS[4],
            created_by: MOCK_OWNER,
            created_at: '2019-11-20T14:33:52-08:00',
            modified_at: '2019-11-20T14:33:52-08:00',
            expires_at: null,
            status: 'accepted',
            accessible_by: {
                type: 'user',
                id: MOCK_USER_IDS[4],
                name: 'BoxWorks Demo',
                login: 'demo@boxworks.com',
            },
            invite_email: null,
            role: 'viewer',
            acknowledged_at: '2019-11-20T14:33:52-08:00',
            item: COLLAB_ITEM,
        },
    ],
};

const MOCK_COLLABS_API_RESPONSE_WITH_INCOMPLETE_ENTRIES = {
    total_count: 5,
    entries: [
        {
            type: 'collaboration',
            id: MOCK_COLLAB_IDS[0],
            created_by: MOCK_OWNER,
            created_at: '2019-08-07T13:37:32-07:00',
            modified_at: '2019-08-07T13:37:32-07:00',
            expires_at: null,
            status: 'accepted',
            invite_email: null,
            role: 'editor',
            acknowledged_at: '2019-08-07T13:37:32-07:00',
            item: COLLAB_ITEM,
        },
        {
            type: 'collaboration',
            id: MOCK_COLLAB_IDS[1],
            created_by: MOCK_OWNER,
            created_at: '2019-08-07T13:37:32-07:00',
            modified_at: '2019-08-07T13:37:32-07:00',
            expires_at: null,
            status: 'accepted',
            invite_email: null,
            role: 'editor',
            acknowledged_at: '2019-08-07T13:37:32-07:00',
            item: COLLAB_ITEM,
        },
        null,
        {
            type: 'collaboration',
            id: MOCK_COLLAB_IDS[3],
            created_by: MOCK_OWNER,
            created_at: '2019-11-20T14:33:52-08:00',
            modified_at: '2019-11-20T14:33:52-08:00',
            expires_at: null,
            status: 'accepted',
            accessible_by: {
                type: 'user',
                id: MOCK_USER_IDS[3],
                name: 'Content Uploader',
                login: 'contentuploader@box.com',
            },
            invite_email: null,
            role: 'editor',
            acknowledged_at: '2019-11-20T14:33:52-08:00',
            item: COLLAB_ITEM,
        },
        {
            type: 'collaboration',
            id: MOCK_COLLAB_IDS[4],
            created_by: MOCK_OWNER,
            created_at: '2019-11-20T14:33:52-08:00',
            modified_at: '2019-11-20T14:33:52-08:00',
            expires_at: null,
            status: 'accepted',
            accessible_by: {
                type: 'user',
                id: MOCK_USER_IDS[4],
                name: 'BoxWorks Demo',
                login: 'demo@boxworks.com',
            },
            invite_email: null,
            role: 'viewer',
            acknowledged_at: '2019-11-20T14:33:52-08:00',
            item: COLLAB_ITEM,
        },
    ],
};

const MOCK_COLLABS_CONVERTED_RESPONSE = {
    collaborators: [
        {
            collabID: MOCK_COLLAB_IDS[0],
            email: 'contentexplorer@box.com',
            expiration: null,
            hasCustomAvatar: false,
            imageURL: null,
            isExternalCollab: false,
            name: 'Content Explorer',
            translatedRole: 'Editor',
            type: 'user',
            userID: MOCK_USER_IDS[0],
        },
        {
            collabID: MOCK_COLLAB_IDS[1],
            email: 'contentpreview@box.com',
            expiration: null,
            hasCustomAvatar: false,
            imageURL: null,
            isExternalCollab: false,
            name: 'Content Preview',
            translatedRole: 'Editor',
            type: 'user',
            userID: MOCK_USER_IDS[1],
        },
        {
            collabID: MOCK_COLLAB_IDS[2],
            email: 'contentpicker@box.com',
            expiration: {
                executeAt: '2020-07-09T14:53:12-08:00',
            },
            hasCustomAvatar: false,
            imageURL: null,
            isExternalCollab: false,
            name: 'Content Picker',
            translatedRole: 'Editor',
            type: 'user',
            userID: MOCK_USER_IDS[2],
        },
        {
            collabID: MOCK_COLLAB_IDS[3],
            email: 'contentuploader@box.com',
            expiration: null,
            hasCustomAvatar: false,
            imageURL: null,
            isExternalCollab: false,
            name: 'Content Uploader',
            translatedRole: 'Editor',
            type: 'user',
            userID: MOCK_USER_IDS[3],
        },
        {
            collabID: MOCK_COLLAB_IDS[4],
            email: 'demo@boxworks.com',
            expiration: null,
            hasCustomAvatar: false,
            imageURL: null,
            isExternalCollab: true,
            name: 'BoxWorks Demo',
            translatedRole: 'Viewer',
            type: 'user',
            userID: MOCK_USER_IDS[4],
        },
    ],
};

const MOCK_CONTACTS_API_RESPONSE = {
    total_count: 3,
    entries: [
        {
            type: 'user',
            id: MOCK_USER_IDS[0],
            name: 'Content Open With',
            login: 'contentopenwith@box.com',
            created_at: '2019-01-14T15:15:58-08:00',
            modified_at: '2019-01-14T15:15:59-08:00',
            language: 'en',
            timezone: 'America/Los_Angeles',
            space_amount: 10737418240,
            space_used: 0,
            max_upload_size: 5368709120,
            status: 'active',
            job_title: '',
            phone: '',
            address: '',
            avatar_url: '',
            notification_email: [],
        },
        {
            type: 'user',
            id: MOCK_OWNER_ID,
            name: 'Content Sharing',
            login: 'contentsharing@box.com',
            created_at: '2018-12-13T17:50:14-08:00',
            modified_at: '2020-06-10T08:12:43-07:00',
            language: 'en',
            timezone: 'America/Los_Angeles',
            space_amount: 10737418240,
            space_used: 323695,
            max_upload_size: 5368709120,
            status: 'active',
            job_title: '',
            phone: '',
            address: '',
            avatar_url: '',
            notification_email: [],
        },
        {
            type: 'user',
            id: MOCK_USER_IDS[1],
            name: 'Content Preview',
            login: 'contentpreview@boxdevedition.com',
            created_at: '2018-07-11T11:28:13-07:00',
            modified_at: '2020-07-15T08:36:52-07:00',
            language: 'en',
            timezone: 'America/Los_Angeles',
            space_amount: 999999999999999,
            space_used: 20464672,
            max_upload_size: 5368709120,
            status: 'active',
            job_title: '',
            phone: '',
            address: '',
            avatar_url: '',
            notification_email: [],
        },
        {
            type: 'user',
            id: MOCK_USER_IDS[2],
            name: 'Content Sidebar',
            login: 'contentsidebar@box.com',
            created_at: '2018-07-11T11:28:13-07:00',
            modified_at: '2020-07-15T08:36:52-07:00',
            language: 'en',
            timezone: 'America/Los_Angeles',
            space_amount: 999999999999999,
            space_used: 20464672,
            max_upload_size: 5368709120,
            status: 'active',
            job_title: '',
            phone: '',
            address: '',
            avatar_url: '',
            notification_email: [],
        },
        {
            type: 'user',
            id: MOCK_USER_IDS[3],
            name: 'Content Explorer',
            login: 'contentexplorer@boxdevedition.com',
            created_at: '2018-07-11T11:28:13-07:00',
            modified_at: '2020-07-15T08:36:52-07:00',
            language: 'en',
            timezone: 'America/Los_Angeles',
            space_amount: 999999999999999,
            space_used: 20464672,
            max_upload_size: 5368709120,
            status: 'active',
            job_title: '',
            phone: '',
            address: '',
            avatar_url: '',
            notification_email: [],
        },
    ],
    limit: 25,
    offset: 0,
};

const MOCK_CONTACTS_CONVERTED_RESPONSE = [
    {
        id: MOCK_USER_IDS[0],
        email: 'contentopenwith@box.com',
        name: 'Content Open With',
        type: 'user',
    },
    {
        id: MOCK_USER_IDS[2],
        email: 'contentsidebar@box.com',
        name: 'Content Sidebar',
        type: 'user',
    },
];

const MOCK_GROUP_CONTACTS_API_RESPONSE = {
    total_count: 3,
    entries: [
        {
            type: 'group',
            id: '234524525',
            name: 'hedgehogs',
            permissions: {
                can_invite_as_collaborator: false,
            },
        },
        {
            type: 'group',
            id: '689796890',
            name: 'armadillos',
            permissions: {
                can_invite_as_collaborator: true,
            },
        },
        {
            type: 'group',
            id: '980753514',
            name: 'narwhals',
            permissions: {
                can_invite_as_collaborator: false,
            },
        },
    ],
    limit: 100,
    offset: 0,
};

const MOCK_GROUP_CONTACTS_CONVERTED_RESPONSE = [
    {
        type: 'group',
        id: '689796890',
        name: 'armadillos',
    },
];

const MOCK_SETTINGS_WITH_ALL_FEATURES = {
    expirationTimestamp: MOCK_TIMESTAMP,
    isDownloadEnabled: true,
    isExpirationEnabled: true,
    isPasswordEnabled: true,
    password: MOCK_PASSWORD,
    vanityName: MOCK_VANITY_NAME,
};

const MOCK_SETTINGS_WITHOUT_DOWNLOAD = {
    expirationTimestamp: MOCK_TIMESTAMP,
    isDownloadEnabled: false,
    isExpirationEnabled: true,
    isPasswordEnabled: true,
    password: MOCK_PASSWORD,
    vanityName: MOCK_VANITY_NAME,
};

const MOCK_SETTINGS_WITHOUT_EXPIRATION = {
    expirationTimestamp: null,
    isDownloadEnabled: true,
    isExpirationEnabled: false,
    isPasswordEnabled: true,
    password: MOCK_PASSWORD,
    vanityName: MOCK_VANITY_NAME,
};

const MOCK_SETTINGS_WITHOUT_PASSWORD = {
    expirationTimestamp: MOCK_TIMESTAMP,
    isDownloadEnabled: true,
    isExpirationEnabled: true,
    isPasswordEnabled: false,
    password: null,
    vanityName: MOCK_VANITY_NAME,
};

const MOCK_SETTINGS_WITHOUT_VANITY_URL = {
    expirationTimestamp: MOCK_TIMESTAMP,
    isDownloadEnabled: true,
    isExpirationEnabled: true,
    isPasswordEnabled: true,
    password: MOCK_PASSWORD,
    vanityName: null,
};

const MOCK_SETTINGS_DOWNLOAD_PERMISSIONS = { can_download: true, can_preview: false };
const MOCK_SETTINGS_PREVIEW_PERMISSIONS = { can_download: false, can_preview: true };

const MOCK_CONVERTED_SETTINGS = {
    permissions: MOCK_SETTINGS_DOWNLOAD_PERMISSIONS,
    unshared_at: MOCK_TIMESTAMP_ISO_STRING,
    vanity_url: MOCK_VANITY_URL,
    password: MOCK_PASSWORD,
};

const MOCK_EMAIL_STRING = 'narwhal@box.com,armadillo@box.com,hedgehog@box.com,turtle@box.com';
const MOCK_GROUPID_STRING = '12345,67891,01112,13141';
const MOCK_EMAIL_ARRAY = MOCK_EMAIL_STRING.split(',');
const MOCK_GROUPID_ARRAY = MOCK_GROUPID_STRING.split(',');

const MOCK_COLLABS_REQUEST_USERS_ONLY = {
    emails: MOCK_EMAIL_STRING,
    groupIDs: '',
    permission: 'Editor',
};

const MOCK_COLLABS_REQUEST_GROUPS_ONLY = {
    emails: '',
    groupIDs: MOCK_GROUPID_STRING,
    permission: 'Editor',
};

const MOCK_COLLABS_REQUEST_USERS_AND_GROUPS = {
    emails: MOCK_EMAIL_STRING,
    groupIDs: MOCK_GROUPID_STRING,
    permission: 'Editor',
};

const MOCK_COLLABS_CONVERTED_USERS = [
    {
        accessible_by: {
            login: 'narwhal@box.com',
            type: 'user',
        },
        role: 'editor',
    },
    {
        accessible_by: {
            login: 'armadillo@box.com',
            type: 'user',
        },
        role: 'editor',
    },
    {
        accessible_by: {
            login: 'hedgehog@box.com',
            type: 'user',
        },
        role: 'editor',
    },
    {
        accessible_by: {
            login: 'turtle@box.com',
            type: 'user',
        },
        role: 'editor',
    },
];

const MOCK_COLLABS_CONVERTED_GROUPS = [
    {
        accessible_by: {
            id: '12345',
            type: 'group',
        },
        role: 'editor',
    },
    {
        accessible_by: {
            id: '67891',
            type: 'group',
        },
        role: 'editor',
    },
    {
        accessible_by: {
            id: '01112',
            type: 'group',
        },
        role: 'editor',
    },
    {
        accessible_by: {
            id: '13141',
            type: 'group',
        },
        role: 'editor',
    },
];

const MOCK_COLLABS_CONVERTED_REQUEST = {
    groups: MOCK_COLLABS_CONVERTED_GROUPS,
    users: MOCK_COLLABS_CONVERTED_USERS,
};

const MOCK_DISABLED_REASONS = {
    peopleWithTheLink: null,
    peopleInYourCompany: null,
    peopleInThisItem: null,
};

export {
    MOCK_AVATAR_URL_MAP,
    MOCK_AVATAR_URL_MAP_FOR_INCOMPLETE_ENTRIES,
    MOCK_COLLAB_IDS,
    MOCK_COLLAB_IDS_CONVERTED,
    MOCK_COLLABS_API_RESPONSE,
    MOCK_COLLABS_API_RESPONSE_WITH_INCOMPLETE_ENTRIES,
    MOCK_COLLABS_CONVERTED_GROUPS,
    MOCK_COLLABS_CONVERTED_RESPONSE,
    MOCK_COLLABS_CONVERTED_REQUEST,
    MOCK_COLLABS_CONVERTED_USERS,
    MOCK_COLLABS_REQUEST_GROUPS_ONLY,
    MOCK_COLLABS_REQUEST_USERS_ONLY,
    MOCK_COLLABS_REQUEST_USERS_AND_GROUPS,
    MOCK_CONTACTS_API_RESPONSE,
    MOCK_CONTACTS_CONVERTED_RESPONSE,
    MOCK_CONVERTED_ITEM_DATA,
    MOCK_CONVERTED_ITEM_DATA_WITHOUT_SHARED_LINK,
    MOCK_CONVERTED_SETTINGS,
    MOCK_CONVERTED_USER_DATA,
    MOCK_DISABLED_REASONS,
    MOCK_EMAIL_ARRAY,
    MOCK_GROUP_CONTACTS_API_RESPONSE,
    MOCK_GROUP_CONTACTS_CONVERTED_RESPONSE,
    MOCK_GROUPID_ARRAY,
    MOCK_ITEM,
    MOCK_ITEM_API_RESPONSE,
    MOCK_ITEM_API_RESPONSE_WITHOUT_SHARED_LINK,
    MOCK_ITEM_ID,
    MOCK_ITEM_PERMISSIONS,
    MOCK_NULL_SHARED_LINK,
    MOCK_OWNER,
    MOCK_OWNER_EMAIL,
    MOCK_OWNER_ID,
    MOCK_PASSWORD,
    MOCK_SERVER_URL,
    MOCK_SETTINGS_WITH_ALL_FEATURES,
    MOCK_SETTINGS_DOWNLOAD_PERMISSIONS,
    MOCK_SETTINGS_PREVIEW_PERMISSIONS,
    MOCK_SETTINGS_WITHOUT_DOWNLOAD,
    MOCK_SETTINGS_WITHOUT_EXPIRATION,
    MOCK_SETTINGS_WITHOUT_PASSWORD,
    MOCK_SETTINGS_WITHOUT_VANITY_URL,
    MOCK_SHARED_LINK,
    MOCK_SHARED_LINK_DATA_AFTER_NORMALIZATION,
    MOCK_TIMESTAMP,
    MOCK_TIMESTAMP_ISO_STRING,
    MOCK_USER_API_RESPONSE,
    MOCK_USER_IDS,
    MOCK_USER_IDS_CONVERTED,
    MOCK_VANITY_NAME,
    MOCK_VANITY_URL,
};
