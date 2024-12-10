import { DEFAULT_HOSTNAME_API } from '../../constants';

const apiV2Path = `${DEFAULT_HOSTNAME_API}/2.0`;

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
        avatar_url: 'https://previewteam.app.box.com/api/avatar/large/7504104663',
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
        representations: {
            entries: [
                {
                    representation: 'jpg',
                    properties: {
                        dimensions: '1024x1024',
                        paged: 'false',
                        thumb: 'false',
                    },
                    info: {
                        url: 'https://api.box.com/2.0/internal_files/415542803939/versions/780895440222/representations/jpg_1024x1024',
                    },
                    status: {
                        state: 'success',
                    },
                    content: {
                        url_template:
                            'https://dl.boxcloud.com/api/2.0/internal_files/415542803939/versions/780895440222/representations/jpg_1024x1024/content/{+asset_path}',
                    },
                },
                {
                    representation: 'png',
                    properties: {
                        dimensions: '2048x2048',
                        paged: 'true',
                        thumb: 'false',
                    },
                    info: {
                        url: 'https://api.box.com/2.0/internal_files/415542803939/versions/780895440222/representations/png_paged_2048x2048',
                    },
                    status: {
                        state: 'success',
                    },
                    content: {
                        url_template:
                            'https://dl.boxcloud.com/api/2.0/internal_files/415542803939/versions/780895440222/representations/png_paged_2048x2048/content/{+asset_path}',
                    },
                    metadata: {
                        pages: 2,
                    },
                },
            ],
        },
        watermark_info: {
            is_watermarked: false,
        },
        authenticated_download_url: 'https://dl.boxcloud.com/api/2.0/files/415542803939/content',
        is_download_available: true,
    },
};
