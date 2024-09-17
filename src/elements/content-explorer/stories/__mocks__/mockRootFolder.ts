const mockRootFolder = {
    type: 'folder',
    id: '69083462919',
    etag: '2',
    name: 'Preview Test Folder',
    size: 1301485279,
    parent: null,
    permissions: {
        can_download: true,
        can_upload: false,
        can_rename: false,
        can_delete: false,
        can_share: false,
        can_invite_collaborator: false,
        can_set_share_access: false,
    },
    path_collection: {
        total_count: 1,
        entries: [
            {
                type: 'folder',
                id: '0',
                sequence_id: null,
                etag: null,
                name: 'All Files',
            },
        ],
    },
    modified_at: '2024-01-16T09:50:27-08:00',
    created_at: '2019-03-04T11:23:26-08:00',
    modified_by: {
        type: 'user',
        id: '7505500060',
        name: 'Preview',
        login: 'preview@boxdemo.com',
    },
    has_collaborations: true,
    is_externally_owned: false,
    shared_link: null,
    watermark_info: {
        is_watermarked: false,
    },
    item_collection: {
        total_count: 2,
        entries: [
            {
                type: 'folder',
                id: '73426618530',
                etag: '3',
                name: 'An Ordered Folder',
                size: 202621773,
                parent: {
                    type: 'folder',
                    id: '69083462919',
                    sequence_id: '2',
                    etag: '2',
                    name: 'Preview Test Folder',
                },
                permissions: {
                    can_download: true,
                    can_upload: false,
                    can_rename: false,
                    can_delete: false,
                    can_share: false,
                    can_invite_collaborator: false,
                    can_set_share_access: false,
                },
                path_collection: {
                    total_count: 2,
                    entries: [
                        {
                            type: 'folder',
                            id: '0',
                            sequence_id: null,
                            etag: null,
                            name: 'All Files',
                        },
                        {
                            type: 'folder',
                            id: '69083462919',
                            sequence_id: '2',
                            etag: '2',
                            name: 'Preview Test Folder',
                        },
                    ],
                },
                modified_at: '2019-04-16T15:44:44-07:00',
                created_at: '2019-04-16T15:44:14-07:00',
                modified_by: {
                    type: 'user',
                    id: '7503712462',
                    name: 'Preview',
                    login: 'preview@boxdemo.com',
                },
                has_collaborations: true,
                is_externally_owned: false,
                shared_link: null,
                watermark_info: {
                    is_watermarked: false,
                },
            },
            {
                type: 'file',
                id: '416044542013',
                etag: '1',
                name: 'Book Sample.pdf',
                size: 144481,
                parent: {
                    type: 'folder',
                    id: '69083462919',
                    sequence_id: '2',
                    etag: '2',
                    name: 'Preview Test Folder',
                },
                extension: 'pdf',
                permissions: {
                    can_download: true,
                    can_preview: true,
                    can_upload: false,
                    can_comment: true,
                    can_rename: true,
                    can_delete: true,
                    can_share: true,
                    can_set_share_access: false,
                    can_invite_collaborator: false,
                    can_annotate: false,
                    can_view_annotations_all: true,
                    can_view_annotations_self: true,
                    can_create_annotations: true,
                    can_view_annotations: true,
                },
                path_collection: {
                    total_count: 2,
                    entries: [
                        {
                            type: 'folder',
                            id: '0',
                            sequence_id: null,
                            etag: null,
                            name: 'All Files',
                        },
                        {
                            type: 'folder',
                            id: '69083462919',
                            sequence_id: '2',
                            etag: '2',
                            name: 'Preview Test Folder',
                        },
                    ],
                },
                modified_at: '2022-12-07T22:13:30-08:00',
                created_at: '2019-03-05T12:47:51-08:00',
                modified_by: {
                    type: 'user',
                    id: '7503712462',
                    name: 'Preview',
                    login: 'preview@boxdemo.com',
                },
                has_collaborations: true,
                is_externally_owned: false,
                authenticated_download_url: 'https://dl.boxcloud.com/api/2.0/files/416044542013/content',
                is_download_available: true,
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
                                url: 'https://api.box.com/2.0/internal_files/416044542013/versions/439751948413/representations/jpg_1024x1024',
                            },
                            status: {
                                state: 'success',
                            },
                            content: {
                                url_template:
                                    'https://dl.boxcloud.com/api/2.0/internal_files/416044542013/versions/439751948413/representations/jpg_1024x1024/content/{+asset_path}',
                            },
                        },
                    ],
                },
                file_version: {
                    type: 'file_version',
                    id: '439751948413',
                    sha1: '81fa3796742c6d194ddc54e9424f855f78009cf1',
                },
                sha1: '81fa3796742c6d194ddc54e9424f855f78009cf1',
                shared_link: {
                    url: 'https://example.com/share-link',
                    permissions: {
                        can_preview: true,
                        can_download: true,
                        can_edit: false,
                    },
                },
                watermark_info: {
                    is_watermarked: false,
                },
            },
        ],
        offset: 0,
        limit: 50,
        order: [
            {
                by: 'type',
                direction: 'ASC',
            },
            {
                by: 'name',
                direction: 'ASC',
            },
        ],
    },
};

export default mockRootFolder;
