import { DEFAULT_HOSTNAME_API } from '../../../constants';

const apiV2Path = `${DEFAULT_HOSTNAME_API}/2.0`;

export const mockEventRequest = {
    url: `${apiV2Path}/events`,
    response: {},
};

export const mockUserRequest = {
    url: `${apiV2Path}/users/me`,
    response: {
        type: 'user',
        id: '7504104663',
        name: 'PreviewTestApp',
        login: 'AutomationUser_759881_KEmZdXHHrF@boxdevedition.com',
        created_at: '2019-03-04T11:04:35-08:00',
        modified_at: '2024-09-10T21:44:30-07:00',
        language: 'en',
        timezone: 'America/Los_Angeles',
        space_amount: 10737418240,
        space_used: 23802100,
        max_upload_size: 53687091200,
        status: 'active',
        job_title: '',
        phone: '',
        address: '',
        notification_email: null,
    },
};

export const mockFileRequest = {
    url: `${apiV2Path}/files/${global.FILE_ID}`,
    response: {
        type: 'file',
        id: '415542803939',
        etag: '3',
        permissions: {
            can_download: true,
            can_preview: true,
            can_upload: false,
            can_comment: true,
            can_rename: false,
            can_delete: false,
            can_share: false,
            can_set_share_access: false,
            can_invite_collaborator: false,
            can_annotate: false,
            can_view_annotations_all: true,
            can_view_annotations_self: true,
            can_create_annotations: true,
            can_view_annotations: true,
        },
        shared_link: null,
        sha1: '9650d7a6213181771fd38e761e2c2a330848a5fc',
        file_version: {
            type: 'file_version',
            id: '780895440222',
            sha1: '9650d7a6213181771fd38e761e2c2a330848a5fc',
        },
        name: 'Document (PDF).pdf',
        size: 792687,
        extension: 'pdf',
        watermark_info: {
            is_watermarked: false,
        },
        is_download_available: true,
    },
};
