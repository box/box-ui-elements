declare const mockRecentItems: {
    next_marker: string;
    limit: number;
    order: {
        by: string;
        direction: string;
    };
    entries: {
        type: string;
        interaction_type: string;
        interacted_at: string;
        item: {
            type: string;
            id: string;
            etag: string;
            name: string;
            size: number;
            parent: {
                type: string;
                id: string;
                sequence_id: string;
                etag: string;
                name: string;
            };
            extension: string;
            permissions: {
                can_download: boolean;
                can_preview: boolean;
                can_upload: boolean;
                can_comment: boolean;
                can_rename: boolean;
                can_delete: boolean;
                can_share: boolean;
                can_set_share_access: boolean;
                can_invite_collaborator: boolean;
                can_annotate: boolean;
                can_view_annotations_all: boolean;
                can_view_annotations_self: boolean;
                can_create_annotations: boolean;
                can_view_annotations: boolean;
            };
            path_collection: {
                total_count: number;
                entries: {
                    type: string;
                    id: string;
                    sequence_id: string;
                    etag: string;
                    name: string;
                }[];
            };
            modified_at: string;
            created_at: string;
            modified_by: {
                type: string;
                id: string;
                name: string;
                login: string;
            };
            has_collaborations: boolean;
            is_externally_owned: boolean;
            authenticated_download_url: string;
            is_download_available: boolean;
            representations: {
                entries: {
                    representation: string;
                    properties: {
                        dimensions: string;
                        paged: string;
                        thumb: string;
                    };
                    info: {
                        url: string;
                    };
                    status: {
                        state: string;
                    };
                    content: {
                        url_template: string;
                    };
                }[];
            };
            file_version: {
                type: string;
                id: string;
                sha1: string;
            };
            sha1: string;
            shared_link: {
                url: string;
                download_url: string;
                vanity_url: any;
                vanity_name: any;
                effective_access: string;
                effective_permission: string;
                is_password_enabled: boolean;
                unshared_at: any;
                download_count: number;
                preview_count: number;
                access: string;
                permissions: {
                    can_preview: boolean;
                    can_download: boolean;
                    can_edit: boolean;
                };
            };
            watermark_info: {
                is_watermarked: boolean;
            };
        };
        interaction_shared_link: any;
    }[];
};
export default mockRecentItems;
