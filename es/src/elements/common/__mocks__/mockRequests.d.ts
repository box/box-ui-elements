export declare const mockEventRequest: {
    url: string;
    response: {};
};
export declare const mockUserRequest: {
    url: string;
    response: {
        type: string;
        id: string;
        name: string;
        login: string;
        created_at: string;
        modified_at: string;
        language: string;
        timezone: string;
        space_amount: number;
        space_used: number;
        max_upload_size: number;
        status: string;
        job_title: string;
        phone: string;
        address: string;
        notification_email: any;
    };
};
export declare const mockFileRequest: {
    url: string;
    response: {
        type: string;
        id: string;
        etag: string;
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
        shared_link: any;
        sha1: string;
        file_version: {
            type: string;
            id: string;
            sha1: string;
        };
        name: string;
        size: number;
        extension: string;
        watermark_info: {
            is_watermarked: boolean;
        };
        is_download_available: boolean;
    };
};
