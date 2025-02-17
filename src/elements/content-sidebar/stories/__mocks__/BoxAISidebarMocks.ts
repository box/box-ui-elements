import { DEFAULT_HOSTNAME_API } from '../../../../constants';

const apiV2Path = `${DEFAULT_HOSTNAME_API}/2.0`;

export const mockImageRequest = {
    url: `${apiV2Path}/files/${global.FILE_ID}`,
    response: {
        type: 'file',
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
        name: 'image.png',
        extension: 'png',
        watermark_info: {
            is_watermarked: false,
        },
        is_download_available: true,
    },
};
