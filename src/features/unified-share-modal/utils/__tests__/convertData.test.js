import { API_TO_USM_PERMISSION_LEVEL_MAP, convertItemResponse, convertUserResponse } from '../convertData';
import { TYPE_FILE, TYPE_FOLDER } from '../../../../constants';
import { ALLOWED_ACCESS_LEVELS, ANYONE_IN_COMPANY } from '../../constants';

jest.mock('../../../../utils/file', () => ({
    getTypedFileId: () => 'f_190457309',
    getTypedFolderId: () => 'd_190457309',
}));

describe('convertItemResponse()', () => {
    const TYPED_FILE_ID = 'f_190457309';
    const TYPED_FOLDER_ID = 'd_190457309';
    const ITEM_ID = '190457309';
    const ITEM_NAME = '<3 Box UI Elements <3';
    const ITEM_DESCRIPTION = 'Why we <3 Box UI Elements';
    const ITEM_SHARED_LINK_URL = 'https://cloud.box.com/s/boxuielementsarethebest';
    const ITEM_SHARED_DOWNLOAD_URL = 'https://cloud.box.com/shared/static/boxuielementsarethebest';
    const ITEM_EXTENSION = '.png';

    const ITEM_SHARED_LINK = {
        access: 'company',
        download_count: 0,
        download_url: ITEM_SHARED_DOWNLOAD_URL,
        effective_access: 'company',
        effective_permission: 'can_download',
        is_password_enabled: false,
        permissions: {
            can_preview: true,
            can_download: true,
        },
        preview_count: 0,
        unshared_at: null,
        url: ITEM_SHARED_LINK_URL,
        vanity_name: null,
        vanity_url: null,
    };

    const FULL_PERMISSIONS = {
        can_download: true,
        can_upload: true,
        can_rename: true,
        can_delete: true,
        can_share: true,
        can_invite_collaborator: true,
        can_set_share_access: true,
    };

    const DOWNLOAD_PERMISSIONS = {
        can_download: true,
        can_upload: false,
        can_rename: false,
        can_delete: false,
        can_share: false,
        can_invite_collaborator: false,
        can_set_share_access: false,
    };

    const INVITE_COLLAB_PERMISSIONS = {
        can_download: true,
        can_upload: false,
        can_rename: false,
        can_delete: false,
        can_share: true,
        can_invite_collaborator: true,
        can_set_share_access: false,
    };

    const SET_SHARE_ACCESS_PERMISSIONS = {
        can_download: true,
        can_upload: false,
        can_rename: false,
        can_delete: false,
        can_share: true,
        can_invite_collaborator: true,
        can_set_share_access: true,
    };

    const ALL_SHARED_LINK_FEATURES = {
        vanity_name: true,
        download_url: true,
        password: true,
    };

    const VANITY_NAME_ONLY = {
        vanity_name: true,
        download_url: false,
        password: false,
    };

    const DOWNLOAD_URL_ONLY = {
        vanity_name: false,
        download_url: true,
        password: false,
    };

    const PASSWORD_ONLY = {
        vanity_name: false,
        download_url: false,
        password: true,
    };

    test.each`
        itemType       | extension         | sharedLink          | sharedLinkFeatures          | permissions                     | typedID            | description
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${ALL_SHARED_LINK_FEATURES} | ${FULL_PERMISSIONS}             | ${TYPED_FILE_ID}   | ${'files with no shared link, full permissions, and all shared link features'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${ALL_SHARED_LINK_FEATURES} | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FILE_ID}   | ${'files with no shared link, download permissions, and all shared link features'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${ALL_SHARED_LINK_FEATURES} | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FILE_ID}   | ${'files with no shared link, invite collabs permissions, and all shared link features'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${ALL_SHARED_LINK_FEATURES} | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FILE_ID}   | ${'files with no shared link, set share access permissions, and all shared link features'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${ALL_SHARED_LINK_FEATURES} | ${FULL_PERMISSIONS}             | ${TYPED_FILE_ID}   | ${'files with a shared link, full permissions, and all shared link features'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${ALL_SHARED_LINK_FEATURES} | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FILE_ID}   | ${'files with a shared link, download permissions, and all shared link features'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${ALL_SHARED_LINK_FEATURES} | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FILE_ID}   | ${'files with a shared link, invite collabs permissions, and all shared link features'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${ALL_SHARED_LINK_FEATURES} | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FILE_ID}   | ${'files with a shared link, set share access permissions, and all shared link features'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${VANITY_NAME_ONLY}         | ${FULL_PERMISSIONS}             | ${TYPED_FILE_ID}   | ${'files with no shared link, full permissions, and the vanity URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${VANITY_NAME_ONLY}         | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FILE_ID}   | ${'files with no shared link, download permissions, and the vanity URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${VANITY_NAME_ONLY}         | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FILE_ID}   | ${'files with no shared link, invite collabs permissions, and the vanity URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${VANITY_NAME_ONLY}         | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FILE_ID}   | ${'files with no shared link, set share access permissions, and the vanity URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${VANITY_NAME_ONLY}         | ${FULL_PERMISSIONS}             | ${TYPED_FILE_ID}   | ${'files with a shared link, full permissions, and the vanity URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${VANITY_NAME_ONLY}         | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FILE_ID}   | ${'files with a shared link, download permissions, and the vanity URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${VANITY_NAME_ONLY}         | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FILE_ID}   | ${'files with a shared link, invite collabs permissions, and the vanity URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${VANITY_NAME_ONLY}         | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FILE_ID}   | ${'files with a shared link, set share access permissions, and the vanity URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${DOWNLOAD_URL_ONLY}        | ${FULL_PERMISSIONS}             | ${TYPED_FILE_ID}   | ${'files with no shared link, full permissions, and the download URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${DOWNLOAD_URL_ONLY}        | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FILE_ID}   | ${'files with no shared link, download permissions, and the download URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${DOWNLOAD_URL_ONLY}        | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FILE_ID}   | ${'files with no shared link, invite collabs permissions, and the download URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${DOWNLOAD_URL_ONLY}        | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FILE_ID}   | ${'files with no shared link, set share access permissions, and the download URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${DOWNLOAD_URL_ONLY}        | ${FULL_PERMISSIONS}             | ${TYPED_FILE_ID}   | ${'files with a shared link, full permissions, and the download URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${DOWNLOAD_URL_ONLY}        | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FILE_ID}   | ${'files with a shared link, download permissions, and the download URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${DOWNLOAD_URL_ONLY}        | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FILE_ID}   | ${'files with a shared link, invite collabs permissions, and the download URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${DOWNLOAD_URL_ONLY}        | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FILE_ID}   | ${'files with a shared link, set share access permissions, and the download URL feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${PASSWORD_ONLY}            | ${FULL_PERMISSIONS}             | ${TYPED_FILE_ID}   | ${'files with no shared link, full permissions, and the password feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${PASSWORD_ONLY}            | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FILE_ID}   | ${'files with no shared link, download permissions, and the password feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${PASSWORD_ONLY}            | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FILE_ID}   | ${'files with no shared link, invite collabs permissions, and the password feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${null}             | ${PASSWORD_ONLY}            | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FILE_ID}   | ${'files with no shared link, set share access permissions, and the password feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${PASSWORD_ONLY}            | ${FULL_PERMISSIONS}             | ${TYPED_FILE_ID}   | ${'files with a shared link, full permissions, and the password feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${PASSWORD_ONLY}            | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FILE_ID}   | ${'files with a shared link, download permissions, and the password feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${PASSWORD_ONLY}            | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FILE_ID}   | ${'files with a shared link, invite collabs permissions, and the password feature'}
        ${TYPE_FILE}   | ${ITEM_EXTENSION} | ${ITEM_SHARED_LINK} | ${PASSWORD_ONLY}            | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FILE_ID}   | ${'files with a shared link, set share access permissions, and the password feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${ALL_SHARED_LINK_FEATURES} | ${FULL_PERMISSIONS}             | ${TYPED_FOLDER_ID} | ${'folders with no shared link, full permissions, and all shared link features'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${ALL_SHARED_LINK_FEATURES} | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FOLDER_ID} | ${'folders with no shared link, download permissions, and all shared link features'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${ALL_SHARED_LINK_FEATURES} | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FOLDER_ID} | ${'folders with no shared link, invite collabs permissions, and all shared link features'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${ALL_SHARED_LINK_FEATURES} | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FOLDER_ID} | ${'folders with no shared link, set share access permissions, and all shared link features'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${ALL_SHARED_LINK_FEATURES} | ${FULL_PERMISSIONS}             | ${TYPED_FOLDER_ID} | ${'folders with a shared link, full permissions, and all shared link features'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${ALL_SHARED_LINK_FEATURES} | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FOLDER_ID} | ${'folders with a shared link, download permissions, and all shared link features'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${ALL_SHARED_LINK_FEATURES} | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FOLDER_ID} | ${'folders with a shared link, invite collabs permissions, and all shared link features'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${ALL_SHARED_LINK_FEATURES} | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FOLDER_ID} | ${'folders with a shared link, set share access permissions, and all shared link features'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${VANITY_NAME_ONLY}         | ${FULL_PERMISSIONS}             | ${TYPED_FOLDER_ID} | ${'folders with no shared link, full permissions, and the vanity URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${VANITY_NAME_ONLY}         | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FOLDER_ID} | ${'folders with no shared link, download permissions, and the vanity URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${VANITY_NAME_ONLY}         | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FOLDER_ID} | ${'folders with no shared link, invite collabs permissions, and the vanity URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${VANITY_NAME_ONLY}         | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FOLDER_ID} | ${'folders with no shared link, set share access permissions, and the vanity URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${VANITY_NAME_ONLY}         | ${FULL_PERMISSIONS}             | ${TYPED_FOLDER_ID} | ${'folders with a shared link, full permissions, and the vanity URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${VANITY_NAME_ONLY}         | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FOLDER_ID} | ${'folders with a shared link, download permissions, and the vanity URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${VANITY_NAME_ONLY}         | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FOLDER_ID} | ${'folders with a shared link, invite collabs permissions, and the vanity URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${VANITY_NAME_ONLY}         | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FOLDER_ID} | ${'folders with a shared link, set share access permissions, and the vanity URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${DOWNLOAD_URL_ONLY}        | ${FULL_PERMISSIONS}             | ${TYPED_FOLDER_ID} | ${'folders with no shared link, full permissions, and the download URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${DOWNLOAD_URL_ONLY}        | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FOLDER_ID} | ${'folders with no shared link, download permissions, and the download URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${DOWNLOAD_URL_ONLY}        | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FOLDER_ID} | ${'folders with no shared link, invite collabs permissions, and the download URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${DOWNLOAD_URL_ONLY}        | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FOLDER_ID} | ${'folders with no shared link, set share access permissions, and the download URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${DOWNLOAD_URL_ONLY}        | ${FULL_PERMISSIONS}             | ${TYPED_FOLDER_ID} | ${'folders with a shared link, full permissions, and the download URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${DOWNLOAD_URL_ONLY}        | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FOLDER_ID} | ${'folders with a shared link, download permissions, and the download URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${DOWNLOAD_URL_ONLY}        | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FOLDER_ID} | ${'folders with a shared link, invite collabs permissions, and the download URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${DOWNLOAD_URL_ONLY}        | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FOLDER_ID} | ${'folders with a shared link, set share access permissions, and the download URL feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${PASSWORD_ONLY}            | ${FULL_PERMISSIONS}             | ${TYPED_FOLDER_ID} | ${'folders with no shared link, full permissions, and the password feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${PASSWORD_ONLY}            | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FOLDER_ID} | ${'folders with no shared link, download permissions, and the password feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${PASSWORD_ONLY}            | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FOLDER_ID} | ${'folders with no shared link, invite collabs permissions, and the password feature'}
        ${TYPE_FOLDER} | ${null}           | ${null}             | ${PASSWORD_ONLY}            | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FOLDER_ID} | ${'folders with no shared link, set share access permissions, and the password feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${PASSWORD_ONLY}            | ${FULL_PERMISSIONS}             | ${TYPED_FOLDER_ID} | ${'folders with a shared link, full permissions, and the password feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${PASSWORD_ONLY}            | ${DOWNLOAD_PERMISSIONS}         | ${TYPED_FOLDER_ID} | ${'folders with a shared link, download permissions, and the password feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${PASSWORD_ONLY}            | ${INVITE_COLLAB_PERMISSIONS}    | ${TYPED_FOLDER_ID} | ${'folders with a shared link, invite collabs permissions, and the password feature'}
        ${TYPE_FOLDER} | ${null}           | ${ITEM_SHARED_LINK} | ${PASSWORD_ONLY}            | ${SET_SHARE_ACCESS_PERMISSIONS} | ${TYPED_FOLDER_ID} | ${'folders with a shared link, set share access permissions, and the password feature'}
    `(
        'should convert $description',
        ({ itemType, extension, sharedLink, sharedLinkFeatures, permissions, typedID }) => {
            const responseFromAPI = {
                allowed_invitee_roles: ['editor', 'viewer'],
                description: ITEM_DESCRIPTION,
                etag: '1',
                extension,
                id: ITEM_ID,
                name: ITEM_NAME,
                permissions,
                shared_link: sharedLink,
                shared_link_features: sharedLinkFeatures,
                type: itemType,
            };
            const { can_download, can_invite_collaborator, can_preview, can_set_share_access, can_share } = permissions;

            const { download_url, effective_permission, is_password_enabled, unshared_at, url, vanity_name } = Object(
                sharedLink,
            );

            const {
                download_url: isDirectLinkAvailable,
                password,
                vanity_name: isVanityNameAvailable,
            } = sharedLinkFeatures;

            const convertedResponse = {
                item: {
                    canUserSeeClassification: false,
                    description: ITEM_DESCRIPTION,
                    extension,
                    grantedPermissions: {
                        itemShare: can_share,
                    },
                    hideCollaborators: false,
                    id: ITEM_ID,
                    name: ITEM_NAME,
                    type: itemType,
                    typedID,
                },
                originalItemPermissions: permissions,
                sharedLink: sharedLink
                    ? {
                          accessLevel: ANYONE_IN_COMPANY,
                          allowedAccessLevels: ALLOWED_ACCESS_LEVELS,
                          canChangeAccessLevel: can_set_share_access,
                          canChangeDownload: can_set_share_access && can_download,
                          canChangePassword: can_set_share_access && password,
                          canChangeVanityName: can_set_share_access && isVanityNameAvailable,
                          canInvite: can_invite_collaborator,
                          directLink: download_url,
                          expirationTimestamp: unshared_at,
                          isDirectLinkAvailable,
                          isDownloadAllowed: can_download,
                          isDownloadAvailable: can_download,
                          isDownloadEnabled: can_download,
                          isDownloadSettingAvailable: can_download,
                          isEditAllowed: true,
                          isNewSharedLink: false,
                          isPasswordAvailable: password,
                          isPasswordEnabled: is_password_enabled,
                          isPreviewAllowed: can_preview,
                          permissionLevel: API_TO_USM_PERMISSION_LEVEL_MAP[effective_permission],
                          url,
                          vanityName: vanity_name,
                      }
                    : { canInvite: can_invite_collaborator },
            };

            expect(convertItemResponse(responseFromAPI)).toEqual(convertedResponse);
        },
    );
});

describe('convertUserResponse()', () => {
    const USER_ID = '79035428903';
    const ENTERPRISE_NAME = 'Best Enterprise Ever';
    const ENTERPRISE = {
        name: ENTERPRISE_NAME,
    };
    const HOSTNAME = 'https://cloud.box.com/';
    const SERVER_URL = `${HOSTNAME}/v/`;

    test.each`
        enterprise    | hostname    | enterpriseName     | serverURL     | description
        ${ENTERPRISE} | ${HOSTNAME} | ${ENTERPRISE_NAME} | ${SERVER_URL} | ${'enterprise and hostname exist'}
        ${ENTERPRISE} | ${null}     | ${ENTERPRISE_NAME} | ${''}         | ${'enterprise exists, but not hostname'}
        ${null}       | ${HOSTNAME} | ${''}              | ${SERVER_URL} | ${'hostname exists, but not enterprise'}
        ${null}       | ${null}     | ${''}              | ${''}         | ${'neither enterprise nor hostname exists'}
    `('should convert data when $description', ({ enterprise, hostname, enterpriseName, serverURL }) => {
        const responseFromAPI = {
            enterprise,
            hostname,
            id: USER_ID,
        };

        const convertedResponse = {
            id: USER_ID,
            userEnterpriseData: {
                enterpriseName,
                serverURL,
            },
        };

        expect(convertUserResponse(responseFromAPI)).toEqual(convertedResponse);
    });
});
