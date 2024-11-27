import { DEFAULT_HOSTNAME_API } from '../../../../constants';

const apiV2Path = `${DEFAULT_HOSTNAME_API}/2.0`;

export const mockFileRequest = {
    url: `${apiV2Path}/files/${global.FILE_ID}?fields=is_externally_owned,permissions`,
    response: {
        type: 'file',
        id: global.FILE_ID,
        etag: '3',
        is_externally_owned: false,
        extension: 'pdf',
        permissions: {
            can_download: true,
            can_preview: true,
            can_upload: true,
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
    },
};
