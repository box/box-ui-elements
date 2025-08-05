const mockAncestorFolder = {
    type: 'folder',
    id: '313259567207',
    etag: '1',
    name: 'Test Folder',
    size: 1024000,
    parent: {
        type: 'folder',
        id: '0',
        sequence_id: null,
        etag: null,
        name: 'All Files',
    },
    permissions: {
        can_download: true,
        can_upload: true,
        can_rename: true,
        can_delete: true,
        can_share: true,
        can_invite_collaborator: true,
        can_set_share_access: true,
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
    modified_at: '2024-01-01T00:00:00-08:00',
    created_at: '2024-01-01T00:00:00-08:00',
    modified_by: {
        type: 'user',
        id: '123456789',
        name: 'Test User',
        login: 'test@example.com',
    },
    created_by: {
        type: 'user',
        id: '123456789',
        name: 'Test User',
        login: 'test@example.com',
    },
    has_collaborations: false,
    is_externally_owned: false,
    shared_link: null,
    watermark_info: {
        is_watermarked: false,
    },
};

export default mockAncestorFolder;
