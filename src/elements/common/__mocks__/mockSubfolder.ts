const mockSubfolder = {
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
        name: 'JP',
        login: 'jp@boxdemo.com',
    },
    has_collaborations: true,
    is_externally_owned: false,
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
    item_collection: {
        total_count: 3,
        entries: [
            {
                type: 'file',
                id: '441230776830',
                etag: '1',
                name: 'Audio.mp3',
                size: 2772151,
                parent: {
                    type: 'folder',
                    id: '73426618530',
                    sequence_id: '3',
                    etag: '3',
                    name: 'An Ordered Folder',
                },
                extension: 'mp3',
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
                    can_create_annotations: false,
                    can_view_annotations: false,
                },
                path_collection: {
                    total_count: 3,
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
                        {
                            type: 'folder',
                            id: '73426618530',
                            sequence_id: '3',
                            etag: '3',
                            name: 'An Ordered Folder',
                        },
                    ],
                },
                modified_at: '2022-12-12T19:18:24-08:00',
                created_at: '2019-04-16T15:44:18-07:00',
                modified_by: {
                    type: 'user',
                    id: '7503712462',
                    name: 'JP',
                    login: 'jp@boxdemo.com',
                },
                has_collaborations: true,
                is_externally_owned: false,
                authenticated_download_url: 'https://dl.boxcloud.com/api/2.0/files/441230776830/content',
                is_download_available: true,
                representations: {
                    entries: [],
                },
                file_version: {
                    type: 'file_version',
                    id: '466700608830',
                    sha1: '4822f5ede0fd9f08c31874b850a7ba632f564006',
                },
                sha1: '4822f5ede0fd9f08c31874b850a7ba632f564006',
                shared_link: null,
                watermark_info: {
                    is_watermarked: false,
                },
            },
            {
                type: 'file',
                id: '441230775630',
                etag: '1',
                name: 'Video - Skills.mp4',
                size: 199816197,
                parent: {
                    type: 'folder',
                    id: '73426618530',
                    sequence_id: '3',
                    etag: '3',
                    name: 'An Ordered Folder',
                },
                extension: 'mp4',
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
                    can_create_annotations: false,
                    can_view_annotations: false,
                },
                path_collection: {
                    total_count: 3,
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
                        {
                            type: 'folder',
                            id: '73426618530',
                            sequence_id: '3',
                            etag: '3',
                            name: 'An Ordered Folder',
                        },
                    ],
                },
                modified_at: '2019-04-16T15:44:18-07:00',
                created_at: '2019-04-16T15:44:18-07:00',
                modified_by: {
                    type: 'user',
                    id: '7503712462',
                    name: 'JP',
                    login: 'jp@boxdemo.com',
                },
                has_collaborations: true,
                is_externally_owned: false,
                authenticated_download_url: 'https://dl.boxcloud.com/api/2.0/files/441230775630/content',
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
                                url: 'https://api.box.com/2.0/internal_files/441230775630/versions/466700607630/representations/jpg_1024x1024',
                            },
                            status: {
                                state: 'success',
                            },
                            content: {
                                url_template:
                                    'https://dl.boxcloud.com/api/2.0/internal_files/441230775630/versions/466700607630/representations/jpg_1024x1024/content/{+asset_path}',
                            },
                        },
                    ],
                },
                file_version: {
                    type: 'file_version',
                    id: '466700607630',
                    sha1: '1cdb4f54bef441cb875abec95855bfd19c5f8508',
                },
                sha1: '1cdb4f54bef441cb875abec95855bfd19c5f8508',
                shared_link: null,
                watermark_info: {
                    is_watermarked: false,
                },
            },
            {
                type: 'file',
                id: '441230773230',
                etag: '1',
                name: 'XSS.txt',
                size: 33425,
                parent: {
                    type: 'folder',
                    id: '73426618530',
                    sequence_id: '3',
                    etag: '3',
                    name: 'An Ordered Folder',
                },
                extension: 'txt',
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
                    can_create_annotations: false,
                    can_view_annotations: false,
                },
                path_collection: {
                    total_count: 3,
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
                        {
                            type: 'folder',
                            id: '73426618530',
                            sequence_id: '3',
                            etag: '3',
                            name: 'An Ordered Folder',
                        },
                    ],
                },
                modified_at: '2019-04-16T15:44:17-07:00',
                created_at: '2019-04-16T15:44:17-07:00',
                modified_by: {
                    type: 'user',
                    id: '7503712462',
                    name: 'JP',
                    login: 'jp@boxdemo.com',
                },
                has_collaborations: true,
                is_externally_owned: false,
                authenticated_download_url: 'https://dl.boxcloud.com/api/2.0/files/441230773230/content',
                is_download_available: true,
                representations: {
                    entries: [
                        {
                            representation: 'png',
                            properties: {
                                dimensions: '1024x1024',
                                paged: 'true',
                                thumb: 'false',
                            },
                            info: {
                                url: 'https://api.box.com/2.0/internal_files/441230773230/versions/466700605230/representations/png_paged_1024x1024',
                            },
                            status: {
                                state: 'success',
                            },
                            content: {
                                url_template:
                                    'https://dl.boxcloud.com/api/2.0/internal_files/441230773230/versions/466700605230/representations/png_paged_1024x1024/content/{+asset_path}',
                            },
                            metadata: {
                                pages: 9,
                            },
                        },
                        {
                            representation: 'pdf',
                            properties: {},
                            info: {
                                url: 'https://api.box.com/2.0/internal_files/441230773230/versions/466700605230/representations/pdf',
                            },
                            status: {
                                state: 'success',
                            },
                            content: {
                                url_template:
                                    'https://dl.boxcloud.com/api/2.0/internal_files/441230773230/versions/466700605230/representations/pdf/content/{+asset_path}',
                            },
                        },
                        {
                            representation: 'text',
                            properties: {},
                            info: {
                                url: 'https://api.box.com/2.0/internal_files/441230773230/versions/466700605230/representations/text',
                            },
                            status: {
                                state: 'success',
                            },
                            content: {
                                url_template:
                                    'https://dl.boxcloud.com/api/2.0/internal_files/441230773230/versions/466700605230/representations/text/content/{+asset_path}',
                            },
                        },
                    ],
                },
                file_version: {
                    type: 'file_version',
                    id: '466700605230',
                    sha1: '8358fa238c349cb4ab1741cb41d90b5f43927723',
                },
                sha1: '8358fa238c349cb4ab1741cb41d90b5f43927723',
                shared_link: null,
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

export default mockSubfolder;
